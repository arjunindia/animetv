import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { ISearch, IAnimeResult } from "@consumet/extensions";
import {
  useFocusable,
  FocusContext,
  type FocusHandler,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useCallback, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { url } = Route.useRouteContext();
  const {
    data,
    status,
    error,
    isError,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["fetchTopAnime"],
    queryFn: async ({ pageParam }): Promise<ISearch<IAnimeResult>> => {
      try {
        const res = await fetch(`${url}/list?p=${pageParam}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return await res.json();
      } catch (e) {
        throw e;
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage
        ? lastPage.currentPage
          ? lastPage.currentPage + 1
          : 2
        : null,
  });
  const { ref, focusKey } = useFocusable();
  const onAssetFocus = useCallback(
    ({ y }: { y: number }) => {
      console.log(y);
      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    },
    [ref],
  );

  useEffect(() => {
    setFocus("ROOT_FOCUS_KEY");
  }, []);

  if (isError)
    return (
      <>
        <div className="p-4">
          <p>Error</p>
          <br />
          <p> name: {error.name}</p>
          <br />
          <p>Message: {error.message}</p>
          <br />
          <pre>{error.stack}</pre>
        </div>
      </>
    );
  if (isLoading)
    return (
      <>
        <div>
          <p>{status}</p>
        </div>
      </>
    );
  return (
    <FocusContext.Provider value={focusKey}>
      <div className="p-4">
        <h1 className="text-3xl font-bold">Home</h1>
        <div className="flex flex-wrap" ref={ref}>
          {data?.pages.map((group) =>
            group.results.map((result) => (
              <Anime key={result.id} result={result} onFocus={onAssetFocus} />
            )),
          )}
        </div>
        <div>
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
                ? "Load More"
                : "Nothing more to load"}
          </button>
        </div>
        <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
      </div>
    </FocusContext.Provider>
  );
}

export default App;

const Anime = ({
  result,
  onFocus,
}: {
  result: IAnimeResult;
  onFocus: FocusHandler;
}) => {
  const navigate = useNavigate();
  const onEnterRelease = useCallback(() => {
    navigate({ to: `/${result.id}` });
  }, [navigate]);

  const { ref, focused } = useFocusable({ onFocus, onEnterRelease });
  return (
    <Link
      ref={ref}
      className={`relative xl:w-1/6 md:w-1/4 w-1/2 m-3 h-auto focus:scale-105 ${focused ? "scale-105" : ""} shadow-lg ring-1 ring-black/5 rounded overflow-clip`}
      to={`/${result.id}`}
    >
      <p className="absolute z-10 bg-pink-500 text-black m-2 px-2 py-1 text-sm rounded-xl">
        {result.releaseDate}
      </p>
      <img
        className="aspect-[9/16] object-cover w-full h-auto"
        src={result.cover || result.image}
      ></img>
      <p className="m-2 focus:mx-4">
        {typeof result.title === "string"
          ? result.title === ""
            ? result.id
            : result.title
          : result.title.english
            ? result.title.english
            : result.title.romaji}
      </p>
    </Link>
  );
};
