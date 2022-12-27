import React from 'react'


const Toolbar: React.FC = () => {

const options = ["Size", "Color", "Text"]
  return (
   
    <div className='flex flex-col w-44 space-y-4 items-center mt-4'>
        {options.map(option =>(
            <div className='text-center font-light text-lg'>
                <div className='w-28 h-28 bg-white rounded-full shadow-2xl hover:scale-110 ease-in-out duration-300'></div>
                {option}
            </div>
        ))}
    </div>
  );
};

export default Toolbar;