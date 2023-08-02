import Head from "next/head";
import ContactButtonsContainer from "@/components/contactButtonsContainer";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>contact | Chensheng Xu</title>
      </Head>
      <article className="prose px-2 py-4 md:py-0 dark:prose-invert">
        <h1 className="font-medium my-2 md:mt-0">Contact</h1>
        <p>
          Ways of getting in touch with me
        </p>
        <hr className="my-4 dark:border-gray-200" />
        <p>
          Here is a copy of my <a href="/Chensheng-Xu-Resume.pdf" download>resume</a>{". (PDF, 75Kb)"}
        </p>
        <ContactButtonsContainer />
      </article> 
    </>
  );
}