export const API_BASE_URL = "https://cfs-orbital-api-uat.globaldyne.com.br";
// export const API_BASE_URL = "https://cfs-orbital-api-homolog.globaldyne.com.br";
// export const API_BASE_URL = "http://10.0.2.2:1337";

// export const API_BASE_URL = process.env.API_BASE_URL;
export const APP_VERSION = process.env.APP_VERSION;

export const WEB_SOCKET_URL = API_BASE_URL.replace("http", "ws");

export const CHAT_USER_MENTION_REGEX = /@\[([^\]]*)\]\((\d+)\)/gm;
export const CHAT_FLIGHT_MENTION_REGEX = /#\[([^\]]*)\]\((\d+)\)/gm;

console.log("API_BASE_URL", API_BASE_URL);

export const imageMimeTypes = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  svg: "image/svg+xml",
  webp: "image/webp",
  bmp: "image/bmp",
  ico: "image/vnd.microsoft.icon",
  tiff: "image/tiff",
  tif: "image/tiff",
};
