import React, { useState } from 'react'
import { faDroplet, faExpand, faT} from '@fortawesome/free-solid-svg-icons'
import ToolBarOption from './ToolbarOption';
import SizeModal from './modals/SizeModal';
import ColorModal from './modals/ColorModal';
import TextModal from './modals/TextModal';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedOption, selectToolbar } from '../reducers/toolbarSlice';

const Toolbar: React.FC = () => {
    const options = [
                    {
                    title: "Size",
                    icon: faExpand,
                    modal: <SizeModal/>,
                    key: 0
                    },
                    {
                    title: "Color",
                    icon: faDroplet,
                    modal: <ColorModal/>,
                    key: 1
                    },
                    {
                    title: "Text",
                    icon: faT,
                    modal: <TextModal/>,
                    key: 2
                    },]
    const dispatch = useDispatch()
    const handleSelectOption = (index: number) => {
        let selectedOption = index;
        dispatch(setSelectedOption({selectedOption}))
    }
    const toolbar = useSelector(selectToolbar)
  return (
   <div>
        <div className='flex flex-col w-44 space-y-4 items-center mt-4' >
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