import Head from 'next/head'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import ContactButtons from '@/components/contactButtons'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Chensheng Xu</title>
        <meta name="description" content="Personal portfolio website of Chensheng Xu" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <article className='prose px-2 py-4 md:py-0 dark:prose-invert'>
        <div className='flex flex-row items-center gap-4'>
          <Image 
            src="/Avatar.jpg"
            className='rounded-full my-0'
            alt="Picture of Chensheng Xu"
            width={100}
            height={100}
            // placeholder='blur'
          />
          <div className='flex flex-col'>
            <h1 className='font-medium my-2'>Chensheng Xu</h1>
            <Link href="http://github.com/luuu-xu" className='flex items-center gap-2'>
              <Image 
                src="/GithubIcon.png"
                className='my-0 dark:invert'
                alt="Github Icon"
                width={20}
                height={20}
                />
              luuu-xu
            </Link>
          </div>
        </div>
        <hr className="my-4 dark:border-gray-200" />
        <p>
          Hi! I'm Chensheng Xu, a passionate <b>self-starter.</b>
        </p>
        <p>
          I love to learn and make things.         
          From custom-made leather <a href='http://xuleathers.com'>products</a> to full-stack <a href='https://odinbook-client-production-9219.up.railway.app/'>websites</a>.
        </p>
        <p>
          I always have the urge to learn and create, now I am eager to work and contribute to the exciting dynamic world of web development and <b>software engineering</b>.
        </p>
        <hr className="my-4 dark:border-gray-200" />
        <p>
          I love to read, from Chinese literacy to political philosophy, anthropology and history to science fictions. I would read about 50 books a year.
          Although I don't write a lot previously, I plan to start writing more in the <a href='/blog'>blog</a> section of this website.
        </p>
        <ContactButtons />
      </article>
    </>
  )
}
