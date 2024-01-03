---
title: Implementing Boids Algorithm on Canvas
publishedAt: 2023.12.28
---

<!-- ![Implementation Screenshot](/blogImages/boids-on-canvas/implementation-screenshot.png) -->

Whenever I see a flock of birds roaming in the sky, I will stare and admire them for several seconds. My favorite thing to do while scuba diving is to swim along or stay inside a huge school of fishes and watch them swim around me. There is something mesmerizing about the movements, not only as an individual bird but also as an entire group. 

When I heard about a simple algorithm that only uses 3 factors to simulate the movements of flocks, it had my interests and I started writing an implementation of it.

It is [live here](https://luuu-xu.github.io/boids-canvas/) and as an iframe element below, go ahead and play around with it. 

If you are interested in the code, its GitHub repo is [here](https://github.com/luuu-xu/boids-canvas).

<iframe
  title="Live Example of Boids on Canvas"
  width="100%"
  height="500px"
  loading="lazy"
  src="https://luuu-xu.github.io/boids-canvas/">
</iframe>

## Boids Algorithm

The [Boids Algorithm](https://en.wikipedia.org/wiki/Boids) developed by Craig Reynolds in 1986 is a smartly designed flocks simulating model that only uses 3 rules. In my implementation, I followed these 3 elegant rules and coded with OOD in mind to better capture the individual boid's movements.

### 1. Alignment

The steer force that each boid takes to align towards the average direction of the local flocks. 

In my implementation, the average velocity within local flocks is calculated and normalized, then added to boid's new velocity.

### 2. Cohesion

The steer force that moves boid to the average position of the local flocks. 

This rule is similarly implemented by calculating average position (center of mass) of local flocks, then the normalized velocity required to reach that average position is added.

### 3. Separation

The steer force that each boid uses to avoid the local flocks. 

The implementation is that the by setting a parameter called separationRadius, we fetch all boids within the radius, and add a separation force avoiding it, summed up to a new velocity.

## Simulating a Bird

Before putting Boid's Algorithm onto the boid class, I started with creating a bird-like class that can be animated using HTML [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

Firstly, the boids would move towards a random direction because of an initial velocity and position was given to them. The Canvas API's [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) function was called recursively so that the animation kept going, the initial velocity was added onto the position every frame, animating the boids.

Secondly, I thought the boids/birds should not move in a straight line, but with some random changes in direction. So a changeDirectionRandomly() method is added to the Boid class. It needed a timer and a parameter which gave the boid a new velocity such the new direction is adjusted with the parameter. 

Then, the boids needed to move away from the walls in a realistic way. The solution was that a steer force would be gradually added to the velocity as the boid approaches the walls, i.e. the closer to the wall, the stronger the steer force. This was actually quite an easy solution to avoiding walls, the end result was nice enough.

After these steps, I wrote the three rules of Boids Algorithm: alignment, cohesion, separation to the Boid class and added these new combined velocity before moving the boid. The boids started to act like flocks. With the ability to avoid from walls, the flocks looks realistic enough and the simulation result was great.

## Control Panel

In order to grasp the rules of and understand the algorithm better. I decided to add a control panel to the page such that several critical parameters could be adjusted in real time where users would play around with the simulation and feel the impacts of different parameters.

These five adjustable parameters were added in the control panel with appropriate UI:

1. Number of Boids
2. Maximum Speed
3. Radom Direction Changing Factor
4. Perception Radius
5. Separation Radius

The parameters changes were in real time. The slider component needed a debounce functionality for better rendering and performance, thus I added a 500ms debounce to them. It was really fun to watch how flocks started to gather around into bigger crowd, split to smaller groups, change to different speeds as we adjusted the factors. 

## Throttle to 60 FPS

All of these code and methods are working great. But when I was playing around with the control panel, I found out the strange behavior of boids having a higher speed every time I adjusted a parameter despite of my speedLimit() method on Boid class.

After some debugging and readings into Canvas API, I figured the culprit was a higher FPS every time a parameter was adjusted. Then I added a real time FPS display to the page and it proved me correct. The canvas was rendering at a higher FPS gradually and since the visual speed of boids are FPS times velocity, they looked like they are moving faster and faster.

The solution was quite simple, a throttle of 60 FPS is set for the animation. It implemented such that with a time gap that is lower than 1000 / 60 = 16.66ms, the animation would render the next frame, giving us the throttle we needed.

After the fix, boids would move at constant visual speed regardless of parameter adjustments, but only responded to the adjustment of maximum speed.

## Some Comments

It is quite interesting that three simple rules applying to individuals can generalize the movements for groups also. 

While looking at flocks of birds or schools of fishes, the balance between individuality and similarity is easily relatable to the observer whereas such an individual person lives under social norms. 

The three rules of Boids Algorithm: alignment, cohesion and separation could also be applied to ourselves examining how we interacted with surrounding crowds and made changes to better adapt into the group. 
