import { useState, useLayoutEffect } from "react";

export function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref?.current) return;

    const updateWidth = () => {
      if (ref.current) {
        setWidth(ref.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);

  return width;
}
