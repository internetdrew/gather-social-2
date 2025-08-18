import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { MAX_FILE_COUNT, ACCEPTED_TYPES } from "@/constants";
import { processImageFiles } from "@/utils/image/processImageFiles";
import { fileSizeValidator } from "@/utils/image/fileSizeValidator";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { Progress } from "./ui/progress";
import { toast } from "sonner";

function combinedValidator(file: File) {
  const sizeError = fileSizeValidator(file);
  if (sizeError) return sizeError;

  return null;
}

const formSchema = z.object({
  files: z
    .array(
      z.instanceof(File).refine((file) => ACCEPTED_TYPES.includes(file.type), {
        message: "Only image files are allowed.",
      }),
    )
    .max(MAX_FILE_COUNT, `You can upload up to ${MAX_FILE_COUNT} files.`),
});

const ImageUploader = ({ eventId }: { eventId: string }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progresses, setProgresses] = useState<number[]>([]);
  const [files, setFiles] = useState<Array<File & { preview: string }>>([]);
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: ACCEPTED_TYPES.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: MAX_FILE_COUNT,
    onDrop: async (acceptedFiles) => {
      const convertedFiles = await processImageFiles(acceptedFiles);
      const filesWithPreview = convertedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );
      setFiles(
        acceptedFiles.map((file) => ({
          ...file,
          preview: URL.createObjectURL(file),
        })),
      );
      form.setValue("files", filesWithPreview, { shouldValidate: true });
    },
    validator: combinedValidator,
  });

  function uploadWithProgress(url: string, file: File, index: number) {
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });

  const getSignedUrlsMutation = useMutation(
    trpc.upload.getSignedUploadUrls.mutationOptions(),
  );
  const addImagesMutation = useMutation(trpc.event.addImages.mutationOptions());

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsUploading(true);
    try {
      const { signedUrls } = await getSignedUrlsMutation.mutateAsync({
        eventId,
        files: values.files.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })),
      });

      await Promise.all(
        signedUrls.map(({ signedUrl }, i) =>
          uploadWithProgress(signedUrl, values.files[i], i),
        ),
      );

      await addImagesMutation.mutateAsync({
        eventId,
        images: signedUrls.map((s) => ({
          filepath: s.path,
        })),
      });

      form.reset();
      setFiles([]);
      setProgresses([]);
      setIsUploading(false);
      toast.success(
        files.length === 1
          ? "Your photo was uploaded successfully!"
          : `Your ${files.length} photos were uploaded successfully!`,
        {
          duration: 10000,
          description:
            "Your photos have been uploaded and the host will see them. If they make a public gallery, your photos might be displayed there.",
        },
      );
    } catch (err) {
      console.error("Upload failed", err);
      setIsUploading(false);
      toast.error(
        "There was an error uploading your photos. Please try again later.",
      );
    }
  };

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="files"
          render={() => (
            <FormItem>
              <FormLabel>Photos</FormLabel>
              <p className="text-muted-foreground mb-2 text-xs">
                You can add up to {MAX_FILE_COUNT} photos at a time.
              </p>
              <FormControl>
                <div
                  {...getRootProps({ className: "dropzone" })}
                  className="hover:bg-muted cursor-pointer rounded-sm border-2 border-dashed p-10 text-center transition"
                >
                  <input {...getInputProps()} />
                  <p className="text-muted-foreground text-center text-sm">
                    <span className="text-pink-600">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-muted-foreground mt-2 text-center text-xs">
                    Max. file size 25MB
                  </p>
                </div>
              </FormControl>
              <FormMessage />
              {fileRejections.length > MAX_FILE_COUNT && (
                <FormMessage>
                  You can only upload up to {MAX_FILE_COUNT} files at a time.
                </FormMessage>
              )}
              <aside className="grid grid-cols-3 gap-2">
                {files.map((file, index) => (
                  <div key={`${file.name}-${index}`}>
                    <img
                      className="block h-full w-auto object-cover"
                      src={file.preview}
                      onLoad={() => {
                        URL.revokeObjectURL(file.preview);
                      }}
                    />
                    {progresses[index] !== undefined && (
                      <Progress
                        value={progresses[index]}
                        className="mt-2 h-2"
                      />
                    )}
                  </div>
                ))}
              </aside>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={
            files.length === 0 || fileRejections.length > 0 || isUploading
          }
          className="w-full bg-pink-600 hover:bg-pink-700"
        >
          {isUploading ? "Uploading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default ImageUploader;
