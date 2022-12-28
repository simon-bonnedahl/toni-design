import React, { useState } from 'react'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faClose} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectSignboard, setSignboardHeight, setSignboardWidth } from '../../reducers/signboardSlice';
import { setSelectedOption } from '../../reducers/toolbarSlice';



const SizeModal: React.FC = () => {
  const [width, setWidth] = useState(useSelector(selectSignboard).width)
  const [height, setHeight] = useState(useSelector(selectSignboard).height)

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
    dispatch(setSelectedOption({selectedOption: null}))
  }

  return (
    <div className='absolute top-40 z-50 left-40 w-96 h-28 bg-white shadow-lg flex rounded-lg'>
     <div className="absolute -top-3 -left-3 bg-red-500 rounded-full z-50 hover:scale-110 ease-in-out duration-300" onClick={() => handleClose()} >
     <FontAwesomeIcon className="w-8 h-8 p-1" icon={faClose} color="#fff"/>
     </div>
     <div className='flex flex-col w-full p-5 space-y-2'>
      <div className='flex w-full justify-between'>
        <label>
          Width(mm)
          <input
            className='ml-4 w-36 rounded-lg p-1'
            type="number"
            value={width}
            onChange={handleWidthChange}
            min={50}
            max={800}
            step={5}
          />
        </label>
      </div>
      <div className='flex w-full justify-between'>
        <label>
          Height(mm)
          <input
            className='ml-4 w-36 rounded-lg p-1'
            type="number"
            value={height}
            onChange={handleHeightChange}
            min={50}
            max={800}
            step={5}
          />
        </label>
      </div>
      </div>
   </div>
  );
};

export default SizeModal;