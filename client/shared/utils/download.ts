/* eslint-disable @typescript-eslint/no-explicit-any */

// File System Access API 타입 선언 (아직 lib.dom.d.ts에 미포함)
declare global {
  interface Window {
    showSaveFilePicker?: (options?: any) => Promise<any>;
  }
}

/**
 * File Download Utilities — File System Access API + 전통적 fallback.
 *
 * 대용량 녹음 파일(수백 MB)을 다운로드할 때,
 * 브라우저 메모리에 전체 파일을 올리면 탭이 크래시될 수 있다.
 *
 * File System Access API를 지원하는 브라우저에서는
 * 메모리를 거치지 않고 디스크에 직접 스트림을 쓴다.
 * 미지원 브라우저에서는 Blob + a태그 방식으로 fallback.
 */

/** File System Access API 지원 여부 */
export function supportsFileSystemAccess(): boolean {
  return "showSaveFilePicker" in window;
}

/**
 * 대용량 파일을 스트림으로 다운로드한다.
 * File System Access API가 지원되면 디스크에 직접 쓰고,
 * 아니면 Blob으로 fallback한다.
 *
 * @param url - 다운로드할 파일의 URL
 * @param fileName - 저장할 파일 이름
 * @param onProgress - 진행률 콜백 (0~1)
 */
export async function downloadFileStream(
  url: string,
  fileName: string,
  onProgress?: (progress: number) => void,
): Promise<void> {
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);

  const contentLength = Number(response.headers.get("Content-Length")) || 0;

  if (supportsFileSystemAccess()) {
    await downloadWithFileSystemAccess(response, fileName, contentLength, onProgress);
  } else {
    await downloadWithBlob(response, fileName, contentLength, onProgress);
  }
}

/**
 * File System Access API로 디스크에 직접 스트림을 쓴다.
 * 메모리 사용량이 거의 없다.
 */
async function downloadWithFileSystemAccess(
  response: Response,
  fileName: string,
  contentLength: number,
  onProgress?: (progress: number) => void,
): Promise<void> {
  const ext = fileName.split(".").pop() ?? "";
  const mimeTypes: Record<string, string> = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    webm: "audio/webm",
    mp4: "video/mp4",
    txt: "text/plain",
    pdf: "application/pdf",
  };

  const fileHandle = await window.showSaveFilePicker!({
    suggestedName: fileName,
    types: [
      {
        description: "파일",
        accept: { [mimeTypes[ext] ?? "application/octet-stream"]: [`.${ext}`] },
      },
    ],
  });

  const writable = await fileHandle.createWritable();
  const reader = response.body!.getReader();
  let received = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      await writable.write(value);
      received += value.byteLength;

      if (onProgress && contentLength > 0) {
        onProgress(received / contentLength);
      }
    }
  } finally {
    await writable.close();
  }

  onProgress?.(1);
}

/**
 * 전통적인 Blob + a태그 방식 fallback.
 * 파일 전체를 메모리에 올린 뒤 다운로드.
 */
async function downloadWithBlob(
  response: Response,
  fileName: string,
  contentLength: number,
  onProgress?: (progress: number) => void,
): Promise<void> {
  const reader = response.body!.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
    received += value.byteLength;

    if (onProgress && contentLength > 0) {
      onProgress(received / contentLength);
    }
  }

  const blob = new Blob(chunks as BlobPart[]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);

  onProgress?.(1);
}

/**
 * 텍스트 데이터를 파일로 다운로드한다. (회의록, 트랜스크립트 등)
 * 소형 파일이므로 항상 Blob 방식 사용.
 */
export function downloadTextFile(content: string, fileName: string, mimeType = "text/plain"): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
