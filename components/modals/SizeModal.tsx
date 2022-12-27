import React, { useState } from 'react'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faClose} from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { setSignboardHeight, setSignboardWidth } from '../../reducers/signboardSlice';
import { setSelectedOption } from '../../reducers/toolbarSlice';



const SizeModal: React.FC = () => {
  const [width, setWidth] = useState(600)
  const [height, setHeight] = useState(200)

   const dispatch = useDispatch()

  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let width = event.target.valueAsNumber   
    setWidth(width)
    dispatch(setSignboardWidth({width}))

  }
  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let height = event.target.valueAsNumber   
    setHeight(height)
    dispatch(setSignboardHeight({height}))

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
          Choose a width:
          <input
            type="number"
            value={width}
            onChange={handleWidthChange}
            min={50}
            max={800}
            step={10}
          />
        </label>
        <br/>
        <label>
          Choose a height:
          <input
            type="number"
            value={height}
            onChange={handleHeightChange}
            min={50}
            max={1000}
            step={10}
          />
        </label>
   </div>
  );
};

export default SizeModal;