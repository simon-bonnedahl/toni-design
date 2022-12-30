import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import logo from '../public/toni-logo.png'

const Navbar: React.FC = () => {

  return (
   
    <div className='flex justify-between items-center w-full h-20 border pl-12 pr-1'>
      {/*Logo*/}
      <div className='w-20 h-20'>
      <Link href="https://www.tonireklam.se/">
          <Image
            src={logo}
            alt="Logo"
            className="object-cover cursor-pointer"
          />
      </Link>
      </div>
      {/*Shopping cart*/}
      <div className='flex space-x-2 mr-4 border rounded-lg border-gray-300 px-6 py-4 hover:cursor-pointer hover:scale-110 ease-in-out duration-300 hover:border-black'>
        <FontAwesomeIcon icon={faShoppingCart} className="w-6 h-6" color='#333'/>
        <span>1</span>
      </div>
    </div>
  )
};

export default Navbar;