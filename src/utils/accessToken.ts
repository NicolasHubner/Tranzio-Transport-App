let accessToken: string | null = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: typeof accessToken) {
  accessToken = token;
}
