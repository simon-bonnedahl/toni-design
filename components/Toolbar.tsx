import React from 'react'
import { faDroplet, faExpand, faImage, faQuestion, faShapes, faT} from '@fortawesome/free-solid-svg-icons'
import ToolBarOption from './ToolbarOption';
import SizeModal from './modals/SizeModal';
import ColorModal from './modals/ColorModal';
import TextModal from './modals/TextModal';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedOption, selectToolbar } from '../reducers/toolbarSlice';

const Toolbar: React.FC = () => {
    const options = [
                    {
                    title: "Material",
                    icon: faQuestion,
                    modal: <SizeModal/>,
                    key: 0
                    },
                    {
                    title: "Size",
                    icon: faExpand,
                    modal: <SizeModal/>,
                    key: 1
                    },
                    {
                    title: "Shape",
                    icon: faShapes,
                    modal: <ColorModal/>,
                    key: 2
                    },
                    {
                    title: "Color",
                    icon: faDroplet,
                    modal: <ColorModal/>,
                    key: 3
                    },
                    {
                    title: "Text",
                    icon: faT,
                    modal: <TextModal/>,
                    key: 4
                    },
                    {
                    title: "Image",
                    icon: faImage,
                    modal: <TextModal/>,
                    key: 5
                    },
                    {
                    title: "Application",
                    icon: faQuestion,
                    modal: <TextModal/>,
                    key: 6
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