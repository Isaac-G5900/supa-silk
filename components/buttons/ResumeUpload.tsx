"use client";

import React from "react";
import { Avatar, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { VisuallyHiddenInput } from "../ui/VisuallyHiddenInput";

export default function ResumeUploader() {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.files);
    // …your upload logic…
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar
        src="https://res.cloudinary.com/subframe/image/upload/v1711417513/shared/kwut7rhuyivweg8tmyzl.jpg"
        sx={{ width: 64, height: 64 }}
      />
      <div className="flex flex-col items-start gap-2">
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          {/* this onChange is OK now because it's in a client component */}
          <VisuallyHiddenInput
            type="file"
            multiple
            onChange={handleFileChange}
          />
        </Button>
        <Typography variant="caption" color="text.secondary">
          *Specifications for resume file here.*
        </Typography>
      </div>
    </div>
  );
}
