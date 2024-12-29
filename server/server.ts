import express from "express";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";
import superjson from "superjson";

const app = express();
const PORT = 5000;
app.use(cors());

interface Todo {
  id: number;
  content: string;
  dueDate: Date;
}

interface TodoMemo {
  id: number;
  memo: string;
  todoId: number;
}

const todoList: Todo[] = [
  { id: 1, content: "test", dueDate: new Date() },
  { id: 2, content: "test2", dueDate: new Date() },
];

const todoMemoList: TodoMemo[] = [
  { id: 1, memo: "memo1", todoId: 1 },
  { id: 2, memo: "memo2", todoId: 2 },
];

const trpc = initTRPC.create({
  transformer: superjson,
});
const router = trpc.router;
const publicProcedure = trpc.procedure;

const appRouter = router({
  test: publicProcedure.query(() => "Query Response"),
  getTodos: publicProcedure.query(() => todoList),
  getMemos: publicProcedure.query(() => todoMemoList),
  addTodo: publicProcedure.input(z.object({
    content: z.string(),
    dueDate: z.date(),
    memo: z.string(),
    })
  ).mutation(({ input }) => {
    const newTodoId = todoList.length + 1;
    todoList.push({
      id: newTodoId,
      content: input.content,
      dueDate: input.dueDate,
    });
    todoMemoList.push({
      id: todoMemoList.length + 1,
      memo: input.memo,
      todoId: newTodoId,
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
