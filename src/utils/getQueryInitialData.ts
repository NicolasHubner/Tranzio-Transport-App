import { storage } from "~/lib/mmkv";

export function getQueryInitialData<T>(key: string) {
  const existingAttendanceLivesData = storage.getString(key);

  return existingAttendanceLivesData
    ? (JSON.parse(existingAttendanceLivesData) as T)
    : undefined;
}
