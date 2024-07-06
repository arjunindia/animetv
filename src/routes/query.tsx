import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/query")({
  component: Query,
});

function Query() {
  const { data, status } = useQuery({
    queryKey: ["fetchDogs"],
    queryFn: async () => {
      const res = await fetch("https://dog.ceo/api/breeds/image/random");
      return await res.json();
    },
  });
  return (
    <div className="p-2">
      <p>Watch out for Dogs...</p>
      {status === "success" ? (
        <div className="overflow-hidden p-3">
          <img
            src={data.message}
            alt="dog"
            className="w-1/2 max-h-[80vh] object-cover"
          />
        </div>
      ) : (
        <p>Working...</p>
      )}
    </div>
  );
}
