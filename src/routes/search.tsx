import { Anime } from "@/components/Anime";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IAnimeResult, ISearch } from "@consumet/extensions";
import {
  FocusContext,
  setFocus,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
export const Route = createFileRoute("/search")({
  component: Query,
});

function Query() {
  const { url } = Route.useRouteContext();
  const [search, setSearch] = useLocalStorage<string>("search", "");
  const { ref, focusKey } = useFocusable({
    preferredChildFocusKey: "SearchButton",
  });
  const { ref: listRef } = useFocusable();
  const { data, status } = useQuery({
    queryKey: ["search" + search],
    queryFn: async (): Promise<ISearch<IAnimeResult>> => {
      const res = await fetch(`${url}/search/${search}`);
      return await res.json();
    },
    enabled: Boolean(search),
  });
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
    setFocus("SearchBar");
  }, []);

  return (
    <FocusContext.Provider value={focusKey}>
      <div className="p-2" ref={ref}>
        <SearchBar search={search} setSearch={setSearch} />
        {status === "success" && data.results ? (
          <div className="flex flex-wrap" ref={listRef}>
            {data.results.map((result) => (
              <Anime key={result.id} result={result} onFocus={onAssetFocus} />
            ))}
          </div>
        ) : (
          <p>Working...</p>
        )}
      </div>
    </FocusContext.Provider>
  );
}

const SearchBar = (props: {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}) => {
  const { ref, focused } = useFocusable({
    onFocus: () => {
      ref.current.focus();
    },
    onBlur: () => {
      ref.current.blur();
      props.setSearch(ref.current.value);
    },
    focusKey: "SearchBar",
  });
  const handleSearch = useCallback(() => {
    if (ref.current === null) return;
    props.setSearch(ref.current.value);
  }, [ref, props.setSearch]);

  return (
    <div className="flex gap-3 mb-6 mx-3 max-w-[680px]">
      <Input
        defaultValue={props.search}
        ref={ref}
        placeholder="Search Anime..."
        className={`${focused ? "outline-ring outline" : ""}`}
      />
      <SearchButton handleSearch={handleSearch} />
    </div>
  );
};
const SearchButton = ({ handleSearch }: { handleSearch: () => void }) => {
  const { ref, focused } = useFocusable({
    onEnterPress: handleSearch,
    focusKey: "SearchButton",
  });
  return (
    <Button
      onClick={handleSearch}
      ref={ref}
      className={`${focused ? "scale-125" : ""}`}
    >
      <Search />
    </Button>
  );
};
