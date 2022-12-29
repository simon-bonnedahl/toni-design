import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faClose, faT} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectSignboard, setSignboardColor } from '../../reducers/signboardSlice';
import { setSelectedOption } from '../../reducers/toolbarSlice';



const ColorModal: React.FC = () => {
   const [selectedColor, setSelectedColor] = useState(useSelector(selectSignboard).color)
   const signBoard = useSelector(selectSignboard)

   const engravingColors = [
    {
    front: {name: "White", value: "#ffffff"},
    back: {name: "Black", value: "#000000"},
    key: 0
    },
    {
    front: {name: "White", value: "#ffffff"},
    back: {name: "Red", value: "#ff0000"},
    key: 1
    },
    {
    front: {name: "Gold", value: "#FFD700"},
    back: {name: "Black", value: "#000000"},
    key: 2
    },
    {
    front: {name: "Silver", value: "#C0C0C0"},
    back: {name: "Black", value: "#000000"},
    key: 3
    },
    {
    front: {name: "Black", value: "#000000"},
    back: {name: "White", value: "#ffffff"},
    key: 4
    },
    {
    front: {name: "Blue", value: "#0000ff"},
    back: {name: "White", value: "#ffffff"},
    key: 5
    },
    {
    front: {name: "Red", value: "#ff0000"},
    back: {name: "White", value: "#ffffff"},
    key: 6
    },
    {
    front: {name: "Green", value: "#00ff00"},
    back: {name: "White", value: "#ffffff"},
    key: 7
    },
    

   ]

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
    <div className='absolute top-40 z-50 left-40 w-96 h-46 bg-white shadow-lg flex rounded-lg'>
     <div className="absolute -top-3 -left-3 bg-red-500 rounded-full z-50 hover:scale-110 ease-in-out duration-300" onClick={() => handleClose()} >
     <FontAwesomeIcon className="w-8 h-8 p-1" icon={faClose} color="#fff"/>
     </div>
     {signBoard.product === "Engraved Sign" ? 
      <div className='flex w-full p-5 space-x-2 overflow-y-scroll'>
        {engravingColors.map(color => (
          <div className='flex flex-col items-center justify-center'>
            <div key={color.key} onClick={()=> dispatch(setSignboardColor({color:color.front.value}))} className="flex items-center justify-center w-12 h-12 rounded-full border-2 hover:cursor-pointer" style={{backgroundColor: color.front.value}}>
                <FontAwesomeIcon className="w-8 h-8 p-1" icon={faT} color={color.back.value}/>
            </div>
            <p className='text-xs text-gray-500 font-light'>{color.front.name}</p>
            <p className='text-xs text-gray-500 font-light'>{color.back.name}</p>
          </div>
        ))}
        
        
      </div> 
      : 
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
      }
      
   </div>
  );
};

export default ColorModal;