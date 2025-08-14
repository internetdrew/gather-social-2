import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";

const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const anonKey = import.meta.env.VITE_SUPABASE_KEY;

export const useUppyWithSupabase = ({ bucketName }: { bucketName: string }) => {
  // Initialize Uppy instance only once
  const [uppy] = useState(() => new Uppy());
  // Initialize Supabase client with project URL and anon key
  const supabase = createClient(`https://${projectId}.supabase.co`, anonKey);
  useEffect(() => {
    const initializeUppy = async () => {
      // Retrieve the current user's session for authentication
      const {
        data: { session },
      } = await supabase.auth.getSession();
      uppy
        .use(Tus, {
          // Supabase TUS endpoint (with direct storage hostname)
          endpoint: `https://${projectId}.storage.supabase.co/storage/v1/upload/resumable`,
          retryDelays: [0, 3000, 5000, 10000, 20000], // Retry delays for resumable uploads
          headers: {
            authorization: `Bearer ${session?.access_token}`, // User session access token
            apikey: anonKey, // API key for Supabase
          },
          uploadDataDuringCreation: true, // Send metadata with file chunks
          removeFingerprintOnSuccess: true, // Remove fingerprint after successful upload
          chunkSize: 6 * 1024 * 1024, // Chunk size for TUS uploads (6MB)
          allowedMetaFields: [
            "bucketName",
            "objectName",
            "contentType",
            "cacheControl",
            "metadata",
          ], // Metadata fields allowed for the upload
          onError: (error) => console.error("Upload error:", error), // Error handling for uploads
        })
        .on("file-added", (file) => {
          // Attach metadata to each file, including bucket name and content type
          file.meta = {
            ...file.meta,
            bucketName, // Bucket specified by the user of the hook
            objectName: file.name, // Use file name as object name
            contentType: file.type, // Set content type based on file MIME type
            metadata: JSON.stringify({
              // custom metadata passed to the user_metadata column
              yourCustomMetadata: true,
            }),
          };
        });
    };
    // Initialize Uppy with Supabase settings
    initializeUppy();
  }, [uppy, bucketName, supabase.auth]);
  // Return the configured Uppy instance
  return uppy;
};
