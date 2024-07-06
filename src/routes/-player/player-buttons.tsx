import { Button } from "@/components/ui/button";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, PauseIcon, Play } from "lucide-react";
import { useCallback } from "react";

export const PlayButton = ({
  playing,
  onPlayPause,
  activate,
}: {
  playing: boolean;
  onPlayPause: () => void;
  activate: () => void;
}) => {
  const onEnterRelease = useCallback(() => {
    onPlayPause();
    if (!playing) activate;
  }, [onPlayPause, activate]);
  const { ref, focused } = useFocusable({
    onEnterRelease,
    onFocus: activate,
    focusKey: "VideoPlay",
  });
  return (
    <Button
      ref={ref}
      className={`absolute bottom-5 -translate-x-1/2 left-1/2 ${focused ? "outline outline-4" : ""}`}
      onClick={() => onPlayPause()}
    >
      {playing ? <PauseIcon /> : <Play />}
    </Button>
  );
};

export const BackButton = ({ activate }: { activate: () => void }) => {
  const { history } = useRouter();
  const { ref, focused } = useFocusable({
    onEnterRelease: () => history.back(),
    onFocus: activate,
  });
  return (
    <Button
      ref={ref}
      className={`absolute top-5 left-5 ${focused ? "outline outline-4" : ""}`}
      onClick={() => history.back()}
    >
      <ArrowLeft />
    </Button>
  );
};
