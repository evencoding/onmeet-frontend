import { createServiceFetch } from "@/shared/utils/apiFetch";

const ROOM_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || ""}/video/v1`;

export const roomFetch = createServiceFetch(ROOM_BASE_URL);

export * from "./api/types";
export * from "./api/room";
export * from "./api/room-schedule";
export * from "./api/room-discovery";
export * from "./api/room-settings";
export * from "./api/participant";
export * from "./api/waiting-room";
export * from "./api/recording";
export * from "./api/invitation";
export * from "./api/screen-share";
export * from "./api/chat";
