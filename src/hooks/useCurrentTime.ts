import { useSyncExternalStore } from "react";

interface UseCurrentTimeData {
  now: Date;
}

let store: UseCurrentTimeData = {
  now: new Date(),
};

const notifiers = new Set<() => void>();

setInterval(() => {
  store = {
    now: new Date(),
  };

  notifiers.forEach(notify => notify());
}, 1000);

function subscribe(notify: () => void) {
  notifiers.add(notify);
  return () => notifiers.delete(notify);
}

function getStoreSnapshot() {
  return store;
}

export function useCurrentTime(): UseCurrentTimeData {
  return useSyncExternalStore(subscribe, getStoreSnapshot, getStoreSnapshot);
}
