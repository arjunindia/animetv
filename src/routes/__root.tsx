import "../index.css";
import "../App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Nav } from "@/components/nav";
import { ThemeProvider } from "@/components/theme-provider";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  url: string;
}>()({
  component: () => {
    const { queryClient } = Route.useRouteContext();
    return (
      <ThemeProvider defaultTheme="dark" storageKey="animetv-key-theme">
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <Nav />
          <hr />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <QueryClientProvider client={queryClient}>
              <Outlet />
            </QueryClientProvider>
          </div>
        </div>
      </ThemeProvider>
    );
  },
});
