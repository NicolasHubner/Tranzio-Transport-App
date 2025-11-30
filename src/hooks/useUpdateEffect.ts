import { useEffect, useRef } from "react";

export const useUpdateEffect: typeof useEffect = (effect, dependencies) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isFirstRender.current) {
      return effect();
    }

    isFirstRender.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};
