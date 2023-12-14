import { create } from 'zustand';
import { combine } from 'zustand/middleware';

export const useScrollStore = create(
  combine({ top: 0, isStickTop: true, isStickBottom: false }, set => ({
    setTop: (by: number) => set(() => ({ top: by })),
    updateIsStickTop: () => set(state => ({ isStickTop: state.top <= 110 })),
    updateIsStickBottom: (by: boolean) => set(() => ({ isStickBottom: by })),
  })),
);
