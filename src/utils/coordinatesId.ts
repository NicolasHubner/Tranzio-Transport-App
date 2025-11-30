let coordinatesId: string | undefined;

export function getCoordinatesId() {
  return coordinatesId;
}

export function setCoordinatesId(id: typeof coordinatesId) {
  coordinatesId = id;
}
