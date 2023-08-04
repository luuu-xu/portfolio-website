---
title: Clean Code and Leather-working
publishedAt: 2023-8-3
---

![Wtfs per minute](/blogImages/clean-code/wtfs-per-minute.png)

Writing code is more of a dedicating craft than a mythically creative process. Being a craft, just like leather-working or carpentry, programming skills need to be seriously regarded, constantly improving, ever stopping adapting and learning. Skills can be learnt and honed, mindsets can also be learnt though through a more difficult path, but attitude towards this craft is crucial and will be shown from details and corners of the works and products.

## Hand-making Leather Products

For the past few years I have been hand-making custom ordered leather products for clients in the world, from bi-fold wallets to women's handbags. When I am talking about my leather-working skills and practices, I am indeed regarding them as results and showcases of my dedication and craftsmanship. 

In order to attract clients, I need to differentiate my works from 99.9% of the leather products in the market which are mass-produced, highly industrialized, and with little care and attention. Clients who seek this craftsmanship will look for makers themselves, by examining the products, communicating with the makers and eventually placing an order to feel the product in their own hands.

I pay all of my attention while hand-making a custom order for my client, with my best efforts by far reaching a higher standard, simply because I take pride in what I do, and I am being extremely considerate to my client. Being considerate to the client means that I am making a product with the standard that I would be happy with if I were the client. I wouldn't want to be upset or unsatisfied about the custom order that I had been waiting for two months myself.

Transferring from leather-working to coding, being considerate is still required. Although the person that I am imaging myself in differs now, from the client who waits for my product, to the next person who reads and maintains the code I just wrote.

## Hand-writing Codes

Because code base is most likely ever evolving, with additions of features, removals of bugs, adaptations of newer frameworks and optimizations from better tools. I would be better off if I am considerate of the next person who reads and adds into this code base, imaging myself to be this next person. Yes, for personal projects I have built, the next person is possibly me. But for a collaborative project, I would be the "next person" in the first place when I initially started looking into the code, and I would be responsible for making the next person easier to understand what I have changed.

Reading [Clean Code: A Handbook of Agile Software Craftsmanship](https://www.oreilly.com/library/view/clean-code-a/9780136083238/) was easy and fun, the concepts align with what I agree and strive for and most importantly the techniques and pointers are informative and helpful. There are few techniques that stick with me strongly, I would like to list them below:

### 1. The boy scout rule

"Leave the campground cleaner than you found it." This rule is easy to understand, but it is merely the general goal we are trying to achieve every time. It is also a mindset that ultimately become mutual-beneficial to ourselves and others. There are many techniques and principles that will help us to adhere to this rule.

### 2. Single Responsibility Principle (SRP)

Robert C. Martin expresses SRP as "a class or modules should have one, and only one, reason to change." This principle ensures that a module or function should focus on one thing, in order to minimize the scope of it. This will bring in quite some best practices that are easy to understand and remember too:

- Do one thing: try refactoring complex functions to small ones which ultimately does one thing only.
- Write small functions, modules or class.
- Give meaningful and descriptive names to functions and variables.
- Try passing as few as possible arguments, 1 is better than 2, 2 is better than 3.
- Don't use flag argument, you can easily split this function into two.

### 3. Express yourself in code instead of comments

In my own codes, from front-end React hook logics to algorithm steps, I have done it: using comments rather than code to explain myself. This is suboptimal, a mistake for sure and it is easy to understand too. Only when our code is not explanatory enough, we will try using long comments to supplement the code.

Refrain from writing comments, try giving more explanatory names to variables and functions, and making sure a function only has one level of abstraction where logics are easier to understand. 

Some comments are good, like a general introduction to an algorithm explaining why it works. Then make sure the actual code does the rest explaining the details and implementations.

### 4. Don't Repeat Yourself (DRY)

Codes should be efficient, repeated codes are not. When we see similar or repeated functions, we should try rewriting them so we can avoid the unnecessary repetition. We can modularize the functions, where it does only one thing, but it can be implemented to different places and abstractions as needed. Because this module does one thing, it is easy to change and maintain, ready for testing and provides better documentations.

### 5. Test Driven Design (TDD)

I am not sure whether TDD or Clean Code is the reason for the other. Writing codes with TDD in mind is crucial for maintainability. If we have tests covering for every functions we have, we are no longer invulnerable towards introducing bugs or breaking anything. There are again a few best practices we can follow:

- Write test first, then code, don't write more code until a failing test is present.
- Tests need to be small, simple and readable.
- Make sure tests are guaranteed to be repeatable.
- Use a testing framework that is fast, optimally using one command line to run all of them, this ensures us that we are incline to actually run these tests.

## Your Product Shows Your Craftsmanship

There is a saying about great cabinet makers, "Look at the back of the drawers, that is where you know it's worthy." This saying also sheds some lights and guides me into both coding and leather-working. You look at the code bases and the insides of my leather products as if they were the back of the drawers.

For both of them, coding and leather-working, I intend to be proud of what I am offering to others. This proud is woven into the products I am building, users and clients will look closely and feel this craftsmanship.

> There are two parts to learning craftsmanship: knowledge and work. You must gain the knowledge of principles, patterns, practices, and heuristics that a craftsman knows, and you must also grind that knowledge into your fingers, eyes, and gut by working hard and practicing.

I have learned basic and advanced techniques in leather-working, acquired my craftsmanship by perfecting practices and provided great products to many clients. And I am now on the journey of acquiring another craft, the making of a software or web app, again I intend to do so by learning the knowledge and putting them to use in hard-works.

---

This blog post is also published on Medium [here](https://luuu-xu.medium.com/clean-code-and-leather-working-1097792d6a90). 

[Clean Code and Leather-working](https://luuu-xu.medium.com/clean-code-and-leather-working-1097792d6a90)
