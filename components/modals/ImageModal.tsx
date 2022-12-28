import React, { useState } from 'react'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faClose} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addSignboardImage, selectSignboard} from '../../reducers/signboardSlice';
import { setSelectedOption } from '../../reducers/toolbarSlice';



const ImageModal: React.FC = () => {
  const [image, setImage] = useState(useSelector(selectSignboard).image)

   const dispatch = useDispatch()

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target) {
          const image = new Image()
          image.src = event.target.result as string
          image.onload = () => {
            
            setImage(image.src)
            dispatch(addSignboardImage({image:image.src, rendered:false}))
            }
        }
      }
      reader.readAsDataURL(file)
    }
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
        <label htmlFor="image-input">Upload Image:</label>
        <br />
        <input type="file" id="image-input" accept="image/*" onChange={handleImageChange} />
        <br />
     </div>
  );
};

export default ImageModal;