import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { trpc } from "../../utils/trpc";
const fabric = require("fabric").fabric;
const { v4: uuidv4 } = require("uuid");

const Editor: React.FC = () => {
  const { editor, onReady } = useFabricJSEditor();
  const [canvas, setCanvas] = useState<any>();
  const [zoom, setZoom] = useState(1);
  const [sign, setSign] = useState<Sign>(DEFAULT_SIGN);
  const history: Sign[] = [];

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
    history.push(sign);
    // Update the sign's shape.
    setSign((prev) => ({ ...prev, shape }));
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
    history.push(sign);
    // Update sign's width and height.
    setSign((prev) => ({ ...prev, width, height, depth }));
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
    history.push(sign);
    // Update sign's background and foreground colors.
    setSign((prev) => ({
      ...prev,
      backgroundColor: background,
      foregroundColor: foreground,
    }));
    return (
      <>
        <FabricJSCanvas
          className="sample-canvas h-full w-full bg-red-500"
          onReady={initCanvas}
        />
      </>
    );
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
  };

  const addImage = async (image: Image) => {
    //get the Image
    const imgUrl = await trpc.color.getColors.useQuery(image.id).data;
    if (image.type === "image/svg+xml") {
      //Async load
      fabric.loadSVGFromURL(imgUrl, function (objects: any, options: any) {

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
              fill: sign.backgroundColor,
              stroke: sign.foregroundColor,
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
  };
  const props: ToolbarProps = {
    sign,
    setShape,
    setSize,
    setColor,
    addText,
    addImage,
    setApplication,
  };

  const undo = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      if (prev) setSign(prev);
    }
  };
  const redo = () => {};
  // Update the shape when the canvas is ready.
  useMemo(() => {
    if (canvas) setShape(sign.shape);
  }, [canvas]);

  return (
    <div className="relative h-full w-full">
      <Toolbar {...props} />
      <FabricJSCanvas
        className="sample-canvas h-full w-full bg-base-100"
        onReady={initCanvas}
      />
    </div>
  );
};

export default Editor;