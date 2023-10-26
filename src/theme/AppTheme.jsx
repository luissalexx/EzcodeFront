import { ThemeProvider } from "@emotion/react"
import { CssBaseline } from "@mui/material"

import { greyTheme } from "./"

export const AppTheme = ({ children }) => {
    return (
        <ThemeProvider theme={greyTheme} >
            <CssBaseline />

            {children}
        </ThemeProvider>
    )
}
