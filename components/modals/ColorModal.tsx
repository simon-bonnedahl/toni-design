import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faClose} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectSignboard, setSignboardColor } from '../../reducers/signboardSlice';
import { setSelectedOption } from '../../reducers/toolbarSlice';



const ColorModal: React.FC = () => {
   const [selectedColor, setSelectedColor] = useState(useSelector(selectSignboard).color)

   const dispatch = useDispatch()

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let color = event.target.value    
    setSelectedColor(color)
    dispatch(setSignboardColor({color}))

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
     <label>
              Choose a color:
              <input
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
              />
            </label>
   </div>
  );
};

export default ColorModal;