import { postsRouter } from "./routers/posts";
import { createTRPCRouter } from "~/server/api/trpc";
export const appRouter = createTRPCRouter({
  posts: postsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
