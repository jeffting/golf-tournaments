"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ReactNode } from "react";

const theme = createTheme({
    typography: {
        fontFamily: 'var(--font-bebas-neue), sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // Bebas Neue is all caps anyway, but let's keep it safe
                    fontWeight: 400,
                },
            },
        },
    },
});

export function ThemeRegistry({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
}
