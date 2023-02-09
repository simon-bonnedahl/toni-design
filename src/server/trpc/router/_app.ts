// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { colorRouter } from "./color";
import { editorRouter } from "./editor";
import { orderRouter } from "./order";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  color: colorRouter,
  order: orderRouter,
  editor: editorRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
