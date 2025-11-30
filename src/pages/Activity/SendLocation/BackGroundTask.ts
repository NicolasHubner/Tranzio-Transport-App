import * as Location from "expo-location";
import { LocationTaskOptions } from "expo-location";
import * as TaskManager from "expo-task-manager";

interface LocationSettings {
  accuracy: Location.Accuracy;
  timeInterval: number;
  foregroundService: {
    notificationTitle: string;
    notificationBody: string;
    notificationColor: string;
  };
  deferredUpdatesInterval: number;
}

class BackgroundTask {
  locationSettings: Location.LocationTaskOptions;
  LOCATION_TRACKING: string;

  constructor(locationSettings: LocationTaskOptions, locationTracking: string) {
    this.locationSettings = locationSettings;
    this.LOCATION_TRACKING = locationTracking;
  }

  async stopLocationTracking() {
    const tracking = await TaskManager.isTaskRegisteredAsync(
      this.LOCATION_TRACKING,
    );
    if (tracking) {
      Location.stopLocationUpdatesAsync(this.LOCATION_TRACKING);
    }

    console.log("BackGround Stop", this.LOCATION_TRACKING);
  }

  async startLocationTracking() {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      this.LOCATION_TRACKING,
    );
    console.log("tracking started?", hasStarted, this.LOCATION_TRACKING);

    if (!hasStarted) {
      return await Location.startLocationUpdatesAsync(this.LOCATION_TRACKING, {
        ...this.locationSettings,
      });
    }

    return true;
  }
}

class LocationSettings {
  private baseSettings: LocationTaskOptions = {
    accuracy: Location.Accuracy.BestForNavigation,
    foregroundService: {
      notificationTitle: "CfsApp",
      notificationBody: "consultando sua localização",
      notificationColor: "#ff0000",
    },
    deferredUpdatesInterval: 1000 * 30,
    deferredUpdatesTimeout: 1000 * 60 * 10,
  };

  regularLocationSettings: LocationTaskOptions = {
    ...this.baseSettings,
    timeInterval: 1000 * 60,
  };

  shiftLocationSettings: LocationTaskOptions = {
    ...this.baseSettings,
    timeInterval: 1000 * 30 * 5,
    foregroundService: {
      notificationTitle: "Turno de Trabalho",
      notificationBody: "consultando sua localização",
      notificationColor: "#ff0000",
    },
  };
}

const locationSettings = new LocationSettings();

export const LOCATION_TRACKING_PNAE_TASK = "location-tracking";

export const LOCATION_TRACKING_SHIFT_TASK = "location-tracking-shift";

export const pnaeTask = new BackgroundTask(
  locationSettings.regularLocationSettings,
  LOCATION_TRACKING_PNAE_TASK,
);

export const shiftTask = new BackgroundTask(
  locationSettings.shiftLocationSettings,
  LOCATION_TRACKING_SHIFT_TASK,
);
