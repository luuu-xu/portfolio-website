import Link from 'next/link';
import Image from 'next/image';

const contactsData = [
  {
    text: "Github",
    iconSrc: "/GithubIcon.png",
    url: "https://github.com/luuu-xu",
  },
  {
    text: "LinkedIn",
    iconSrc: "/LinkedinIcon.png",
    url: "https://www.linkedin.com/in/chensheng-xu",
  },
  {
    text: "Email",
    iconSrc: "/EmailIcon.png",
    url: "mailto:chensheng.xuxu@gmail.com",
  },
];

export default function ContactButtonsContainer() {
  return (
    <div className='flex flex-col gap-2 md:flex-row'>
      {contactsData.map((contact) => (
        <ContactButton key={contact.text} contact={contact} />
      ))}
    </div>
  );
}

function ContactButton({ contact }) {
  return (
    <Link href={contact.url} 
      className='flex items-center justify-between gap-2 border rounded-lg p-4 w-full font-normal
      hover:bg-neutral-100 no-underline dark:hover:bg-neutral-800 dark:border-neutral-700'
    >
      <div className='flex flex-row items-center gap-2'>
        <Image 
          src={contact.iconSrc}
          className='my-0 dark:invert'
          alt=""
          width={20}
          height={20}
        />
        {contact.text}
      </div>
      <span className="material-symbols-outlined" aria-hidden="true">
        arrow_outward
      </span>
    </Link>
  );
}