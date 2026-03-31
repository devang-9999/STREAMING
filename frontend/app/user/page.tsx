/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Paper,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import axios from "axios";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchUserTasks,
  updateUserTaskStatus,
} from "@/redux/userTasks/userTaskSlice";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";
import { logout } from "@/redux/auth/authSlice";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";

const columns = {
  pending: " 📝 To Do",
  "in-progress": " 👨🏻‍💻 Doing",
  blocked: " ⌛ Stand By",
  "in-review": " 🕵🏼 QC",
  "being-tested": "🧑‍🔬 QA",
  completed: " ꪜ Done",
};

function DraggableTask({ task }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      sx={{
        mb: 2,
        borderRadius: 3,
        cursor: "grab",
        transition: "0.2s",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Typography fontWeight={700}>{task.title}</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2">{task.description}</Typography>
      </CardContent>
    </Card>
  );
}

function DroppableColumn({ status, title, tasks }: any) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <Paper
      ref={setNodeRef}
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

      {tasks.map((task: any) => (
        <DraggableTask key={task.id} task={task} />
      ))}
    </Paper>
  );
}

export default function UserDashboard() {
  const dispatch = useAppDispatch();
  const userIdForNotification = useAppSelector((state) => state.authenticator.currentUser?.id);

  const { tasks, loading } = useAppSelector((state) => state.userTasks);
  const router = useRouter();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    dispatch(fetchUserTasks());

    const socket = getSocket();
    socket.connect();
    socket.emit("join", userIdForNotification);

    socket.on("taskCreated", () => {
      dispatch(fetchUserTasks());
    });

    socket.on("taskUpdated", () => {
      dispatch(fetchUserTasks());
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = over.id as string;

    const task = tasks.find((t) => t.id === taskId);

    if (task && task.status !== newStatus) {
      dispatch(
        updateUserTaskStatus({
          taskId,
          status: newStatus,
        }),
      );
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const handleReadNotification = async (n: any) => {
    await axios.patch(
      `http://localhost:5000/notifications/${n.id}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

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
            User Dashboard
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

      <Container maxWidth={false} sx={{ mt: 4, px: 4 }}>
        {loading && (
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        )}

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
            }}
          >
            {Object.entries(columns).map(([status, title]) => (
              <DroppableColumn
                key={status}
                status={status}
                title={title}
                tasks={tasks.filter((task) => task.status === status)}
              />
            ))}
          </Box>
        </DndContext>
      </Container>
    </Box>
  );
}
