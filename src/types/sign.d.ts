const Sign = z.object({
  width: z.number(),
  height: z.number(),
  shape: z.enum([Shapes.RECTANGLE, Shapes.ROUNDED_RECTANGLE, Shapes.ELLIPSE]),
});
type Sign = {
  width: number;
  height: number;
  shape: Shapes;
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
};

type Sign = z.infer<typeof Sign>;

export { Shapes, DEFAULT_SIGN, Sign };
