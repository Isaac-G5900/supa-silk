// "use client";

import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ResumeUploader from "@/components/buttons/ResumeUpload";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
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
              <ResumeUploader />
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
                  input: {
                    readOnly: true,
                    className: "text-gray-900 dark:text-gray-100",
                  },
                  formHelperText: {
                    className: "text-gray-500 dark:text-gray-400",
                  },
                }}
                id="outlined-helperText"
                label="Email"
                defaultValue={user.email}
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
