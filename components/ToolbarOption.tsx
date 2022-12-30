import React from 'react'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface Props {
  title: string;
  icon: IconDefinition
}

const ToolBarOption: React.FC<Props> = ({title, icon}) => {

  return (
   <div className='text-center font-light text-lg'>
        <div className='w-24 h-24 bg-white rounded-full shadow-2xl hover:scale-110 ease-in-out duration-300 hover:cursor-pointer flex justify-center items-center mt-4'>
            <FontAwesomeIcon className="w-10 h-10" icon={icon}/>
        </div>
        {title}
    </div>
  );
};

export default ToolBarOption;