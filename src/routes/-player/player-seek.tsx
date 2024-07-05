import { Slider } from "@/components/ui/slider";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

export const PLayerSeek = ({
  played,
  onSeek,
  onSeekUp,
  forward,
  rewind,
}: {
  played: number;
  onSeek: (value: number[]) => void;
  onSeekUp: (value: number[]) => void;
  forward: () => void;
  rewind: () => void;
}) => {
  const { ref, focused } = useFocusable({
    onArrowPress: (direction) => {
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
    </div>
  );
};
