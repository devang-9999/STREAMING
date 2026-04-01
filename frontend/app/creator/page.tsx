/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Paper,
  TextField,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Stack,
  Chip,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "@/redux/auth/authSlice";
import { useRouter } from "next/navigation";

import {
  createStream,
  fetchMyStreams,
  updateStreamStatus,
} from "../../redux/streams/streamSlice";

export default function CreatorDashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const streams = useAppSelector((state) => state.streams.streams);
  const userId = useAppSelector((state) => state.auth.currentUser?.id);

  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const [notifications, setNotifications] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    dispatch(fetchMyStreams());

    const socket = getSocket();
    socket.connect();

    if (userId) {
      socket.emit("join", userId); 
    }

    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    socket.on("streamCreated", () => {
      dispatch(fetchMyStreams());
    });

    socket.on("streamUpdated", () => {
      dispatch(fetchMyStreams());
    });

    return () => {
      socket.off("notification");
      socket.off("streamCreated");
      socket.off("streamUpdated");
    };
  }, [dispatch, userId]);

  const handleCreateStream = () => {
    if (!title || !scheduledAt) return;

    dispatch(createStream({ title, scheduledAt }));

    setTitle("");
    setScheduledAt("");
  };

  const handleStatusChange = (id: number, status: any) => {
    dispatch(updateStreamStatus({ id, status }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <Box sx={{ background: "#f4f5f7", minHeight: "100vh" }}>
      
      <AppBar position="static" sx={{ background: "black" }}>
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }} variant="h6">
            Creator Dashboard 🎥
          </Typography>

          <IconButton
            color="inherit"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Button color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {notifications.length === 0 && (
          <MenuItem>No Notifications</MenuItem>
        )}

        {notifications.map((n, i) => (
          <MenuItem key={i}>{n.message}</MenuItem>
        ))}
      </Menu>

      <Container sx={{ mt: 4 }}>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Create Stream
          </Typography>

          <TextField
            label="Stream Title"
            fullWidth
            sx={{ mb: 2 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            type="datetime-local"
            fullWidth
            sx={{ mb: 2 }}
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />

          <Button variant="contained" onClick={handleCreateStream}>
            Create
          </Button>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            My Streams
          </Typography>

          {streams?.map((stream) => (
            <Box
              key={stream.id}
              sx={{
                p: 2,
                mb: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
              }}
            >
              <Typography fontWeight={600}>
                {stream.title}
              </Typography>

              <Typography variant="body2">
                {new Date(stream.scheduledAt).toLocaleString()}
              </Typography>

              <Chip
                label={stream.status}
                color={
                  stream.status === "LIVE"
                    ? "error"
                    : stream.status === "SCHEDULED"
                    ? "warning"
                    : "success"
                }
                sx={{ mt: 1 }}
              />

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                {stream.status === "SCHEDULED" && (
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() =>
                      handleStatusChange(stream.id, "LIVE")
                    }
                  >
                    Go LIVE
                  </Button>
                )}

                {stream.status !== "CANCELLED" && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="warning"
                    onClick={() =>
                      handleStatusChange(stream.id, "CANCELLED")
                    }
                  >
                    Cancel
                  </Button>
                )}

                {stream.status === "LIVE" && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={() =>
                      handleStatusChange(stream.id, "COMPLETED")
                    }
                  >
                    Complete
                  </Button>
                )}
              </Stack>
            </Box>
          ))}
        </Paper>
      </Container>
    </Box>
  );
}