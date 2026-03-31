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
  MenuItem,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { signupThunk } from "../../../redux/auth/authThunks";
import { useRouter } from "next/navigation";
import Link from "next/link";

const schema = z
  .object({
    name: z.string().min(2, "Name required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["creator", "user"], { message: "Role required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    const result = await dispatch(
      signupThunk({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      }),
    );

    if (signupThunk.fulfilled.match(result)) {
      setSnackbarType("success");
      setSnackbarMessage("Account created successfully");
      router.push("/user");
    } else {
      setSnackbarType("error");
      setSnackbarMessage("Signup failed");
    }

    setOpenSnackbar(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url(https://i.pinimg.com/originals/a0/5c/53/a05c534a95aa48c6423f65d34db97996.gif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: 420,
          padding: 5,
          borderRadius: 4,
          background: "white",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Create Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Name"
            fullWidth
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{ mb: 3 }}
          />

          <TextField
            label="Email"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 3 }}
          />

          <TextField
            select
            label="Role"
            fullWidth
            {...register("role")}
            error={!!errors.role}
            helperText={errors.role?.message}
            sx={{ mb: 3 }}
          >
            <MenuItem value="creator">Creator</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </TextField>

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ mb: 3 }}
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

          <TextField
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            fullWidth
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            sx={{ mb: 4 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
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
            sx={{
              background: "#0052cc",
              fontWeight: 600,
              padding: "12px",
              "&:hover": {
                background: "#003f9e",
              },
            }}
          >
            Sign Up
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "#1976d2" }}>
              Login
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
