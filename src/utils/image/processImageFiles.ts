import heic2any from "heic2any";

export const processImageFiles = async (incoming: File[]) => {
  const processed: File[] = [];

  for (const file of incoming) {
    if (file.type === "image/heic" || file.type === "image/heif") {
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.9,
        });
        const convertedFile = new File(
          [convertedBlob as Blob],
          file.name.replace(/\.(heic|heif)$/i, ".jpg"),
          { type: "image/jpeg" },
        );
        processed.push(convertedFile);
      } catch (err) {
        console.error("HEIC conversion failed:", err);
      }
    } else {
      processed.push(file);
    }
  }

  return processed;
};
