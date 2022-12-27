import React, { useRef } from 'react'
import { useSelector } from 'react-redux';
import { selectSignboard } from '../reducers/signboardSlice';
var FileSaver = require('file-saver');
var PostScriptDocument = require("../PostScriptMaker");
const { jsPDF } = require("jspdf")

const Bottombar: React.FC = () => {

    const signBoard = useSelector(selectSignboard)


    const handleSave = () => {
            const canvas = document.querySelector("canvas")
            if (canvas) {
                const context = canvas.getContext("2d")
                if(context){
                  const imgData = context.getImageData(0, 0, signBoard.width, signBoard.height, {colorSpace: "srgb" });
                  
                  var pdf = new jsPDF();
                  pdf.addImage(imgData, 'JPEG', 0, 0);
                  pdf.save("download.pdf");
            
                /*
                const pixelData = imgData.data
                    let text = '';
                for (let i = 0; i < pixelData.length; i+=4) {
                    if(pixelData[i] < 16){
                    text += "0"
                    }
                    text += pixelData[i].toString(16)

                    if(pixelData[i+1] < 16){
                    text += "0"
                    }
                    text += pixelData[i+1].toString(16)
                    
                    if(pixelData[i+2] < 16){
                    text += "0"
                    }
                    text += pixelData[i+2].toString(16)
                    
                
                }
                console.log(text)

                var doc = new PostScriptDocument({
                author: "Simon Bonnedahl",
                title: "Test Signboard",
                borderWidth: 3,
                widthInches: signBoard.width,
                heightInches: signBoard.height,
                });

                var page = doc.addPage();

                page.elements.push({
                type: "image",
                bitMapData: text,
                x: 0,
                y: 0,
                imgWidth: signBoard.width,
                imgHeight: signBoard.height,
                });
            
            const blob = new Blob([doc.render()], { type: 'text/plain' });
            
            FileSaver.saveAs(blob, 'outputs/output1.eps');
            */
        }}
    }

  return (
   
    <div className='flex flex-row w-full h-20 border items-center justify-center'>
    <button className=" bg-slate-300 rounded-lg p-4"onClick={() => handleSave()}>Download file</button>
    </div>
  );
};

export default Bottombar;