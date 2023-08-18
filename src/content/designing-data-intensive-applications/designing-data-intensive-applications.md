---
title: Designing Data-Intensive Applications Reading Notes (continuing...)
publishedAt: 2023-8-11
---

![Book Cover](/blogImages/designing-data-intensive-applications/book-cover.jpg)

To be honest, I do not enjoy taking down reading notes, except occasionally highlighting on my Kindle for some great paragraphs. But when I opened [Designing Data-Intensive Applications](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/) and saw the estimated reading time being **25 hours**, I said to myself, "Maybe I should make reading notes along the way to make these 25 hours really worth it." 

So this blog is going to be the place where I summarize this book by chapters, the points will be what strikes me as "worth highlighting", thus it won't be a full summarization of this book at all. 

## Chapter 1. Reliable, Scalable, and Maintainable Applications

Three most important concerns in most software systems:

### Reliability

- Reliability can mean roughly, "continuing to work correctly, even when things go wrong."

- Kinds of faults that can be cured: Hardware Faults, Software Faults, Human Errors.

### Scalability

#### Load

- Load is described with **load parameters**. These depend on the architecture of the system: it can be requests per second to server, the ratio to writes in a database, the number of simultaneously active users, etc.

- Twitter's first version used the approach where new tweets are inserted into global collections, user requests their home timeline, the tweets are looked up and merged together. This is fast on posting but slow on reading.

- Twitter's second version used another approach where a new tweet is sent to a cache for each user's home timeline "mailbox". This approach is going to be slow on posting but super fast on reading. But this approach makes sense because the rate of posting tweets is **two orders of magnitude lower** than fetching home timeline reads.

- But celebrities have a huge number of followers where second version will have a huge slow down, thus Twitter uses a hybrid approach where celebrities' tweets are fetched separately like version 1 and merged into users' home timeline mailbox in version 2.

#### Describing Performance

- **Response time** (time between a client sending a request and receiving a response) is more important than **throughput** (the number of records that can be processed per second) in online systems.

- High percentiles of response times, **tail latencies**, are important for Amazon because these customers are the ones with the most number of order histories which indicates that they are the most valuable customers.

### Maintainability

- Three aspects of maintainability: Operability, Simplicity ([Clean Code](/blog/clean-code)), Evolvability.

## Chapter 2. Data Models and Query Languages

### Relational Model Versus Document Model

- Relational databases' roots are within **business data processing**. The use cases were either **transaction processing** and **batch processing**.

- Example of a LinkedIn resume data. The **one-to-many relationships** from the user profile to the user's positions, educational history, etc, imply a tree structure in the data, and [JSON](https://en.wikipedia.org/wiki/JSON) representation makes this structure explicit.

- Document databases favor in schema flexibility, better performance due to locality, and to some applications it is closer to the data structure.

- Relational databases counter by providing better support for joins, and many-to-one and many-to-many relationships.

### Query Languages for Data

- **Declarative query** language like SQL, you specify the pattern of the data you want, but not *how* to achieve the goal. The database system's query optimizer decides which indexes and which join methods to use and the order to execute parts of query.

- **MapReduce** is implemented in MongoDB by [aggregation pipeline](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/) where it uses a JSON-based syntax rather than SQL's sentence-style syntax. The difference is maybe a matter of taste.

### Graph-Like Data Models

- A graph consists of **vertices** (nodes) and **edges** (arcs). Examples include social relationships graph, web pages graph and rail networks graph.

- Many algorithms focus on graph, check out some of them on [LeetCode](https://leetcode.com/tag/graph/).

## Chapter 3. Storage and Retrieval

### Data Structures That Power Your Database

- An important trade-off in storage system: well-chosen indexes speed up read queries but slows down writes. So normally database administrator chooses indexes manually using knowledge of the application's typical query patterns.

#### Hash Indexes

- Indexing strategy: keep an in-memory hash map where every key is mapped to a byte offset in the data file, which is the location at which the value can be found. When you append a new key-value pair to the file, you also update the hash map to reflect the offset of the data just wrote.

- When deleting a key and its value, you have to append a special deletion record to the data file (tombstone). When the segments are merged, the tombstone tells the process to discard this key-value pair.

#### SSTables

- **Sorted String Table** (SSTable), requires that the sequence of key-value pairs is *sorted* by *key*. Additionally it requires that each key only appears once within each merged segment file.

- Now with SSTables, merging segments is simple and efficient just like [mergesort algorithm](https://en.wikipedia.org/wiki/Merge_sort).

- Find a particular key is now easier because keys are sorted so you can look for a key in between two closest keys.

- Constructing and maintaining a sorted structure can be done with [red-black trees](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree) or [AVL trees](https://en.wikipedia.org/wiki/AVL_tree).

- When a write comes in, add it to in-memory balanced tree data structure, this is called a **memtable**.

- When a memtable gets bigger than a threshold, write it out to disk as an SSTable file. This new SSTable file becomes the most recent segment of the database.

- When a read request comes in, first try to find the key in the memtable, then in the most recent on-disk segment, then the next-older segment, etc.

#### LSM-Trees

- **Log-Structured Merge-Tree** (LSM-Trees), builds on log-structured filesystems. Storage engines that are based on this principle of merging and compacting sorted files are called LSM storage engines.

- LSM-tree algorithm can be slow when looking up keys that do not exist in the database: you need to check the memtable, then the segments all the way back to the oldest. 

- To optimize this access, storage engines often use [Bloom Filters](https://en.wikipedia.org/wiki/Bloom_filter), which is a memory-efficient data structure for approximating the contents of a set. It tells you if a key does not appear in the database, saving unnecessary disk reads.

#### B-Trees

- B-trees break the database down into fixed-size **blocks** or **pages**, and read or write one page at a time. It is different comparing to previous indexes which has variable-size segments.

- One page is considered the **root** of the B-tree. Whenever looking for a key, you start from the root. This root page contains several keys and references to child pages. Each child is responsible for a continuous range of keys. 

- When looking for a key, starting from root, eventually we will reach a **leaf page**, which contains the references to the pages where values can be found.

- When adding a new key, you need to find the page whose range encompasses the new key and add it to that page. If there isn't enough free space in the page for the new key, then this page is split into two half-full pages, and the parent page is updated to account for the new subdivision of key ranges.

- This algorithm ensures the tree remains **balanced**, and a B-tree with n keys always has a depth of O(log n).

- Write operations of B-tree is to overwrite a page on disk, while log-structured indexes such as LSM-trees only appends to files but never modify files in place.

- In order to make B-tree database resilient to crashes, it is common to include an additional data structure: a **write-ahead log** (WAL). This file is append-only, which needs to be appended before every B-tree modification. When the database comes back after a crash, this WAL is used to restore the B-tree back to a consistent state.

#### Comparing B-Trees and LSM-Trees

- One write to the database resulting in multiple writes to the disk is known as [write amplification](https://en.wikipedia.org/wiki/Write_amplification). LSM-tree indexes rewrite data multiple times due to repeated compaction and merging SSTables; while B-tree indexes must write every piece of data at least twice, once to the WAL, and once to the tree page itself.

- LSM-trees can be compressed better, and produce smaller files on disk than B-trees.

- B-tree storage engines leave some disk space unused due to fragmentation, when the page is split, some space in a page remains unused.

- LSM-trees has a downside where the compaction process can sometimes interfere with the performance of ongoing reads and writes.

- An advantage of B-trees is that each key exists in exactly one place in the index, whereas a LSM-tree may have multiple copies of the same key in different segments.

#### Other Indexing Structures

- When the value in an index is a reference to the row stored elsewhere, the place where rows are stored is known as **heap file**, and it stores data in an no particular order. This approach is common because it avoids duplicating data when multiple secondary indexes are present.

- In some situations, the extra hop from the index to the heap file is too much of a performance penalty for reads, it is desirable to store the indexed row directly within an index, which is known as **clustered index**.

- **Multi-column index** is also called concatenated index, which simply combines several fields into one key by appending one column to another.

- **Lucene**, the in-memory index is a finite state automation over the characters in the keys, similar to a [trie](https://leetcode.com/problems/implement-trie-prefix-tree/). This automation supports efficient search for words within a given edit distance.

- Because many databases are not that big, it is feasible to keep them entirely in memory, which is **in-memory databases**. These in-memory databases write and read from memory, while writing an append-only log for durability to disk too.

### Transaction Processing or Analysis Processing?

- A transaction needn't necessarily have [ACID](https://en.wikipedia.org/wiki/ACID) (atomicity, consistency, isolation, durability) properties. **Transaction processing** just means allowing clients to make low-latency reads and writes - as opposed to **batch processing** jobs, which only run periodically.

- **OLTP** (online transaction processing) typically looks up a small number of records by some key with an index. Records are inserted or updated based on user's input.

- **OLAP** (online analytic processing) usually scans over a huge number of records, only reading a few columns per record, and calculate and aggregate statistics rather than returning raw data. They are often written by business analysts to gain business intelligence (BI).

- A [data warehouse](https://en.wikipedia.org/wiki/Data_warehouse) is a separate database that analysts can query without affecting OLTP operations. The data warehouse contains a read-only copy of the data in all the various OLTP systems in the company. Data is extracted from OLTP databases (periodic data dump or continuous stream of updates), transformed into an analysis-friendly schema, cleaned up, and then loaded into the data warehouse. This is known as [Extract-Transform-Load (ETL)](https://en.wikipedia.org/wiki/Extract,_transform,_load).

- Many data warehouses are used in a style known as [star schema](https://en.wikipedia.org/wiki/Star_schema) (dimensional modeling). At the centre of the schema is a **fact table**. Each row of the fact table represents an event that occurred at a particular time.

- Some columns in the fact table are attributes, like price of a product. Other columns in the fact table are foreign key references to other tables called **dimension tables**.

- A variation of star schema is called [snowflake schema](https://en.wikipedia.org/wiki/Snowflake_schema), where dimensions are further broken down into sub-dimensions.

### Column-Oriented Storage

- The idea behind **column-oriented storage** is simple: don't store all the values form one row together, but store all the values from each column together instead. This way, querying only needs to read and parse columns that are used in that query, which saves a lot of work.

- Column-oriented storage leads very well to compression. One technique that is particularly effective in data warehouses is [bitmap encoding](https://en.wikipedia.org/wiki/Bitmap_index) which makes encoding of a column remarkably compact.

- Administrators can choose to sort column storage as an indexing mechanism. For example, if queries often target data ranges, it makes sense to sort the entire column storage with date as the first key. This will make query optimizer scanning only the rows needed.

- A second sort key can be imposed as well for the values with the same first key, for example, after sorting with date, we can sort secondarily with product.

- Writing to column storage usually uses [LSM-trees](#lsm-trees). All writes first go to an in-memory store, where they are added to a sorted structure and prepared for writing to disk.


## To be continued ...  