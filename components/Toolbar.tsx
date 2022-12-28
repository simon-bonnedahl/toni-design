import React from 'react'
import { faDroplet, faExpand, faImage, faQuestion, faShapes, faT} from '@fortawesome/free-solid-svg-icons'
import ToolBarOption from './ToolbarOption';
import SizeModal from './modals/SizeModal';
import ColorModal from './modals/ColorModal';
import TextModal from './modals/TextModal';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedOption, selectToolbar } from '../reducers/toolbarSlice';
import MaterialModal from './modals/MaterialModal';
import ShapeModal from './modals/ShapeModal';
import ImageModal from './modals/ImageModal';
import ProductModal from './modals/ProductModal';

const Toolbar: React.FC = () => {
    const options = [
                    {
                    title: "Product",
                    icon: faQuestion,
                    modal: <ProductModal/>,
                    key: 0
                    },
                    {
                    title: "Material",
                    icon: faQuestion,
                    modal: <MaterialModal/>,
                    key: 1
                    },
                    {
                    title: "Size",
                    icon: faExpand,
                    modal: <SizeModal/>,
                    key: 2
                    },
                    {
                    title: "Shape",
                    icon: faShapes,
                    modal: <ShapeModal/>,
                    key: 3
                    },
                    {
                    title: "Color",
                    icon: faDroplet,
                    modal: <ColorModal/>,
                    key: 4
                    },
                    {
                    title: "Text",
                    icon: faT,
                    modal: <TextModal/>,
                    key: 5
                    },
                    {
                    title: "Image",
                    icon: faImage,
                    modal: <ImageModal/>,
                    key: 6
                    },
                    {
                    title: "Application",
                    icon: faQuestion,
                    modal: <TextModal/>,
                    key: 7
                    },
                    ]
    const dispatch = useDispatch()
    const handleSelectOption = (index: number) => {
        let selectedOption = index;
        dispatch(setSelectedOption({selectedOption}))
    }
    const toolbar = useSelector(selectToolbar)
  return (
   <div>
        <div className='flex flex-col h-full w-44 items-center overflow-y-scroll' >
            {options.map(option =>(
                <div key={option.key} onClick={() => handleSelectOption(option.key)}>
                    <ToolBarOption title={option.title} icon={option.icon}/>
                </div>
            ))}
            
        </div>
        {toolbar.selectedOption != null && (options[toolbar.selectedOption].modal)}
    </div>
  );
};

export default Toolbar;