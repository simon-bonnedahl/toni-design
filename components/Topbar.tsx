import React from 'react'
import { useSelector } from 'react-redux';
import { selectSignboard } from '../reducers/signboardSlice';


const Topbar: React.FC = () => {
  const signBoard = useSelector(selectSignboard)

  return (
   
    <div className='w-full h-20 border '>

    <div className='flex space-x-4 items-center h-full float-right px-4'>
      <div>
      Width: {signBoard.width}
      </div>
      <div>
      Height: {signBoard.height}
      </div>
    </div>
    </div>
  );
};

export default Topbar;