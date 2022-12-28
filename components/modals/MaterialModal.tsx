import React, { useState } from 'react'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faClose} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectSignboard, setSignboardColor, setSignboardMaterial } from '../../reducers/signboardSlice';
import { setSelectedOption } from '../../reducers/toolbarSlice';



const MaterialModal: React.FC = () => {
   const [selectedMaterial, setSelectedMaterial] = useState(useSelector(selectSignboard).material)
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

  const handleMaterialChange = (material:string) => { 
    console.log("xd")  
    setSelectedMaterial(material)
    dispatch(setSignboardMaterial({material}))

  }

  const handleClose = () => {
    let selectedOption = null
    dispatch(setSelectedOption({selectedOption}))
  }
  console.log(selectedMaterial)

  return (
    <div className='absolute top-40 z-50 left-40 w-96 h-64 bg-white shadow-lg flex rounded-lg'>
     <div onClick={() => handleClose()} >
     <FontAwesomeIcon className="w-8 h-8" icon={faClose}/>
     </div>
     <div className='flex flex-col w-full'>
        {materials.map(material => {
          if(material.name === selectedMaterial){
            return(<div key={material.key} className='w-full bg-slate-400'>{material.name}</div>)
          }else{
            return(<div key={material.key}  onClick={() => handleMaterialChange(material.name)} className='w-full bg-white'>{material.name}</div>)
          }
        })}
     </div>
   </div>
  );
};

export default MaterialModal;