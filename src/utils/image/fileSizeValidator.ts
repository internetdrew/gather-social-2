import { MAX_FILE_SIZE } from "@/constants";

export function fileSizeValidator(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    return {
      code: "file-too-large",
      message: `File is larger than 25MB`,
    };
  }
  return null;
}
