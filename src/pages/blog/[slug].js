import { getAllBlogs, getSingleBlog } from '@/lib/blogmd';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';

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

export default function Blog({ blog }) {
  return (
    <>
      <Head>
        <title>{`${blog.meta.title} | Chensheng Xu`}</title>
      </Head>
      <article className='prose dark:prose-invert'>
        <h1 className='text-xl md:text-3xl font-medium my-2 md:mt-0'>{blog.meta.title}</h1>
        <p className='my-2'>{blog.meta.publishedAt}</p>
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </article>
    </>
  );
}