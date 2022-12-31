import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";

import ControlBox from "./modals/ControlBox";
import { selectCommands } from "../reducers/editorSlice";
import { saveSign } from "../reducers/signSlice";
const fabric = require("fabric").fabric;
const { jsPDF } = require("jspdf");
const { uuid } = require("uuidv4");

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

  const dispatch = useDispatch();

  const init = (canvas: any) => {
    setShape(canvas, sign.shape);
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

  const setShape = (canvas: any, shape: string) => {
    let s = null;
    let borderWidth = 0;
    let borderColor = "#000";
    let w = toPixels(sign.width);
    let h = toPixels(sign.height);

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
    (s.selectable = false),
      (s.evented = false),
      (s.shadow = new fabric.Shadow({
        color: "#555",
        blur: 30,
        offsetY: 5,
      }));

    //Replace the frame, this works if the frame always is the first object, which it should
    canvas._objects[0] = s;
    centerSign(canvas);
    console.log({ ...sign, shape });
    return { ...sign, shape };
  };

  const setColor = (canvas: any, color: string) => {
    let shape = canvas._objects[0];
    if (shape) shape.set({ fill: color });
    return { ...sign, color };
  };

  const addText = (canvas: any, text: any) => {
    let id = uuid();
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
      top: t.top,
      left: t.left,
      width: t.width,
      height: t.height,
    };
    return { ...sign, elements: [...sign.elements, textElement] };
  };

  const addImage = (canvas: any, imageUrl: string, imageType: string) => {
    let id = uuid();
    let i: any = null;
    if (imageType === "image/svg+xml") {
      var group: any[] = [];

      fabric.loadSVGFromURL(
        imageUrl,
        function (objects: any, options: any) {
          i = new fabric.Group(group);

          i.set({
            width: 50, //Need to be calculated
            height: 50,
            id: id,
          });
          alignObject("center", i);
          canvas.add(i);
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
        i = new fabric.Image(imgElement, {
          angle: 0,
          opacity: 1,
          id: id,
          width: img.width, //Math.min(img.width, sign.width), //To not overflow the canvas, this need to scale the image instead of cropping
          height: img.height, // Math.min(img.height, sign.height),
        });

        canvas.add(i);
        alignObject("center", i);
        canvas.setActiveObject(i);
      };
      img.src = imageUrl;
    }
    if (i) {
      let imageElement = {
        type: "image",
        imageType: imageType,
        imageUrl: imageUrl,
        id: id,
        top: i.top,
        left: i.left,
        width: i.width,
        height: i.height,
      };
      return {
        ...sign,
        elements: [...sign.elements, imageElement],
      };
    }
  };

  const recreateSign = (canvas: any, sign: any) => {
    canvas.clear();
    setShape(canvas, sign.shape);
    setColor(canvas, sign.color);
    setSize(canvas, sign.width, sign.height);
    console.log("Recreating sign");
    sign.elements.forEach((element: any) => {
      console.log("recreating element", element);
      if (element.type == "text") {
        addText(canvas, element);
      }
      if (element.type == "image") {
        addImage(canvas, element.imageUrl, element.imageType);
      }
      let obj = canvas._objects[canvas._objects.length - 1];
      console.log("OBJ", obj);
      obj.set({
        top: element.top,
        left: element.left,
        width: element.width,
        height: element.height,
      });
    });
    return sign;
  };

  const keyHandler = useCallback(
    (event: { key: string }) => {
      let targetObject = editor?.canvas.getActiveObject();
      switch (event.key) {
        case "ArrowUp":
          targetObject?.set({ top: targetObject.top - 1 });
          break;
        case "ArrowDown":
          targetObject?.set({ top: targetObject.top + 1 });
          break;
        case "ArrowRight":
          targetObject?.set({ left: targetObject.left + 1 });
          break;
        case "ArrowLeft":
          targetObject?.set({ left: targetObject.left - 1 });
          break;
        default:
          return;
      }
      editor?.canvas.renderAll();

      //Ctrl-Z ?
    },
    [editor?.canvas]
  );

  const alignObject = (location: string, obj: any) => {
    //activeObj.getBoundingRect()
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
    //Bound it to the sign
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
    //link the object to the elements in the sign
    let newList = [];

    for (let i = 0; i < sign.elements.length; i++) {
      let element = { ...sign.elements[i] };
      console.log("Object", obj.id, "Element", element.id);

      if (element.id == obj.id) {
        console.log("Found it");
        element.top = obj.top;
        element.left = obj.left;
        element.width = obj.width;
        element.height = obj.height;
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
      //New way of updating the canvas
      if (commands.length > signHistory.length - 1) {
        let command = commands[commands.length - 1]; //Look at the latest commands
        handleCommand(command, canvas);
        canvas.renderAll();
      }
    }
  }, [editor?.canvas, commands]);

  const handleCommand = (command: any, canvas: any) => {
    let result = null;

    switch (command.command) {
      case "addText":
        result = addText(canvas, command.value);
        break;
      case "addImage":
        result = addImage(canvas, command.value.url, command.value.type);
        break;
      case "setShape":
        result = setShape(canvas, command.value);
        break;
      case "setSize":
        result = setSize(canvas, command.value.width, command.value.height);
        break;
      case "setColor":
        result = setColor(canvas, command.value);
        break;
      case "goBack":
        let backIndex = historyIndex - 1;
        if (backIndex < 0) return;
        setHistoryIndex(backIndex);
        console.log(signHistory[backIndex]);
        result = recreateSign(canvas, signHistory[backIndex]);
        break;
      case "goForward":
        console.log(historyIndex, signHistory.length - 1);
        let forwardIndex = historyIndex + 1;
        if (forwardIndex > signHistory.length - 1) return;
        console.log("go forward");
        setHistoryIndex(forwardIndex);
        console.log(signHistory[forwardIndex]);
        result = recreateSign(canvas, signHistory[forwardIndex]);
        break;
      default:
        return;
    }

    //result cant be null
    setSign(result);
    dispatch(saveSign({ sign: result })); //Save the sign so the other components can read its visual properties

    if (command.command === "goBack" || command.command === "goForward") {
      //if commans is goBack we dont add the new sign to the history
    } else {
      //If command isnt goBack we go to the front of the history and add the new sign
      setHistoryIndex(signHistory.length);
      setSignHistory([...signHistory, result]);
    }
  };

  const handleDownloadPdf = (canvas: any) => {
    canvas._objects[0].set({ shadow: null });
    let pdf = new jsPDF();
    let pixelData = canvas.toDataURL("image/jpeg", 1.0);
    pdf.addImage(pixelData, "JPEG", 0, 0);
    pdf.save("download.pdf");
    //dispatch(setDownloadPdf({ downloadPdf: false }));
    setShape(canvas, sign.shape);
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
    setShape(canvas, sign.shape);
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
