import React from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';

// Mock data for related resources
const relatedResources = [
  {
    title: 'Mindfulness for Beginners',
    tags: ['Mindfulness'],
    time: '6 min read',
  },
  {
    title: 'Creating a Self-Care Routine',
    tags: ['Self-Care'],
    time: '8 min read',
  },
  {
    title: 'Understanding Panic Attacks',
    tags: ['Anxiety'],
    time: '7 min read',
  },
];

const ResourceDetailPage = ({ resource, onBack }) => {
  // If no resource is provided, use a default example
  const article = resource || {
    title: 'Understanding Anxiety in Everyday Life',
    tags: ['Anxiety', 'English'],
    time: '5 min read',
    description: 'Learn about common anxiety triggers and practical coping strategies that work well in Indian contexts.',
    language: 'English',
    type: 'article',
    author: {
      name: 'Dr. Priya Sharma',
      title: 'Clinical Psychologist',
      avatar: '/api/placeholder/40/40',
    },
    publishDate: 'February 25, 2025',
    views: '2.4K',
    likes: '342',
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#fff' }}>
      {/* Breadcrumbs Navigation */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink 
            component="button" 
            underline="hover" 
            color="inherit" 
            onClick={onBack}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ArrowBackIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Resource Library
          </MuiLink>
          <Typography color="text.primary">{article.title}</Typography>
        </Breadcrumbs>
      </Box>

      {/* Article Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 600 }}>
          {article.title}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          {/* Author info */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={article.author.avatar} alt={article.author.name} sx={{ mr: 1 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#333' }}>
                {article.author.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#666' }}>
                {article.author.title}
              </Typography>
            </Box>
          </Box>
          
          {/* Article meta */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon sx={{ fontSize: 18, color: '#666', mr: 0.5 }} />
              <Typography variant="caption" sx={{ color: '#666' }}>
                {article.time}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <VisibilityIcon sx={{ fontSize: 18, color: '#666', mr: 0.5 }} />
              <Typography variant="caption" sx={{ color: '#666' }}>
                {article.views} views
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#666' }}>
              {article.publishDate}
            </Typography>
          </Box>
        </Box>
        
        {/* Tags */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          {article.tags.map((tag, i) => (
            <Chip 
              key={i} 
              label={tag} 
              size="small"
              sx={{
                bgcolor: tag === 'English' || tag === 'Hindi' ? '#e0f7fa' : '#f3e5f5',
                color: tag === 'English' || tag === 'Hindi' ? '#00695c' : '#6a1b9a',
              }}
            />
          ))}
        </Box>
        
        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<BookmarkBorderIcon />}
            sx={{ 
              color: '#6a1b9a',
              borderColor: '#6a1b9a',
              '&:hover': { backgroundColor: '#f3e5f5', borderColor: '#6a1b9a' },
            }}
          >
            Save
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<ShareIcon />}
            sx={{ 
              color: '#6a1b9a',
              borderColor: '#6a1b9a',
              '&:hover': { backgroundColor: '#f3e5f5', borderColor: '#6a1b9a' },
            }}
          >
            Share
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<ThumbUpOutlinedIcon />}
            sx={{ 
              color: '#6a1b9a',
              borderColor: '#6a1b9a',
              '&:hover': { backgroundColor: '#f3e5f5', borderColor: '#6a1b9a' },
            }}
          >
            Like
          </Button>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      {/* Article Content */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="body1" paragraph sx={{ color: '#333', lineHeight: 1.7 }}>
          Anxiety is a natural response to stress and can be helpful in certain situations. However, when anxiety becomes overwhelming and interferes with daily activities, it may be a sign of an anxiety disorder. In the Indian context, anxiety often manifests with unique cultural influences and expressions that are important to recognize.
        </Typography>
        
        <Typography variant="h5" sx={{ color: '#333', fontWeight: 600, my: 3 }}>
          Common Anxiety Triggers in Everyday Life
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ color: '#333', lineHeight: 1.7 }}>
          Many everyday situations can trigger anxiety responses. Understanding these triggers is the first step toward managing them effectively. Some common anxiety triggers include:
        </Typography>
        
        <Box sx={{ pl: 3, mb: 3 }}>
          <Typography variant="body1" paragraph sx={{ color: '#333', lineHeight: 1.7 }}>
            <strong>1. Work and academic pressure:</strong> The competitive nature of professional and educational environments in India can create significant pressure to perform, leading to anxiety about meeting expectations.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ color: '#333', lineHeight: 1.7 }}>
            <strong>2. Social expectations:</strong> Family and community expectations around marriage, career choices, and lifestyle can create anxiety, especially when personal desires conflict with traditional expectations.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ color: '#333', lineHeight: 1.7 }}>
            <strong>3. Financial concerns:</strong> Economic insecurity, managing household expenses, and financial responsibilities can trigger anxiety for many people.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ color: '#333', lineHeight: 1.7 }}>
            <strong>4. Health worries:</strong> Concerns about personal health or the health of loved ones can lead to anxiety, especially in uncertain times.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ color: '#333', lineHeight: 1.7 }}>
            <strong>5. Information overload:</strong> Constant exposure to news and social media can overwhelm us with information and trigger anxiety responses.
          </Typography>
        </Box>
        
        <Typography variant="h5" sx={{ color: '#333', fontWeight: 600, my: 3 }}>
          Physical and Emotional Signs of Anxiety
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ color: '#333', lineHeight: 1.7 }}>
          Anxiety manifests through both physical and emotional symptoms. Being aware of these signs can help you identify when anxiety is affecting you:
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Card sx={{ flex: '1 1 calc(50% - 16px)', minWidth: 250 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#6a1b9a' }}>
                Physical Signs
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" sx={{ mb: 1 }}>Increased heart rate and palpitations</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Rapid breathing or shortness of breath</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Digestive issues and stomach discomfort</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Muscle tension and headaches</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Sleep disturbances and fatigue</Typography>
                <Typography component="li">Excessive sweating</Typography>
              </Box>
            </CardContent>
          </Card>
          
          <Card sx={{ flex: '1 1 calc(50% - 16px)', minWidth: 250 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#6a1b9a' }}>
                Emotional Signs
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" sx={{ mb: 1 }}>Persistent worry and restlessness</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Irritability and mood swings</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Difficulty concentrating</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Feeling overwhelmed or on edge</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Sense of impending danger</Typography>
                <Typography component="li">Avoidance behaviors</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Typography variant="h5" sx={{ color: '#333', fontWeight: 600, my: 3 }}>
          Practical Coping Strategies
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ color: '#333', lineHeight: 1.7 }}>
          Managing anxiety effectively involves developing healthy coping mechanisms that work for your individual situation. Here are some strategies that have proven effective across diverse Indian contexts:
        </Typography>
        
        <Typography variant="subtitle1" sx={{ color: '#6a1b9a', fontWeight: 600, mt: 3, mb: 1 }}>
          1. Mindfulness and Breathwork
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ color: '#333', lineHeight: 1.7 }}>
          Pranayama (breath control exercises) from yoga traditions can be particularly effective for managing anxiety. Simple practices like deep belly breathing, alternate nostril breathing (Nadi Shodhana), and the 4-7-8 breathing technique can activate your parasympathetic nervous system, creating a calming effect.
        </Typography>
        
        <Typography variant="subtitle1" sx={{ color: '#6a1b9a', fontWeight: 600, mt: 3, mb: 1 }}>
          2. Physical Movement
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ color: '#333', lineHeight: 1.7 }}>
          Regular physical activity helps reduce anxiety by releasing endorphins and reducing stress hormones. This could include yoga, walking in nature, dancing, or any form of exercise you enjoy. Even a brief 10-minute walk can provide immediate anxiety relief.
        </Typography>
        
        <Typography variant="subtitle1" sx={{ color: '#6a1b9a', fontWeight: 600, mt: 3, mb: 1 }}>
          3. Connection and Community
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ color: '#333', lineHeight: 1.7 }}>
          Social support is crucial for mental well-being. Sharing your concerns with trusted friends or family members can provide emotional relief and perspective. Community involvement, whether through religious groups, hobby clubs, or volunteer work, can also create a sense of belonging that counters anxiety.
        </Typography>
        
        <Typography variant="subtitle1" sx={{ color: '#6a1b9a', fontWeight: 600, mt: 3, mb: 1 }}>
          4. Establishing Healthy Boundaries
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ color: '#333', lineHeight: 1.7 }}>
          Learning to say "no" when necessary and setting clear boundaries with work, family, and social obligations is essential for managing anxiety. This includes digital boundaries, such as limiting news and social media consumption, particularly before bedtime.
        </Typography>
        
        <Typography variant="subtitle1" sx={{ color: '#6a1b9a', fontWeight: 600, mt: 3, mb: 1 }}>
          5. Professional Support
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ color: '#333', lineHeight: 1.7 }}>
          If anxiety is significantly impacting your daily life, seeking help from mental health professionals is important. Therapy approaches like Cognitive Behavioral Therapy (CBT) have strong evidence for treating anxiety disorders. Many therapists now offer online sessions, making mental healthcare more accessible across India.
        </Typography>
        
        <Box sx={{ bgcolor: '#f3e5f5', p: 3, borderRadius: 2, my: 4 }}>
          <Typography variant="h6" sx={{ color: '#6a1b9a', mb: 2 }}>
            Remember
          </Typography>
          <Typography variant="body1" sx={{ color: '#333' }}>
            Anxiety management is not one-size-fits-all. What works for someone else may not work for you. Be patient with yourself as you discover and practice the techniques that help you most effectively. Small, consistent steps toward managing anxiety can lead to significant improvements in overall wellbeing.
          </Typography>
        </Box>
        
        <Typography variant="h5" sx={{ color: '#333', fontWeight: 600, my: 3 }}>
          When to Seek Professional Help
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ color: '#333', lineHeight: 1.7 }}>
          While occasional anxiety is normal, it's important to recognize when professional help might be needed. Consider reaching out to a mental health professional if:
        </Typography>
        
        <Box component="ul" sx={{ pl: 4, mb: 3 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Your anxiety interferes with daily activities, work, or relationships
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            You experience panic attacks or intense, sudden fear
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Your anxiety is accompanied by depression or thoughts of self-harm
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            You're using alcohol, substances, or unhealthy behaviors to cope
          </Typography>
          <Typography component="li" variant="body1">
            Self-help strategies haven't improved your symptoms after several weeks
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.7 }}>
          Remember that seeking help is a sign of strength, not weakness. With proper support and management techniques, anxiety can be effectively treated, allowing you to lead a fulfilling, balanced life.
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      {/* Related Resources */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#333', fontWeight: 600 }}>
          Related Resources
        </Typography>
        
        <Grid container spacing={3}>
          {relatedResources.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: 2,
                boxShadow: 1,
                '&:hover': { boxShadow: 3 },
                border: '1px solid #e0e0e0',
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#333', fontSize: '1.1rem', mb: 2 }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                    {item.tags.map((tag, i) => (
                      <Typography
                        key={i}
                        variant="caption"
                        sx={{
                          bgcolor: '#f3e5f5',
                          color: '#6a1b9a',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        {tag}
                      </Typography>
                    ))}
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      {item.time}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Back to Library Button */}
      <Box sx={{ textAlign: 'center' }}>
        <Button 
          variant="contained" 
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
          sx={{ 
            bgcolor: '#6a1b9a',
            '&:hover': { bgcolor: '#4a148c' },
          }}
        >
          Back to Resource Library
        </Button>
      </Box>
    </Container>
  );
};

export default ResourceDetailPage;
