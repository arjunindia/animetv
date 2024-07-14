import { IAnimeResult } from "@consumet/extensions";
import {
  FocusHandler,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate, Link } from "@tanstack/react-router";
import { memo, useCallback } from "react";

const AnimeComponent = ({
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
      className={`relative xl:w-1/6 md:w-1/4 w-1/2 m-3 h-auto focus:scale-105 ${focused ? "scale-105 outline outline-primary outline-4" : ""} shadow-lg ring-1 ring-black/5 rounded overflow-clip`}
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
export const Anime = memo(AnimeComponent);
