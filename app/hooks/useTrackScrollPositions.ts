import { RefObject, useEffect } from 'react';
import { useScrollStore } from '../stores/scroll';

export const useTrackScrollPositions = (containerRef: RefObject<HTMLElement>) => {
  const { setTop, updateIsStickTop, updateIsStickBottom } = useScrollStore();

  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    const setScrollPositions = () => {
      const { scrollTop, scrollHeight, offsetHeight, clientTop } = scrollContainer;
      setTop(scrollTop);
      updateIsStickTop();
      updateIsStickBottom(scrollHeight - scrollTop - offsetHeight + clientTop === 0);
    };

    scrollContainer.addEventListener('scroll', setScrollPositions);

    return () => scrollContainer.removeEventListener('scroll', setScrollPositions);
  }, [containerRef.current]);
};
