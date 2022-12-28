import React, { useState } from 'react'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faClose} from '@fortawesome/free-solid-svg-icons';
import { useDispatch} from 'react-redux';
import { addSignboardImage} from '../../reducers/signboardSlice';
import { setSelectedOption } from '../../reducers/toolbarSlice';



const ImageModal: React.FC = () => {
   const dispatch = useDispatch()
   const [image, setImage] = useState({url: "", type: ""})

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files && event.target.files[0]){
        const file = event.target.files[0];
        setImage({url: window.URL.createObjectURL(file), type: file.type})    
        }
  }

  const handleAddImage = () => { 
        if(image)    
            dispatch(addSignboardImage({image:{url:image.url, type:image.type, rendered:false}}))
            handleClose()
  }

 const handleClose = () => {
    dispatch(setSelectedOption({selectedOption: null}))
  }

  return (
    <div className='absolute top-40 z-50 left-40 w-96 h-64 bg-white shadow-lg flex rounded-lg'>
     <div className="absolute -top-3 -left-3 bg-red-500 rounded-full z-50 hover:scale-110 ease-in-out duration-300" onClick={() => handleClose()} >
     <FontAwesomeIcon className="w-8 h-8 p-1" icon={faClose} color="#fff"/>
     </div>
        <div className='flex flex-col w-8/12 p-5 space-y-2'>
            <label htmlFor="image-input">Upload Image:</label>  
            <input type="file" id="image-input" accept=".jpg, .jpeg, .png, .webp, .svg" onChange={handleImageUpload} />
            <button onClick={() => handleAddImage()} className='ml-2 p-2 px-4 w-fit text-gray-900 text-sm border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500'>Add</button>    
        </div>
    
      


     </div>
            
  
  
  );
};

export default ImageModal;