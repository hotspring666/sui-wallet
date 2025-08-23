import { createTheme } from "@mui/material/styles";

// Define the color palette based on bucketprotocol.io
const palette = {
  primary: {
    main: "#00FFAA", // A vibrant green
    contrastText: "#000000",
  },
  background: {
    default: "#0A0A0A", // Very dark background
    paper: "#1A1A1A", // Slightly lighter for cards/paper elements
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#B0B0B0",
  },
};

// Create the custom theme
export const theme = createTheme({
  palette: palette,
  typography: {
    fontFamily: '"Inter", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          "&.Mui-disabled": {
            backgroundColor: '#2A2A2A',
            color: '#555555',
          }
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#00E699",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #333333",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          "&.Mui-selected": {
            color: palette.primary.main,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: palette.primary.main,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#555555",
            },
            "&:hover fieldset": {
              borderColor: "#777777",
            },
            "&.Mui-focused fieldset": {
              borderColor: palette.primary.main,
            },
            "&.Mui-disabled": {
                backgroundColor: '#252525',
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: '#424242'
                }
            }
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: palette.text.primary,
          "&:hover": {
            color: palette.primary.main,
          },
          "&.Mui-disabled": {
            color: '#444444',
          }
        },
      },
    },
  },
});
