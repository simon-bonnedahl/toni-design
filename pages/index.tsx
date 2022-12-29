import React from 'react'
import Head from 'next/head'
import Topbar from '../components/Topbar';
import Bottombar from '../components/Bottombar';
import Toolbar from '../components/Toolbar';
import Canvas from '../components/Canvas';
import Navbar from '../components/Navbar';

function Home () {
  return (
         <div>
      <Head>
        <title>Skyltmax-clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='flex flex-col bg-gray-100 w-screen h-screen'>
        
        <Navbar/>
        <Topbar/>
        {/*Middel section*/}
        <div className='flex flex-1 max-h-[80%]'>
          <Toolbar/>
          <Canvas/>
        </div>
        <Bottombar/>     
      </main>
    </div>
  )
}
export default Home