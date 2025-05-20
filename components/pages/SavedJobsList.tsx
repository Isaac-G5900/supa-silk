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

const DRAWER_WIDTH = 240;

interface Job {
  id: string;
  title: string;
  company?: string;
}

interface Props {
  jobs: Job[];
}

export default function SavedJobsList({ jobs }: Props) {
  const [openOption, setOpenOption] = useState(true);
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

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
          <ListItemButton>
            <ListItemIcon className="text-gray-700 dark:text-gray-100">
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon className="text-gray-700 dark:text-gray-100">
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary="My Jobs" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon className="text-gray-700 dark:text-gray-100">
              <GiftIcon />
            </ListItemIcon>
            <ListItemText primary="Gift Center" />
          </ListItemButton>

          <ListItemButton onClick={() => setOpenOption(!openOption)}>
            <ListItemText primary="Option" />
            {openOption ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openOption} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {jobs.slice(0, 5).map((job) => (
                <ListItemButton key={job.id} sx={{ pl: 4 }}>
                  <ListItemIcon
                    sx={{ minWidth: 32 }}
                    // className="text-gray-700 dark:text-gray-100"
                  >
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
          transform: "translateX(-10%) translateY(-8%)",
          p: 3,
          minHeight: `calc(85vh)`,
          maxWidth: "none",
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
          <Typography variant="h5" sx={{ transform: "translateY(-150%)" }}>
            Saved Jobs
          </Typography>

          <Box className="flex items-center">
            <FilterListIcon
              className="text-gray-700 dark:text-gray-300"
              sx={{ transform: "translateY(-150%)" }}
            />
            <Typography
              className="ml-1 text-gray-700 dark:text-gray-300"
              sx={{ transform: "translateY(-150%)" }}
            >
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
                  : theme.palette.background.paper, // white in light, dark grey in dark
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                flexGrow: 1,
                maxWidth: 500,
                transform: "translateY(-110%)",
              }}
            >
              <SearchIcon color="action" />
              <InputBase
                fullWidth
                placeholder="Search"
                sx={{
                  ml: 1,
                  color: "text.primary",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Job Cards */}
        {jobs.length === 0 ? (
          <Typography
            align="center"
            className="text-gray-700 dark:text-gray-400"
          >
            You have no saved jobs.
          </Typography>
        ) : (
          jobs.map((job) => (
            <Card
              key={job.id}
              sx={{
                mb: 2,
                bgcolor: isDark
                  ? theme.palette.grey[800]
                  : theme.palette.background.paper, // white in light, dark grey in dark
                color: "text.primary",
              }}
            >
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                {job.company && (
                  <Typography variant="body2" color="text.secondary">
                    {job.company}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button size="small">View</Button>
                <Button size="small" color="error">
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
