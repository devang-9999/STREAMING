"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "./Navbar.css";

interface NavbarProps {
  token: string | null;
  logout: () => void;
}

const navItems = [
  { name: "Join Us", path: "/about" },
  { name: "Sign In", path: "/portfolio" },
];

export default function Navbar({ token, logout }: NavbarProps) {

  const [openDrawer, setOpenDrawer] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const drawer = (
    <Box className="drawerContainer" onClick={toggleDrawer}>
      <List>

        <ListItem>
          <Link href="/" className="logo">
            KANGAN BOARD
          </Link>
        </ListItem>

        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={Link}
              href={item.path}
              className={pathname === item.path ? "activeMobile" : ""}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}

        {token && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}

      </List>
    </Box>
  );

  return (
  <AppBar position="static" className="appbar" elevation={0} color="transparent">

      <Toolbar className="toolbar">

        <Link href="/" className="logo">
          LOGO
        </Link>

        <Box className="navLinks"   sx={{ display: { xs: "none", md: "flex" } }}>

          {navItems.map((item) => (
            <Button
              key={item.name}
              component={Link}
              href={item.path}
              className={
                pathname === item.path
                  ? item.name === "Contact us"
                    ? "contactActive"
                    : "activeLink"
                  : item.name === "Contact us"
                  ? "contactBtn"
                  : "navBtn"
              }
            >
              {item.name}
            </Button>
          ))}

          {token && (
            <Button className="navBtn" onClick={handleLogout}>
              Logout
            </Button>
          )}

        </Box>

        <IconButton className="menuBtn" onClick={toggleDrawer}   sx={{ display: { xs: "flex", md: "none" } }}
>
          <MenuIcon />
        </IconButton>

      </Toolbar>

      <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
        {drawer}
      </Drawer>

    </AppBar>
  );
}