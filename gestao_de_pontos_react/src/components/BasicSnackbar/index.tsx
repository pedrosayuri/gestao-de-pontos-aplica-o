import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { SnackbarCloseReason } from '@mui/material/Snackbar';

interface CustomSnackbarProps {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
  onClose: (open: boolean) => void;
}

export const CustomSnackbar: React.FC<CustomSnackbarProps> = ({ open, message, severity, onClose }) => {
  const handleClose = (_event: React.SyntheticEvent<unknown, Event> | Event, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Alert
        severity={severity}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
