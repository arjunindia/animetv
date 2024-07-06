import { Slider } from "@/components/ui/slider";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

export const PLayerSeek = ({
  played,
  timeEnd,
  onSeek,
  onSeekUp,
  forward,
  rewind,
  activate,
}: {
  played: number;
  timeEnd: string;
  onSeek: (value: number[]) => void;
  onSeekUp: (value: number[]) => void;
  forward: () => void;
  rewind: () => void;
  activate: () => void;
}) => {
  const { ref, focused } = useFocusable({
    onArrowPress: (direction) => {
      activate();
      if (direction === "left") {
        rewind();
        return false;
      }
      if (direction === "right") {
        forward();
        return false;
      }
      return true;
    },
    onFocus: activate,
  });
  return (
    <div className="">
      <Slider
        ref={ref}
        className={`w-3/4 absolute left-1/2 -translate-x-1/2 z-50 bottom-[10vh] ${focused ? "outline outline-background" : ""}`}
        defaultValue={[played * 100]}
        value={[played * 100]}
        max={100}
        step={0.1}
        onValueCommit={onSeekUp}
        onValueChange={onSeek}
      />
      <span
        className={`bg-white text-black absolute left-[88%] px-2 py-1 translate-y-1/3 bottom-[10vh]  z-50`}
      >
        {timeEnd}
      </span>
    </div>
  );
};
