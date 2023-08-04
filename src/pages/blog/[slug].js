import { getAllBlogs, getSingleBlog } from '@/lib/blogmd';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

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
      <BlogArticle blog={blog} />
    </>
  );
}

function BlogArticle({ blog }) {
  return (
    <article className='prose dark:prose-invert'>
      <BlogArticleHeader title={blog.meta.title} publishedAt={blog.meta.publishedAt} />
      <BlogArticleMain content={blog.content} />
    </article>
  );
}

function BlogArticleHeader({ title, publishedAt }) {
  return (
    <>
      <h1 className='text-xl md:text-3xl font-medium my-2 md:mt-0'>{title}</h1>
      <p className='my-2'>{publishedAt}</p>
    </>
  );
}

function BlogArticleMain({ content }) {
  return (
    <ReactMarkdown
      components={{
        code({node, inline, className, children, ...props}) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              children={String(children).replace(/\n$/, '')}
              style={coldarkDark}
              customStyle={{
                fontSize: 'inherit',
                backgroundColor: 'var(--tw-prose-pre-bg)',
                padding: 0,
                margin: 0,
              }}
              showLineNumbers={false}
              language={match[1]}
              PreTag="div"
            />
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          )
        },
        img({node, ...props}) {
          return <img {...props} className='mx-auto' />
        },
        hr() {
          return <hr className='my-6' />
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}