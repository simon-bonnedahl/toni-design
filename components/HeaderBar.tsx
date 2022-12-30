
import React from 'react'
import ThemeSwitch from './ThemeSwitch';
const HeaderBar: React.FC = () => {

  return (
   
    <div className='flex justify-end items-center w-full h-16 bg-blue-400 pl-12 pr-1 space-x-4'>
        <div className='text-white text-sm'>
            <span className='font-bold hover:cursor-pointer'>Private</span> / <span className='hover:cursor-pointer'>Company</span>
        </div>
        <ThemeSwitch/>
        <div >
        <iframe className="w-20 h-5" src="https://ghbtns.com/github-btn.html?user=simon-bonnedahl&repo=toni-design&type=star&count=true&size=medium" title="GitHub"></iframe>
        </div>
    </div>
  )
};

export default HeaderBar;