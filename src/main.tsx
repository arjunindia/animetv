import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { init } from "@noriginmedia/norigin-spatial-navigation";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
});
// Hash based routing
const hashHistory = createMemoryHistory();
// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    url: "https://ani-test-ver.deno.dev",
  },
  defaultPreload: "intent",
  history: hashHistory,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
//init spatial navigation
init({
  // options
});
// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
