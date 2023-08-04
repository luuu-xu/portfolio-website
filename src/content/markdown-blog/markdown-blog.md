---
title: How to Add Markdown Blog Feature to Your Next.js Website
publishedAt: 2023-4-21
---

![A typewriter](/blogImages/markdown-blog/laura-chouette-6tdfx_gvHf0-unsplash.jpg)

In this blog post I am going to show you how I implemented this [Markdown blog](/blog) feature on my Next.js portfolio website. This is going to be my first "tutorial-like" blog, hopefully this will make sense to anybody reading it and I am going to try my best.

I am going to skip the introduction why you need a markdown blog feature on your website (since you are reading this), I am assuming you want it. And I am going to show you a list of what this markdown blog feature does and why it is worthy recommending.

## Features

1. A [BlogIndex](/blog) page where a list of blogs are displayed with Title, Published Date and more.
2. A single page for each [Blog](/blog/markdown-blog) where the `<article />` has the Markdown content and is styled automatically.
3. Write your blog in `example.md` markdown file and store any **images/screenshots** alongside and the lib function will copy them into the `/public` folder for Next.js to render.

## File Structure

Assuming you already have your portfolio website built with Next.js, the structure relating to this blog feature would look like: 

```markdown
src
├── content
│   ├── test-md
│   │   ├── test-md.md
│   │   └── test-png.png
│   └── example-blog
│       ├── example-blog.md
│       └── bird.png
├── pages
│   └── blog
│       ├── index.js
│       └── [slug].js
├── lib
│   └── blogmd.js
└── bin
    └── copy-images.mjs
```

As you see, inside `/content` folder are a bunch of folders of "blog post" named intended for the url slug, such as `/content/test-md` or `/content/example-blog`. Inside each folder we have the markdown file with the same name. We also have a bunch of images that we referenced in our markdown file.

In our `/pages` folder, you would possibly have some of your own pages written up. But we need to add the `/pages/blog` folder which we are going to add `/pages/blog/index.js` the index page and `/pages/blog/[slug].js` the url slug pages by [Dynamic Routing](https://nextjs.org/docs/routing/dynamic-routes).

Below we have `/lib/blogmd.js` which contains some helper functions that reads and parses our markdown files. As well as `/bin/copy-images.mjs` which copies our images of each blog to the `/public` folder for Next.js to use when built and deployed.

## Markdown Content

1. Go ahead and create some folders of markdown files under `/content` folder. For example, we can create `/content/test-md/test-md.md` for testing purpose.

If you are new to markdown, take a look at the [Markdown Guide](https://www.markdownguide.org). And maybe open the [Cheat Sheet](https://www.markdownguide.org/cheat-sheet/) on the side when you are writing in .md just as I am doing now.

```markdown
---
title: 'The First Test Blog in Markdown'
publishedAt: 2022-4-12
---

This is a test blog written in md.

Here is a list:
- Something
- Something else

> This is a quote
```

2. In order to read the markdown files, we need to update the `next.config.js` to include .md files:

```jsx
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
}

module.exports = nextConfig
```

## Helper Functions and Blog Pages

Now it is the time to create the Blog Index Page and slug pages for each blog markdown files. But before that, we need some helpers to parse the markdown files. To do that, we need [gray-matter](https://github.com/jonschlinkert/gray-matter) to parse front matter and convert YAML into an object.

1. Go ahead and install gray-matter:

```jsx
npm install gray-matter
```

2. Create the `/lib/blogmd.js` file and add some of our helper functions:

```jsx
const fs = require("fs");
const path = require("path");
const matter = require('gray-matter');

// Get full path to the content directory of blogs folders, in this case /src/content
export function getPath(contentFolder) {
  return path.join(process.cwd(), `/${contentFolder}`);
}

// Get the markdown file data from its parent folder with the same name in the content directory
export function getFileContent(folderName, contentFolder) {
  const BLOGS_DIRS_PATH = getPath(contentFolder);

  // Create the full path to the .md file
  const filePath = path.join(BLOGS_DIRS_PATH, folderName, `${folderName}.md`);
  const fileData = fs.readFileSync(filePath, "utf-8");
  return fileData;
}
```

`getPath(contentFolder)` will create the full path to the content folder to use later, in our case, whenever we call this function we should call it with 'src/content'.

Notice `process.cwd()` returns the [current working folder](https://nodejs.org/api/process.html#processcwd) of the Node.js process when the website is deployed on a server service of your choice.

`getFileContent(folderName, contentFolder)` function will take both the slug name of the blog markdown file (also its parent folder's name), and again `contentFolder` ('src/content'). It will then read the file and return the file data for us to process next.

3. To process the markdown file data, we will now add this function to `/lib/blogmd.js`:

```jsx
// Get a single blog from the content folder with the given slug
export function getSingleBlog(slug, contentFolder) {
  const source = getFileContent(slug, contentFolder);
  const { data, content } = matter(source);
  return {
    meta: data,
    content: content,
  }
}
```

This function uses `matter(source)` to parse the data and return an object including:

- `data`: the meta data at the top of our markdown file, includes `title` and `publishedAt` in this case.
- `content`: the content of the markdown file.

4. Then we add another function to read and return an array of blogs data:

```jsx
// Get all blogs from the content folder
export function getAllBlogs(contentFolder) {
  const BLOGS_DIRS_PATH = getPath(contentFolder);

  // Get a list of all blog folders' names
  let folderNames = fs.readdirSync(BLOGS_DIRS_PATH);

  // Filter out the hidden files, this relates to MacOS system
  folderNames = folderNames.filter((fileName) => !fileName.startsWith('.'));

  // Using gray-matter to parse the markdown file and return meta, content and slug
  const blogs = folderNames.map((folderName) => {
    const source = getFileContent(folderName, contentFolder);
    const { data, content } = matter(source);
    return {
      meta: data,
      content: content,
      slug: folderName,
    }
  });
  return blogs;
}
```

Now whenever we call `getAllBlogs(contentFolder)`, we will get an array of objects which contains all of the data we parsed from our markdown files, including `meta`: to use for titles or published dates, `content`: to render the main content and `slug`: to use in url slugs.

## Blog Pages

I am sure you have basic knowledge of creating [pages](https://nextjs.org/docs/basic-features/pages) in Next.js as well as [Dynamic Routes](https://nextjs.org/docs/routing/dynamic-routes). We are going to do exactly that.

### Blog Index Page

First let's create the Blog Index Page at `base_url/blog`, where a list of blog titles and date published are displayed:

We are going to use [Static Site Generation](https://nextjs.org/docs/basic-features/data-fetching/get-static-props) for the blog index page. 

1. Go ahead and create `src/pages/blog/index.js` for the blog index page.

```jsx
import { getAllBlogs } from "@/lib/blogmd";

export async function getStaticProps() {
  const blogs = getAllBlogs('src/content');
  blogs.sort((a, b) => {
    if ((new Date(a.meta.publishedAt)) > new Date(b.meta.publishedAt)) {
      return -1;
    }
    return 1;
  });

  return {
    props: {
      blogs: blogs,
    }
  }
}
```

Inside `getStaticProps()` function, we will call our helper function `getAllBlogs(contentFolder)` and then sort the blogs by descending order of the published date from `meta.publishedAt`. Note that the function returns `blogs` in props, which is an array of blog data for the next BlogPage function to use.

2. Then we need to write the main function for our index page:

```jsx
import Link from "next/link";

export default function BlogPage({ blogs }) {
  return (
      <div>
        <h1>Blog</h1>
        <ul>
          {blogs.map((blog) => (
            <li key={blog.slug}>
              <Link href={`/blog/${blog.slug}`}>
                <h2>{blog.meta.title}</h2>
                <span>{blog.meta.publishedAt}</span>
              </Link>
          </li>
          ))}
        </ul>
      </div>
  );
}
```

This is a simple function where an unordered list of `<Link>` to each blog post are displayed. We use `blog.slug` for the url of individual blog page, e.g. `base_url/blog/test-md` would now render out the test-md.md content.

### Blog [slug] Page

Since we have the blog index page to redirect to each blog post, now we need to create the blog pages with some of Next.js's amazing features.

1. Create `src/pages/blog/[slug].js` and add the following functions:

```jsx
import { getAllBlogs, getSingleBlog } from '@/lib/blogmd';

export async function getStaticPaths() {
  const blogs = getAllBlogs('src/content');
  const paths = blogs.map((blog) => ({
    params: {
      slug: blog.slug,
    },
  }))
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const blog = getSingleBlog(context.params.slug, 'src/content');
  return {
    props: {
      blog: blog
    },
  }
}
```

For someone with Next.js experience, this would be easy to understand. 

`getStaticPaths()` function will define a [list of paths](https://nextjs.org/docs/basic-features/data-fetching/get-static-paths) that will be statically generated. In our case, we call `getAllBlogs(contentFolder)` and get an array of blogs and we will create our paths from `blog.slug`, as it matches the redirect url from our blog index page's links.

`getStaticProps()` will use the slug to then call `getSingleBlog(folderName, contentFolder)`, which just to remind you, takes two parameters: `folderName` the name of the blog folder, and `contentFolder` the parent folder of these blog folders. In our case we call `getSingleBlog(slug, 'src/content')` to get the blog data.

2. Now we need to install [react-markdown](https://github.com/remarkjs/react-markdown), to take a string of markdown and it’ll safely render to React elements. The benefits are in their documentation and you can read about it too.

```jsx
npm install react-markdown
```

3. Then let's write our Blog page function, don't forget to import `ReactMarkdown` too.

```jsx
export default function Blog({ blog }) {
  return (
    <article>
      <h1>{blog.meta.title}</h1>
      <p>{blog.meta.publishedAt}</p>
      <ReactMarkdown>{blog.content}</ReactMarkdown>
    </article>
  );
}
```

Again a simple function to understand, this `<article>` will include our title, published date and the main content which is rendered by `<ReactMarkdown>`. Just to recall, in our `getSingleBlog()` helper function, it will return these data after parsing with [gray-matter](https://github.com/jonschlinkert/gray-matter), which we used in the blog function.

```jsx
export function getSingleBlog(slug, contentFolder) {
  const source = getFileContent(slug, contentFolder);
  const { data, content } = matter(source);
  return {
    meta: data,
    content: content,
  }
}
```

4. Now your markdown blog is rendered correctly! Great!

## Styling

Now you are probably thinking about styling your blog pages. You can go ahead and use CSS or any frameworks you like to style the components of your markdown blog.

What I use is [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin) plugin which automatically style the HTML elements from my markdown just by adding `class="prose"` to my `<article>`.

Give their documentations a read and have a try. It looks nice and you can add [Dark Mode](https://tailwindcss.com/docs/typography-plugin#adapting-to-dark-mode) super easily too.

## Images in Markdown

Adding images in markdown file is easy, just like so:

```markdown
![test-png](/blogImages/test-md/test-png.png)
```

Note that the base url of the image needs to be the `public` folder, according to [Static File Serving](https://nextjs.org/docs/basic-features/static-file-serving). 

But it would be extremely painful for us to stay in the flow of writing our markdown content, if we need to add the image to the corresponding blog folder inside the public folder (if you want it well structured), e.g. `public/blogImages/test-md`.

Therefore let's write a Node.js script that is going to automatically copy our images from `src/content/test-md` to `public/blogImages/test-md` when the website is built and deployed:

1. Go ahead and create `src/bin/copy-images.mjs`, and add the following functions:

```jsx
import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';

const fsPromises = fs.promises;
const targetDir = path.join(process.cwd(), 'public/blogImages');
const blogsDir = path.join(process.cwd(), 'src/content');

async function createPostImageFoldersForCopy() {
  // Get every blog folder: blog-one, blog-two etc.
  let blogsSlugs = await fsPromises.readdir(blogsDir);
  
  // Get rid of MacOS's .DS_Store hidden file
  blogsSlugs = blogsSlugs.filter((slug) => !slug.startsWith('.'));

  for (const slug of blogsSlugs) {
    const allowedImageFileExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

    // Read all files inside current blog folder
    const blogDirFiles = await fsPromises.readdir(`${blogsDir}/${slug}`);

    // Filter out files with allowed file extension (images)
    const images = blogDirFiles.filter(file =>
      allowedImageFileExtensions.includes(path.extname(file)),
    );

    if (images.length) {
      // Create a folder for images of this post inside public
      await fsPromises.mkdir(`${targetDir}/${slug}`);

      await copyImagesToPublic(images, slug);
    }
  }
}

async function copyImagesToPublic(images, slug) {
  for (const image of images) {
    await fsPromises.copyFile(
      `${blogsDir}/${slug}/${image}`,
      `${targetDir}/${slug}/${image}`
    );
  }
}

await fsExtra.emptyDir(targetDir);
await createPostImageFoldersForCopy();
```

The functions in this script are basically reading allowed files (png, jpg, jpeg, gif) inside every blog folder, and copy them to a corresponding folder in the targeted folder for blog images in the public folder.

2. Then update your `package.json` so the script runs during the [pre-build](https://docs.npmjs.com/cli/v9/using-npm/scripts#pre--post-scripts) stage:

```jsxon
"scripts": {
  "copyimages": "node ./src/bin/copy-images.mjs",
  "prebuild": "npm run copyimages",
  "dev": "next dev",
  "build": "next build",
}
```

3. Now if you run `npm run build`, the images will be copied to the public folder automatically.

## Conclusion

From when I started trying Next.js, I liked it immediately for its various features and library content. 

I am sure there are a lot of ways of implementing a Markdown blog feature in your Next.js project. But these are what I have come up with after going through a lot of readings and documentations. 

Hopefully you learned something from this blog, written in Markdown. 😎

---

Possible updates:
- Adding [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) for code block styles.
- Creating a repo of a template of this blog so it can work right off the start.

---

This blog post is also published on Medium [here](https://luuu-xu.medium.com/how-to-add-markdown-blog-feature-to-your-next-js-website-c036ad4d17d7). 

[How to Add Markdown Blog Feature to Your Next.js Website](https://luuu-xu.medium.com/how-to-add-markdown-blog-feature-to-your-next-js-website-c036ad4d17d7)

During my self-learning journey of programming, I have read a ton of Medium articles and they all more or less helped me. These posts are actually the most important force pushing me writing this blog and I appreciate them a lot!

---

Photo by [Laura Chouette](https://unsplash.com/@laurachouette?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/6tdfx_gvHf0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText).