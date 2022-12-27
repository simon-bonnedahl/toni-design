import React, { useState } from 'react'
import { faDroplet, faExpand, faT} from '@fortawesome/free-solid-svg-icons'
import ToolBarOption from './ToolbarOption';
import SizeModal from './modals/SizeModal';
import ColorModal from './modals/ColorModal';
import TextModal from './modals/TextModal';

const Toolbar: React.FC = () => {
    const [currentOption, setCurrentOption] = useState<JSX.Element>();

const options = [
                {
                title: "Size",
                icon: faExpand,
                modal: <SizeModal/>,
                key: 1
                },
                {
                title: "Color",
                icon: faDroplet,
                modal: <ColorModal/>,
                key: 2
                },
                {
                title: "Text",
                icon: faT,
                modal: <TextModal/>,
                key: 3
                },]
  return (
   <div>
        <div className='flex flex-col w-44 space-y-4 items-center mt-4' >
            {options.map(option =>(
                <div key={option.key} onClick={() => setCurrentOption(option.modal)}>
                    <ToolBarOption title={option.title} icon={option.icon}/>
                </div>
            ))}
            
        </div>
        {currentOption}
    </div>
  );
};

export default Toolbar;