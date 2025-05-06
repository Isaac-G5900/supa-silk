"use client";

import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TextField from "@mui/material/TextField";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function AccountSettings() {
  return (
    <div className="flex h-full w-full items-start mobile:flex-col mobile:flex-nowrap mobile:gap-0">
      <div className="container max-w-none flex grow shrink-0 basis-0 flex-col items-center gap-6 self-stretch bg-default-background py-12 shadow-sm">
        <div className="flex w-full max-w-[576px] flex-col items-start gap-12">
          <div className="flex w-full flex-col items-start gap-1">
            <span className="w-full text-heading-2 font-heading-2 text-default-font">
              Account
            </span>
            <span className="w-full text-body font-body text-subtext-color">
              Update your profile and personal details here
            </span>
          </div>
          <div className="flex w-full flex-col items-start gap-6">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Profile
            </span>
            <div className="flex w-full flex-col items-start gap-4">
              <span className="text-body-bold font-body-bold text-default-font">
                Avatar
              </span>
              <div className="flex items-center gap-4">
                <img
                  className="h-16 w-16 flex-none object-cover [clip-path:circle()]"
                  src="https://res.cloudinary.com/subframe/image/upload/v1711417513/shared/kwut7rhuyivweg8tmyzl.jpg"
                />
                <div className="flex flex-col items-start gap-2">
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload files
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(event) => console.log(event.target.files)}
                      multiple
                    />
                  </Button>
                  <span className="text-caption font-caption text-subtext-color">
                    For best results, upload an image 512x512 or larger.
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center gap-4">
              <TextField
                id="outlined-helperText"
                label="First Name"
                defaultValue="Sammy"
                helperText=""
              />
              <TextField
                id="outlined-helperText"
                label="Last Name"
                defaultValue="Slug"
                helperText=""
              />
            </div>
            <div className="flex w-full items-center gap-4">
              <TextField
                id="outlined-helperText"
                label="Email"
                defaultValue="sslug@ucsc.edu"
                helperText=""
              />
            </div>
          </div>
          <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
          <div className="flex w-full flex-col items-start gap-6">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Password
            </span>
            <TextField
              id="outlined-helperText"
              label="Current Password"
              defaultValue=""
              helperText=""
            />
            <TextField
              id="outlined-helperText"
              label="New Password"
              defaultValue=""
              helperText="Password must contain at least 8 characters, including one uppercase letter and one number"
            />
            <TextField
              id="outlined-helperText"
              label="Confirm New Password"
              defaultValue=""
              helperText=""
            />
            <div className="flex w-full flex-col items-start justify-center gap-6">
              <Button
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              >
                Change password
              </Button>
            </div>
          </div>
          <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
