import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import { httpBatchLink } from "@trpc/client";
import TodoList from "./components/todoList";
import superjson from "superjson";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({
        url: "http://localhost:5000/trpc",
        transformer: superjson,
      })],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <TodoList />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
