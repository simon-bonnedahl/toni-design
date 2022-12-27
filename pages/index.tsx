import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
var FileSaver = require('file-saver');
var PostScriptDocument = require("../PostScriptMaker");

const shapes = ['rectangle', 'circle', 'triangle', 'text']
const modes = ['fill', 'stroke']

const Home: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState(shapes[0])
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [shapeSize, setShapeSize] = useState(100)
  const [text, setText] = useState('')
  const [fontSize, setFontSize] = useState(20)
  const [xCoordinate, setXCoordinate] = useState(0)
  const [yCoordinate, setYCoordinate] = useState(0)
  const [canvasWidth, setCanvasWidth] = useState(250)
  const [canvasHeight, setCanvasHeight] = useState(250)
  const [selectedMode, setSelectedMode] = useState(modes[0])
  let background = {
    shape: "rectangle",
    color: "#ffffff",
    size: canvasHeight,
    mode: "fill",
    x: 0,
    y: 0,
    text: "",
    fontSize: 0,
  }
  const [shapesList, setShapesList] = useState<{
    shape: string
    color: string
    size: number
    mode: string,
    x: number
    y: number
    text: string
    fontSize: number
  }[]>([background])

  const canvasRef = useRef<HTMLCanvasElement>(null)

 
  useEffect(() => {
     const ctx = canvasRef.current?.getContext('2d')
      if(ctx)
        drawShapes(ctx)
  }, [shapesList])

  const handleShapeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedShape(event.target.value)
  }

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value)
  }

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShapeSize(event.target.valueAsNumber)
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value)
  }

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(event.target.valueAsNumber)
  }
  const handleXCoordinateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setXCoordinate(event.target.valueAsNumber)
  }
  const handleYCoordinateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYCoordinate(event.target.valueAsNumber)
  }
  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMode(event.target.value)
  }
  const handleSave = () => {
    const ctx = canvasRef.current?.getContext('2d')
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight, {colorSpace: "srgb" });
        const pixelData = imageData.data;
        let text = '';
        console.log(imageData.data)
        
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
          author: "John Doe",
          title: "My Report",
          borderWidth: 3,
          widthInches: canvasWidth,
          heightInches: canvasHeight,
        });

        var page = doc.addPage();

        page.elements.push({
          type: "image",
          bitMapData: text,
          x: 0,
          y: 0,
          imgWidth: canvasWidth,
          imgHeight: canvasHeight,
        });
      
      const blob = new Blob([doc.render()], { type: 'text/plain' });
      
      FileSaver.saveAs(blob, 'outputs/output1.eps');
    }
}

  const addShape = () => {
    const newShape = {
      shape: selectedShape,
      color: selectedColor,
      size: shapeSize,
      mode: selectedMode,
      x: xCoordinate,
      y: yCoordinate,
      text: "",
      fontSize: 0
    }

    if (selectedShape === 'text') {
      newShape.text = text
      newShape.fontSize = fontSize
    }

    setShapesList([...shapesList, newShape])
    
   
  }

    const drawShapes = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    shapesList.forEach((shape) => {
      console.log(shape)
      ctx.fillStyle = shape.color

      if (shape.shape === 'rectangle') {
        if (shape.mode === 'fill') {
          ctx.fillRect(shape.x, shape.y, shape.size, shape.size)
        } else if (shape.mode === 'stroke') {
          ctx.strokeRect(shape.x, shape.y, shape.size, shape.size)
        }
      } else if (shape.shape === 'circle') {
        if (shape.mode === 'fill') {
          ctx.beginPath()
          ctx.arc(shape.x + shape.size / 2, shape.y + shape.size / 2, shape.size / 2, 0, 2 * Math.PI)
          ctx.fill()
        } else if (shape.mode === 'stroke') {
          ctx.beginPath()
          ctx.arc(shape.x + shape.size / 2, shape.y + shape.size / 2, shape.size / 2, 0, 2 * Math.PI)
          ctx.stroke()
        }
      } else if (shape.shape === 'triangle') {
        if (shape.mode === 'fill') {
          ctx.beginPath()
          ctx.moveTo(shape.x + shape.size / 2, shape.y)
          ctx.lineTo(shape.x + shape.size, shape.y + shape.size)
          ctx.lineTo(shape.x, shape.y + shape.size)
          ctx.fill()
        } else if (shape.mode === 'stroke') {
          ctx.beginPath()
          ctx.moveTo(shape.x + shape.size / 2, shape.y)
          ctx.lineTo(shape.x + shape.size, shape.y + shape.size)
          ctx.lineTo(shape.x, shape.y + shape.size)
          ctx.stroke()
        }
      } else if (shape.shape === 'text') {
        ctx.font = `${shape.fontSize}px sans-serif`
        ctx.fillText(shape.text, shape.x, shape.y + shape.fontSize)
      }
    })
  }
  return (
         <div>
      <Head>
        <title>Shape Canvas</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Shape Canvas</h1>

        <label>
          Choose a shape:
          <select value={selectedShape} onChange={handleShapeChange}>
            {shapes.map((shape) => (
              <option key={shape} value={shape}>
                {shape}
              </option>
            ))}
          </select>
        </label>
        <br />

        {selectedShape === 'text' && (
          <div>
            <label>
              Enter text:
              <input type="text" value={text} onChange={handleTextChange} />
            </label>
            <br />
            <label>
              Choose font size:
              <input
                type="number"
                value={fontSize}
                onChange={handleFontSizeChange}
                min={10}
                max={40}
                step={2}
              />
            </label>
          </div>
        )}

        {selectedShape !== 'text' && (
          <div>
            <label>
              Choose a color:
              <input
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
              />
            </label>
            <br />
            <label>
              Choose a size:
              <input
                type="number"
                value={shapeSize}
                onChange={handleSizeChange}
                min={50}
                max={200}
                step={10}
              />
            </label>
            <br />
            <label>
              Choose a mode:
              <select value={selectedMode} onChange={handleModeChange}>
                {modes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <label>
          X Coordinate:
          <input
            type="number"
            value={xCoordinate}
            onChange={handleXCoordinateChange}
            min={0}
            max={canvasWidth}
            step={10}
          />
        </label>
        <br />
        <label>
          Y Coordinate:
          <input
            type="number"
            value={yCoordinate}
            onChange={handleYCoordinateChange}
            min={0}
            max={canvasHeight}
            step={10}
          />
        </label>
        <br />

        <button onClick={addShape}>Add Shape</button>
        <br />


        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={(event) => {
            if (canvasRef.current) {
              const ctx = canvasRef.current.getContext('2d')
              if(ctx)
                drawShapes(ctx)
            }}}
        />
        <button onClick={() => handleSave()}>Save canvas to eps</button>
      </main>

      <style jsx>{`
        main {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }

        canvas {
          border: 1px solid #ccc;
          margin: 20px 0;
        }
      `}</style>
    </div>
  )
}

export default Home