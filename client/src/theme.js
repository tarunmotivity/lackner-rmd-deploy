export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'dark' ? {
      background: {
        default: '#0f172a',
        paper: '#1e293b',
      },
      text: {
        primary: '#f8fafc',
        secondary: '#94a3b8',
      },
    } : {
      background: {
        default: '#faf8ff',
        paper: '#ffffff',
      },
      text: {
        primary: '#111827',
        secondary: '#6b7280',
      },
    }),
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h6: {
      fontWeight: 700,
      fontSize: "16px",
      color: mode === 'dark' ? '#f8fafc' : '#111827'
    },
    body2: {
      fontWeight: 500,
      fontSize: "13px"
    },
    caption: {
      fontWeight: 500,
      fontSize: "12px",
      color: mode === 'dark' ? '#94a3b8' : '#6b7280'
    }
  }
});