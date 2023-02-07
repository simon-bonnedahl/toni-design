import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_SIGN, Shapes, Sign } from "../../types/sign";

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
    const shapeWidth = toPixels(sign.width, zoom);
    const shapeHeight = toPixels(sign.height, zoom);

    switch (shape) {
      case Shape.RONDED_RECTANGLE:


  return (
    <>
      <FabricJSCanvas
        className="sample-canvas h-full w-full bg-red-500"
        onReady={initCanvas}
      />
    </>
  );
};
export default Editor;
