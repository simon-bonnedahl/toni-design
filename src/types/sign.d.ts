const Sign = z.object({
  width: z.number(),
  height: z.number(),
  shape: z.enum([Shapes.RECTANGLE, Shapes.ROUNDED_RECTANGLE, Shapes.ELLIPSE]),
});
type Sign = {
  width: number;
  height: number;
  shape: Shapes;
  backgroundColor: string;
  foregroundColor: string;
};
enum Shapes {
  RECTANGLE = 1,
  RONDED_RECTANGLE = 2,
  ELLIPSE = 3,
}

DEFAULT_SIGN = {
  width: 100,
  height: 100,
  shape: Shapes.ROUNDED_RECTANGLE,
  backgroundColor: "#ffffff",
  foregroundColor: "#000000",
};

type Text = {
  text: string;
  fontSize: number;
  fontFamily: string;
};

type Sign = z.infer<typeof Sign>;

export { Shapes, DEFAULT_SIGN, Sign, Text };
