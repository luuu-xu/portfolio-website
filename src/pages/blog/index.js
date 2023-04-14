import { getAllBlogs } from "@/lib/blogmd";
import Head from "next/head";
import Link from "next/link";

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

export default function BlogPage({ blogs }) {
  return (
    <>
      <Head>
        <title>blog | Chensheng Xu</title>
      </Head>
      <article className="prose px-2 py-4 md:py-0 dark:prose-invert">
        <h1 className="font-medium my-2 md:mt-0">Blog</h1>
        <p>
          Actually I just started writing blogs after this page was created...
        </p>
        <hr className="my-4 dark:border-gray-200" />
        <ul className="list-none pl-0">
          {blogs.map((blog) => (
            <li className="pl-0" key={blog.slug}>
              <Link className="no-underline" href={`/blog/${blog.slug}`}>
                <h2 className="text-base font-normal my-2 mb-0">{blog.meta.title}</h2>
                <span className="text-sm text-neutral-500">{blog.meta.publishedAt}</span>
              </Link>
          </li>
          ))}
        </ul>
      </article>
    </>
  );
}