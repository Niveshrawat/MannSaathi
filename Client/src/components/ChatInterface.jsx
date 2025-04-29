import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Typography, Paper, CircularProgress } from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

const ChatInterface = ({ mode, sessionBooked }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial AI message
    if (mode === 'ai' && messages.length === 0) {
      setMessages([
        {
          text: "Hello! I'm Manas Saathi, your mental wellness companion. How are you feeling today?",
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    }
  }, [mode]);

  const generateAIResponse = async (userMessage) => {
    try {
      const response = await hf.textGeneration({
        model: 'facebook/blenderbot-400M-distill',
        inputs: `User: ${userMessage}\nAssistant: I am a supportive AI counselor.`,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7,
          top_p: 0.9,
          repetition_penalty: 1.2,
        }
      });

      return response.generated_text;
    } catch (error) {
      console.error('Error calling AI API:', error);
      return "I'm sorry, I'm having trouble responding right now. Please try again.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    if (mode === 'ai') {
      const aiResponse = await generateAIResponse(inputMessage);
      setMessages(prev => [...prev, {
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }]);
    } else {
      // Handle human counselor chat
      // This would typically connect to your backend WebSocket or API
      // For now, we'll just simulate a response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: "I understand. Could you tell me more about that?",
          sender: 'counselor',
          timestamp: new Date()
        }]);
      }, 1000);
    }

    setIsLoading(false);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
        {messages.map((message, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              backgroundColor: message.sender === 'user' ? '#E3F2FD' : '#FFFFFF',
              p: 1.5,
              borderRadius: 1,
              mb: 2,
              maxWidth: '80%',
              ml: message.sender === 'user' ? 'auto' : 0,
              mr: message.sender === 'user' ? 0 : 'auto',
            }}
          >
            <Box 
              sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                backgroundColor: message.sender === 'ai' ? '#A691F1' : '#4CAF50',
                mr: 1 
              }} 
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {message.sender === 'ai' ? 'Manas AI' : message.sender === 'counselor' ? 'Counselor' : 'You'}
              </Typography>
              <Typography variant="body2">
                {message.text}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Paper>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 1,
          border: '1px solid #E0E0E0',
          p: 0.5
        }}
      >
        <TextField
          placeholder="Type your message..."
          variant="standard"
          fullWidth
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          disabled={isLoading}
          InputProps={{ disableUnderline: true }}
          sx={{ ml: 1 }}
          multiline
          maxRows={4}
        />
        <IconButton sx={{ color: 'text.secondary' }}>
          <MicNoneOutlinedIcon />
        </IconButton>
        <IconButton 
          color="primary" 
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          <SendOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatInterface; 