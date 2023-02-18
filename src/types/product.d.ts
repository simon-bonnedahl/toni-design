import { z } from "zod";
import Sign from "./sign.d";

const Product = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  width: z.number(),
  height: z.number(),
  image: z.string(),
  category: z.string(),
});

export interface NonAdjustableProduct extends Product {}

export interface AdjustableProduct2 extends Product {
  sign: Sign;
  JSON: string;
  SVG: string;
}

const AdjustableProduct = z.object({
  sign: Sign,
  id: z.string(),
  title: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  SVG: z.string(),
});

export type AdjustableProduct = {
  sign: Sign;
  id: string;
  title: string;
  imageUrl: string;
  SVG: string;
  price: number;
};

export type Product = z.infer<typeof Product>;
