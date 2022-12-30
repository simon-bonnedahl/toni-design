import React from 'react'
import Head from 'next/head'


function Home () {
  return (
         <div>
      <Head>
        <title>Toni Design</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='flex flex-col bg-gray-100 w-screen h-screen'>
        <h1>HEJ</h1> 
      </main>
    </div>
  )
}
export default Home