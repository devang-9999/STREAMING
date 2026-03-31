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
  Card,
  CardContent,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Select,
  IconButton,
  Badge,
  Menu,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import {
  fetchTasks,
  createTask,
  updateTaskStatus,
} from "@/redux/tasks/taskSlice";

import { fetchUsers } from "@/redux/auth/authThunks";
import { logout } from "@/redux/auth/authSlice";
import { useRouter } from "next/navigation";

const columns = {
  pending: " 📝 To Do",
  "in-progress": " 👨🏻‍💻 Doing",
  blocked: " ⌛ Stand By",
  "in-review": " 🕵🏼 QC",
  "being-tested": "🧑‍🔬 QA",
  completed: " ꪜ Done",
};

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const users = useAppSelector((state) => state.authenticator.users);
  const userIdForNotification = useAppSelector((state) => state.authenticator.currentUser?.id);
  const tasks = useAppSelector((state) => state.tasks?.tasks ?? []);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState<number | "">("");

  const [notifications, setNotifications] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const changeStatus = (taskId: string, status: string) => {
    dispatch(
      updateTaskStatus({
        id: taskId,
        status,
      }),
    );
  };

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());

    const socket = getSocket();
    socket.connect();

     socket.emit("join", userIdForNotification);

    socket.on("taskCreated", () => {
      dispatch(fetchTasks());
    });

    socket.on("taskUpdated", () => {
      dispatch(fetchTasks());
    });

    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("notification");
    };
  }, [dispatch,userIdForNotification]);

  const handleCreateTask = () => {
    if (!userId) {
      alert("Please select a user");
      return;
    }

    dispatch(
      createTask({
        title,
        description,
        assignedToId: userId,
      }),
    );

    setTitle("");
    setDescription("");
    setUserId("");
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleReadNotification = (n: any) => {
    setNotifications((prev) => prev.filter((x) => x.id !== n.id));
    setAnchorEl(null);
  };

  return (
    <Box sx={{ background: "#f4f5f7", minHeight: "100vh" }}>
      <AppBar
        position="static"
        sx={{
          background: "black",
          borderRadius: "3rem",
          margin: "5px",
          width: "99%",
        }}
      >
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }} variant="h6">
            Kanban Admin Dashboard
          </Typography>

          <IconButton
            color="inherit"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Button
            variant="contained"
            sx={{ background: "white", color: "black", borderRadius: "3rem", ml: 2 }}
            onClick={() => setOpen(true)}
          >
            Add Task
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{ ml: 2, borderRadius: "3rem" }}
          >
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

        {notifications.map((n) => (
          <MenuItem key={n.id} onClick={() => handleReadNotification(n)}>
            {n.message}
          </MenuItem>
        ))}
      </Menu>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
          }}
        >
          {Object.entries(columns).map(([status, title]) => (
            <Paper
              key={status}
              sx={{
                flex: 1,
                background: "#ebecf0",
                p: 2,
                borderRadius: 2,
                minHeight: 500,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                {title}
              </Typography>

              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <Card
                    key={task.id}
                    sx={{
                      mb: 2,
                      borderRadius: 3,
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent>
                      <Typography fontWeight={700}>{task.title}</Typography>

                      <Divider sx={{ my: 1 }} />

                      <Typography variant="body2">
                        {task.description}
                      </Typography>

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ mt: 2 }}
                      >
                        <Typography variant="caption">
                          ID: {task.id}
                        </Typography>

                        <Select
                          size="small"
                          value={task.status}
                          onChange={(e) =>
                            changeStatus(task.id, e.target.value)
                          }
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="in-progress">In Progress</MenuItem>
                          <MenuItem value="blocked">Blocked</MenuItem>
                          <MenuItem value="in-review">In Review</MenuItem>
                          <MenuItem value="being-tested">Testing</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
            </Paper>
          ))}
        </Box>
      </Container>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Task</DialogTitle>

        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Select
            fullWidth
            value={userId === "" ? "" : String(userId)}
            onChange={(event) =>
              setUserId(
                event.target.value === "" ? "" : Number(event.target.value),
              )
            }
            displayEmpty
            sx={{ mt: 2 }}
          >
            <MenuItem value="">
              <em>Select User</em>
            </MenuItem>

            {users.map((user) => (
             <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>

          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleCreateTask}
          >
            Create
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}