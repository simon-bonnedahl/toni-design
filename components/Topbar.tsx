import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectSignboard } from '../reducers/signboardSlice';
import { setSelectedOption } from '../reducers/toolbarSlice';

const Topbar: React.FC = () => {
  const signBoard = useSelector(selectSignboard)
  const dispatch = useDispatch()

  return (
   
    <div className='w-full h-20 border '>

    <div onClick={() => dispatch(setSelectedOption({selectedOption: 2}))} className='flex space-x-4 items-center h-full float-right px-4 hover:cursor-pointer'>
      <div>
      Width: <span className='font-bold'>{signBoard.width}</span> mm
      </div>
      <div>
      Height: <span className='font-bold'>{signBoard.height}</span> mm
      </div>
    </div>
    </div>
  );
};

export default Topbar;