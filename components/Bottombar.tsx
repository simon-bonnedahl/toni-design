import React, { useRef } from 'react'
import { useSelector } from 'react-redux';
import { selectSignboard } from '../reducers/signboardSlice';
const { jsPDF } = require("jspdf")

const Bottombar: React.FC = () => {

    const signBoard = useSelector(selectSignboard)

   
    const handleSavePdf = () => { 
      if(signBoard.pixelData){
        var pdf = new jsPDF();
        pdf.addImage(signBoard.pixelData, 'JPEG', 0, 0); 
        pdf.save("download.pdf");
      }
    }
    const handleSaveSvg = () => {
      if(signBoard.svg){
        const blob = new Blob([signBoard.svg], { type: 'text/plain' });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;   
        a.download = "download.svg";
        a.click();
      }
        
    }
  return (
   
    <div className='flex flex-row w-full h-20 border items-center justify-between px-4'>
    <div className='flex space-x-4'>
      <button className=" bg-slate-300 rounded-lg p-2"onClick={() => handleSaveSvg()}>Download SVG</button>
      <button className=" bg-slate-300 rounded-lg p-2"onClick={() => handleSavePdf()}>Download PDF</button>
    </div>
    {/*Price*/}
    <div>
      <span>{signBoard.price}</span> kr
    </div>
    </div>
  );
};

export default Bottombar;