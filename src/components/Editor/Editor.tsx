import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_SIGN, Shapes, Sign, Text } from "../../types/sign";

import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { toPixels } from "./utils";
const fabric = require("fabric").fabric;
const { v4: uuidv4 } = require("uuid");

const Editor: React.FC = () => {
  const { editor, onReady } = useFabricJSEditor();
  const [canvas, setCanvas] = useState<typeof fabric.Canvas>();
  const [zoom, setZoom] = useState(1);
  const [sign, setSign] = useState<Sign>(DEFAULT_SIGN);

  const initCanvas = (canvas: typeof FabricJSCanvas) => {
    setEditorControls();
    onReady(canvas);
    setCanvas(editor!.canvas);

    initSign();
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

  const initSign = () => {
    setShape(sign.shape);
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
      case Shapes.RONDED_RECTANGLE:
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

    // Center the shape in the canvas.
    canvas.centerObject(object);
    // Replace the shape in the canvas.
    canvas._objects[0] = object;
    canvas.renderAll();

    // Update the sign's shape.
    setSign((prev) => ({ ...prev, shape }));
  };

  const getShape = () => {
    return canvas._objects[0];
  };

  const setSize = (width: number, height: number) => {
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
    // Update sign's width and height.
    setSign((prev) => ({ ...prev, width, height }));
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
    // Update sign's background and foreground colors.
    setSign((prev) => ({ ...prev, backgroundColor: background, foregroundColor: foreground }));
  return (
    <>
      <FabricJSCanvas
        className="sample-canvas h-full w-full bg-red-500"
        onReady={initCanvas}
      />
    </>
  );
  };

  const addText = (text: Text) => {
    // Create the text object.
    const textObject = new fabric.IText(text.text, {
      //Create the text visual object
      fill: sign.foregroundColor,
      fontFamily: text.font,
      fontSize: text.fontSize,
      id: id,
    });



export default Editor;
