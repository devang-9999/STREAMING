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
  Grid,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "@/redux/auth/authSlice";
import { useRouter } from "next/navigation";

import { fetchUsers } from "@/redux/auth/authThunks";
import SuggestionCard from "@/components/SuggestionCard/SuggestionCard";

export default function UserDashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { users, loading } = useAppSelector((state) => state.auth);
  const userId = useAppSelector((state) => state.auth.currentUser?.id);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    dispatch(fetchUsers());

    const socket = getSocket();
    socket.connect();

    if (userId) {
      socket.emit("join", userId);
    }

    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, [dispatch, userId]);

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
            Explore Creators
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
        {notifications.length === 0 && <MenuItem>No Notifications</MenuItem>}

        {notifications.map((n, i) => (
          <MenuItem key={i}>{n.message}</MenuItem>
        ))}
      </Menu>

      <Container sx={{ mt: 4 }}>
        {loading && (
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && (
          <Grid container spacing={3}>
            {users
              ?.filter((u) => u.role === "CREATOR" && u.id)
              .map((creator) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={creator.id}>
                  <SuggestionCard user={creator} />
                </Grid>
              ))}
          </Grid>
        )}

        {!loading &&
          users?.filter((u) => u.role === "CREATOR").length === 0 && (
            <Typography textAlign="center" sx={{ mt: 5 }}>
              No creators available
            </Typography>
          )}
      </Container>
    </Box>
  );
}
