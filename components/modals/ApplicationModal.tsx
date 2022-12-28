import React, { useState } from 'react'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faClose} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectSignboard, setSignboardColor, setSignboardMaterial } from '../../reducers/signboardSlice';
import { setSelectedOption } from '../../reducers/toolbarSlice';



const ApplicationModal: React.FC = () => {
   const [selectedProduct, setSelectedProduct] = useState(useSelector(selectSignboard).product)
    const products = [
        {
        name: "Skylt",
        key: 0
        },
        {
        name: "Gravyr",
        key: 1
        },
        
    ]
   const dispatch = useDispatch()

  const handleProductChange = (p:string) => { 
    setSelectedProduct(p)
    dispatch(setSignboardMaterial({p}))

  }

 const handleClose = () => {
    dispatch(setSelectedOption({selectedOption: null}))
  }

  return (
    <div className='absolute top-40 z-50 left-40 w-96 h-64 bg-white shadow-lg flex rounded-lg'>
     <div className="absolute -top-3 -left-3 bg-red-500 rounded-full z-50 hover:scale-110 ease-in-out duration-300" onClick={() => handleClose()} >
     <FontAwesomeIcon className="w-8 h-8 p-1" icon={faClose} color="#fff"/>
     </div>
     <div className='flex flex-col w-full p-5 space-y-2'>
        {products.map(product => {
          if(product.name === selectedProduct){
            return(<div key={product.key} className='w-full bg-slate-400'>{product.name}</div>)
          }else{
            return(<div key={product.key}  onClick={() => handleProductChange(product.name)} className='w-full bg-white'>{product.name}</div>)
          }
        })}
     </div>

   </div>
  );
};

export default ApplicationModal;