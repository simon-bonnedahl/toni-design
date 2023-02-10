import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Applications,
  DEFAULT_SIGN,
  Image,
  Shapes,
  Sign,
  Text,
  ToolbarProps,
} from "../../types/sign.d";

import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { toPixels } from "./utils";
import Toolbar from "./Toolbar";
import { toast } from "react-toastify";
import Bottombar from "./Bottombar";
import { AdjustableProduct } from "../../types/product";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../reducers/cartSlice";
const fabric = require("fabric").fabric;
const { v4: uuidv4 } = require("uuid");
var localStorage = require("localStorage");

const Editor: React.FC = () => {
  const { editor, onReady } = useFabricJSEditor();
  const [canvas, setCanvas] = useState<any>();
  const [zoom, setZoom] = useState(1);
  const [sign, setSign] = useState<Sign>(DEFAULT_SIGN);
  const [history, setHistory] = useState<Sign[]>([]);
  const [future, setFuture] = useState<Sign[]>([]);

  const dispatch = useDispatch();

  const initCanvas = (canvas: any) => {
    setEditorControls();
    onReady(canvas);
    setCanvas(canvas);
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

  const setShape = (shape: Shapes) => {
    // The shape will be a rectangle, rounded rectangle, or ellipse.
    // The shape's width and height will be the same as the sign's.
    const shapeWidth = toPixels(sign.width, zoom);
    const shapeHeight = toPixels(sign.height, zoom);

    // Create the shape, setting it's fill color and size.
    let object = null;
    switch (shape) {
      case Shapes.RECTANGLE:
        object = new fabric.Rect({
          width: shapeWidth,
          height: shapeHeight,
          fill: sign.backgroundColor,
        });
        break;
      case Shapes.ROUNDED_RECTANGLE:
        object = new fabric.Rect({
          width: shapeWidth,
          height: shapeHeight,
          fill: sign.backgroundColor,
          rx: 20, // rounded corners
          ry: 20, // rounded corners
        });
        break;
      case Shapes.ELLIPSE:
        object = new fabric.Ellipse({
          rx: shapeWidth / 2,
          ry: shapeHeight / 2,
          fill: sign.backgroundColor,
        });
        break;
      default:
        return;
    }
    // Lock the shape so it can't be moved or resized
    object.hasControls = false;
    object.hasBorders = false;
    object.lockMovementX = true;
    object.lockMovementY = true;
    object.selectable = false;
    object.evented = false;
    object.shadow = new fabric.Shadow({
      color: "#555",
      blur: 30,
      offsetY: 5,
    });

    // Replace the shape in the canvas.
    canvas._objects[0] = object;
    // Center the shape in the canvas.
    canvas.centerObject(object);
    canvas.renderAll();
    // Add the previous sign to the history.
    // Update the sign's shape.
    setSign((prev) => ({ ...prev, shape, JSON: canvas.toJSON() }));
  };

  const getShape = () => {
    return canvas._objects[0];
  };

  const setSize = (width: number, height: number, depth: number) => {
    // Convert the width and height to pixels.
    const widthPx = toPixels(width, zoom);
    const heightPx = toPixels(height, zoom);
    // Set the shape's width and height.
    const shape = getShape();
    if (shape.type === "ellipse") {
      shape.set({
        rx: widthPx / 2,
        ry: heightPx / 2,
      });
    } else {
      shape.set({
        width: widthPx,
        height: heightPx,
      });
    }
    // Center the shape in the canvas.
    canvas.centerObject(shape);
    // Re-render the canvas.
    canvas.renderAll();
    // Add the previous sign to the history.
    setHistory((prev) => [...prev, sign]);
    // Update sign's width and height.
    setSign((prev) => ({
      ...prev,
      width,
      height,
      depth,
      JSON: canvas.toJSON(),
    }));
  };

  const setColor = (background: string, foreground: string) => {
    // Set the shape's fill color.
    const shape = getShape();
    shape.set({
      fill: background,
    });
    // Set the text and svg objects' fill and stroke colors.
    for (let i = 1; i < canvas._objects.length; i++) {
      const object = canvas._objects[i];
      if (object.type === "i-text") {
        object.set({ fill: foreground });
      } else if (object.type === "group") {
        //svg group
        for (let i = 0; i < object._objects.length; i++) {
          object._objects[i].set({
            fill: foreground,
            stroke: foreground,
          });
        }
      } else if (object.type == "path") {
        //svg path
        object.set({
          fill: foreground,
        });
      }
    }
    // Re-render the canvas.
    canvas.renderAll();
    // Add the previous sign to the history.
    setHistory((prev) => [...prev, sign]);
    console.log([...history, sign]);
    // Update sign's background and foreground colors.
    setSign((prev) => ({
      ...prev,
      backgroundColor: background,
      foregroundColor: foreground,
      JSON: canvas.toJSON(),
    }));
  };
  const setApplication = (application: Applications) => {
    // Recalculate the price

    setSign((prev) => ({ ...prev, application }));
  };

  const addText = (text: Text) => {
    // Create the text object.
    const textObject = new fabric.IText(text.text, {
      fill: sign.foregroundColor,
      fontFamily: text.fontFamily,
      fontSize: text.fontSize,
      //id: id,
    });
    canvas.add(textObject);
    canvas.centerObject(textObject);
    setHistory((prev) => [...prev, sign]);
    setSign((prev) => ({ ...prev, JSON: canvas.toJSON() }));
  };

  const addImage = async (image: Image) => {
    if (image.type === "image/svg+xml") {
      //Async load
      fabric.loadSVGFromURL(image.url, function (objects: any, options: any) {
        const svg = fabric.util.groupSVGElements(objects, options);
        const scale = sign.width / svg.width;
        svg.set({
          id: image.id,
          scaleX: scale,
          scaleY: scale,
        });

        if (svg._objects) {
          for (let i = 0; i < svg._objects.length; i++) {
            svg._objects[i].set({
              fill: sign.foregroundColor,
              stroke: sign.foregroundColor,
            });
          }
        } else {
          svg.set({
            fill: sign.foregroundColor,
          });
        }

        canvas.add(svg);
        canvas.centerObject(svg);
        canvas.setActiveObject(svg);
        canvas.renderAll();
        setHistory((prev) => [...prev, sign]);
        setSign((prev) => ({ ...prev, JSON: canvas.toJSON() }));
      });
    }
  };

  const undo = () => {
    if (history.length <= 0) {
      toast.error("No more undo's");
      return;
    }
    const prev = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setFuture((prev) => [...prev, sign]);
    if (prev) recreateSign(prev);
  };
  const redo = () => {
    if (future.length <= 0) {
      toast.error("No more redo's");
      return;
    }
    const next = future[future.length - 1];
    setFuture((prev) => prev.slice(0, prev.length - 1));
    setHistory((prev) => [...prev, sign]);
    if (next) recreateSign(next);
  };
  const restart = () => {
    setHistory([]);
    setFuture([]);
    canvas.clear();
    localStorage.clear();
    setShape(DEFAULT_SIGN.shape);
    setColor(DEFAULT_SIGN.backgroundColor, DEFAULT_SIGN.foregroundColor);
    setSize(DEFAULT_SIGN.width, DEFAULT_SIGN.height, DEFAULT_SIGN.depth);
    setSign(DEFAULT_SIGN);
  };

  const recreateSign = (sign: Sign) => {
    setSign(sign);

    // Clear the canvas.
    if (sign.JSON === "") return;
    canvas.clear();
    canvas.loadFromJSON(sign.JSON, function () {});
    setShape(sign.shape);
    setColor(sign.backgroundColor, sign.foregroundColor);
  };

  const generateSVG = () => {
    //remove the shadow and set it to the right size
    getShape().set({
      shadow: null,
      width: toPixels(sign.width, zoom),
      height: toPixels(sign.height, zoom),
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

  const addSignToCart = () => {
    if (sign.JSON === "") {
      toast.warning("Sign is empty");
    }
    const product: AdjustableProduct = {
      sign: sign,
      id: uuidv4(),
      title: "Skylt-Gravyr",
      imageUrl: canvas.toDataURL("image/jpeg", 1.0),
      SVG: generateSVG(),
    };
    dispatch(addToCart(product));
  };

  const keyHandler = useCallback(
    (e: { key: string }) => {
      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;
      console.log(e.key);
      if (e.key === "Delete") canvas.remove(activeObject);
      if (e.key === "ArrowUp") activeObject.top -= 1;
      if (e.key === "ArrowDown") activeObject.top += 1;
      if (e.key === "ArrowLeft") activeObject.left -= 1;
      if (e.key === "ArrowRight") activeObject.left += 1;

      canvas.renderAll();
      setHistory((prev) => [...prev, sign]);
      setSign((prev) => ({ ...prev, JSON: canvas.toJSON() }));
    },
    [canvas]
  );

  const handleSelectObject = () => {
    document.addEventListener("keydown", keyHandler, false);
  };
  const handleUnselectObject = () => {
    document.removeEventListener("keydown", keyHandler, false);
  };

  const handleMoveObject = (e: any) => {
    const obj = e.target;
    const shape = getShape();
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
    setHistory((prev) => [...prev, sign]);
    setSign((prev) => ({ ...prev, JSON: canvas.toJSON() }));
  };

  canvas?.on({
    "selection:created": handleSelectObject,
    "selection:cleared": handleUnselectObject,
    "object:moving": handleMoveObject,
    "object:modified": handleModifyObject,
  });

  // Update the shape when the canvas is ready.
  useMemo(() => {
    if (canvas) {
      if (localStorage.getItem("sign")) {
        const sign = JSON.parse(localStorage.getItem("sign") as string);
        recreateSign(sign);
      } else {
        setShape(sign.shape);
      }
    }
  }, [canvas]);

  useEffect(() => {
    if (sign.JSON === "") return;
    localStorage.setItem("sign", JSON.stringify(sign));
  }, [sign]);

  const props: ToolbarProps = {
    sign,
    setShape,
    setSize,
    setColor,
    addText,
    addImage,
    setApplication,
    undo,
    redo,
    restart,
  };

  return (
    <div className="relative h-full w-full">
      <Toolbar {...props} />
      <FabricJSCanvas
        className="sample-canvas h-full w-full bg-base-100"
        onReady={initCanvas}
      />
      <Bottombar />
    </div>
  );
};

export default Editor;
