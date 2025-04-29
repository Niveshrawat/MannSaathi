import React, { useState } from 'react';
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
  Chip
} from '@mui/material';
import {
  NoteAdd as NoteAddIcon,
  History as HistoryIcon,
  Insights as InsightsIcon,
  LightbulbOutlined as LightbulbIcon,
  LockOutlined as LockIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import Insights from './Insights';

const JournalApp = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [mood, setMood] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalEntries, setJournalEntries] = useState([
    { id: 1, date: 'April 14, 2025', content: 'Today was a productive day at work. I managed to finish the project ahead of schedule...', mood: 'Happy' },
    { id: 2, date: 'April 13, 2025', content: "Feeling nervous about tomorrow's presentation. I've practiced multiple times but still...", mood: 'Anxious' },
    { id: 3, date: 'April 10, 2025', content: 'Just an ordinary day. Nothing special happened, but I did enjoy the evening walk...', mood: 'Neutral' }
  ]);

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleTabChange = tab => setActiveTab(tab);
  const handleMoodChange = e => setMood(e.target.value);
  const handleJournalContentChange = e => setJournalContent(e.target.value);
  const handleSaveEntry = () => {
    const newEntry = { id: Date.now(), date: today, content: journalContent, mood: mood || 'Neutral' };
    setJournalEntries([newEntry, ...journalEntries]);
    setJournalContent('');
    setMood('');
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
          <Typography variant="body2" gutterBottom>Date</Typography>
          <TextField fullWidth size="small" value={today} InputProps={{ readOnly: true }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" gutterBottom>How are you feeling?</Typography>
          <FormControl fullWidth size="small">
            <Select value={mood} onChange={handleMoodChange} displayEmpty renderValue={selected => selected || 'Select mood'}>
              <MenuItem value=""><em>Select mood</em></MenuItem>
              {['Happy','Calm','Anxious','Sad','Angry','Neutral','Excited'].map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Typography variant="body2" gutterBottom>Journal Entry</Typography>
      <TextField fullWidth multiline rows={10} placeholder="Write your thoughts..." value={journalContent} onChange={handleJournalContentChange} sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveEntry} sx={{ borderRadius: '50px', backgroundColor: '#A78BFA', '&:hover': { backgroundColor: '#9061F9' } }}>
          Save Entry
        </Button>
      </Box>
    </Paper>
  );

  const renderPastEntriesTab = () => (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Journal History</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>Review and reflect on your past entries</Typography>

      {journalEntries.map(entry => (
        <Box key={entry.id} sx={{ py: 2, borderBottom: '1px solid #f0f0f0', '&:last-child': { borderBottom: 'none' } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="medium">{entry.date}</Typography>
            <Chip label={entry.mood} size="small" sx={{ backgroundColor: entry.mood==='Happy'? '#E0F2F1' : entry.mood==='Anxious'? '#F3E5F5': entry.mood==='Neutral'? '#F5F5F5':'#E8EAF6', color: entry.mood==='Happy'? '#00897B': entry.mood==='Anxious'? '#9C27B0': entry.mood==='Neutral'? '#757575': '#3F51B5', borderRadius:'16px' }} />
          </Box>
          <Typography variant="body2" color="text.secondary">{entry.content}</Typography>
        </Box>
      ))}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button variant="outlined" sx={{ borderRadius: '50px', borderColor: '#E0E0E0', color: '#616161', '&:hover': { borderColor: '#BDBDBD', backgroundColor: '#F5F5F5' } }}>
          View All Entries
        </Button>
      </Box>
    </Paper>
  );

  const renderInsightsTab = () => <Insights entries={journalEntries} />;

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Your Journal</Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>Record your thoughts, track your moods, and reflect on your mental wellness journey</Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 1, backgroundColor: '#F5F5F5', p:0.5, borderRadius:'50px', width:'fit-content' }}>
        {[{key:'new',icon:NoteAddIcon,label:'New Entry'},{key:'past',icon:HistoryIcon,label:'Past Entries'},{key:'insights',icon:InsightsIcon,label:'Insights'}].map(tab=> (
          <Button key={tab.key} variant={activeTab===tab.key?'contained':'text'} startIcon={<tab.icon />} onClick={()=>handleTabChange(tab.key)} sx={{ borderRadius:'50px' }}>
            {tab.label}
          </Button>
        ))}
      </Box>

      <Box sx={{ display:'flex', flexDirection:{xs:'column',md:'row'}, gap:3 }}>
        <Box sx={{ flex:'2 1 auto' }}>
          {activeTab==='new' && renderNewEntryTab()}
          {activeTab==='past'&& renderPastEntriesTab()}
          {activeTab==='insights'&& renderInsightsTab()}
        </Box>
        
        <Box sx={{ flex: '1 1 auto', width: { xs: '100%', md: '33.33%' }, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LightbulbIcon sx={{ mr: 1, color: '#9061F9' }} />
                <Typography variant="h6" component="h3" fontWeight="bold">
                  Journaling Tips
                </Typography>
              </Box>
              
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2 }}>
                Be consistent:
              </Typography>
              <Typography variant="body2" gutterBottom>
                Try to write regularly, even if it's just for a few minutes.
              </Typography>
              
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2 }}>
                Be authentic:
              </Typography>
              <Typography variant="body2" gutterBottom>
                Write honestly about your thoughts and feelings.
              </Typography>
              
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2 }}>
                Reflect on patterns:
              </Typography>
              <Typography variant="body2" gutterBottom>
                Look for recurring themes or triggers in your entries.
              </Typography>
              
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2 }}>
                Practice gratitude:
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
