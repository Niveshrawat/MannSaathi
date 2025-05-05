import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Container,
  Paper,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  Chip,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import {
  NoteAdd as NoteAddIcon,
  History as HistoryIcon,
  Insights as InsightsIcon,
  LightbulbOutlined as LightbulbIcon,
  LockOutlined as LockIcon,
  Save as SaveIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import Insights from './Insights';
import { journalAPI } from '../../services/api';

const JournalApp = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [mood, setMood] = useState('');
  const [title, setTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      setLoading(true);
      const response = await journalAPI.getJournals();
      setJournalEntries(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch journal entries');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = tab => setActiveTab(tab);
  const handleMoodChange = e => setMood(e.target.value);
  const handleTitleChange = e => setTitle(e.target.value);
  const handleJournalContentChange = e => setJournalContent(e.target.value);

  const handleSaveEntry = async () => {
    try {
      setLoading(true);
      const response = await journalAPI.createJournal({
        title,
        content: journalContent,
        mood,
        isPrivate: true
      });
      
      setJournalEntries([response.data.data, ...journalEntries]);
      setTitle('');
      setJournalContent('');
      setMood('');
      setSuccess('Journal entry saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save journal entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        setLoading(true);
        await journalAPI.deleteJournal(id);
        setJournalEntries(journalEntries.filter(entry => entry._id !== id));
        setSuccess('Journal entry deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete journal entry');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderNewEntryTab = () => (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" fontWeight="bold">New Journal Entry</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LockIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">Private Entry</Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>Record your thoughts and feelings</Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3, mt: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" gutterBottom>Title</Typography>
          <TextField 
            fullWidth 
            size="small" 
            value={title}
            onChange={handleTitleChange}
            placeholder="Give your entry a title"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" gutterBottom>How are you feeling?</Typography>
          <FormControl fullWidth size="small">
            <Select 
              value={mood} 
              onChange={handleMoodChange} 
              displayEmpty 
              renderValue={selected => selected || 'Select mood'}
            >
              <MenuItem value=""><em>Select mood</em></MenuItem>
              {['happy', 'sad', 'angry', 'anxious', 'calm', 'neutral'].map(m => (
                <MenuItem key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Typography variant="body2" gutterBottom>Journal Entry</Typography>
      <TextField 
        fullWidth 
        multiline 
        rows={10} 
        placeholder="Write your thoughts..." 
        value={journalContent} 
        onChange={handleJournalContentChange} 
        sx={{ mb: 2 }} 
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          startIcon={<SaveIcon />} 
          onClick={handleSaveEntry}
          disabled={loading || !title || !journalContent}
          sx={{ borderRadius: '50px', backgroundColor: '#A78BFA', '&:hover': { backgroundColor: '#9061F9' } }}
        >
          {loading ? 'Saving...' : 'Save Entry'}
        </Button>
      </Box>
    </Paper>
  );

  const renderPastEntriesTab = () => (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Journal History</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>Review and reflect on your past entries</Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : journalEntries.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">No journal entries yet</Typography>
        </Box>
      ) : (
        journalEntries.map(entry => (
          <Box key={entry._id} sx={{ py: 2, borderBottom: '1px solid #f0f0f0', '&:last-child': { borderBottom: 'none' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">{entry.title}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label={entry.mood} 
                  size="small" 
                  sx={{ 
                    backgroundColor: entry.mood === 'happy' ? '#E0F2F1' : 
                                  entry.mood === 'anxious' ? '#F3E5F5' : 
                                  entry.mood === 'neutral' ? '#F5F5F5' : '#E8EAF6', 
                    color: entry.mood === 'happy' ? '#00897B' : 
                          entry.mood === 'anxious' ? '#9C27B0' : 
                          entry.mood === 'neutral' ? '#757575' : '#3F51B5', 
                    borderRadius: '16px' 
                  }} 
                />
                <IconButton 
                  size="small" 
                  onClick={() => handleDeleteEntry(entry._id)}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
            <Typography variant="body2" color="text.secondary">{entry.content}</Typography>
          </Box>
        ))
      )}

      {journalEntries.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            sx={{ 
              borderRadius: '50px', 
              borderColor: '#E0E0E0', 
              color: '#616161', 
              '&:hover': { borderColor: '#BDBDBD', backgroundColor: '#F5F5F5' } 
            }}
          >
            View All Entries
          </Button>
        </Box>
      )}
    </Paper>
  );

  const renderInsightsTab = () => <Insights entries={journalEntries} />;

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Typography variant="h4" fontWeight="bold" gutterBottom>Your Journal</Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>Record your thoughts, track your moods, and reflect on your mental wellness journey</Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 1, backgroundColor: '#F5F5F5', p: 0.5, borderRadius: '50px', width: 'fit-content' }}>
        {[
          { key: 'new', icon: NoteAddIcon, label: 'New Entry' },
          { key: 'past', icon: HistoryIcon, label: 'Past Entries' },
          { key: 'insights', icon: InsightsIcon, label: 'Insights' }
        ].map(tab => (
          <Button 
            key={tab.key} 
            variant={activeTab === tab.key ? 'contained' : 'text'} 
            startIcon={<tab.icon />} 
            onClick={() => handleTabChange(tab.key)} 
            sx={{ borderRadius: '50px' }}
          >
            {tab.label}
          </Button>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          {activeTab === 'new' && renderNewEntryTab()}
          {activeTab === 'past' && renderPastEntriesTab()}
          {activeTab === 'insights' && renderInsightsTab()}
        </Box>

        <Box sx={{ width: { xs: '100%', md: '300px' } }}>
          <Card sx={{ borderRadius: 2, mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LightbulbIcon sx={{ mr: 1, color: '#9061F9' }} />
                <Typography variant="h6" component="h3" fontWeight="bold">
                  Journaling Tips
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                Write freely without worrying about grammar or spelling.
              </Typography>
              <Typography variant="body2" paragraph>
                Try to write at the same time each day to build a habit.
              </Typography>
              <Typography variant="body2" gutterBottom>
                Include things you're grateful for in your entries.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LockIcon sx={{ mr: 1, color: '#9061F9' }} />
                <Typography variant="h6" component="h3" fontWeight="bold">
                  Privacy & Security
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                Your journal entries are end-to-end encrypted and only accessible to you. We take your privacy seriously.
              </Typography>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  bgcolor: '#EBF2FA', 
                  color: '#4B5563',
                  borderRadius: 1
                }}
              >
                <Typography variant="body2">
                  If you've enabled AI insights, your entries are processed anonymously to generate helpful patterns and observations.
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default JournalApp;
