import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import ControlBox from "./modals/ControlBox";
import { selectCommands } from "../reducers/editorSlice";
import { getSignMetadata, saveSign } from "../reducers/signSlice";
import { addToCart } from "../reducers/cartSlice";
import CartModal from "./modals/CartModal";
import client, { urlFor } from "../sanity";
const fabric = require("fabric").fabric;
const { v4: uuidv4 } = require("uuid");
import { saveAs } from "file-saver";

const Canvas: React.FC = () => {
  const { editor, onReady } = useFabricJSEditor();

  const [sign, setSign] = useState<any>({
    width: 250,
    height: 100,
    color: "#ffffff",
    textColor: "#000000",
    shape: "Rectangle",
    elements: [],
  });
  const signMetaData = useSelector(getSignMetadata);

  const commands = useSelector(selectCommands);
  const [signHistory, setSignHistory] = useState<any[]>([sign]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedObject, setSelectedObject] = useState(false);
  const [commandsRecieved, setCommandsRecieved] = useState(0);

  const [showCartModal, setShowCartModal] = useState(false);

  const dispatch = useDispatch();

  const init = (canvas: any) => {
    setShape(canvas, sign.shape, sign.width, sign.height, true);
    setSize(canvas, sign.width, sign.height, true);
    setColor(canvas, sign.color, sign.textColor, true);
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

  const toMillimeter = (px: number) => {
    return px / 2.8346546;
  };

  const setSize = (
    canvas: any,
    width: number,
    height: number,
    updateBackend: boolean
  ) => {
    let shape = canvas._objects[0];
    if (shape) {
      if (sign.shape === "Ellipse") {
        shape.set({ rx: toPixels(width) / 2, ry: toPixels(height) / 2 });
      } else {
        shape.set({ width: toPixels(width), height: toPixels(height) });
      }
      canvas.renderAll();
      centerSign(canvas);
    }
    if (updateBackend) {
      let newSign = { ...sign, width, height };
      saveSignState(newSign);
    }
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
    height: number,
    updateBackend: boolean
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
    if (updateBackend) {
      let newSign = { ...sign, shape };
      saveSignState(newSign);
    }
  };

  const setColor = (
    canvas: any,
    back: string,
    front: string,
    updateBackend: boolean
  ) => {
    let shape = canvas._objects[0];
    if (shape) shape.set({ fill: back });
    for (let i = 1; i < canvas._objects.length; i++) {
      let text = canvas._objects[i];
      if (text.type === "i-text") {
        text.set({ fill: front });
      }
    }

    if (updateBackend) {
      let newSign = { ...sign, color: back, textColor: front };
      saveSignState(newSign);
    }
  };

  const addText = (canvas: any, text: any, updateBackend: boolean) => {
    let id = text.id ? text.id : uuidv4(); //If the text already has an id, use that, otherwise generate a new one

    let textObject = new fabric.IText(text.string, {
      //Create the text visual object
      fill: text.color,
      fontFamily: text.font,
      fontSize: text.fontSize,
      id: id,
    });
    if (!text.id) {
      alignObject("center", textObject); //Align the text to the center//Set the text as the active object
    } else {
      //Its an existing text, already in the backend
      console.log("reacreating this existing text", textObject);
      let pos = translateTopLeftOrigin(toPixels(text.x), toPixels(text.y));
      textObject.set({
        top: pos.top,
        left: pos.left,
        angle: text.angle,
        scaleX: toPixels(text.width) / textObject.width,
        scaleY: toPixels(text.height) / textObject.height,
      });
    }
    if (updateBackend) {
      //Create the text backend object
      let pos = translateCenterOrigin(textObject.top, textObject.left);
      let textObj = {
        ...text,
        type: "text",
        id: id,
        x: toMillimeter(pos.x),
        y: toMillimeter(pos.y),
        width: toMillimeter(textObject.width),
        height: toMillimeter(textObject.height),
        angle: textObject.angle,
      };

      let state = addObjectToState(textObj);
      saveSignState(state);
      console.log("Add text command result:", state);
    }
    canvas.add(textObject);
    canvas.setActiveObject(textObject);
  };

  const addImage = async (canvas: any, image: any, updateBackend: boolean) => {
    console.log("Adding image", image);
    console.log("Fetching image from sanity");
    let query = `*[_type == 'asset' && id == '${image.imageId}']`;
    let url = "";
    await client.fetch(query).then((res: any) => {
      console.log("Got image from sanity", res[0].url);
      url = urlFor(res[0].url).url();
    });
    let id = image.id ? image.id : uuidv4();

    if (image.imageType === "image/svg+xml") {
      //Async load
      fabric.loadSVGFromURL(url, function (objects: any, options: any) {
        let svg = fabric.util.groupSVGElements(objects, options);
        svg.set({
          id: id,
        });

        canvas.add(svg);
        if (image.id) {
          //IF we have visual props
          let pos = translateTopLeftOrigin(
            toPixels(image.x),
            toPixels(image.y)
          );
          svg.set({
            top: pos.top,
            left: pos.left,
            scaleX: toPixels(image.width) / svg.width,
            scaleY: toPixels(image.height) / svg.height,
            angle: image.angle,
          });
        }
        //Center it
        if (!image.id) alignObject("center", svg);
        canvas.setActiveObject(svg);
        canvas.renderAll();
        let pos = translateCenterOrigin(svg.top, svg.left);
        let state = addObjectToState({
          ...image,
          type: "image",
          id: id,
          width: toMillimeter(svg.width),
          height: toMillimeter(svg.height),
          x: toMillimeter(pos.x),
          y: toMillimeter(pos.y),
        });
        saveSignState(state);
        console.log("Add image command result:", state);
      });
    } else {
      let imgElement = document.createElement("img");
      imgElement.src = image.url;
      //Create the image to gain the width and height
      let i = new Image();
      i.onload = function () {
        //Then only reason to create the image is to get the width and height
        let img = new fabric.Image(imgElement);

        img.set({
          id: id,
        });

        canvas.add(img);
        if (image.id) {
          //IF we have visual props
          let pos = translateTopLeftOrigin(
            toPixels(image.x),
            toPixels(image.y)
          );
        }
        //Center it
        if (!image.id) alignObject("center", img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        let pos = translateCenterOrigin(img.top, img.left);
        let state = addObjectToState({
          ...image,
          type: "image",
          id: id,
          width: toMillimeter(img.width),
          height: toMillimeter(img.height),
          x: toMillimeter(pos.x),
          y: toMillimeter(pos.y),
        });
        saveSignState(state);
        console.log("Add image command result:", state);
      };
      i.src = image.url;
    }
  };

  const recreateCanvas = async (canvas: any, elements: any) => {
    elements.forEach((element: any) => {
      if (element.type == "text") {
        addText(canvas, element, false);
      }
      if (element.type == "image") {
        addImage(canvas, element, false); //blir buggat då den är async
      }
    });
  };

  const recreateSign = (canvas: any, sign: any, savetoHistory?: boolean) => {
    console.log("Reacreating sign", sign);
    if (!savetoHistory) {
      setSign(sign);
      dispatch(saveSign({ sign }));
    } else {
      saveSignState(sign);
    }

    //update the visual
    canvas.clear();
    setShape(canvas, sign.shape, sign.width, sign.height, false);
    setColor(canvas, sign.color, sign.textColor, false);
    setSize(canvas, sign.width, sign.height, false);

    recreateCanvas(canvas, sign.elements);
  };

  const translateCenterOrigin = (top: number, left: number) => {
    let canvas = editor?.canvas;
    let center = canvas.getCenter();
    let x = left - center.left;
    let y = top - center.top;
    return { x, y };
  };
  const translateTopLeftOrigin = (x: number, y: number) => {
    let canvas = editor?.canvas;
    let center = canvas.getCenter();
    let top = y + center.top;
    let left = x + center.left;

    return { top, left };
  };

  const getObjectById = (id: string) => {
    return sign.elements.find((element: any) => element.id === id);
  };

  const addObjectToState = (obj: any) => {
    console.log("Adding object to state");
    let newState = { ...sign, elements: [...sign.elements, obj] };
    return newState;
  };

  const removeObjectFromState = (id: string) => {
    console.log("Removing object from state");
    let newList: {}[] = [];
    sign.elements.forEach((element: any) => {
      if (element.id !== id) {
        newList.push(element);
      }
    });
    let newState = { ...sign, elements: newList };
    return newState;
  };

  const updateObjectInState = (id: number, props: any) => {
    console.log("Updating object in state");
    let newList: {}[] = [];
    sign.elements.forEach((element: any) => {
      if (element.id === id) {
        newList.push({ ...element, ...props });
      } else {
        newList.push(element);
      }
    });
    let newState = { ...sign, elements: newList };
    return newState;
  };

  const saveSignState = (newSign: any) => {
    console.log("Saving sign state", newSign);
    let id = uuidv4();
    setSign({ ...newSign, id });
    dispatch(saveSign({ sign: newSign }));
    setSignHistory([...signHistory, newSign]);
    setHistoryIndex(signHistory.length - 1);
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
      editor?.canvas.renderAll();
      let pos = translateCenterOrigin(obj.top, obj.left);
      let state = updateObjectInState(obj.id, {
        x: toMillimeter(pos.x),
        y: toMillimeter(pos.y),
      });

      saveSignState(state);
    },
    [editor?.canvas, sign]
  );

  const alignObject = (location: string, obj: any, updateBackend?: boolean) => {
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
    if (updateBackend) {
      let pos = translateCenterOrigin(obj.top, obj.left);
      let state = updateObjectInState(obj.id, {
        x: toMillimeter(pos.x),
        y: toMillimeter(pos.y),
      });

      saveSignState(state);
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

    let pos = translateCenterOrigin(obj.top, obj.left);
    let state = updateObjectInState(obj.id, {
      x: toMillimeter(pos.x),
      y: toMillimeter(pos.y),
      width: toMillimeter(obj.width * obj.scaleX),
      height: toMillimeter(obj.height * obj.scaleY),
      angle: obj.angle,
    });

    saveSignState(state);
  };

  const handleTextChange = (e: any) => {
    let text = e.target;
    let newList = [];
    for (let i = 0; i < sign.elements.length; i++) {
      let element = { ...sign.elements[i] };

      if (element.id == text.id) {
        element.string = text.text; //Change the width also?
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
    let obj = editor?.canvas.getActiveObject();
    let state = removeObjectFromState(obj?.id);
    saveSignState(state);
    editor?.canvas.remove(editor?.canvas.getActiveObject());
  };
  const handleAlignObjectCenter = () => {
    alignObject("center", editor?.canvas.getActiveObject(), true);
  };
  const handleAlignObjectLeft = () => {
    alignObject("mid-left", editor?.canvas.getActiveObject(), true);
  };
  const handleAlignObjectRight = () => {
    alignObject("mid-right", editor?.canvas.getActiveObject(), true);
  };

  useEffect(() => {
    let canvas = editor?.canvas;

    if (canvas) {
      //New way of updating the canvas
      if (commands.length > commandsRecieved) {
        let command = commands[commands.length - 1]; //Look at the latest command
        handleCommand(command, canvas);
        setCommandsRecieved((commandsRecieved) => (commandsRecieved += 1));
        canvas.renderAll();
      }
    }
  }, [commands, canvas]);

  const handleCommand = (command: any, canvas: any) => {
    switch (command.command) {
      case "addText":
        addText(canvas, command.value, true);
        break;
      case "addImage": //async
        addImage(canvas, command.value, true);
        break;
      case "setShape":
        setShape(canvas, command.value, sign.width, sign.height, true);
        break;
      case "setSize":
        setSize(canvas, command.value.width, command.value.height, true);
        break;
      case "setColor":
        let front = command.value.frontColorValue;
        let back = command.value.backColorValue;
        setColor(canvas, front, back, true);
        break;
      case "goBack":
        let backIndex = historyIndex - 1;
        if (backIndex < 0) return;
        setHistoryIndex(backIndex);
        recreateSign(canvas, signHistory[backIndex]);
        break;
      case "goForward":
        let forwardIndex = historyIndex + 1;
        if (forwardIndex > signHistory.length - 1) return;
        setHistoryIndex(forwardIndex);
        recreateSign(canvas, signHistory[forwardIndex], false);
        break;
      case "reCreate":
        recreateSign(canvas, command.value, false);
        break;
      case "saveSign":
        if (command.value === "SVG") {
          handleSaveSvg(canvas);
        }
        if (command.value === "PDF") {
          handleDownloadJpeg(canvas);
        }
        break;
      case "reset":
        handleReset(canvas);
        break;
      case "addToCart":
        handleAddToCart(command.value);
        break;
      case "toggleCart":
        handleToggleCart();
        break;
      default:
        return;
    }
  };

  const handleToggleCart = () => {
    setShowCartModal(!showCartModal);
  };

  const handleReset = (canvas: any) => {
    canvas.clear();

    saveSignState({
      width: 250,
      height: 100,
      color: "#ffffff",
      textColor: "#000000",
      shape: "Rectangle",
      elements: [],
    });
    setShape(canvas, "Rectangle", 250, 100, true);
    setSize(canvas, 250, 100, true);
    setColor(canvas, "#ffffff", "#000000", true);
    setEditorControls();
    canvas.renderAll();
  };
  const handleAddToCart = (amount: number) => {
    console.log("Adding to cart", sign);
    let pixelData = canvas.toDataURL("image/jpeg", 1.0);
    canvas._objects[0].set({ shadow: null });

    //Ajust the svg optimised for the printer
    canvas._objects[0].set({
      fill: "#ffffff",
      stroke: "#ff0000",
      strokeWidth: 2,
    });

    let svg = canvas.toSVG();
    //Crop it?

    let item = {
      id: sign.id,
      metadata: signMetaData,
      data: {
        svg: svg,
        pixelData: pixelData,
      },
      visual: sign,
      price: signMetaData.price,
    };
    for (let i = 0; i < amount; i++) {
      dispatch(addToCart(item));
    }
    setShowCartModal(true);
    setShape(canvas, sign.shape, sign.width, sign.height, false);
    setColor(canvas, sign.color, sign.textColor, false);
  };

  const handleDownloadJpeg = (canvas: any) => {
    var saveImg = document.createElement("a");
    saveImg.href = canvas.toDataURL({
      format: "image/jpeg",
      quality: 0.8,
    });
    saveImg.download = "sign.jpeg";
    saveImg.click();
  };

  const handleSaveSvg = (canvas: any) => {
    canvas._objects[0].set({ shadow: null, strokeWidth: 1, stroke: "#ff0000" });
    console.log("Saving SVG");
    let svg = canvas.toSVG();
    let blob = new Blob([svg], { type: "image/svg+xml" });
    saveAs(blob, "sign.svg");
  };

  return (
    <div className="w-full h-full relative">
      <FabricJSCanvas
        className="sample-canvas w-full h-full bg-base-100"
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
      {showCartModal && <CartModal setShowCartModal={setShowCartModal} />}
    </div>
  );
};

export default Canvas;
