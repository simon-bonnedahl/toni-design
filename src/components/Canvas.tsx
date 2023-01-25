/* eslint @typescript-eslint/no-var-requires: "off" */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import ControlBox from "./ControlBox";
import { clearCommands, selectCommands } from "../../reducers/editorSlice";
import { getSignMetadata, saveSign } from "../../reducers/signSlice";
import { addToCart } from "../../reducers/cartSlice";
import client, { urlFor } from "../../sanity";
import { toast } from "react-toastify";
import sanityDB from "../../sanity";
const fabric = require("fabric").fabric;
const { v4: uuidv4 } = require("uuid");

const Canvas: React.FC = () => {
  const { editor, onReady } = useFabricJSEditor();

  const [sign, setSign] = useState<any>({
    width: 150,
    height: 50,
    color: "#ffffff",
    textColor: "#000000",
    shape: "Rounded Rectangle",
    elements: [],
  });

  const signMetaData = useSelector(getSignMetadata);

  const commands = useSelector(selectCommands);
  const [signHistory, setSignHistory] = useState<any[]>([sign]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedObject, setSelectedObject] = useState(false);
  const [commandsRecieved, setCommandsRecieved] = useState(0);
  const [zoom, setZoom] = useState(2);
  const dispatch = useDispatch();

  const init = (canvas: any) => {
    setShape(canvas, sign.shape, sign.width, sign.height, true);
    setSize(canvas, sign.width, sign.height, true);
    setColor(canvas, sign.color, sign.textColor, true);
    setEditorControls();
    canvas.renderAll();
    onReady(canvas);

    onresize = () => {
      //Should also move the objects to the correct postion when resizing

      canvas.centerObject(canvas._objects[0]);
    };
  };

  const setEditorControls = () => {
    const s = fabric.Object.prototype.set({
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
    return mm * 2.8346546 * zoom; //Based on my laptops ppi, need to be calculated
  };

  const toMillimeter = (px: number) => {
    return px / 2.8346546;
  };
  //Update the code in the setSize function to make the sign always be appearing as 70-90% of the canvas size
  const setSize = (
    canvas: any,
    width: number,
    height: number,
    updateBackend: boolean
  ) => {
    const sign = canvas._objects[0];
    const pixelWidth = toPixels(width);
    const pixelHeight = toPixels(height);

    //if either width or height is bigger than 90 % of the canvas size, we need to zoom out
    if (pixelWidth > canvas.width * 0.9 || pixelHeight > canvas.height * 0.9) {
      setZoom(zoom * 0.9);
    }
    //if either width or height is smaller than 70 % of the canvas size, we need to zoom in
    if (pixelWidth < canvas.width * 0.7 || pixelHeight < canvas.height * 0.7) {
      setZoom(zoom * 1.1);
    }

    if (sign) {
      if (sign.shape === "Ellipse") {
        sign.set({ rx: pixelWidth / 2, ry: pixelHeight / 2 });
      } else {
        sign.set({ width: pixelWidth, height: pixelHeight });
      }
      canvas.centerObject(sign);

      canvas.renderAll();
    }
    if (updateBackend) {
      const newSign = { ...sign, width, height };
      saveSignState(newSign);
    }
  };

  const handleZoom = (canvas: any, sign: any) => {
    const shapeRatio = sign.width / sign.height;
    const canvasRatio = canvas.width / canvas.height;
    const ratio = canvasRatio / shapeRatio;
    //calculate based on the ratio between the shape and the canvas if we need to change the zoom level
    const zoomConst = 2;

    canvas.zoomToPoint(
      new fabric.Point(canvas.width / 2, canvas.height / 2),
      ratio * zoomConst
    );
  };

  const setShape = (
    canvas: any,
    shape: string,
    width: number,
    height: number,
    updateBackend: boolean
  ) => {
    let s = null;
    const borderWidth = 0;
    const borderColor = "#000";
    const w = toPixels(width);
    const h = toPixels(height);

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

    canvas.centerObject(s);
    canvas._objects[0] = s;

    if (updateBackend) {
      const newSign = { ...sign, shape };
      saveSignState(newSign);
    }
  };

  const setColor = (
    canvas: any,
    back: string,
    front: string,
    updateBackend: boolean
  ) => {
    const shape = canvas._objects[0];
    if (shape) shape.set({ fill: back });
    for (let i = 1; i < canvas._objects.length; i++) {
      const object = canvas._objects[i];
      if (object.type === "i-text") {
        object.set({ fill: front });
      } else if (object.type === "group") {
        //svg group
        for (let i = 0; i < object._objects.length; i++) {
          object._objects[i].set({
            fill: front,
            stroke: front,
          });
        }
      } else if (object.type == "path") {
        //svg path
        object.set({
          fill: front,
        });
      }
    }

    if (updateBackend) {
      const newSign = { ...sign, color: back, textColor: front };
      saveSignState(newSign);
    }
  };

  const addText = (
    canvas: any,
    text: any,
    updateBackend: boolean,
    color?: string
  ) => {
    const id = text.id ? text.id : uuidv4(); //If the text already has an id, use that, otherwise generate a new one

    const textObject = new fabric.IText(text.string, {
      //Create the text visual object
      fill: color || text.color,
      fontFamily: text.font,
      fontSize: text.fontSize,
      id: id,
    });
    if (!text.id) {
      alignObject("center", textObject); //Align the text to the center//Set the text as the active object
    } else {
      //Its an existing text, already in the backend
      console.log("reacreating this existing text", textObject);
      const pos = translateTopLeftOrigin(toPixels(text.x), toPixels(text.y));
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
      const pos = translateCenterOrigin(textObject.top, textObject.left);
      const textObj = {
        ...text,
        type: "text",
        id: id,
        x: toMillimeter(pos.x),
        y: toMillimeter(pos.y),
        width: toMillimeter(textObject.width),
        height: toMillimeter(textObject.height),
        angle: textObject.angle,
      };

      const state = addObjectToState(textObj);
      saveSignState(state);
      console.log("Add text command result:", state);
    }
    canvas.add(textObject);
    canvas.setActiveObject(textObject);
  };

  const addImage = async (
    canvas: any,
    image: any,
    updateBackend: boolean,
    color?: string
  ) => {
    console.log("Adding image", image);
    console.log("Fetching image from sanity");
    const query = `*[_type == 'asset' && id == '${image.imageId}']`;
    let url = "";
    await client.fetch(query).then((res: any) => {
      console.log("Got image from sanity", res[0].url);
      url = urlFor(res[0].url).url();
    });
    const id = image.id ? image.id : uuidv4();

    if (image.imageType === "image/svg+xml") {
      //Async load
      fabric.loadSVGFromURL(url, function (objects: any, options: any) {
        const svg = fabric.util.groupSVGElements(objects, options);
        const scale = sign.width / svg.width;
        svg.set({
          id: id,
          scaleX: scale,
          scaleY: scale,
        });

        if (svg._objects) {
          for (let i = 0; i < svg._objects.length; i++) {
            svg._objects[i].set({
              fill: color || sign.textColor,
              stroke: color || sign.textColor,
            });
          }
        } else {
          svg.set({
            fill: color || sign.textColor,
          });
        }

        canvas.add(svg);
        if (image.id) {
          //IF we have visual props
          const pos = translateTopLeftOrigin(
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
        const pos = translateCenterOrigin(svg.top, svg.left);
        const state = addObjectToState({
          ...image,
          type: "image",
          id: id,
          width: toMillimeter(svg.width),
          height: toMillimeter(svg.height),
          x: toMillimeter(pos.x),
          y: toMillimeter(pos.y),
        });
        if (updateBackend) {
          saveSignState(state);
        }

        console.log("Add image command result:", state);
      });
    } else {
      const imgElement = document.createElement("img");
      imgElement.src = url;
      //Create the image to gain the width and height
      const i = new Image();
      i.onload = function () {
        //Then only reason to create the image is to get the width and height
        const img = new fabric.Image(imgElement);

        const scale = sign.width / i.width;
        img.set({
          id: id,
          scaleX: scale,
          scaleY: scale,
        });

        canvas.add(img);
        if (image.id) {
          //IF we have visual props
          const pos = translateTopLeftOrigin(
            toPixels(image.x),
            toPixels(image.y)
          );
        }
        //Center it
        if (!image.id) alignObject("center", img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        const pos = translateCenterOrigin(img.top, img.left);
        const state = addObjectToState({
          ...image,
          type: "image",
          id: id,
          width: toMillimeter(img.width),
          height: toMillimeter(img.height),
          x: toMillimeter(pos.x),
          y: toMillimeter(pos.y),
        });
        if (updateBackend) {
          saveSignState(state);
          console.log("Add image command result:", state);
        }
      };
      console.log("Loading image from url", url);
      i.src = url;
    }
  };

  const recreateCanvas = async (canvas: any, elements: any, color: string) => {
    elements.forEach((element: any) => {
      if (element.type == "text") {
        addText(canvas, element, false, color);
      }
      if (element.type == "image") {
        addImage(canvas, element, false, color);
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

    recreateCanvas(canvas, sign.elements, sign.textColor);
  };

  const translateCenterOrigin = (top: number, left: number) => {
    const canvas = editor?.canvas;
    const center = canvas.getCenter();
    const x = left - center.left;
    const y = top - center.top;
    return { x, y };
  };
  const translateTopLeftOrigin = (x: number, y: number) => {
    const canvas = editor?.canvas;
    const center = canvas.getCenter();
    const top = y + center.top;
    const left = x + center.left;

    return { top, left };
  };

  const getObjectById = (id: string) => {
    return sign.elements.find((element: any) => element.id === id);
  };

  const addObjectToState = (obj: any) => {
    const newState = { ...sign, elements: [...sign.elements, obj] };
    return newState;
  };

  const removeObjectFromState = (id: string) => {
    console.log("Removing object from state");
    const newList: any[] = [];
    sign.elements.forEach((element: any) => {
      if (element.id !== id) {
        newList.push(element);
      }
    });
    const newState = { ...sign, elements: newList };
    return newState;
  };

  const updateObjectInState = (id: number, props: any) => {
    const newList: any[] = [];
    sign.elements.forEach((element: any) => {
      if (element.id === id) {
        newList.push({ ...element, ...props });
      } else {
        newList.push(element);
      }
    });
    const newState = { ...sign, elements: newList };
    return newState;
  };

  const saveSignState = (newSign: any) => {
    //console.log("Saving sign state", newSign);
    const id = uuidv4();
    setSign({ ...newSign, id });
    dispatch(saveSign({ sign: newSign }));
    setSignHistory([...signHistory, newSign]);
    setHistoryIndex(signHistory.length - 1);
  };

  const keyHandler = useCallback(
    (event: { key: string }) => {
      const obj = editor?.canvas.getActiveObject();
      if (!obj) return;
      const shape = editor?.canvas._objects[0];
      const speed = 4;
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
      const pos = translateCenterOrigin(obj.top, obj.left);
      const state = updateObjectInState(obj.id, {
        x: toMillimeter(pos.x),
        y: toMillimeter(pos.y),
      });

      saveSignState(state);
    },
    [editor?.canvas]
  );

  const alignObject = (location: string, obj: any, updateBackend?: boolean) => {
    //https://stackoverflow.com/questions/47408816/object-alignment-in-fabric-js
    const canvas = editor?.canvas;
    const shape = canvas?._objects[0];
    const padding = 2;

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
      const pos = translateCenterOrigin(obj.top, obj.left);
      const state = updateObjectInState(obj.id, {
        x: toMillimeter(pos.x),
        y: toMillimeter(pos.y),
      });

      saveSignState(state);
    }

    canvas.renderAll();
  };
  const canvas = editor?.canvas;

  const handleSelectObject = () => {
    document.addEventListener("keydown", keyHandler, false);
    setSelectedObject(true);
  };
  const handleUnselectObject = () => {
    document.removeEventListener("keydown", keyHandler, false);
    setSelectedObject(false);
  };

  const handleMoveObject = (e: any) => {
    const obj = e.target;
    const canvas = editor?.canvas;
    const shape = canvas?._objects[0];
    const padding = 2;
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

  const handleModifyObject = (e: any) => {
    const obj = e.target;

    const pos = translateCenterOrigin(obj.top, obj.left);
    const state = updateObjectInState(obj.id, {
      x: toMillimeter(pos.x),
      y: toMillimeter(pos.y),
      width: toMillimeter(obj.width * obj.scaleX),
      height: toMillimeter(obj.height * obj.scaleY),
      angle: obj.angle,
    });

    saveSignState(state);
  };

  const handleTextChange = (e: any) => {
    const text = e.target;
    const newList = [];
    for (let i = 0; i < sign.elements.length; i++) {
      const element = { ...sign.elements[i] };

      if (element.id == text.id) {
        element.string = text.text; //Change the width also?
      }
      newList.push(element);
    }
    const s = { ...sign, elements: newList };
    setSign(s);
    dispatch(saveSign({ sign: s }));
    setHistoryIndex(signHistory.length);
    setSignHistory([...signHistory, s]);
  };

  const handleDeleteObject = () => {
    const obj = editor?.canvas.getActiveObject();
    const state = removeObjectFromState(obj?.id);
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
        const front = command.value.frontColorValue;
        const back = command.value.backColorValue;
        setColor(canvas, front, back, true);
        break;
      case "goBack":
        const backIndex = historyIndex - 1;
        if (backIndex < 0) return;
        setHistoryIndex(backIndex);
        recreateSign(canvas, signHistory[backIndex]);
        break;
      case "goForward":
        const forwardIndex = historyIndex + 1;
        if (forwardIndex > signHistory.length - 1) return;
        setHistoryIndex(forwardIndex);
        recreateSign(canvas, signHistory[forwardIndex], false);
        break;
      case "reCreate":
        recreateSign(canvas, command.value, false);
        break;
      case "saveSign":
        if (command.value === "SVG") {
          return;
        }
        if (command.value === "PDF") {
          handleDownloadJpeg(canvas);
        }

        break;
      case "saveSignToDatabase":
        handleSaveSignToDatabase(canvas, command.value);
        break;
      case "reset":
        handleReset(canvas);
        break;
      case "addToCart":
        if (commandsRecieved <= 0) toast.warning("Skylten är tom");
        handleAddToCart(command.value);

        break;
      default:
        return;
    }
  };
  useMemo(() => {
    //This solves the problem of executing commands on load this component but could cause some bugs
    const command = commands[commands.length - 1]; //Look at the latest command
    if (command && command.command === "reCreate") {
      setSign(command.value);
    } else {
      dispatch(clearCommands());
      setCommandsRecieved(0);
    }
  }, []);

  useEffect(() => {
    const canvas = editor?.canvas;

    if (!canvas) return;
    //New way of updating the canvas
    console.log(commands.length, commandsRecieved);
    if (commands.length > commandsRecieved) {
      const command = commands[commands.length - 1]; //Look at the latest command
      handleCommand(command, canvas);
      setCommandsRecieved((commandsRecieved) => (commandsRecieved += 1));
      canvas.renderAll();
    }

    //http://fabricjs.com/events
    canvas.on({
      "selection:created": handleSelectObject,
      "selection:cleared": handleUnselectObject,
      "object:moving": handleMoveObject,
      "object:modified": handleModifyObject,
      "text:changed": handleTextChange,
    });
  });

  const handleReset = (canvas: any) => {
    canvas.clear();

    saveSignState({
      width: 250,
      height: 100,
      color: "#ffffff",
      textColor: "#000000",
      shape: "Rounded Rectangle",
      elements: [],
    });
    setShape(canvas, "Rectangle", 250, 100, true);
    setSize(canvas, 250, 100, true);
    setColor(canvas, "#ffffff", "#000000", true);
    setEditorControls();
    canvas.renderAll();
  };

  const getSignSVG = (canvas: any) => {
    //remove the shadow and set it to the right size
    canvas._objects[0].set({
      shadow: null,
      width: toPixels(sign.width),
      height: toPixels(sign.height),
    });

    //Ajust the svg optimised for the printer with red borders, white background and black content
    canvas._objects[0].set({
      fill: "#ffffff",
      stroke: "#ff0000",
      strokeWidth: 2,
    });

    //loop through all objects and fill with black
    for (let i = 1; i < canvas._objects.length; i++) {
      const object = canvas._objects[i];
      if (object.type === "i-text") {
        object.set({ fill: "#000000" });
      } else if (object.type === "group") {
        //svg group
        for (let i = 0; i < object._objects.length; i++) {
          object._objects[i].set({
            fill: "#000000",
            stroke: "#000000",
          });
        }
      } else if (object.type == "path") {
        //svg path
        object.set({
          fill: "#000000",
        });
      }
    }
    const svg = canvas.toSVG();
    //Crop it?
    return svg;
  };

  const handleAddToCart = (amount: number) => {
    console.log("Adding to cart", sign);
    const pixelData = canvas.toDataURL("image/jpeg", 1.0);

    const item = {
      id: sign.id,
      metadata: signMetaData,
      data: {
        svg: getSignSVG(canvas),
        pixelData: pixelData,
      },
      visual: sign,
      price: signMetaData.price,
    };
    for (let i = 0; i < amount; i++) {
      dispatch(addToCart(item));
    }
    setShape(canvas, sign.shape, sign.width, sign.height, false);
    setColor(canvas, sign.color, sign.textColor, false);
  };

  const handleDownloadJpeg = (canvas: any) => {
    const saveImg = document.createElement("a");
    saveImg.href = canvas.toDataURL({
      format: "image/jpeg",
      quality: 1,
    });
    saveImg.download = "sign.jpeg";
    saveImg.click();
  };

  const handleSaveSignToDatabase = async (canvas: any, user: any) => {
    const file = dataURLtoFile(canvas.toDataURL(), "image.jpeg");
    console.log("hej");

    sanityDB.assets
      .upload("image", file, {
        contentType: file.type,
        filename: "image.jpeg",
      })
      .then((document) => {
        const doc = {
          _type: "createdSign",
          creator: user,
          image: {
            _type: "image",
            asset: {
              _ref: document._id,
            },
          },
          json: JSON.stringify({ visual: sign, metadata: signMetaData }),
        };
        sanityDB.create(doc).then(() => {
          console.log("Document was created");
          toast.success("Skylten sparades", {
            autoClose: 2000,
          });
        });
      })
      .catch((error) => {
        console.log("Upload failed:", error.message);
      });
  };

  function dataURLtoFile(dataurl: any, filename: any) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  return (
    <div className="relative h-full w-full">
      <FabricJSCanvas
        className="sample-canvas h-full w-full bg-base-100"
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
