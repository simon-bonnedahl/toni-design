import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import logo from '../public/toni-logo.png'

const Navbar: React.FC = () => {

  return (
   
    <div className='w-full h-20 border '>
      <div className='w-20 h-20 ml-10'>
      <Link href="https://www.tonireklam.se/">
          <Image
            src={logo}
            alt="Logo"
            className="object-cover cursor-pointer"
          />
      </Link>
      </div>
    </div>
  )
};

export default Navbar;