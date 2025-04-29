import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box 
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const SessionExpiredDialog = ({ open, onClose, onBookSession }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon color="primary" />
          <Typography variant="h6">Trial Session Ended</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          Your trial session has ended. To continue chatting with a counselor, please book a full session.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Booking a session will give you:
        </Typography>
        <Box component="ul" sx={{ mt: 1, pl: 2 }}>
          <Typography component="li" variant="body2">Unlimited time with your counselor</Typography>
          <Typography component="li" variant="body2">Personalized support and guidance</Typography>
          <Typography component="li" variant="body2">Follow-up resources and recommendations</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Maybe Later</Button>
        <Button variant="contained" onClick={onBookSession}>
          Book a Session
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionExpiredDialog; 