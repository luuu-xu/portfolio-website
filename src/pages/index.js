import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Image from 'next/image'
import Avatar from '../images/Avatar.jpg'
import GithubIcon from '../images/GithubIcon.png'
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
            src={Avatar}
            className='rounded-full my-0'
            alt="Picture of Chensheng Xu"
            width={100}
            height={100}
            placeholder='blur'
          />
          <div className='flex flex-col'>
            <h1 className='font-medium my-2'>Chensheng Xu</h1>
            <Link href="http://github.com/luuu-xu" className='flex items-center gap-2'>
              <Image 
                src={GithubIcon}
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
          I always have the urge to learn and create, now I am eager to work and contribute to the exciting dynamic world of web development and software engineering.
        </p>
        {/* <hr className="my-4 dark:border-gray-200" />
        <p>
          Here is my <a href="/Chensheng-Xu-Resume.pdf" download>resume</a>{" (PDF, 75Kb)."}
        </p>
        <hr className="my-4 dark:border-gray-200" /> */}
        <ContactButtons />
      </article>
    </>
  )
}
