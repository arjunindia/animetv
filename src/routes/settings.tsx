import { ModeToggle } from "@/components/mode-toggle";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: () => (
    <div className="w-full h-full flex flex-col p-4 items-center">
      <h1 className="text-3xl mb-8">Settings</h1>
      <div className="w-1/2 flex justify-between items-center">
        <label className="px-4">Set color theme:</label>
        <ModeToggle />
      </div>
    </div>
  ),
});
