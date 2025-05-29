"use client";

import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { VisuallyHiddenInput } from "../ui/VisuallyHiddenInput";
import { createClient } from "@/utils/supabase/client";

export default function ResumeUploader() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    }
    fetchUser();
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFileName(file.name);

    // Reset states
    setError(null);
    setSuccess(false);
    setUploading(true);

    try {
      // Validate file type
      const acceptedTypes = ["application/pdf"];
      if (!acceptedTypes.includes(file.type)) {
        throw new Error("Please upload a PDF");
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size exceeds 5MB limit");
      }

      // Generate a unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: existingResumes } = await supabase
        .from("user_resumes")
        .select("file_path")
        .eq("user_id", userId)
        .single();

      if (existingResumes?.file_path) {
        await supabase.storage
          .from("resumes")
          .remove([existingResumes.file_path]);
      }

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL of the file (optional)
      const { data: publicUrlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;

      // Store file metadata in database
      const { error: dbError } = await supabase.from("user_resumes").upsert(
        {
          user_id: userId,
          file_path: filePath,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          public_url: publicUrl,
          uploaded_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );

      if (dbError) throw dbError;

      // Success!
      setSuccess(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error instanceof Error ? error.message : "Error uploading file");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar
        src="https://res.cloudinary.com/subframe/image/upload/v1711417513/shared/kwut7rhuyivweg8tmyzl.jpg"
        sx={{ width: 64, height: 64 }}
      />
      <div className="flex flex-col items-start gap-2 w-full">
        <Button
          component="label"
          variant="contained"
          startIcon={
            uploading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <CloudUploadIcon />
            )
          }
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Resume"}
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
          />
        </Button>

        {fileName && !error && !uploading && (
          <Typography variant="body2">
            {success ? "✓ " : ""}
            {fileName}
          </Typography>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 1, width: "100%" }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 1, width: "100%" }}>
            Resume uploaded successfully!
          </Alert>
        )}

        <Typography variant="caption" color="text.secondary">
          *Accepted formats: PDF (Max size: 5MB)*
        </Typography>
      </div>
    </div>
  );
}
