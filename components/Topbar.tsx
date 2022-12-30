import { faMagnifyingGlassMinus, faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectSignboard, signboardZoom } from '../reducers/signboardSlice';
import { setSelectedOption } from '../reducers/toolbarSlice';

const Topbar: React.FC = () => {
  const signBoard = useSelector(selectSignboard)
  const dispatch = useDispatch()

  const handleZoomOut = () => {
    //dispatch(signboardZoom({zoom:"out"}))

  }
  const handleZoomIn = () => {
    //dispatch(signboardZoom({zoom:"in"}))
  }
  return (
   
    <div className='flex flex-row justify-between  w-screen h-20 shadow-lg z-50'>
      {/*Zoom*/}

      <div className="flex items-center h-full pl-4 space-x-2 w-fit ml-40">
        <div onClick={handleZoomOut} className='bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:scale-110 ease-in-out duration-300 hover:cursor-pointer'>
          <FontAwesomeIcon className="w-6 h-6" icon={faMagnifyingGlassMinus}/>
        </div>
         <div onClick={handleZoomIn} className='bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center  hover:scale-110 ease-in-out duration-300 hover:cursor-pointer'>
          <FontAwesomeIcon className="w-6 h-6" icon={faMagnifyingGlassPlus}/>
        </div>
      </div>
    {/*Size*/}
    <div onClick={() => dispatch(setSelectedOption({selectedOption: 2}))} className='flex space-x-4 items-center h-full hover:cursor-pointer pr-6'>
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