import axios from "axios";

const NEXT_PUBLIC_REST_API_BASE_URL = "https://api-ceop-dev.globalnav.com.br";
const REST_API_ALLOWED_TOKEN = "80c2fc14df5f1fbdc369fbf5655f21ad652dee2d9ff4990d960029b06775bc2d74303181a00865a8988a031ab9693e7f83e0d45a03f62e32116096d3f4de6eb3d4f992b789146865af042294e3afca0453e6561551116620cd480429c65b1c264333060755cb2e48bcaf17b54f9d79a849077d5cbc7e44b0f69d04dda8acc972";
const OTK__BASE_URL = "https://api.otkweb.com.br/v2";

export const restApi = axios.create({
  baseURL: NEXT_PUBLIC_REST_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${REST_API_ALLOWED_TOKEN}`
  },
});

export const otkApi = axios.create({
  baseURL: OTK__BASE_URL,
});
