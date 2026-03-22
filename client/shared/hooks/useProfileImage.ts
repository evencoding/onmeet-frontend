import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/shared/utils/apiFetch";

const FILE_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || ""}/file/v1`;

interface FileMetadata {
  id: number;
  s3Url: string;
  contentType: string;
}

async function getFileInfo(fileId: number): Promise<FileMetadata> {
  return apiFetch<FileMetadata>(`${FILE_BASE_URL}/${fileId}`);
}

export function useProfileImage(profileImageId?: number | null) {
  return useQuery({
    queryKey: ["profileImage", profileImageId],
    queryFn: () => getFileInfo(profileImageId!),
    enabled: !!profileImageId,
    staleTime: 5 * 60 * 1000,
    select: (data) => data.s3Url,
  });
}
