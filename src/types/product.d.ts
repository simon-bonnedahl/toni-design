import { z } from "zod";

const Product = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  image: z.string(),
  category: z.string(),
});

const CollectionItem = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  imageUrl: z.string(),
});
