import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Container,
  MenuItem,
  Chip,
  IconButton,
  InputAdornment,
  Avatar,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArticleIcon from '@mui/icons-material/Article';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ResourceDetailPage from './ResourceDetailPage';
import { resourceAPI } from '../../services/api';

const ResourceLibrary = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [filteredResources, setFilteredResources] = useState([]);
  const [allResources, setAllResources] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState({});
  const [selectedResource, setSelectedResource] = useState(null);
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const isCounselor = user?.role === 'counselor';

  // Fetch resources from API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await resourceAPI.getResources();
        console.log('Resources response:', response);
        
        if (response.data && response.data.data) {
          const allResources = response.data.data;
          // Only show published resources in the public library
          const publishedResources = allResources.filter(resource => resource.isPublished);
          setAllResources(publishedResources);
          setFilteredResources(publishedResources);
        } else {
          console.error('Invalid response format:', response);
          setError('Failed to load resources. Invalid response format.');
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Get unique topics and languages for filters
  const getUniqueTags = () => {
    const allTags = allResources.flatMap(resource => 
      resource.tags || []
    );
    return [...new Set(allTags)];
  };

  // Filter resources when search query or filters change
  useEffect(() => {
    let results = [...allResources];
    
    // Filter by tab/type
    const tabTypes = ['article', 'video', 'podcast', 'exercise'];
    if (tabValue >= 0 && tabValue < tabTypes.length) {
      results = results.filter(item => item.type === tabTypes[tabValue]);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        item => 
          item.title.toLowerCase().includes(query) || 
          (item.description && item.description.toLowerCase().includes(query)) ||
          (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Filter by topic
    if (topicFilter && topicFilter !== 'all') {
      results = results.filter(item => 
        item.tags && item.tags.some(tag => tag.toLowerCase() === topicFilter.toLowerCase())
      );
    }
    
    // Filter by language
    if (languageFilter && languageFilter !== 'all') {
      results = results.filter(item => 
        item.tags && item.tags.includes(languageFilter)
      );
    }
    
    setFilteredResources(results);
  }, [searchQuery, topicFilter, languageFilter, tabValue, allResources]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleTopicChange = (event) => {
    setTopicFilter(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguageFilter(event.target.value);
  };

  const handleBookmark = (resourceId) => {
    setBookmarkedItems(prev => ({
      ...prev,
      [resourceId]: !prev[resourceId]
    }));
  };

  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
    setShowDetailPage(true);
  };

  const handleBackToLibrary = () => {
    setShowDetailPage(false);
    setSelectedResource(null);
  };

  if (showDetailPage && selectedResource) {
    return <ResourceDetailPage resource={selectedResource} onBack={handleBackToLibrary} />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#fff' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 600 }}>
          Resource Library
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Explore articles, videos, podcasts, and exercises to support your mental health journey
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        mb: 4,
        flexWrap: { xs: 'wrap', md: 'nowrap' }
      }}>
        <TextField
          placeholder="Search resources..."
          variant="outlined"
          fullWidth
          sx={{ 
            flex: { xs: '1 1 100%', md: '1 1 50%' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#666' }} />
              </InputAdornment>
            ),
          }}
          value={searchQuery}
          onChange={handleSearchChange}
        />
        
        <TextField
          select
          value={topicFilter}
          onChange={handleTopicChange}
          variant="outlined"
          sx={{ 
            minWidth: { xs: '100%', md: '200px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
          SelectProps={{
            displayEmpty: true,
            IconComponent: KeyboardArrowDownIcon,
            renderValue: (value) => value === 'all' ? 'Filter by topic' : value
          }}
        >
          <MenuItem value="all">All topics</MenuItem>
          {getUniqueTags().map((tag) => (
            <MenuItem key={tag} value={tag}>{tag}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          value={languageFilter}
          onChange={handleLanguageChange}
          variant="outlined"
          sx={{ 
            minWidth: { xs: '100%', md: '200px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
          SelectProps={{
            displayEmpty: true,
            IconComponent: KeyboardArrowDownIcon,
            renderValue: (value) => value === 'all' ? 'Filter by language' : value
          }}
        >
          <MenuItem value="all">All languages</MenuItem>
          <MenuItem value="English">English</MenuItem>
          <MenuItem value="Hindi">Hindi</MenuItem>
        </TextField>
      </Box>

      {/* Category Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          mb: 4,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '1rem',
            minWidth: 'auto',
            px: 3,
            color: '#666',
          },
          '& .Mui-selected': {
            color: '#6a1b9a',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#6a1b9a',
          },
        }}
      >
        <Tab icon={<ArticleIcon />} label="Articles" iconPosition="start" />
        <Tab icon={<VideocamIcon />} label="Videos" iconPosition="start" />
        <Tab icon={<MicIcon />} label="Podcasts" iconPosition="start" />
        <Tab icon={<FitnessCenterIcon />} label="Exercises" iconPosition="start" />
      </Tabs>

      {/* Resource Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: { xs: 'center', md: 'flex-start' }, alignItems: 'stretch' }}>
        {filteredResources.map((resource) => (
          <Box
            key={resource._id}
            sx={{
              flex: '1 1 340px',
              maxWidth: 360,
              minWidth: 320,
              display: 'flex',
              alignItems: 'stretch',
            }}
          >
            <Card
              sx={{
                width: '100%',
                height: 340,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
                ...(isCounselor && !resource.isPublished && {
                  border: '1px dashed #666',
                  backgroundColor: '#fafafa'
                })
              }}
              onClick={() => handleResourceClick(resource)}
            >
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ color: '#333' }}>
                      {resource.title}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(resource._id);
                      }}
                    >
                      {bookmarkedItems[resource._id] ? (
                        <BookmarkIcon sx={{ color: '#6a1b9a' }} />
                      ) : (
                        <BookmarkBorderIcon />
                      )}
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={resource.counselor?.profilePicture}
                      alt={resource.counselor?.name}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {resource.counselor?.name || 'Anonymous'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {resource.tags && resource.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{
                          bgcolor: tag === 'English' || tag === 'Hindi' ? '#e0f7fa' : '#f3e5f5',
                          color: tag === 'English' || tag === 'Hindi' ? '#00695c' : '#6a1b9a',
                          borderRadius: '16px',
                        }}
                      />
                    ))}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} component="div">
                    <div dangerouslySetInnerHTML={{ __html: resource.description }} />
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />
                    <Typography variant="body2" color="text.secondary">
                      {resource.type === 'article' ? '5 min read' :
                        resource.type === 'video' ? '10 min watch' :
                        resource.type === 'podcast' ? '15 min listen' :
                        '20 min exercise'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <VisibilityIcon sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />
                    <Typography variant="body2" color="text.secondary">
                      {Math.floor(Math.random() * 2000 + 500)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default ResourceLibrary;