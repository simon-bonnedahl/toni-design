import React, { useState } from 'react'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { setSignboard, setSignboardHeight, setSignboardWidth } from '../../reducers/signBoardSlice';



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
  return (
   <div className='absolute top-40 z-50 left-40 w-96 h-64 bg-white shadow-lg flex rounded-lg'>
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