import { createFetcher } from "./fetcher";

export const authApi = createFetcher({
  baseUrl: "https://api.onmeet.cloud/auth",
});

export const roomApi = createFetcher({
  baseUrl: "https://api.onmeet.cloud/api",
  unwrapEnvelope: true,
});

export const notiApi = createFetcher({
  baseUrl: "https://api.onmeet.cloud/notification",
});
