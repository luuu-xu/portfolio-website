---
title: Designing Data-Intensive Applications - 2. Distributed Data
publishedAt: 2024.01.18
---

![Book Cover](/blogImages/designing-data-intensive-applications-2/book-cover.jpg)

Finishing [first part of the book](designing-data-intensive-applications-1), we move up from single machine to distributed machines, the benefits of distributed storage are: **Scalability**, **Fault Tolerance** and **Latency**.

We can scale up with **vertical scaling** which simply adds more CPUs, RAMs and disks, but it has many disadvantages comparing to **horizontal scaling** which has multiple machines running independently as nodes.

There are also two ways data is distributed across multiple nodes: **Replication** and **Partitioning**.

***

## Chapter 5. Replication

- Popular algorithms for replicating changes between nodes: *single-leader*, *multi-leader*, *leaderless* replication.

### Leaders and Followers

- One node is designated the **leader**, where clients send their requests for writing data to it; the other replicas as **followers** receive *replication log* from the leader and updates its own data; client requests a read from either the leader or the followers.

#### Synchronous Versus Asynchronous Replication

- When the leader waits until follower has confirmed that it received the write before reporting to the user and before making the write visible to other clients, is **synchronous**. 

- When the leader doesn't wait for a response from the follower is **asynchronous**.

- Often, leader-based replication is configured to be completely asynchronous.

- If configured to be synchronous, usually **one** of the followers is synchronous, others asynchronous. This guarantees an up-to-date copy of the data on at least two nodes: the leader and one synchronous follower. This configuration is called **semi-synchronous**.

#### Setting Up New Followers

- Setting up new follower is done by taking consistent snapshots of the leader, copy the snapshot to the new follower, the follower connects to the leader and requests all data changes that have happened since the snapshot was taken, and when follower is caught up it can continue to process data changes from the leader.

#### Handling Node Outages

- Follower failure: Catch-up recovery means the follower can simply recover from its log and last transaction, then connects to the leader and request all data from when the follower disconnected.

- Leader failure: Failover means that one of the followers needs to be promoted to the new leader.

- In certain scenarios, two nodes both believe that they are the leader, this is called **split brain**. This is dangerous since there is no process for resolving conflicts, thus systems will shut down one leader if two are detected.

#### Implementation of Replication Log

- Statement-based replication: leader logs every write requests and sends statement log to its followers. (generally not used nowadays)

- Write-ahead log (WAL) shipping: with either SSTables, LSM-Trees or B-trees, the leader sends the exact same log to other nodes which uses it to build a copy of the exact same data.

- Logical (row-based) log replication: allowing decoupling from replication log and storage engine internals. A logical log is usually a sequence of records describing writes to database tables ar the granularity of a row.

- Trigger-based replication: a trigger lets you register custom application code that is automatically executed when a data change occurs in a database.

### Problems with Replication Lag

- In read-scaling architecture, we can increase the capacity for serving reads by adding more followers. But this approach only works with asynchronous replication, because synchronous replication means a node failure or network outage will crush the entire system.

- If users read from asynchronous followers, they may see outdated data. This inconsistency is a temporary state: if we wait a while for followers to catch up to be consistent. This is called **eventual consistency**.

- The delay between a write on the leader and being reflected on follower is **replication lag**.

#### Reading Your Own Writes

- **Read-after-write consistency** is required, which guarantees that if the user reloads the page, they will always see any updates they just submitted.

- It can be achieved by: only read the data update from the user from a leader, e.g. read user's profile from a leader, and read other users' from followers. Or we can only read from the leader for like a minute after the write is submitted.

- **Cross-device read-after-write consistency** is required if the same user is accessing our service from multiple devices.

#### Monotonic Reads

- User can see an anomaly from asynchronous followers if the user makes a sequence of readings from two followers with greater lag, which looks like the data *moving backward in time*.

- **Monotonic reads** is a guarantee that this anomaly does not happen. The solution is to make sure the user always reads from the same replica, by hashing the user ID towards replica.

#### Consistent Prefix Reads

- **Consistent prefix reads** guarantees that if a sequence of writes happen in a certain order, then anyone reading those writes will see them appear in the same order.

#### Solutions for Replication Lag

- **Transactions** is the way for a database to provide stronger guarantees that developers can trust their databases.

### Multi-Leader Replication

- Allowing more than one leader where each node that process a write must forward that data change to all the other nodes.

#### Use Cases for Multi-Leader Replication

- Multi-datacenter operation will have one leader in every datacenter which allows performance, tolerance of outages and tolerance of network problems.

- Clients with offline operation has its local database as one leader, and asynchronous multi-leader replication process between the replicas of databases in datacenters.

- Collaborative editing can make the unit of change very small like a single keystroke and avoids locking. But it requires resolving challenges like conflict resolution.

#### Handling Write Conflicts

- Simplest strategy is to avoid conflicts, e.g. different users have different "home" datacenters which from the user's point of view, it is essentially single-leader.

- Database must resolve conflicts to the same data field in a convergent way, some examples are:

   - Pick the write with the highest ID as the winner, if timestamp is used, this is called **last write wins** (LWW).
   
   - Merge the values together like "B/C".

   - Implement a data structure that stores all information and writes application code to resolve it later, like asking the user.

#### Multi-Leader Replication Topologies

- **Replication Topology** describes the communication paths along which writes are propagated from one node to another. With multi-leader, we have various different topologies.

- Most general is **all-to-all**, which every leader sends its writes to every other leader.

- MySQL uses **circular topology** which each node receives writes from one node and forwards those writes plus any writes of its own to one other node.

### Leaderless Replication

- Allowing any replica to directly accept writes from clients are leaderless replication. [Cassandra](https://cassandra.apache.org/_/index.html) is inspired by [Amazon Dynamo](https://aws.amazon.com/dynamodb/).

#### Writing to the Database Where a Node Is Down

- If a node is unavailable when user is writing data, then it comes back online but it is now stale. To solve the problem, the client needs to read the databases from several nodes in parallel. And then use version numbers to determine which value is newer.

- When client sees a replica has older value, it sends a request to write a newer value to it, this process is called **read repair**.

- Some databases have a process that constantly looks for difference in the data between replicas, this is called **anti-entropy process**.

- In **quorum** reads and writes, if there are n replicas. every write must be confirmed by w nodes to be considered successful, and we must query at least r nodes for each read. As long as w + r > n, we expect to get up-to-date value when reading.

#### Sloppy Quorums and Hinted Handoff

- Because of quorum, databases with leaderless replication can appeal to users require high availability and low latency, and that can tolerate occasional stale reads.

- **Sloppy quorum** means writes and reads still require w and r successful responses, but those may include nodes that are not among the designated n "home" nodes for a value.

- When network interruption is fixed, any writes that one node temporarily accepted on behalf of another node are sent to the appropriate "home" nodes, this is called **hinted handoff**.

#### Detecting Concurrent Writes

- **Concurrency** is when teo operations are both unaware of each other, regardless of the physical time at which they occurred.

- When merging concurrently written values, the system needs to leave a marker with an appropriate version number to indicate that the value has been removed when merging siblings, this marker is called **tombstone**.

- The collection of version numbers from all the replicas is called **version vector**. It allows database to distinguish between overwrites and concurrent writes.

***

## Chapter 6. Partitioning

- We partition data because of scalability, different partitions can be placed on different nodes in a share-nothing cluster.

### Partitioning and Replication

- Partitioning is usually combined with replication.

### Partitioning of Key-value Data

- Our goal is to partition data so that query load is even across nodes. If unfair, some partitions have more queries, this is called **skewed**.

- Skewed partitions are much less effective. A partition with disproportionately high load is called **hop spot**.

- Simplest solution for avoiding hot spot is assign records to nodes randomly. But we can do better.

#### Partitioning by Key Range

- One way is to assign a continuous range of keys to each partition. It can be chosen by administrators or automatically.

- Within each partition, we keep keys in sorted order like SSTables and LSM-Trees. 

- One downside of key range partitioning is that certain pattern leads to hot spot, like timestamp keys by days.

#### Partitioning by Hash of Key

- Good hash function takes skewed data and makes it uniformly distributed. Cassandra and MongoDB use MD5. Then partition using a range of hashes (rather than keys).

### Partitioning and Secondary Indexes

#### Partitioning Secondary Indexes by Document

- Indexing approach makes each partition completely separate: each partition maintains its own secondary indexes.

- Whenever dealing with a document within a partition, only deal with this partition, so this is also known as a **local index**.

- This approach to querying a partitioned database is sometimes known as **scatter/gather**, it makes read queries on secondary indexes quite expensive.

#### Partitioning Secondary Indexes by Term

- Instead of local indexes, we can create a **global index** that covers data in all partitions. (without creating a bottleneck by putting it in one node)

- Global index needs to be partitioned too, we do it by term (full-text indexes).

### Rebalancing Partitions

- The process of moving load from one node in the cluster to another is called **rebalancing**.

#### Fixed number of partitions

- Create many more partitions than there are nodes, and assign several partitions to each node. If a new node is added, this new node can just steal some partitions from others.

#### Dynamic partitioning

- When partition grows to exceed a certain size, it splits to two partitions approximately halved. Or a partition can be merged if it shrinks. This is similar to B-Trees.

#### Partitioning proportionally to nodes

- Makes the number of partitions proportional to the number of nodes - to have fixed number of partitions per node.

### Request Routing

- When a client wants to make a request, how does it know which node to connect to? This is a kind of more general problem called **service discovery**. We have few approaches:

- 1. Allow clients to connect to any node, and then decides if it should redirect the request to the node that has the partition.

- 2. Send all requests to a routing tier first, which determines the node that should handle the request.

- 3. Require the client to know partitioning and assignment of partitions to nodes. Then it can directly connect to the node.

***

## Chapter 7. Transactions

- Conceptually, all the reads and writes in a transaction are executed as one operation: either succeeds (commit) or fails (abort).

### The Slippery Concept of a Transaction

#### Atomicity

- Describes when a client wants to make several writes, but a fault occurs for one write, thus it needs to abort the writes and undo any writes it has made.

- Perhaps a better term is **abortability**.

#### Consistency

- You have certain statements about your data that must always be true.

#### Isolation

- It means that concurrently executing transactions are isolated from each other.

#### Durability

- The promise that once a transaction has committed successfully, any data it has written will not be forgotten, even if there is a hardware fault or the database crashes.

#### Single-Object and Multi-Object Operations

- Multi-object transactions require some way of determining which read and write operations belong to the same transaction.

- Single-object operations on one node can easily provide atomicity with a log for crash recovery, and isolation with a lock on each object.

### Weak Isolation Levels

- Concurrency bugs are hard to find by testing, because the bugs are triggered when the timing was unlucky, and they are hard to reproduce.

- Thus databases hide concurrency issues by providing **transaction isolation**.

- **Serializable isolation** means that the database guarantees that transactions have the same effect as if they ran serially.

#### Read Committed

- The most basic level of transaction isolation, it provides:

  1. When reading from the database, you will only see data that has been committed (no dirty reads).

  2. When writing to the database, you will only overwrite data that has been committed (no dirty writes).

- **Dirty reads** mean that a transaction can see uncommitted data from another transaction (not yet committed).

- **Dirty writes** mean that a transaction are overwriting data from an earlier transaction's uncommitted data.

- Most commonly, databases prevent dirty writes by using row-level locks: when a transaction wants to modify a particular object, it must first acquire a lock on that object. It must then hold that lock until the transaction is committed or aborted.

- Using row-level locks for preventing dirty writes is not feasible because a long write transaction will delay many read-only transactions. So most databases prevent dirty reads using this approach: the database remembers both the old committed and new values set by transaction that currently holds the write lock, while transaction is ongoing, any reads will get the old value, only once the transaction is done, reads will get new value.

#### Snapshot Isolation and Repeatable Read

- Read committed considers **non-repeatable read** or **read skew** acceptable, which is seeing both committed and unchanged data at the same time while processing the changes.

- **Snapshot isolation** is the most common solution for this anomaly. The idea is that each transaction reads from a *consistent snapshot* of the database - all the data that was committed in the database at the start of the transaction.

- Snapshot isolation uses write locks to prevent dirty writes, but reads do not require any locks. Databases must keep several different committed versions of an object because of various in-progress transactions may need to see the state of the database at different points in time. This technique is called **multi-version concurrency control** (MVCC).

#### Preventing Lost Updates

- **Lost update** problems occur when two transactions concurrently reads, modifies and commits transactions to the same object, one of the data might be lost.

- **Atomic operation** is one of the solutions, it is implemented by taking an exclusive lock on the object when it is read so that no other transaction can read it until the update has been applied. This is also called cursor stability.

- Another solution is for application to explicitly lock objects that are going to be updated. The application can perform a read-modify-write cycle, while other transactions trying to concurrently read the same object will wait until the first cycle is completed.

- In databases that don't provide transactions, **compare-and-set** is used where an update is allowed only if the value has not changed since the last read. If the current value does not match the previously read value, the update has to be retried.

#### Write Skew and Phantoms

- **Write skew** is not dirty write nor lost update, because the two transactions are updating two different objects. It is less obvious race condition and conflict.

- Automatically preventing write skew requires true serializable isolation. If such can't be used, second-best option is to explicitly lock the rows that the transactions depend on.

- A write in one transaction changes the result of a search query in another transaction is called **phantom**. Snapshot isolation avoids phantom in read-only transactions, but not in read-write transactions which leads to write skew.

### Serializability

- **Serializable isolation** is regarded as the strongest isolation level. It guarantees that even though transactions may execute in parallel, the end result is the same as if they had executed one at a time, *serially*, without concurrency.

#### Actual Serial Execution

- By executing only one transaction at a time, in serial order, on a single thread, we can sidestep from detecting and preventing conflicts, the resulting isolation is **serializable**.

- Serializable is made possible because RAM became cheap enough so that data can be kept entirely in memory, and database designers realized that OLTP transactions are usually short and only make a small number of reads and writes.

- Systems with single-threaded serial transactions processing don't allow interactive multi-statement transactions because of dreadful performance. Instead, the application must submit the entire transaction as a **stored procedure**.

#### Two-Phase Locking (2PL)

- In 2PL, writers don't just block other writers, they also block readers and vice versa. In contrast, snapshot isolation has the mantra of readers never block writers and writers never block readers.

- Implementation of 2PL will have a lock on every object, the lock can either be in *shared mode* or in *exclusive mode*.

- A transaction needs to acquire the lock in shared mode to read the object, and several transactions are allowed to hold the shared lock simultaneously, but if a transaction holds the exclusive lock first, the transaction needs to wait.

- A transaction needs to acquire the exclusive lock to write to the object, no other transactions can hold exclusive lock at the same time. It can upgrade from shared to exclusive lock if it starts with reading and ending with writing.

- After transaction has acquired the lock, it must continue to hold the lock until the transaction is committed or aborted.

- **Deadlock** can happen when transaction is waiting for another, databases detect them and try to abort one and retry the aborted transaction.

- 2PL has significantly worse performance in transaction throughput and response times, partly due to the overhead of acquiring and releasing all the locks.

- **Predictable lock** is similar to shared/exclusive lock but it belongs to all objects that match some search conditions instead of one object. It does not perform well neither.

- Most databases with 2PL actually use **index-range locking** which is a simplified approximation of predicate locking where search condition is attached to one of the indexes.

#### Serializable Snapshot Isolation (SSI)

- **Serializable Snapshot Isolation** provides full serializability but has only a small performance penalty compared to snapshot isolation.

- 2PL is a **pessimistic** concurrency control mechanism because it thinks anything might go wrong and it should wait until the situation is safe again before doing anything.

- SSI is a **optimistic** technique because it allows transactions to go through and hope everything will turn out alright.

- SSI has the advantage over 2PL where a transaction doesn't need to block waiting for locks help by another transaction. 

***

## Chapter 8. The Trouble with Distributed Databases

### Unreliable Networks

- In this book we focus on shared-nothing systems where network is the only way these machines communicate.

#### Network Faults in Practice

- Handling network faults doesn't necessarily mean tolerating them: if the network is fairly stable, a valid approach might be showing error messages to users while the network is experiencing problems.

#### Detecting Faults

- The uncertainty about the network makes it difficult to tell whether a node is working or not.

#### Timeouts and Unbounded Delays

- A long timeout means a long wait until a node is declared dead. A short timeout detects faults faster but carries a higher risk of incorrectly declared dead nodes.

#### Synchronous Versus Asynchronous Networks

- Data that passes through several routers but not suffer from queueing because of the space has been reserved in the next hop of the network is called **synchronous**. Because it has no queueing, the maximum end-to-end latency of the network is fixed, this is called **bounded delay**.

- **TCP** dynamically adapts the rate of data transfer to the available network capacity in contrast to synchronous network.

### Unreliable Clocks

#### Monotonic Versus Time-of-Day Clocks

- **Time-ofDay** clocks return the current date and time according to some calendar, which will be synchronized with NTP server.

- **Monotonic clock** guarantees to always move forward in time so it is good for measuring a duration like timeouts or response times.

#### Clock Synchronization and Accuracy

- Monotonic clocks don't need synchronization, but time-of-day clocks need to be set according to an NTP server.

#### Relaying on Synchronized Clocks

- It is essential to monitor the clock offsets between all the machines if synchronized clocks is required. Any node whose clock drifts too far from the others should be declared dead and removed from the cluster.

- It is dangerous to use time-of-day clocks with multi-leader replication because it might drop the wrong writes if the leaders have different clocks. The conflict resolution strategy is called **last write wins** (LWW).

- **Logical clocks** are based on incrementing counters rather than an oscillating quartz crystal, are a safer alternative for ordering events.

#### Process Pauses

- Developing real-time systems is very expensive because of its massive designs and libraries needed. They are most commonly used in safety-critical embedded devices. Moreover, real-time is not the same as high-performance because the systems prioritize timely responses above all else.

### Knowledge, Truth and Lies

#### The Truth is Defined by the Majority

- Many distributed algorithms rely on a **quorum**, which is voting among the nodes.

#### Byzantine Faults

- If a node claims to have received a particular message when in fact it didn't is called **Byzantine fault**. The problem of reaching consensus in the untrusting environment is known as the **Byzantine Generals Problem**.

- Peer-to-peer networks like Bitcoin and other blockchains can be considered to be a way of getting mutually untrusting parties to agree whether a transaction happened or not, without relying on a central authority.

#### System Model and Reality

- By defining a **system model**, which is an abstraction that describes what things an algorism may assume, can formalize the kinds of faults that we expect to happen in a system.

- Synchronous model assumes bounded network delay, bounded process pauses, and bounded clock error. This means network delay, pauses, and clock drift will never exceed some fixed upper bound.

- Partially synchronous model means sometimes exceeds the bounds of the network delay, process pauses and clock drifts. This is the realistic model of many systems.

- Asynchronous model assumes nothing, even without a clock.

***

## Chapter 9. Consistency and Consensus

### Consistency Guarantees

- Most replicated databases provide at least **eventual consistency**, which means that if you stop writing to the database and wait for some unspecified length of time, then eventually all read requests will return the same value.

- Eventual consistency is a weak consistency model because it doesn't guarantee when the replicas will converge.

### Linearizability

- **Linearizability** is one of the strongest consistency model. It makes the system appear as if there were only one copy of the data, and all operations on it are atomic.

#### What Makes a System Linearizable?

- The requirement of linearizability is that the lines joining up the operation markers always move forward in time, never backward. 

- Serializability is an isolation property of transactions, it guarantees that transactions behave the same as if they had executed in some serial order.

- Linearizability is a recency guarantee on reads and writes of a register (an individual object). It doesn't group operations together into transactions, it does not prevent problems like write skew.

- A database provides both serializability and linearizability is known as **strict serializability** or **strong one-copy serializability (strong-1SR)**.

#### Replaying on Linearizability

- One way of electing a leader from one-leader system is to use a lock where every node tries to acquire the lock. The lock must be linearizable, all nodes must agree which node owns the lock, otherwise is useless.

- Without recency guarantee of linearizability, race conditions between these two channels are possible.

#### Implementing Linearizable Systems

- Single-leader replication: potentially linearizable.

- Consensus algorithms: linearizable.

- Multi-leader replication: not linearizable.

- Leaderless replication: probably not linearizable.

#### The Cost of Linearizability

- Applications that don't require linearizability can be more tolerant of network problems. This insight is known as the **CAP theorem**.

- At times when the network is working correctly, a system can provide both consistency and total availability. When a network fault occurs, you have to choose between either linearizability or total availability.

### Ordering Guarantees

#### Ordering and Causality

- Ordering keeps preserve **causality**. It imposes an ordering on events: cause comes before effect.

- There are no concurrent operations in a linearizable datastore: there must be a single timeline along which all operations are totally ordered.

- Linearizability implies causality: any system that is linearizable will preserve causality correctly.

#### Sequence Number Ordering

- A better way is to use **sequence numbers** or timestamps to order events. A timestamp comes from logical clock rather than time-of-dat clocks.

- Such sequence numbers provide a **total order**. You can always compare two operations to determine which is greater.

- A **Lamport timestamp** bears no relationship to a physical time-of-day clock, but it provides total ordering: if you have two timestamps, the one with a greater counter value is the greater timestamp: if the counter values are the same, the one with the greater node ID is the greater timestamp.

#### Total Order Broadcast

- A correct algorithm for **total order broadcast** must ensure the reliability (if a message is delivered to one node, it is delivered to all nodes), and ordering (messages are delivered to every node in the same order) are always satisfied, even if a node or network is faulty.

- Total order broadcast is asynchronous: messages are guaranteed to be delivered reliably in a fixed order, but there is no guarantee about when a message will be delivered. By contrast, linearizability is a recency guarantee: a read is guaranteed to see the latest value written.

### Distributed Transactions and Consensus

- Consensus is to get several nodes to agree on something. It could be leader election, atomic commit, etc.

#### Atomic Commit and Two-Phase Commit (2PC)

- Atomicity prevents failed transactions from littering the databases with half-finished results and half-updated state. 

- A node must only commit once it is certain that all other nodes in the transaction are also going to commit.

- **Two-phase commit** is an algorithm for achieving atomic transaction commit cross multiple nodes. 2PC uses a component called **coordinator**, not normally seen in single-node transactions.

- The protocol contains two crucial points of no return: when a participant votes yes, it promises that it will definitely be able to commit later; and once the coordinator decides, that decision is irrevocable. These promises ensure the atomicity of 2PC.

- If the coordinator crashes or the network fails, the participant can do nothing but wait. A participant's transaction in this state is called **in doubt**.

- The only way 2PC can complete is by waiting for the coordinator to recover. This is why the coordinator must write its commit or abort decision to a transaction log on disk before sending commit or abort requests to participants.

#### Distributed Transactions in Practice

- Distributed transactions with 2PC is providing an important safety guarantee that would be hard to achieve otherwise; on the other hand they causes operational problems, killing performance, and promising more than they can deliver.

- 2PC transaction must hold onto the locks throughout the time it is in doubt.

- In practice, **orphaned** in-doubt occur when transactions for which the coordinator cannot decide the outcome for whatever reason. The only way out is for an admin to manually decide whether to commit or roll back.

#### Fault-Tolerant Consensus

- A consensus algorithm must satisfy these properties: uniform agreement, integrity, validity and termination.

- Most algorithms actually don't directly use voting to decide on a single value. Instead, they decide on a *sequence* of values, which makes them *total order broadcast*.

- Every time the current leader is dead, a vote is started to elect a new leader. The election is given an incremented **epoch number** which in each epoch number the leader is unique, and the epoch numbers are totally ordered and monotonically increasing.

- Consensus algorithms only require votes from a majority of nodes, whereas 2PC requires a yes from every participant.

#### Membership and Coordination

- **Service discovery** usually uses ZooKeeper, which implements total order broadcast (hence consensus) and features like linearizable atomic operations, total ordering of operations, failure detection and change notifications.

***

## To be continued ...  