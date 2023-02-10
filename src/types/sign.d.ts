import { z } from "zod";

type Sign = {
  width: number;
  height: number;
  depth: number;
  type: SignTypes;
  shape: Shapes;
  backgroundColor: string;
  foregroundColor: string;
  colorCombination: string;
  application: Applications;
  JSON: string;
  SVG: string;
  price: number;
};
enum Shapes {
  RECTANGLE = 1,
  ROUNDED_RECTANGLE = 2,
  ELLIPSE = 3,
}

enum SignTypes {
  ENGRAVED = 1,
  PRINTED = 2,
}

enum Applications {
  NONE = 0,
  TAPE = 1,
  SCREW = 2,
  MAGNET = 3,
}

const DEFAULT_SIGN: Sign = {
  width: 200,
  height: 100,
  depth: 1,
  type: SignTypes.ENGRAVED,
  shape: Shapes.ROUNDED_RECTANGLE,
  backgroundColor: "#ffffff",
  foregroundColor: "#000000",
  colorCombination: "white/black",
  application: Applications.NONE,
  JSON: "",
  SVG: "",
  price: 0,
};

type Text = {
  text: string;
  fontSize: number;
  fontFamily: string;
};
type Image = {
  type: string;
  url: string;
  id: any;
};
type ToolbarProps = {
  sign: Sign;
  setShape: (shape: Shapes) => void;
  setSize: (width: number, height: number, depth: number) => void;
  setColor: (background: string, foreground: string) => void;
  addText: (text: Text) => void;
  addImage: (image: Image) => void;
  setApplication: (application: Applications) => void;
  undo: () => void;
  redo: () => void;
  restart: () => void;
};

type Sign = z.infer<typeof Sign>;

export {
  Shapes,
  DEFAULT_SIGN,
  Sign,
  Text,
  Image,
  ToolbarProps,
  SignTypes,
  Applications,
};
