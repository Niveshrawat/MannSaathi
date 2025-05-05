import React, { useState, useEffect } from 'react';
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
  Skeleton,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { resourceAPI } from '../../services/api';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Fetch related resources
  useEffect(() => {
    const fetchRelatedResources = async () => {
      if (!resource) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Get resources with similar tags
        const response = await resourceAPI.getResources();
        const allResources = response.data.data;
        
        // Filter resources with similar tags (excluding the current resource)
        const similarResources = allResources
          .filter(r => r._id !== resource._id && r.tags && resource.tags && 
            r.tags.some(tag => resource.tags.includes(tag)))
          .slice(0, 3); // Get up to 3 related resources
        
        setRelatedItems(similarResources);
      } catch (err) {
        console.error('Error fetching related resources:', err);
        setError('Failed to load related resources.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRelatedResources();
  }, [resource]);
  
  // If no resource is provided, show a message
  if (!resource) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#fff' }}>
        <Alert severity="info">
          No resource selected. Please go back to the resource library.
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={onBack}
          sx={{ mt: 2 }}
        >
          Back to Resource Library
        </Button>
      </Container>
    );
  }

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
          <Typography color="text.primary">{resource.title}</Typography>
        </Breadcrumbs>
      </Box>

      {/* Article Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 600 }}>
          {resource.title}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          {/* Author info */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={resource.counselor?.profilePicture || '/api/placeholder/40/40'} 
              alt={resource.counselor?.name || 'Counselor'} 
              sx={{ mr: 1 }} 
            />
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#333' }}>
                {resource.counselor?.name || 'Counselor'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#666' }}>
                {resource.counselor?.specialization || 'Mental Health Professional'}
              </Typography>
            </Box>
          </Box>
          
          {/* Article meta */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon sx={{ fontSize: 18, color: '#666', mr: 0.5 }} />
              <Typography variant="caption" sx={{ color: '#666' }}>
                {resource.type === 'article' ? '5 min read' : 
                 resource.type === 'video' ? '10 min watch' : 
                 resource.type === 'podcast' ? '15 min listen' : 
                 '20 min exercise'}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#666' }}>
              {formatDate(resource.createdAt)}
            </Typography>
          </Box>
        </Box>
        
        {/* Tags */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          {resource.tags && resource.tags.map((tag, i) => (
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
        <div dangerouslySetInnerHTML={{ __html: resource.content }} />
      </Box>
      
      {/* Related Resources */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
          Related Resources
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: { xs: 'center', md: 'flex-start' }, mb: 4 }}>
          {isLoading ? (
            [...Array(3)].map((_, index) => (
              <Box key={index} sx={{ flex: '1 1 320px', maxWidth: 400, minWidth: 280, display: 'flex' }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Skeleton variant="rectangular" width={60} height={24} />
                      <Skeleton variant="rectangular" width={60} height={24} />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))
          ) : relatedItems.length > 0 ? (
            relatedItems.map((item) => (
              <Box key={item._id} sx={{ flex: '1 1 320px', maxWidth: 400, minWidth: 280, display: 'flex' }}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => onBack(item)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.description || 'No description available'}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {item.tags && item.tags.slice(0, 2).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            color: 'primary.main',
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))
          ) : (
            relatedResources.map((item, index) => (
              <Box key={index} sx={{ flex: '1 1 320px', maxWidth: 400, minWidth: 280, display: 'flex' }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Sample description for this resource.
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {item.tags.map((tag, i) => (
                        <Chip
                          key={i}
                          label={tag}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            color: 'primary.main',
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ResourceDetailPage;
