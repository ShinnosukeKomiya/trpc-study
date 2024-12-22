import express from "express";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

const app = express();
const PORT = 5000;

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

const trpc = initTRPC.create();
const router = trpc.router;
const publicProcedure = trpc.procedure;

const appRouter = router({
  test: publicProcedure.query(() => "Query Response"),
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
