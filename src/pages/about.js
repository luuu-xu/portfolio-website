import Head from "next/head";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>about | Chensheng Xu</title>
      </Head>
      <article className="prose px-2 py-4 md:py-0 dark:prose-invert">
        <h1 className="font-medium my-2 md:mt-0">About me</h1>
        <p>
          Hi! I'm Chensheng Xu, a passionate <b>self-starter.</b>
        </p>
        <hr className="my-4 dark:border-gray-200" />
        <p>
          I started my online business <a href="http://xuleathers.com">xuleathers</a> during university out of <b>passion</b>, 
          and continued the entrepreneurship into a full-time business after graduated from University of Toronto after 2018.
          My main focus was hand-making high-end custom-ordered leather products for my clients in the world.
          From women's handbags in alligator skin to men's bi-fold wallets in natural veg-tan leathers, 
          I've made a lot of clients happy with custom-orders from ideas and sketches or classic iconic pieces.
        </p>
        <p>
          My journey of learning web-development started out of interests and <b>curiosity</b> in 2022.
          While building websites and webshops for my business using Saas, I became curious and interested in how websites are developed.
          I began learning full-stack JavaScript and various frameworks on the side with an open-source curriculum called <a href="https://www.theodinproject.com">The Odin Project</a>, 
          including HTML/CSS, JavaScript, and React.js, etc,
          and have since implemented these technologies in a number of personal projects.
        </p>
        <hr className="my-4 dark:border-gray-200" />
        <p>
          The most recent project <a href="https://odinbook-client-production-9219.up.railway.app/">Odinbook</a> was a full-stack MERN Facebook-clone website developed with RESTful API first and Next.js, deployed on Railway.
        </p>
        <hr className="my-4 dark:border-gray-200" />
        <p>
          My experience as an entrepreneur has honed my critical thinking and <b>problem-solving</b> skills, 
          while my journey into web development has given me a deeper understanding of software engineering principles and the ability to design and build complex web applications. 
          I am eager to <b>continue learning</b> and adapting to the ever-evolving landscape of web development, 
          and am excited to contribute my skills and knowledge to the industry's efforts to design, program, 
          and provide amazing services for everyone.
        </p>
        <hr className="my-4 dark:border-gray-200" />
        <p>
          Here is a copy of my <a href="/Chensheng-Xu-Resume.pdf" download>resume</a>{". (PDF, 75Kb)"}
        </p>
        <hr className="my-4 dark:border-gray-200" />
        <p>
          Sports and <b>nature</b> are my interests too. I love to hike in nature and explore the landscape and beautiful wildlife (sadly Toronto does not have a lot of amazing hiking sites).
          I am a certified PADI Divemaster and I absolutely love the amazingly diversified sea life. 
          For the past year I have been playing Badminton at out local community center, coaching my partner and I am proud that now she plays much better than she initially started.
        </p>
      </article>
    </>
  );
}