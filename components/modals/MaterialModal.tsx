import React, { useState } from 'react'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faClose} from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { setSignboardColor } from '../../reducers/signboardSlice';
import { setSelectedOption } from '../../reducers/toolbarSlice';



const MaterialModal: React.FC = () => {
   const [selectedMaterial, setSelectedMaterial] = useState('aluminium')
    const materials = [
        {
        name: "Aluminium",
        key: 0
        },
        {
        name: "Plastic",
        key: 1
        },
        {
        name: "Plate",
        key: 2
        },
    ]
   const dispatch = useDispatch()

  const handleMaterialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let material = event.target.value    
    setSelectedMaterial(material)
    dispatch(setSignboardColor({material}))

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
            {materials.map(material => (
                <option key={material.key}>{material.name}</option>
            ))}
            
        </select>
     
   </div>
  );
};

export default MaterialModal;