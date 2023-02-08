import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import sanityDB, { urlFor } from "../../../../sanity";
import { constants } from "zlib";

export const editorRouter = router({
  getColors: publicProcedure.query(async ({ input, ctx }) => {
    const query = '*[_type == "colorOption"]';
    const result = await sanityDB.fetch(query);
    return result;
  }),

  getImage: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const query = `*[_type == 'asset' && id == '${input.id}']`;
      const result = await sanityDB.fetch(query);
      return urlFor(result[0].url).url();
    }),
});
