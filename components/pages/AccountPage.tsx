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

function AccountPage() {
  return (
    /*<div className="flex h-full w-full items-start mobile:flex-col mobile:flex-nowrap mobile:gap-0">
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
            <span className="text-2xl font-bold text-gray-900">Profile</span>
            <div className="flex w-full flex-col items-start gap-4">
              <span className="text-base font-semibold text-gray-900">
                Resume
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
                    Upload file
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(event) => console.log(event.target.files)}
                      multiple
                    />
                  </Button>
                  <span className="text-caption font-caption text-subtext-color">
                    *Specifications for resume file here.*
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center gap-4">
              <TextField
                id="outlined-helperText"
                label="First Name"
                defaultValue=""
                helperText=""
              />
              <TextField
                id="outlined-helperText"
                label="Last Name"
                defaultValue=""
                helperText=""
              />
            </div>
            <div className="flex w-full items-center gap-4">
              <TextField
                id="outlined-helperText"
                label="Email"
                defaultValue=""
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
              fullWidth
              id="fullWidth"
              label="Current Password"
              defaultValue=""
              helperText=""
            />
            <TextField
              fullWidth
              id="fullWidth"
              label="New Password"
              defaultValue=""
              helperText="Password must contain at least 8 characters, including one uppercase letter and one number"
            />
            <TextField
              fullWidth
              id="fullWidth"
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
    </div>*/
    <div className="flex h-full w-full items-start mobile:flex-col mobile:flex-nowrap mobile:gap-0">
      <div className="container max-w-none flex grow shrink-0 basis-0 flex-col items-center gap-6 self-stretch bg-default-background py-12 shadow-sm">
        <div className="flex w-full max-w-[576px] flex-col items-start gap-12">
          {/* Header */}
          <div className="flex w-full flex-col items-start gap-1">
            <span className="w-full text-3xl font-bold text-gray-900 dark:text-gray-100">
              Account
            </span>
            <span className="w-full text-base font-normal text-gray-500 dark:text-gray-400">
              Update your profile and personal details here
            </span>
          </div>

          {/* Profile Section */}
          <div className="flex w-full flex-col items-start gap-6">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Profile
            </span>
            <div className="flex w-full flex-col items-start gap-4">
              <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Resume
              </span>
              <div className="flex items-center gap-4">
                <img
                  className="h-16 w-16 flex-none object-cover [clip-path:circle()]"
                  src="https://img.freepik.com/premium-vector/resumes-cv-application-resume-filling-concept_349999-259.jpg?w=2000"
                />
                <div className="flex flex-col items-start gap-2">
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload file
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(event) => console.log(event.target.files)}
                      multiple
                    />
                  </Button>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    *Specifications for resume file here.*
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center gap-4">
              <TextField
                className="bg-white dark:bg-gray-800 rounded-md"
                InputLabelProps={{
                  className: "text-gray-700 dark:text-gray-300",
                }}
                slotProps={{
                  input: { className: "text-gray-900 dark:text-gray-100" },
                  formHelperText: {
                    className: "text-gray-500 dark:text-gray-400",
                  },
                }}
                id="outlined-helperText"
                label="First Name"
                defaultValue=""
                helperText=""
              />
              <TextField
                className="bg-white dark:bg-gray-800 rounded-md"
                InputLabelProps={{
                  className: "text-gray-700 dark:text-gray-300",
                }}
                slotProps={{
                  input: { className: "text-gray-900 dark:text-gray-100" },
                  formHelperText: {
                    className: "text-gray-500 dark:text-gray-400",
                  },
                }}
                id="outlined-helperText"
                label="Last Name"
                defaultValue=""
                helperText=""
              />
            </div>
            <div className="flex w-full items-center gap-4">
              <TextField
                className="bg-white dark:bg-gray-800 rounded-md"
                InputLabelProps={{
                  className: "text-gray-700 dark:text-gray-300",
                }}
                slotProps={{
                  input: { className: "text-gray-900 dark:text-gray-100" },
                  formHelperText: {
                    className: "text-gray-500 dark:text-gray-400",
                  },
                }}
                id="outlined-helperText"
                label="Email"
                defaultValue=""
                helperText=""
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />

          {/* Password Section */}
          <div className="flex w-full flex-col items-start gap-6">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Password
            </span>
            <TextField
              className="bg-white dark:bg-gray-800 rounded-md"
              InputLabelProps={{
                className: "text-gray-700 dark:text-gray-300",
              }}
              slotProps={{
                input: { className: "text-gray-900 dark:text-gray-100" },
                formHelperText: {
                  className: "text-gray-500 dark:text-gray-400",
                },
              }}
              fullWidth
              id="fullWidth"
              label="Current Password"
              type="password"
              defaultValue=""
              helperText=""
            />
            <TextField
              className="bg-white dark:bg-gray-800 rounded-md"
              InputLabelProps={{
                className: "text-gray-700 dark:text-gray-300",
              }}
              slotProps={{
                input: { className: "text-gray-900 dark:text-gray-100" },
                formHelperText: {
                  className: "text-gray-500 dark:text-gray-400",
                },
              }}
              fullWidth
              id="fullWidth"
              label="New Password"
              type="password"
              defaultValue=""
              helperText="Password must contain at least 8 characters, including one uppercase letter and one number"
            />
            <TextField
              className="bg-white dark:bg-gray-800 rounded-md"
              InputLabelProps={{
                className: "text-gray-700 dark:text-gray-300",
              }}
              slotProps={{
                input: { className: "text-gray-900 dark:text-gray-100" },
                formHelperText: {
                  className: "text-gray-500 dark:text-gray-400",
                },
              }}
              fullWidth
              id="fullWidth"
              label="Confirm New Password"
              type="password"
              defaultValue=""
              helperText=""
            />
            <div className="flex w-full flex-col items-start justify-center gap-6">
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
              >
                Change password
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
