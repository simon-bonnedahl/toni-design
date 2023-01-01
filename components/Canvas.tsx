import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import ControlBox from "./modals/ControlBox";
import { selectCommands } from "../reducers/editorSlice";
import { saveSign } from "../reducers/signSlice";
const fabric = require("fabric").fabric;
const { jsPDF } = require("jspdf");
const { v4: uuidv4 } = require("uuid");

const Canvas: React.FC = () => {
  const { editor, onReady } = useFabricJSEditor();

  const [sign, setSign] = useState<any>({
    width: 250,
    height: 100,
    color: "#ffffff",
    shape: "Rectangle",
    elements: [],
  });

  const commands = useSelector(selectCommands);
  const [signHistory, setSignHistory] = useState<any[]>([sign]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedObject, setSelectedObject] = useState(false);
  const [commandsRecieved, setCommandsRecieved] = useState(0);

  const dispatch = useDispatch();

  const init = (canvas: any) => {
    setShape(canvas, sign.shape, sign.width, sign.height);
    setSize(canvas, sign.width, sign.height);
    setColor(canvas, sign.color);
    setEditorControls();
    canvas.renderAll();
    onReady(canvas);
  };

  const setEditorControls = () => {
    let s = fabric.Object.prototype.set({
      cornerSize: 16,
      cornerStyle: "circle",
      borderWidth: 2,
      borderColor: "#60a5fa",
    });
    s.controls.mt.visible = false;
    s.controls.mr.visible = false;
    s.controls.ml.visible = false;
    s.controls.mb.visible = false;
  };

  const toPixels = (mm: number) => {
    return mm * 2.8346546;
  };

  const setSize = (canvas: any, width: number, height: number) => {
    let shape = canvas._objects[0];
    if (shape) {
      if (sign.shape === "Ellipse") {
        shape.set({ rx: toPixels(width) / 2, ry: toPixels(height) / 2 });
      } else {
        shape.set({ width: toPixels(width), height: toPixels(height) });
      }
      canvas.renderAll();
      console.log(shape);
      centerSign(canvas);
    }
    return { ...sign, width, height };
  };

  const centerSign = (canvas: any) => {
    let shape = canvas._objects[0];
    if (shape) {
      shape.set({
        left: canvas.width / 2 - (shape.width * shape.scaleX) / 2,
        top: canvas.height / 2 - (shape.height * shape.scaleY) / 2,
      });
    }
  };

  const setShape = (
    canvas: any,
    shape: string,
    width: number,
    height: number
  ) => {
    let s = null;
    let borderWidth = 0;
    let borderColor = "#000";
    let w = toPixels(width);
    let h = toPixels(height);

    switch (shape) {
      case "Rectangle":
        s = new fabric.Rect({
          width: w,
          height: h,
          fill: sign.color,
          stroke: borderColor,
          strokeWidth: borderWidth,
        });
        break;
      case "Rounded Rectangle":
        s = new fabric.Rect({
          width: w,
          height: h,
          fill: sign.color,
          stroke: borderColor,
          strokeWidth: borderWidth,
          rx: 20,
          ry: 20,
        });
        break;
      case "Ellipse":
        s = new fabric.Ellipse({
          rx: w / 2,
          ry: h / 2,
          fill: sign.color,
          stroke: borderColor,
          strokeWidth: borderWidth,
        });
        break;
      default:
        return;
    }
    //Lock the shape
    s.hasControls = false;
    s.hasBorders = false;
    s.lockMovementX = true;
    s.lockMovementY = true;
    s.selectable = false;
    s.evented = false;
    s.shadow = new fabric.Shadow({
      color: "#555",
      blur: 30,
      offsetY: 5,
    });

    //Replace the frame, this works if the frame always is the first object, which it should
    canvas._objects[0] = s;
    centerSign(canvas);
    return { ...sign, shape };
  };

  const setColor = (canvas: any, color: string) => {
    let shape = canvas._objects[0];
    if (shape) shape.set({ fill: color });
    return { ...sign, color };
  };

  const addText = (canvas: any, text: any) => {
    let id = uuidv4();
    var t = new fabric.IText(text.string, {
      fill: text.color,
      fontFamily: text.font,
      fontSize: text.fontSize,
      id: id,
    });
    canvas.add(t);
    alignObject("center", t);
    canvas.setActiveObject(t);
    let textElement = {
      ...text,
      type: "text",
      id: id,
      x: translateCenterOrigin(t.top, t.left).x,
      y: translateCenterOrigin(t.top, t.left).y,
      width: t.width,
      height: t.height,
      angle: t.angle,
    };
    return { ...sign, elements: [...sign.elements, textElement] };
  };

  const addImage = async (canvas: any, imageUrl: string, imageType: string) => {
    let id = uuidv4();
    if (imageType === "image/svg+xml") {
      var group: any[] = [];

      fabric.loadSVGFromURL(
        imageUrl,
        function (objects: any, options: any) {
          let svg = new fabric.Group(group);

          svg.set({
            width: 50, //Need to be calculated
            height: 50,
            id: id,
          });

          canvas.add(svg);
          alignObject("center", svg);
          canvas.setActiveObject(svg);
          canvas.renderAll();
          return {
            ...sign,
            elements: [
              ...sign.elements,
              {
                type: "image",
                imageType: imageType,
                imageUrl: imageUrl,
                id: id,
                x: translateCenterOrigin(svg.top, svg.left).x,
                y: translateCenterOrigin(svg.top, svg.left).y,
                width: svg.width,
                height: svg.height,
                angle: svg.angle,
              },
            ],
          };
        },
        function (
          item: { getAttribute: (arg0: string) => any },
          object: { set: (arg0: string, arg1: any) => void }
        ) {
          object.set("id", item.getAttribute("id"));
          group.push(object);
        }
      );
    } else {
      let imgElement = document.createElement("img");
      imgElement.src = imageUrl;
      //Create the image to gain the width and height
      let img = new Image();
      img.onload = function () {
        let i = new fabric.Image(imgElement, {
          angle: 0,
          opacity: 1,
          id: id,
          width: img.width, //Math.min(img.width, sign.width), //To not overflow the canvas, this need to scale the image instead of cropping
          height: img.height, // Math.min(img.height, sign.height),
        });

        canvas.add(i);
        alignObject("center", i);
        canvas.setActiveObject(i);
        canvas.renderAll();
        return {
          ...sign,
          elements: [
            ...sign.elements,
            {
              type: "image",
              imageType: imageType,
              imageUrl: imageUrl,
              id: id,
              x: translateCenterOrigin(i.top, i.left).x,
              y: translateCenterOrigin(i.top, i.left).y,
              width: i.width,
              height: i.height,
              angle: i.angle,
            },
          ],
        };
      };
      img.src = imageUrl;
    }
  };

  const recreateSign = (canvas: any, sign: any) => {
    canvas.clear();
    setShape(canvas, sign.shape, sign.width, sign.height);
    setColor(canvas, sign.color);
    setSize(canvas, sign.width, sign.height);
    sign.elements.forEach((element: any) => {
      if (element.type == "text") {
        addText(canvas, element);
      }
      if (element.type == "image") {
        addImage(canvas, element.imageUrl, element.imageType);
      }
      let obj = canvas._objects[canvas._objects.length - 1];
      obj.set({
        scaleX: element.width / obj.width,
        scaleY: element.height / obj.height,
      });
      obj.set({
        top: translateTopLeftOrigin(element.x, element.y).top,
        left: translateTopLeftOrigin(element.x, element.y).left,
        angle: element.angle,
      });
    });
    return sign;
  };
  const translateCenterOrigin = (top: number, left: number) => {
    let canvas = editor?.canvas;
    let center = canvas.getCenter();
    let x = top - center.top;
    let y = left - center.left;
    return { x, y };
  };
  const translateTopLeftOrigin = (x: number, y: number) => {
    let canvas = editor?.canvas;
    let center = canvas.getCenter();
    let top = x + center.top;
    let left = y + center.left;

    return { top, left };
  };

  const getElementById = (id: string) => {
    return sign.elements.find((element: any) => element.id === id);
  };

  const updateElement = (id: string, element: any) => {
    let newList: {}[] = [];
    sign.elements.forEach((e: any) => {
      if (e.id === id) {
        newList.push(element);
      } else {
        newList.push(e);
      }
    });
    let newSign = { ...sign, elements: newList };
    setSign(newSign);
    dispatch(saveSign({ sign: newSign }));
    setHistoryIndex(signHistory.length);
    setSignHistory([...signHistory, newSign]);
  };

  const keyHandler = useCallback(
    (event: { key: string }) => {
      let obj = editor?.canvas.getActiveObject();
      let shape = editor?.canvas._objects[0];
      let speed = 2;
      switch (event.key) {
        case "ArrowUp":
          if (obj.top < shape.top) return;
          obj?.set({ top: obj.top - speed });
          break;
        case "ArrowDown":
          if (obj.top > shape.top + shape.height - obj.height * obj.scaleY)
            return;
          obj?.set({ top: obj.top + speed });
          break;
        case "ArrowRight":
          if (obj.left > shape.left + shape.width - obj.width * obj.scaleX)
            return;
          obj?.set({ left: obj.left + speed });
          break;
        case "ArrowLeft":
          if (obj.left < shape.left) return;
          obj?.set({ left: obj.left - speed });
          break;
        default:
          return;
      }
      let element = getElementById(obj?.id);
      if (element) {
        updateElement(obj?.id, {
          ...element,
          x: translateCenterOrigin(obj.top, obj.left).x,
          y: translateCenterOrigin(obj.top, obj.left).y,
        });
      }
      editor?.canvas.renderAll();
    },
    [editor?.canvas, sign]
  );

  const alignObject = (location: string, obj: any) => {
    //https://stackoverflow.com/questions/47408816/object-alignment-in-fabric-js
    let canvas = editor?.canvas;
    let shape = canvas?._objects[0];
    let padding = 2;

    obj.angle = 0;
    switch (location) {
      case "mid-left":
        obj.set({
          left: shape.left + padding,
          top: shape.top + shape.height / 2 - (obj.height * obj.scaleY) / 2,
        });
        break;
      case "mid-right":
        obj.set({
          left: shape.left + shape.width - obj.width * obj.scaleX,
          top: shape.top + shape.height / 2 - (obj.height * obj.scaleY) / 2,
        });
        break;
      case "top":
        obj.set({
          top: 0,
        });
        break;
      case "bottom":
        obj.set({
          top: shape.height - obj.height * obj.scaleY,
        });
        break;
      case "top-center":
        obj.set({
          left: shape.width / 2 - (obj.width * obj.scaleX) / 2,
        });
        break;
      case "center":
        obj.set({
          rotation: 0,
          left: shape.left + shape.width / 2 - (obj.width * obj.scaleX) / 2,
          top: shape.top + shape.height / 2 - (obj.height * obj.scaleY) / 2,
        });
        break;
      default:
        return;
    }
    let element = getElementById(obj.id);
    if (element) {
      updateElement(obj.id, {
        ...element,
        x: translateCenterOrigin(obj.top, obj.left).x,
        y: translateCenterOrigin(obj.top, obj.left).y,
      });
    }

    canvas.renderAll();
  };
  let canvas = editor?.canvas;

  const handleSelectObject = () => {
    document.addEventListener("keydown", keyHandler, false);
    setSelectedObject(true);
  };
  const handleUnselectObject = () => {
    document.removeEventListener("keydown", keyHandler, false);
    setSelectedObject(false);
  };

  const handleMoveObject = (e: any) => {
    let obj = e.target;
    let canvas = editor?.canvas;
    let shape = canvas?._objects[0];
    let padding = 2;
    if (obj.left < shape.left + padding) {
      obj.set({ left: shape.left + padding });
    }
    if (obj.left > shape.left + shape.width - obj.width * obj.scaleX) {
      obj.set({
        left: shape.left + shape.width - obj.width * obj.scaleX,
      });
    }
    if (obj.top < shape.top + padding) {
      obj.set({ top: shape.top + padding });
    }
    if (obj.top > shape.top + shape.height - obj.height * obj.scaleY) {
      obj.set({
        top: shape.top + shape.height - obj.height * obj.scaleY,
      });
    }
  };

  const handleScaleObject = (e: any) => {};

  const handleModifyObject = (e: any) => {
    let obj = e.target;

    let element = getElementById(obj.id);
    if (element) {
      updateElement(obj.id, {
        ...element,
        x: translateCenterOrigin(obj.top, obj.left).x,
        y: translateCenterOrigin(obj.top, obj.left).y,
        width: obj.width * obj.scaleX,
        height: obj.height * obj.scaleY,
        angle: obj.angle,
      });
    }
  };

  const handleTextChange = (e: any) => {
    let text = e.target;
    let newList = [];
    for (let i = 0; i < sign.elements.length; i++) {
      let element = { ...sign.elements[i] };

      if (element.id == text.id) {
        console.log(text.text);
        element.string = text.text;
      }
      newList.push(element);
    }
    let s = { ...sign, elements: newList };
    setSign(s);
    dispatch(saveSign({ sign: s }));
    setHistoryIndex(signHistory.length);
    setSignHistory([...signHistory, s]);
  };

  /*Canvas Events*/

  if (canvas) {
    //http://fabricjs.com/events
    canvas.on({
      "selection:created": handleSelectObject,
      "selection:cleared": handleUnselectObject,
      "object:moving": handleMoveObject,
      "object:scaling": handleScaleObject,
      "object:modified": handleModifyObject,
      "text:changed": handleTextChange,
    });
  }

  const handleDeleteObject = () => {
    editor?.canvas.remove(editor?.canvas.getActiveObject());
  };
  const handleAlignObjectCenter = () => {
    alignObject("center", editor?.canvas.getActiveObject());
  };
  const handleAlignObjectLeft = () => {
    alignObject("mid-left", editor?.canvas.getActiveObject());
  };
  const handleAlignObjectRight = () => {
    alignObject("mid-right", editor?.canvas.getActiveObject());
  };

  useEffect(() => {
    let canvas = editor?.canvas;

    if (canvas) {
      console.log(canvas._objects);
      //New way of updating the canvas
      if (commands.length > commandsRecieved) {
        let command = commands[commands.length - 1]; //Look at the latest commands
        handleCommand(command, canvas);
        setCommandsRecieved((commandsRecieved) => (commandsRecieved += 1));
        canvas.renderAll();
      }
    }
  }, [editor?.canvas, commands, sign]);

  const handleCommand = (command: any, canvas: any) => {
    let result = null;

    switch (command.command) {
      case "addText":
        result = addText(canvas, command.value);
        console.log("Add Text Command", result);
        break;
      case "addImage": //async
        addImage(canvas, command.value.url, command.value.type).then(result);
        console.log("Add Image Command", result);
        break;
      case "setShape":
        result = setShape(canvas, command.value, sign.width, sign.height);
        console.log("Set Shape Command", result);

        break;
      case "setSize":
        result = setSize(canvas, command.value.width, command.value.height);
        console.log("Set Size Command", result);
        break;
      case "setColor":
        result = setColor(canvas, command.value);
        console.log("Set Color Command", result);
        break;
      case "goBack":
        let backIndex = historyIndex - 1;
        if (backIndex < 0) return;
        setHistoryIndex(backIndex);
        console.log(signHistory[backIndex]);
        result = recreateSign(canvas, signHistory[backIndex]);
        console.log("Go Back Command", result);
        break;
      case "goForward":
        console.log(historyIndex, signHistory.length - 1);
        let forwardIndex = historyIndex + 1;
        if (forwardIndex > signHistory.length - 1) return;
        setHistoryIndex(forwardIndex);
        console.log(signHistory[forwardIndex]);
        result = recreateSign(canvas, signHistory[forwardIndex]);
        console.log("Go Forward Command", result);

        break;
      case "reCreate":
        result = recreateSign(canvas, command.value);
        console.log("Recreate Command", result);
        break;
      default:
        return;
    }

    //result cant be null
    if (result) {
      setSign(result);
      dispatch(saveSign({ sign: result })); //Save the sign so the other components can read its visual properties

      if (command.command === "goBack" || command.command === "goForward") {
        //if commans is goBack we dont add the new sign to the history
      } else {
        //If command isnt goBack we go to the front of the history and add the new sign
        setHistoryIndex(signHistory.length);
        setSignHistory([...signHistory, result]);
      }
    }
  };

  const handleDownloadPdf = (canvas: any) => {
    canvas._objects[0].set({ shadow: null });
    let pdf = new jsPDF();
    let pixelData = canvas.toDataURL("image/jpeg", 1.0);
    pdf.addImage(pixelData, "JPEG", 0, 0);
    pdf.save("download.pdf");
    //dispatch(setDownloadPdf({ downloadPdf: false }));
    setShape(canvas, sign.shape, sign.width, sign.height);
  };

  const handleDownloadSvg = (canvas: any) => {
    //remove shadow, maybe shrink canvas and align the sign in there before saving?

    canvas._objects[0].set({ shadow: null });
    let blob = new Blob([canvas.toSVG()], { type: "text/plain" });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "download.svg";
    a.click();
    // dispatch(setDownloadSvg({ downloadSvg: false }));
    setShape(canvas, sign.shape, sign.width, sign.height);
  };

  return (
    <div className="border border-gray w-full h-full relative">
      <FabricJSCanvas
        className="sample-canvas w-full h-full bg-slate-200"
        onReady={init}
      />
      {selectedObject && (
        <ControlBox
          handleDelete={handleDeleteObject}
          handleAlignCenter={handleAlignObjectCenter}
          handleAlignLeft={handleAlignObjectLeft}
          handleAlignRight={handleAlignObjectRight}
        />
      )}
    </div>
  );
};

export default Canvas;
