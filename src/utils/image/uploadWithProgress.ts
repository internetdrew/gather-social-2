interface UploadProgressProps {
  url: string;
  file: File;
  index: number;
  setProgresses: React.Dispatch<React.SetStateAction<number[]>>;
}

export function uploadWithProgress({
  url,
  file,
  index,
  setProgresses,
}: UploadProgressProps) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgresses((prev) => {
          const copy = [...prev];
          copy[index] = percent;
          return copy;
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Upload error"));

    xhr.send(file);
  });
}
