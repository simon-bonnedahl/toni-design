
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import sanityDB from "../../../../sanity";
import { constants } from "zlib";

export const colorRouter = router({
  getColors: publicProcedure
    .query(async ({ input, ctx }) => {
        const query = '*[_type == "colorOption"]';
        const result = await sanityDB.fetch(query)
        return result;
    }),
});
