import Head from "next/head";
import Link from "next/link";

const projectsData = [
  {
    title: "Odinbook",
    description: "Full-stack MERN Facebook-clone website, developed RESTful API first and front-end on Next.js, deployed on Railway.",
    stack: ["React", "Next.js", "JavaScript", "MongoDB", "Node", "Express", "JWT", "Passport.js", "Jest", "Supertest", "Bootstrap"],
    repo_url: "https://github.com/luuu-xu/odinbook-client",
    live_url: "https://odinbook-client-production-9219.up.railway.app",
  },
  {
    title: "Risk Visualizer",
    description: "Front-end data visualization website with interactive Google Maps, Chart and Table, developed with Next13.",
    stack: ["Next13", "React", "Google Maps SDK", "React Table", "Chart.js", "Tailwind", "Bootstrap"],
    repo_url: "https://github.com/luuu-xu/risk-viz",
    live_url: "https://risk-viz-inky.vercel.app",
  },
  {
    title: "Blog API + Client + CMS",
    description: "Full-stack MERN Blog app with RESTful API, client-side website on Next.js and CMS on React.",
    stack: ["React", "Next.js", "TypeScript", "MongoDB", "Node", "Express", "JWT", "Passport.js", "Jest", "Bootstrap"],
    repo_url: "https://github.com/luuu-xu/blog-api",
    live_url: "",
  },
  {
    title: "Toock",
    description: "A front-end mock-up app of Tock, back-end on Firebase and Authentication by Firebase.",
    stack: ["React", "Firebase", "JavaScript", "HTML", "CSS"],
    repo_url: "https://github.com/luuu-xu/toock",
    live_url: "https://toock-32270.firebaseapp.com",
  },
  {
    title: "Find-kirby",
    description: "A front-end photo-tagging app to find Kirby! Back-end on Firebase.",
    stack: ["React", "Firebase", "JavaScript", "HTML", "CSS"],
    repo_url: "https://github.com/luuu-xu/find-kirby",
    live_url: "https://findkirby-87467.web.app",
  }
]

export default function ProjectsPage() {
  return (
    <>
      <Head>
        <title>projects | Chensheng Xu</title>
      </Head>
      <article className="prose px-2 py-4 md:py-0 dark:prose-invert">
        <h1 className="font-medium my-2 md:mt-0">Projects</h1>
        <p>
          Here are some of my full-stack JavaScript projects
        </p>
        <hr className="my-4 dark:border-gray-200" />
        <ul className="list-none pl-0">
        {projectsData.map((project) => (
          <li key={project.title} className="pl-0">
            <Link href={project.live_url} className="no-underline">
              <h3>{project.title}</h3>
            </Link>
            <p>{project.description}</p>
            <p>{project.stack.join(` | `)}</p>
            <div className="flex gap-2">
              {project.live_url && 
              <Link href={project.live_url} 
                className="flex items-center justify-between md:gap-8 border rounded-lg p-2 w-full md:w-auto font-normal 
                hover:bg-neutral-100 no-underline dark:hover:bg-neutral-800 dark:border-neutral-700"
              >
                <span className="ml-2">Live</span>
                <span className="material-symbols-outlined">
                  arrow_outward
                </span>
              </Link>}
              {project.repo_url &&
              <Link href={project.repo_url} 
                className="flex items-center justify-between md:gap-8 border rounded-lg p-2 w-full md:w-auto font-normal 
                hover:bg-neutral-100 no-underline dark:hover:bg-neutral-800 dark:border-neutral-700"
              >
                <span className="ml-2">Repo</span>
                <span className="material-symbols-outlined">
                  arrow_outward
                </span>
              </Link>}
            </div>
          </li>
        ))}
      </ul> 
      </article>
      {/* <article className="prose px-2 py-2">
        <h1 className="font-medium my-2">Skills</h1>
        <p>Some technical skills I use for my projects</p>
        <hr className="my-4 dark:border-gray-200" />
        <ul className="list-none pl-0">

        </ul>
      </article> */}
    </>
  );
}