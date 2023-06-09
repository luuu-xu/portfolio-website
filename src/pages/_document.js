import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </Head>
      <body className='text-black bg-white dark:text-gray-200 dark:bg-neutral-900'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
