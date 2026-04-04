import { create } from 'zustand';

const boroughs = ['All boroughs', 'Brooklyn', 'Queens', 'Bronx'] as const;

type Borough = (typeof boroughs)[number];

export const initialWatchState: {
  highlightedBorough: Borough;
  activeWatchers: number;
  openReports: number;
} = {
  highlightedBorough: boroughs[0],
  activeWatchers: 24,
  openReports: 18,
};

type WatchState = typeof initialWatchState & {
  cycleBorough: () => void;
  addWatcher: () => void;
};

export const useWatchStore = create<WatchState>((set, get) => ({
  ...initialWatchState,
  cycleBorough: () => {
    const currentIndex = boroughs.indexOf(get().highlightedBorough);
    const nextIndex = (currentIndex + 1) % boroughs.length;

    set({ highlightedBorough: boroughs[nextIndex] });
  },
  addWatcher: () => {
    set((state) => ({ activeWatchers: state.activeWatchers + 1 }));
  },
}));
