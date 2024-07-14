import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ISearch, IAnimeResult } from "@consumet/extensions";
import {
  useFocusable,
  FocusContext,
} from "@noriginmedia/norigin-spatial-navigation";
import { memo, useCallback, useEffect, useRef } from "react";
import { Anime } from "@/components/Anime";
import { useOnScreen } from "@/lib/useOnScreen";

export const Route = createFileRoute("/")({
  component: memo(App),
});

function App() {
  const { url } = Route.useRouteContext();
  const queryRes = useInfiniteQuery({
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
  const { data, status, error, isError, isLoading } = queryRes;
  const { ref, focusKey, focusSelf } = useFocusable({
    trackChildren: true,
    saveLastFocusedChild: true,
    autoRestoreFocus: true,
  });
  const onAssetFocus = useCallback(
    ({ y }: { y: number }) => {
      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    },
    [ref],
  );

  useEffect(() => {
    focusSelf();
  }, [focusSelf, data]);

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
      <div className="p-4" ref={ref}>
        <h1 className="text-3xl font-bold">Home</h1>
        <div className="flex flex-wrap">
          {data?.pages.map((group) =>
            group.results.map((result) => (
              <Anime key={result.id} result={result} onFocus={onAssetFocus} />
            )),
          )}
        </div>
        <LoadMore res={queryRes} />
      </div>
    </FocusContext.Provider>
  );
}

export default App;

const LoadMore = ({
  res: { fetchNextPage, hasNextPage, isFetchingNextPage, isFetching },
}: {
  res: UseInfiniteQueryResult;
}) => {
  const elementRef = useRef(null);
  const isOnScreen = useOnScreen(elementRef);
  useEffect(() => {
    if (isOnScreen) fetchNextPage();
  }, [isOnScreen]);

  return (
    <div>
      <div>
        <div onClick={() => fetchNextPage()} ref={elementRef}>
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
        </div>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </div>
  );
};
