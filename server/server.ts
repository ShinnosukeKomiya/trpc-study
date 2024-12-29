import express from "express";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";

const app = express();
const PORT = 5000;
app.use(cors());

interface Todo {
  id: number;
  content: string;
  dueDate: Date;
}

const todoList: Todo[] = [
  { id: 1, content: "test", dueDate: new Date() },
  { id: 2, content: "test2", dueDate: new Date() },
];

const trpc = initTRPC.create();
const router = trpc.router;
const publicProcedure = trpc.procedure;

const appRouter = router({
  test: publicProcedure.query(() => "Query Response"),
  getTodos: publicProcedure.query(() => todoList),
  addTodo: publicProcedure.input(z.object({
    content: z.string(),
    dueDate: z.date(),
    })
  ).mutation(({ input }) => {
    todoList.push({
      id: todoList.length + 1,
      content: input.content,
      dueDate: input.dueDate,
    });
    return todoList;
  }),
  deleteTodo: publicProcedure.input(z.number()).mutation(({ input }) => {
    const indexToDelete = todoList.findIndex((todo) => todo.id === input);
    if (indexToDelete !== -1) {
      todoList.splice(indexToDelete, 1);
    }
    return todoList;
  }),
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

export type AppRouter = typeof appRouter;
