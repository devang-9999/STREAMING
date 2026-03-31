"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { loginThunk } from "@/redux/auth/authThunks";
import { useAppDispatch } from "@/lib/hooks";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success",
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    const result = await dispatch(
      loginThunk({
        email: data.email,
        password: data.password,
      }),
    );

    setLoading(false);

    if (loginThunk.fulfilled.match(result)) {
      const { access_token, user } = result.payload;

      localStorage.removeItem("token");

      localStorage.setItem("token", access_token);

      setSnackbarType("success");
      setSnackbarMessage("Login successful");

      if (user.role === "creator") {
        router.push("/creator");
      } else {
        router.push("/user");
      }
    } else {
      setSnackbarType("error");
      setSnackbarMessage("Invalid credentials");
    }

    setOpenSnackbar(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "url(https://i.pinimg.com/originals/a0/5c/53/a05c534a95aa48c6423f65d34db97996.gif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: 420,
          p: 5,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 3 }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ mb: 4 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            type="submit"
            disabled={loading}
            sx={{
              background: "#0052cc",
              fontWeight: 600,
              py: 1.5,
              "&:hover": {
                background: "#003f9e",
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            Don’t have an account?{" "}
            <Link href="/auth/signup" style={{ color: "#1976d2" }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarType} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
