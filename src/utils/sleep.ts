export function sleep(delayInMilliseconds: number) {
  return new Promise<void>(resolve => setTimeout(resolve, delayInMilliseconds));
}
