import GithubIcon from '../images/GithubIcon.png'
import LinkedIcon from '../images/LinkedinIcon.png'
import EmailIcon from '../images/EmailIcon.png'
import Link from 'next/link'
import Image from 'next/image'

export default function ContactButtons() {
  return (
    <div className='flex flex-col gap-2 md:flex-row'>
      <Link href="http://github.com/luuu-xu" 
        className='flex items-center justify-between gap-2 border rounded-lg p-4 w-full font-normal
        hover:bg-neutral-100 no-underline dark:hover:bg-neutral-800 dark:border-neutral-700'
      >
        <div className='flex flex-row items-center gap-2'>
          <Image 
            src={GithubIcon}
            className='my-0 dark:invert'
            alt="Github Icon"
            width={20}
            height={20}
          />
          Github
        </div>
        <span className="material-symbols-outlined">
          arrow_outward
        </span>
      </Link>
      <Link href="https://www.linkedin.com/in/chensheng-xu-470b9324a/" 
        className='flex items-center justify-between gap-2 border rounded-lg p-4 w-full font-normal 
        hover:bg-neutral-100 no-underline dark:hover:bg-neutral-800 dark:border-neutral-700'
      >
        <div className='flex flex-row items-center gap-2'>
          <Image 
            src={LinkedIcon}
            className='my-0 dark:invert'
            alt="LinkedIn Icon"
            width={20}
            height={20}
          />
          LinkedIn
        </div>
        <span className="material-symbols-outlined">
          arrow_outward
        </span>
      </Link>
      <Link href="mailto:chensheng.xuxu@gmail.com" 
        className='flex items-center justify-between gap-2 border rounded-lg p-4 w-full font-normal 
        hover:bg-neutral-100 no-underline dark:hover:bg-neutral-800 dark:border-neutral-700'
      >
        <div className='flex flex-row items-center gap-2'>
          <Image 
            src={EmailIcon}
            className='my-0 dark:invert'
            alt="LinkedIn Icon"
            width={20}
            height={20}
          />
          Email
        </div>
        <span className="material-symbols-outlined">
          arrow_outward
        </span>
      </Link>
    </div>
  );
}