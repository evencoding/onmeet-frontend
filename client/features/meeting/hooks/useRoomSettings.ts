import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomKeys } from "../query-keys";
import { getRoomSettings, updateRoomSettings } from "../api/room-settings";
import type { RoomSettingsUpdateRequest } from "../api/types";

export function useRoomSettings(roomId: number, userId: string) {
  return useQuery({
    queryKey: roomKeys.settings(roomId),
    queryFn: () => getRoomSettings(roomId, userId),
    enabled: !!roomId && !!userId,
    staleTime: 30_000,
  });
}

export function useUpdateRoomSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      roomId: number;
      userId: string;
      data: RoomSettingsUpdateRequest;
    }) => updateRoomSettings(args.roomId, args.userId, args.data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.settings(vars.roomId) });
      qc.invalidateQueries({ queryKey: roomKeys.detail(vars.roomId) });
    },
  });
}
