import type { IAnimeInfo, IAnimeEpisode, ITitle } from "@consumet/extensions";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { CirclePlayIcon, ArrowLeft } from "lucide-react";
import {
  useFocusable,
  FocusContext,
} from "@noriginmedia/norigin-spatial-navigation";
import { useCallback, useEffect } from "react";

export const Route = createFileRoute("/$animeid")({
  component: Query,
});

function Query() {
  const { animeid } = Route.useParams();
  const { url } = Route.useRouteContext();
  const { data, status } = useQuery({
    queryKey: ["fetchDogs"],
    queryFn: async (): Promise<IAnimeInfo> => {
      const res = await fetch(`${url}/anime/${animeid}`);
      return await res.json();
    },
  });
  const { ref, focusKey, focusSelf } = useFocusable();

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);
  return (
    <div>
      {status === "success" ? (
        <FocusContext.Provider value={focusKey}>
          <div
            style={{
              backgroundImage: `url(${data.cover || data.image})`,
              backgroundSize: "cover",
              backgroundPositionY: "30%",
            }}
            className=" transparent-gradient overflow-hidden h-[50vh] -my-4"
          ></div>
          <div className="isolate absolute flex w-[97vw] h-[100vh] -my-4 top-0 p-3">
            <BackButton />
            <div className="absolute bottom-0 flex-1">
              <p className="max-w-prose ">{data.description}</p>
              <h2 className="text-6xl font-bold py-6">
                {getTitleFromData(data.title)}
              </h2>
            </div>
            <div
              ref={ref}
              className="absolute top-0 right-0 w-[40vw] h-[80vh] py-8 pb-[50vh] -z-10 overflow-y-scroll overflow-x-hidden flex flex-col items-center gap-2"
            >
              {data.episodes?.map((episode) => (
                <Episode key={episode.id} episode={episode} />
              ))}
            </div>
          </div>
        </FocusContext.Provider>
      ) : (
        <p>Working...</p>
      )}
    </div>
  );
}

const Episode = ({ episode }: { episode: IAnimeEpisode }) => {
  const navigate = useNavigate();
  const { ref, focused } = useFocusable({
    onFocus: () => {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    },
    onEnterPress: () => {
      navigate({ to: "/player", search: { episode: episode.id } });
    },
  });
  return (
    <Link
      to="/player"
      search={{ episode: episode.id }}
      className="group"
      ref={ref}
    >
      <div
        className={`group-focus:scale-105 ${focused ? "scale-105" : ""} w-[30vw] p-3 ${episode.isFiller ? `bg-red-600` : `bg-popover-foreground`} text-popover mb-2 rounded relative`}
      >
        <p className="font-bold">Episode {episode.number}</p>
        <p>{episode.description}</p>
        <CirclePlayIcon className="absolute right-3 top-3" />
      </div>
    </Link>
  );
};
const BackButton = () => {
  const { history } = useRouter();
  const onEnterRelease = useCallback(() => {
    history.back();
  }, [history]);

  const { ref, focused } = useFocusable({ onEnterRelease });
  return (
    <Link
      ref={ref}
      to=".."
      className={`bg-background shadow-xl rounded-full p-3 h-min m-3 mt-5 ${focused ? "outline outline-ring scale-110" : ""}`}
    >
      <ArrowLeft />
    </Link>
  );
};
function getTitleFromData(title: string | ITitle): string {
  if (typeof title === "string") {
    return title;
  }
  if (title.english) {
    if (title.romaji) return title.english + ` (${title.romaji})`;
    return title.english;
  }
  if (title.romaji) return title.romaji;
  if (title.native) return title.native;
  if (title.userPreferred) return title.userPreferred;
  return "Title Not Found";
}
