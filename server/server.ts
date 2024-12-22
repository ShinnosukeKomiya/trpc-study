import express from "express";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

const app = express();
const PORT = 5000;

interface Todo {
  id: number;
  content: string;
}

const todoList: Todo[] = [
  { id: 1, content: "test" },
  { id: 2, content: "test2" },
];

const trpc = initTRPC.create();
const router = trpc.router;
const publicProcedure = trpc.procedure;

const appRouter = router({
  test: publicProcedure.query(() => "Query Response"),
  getTodos: publicProcedure.query(() => todoList),
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
