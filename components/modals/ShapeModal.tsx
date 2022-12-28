import React, { useState } from 'react'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faClose} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectSignboard, setSignboardColor, setSignboardShape } from '../../reducers/signboardSlice';
import { setSelectedOption } from '../../reducers/toolbarSlice';



const ShapeModal: React.FC = () => {
   const [selectedShape, setSelectedShape] = useState(useSelector(selectSignboard).shape)
    const shapes = [
        {
        name: "Rectangle",
        key: 0
        },
        {
        name: "Rounded Rectangle",
        key: 1
        },
        {
        name: "Oval",
        key: 2
        },
    ]
   const dispatch = useDispatch()

  const handleShapeChange = (shape:string) => {
    setSelectedShape(shape)
    dispatch(setSignboardShape({shape}))

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
          {shapes.map(shape => {
            if(shape.name === selectedShape){
              return(<div key={shape.key} className='w-full bg-slate-400'>{shape.name}</div>)
            }else{
              return(<div key={shape.key} onClick={() => handleShapeChange(shape.name)} className='w-full bg-white'>{shape.name}</div>)
            }
          })}
    </div>
   </div>
  );
};

export default ShapeModal;