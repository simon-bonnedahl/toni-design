import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectSignboard, setDownloadPdf, setDownloadSvg } from '../reducers/signboardSlice';

const Bottombar: React.FC = () => {

    const signBoard = useSelector(selectSignboard)
    const dispatch = useDispatch()

  return (
   
    <div className='flex flex-row w-full h-20 border items-center justify-between px-4'>
    <div className='flex space-x-4'>
      <button className=" bg-slate-300 rounded-lg p-2"onClick={() => dispatch(setDownloadSvg({downloadSvg:true}))}>Download SVG</button>
      <button className=" bg-slate-300 rounded-lg p-2"onClick={() => dispatch(setDownloadPdf({downloadPdf:true}))}>Download PDF</button>
    </div>
    {/*Price*/}
    <div>
      <span>{signBoard.price}</span> kr
    </div>
    </div>
  );
};

export default Bottombar;