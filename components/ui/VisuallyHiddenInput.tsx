"use client";

import { styled } from "@mui/material/styles";

// now this runs only in the browser
export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  width: 1,
  position: "absolute",
});
