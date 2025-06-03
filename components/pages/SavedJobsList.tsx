"use client";

import React, { useState } from "react";
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  InputBase,
  Card,
  CardContent,
  CardActions,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import {
  Home as HomeIcon,
  Work as WorkIcon,
  CardGiftcard as GiftIcon,
  ExpandLess,
  ExpandMore,
  ChevronRight,
  FilterList as FilterListIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";


const DRAWER_WIDTH = 240;

// Update the Job interface to match the structure from the jobs table
interface Job {
  id: string;
  title: string;
  company_name?: string;
  location?: string;
  description?: string;
  url?: string;
  source?: string;
  salary_min?: number;
  salary_max?: number;
  saved_at?: string; // From the saved_jobs table
}

interface Props {
  jobs: Job[];
}

export default function SavedJobsList({ jobs }: Props) {
  const [openOption, setOpenOption] = useState(true);
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const isDark = theme.palette.mode === "dark";

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company_name &&
        job.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.location &&
        job.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format salary to USD currency
  const formatSalary = (salary?: number) => {
    if (!salary) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const removeJob = async (jobId: string) => {
    try {
      // Create a Supabase client (browser-side)
      const supabase = createClient();

      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("User not authenticated");
        return;
      }

      // Delete the saved job record
      const { error } = await supabase
        .from("saved_jobs")
        .delete()
        .match({ user_id: user.id, job_id: jobId });

      if (error) {
        console.error("Error removing job:", error);
        throw error;
      }

      console.log(`Successfully removed job with ID: ${jobId}`);

      // Refresh the page to show updated list
      // You could also handle this with state management if preferred
      router.refresh();
    } catch (error) {
      console.error("Failed to remove job:", error);
      alert("Failed to remove job. Please try again.");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Side Drawer */}
      <Drawer
        variant="permanent"
        PaperProps={{
          className:
            "bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100",
        }}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {/* push content below your DefaultNavBar */}
        <Toolbar />
        <List>
          <ListItemButton component={Link} href="/protected">
            <ListItemIcon className="text-gray-700 dark:text-gray-100">
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon className="text-gray-700 dark:text-gray-100">
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary="Applied Jobs" />
          </ListItemButton>
          {/*<ListItemButton>
            <ListItemIcon className="text-gray-700 dark:text-gray-100">
              <GiftIcon />
            </ListItemIcon>
            <ListItemText primary="Gift Center" />
          </ListItemButton>*/}

          <ListItemButton onClick={() => setOpenOption(!openOption)}>
            <ListItemText primary="Recent Saved Jobs" />
            {openOption ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openOption} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {jobs.slice(0, 5).map((job) => (
                <ListItemButton
                  key={job.id}
                  sx={{ pl: 4 }}
                  onClick={() => job.url && window.open(job.url, "_blank")}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ChevronRight />
                  </ListItemIcon>
                  <ListItemText primary={job.title} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-lg"
        sx={{
          ml: `${DRAWER_WIDTH}px`,
          width: `calc(75vw)`,
          p: 3,
          minHeight: `calc(85vh)`,
          maxWidth: "none",
          // Remove the negative translateY that's causing content to shift up
          transform: "translateX(-10%)",
        }}
      >
        {/* offset for DefaultNavBar */}
        <Toolbar />

        {/* Header + Search */}
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Remove negative translateY values */}
          <Typography variant="h5">Saved Jobs</Typography>

          <Box className="flex items-center">
            <FilterListIcon className="text-gray-700 dark:text-gray-300" />
            <Typography className="ml-1 text-gray-700 dark:text-gray-300">
              Filter
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                ml: 2,
                px: 1,
                bgcolor: isDark
                  ? theme.palette.grey[800]
                  : theme.palette.background.paper,
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                flexGrow: 1,
                maxWidth: 500,
                // Remove negative transform
              }}
            >
              <SearchIcon color="action" />
              <InputBase
                fullWidth
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  ml: 1,
                  color: "text.primary",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Job Cards */}
        {filteredJobs.length === 0 ? (
          <Typography
            align="center"
            className="text-gray-700 dark:text-gray-400"
          >
            {searchTerm
              ? "No jobs match your search criteria."
              : "You have no saved jobs."}
          </Typography>
        ) : (
          filteredJobs.map((job) => (
            <Card
              key={job.id}
              sx={{
                mb: 2,
                bgcolor: isDark
                  ? theme.palette.grey[800]
                  : theme.palette.background.paper,
                color: "text.primary",
              }}
            >
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                {job.company_name && (
                  <Typography variant="body2" color="text.secondary">
                    {job.company_name}
                  </Typography>
                )}
                {job.location && (
                  <Typography variant="body2" color="text.secondary">
                    {job.location}
                  </Typography>
                )}
                {(job.salary_min || job.salary_max) && (
                  <Typography variant="body2" color="text.secondary">
                    {job.salary_min && job.salary_max
                      ? `${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)}`
                      : job.salary_min
                        ? `From ${formatSalary(job.salary_min)}`
                        : `Up to ${formatSalary(job.salary_max)}`}
                  </Typography>
                )}
                {job.description && (
                  <Typography variant="body2" className="mt-2 line-clamp-2">
                    {job.description.slice(0, 150)}
                    {job.description.length > 150 ? "..." : ""}
                  </Typography>
                )}
                {job.saved_at && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    className="mt-2 block"
                  >
                    Saved on {new Date(job.saved_at).toLocaleDateString()}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                {job.url && (
                  <Button
                    size="small"
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </Button>
                )}
                <Button
                  size="small"
                  color="error"
                  onClick={() => removeJob(job.id)}
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
}
