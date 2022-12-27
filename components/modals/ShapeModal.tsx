import React, { useState } from 'react'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faClose} from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { setSignboardColor } from '../../reducers/signboardSlice';
import { setSelectedOption } from '../../reducers/toolbarSlice';



const ShapeModal: React.FC = () => {
   const [selectedShape, setSelectedShape] = useState('Rectangle')
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

  const handleShapeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let shape = event.target.value    
    setSelectedShape(shape)
    dispatch(setSignboardColor({shape}))

  }

  const handleClose = () => {
    let selectedOption = null
    dispatch(setSelectedOption({selectedOption}))
  }

  return (
    <div className='absolute top-40 z-50 left-40 w-96 h-64 bg-white shadow-lg flex rounded-lg'>
     <div onClick={() => handleClose()} >
     <FontAwesomeIcon className="w-8 h-8" icon={faClose}/>
     </div>
     <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
        <select multiple id="countries_multiple" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {shapes.map(shape => (
                <option key={shape.key}>{shape.name}</option>
            ))}
            
        </select>
     
   </div>
  );
};

export default ShapeModal;