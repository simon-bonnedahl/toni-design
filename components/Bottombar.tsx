import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectSignboard, setDownloadPdf, setDownloadSvg } from '../reducers/signboardSlice';

const Bottombar: React.FC = () => {

    const signBoard = useSelector(selectSignboard)
    const dispatch = useDispatch()
    const [amount, setAmount] = useState(1)

  return (
   
    <div className='flex flex-row w-full h-28 border items-center justify-between px-4'>
    <div className='flex space-x-4'>
      <button className=" bg-slate-300 rounded-lg p-2"onClick={() => dispatch(setDownloadSvg({downloadSvg:true}))}>Download SVG</button>
      <button className=" bg-slate-300 rounded-lg p-2"onClick={() => dispatch(setDownloadPdf({downloadPdf:true}))}>Download PDF</button>
    </div>
    {/*Add to basket*/}
    

    <div className='flex items-center space-x-2'>
      <div className='mr-4'>
        <span className='font-bold text-xl'>{Math.round(signBoard.price)}</span> kr
      </div>
      <div className='flex items-center rounded-md'>
        <button disabled={amount === 0} onClick={() => setAmount(amount -1)} className="p-4 rounded-md border bg-gray-200">
          <FontAwesomeIcon className="w-3 h-3" icon={faMinus}/>

        </button>
        <div className='p-4'>
        {amount}
        </div>
        <button onClick={() => setAmount(amount +1)} className="p-4 rounded-md border bg-gray-200">
          <FontAwesomeIcon className="w-3 h-3" icon={faPlus}/>
        </button>
      </div>
      <div>
        <button className='p-3 rounded-md bg-blue-400 text-white text-light'>Add to cart</button>
      </div>
    </div>
    
      
   
    </div>
  );
};

export default Bottombar;