import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  Divider,
  Button,
  Chip,
  Modal,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Send,
  AttachFile,
  EmojiEmotions,
  MoreVert,
} from '@mui/icons-material';
import io from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { processPayment } from '../../services/paymentService';

const CounselorExtensionModal = ({ open, extensionRequestData, onAccept, onReject }) => {
  if (!open || !extensionRequestData) return null;
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Extension Requested</Typography>
      <Typography gutterBottom>
        User requested to extend session by {extensionRequestData.extensionOption.duration} min (₹{extensionRequestData.extensionOption.cost})
      </Typography>
      <Button variant="contained" color="success" sx={{ m: 1 }} onClick={onAccept}>Accept</Button>
      <Button variant="contained" color="error" sx={{ m: 1 }} onClick={onReject}>Reject</Button>
    </Box>
  );
};

const ChatSession = ({ sessionData }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [sessionEndTime, setSessionEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [selectedExtensionIdx, setSelectedExtensionIdx] = useState(null);
  const [extensionRequest, setExtensionRequest] = useState(null);
  const [extensionAccepted, setExtensionAccepted] = useState(false);
  const [extensionPaymentPending, setExtensionPaymentPending] = useState(false);
  const [extensionProcessing, setExtensionProcessing] = useState(false);
  const [extensionStep, setExtensionStep] = useState('idle');
  const [extensionRequestData, setExtensionRequestData] = useState(null);
  const [extensionProcessingMsg, setExtensionProcessingMsg] = useState('');
  const [extensionUsed, setExtensionUsed] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const socketRef = React.useRef(null);
  const userObj = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = userObj._id?.toString();
  const counselorId = sessionData.counselor?._id?.toString() || sessionData.counselor?.toString();
  const userIdFromSession = sessionData.user?._id?.toString() || sessionData.user?.toString();

  const isCurrentUserCounselor = userId && counselorId && userId === counselorId;
  const chatName = isCurrentUserCounselor ? sessionData.user.name : sessionData.counselor.name;
  const chatAvatar = isCurrentUserCounselor ? sessionData.user.profilePicture : sessionData.counselor.profilePicture;
  const token = localStorage.getItem('token');
  const isUser = userId === userIdFromSession;

  useEffect(() => {
    if (!sessionData?.booking) return;
    // Only create the socket once
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:5000');
    }
    const socket = socketRef.current;
    const joinUserRoom = () => {
      // Always join user, counselor, and chat rooms for real-time events
      socket.emit('joinRoom', { token, bookingId: sessionData.booking }, (res) => {
        console.log('joinRoom callback:', res);
        if (res.success) {
          setTimeRemaining(res.timeRemaining);
          if (res.sessionEndTimestamp) setSessionEndTime(res.sessionEndTimestamp);
        } else {
          console.error('Failed to join room:', res.message);
        }
      });
    };
    joinUserRoom();
    socket.on('reconnect', () => {
      console.log('Socket reconnected, rejoining user room');
      joinUserRoom();
    });
    socket.on('chatHistory', (history) => {
      setMessages(history);
    });
    socket.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on('timeRemaining', ({ minutesRemaining }) => {
      setTimeRemaining(minutesRemaining);
    });
    socket.on('sessionEnded', ({ message, endedByUser }) => {
      setSessionEnded(true);
      setTimeRemaining(0);
      toast(message);
      console.log('sessionEnded called, isUser:', isUser);
      if (isUser) {
        setShowFeedback(true);
        console.log('setShowFeedback(true) called');
      }
    });
    socket.on('error', ({ message }) => {
      toast.error(message);
    });
    socket.on('extensionRequested', (data) => {
      console.log('extensionRequested received', data, 'isCurrentUserCounselor:', isCurrentUserCounselor, { userId, counselorId, userObj, sessionData });
      // PATCH: Always show for counselor role
      if (userObj.role === 'counselor' || isCurrentUserCounselor) {
        setExtensionRequestData(data);
        setExtensionStep('counselor');
        console.log('DEBUG: setExtensionStep(counselor), setExtensionRequestData', data);
      } else {
        console.log('DEBUG: Not showing modal because not counselor.', {
          userId,
          counselorId,
          userObj,
          sessionData
        });
      }
    });
    socket.on('extensionAccepted', (data) => {
      console.log('extensionAccepted received', data, 'isUser:', isUser);
      if (isUser) {
        const idx = sessionData.slot.extensionOptions.findIndex(opt => opt.duration === data.extensionOption.duration && opt.cost === data.extensionOption.cost);
        console.log('DEBUG: setExtensionStep(payment), setSelectedExtensionIdx', idx, 'SHOWING PAYMENT MODAL', data, sessionData.slot.extensionOptions);
        setExtensionStep('payment');
        setSelectedExtensionIdx(idx);
        toast.success('Counselor accepted extension. Please proceed with payment.');
      }
      if (!isUser) {
        setExtensionStep('idle');
      }
    });
    socket.on('extensionRejected', (data) => {
      if (isUser) {
        toast.error('Counselor rejected the extension request.');
        setExtensionStep('idle');
        setSelectedExtensionIdx(null);
      }
      setExtensionRequestData(null);
    });
    socket.on('extensionCompleted', async (data) => {
      try {
        console.log('extensionCompleted event received', data);
        setExtensionUsed(true);
        setExtensionStep('done');
        setExtensionRequestData(null);
        setSelectedExtensionIdx(null);
        if (data.newEndTime) {
          // Fetch latest slot data to ensure timer is correct
          try {
            const res = await fetch(`/api/slots/${sessionData.slot._id}`);
            if (res.ok) {
              const slot = await res.json();
              const slotEnd = new Date(`${slot.date}T${slot.endTime}`);
              setSessionEndTime(slotEnd.getTime());
              setTimeLeft(Math.max(0, Math.floor((slotEnd.getTime() - Date.now()) / 1000)));
              const localEndTime = slotEnd.toLocaleString();
              console.log('Session extended! New end time (from DB):', localEndTime);
              toast.success('Session extended! New end time: ' + localEndTime);
            } else {
              // fallback to event data
              setSessionEndTime(new Date(data.newEndTime).getTime());
              setTimeLeft(Math.max(0, Math.floor((new Date(data.newEndTime).getTime() - Date.now()) / 1000)));
              const localEndTime = new Date(data.newEndTime).toLocaleString();
              toast.success('Session extended! New end time: ' + localEndTime);
            }
          } catch (err) {
            // fallback to event data
            setSessionEndTime(new Date(data.newEndTime).getTime());
            setTimeLeft(Math.max(0, Math.floor((new Date(data.newEndTime).getTime() - Date.now()) / 1000)));
            const localEndTime = new Date(data.newEndTime).toLocaleString();
            toast.success('Session extended! New end time: ' + localEndTime);
            console.error('Error fetching slot after extension:', err);
          }
        }
        setTimeout(() => setExtensionStep('idle'), 1500);
      } catch (e) {
        console.error('Error in extensionCompleted handler:', e);
      }
    });
    // TEST: Listen for testCounselorEvent
    socket.on('testCounselorEvent', (data) => {
      console.log('testCounselorEvent received:', data);
    });
    // Log all socket events for debugging
    socket.onAny((event, ...args) => {
      console.log('Received socket event:', event, args);
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionData?.booking, token]);

  // Per-second countdown
  useEffect(() => {
    if (!sessionEndTime) return;
    const timer = setInterval(() => {
      const diff = Math.max(0, Math.floor((sessionEndTime - Date.now()) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) {
        clearInterval(timer);
        // Play sound when time is up
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(err => console.log('Audio play failed:', err));
        // Show toast notification
        toast('Session time has ended', {
          icon: '⏰',
          duration: 5000
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionEndTime]);

  // Update: use timeLeft for display
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null || seconds === undefined) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timer color based on remaining time
  const getTimerColor = (seconds) => {
    if (seconds < 60) return 'error'; // Red for less than 1 minute
    if (seconds < 300) return 'warning'; // Orange for less than 5 minutes
    return 'primary'; // Default blue
  };

  const handleSendMessage = () => {
    if (message.trim() && !sessionEnded) {
      socketRef.current.emit('chatMessage', {
        bookingId: sessionData.booking,
        message: message
      });
      setMessage('');
    }
  };

  useEffect(() => {
    if (!sessionData?.booking) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/bookings/${sessionData.booking}`);
        if (!res.ok) return;
        const booking = await res.json();
        if (booking.status === 'completed') {
          setSessionEnded(true);
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
          clearInterval(interval);
    }
      } catch (err) {
        // ignore
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [sessionData?.booking]);

  const handleRequestExtension = (idx) => {
    if (sessionEnded) {
      toast.error('Session has ended. Cannot extend.');
      return;
    }
    console.log('DEBUG: setExtensionStep(requesting) called from handleRequestExtension');
    setExtensionStep('requesting');
    setExtensionProcessingMsg('Sending extension request...');
    socketRef.current.emit('requestExtension', {
      bookingId: sessionData.booking,
      extensionOptionIndex: idx,
      userId
    }, (res) => {
      if (res && res.success) {
        setExtensionStep('waiting');
        setExtensionProcessingMsg('Waiting for counselor response...');
        setSelectedExtensionIdx(idx);
      } else {
        toast.error((res && res.message) || 'Failed to request extension');
        setExtensionStep('idle');
      }
    });
  };

  const handleRespondToExtension = (accepted) => {
    console.log('DEBUG: handleRespondToExtension called with', accepted, 'extensionRequestData:', extensionRequestData);
    if (!extensionRequestData) return;
    console.log('DEBUG: setExtensionStep(requesting) called from handleRespondToExtension');
    setExtensionStep('requesting');
    setExtensionProcessingMsg(accepted ? 'Accepting...' : 'Rejecting...');
    socketRef.current.emit('respondToExtension', {
      bookingId: extensionRequestData.bookingId,
      accepted,
      extensionOptionIndex: sessionData.slot.extensionOptions.findIndex(opt => opt.duration === extensionRequestData.extensionOption.duration && opt.cost === extensionRequestData.extensionOption.cost)
    }, (res) => {
      if (res && res.success) {
        toast.success(accepted ? 'Extension accepted' : 'Extension rejected');
        setExtensionRequestData(null);
        setExtensionStep('idle');
      } else {
        toast.error((res && res.message) || 'Failed to respond');
        setExtensionStep('idle');
      }
    });
  };

  const handleProcessExtensionPayment = () => {
    if (selectedExtensionIdx === null) return;
    console.log('DEBUG: setExtensionStep(requesting) called from handleProcessExtensionPayment');
    setExtensionStep('requesting');
    setExtensionProcessingMsg('Processing payment...');
    const paymentId = 'dummy-payment-id';
    socketRef.current.emit('processExtensionPayment', {
      bookingId: sessionData.booking,
      extensionOptionIndex: selectedExtensionIdx,
      paymentId
    }, (res) => {
      if (res && res.success) {
        toast.success('Extension payment successful! Session extended.');
        setExtensionStep('done');
        setTimeout(() => setExtensionStep('idle'), 1500);
        setSelectedExtensionIdx(null);
      } else {
        toast.error((res && res.message) || 'Payment failed');
        setExtensionStep('idle');
      }
    });
  };

  // Payment Dialog for extension
  const handleExtensionPayment = async () => {
    setPaymentProcessing(true);
    setPaymentError(null);
    try {
      await processPayment(
        sessionData.slot.extensionOptions[selectedExtensionIdx].cost,
        sessionData.booking,
        true, // isExtension
        selectedExtensionIdx // extensionOptionIndex
      );
      handleProcessExtensionPayment();
    } catch (err) {
      setPaymentError(err.message || 'Payment failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Add logs for state resets
  const setStepWithLog = (step) => {
    console.log('DEBUG: setExtensionStep', step);
    setExtensionStep(step);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={chatAvatar}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography variant="h6">{chatName}</Typography>
            {timeLeft !== null && (
              <Typography variant="caption" color="text.secondary">
                {sessionEnded ? 'Session ended' : `Time remaining: ${Math.ceil(timeLeft / 60)} minutes`}
            </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={
              timeLeft !== null && timeLeft !== undefined && !isNaN(timeLeft)
                ? formatTime(timeLeft)
                : (timeRemaining !== null && timeRemaining !== undefined && !isNaN(timeRemaining)
                    ? formatTime(timeRemaining * 60)
                    : '--:--')
            }
            color={timeLeft ? getTimerColor(timeLeft) : 'primary'}
            variant="outlined"
          />
          {!sessionEnded && isUser && !extensionUsed && (
            <Button
              variant="outlined"
              color="success"
              onClick={() => setExtensionStep('select')}
              disabled={extensionStep !== 'idle'}
            >
              Extend Session
            </Button>
          )}
          {!sessionEnded && isUser && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setShowFinishModal(true)}
            >
              Finish Session
            </Button>
          )}
          <IconButton>
            <MoreVert />
          </IconButton>
        </Box>
        {/* Display Extension Options */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>Extension Options:</Typography>
          {sessionData.slot && sessionData.slot.extensionOptions && sessionData.slot.extensionOptions.length > 0 ? (
            sessionData.slot.extensionOptions.map((opt, idx) => (
              <Typography key={idx} variant="body2">
                {opt.duration} minutes - ₹{opt.cost}
              </Typography>
            ))
          ) : (
            <Typography variant="body2">No extension options available.</Typography>
          )}
        </Box>
      </Paper>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          bgcolor: 'grey.50',
          p: 2
        }}
      >
        <List>
          {messages.map((msg, index) => {
            const isMe = msg.sender === userId;
            return (
            <ListItem
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: isMe ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  mb: 1
                }}
                >
                <Box>
                  <Paper
                    sx={{
                      p: 1.5,
                      bgcolor: isMe ? 'primary.main' : 'grey.100',
                      color: isMe ? 'white' : 'text.primary',
                      borderRadius: 2,
                      maxWidth: 350,
                      minWidth: 60,
                      textAlign: isMe ? 'right' : 'left'
                    }}
                  >
                    <Typography>
                      {msg.message || msg.text || msg.content || '[No message]'}
                    </Typography>
                  </Paper>
                  <Typography variant="caption" color="text.secondary">
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : ''}
                  </Typography>
              </Box>
            </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Message Input */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <IconButton>
          <EmojiEmotions />
        </IconButton>
        <IconButton>
          <AttachFile />
        </IconButton>
        <TextField
          fullWidth
          placeholder={sessionEnded ? "Session has ended" : "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          variant="outlined"
          size="small"
          disabled={sessionEnded}
        />
        <Button
          variant="contained"
          endIcon={<Send />}
          onClick={handleSendMessage}
          disabled={sessionEnded || !message.trim()}
        >
          Send
        </Button>
      </Paper>
      {/* Finish Session Confirmation Modal */}
      <Modal open={showFinishModal} onClose={() => setShowFinishModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            minWidth: 300,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom>
            End Session?
          </Typography>
          <Typography gutterBottom>
            Are you sure you want to end this session for both participants?
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              console.log('Socket ID:', socketRef.current && socketRef.current.id);
              console.log('Emitting finishSession with bookingId:', sessionData.booking);
              socketRef.current.emit('finishSession', { bookingId: sessionData.booking });
              setShowFinishModal(false);
            }}
            sx={{ mt: 2 }}
          >
            Yes, End Session
          </Button>
          <Button onClick={() => setShowFinishModal(false)} sx={{ mt: 1 }}>
            Cancel
          </Button>
        </Box>
      </Modal>
      <Modal open={sessionEnded} onClose={() => {}}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            minWidth: 300,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Session Completed
          </Typography>
          <Typography variant="body1" gutterBottom>
            {isUser ? 'Your session has ended. Thank you!' : 'Session was ended by the user.'}
          </Typography>
          {isUser && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.href = '/dashboard'}
              sx={{ mt: 2 }}
            >
              Go to Dashboard
            </Button>
          )}
        </Box>
      </Modal>
      <Modal open={showFeedback} onClose={() => {}}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            minWidth: 320,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Rate Your Session
          </Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
          />
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            label="Leave a comment (optional)"
            value={comment}
            onChange={e => setComment(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={rating === 0 || feedbackSubmitted}
            onClick={async () => {
              setFeedbackSubmitted(true);
              try {
                const response = await fetch(`http://localhost:5000/api/bookings/${sessionData.booking}/feedback`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ rating, comment })
                });
                const data = await response.json();
                console.log('Feedback API response:', data);
                if (!response.ok) {
                  toast.error(data.message || 'Failed to submit feedback');
                  setFeedbackSubmitted(false);
                  return;
                }
                setShowFeedback(false);
                toast.success('Thank you for your feedback!');
              } catch (err) {
                toast.error('Network error submitting feedback');
                setFeedbackSubmitted(false);
              }
            }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
      {/* Extension Modal: Unified Flow */}
      <Modal open={extensionStep !== 'idle'} onClose={() => {}}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4, minWidth: 340, textAlign: 'center' }}>
          {/* User: Select option */}
          {extensionStep === 'idle' && null}
          {extensionStep === 'requesting' && (
            <Box>
              <span className="loader"></span>
              <Typography sx={{ mt: 2 }}>{extensionProcessingMsg || 'Processing...'}</Typography>
            </Box>
          )}
          {extensionStep === 'waiting' && (
            <Box>
              <span className="loader"></span>
              <Typography sx={{ mt: 2 }}>{extensionProcessingMsg || 'Waiting for counselor...'}</Typography>
              <Button sx={{ mt: 2 }} onClick={() => setExtensionStep('idle')}>Cancel</Button>
            </Box>
          )}
          {/* User: Select extension option */}
          {extensionStep === 'select' && (
            <Box>
              <Typography variant="h6" gutterBottom>Extend Session</Typography>
              <Typography variant="body2" gutterBottom>Select an extension option:</Typography>
              {sessionData.slot && sessionData.slot.extensionOptions && sessionData.slot.extensionOptions.length > 0 ? (
                sessionData.slot.extensionOptions.map((opt, idx) => (
                  <Button key={idx} variant="outlined" sx={{ m: 1 }} onClick={() => handleRequestExtension(idx)}>
                    {opt.duration} min - ₹{opt.cost}
                  </Button>
                ))
              ) : (
                <Typography>No extension options available.</Typography>
              )}
              <Button onClick={() => setExtensionStep('idle')} sx={{ mt: 2 }}>Cancel</Button>
            </Box>
          )}
          {/* Counselor: Accept/Reject */}
          {extensionStep === 'counselor' && (
            <CounselorExtensionModal
              open={extensionStep === 'counselor'}
              extensionRequestData={extensionRequestData}
              onAccept={() => handleRespondToExtension(true)}
              onReject={() => handleRespondToExtension(false)}
            />
          )}
          {/* User: Payment */}
          {extensionStep === 'payment' && (
            <Dialog open={true} onClose={() => {}}>
              <DialogTitle>Complete Extension Payment</DialogTitle>
              <DialogContent>
                <Typography variant="subtitle1" gutterBottom>
                  Extension Summary
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Extension Duration:</Typography>
                    <Typography fontWeight="bold">
                      {selectedExtensionIdx !== null && sessionData.slot.extensionOptions[selectedExtensionIdx]?.duration} min
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Amount:</Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ₹{selectedExtensionIdx !== null && sessionData.slot.extensionOptions[selectedExtensionIdx]?.cost}
                    </Typography>
                  </Box>
                </Paper>
                {paymentError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {paymentError}
                  </Alert>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Please complete the payment to extend your session.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setExtensionStep('idle')} disabled={paymentProcessing}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleExtensionPayment}
                  disabled={paymentProcessing}
                >
                  {paymentProcessing ? 'Processing...' : 'Pay Now'}
                </Button>
              </DialogActions>
            </Dialog>
          )}
          {/* Done */}
          {extensionStep === 'done' && (
            <Box>
              <span className="loader"></span>
              <Typography sx={{ mt: 2 }}>Session extended!</Typography>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ChatSession; 

<style>
{`
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`}
</style> 