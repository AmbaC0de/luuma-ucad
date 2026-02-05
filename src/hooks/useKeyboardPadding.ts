import { useKeyboardHandler } from "react-native-keyboard-controller";
import { useSharedValue, useAnimatedStyle } from "react-native-reanimated";

type UseKeyboardPaddingOptions = {
  offset?: number;
};

export const useKeyboardPadding = (options?: UseKeyboardPaddingOptions) => {
  const offset = options?.offset ?? 0;
  const height = useSharedValue(offset);

  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";
        height.value =
          e.height > 0 ? Math.max(e.height + offset, offset) : offset;
      },
    },
    [offset],
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  }, []);

  return { height, animatedStyle };
};
