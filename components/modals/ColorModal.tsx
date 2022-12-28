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
    dispatch(setSelectedOption({selectedOption: null}))
  }

  

  return (
    <div className='absolute top-40 z-50 left-40 w-96 h-16 bg-white shadow-lg flex rounded-lg'>
     <div className="absolute -top-3 -left-3 bg-red-500 rounded-full z-50 hover:scale-110 ease-in-out duration-300" onClick={() => handleClose()} >
     <FontAwesomeIcon className="w-8 h-8 p-1" icon={faClose} color="#fff"/>
     </div>
      <div className='flex w-full p-5'>
        <label>
                Color:
                <input
                  className='rounded-lg ml-4'
                  type="color"
                  value={selectedColor}
                  onChange={handleColorChange}
                />
        </label>
      </div>
   </div>
  );
};

export default ColorModal;