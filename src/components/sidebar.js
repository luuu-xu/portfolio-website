import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const navLinks = {
  "/": {
    name: "home",
  },
  "/about": {
    name: "about",
  },
  "/projects": {
    name: "projects",
  },
  "/blog": {
    name: "blog",
  },
  "/contact": {
    name: "contact",
  },
};

export default function SideBar() {
  return (
    <aside>
      <nav className="flex flex-col flex-wrap pr-2 md:sticky md:top-20">
        <SideBarHomeLink />
        <SideBarList />
      </nav>
    </aside>
  );
}

function SideBarHomeLink() {
  return (
    <Link className="pl-2 text-3xl md:w-auto" href="/" aria-label="home">
      <img src="/favicon.ico" alt="" className="w-10 md:w-20 aspect-square dark:invert" />
    </Link>
  );
}

function SideBarList() {
  const [activeNavLink, setActiveNavLink] = useState('/');
  const router = useRouter();

  useEffect(() => {
    const nav = '/' + getNavFromURLPathname(router.pathname);
    setActiveNavLink(nav);
  });

  return (
    <ul className="flex flex-row md:flex-col">  
      {Object.keys(navLinks).map((link) => (
        <SideBarLink key={link} link={link} activeNavLink={activeNavLink} />
      ))}
    </ul>
  );
}

function getNavFromURLPathname(pathname) {
  const nonEmptyPathnameArray = pathname.split('/').slice(1);
  return nonEmptyPathnameArray[0];
}

function SideBarLink({ link, activeNavLink }) {
  return (
    <li 
      key={link} 
      className={`rounded px-2 py-1 hover:text-black
        ${activeNavLink === link ? 
        'bg-gray-100 dark:bg-neutral-800' : 
        ''}`
      }
    >
      <Link 
        href={link}
        className={`font-medium hover:text-black dark:hover:text-gray-200
          focus-brand
          ${activeNavLink === link ? 
          'dark:text-gray-200 text-black' : 
          'dark:text-neutral-400 text-neutral-500'}`
        }
        aria-current={activeNavLink === link ? 'page' : 'false'}
      >
        {navLinks[link].name}
      </Link>
    </li>
  );
}