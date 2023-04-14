---
title: The Decision not to Sanitize User Inputs
publishedAt: 2022-4-13
---

I was checking my [Odinbook](https://odinbook-client-production-9219.up.railway.app/) (Facebook-clone) website after deployment where some posts and comments made from nice fellows on [The Odin Project](https://www.theodinproject.com), I found an error in one post content:

![&#x27; error](../blogImages/remove-escape/user_post_escape_error.png)

Quickly I realized the `&#x27;` is essentially `'` character, which was escaped by [express-validator](https://express-validator.github.io/docs) in my Node.js middleware that was validating and sanitizing user inputs.

The function in questioning is [`escape(input)`](https://github.com/validatorjs/validator.js#sanitizers#escape), from the documentation, it replace **<, >, &, ', " and /** with HTML entities.

Reminding of myself, I used `escape()` to sanitize the user input because I was trying to prevent **cross-site-scripting (XSS)** attacks. The idea of XSS attack sounded pretty serious to me at the time of introduction, later I would sanitize user inputs in every Node.js back-end controllers. 

An example of XSS attack would look like:
1. App allows user to input post content which would be displayed after submitting.
2. Attacker enters the input `attacker <script>alert('You are being attacked!')</script>`.
3. Now the post content would render the `script` which annoyingly alerts the attack.

By escaping such user inputs first, then storing into database (my choice being MongoDB), I had the idea that it was successfully preventing XSS attacks. That's up until Visitor-67's asking for a partner for JavaScript30 course post came along.

Now I had solutions in mind, maybe I could unescape characters other than `<>` on front-end? But what if an user is trying to post some content about HTML where `<>` are needed? What about not escaping user inputs at all? But what if some nasty attacks actually gets stored and rendered on my website?

Just when I was researching on this topic, a post by Ben Hoyt came along, [Don’t try to sanitize input. Escape output.](https://benhoyt.com/writings/dont-sanitize-do-escape/). The post made sense to me about the idea of "escaping output instead" especially with the quote:

> In short, it’s no good to strip out “dangerous characters”, because some characters are dangerous in some contexts and perfectly safe in others.

And this was when I realized that most front-end frameworks like React has "contextual escaping" in box, where escaping are done before outputting HTML, as well as JSON.

Great! Now I could feel safe removing `escape()` sanitizer from all of my controllers dealing with user inputs. 

But the researches brought another issue to my attention, which was **NoSQL injection** especially towards MongoDB.

An example of MongoDB injection would look like:

1. When user is logging in, the controller would do something like this:
  ```
  db.users.find({
    username: req.body.username,
    password: req.body.password
  });
  ```
2. An attacker inputs `{ $ne: null }` in password instead which is essentially querying a password that is not equal to null.
3. Now the attacker would be logged in.

Solutions? Yes, actually you can use [mongo-sanitize](https://github.com/vkarpov15/mongo-sanitize), which does one thing: "strip out any keys that start with '$' in the input" and it is exactly what you want.

Just before I was going to `npm install mongo-sanitize`, I found out that with [mongoose](https://mongoosejs.com/docs/guide.html), after defining your Schemas where values required SchemaType like string or boolean, the `{ $ne: null }` would be passed to the password query selector as plain strings. Therefore NoSQL injections are prevented.

Nice!

Until now, I felt the issue was fairly understood, looked into, and solved.

And that was the whole hour spent behind the decision to safely removing `escape()` sanitizer function from my backend controllers. knowing both XSS attacks and NoSQL injections are being prevented by my website.