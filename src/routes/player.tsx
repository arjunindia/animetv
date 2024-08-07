import {
  useFocusable,
  FocusContext,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer, { FilePlayerProps } from "react-player/file";
import { BackButton, PlayButton } from "./-player/player-buttons";
import { PLayerSeek } from "./-player/player-seek";
import { OnProgressProps } from "react-player/base";
import type { ISource } from "@consumet/extensions";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
const postsQueryOptions = (episode: string | null, url: string) =>
  queryOptions({
    queryKey: ["episode", episode],
    queryFn: async (): Promise<ISource> => {
      if (episode == null) throw new Error("Missing Anime ID");
      const res = await fetch(`${url}/getsource/${episode}`);
      return await res.json();
    },
  });

// Lazy load the YouTube player
export const Route = createFileRoute("/player")({
  component: Player,
  validateSearch: ({ episode }: { episode: unknown }) => {
    if (typeof episode != "string") return { episode: null };
    return { episode };
  },
  loaderDeps: ({ search: { episode } }) => ({ episode }),
  loader: ({ context: { queryClient, url }, deps: { episode } }) =>
    queryClient.ensureQueryData(postsQueryOptions(episode, url)),
});

function Player() {
  const { episode } = Route.useSearch();
  const { url } = Route.useRouteContext();
  const sourceData = useSuspenseQuery(postsQueryOptions(episode, url));
  const { ref, focusKey, focusSelf } = useFocusable({
    isFocusBoundary: true,
    onArrowPress: () => {
      setHidden(false);
      return true;
    },
    focusBoundaryDirections: ["up", "down"],
  });
  const videoRef = useRef<FilePlayerProps["ref"]>(null);

  const [hidden, setHidden] = useState(false);
  const [videoState, setVideoState] = useState({
    playing: true,
    muted: false,
    played: 0,
    seeking: false,
    Buffer: true,
  });
  useEffect(() => {
    focusSelf();
    setFocus("VideoPlay");
  }, [focusSelf]);

  const duration = videoRef.current
    ? new Date(1000 * videoRef.current.getDuration())
        .toISOString()
        .substring(11, 19)
    : "00:00:00";

  const activate = useCallback(() => {
    setHidden(false);
  }, [setHidden]);
  useEffect(() => {
    let timeout = null;
    if (videoState.playing)
      timeout = setTimeout(() => {
        setHidden(true);
      }, 6000);
    () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [hidden, videoState.playing]);
  useEffect(() => {
    document.addEventListener("click", activate);
    document.addEventListener("mousemove", activate);
    document.addEventListener("ArrowUp", activate);
    document.addEventListener("ArrowDown", activate);
    document.addEventListener("ArrowLeft", activate);
    document.addEventListener("ArrowRight", activate);
    return () => {
      document.removeEventListener("click", activate);
      document.removeEventListener("mousemove", activate);
      document.removeEventListener("keydown", activate);
      document.removeEventListener("ArrowUp", activate);
      document.removeEventListener("ArrowDown", activate);
      document.removeEventListener("ArrowLeft", activate);
      document.removeEventListener("ArrowRight", activate);
    };
  }, [activate]);
  useEffect(() => {
    if (!videoState.playing) setHidden(false);
  }, [videoState.playing]);
  const playPauseHandler = () => {
    //plays and pause the video (toggling)
    setVideoState({ ...videoState, playing: !videoState.playing });
  };
  const progressHandler = (state: OnProgressProps) => {
    if (!videoState.seeking) {
      setVideoState({ ...videoState, ...state });
    }
  };
  const rewindHandler = () => {
    //Rewinds the video player reducing 5
    videoRef.current.seekTo(videoRef.current.getCurrentTime() - 5);
  };
  const fastFowardHandler = () => {
    //FastFowards the video player by adding 10
    videoRef.current.seekTo(videoRef.current.getCurrentTime() + 10);
  };
  const seekHandler = (value: number[]) => {
    setVideoState({ ...videoState, played: value[0] / 100 });
  };

  const seekCompleteHandler = (value: number[]) => {
    setVideoState({ ...videoState, seeking: false });
    videoRef.current.seekTo(value[0] / 100);
  };
  const getQualityValue = (obj: ISource["sources"][0]) =>
    parseInt(obj.quality?.replace("p", "") || "0", 10);
  const bestQualityIndex = useRef(
    sourceData.data.sources.reduce((bestIndex, currentObj, currentIndex) => {
      return getQualityValue(currentObj) >
        getQualityValue(sourceData.data.sources[bestIndex])
        ? currentIndex
        : bestIndex;
    }, 0),
  );

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        className="bg-black absolute z-40 top-0 left-0 h-screen w-full"
        ref={ref}
      >
        <ReactPlayer
          ref={videoRef}
          playing={videoState.playing}
          muted={videoState.muted}
          playIcon={<Play />}
          height={"100%"}
          width={"100%"}
          url={sourceData.data.sources[bestQualityIndex.current].url}
          onProgress={progressHandler}
          // config={{
          //   file: {
          //     hlsOptions: {
          //       debug: false,
          //       xhrSetup: function (xhr: XMLHttpRequest) {
          //         if (sourceData.data.headers) {
          //           const headers = Object.entries(sourceData.data.headers);
          //           headers.map(([k, v]) => xhr.setRequestHeader(k, v));
          //         }
          //       },
          //     },
          //   },
          // }}
        />
        <div
          className={`transition-opacity ${hidden ? "opacity-0" : "opacity-100"}`}
        >
          <PlayButton
            activate={activate}
            playing={videoState.playing}
            onPlayPause={playPauseHandler}
          />
          <BackButton activate={activate} />
          <PLayerSeek
            activate={activate}
            timeEnd={duration}
            played={videoState.played}
            onSeek={seekHandler}
            onSeekUp={seekCompleteHandler}
            forward={fastFowardHandler}
            rewind={rewindHandler}
          />
        </div>
      </div>
    </FocusContext.Provider>
  );
}
