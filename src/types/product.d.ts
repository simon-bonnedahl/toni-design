import { z } from "zod";
import Sign from "./sign.d";

const Product = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  width: z.number(),
  height: z.number(),
  imageUrl: z.string(),
  category: z.string(),
});

export type Product = z.infer<typeof Product>;

export type AdjustableProduct = Product & {
  sign: Sign;
  SVG: string;
};

export type NonAdjustableProduct = Product;
