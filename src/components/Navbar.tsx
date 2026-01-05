"use client";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import SportsGolfIcon from '@mui/icons-material/SportsGolf';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { useState, MouseEvent } from 'react';
import Box from "@mui/material/Box";

export default function Navbar() {
    const { user } = useAuth();
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleSignOut = async () => {
        handleCloseUserMenu();
        await signOut(auth);
    };

    return (
        <AppBar position="static" className="bg-green-900" elevation={0} sx={{ bgcolor: '#14532d' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <SportsGolfIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: "white" }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            flexGrow: 1
                        }}
                    >
                        GOLF TOURNEY TRACKER
                    </Typography>

                    <SportsGolfIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: "white" }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component={Link}
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        TRACKER
                    </Typography>

                    {/* Create Tournament Button - Visible on all screens */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
                        <Button
                            size="large"
                            aria-label="create tournament"
                            color="inherit"
                            component={Link}
                            href="/tournaments/new"
                        >
                            Create
                        </Button>
                    </Box>

                    <Button
                        color="inherit"
                        component={Link}
                        href="/tournaments/new"
                        sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                    >
                        Create Tournament
                    </Button>

                    {user ? (
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={user.displayName || "User"} src="/static/images/avatar/2.jpg" sx={{ bgcolor: 'white', color: '#14532d' }}>
                                        {(user.displayName || "U").charAt(0).toUpperCase()}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem disabled>
                                    <Typography textAlign="center" variant="body2">{user.displayName}</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleSignOut}>
                                    <Typography textAlign="center">Sign Out</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Button color="inherit" component={Link} href="/auth/signin">Sign In</Button>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
