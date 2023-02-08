import { z } from "zod";

type Sign = {
  width: number;
  height: number;
  depth: number;
  shape: Shapes;
  backgroundColor: string;
  foregroundColor: string;
};
enum Shapes {
  RECTANGLE = 1,
  ROUNDED_RECTANGLE = 2,
  ELLIPSE = 3,
}

const DEFAULT_SIGN: Sign = {
  width: 100,
  height: 100,
  depth: 1,
  shape: Shapes.ROUNDED_RECTANGLE,
  backgroundColor: "#ffffff",
  foregroundColor: "#000000",
};

type Text = {
  text: string;
  fontSize: number;
  fontFamily: string;
};

type ToolbarProps = {
  sign: Sign;
  setShape: (shape: Shapes) => void;
  setSize: (width: number, height: number, depth: number) => void;
  setColor: (background: string, foreground: string) => void;
  addText: (text: Text) => void;
};

type Sign = z.infer<typeof Sign>;

export { Shapes, DEFAULT_SIGN, Sign, Text, ToolbarProps };
