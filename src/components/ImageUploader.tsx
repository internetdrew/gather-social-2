import { useUppyWithSupabase } from "@/hooks/useUppyWithSupabase";
import { useEffect } from "react";
import Dashboard from "@uppy/dashboard";

const ImageUploader = () => {
  // Initialize Uppy instance with the 'sample' bucket specified for uploads
  const uppy = useUppyWithSupabase({ bucketName: "event-images" });

  useEffect(() => {
    // Set up Uppy Dashboard to display as an inline component within a specified target
    uppy.use(Dashboard, {
      inline: true, // Ensures the dashboard is rendered inline
      target: "#drag-drop-area", // HTML element where the dashboard renders
      showProgressDetails: true, // Show progress details for file uploads
    });
  }, [uppy]);

  return (
    <div id="drag-drop-area">{/* Target element for the Uppy Dashboard */}</div>
  );
};

export default ImageUploader;
