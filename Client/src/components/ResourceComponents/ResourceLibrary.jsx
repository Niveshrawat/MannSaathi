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
  Grid,
  IconButton,
  InputAdornment,
  Divider,
  Skeleton,
  Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArticleIcon from '@mui/icons-material/Article';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ResourceDetailPage from './ResourceDetailPage';
const resources = [
    {
      id: 1,
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
    },
    {
      id: 2,
      title: 'तनाव प्रबंधन के लिए योग तकनीक',
      tags: ['Stress', 'Hindi'],
      time: '8 min read',
      description: 'जानें कि जीवन में योग और प्राणायाम के माध्यम से तनाव को कैसे कम करें और मानसिक शांति प्राप्त करें।',
      language: 'Hindi',
      type: 'article',
      author: {
        name: 'योगेश पाठक',
        title: 'योग प्रशिक्षक',
        avatar: '/api/placeholder/40/40',
      },
      publishDate: 'January 12, 2025',
      views: '1.8K',
      likes: '256',
    },
    {
      id: 3,
      title: 'Building Resilience in Uncertain Times',
      tags: ['Resilience', 'English'],
      time: '7 min read',
      description: "Practical steps to strengthen your emotional resilience during life's challenges and setbacks.",
      language: 'English',
      type: 'article',
      author: {
        name: 'Dr. Raj Mehta',
        title: 'Psychiatrist',
        avatar: '/api/placeholder/40/40',
      },
      publishDate: 'March 5, 2025',
      views: '1.5K',
      likes: '189',
    },
    {
      id: 4,
      title: 'Mindfulness for Beginners',
      tags: ['Mindfulness', 'English'],
      time: '6 min watch',
      description: 'Simple mindfulness practices that can be incorporated into your daily routine to improve mental well-being.',
      language: 'English',
      type: 'video',
      author: {
        name: 'Alisha Khurana',
        title: 'Mindfulness Coach',
        avatar: '/api/placeholder/40/40',
      },
      publishDate: 'February 18, 2025',
      views: '3.2K',
      likes: '427',
    },
    {
      id: 5,
      title: 'परीक्षा के तनाव से निपटने के उपाय',
      tags: ['Student Mental Health', 'Hindi'],
      time: '10 min listen',
      description: 'जानें कि परीक्षा के दौरान तनाव को प्रभावी तरीके से कैसे प्रबंधित करें और आत्मविश्वास बढ़ाएं।',
      language: 'Hindi',
      type: 'podcast',
      author: {
        name: 'अनिल वर्मा',
        title: 'शैक्षिक मनोवैज्ञानिक',
        avatar: '/api/placeholder/40/40',
      },
      publishDate: 'January 30, 2025',
      views: '2.1K',
      likes: '315',
    },
    {
      id: 6,
      title: 'Supporting a Loved One With Depression',
      tags: ['Depression', 'English'],
      time: '9 min read',
      description: 'How to recognize signs of depression and provide effective support to friends and family members.',
      language: 'English',
      type: 'article',
      author: {
        name: 'Dr. Sneha Desai',
        title: 'Clinical Psychologist',
        avatar: '/api/placeholder/40/40',
      },
      publishDate: 'March 12, 2025',
      views: '1.9K',
      likes: '278',
    },
    {
      id: 7,
      title: 'Beginner Yoga for Mental Health',
      tags: ['Yoga', 'English'],
      time: '12 min exercise',
      description: 'A gentle yoga routine specifically designed to reduce anxiety and improve mental clarity.',
      language: 'English',
      type: 'exercise',
      author: {
        name: 'Maya Patel',
        title: 'Yoga Instructor',
        avatar: '/api/placeholder/40/40',
      },
      publishDate: 'February 8, 2025',
      views: '2.7K',
      likes: '382',
    },
    {
      id: 8,
      title: 'The Science of Sleep and Mental Health',
      tags: ['Sleep', 'English'],
      time: '15 min listen',
      description: 'Understanding how sleep affects your mental health and practical tips for better sleep hygiene.',
      language: 'English',
      type: 'podcast',
      author: {
        name: 'Dr. Karan Malhotra',
        title: 'Neuropsychologist',
        avatar: '/api/placeholder/40/40',
      },
      publishDate: 'March 2, 2025',
      views: '1.6K',
      likes: '203',
    },
  ];

const ResourceLibrary = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [filteredResources, setFilteredResources] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showDetailPage, setShowDetailPage] = useState(false);

  // Get unique topics and languages for filters
  const getUniqueTags = () => {
    const allTags = resources.flatMap(resource => 
      resource.tags.filter(tag => tag !== 'English' && tag !== 'Hindi')
    );
    return [...new Set(allTags)];
  };
  
  const getUniqueLanguages = () => {
    return [...new Set(resources.map(resource => resource.language))];
  };

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFilteredResources(resources);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter resources when search query or filters change
  useEffect(() => {
    let results = [...resources];
    
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
          item.description.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by topic
    if (topicFilter && topicFilter !== 'all') {
      results = results.filter(item => 
        item.tags.some(tag => tag.toLowerCase() === topicFilter.toLowerCase())
      );
    }
    
    // Filter by language
    if (languageFilter && languageFilter !== 'all') {
      results = results.filter(item => 
        item.language.toLowerCase() === languageFilter.toLowerCase()
      );
    }
    
    setFilteredResources(results);
  }, [searchQuery, topicFilter, languageFilter, tabValue]);

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
    window.scrollTo(0, 0);
  };

  const handleBackToLibrary = () => {
    setShowDetailPage(false);
    setSelectedResource(null);
  };

  // Helper function to get tab icon
  const getTabIcon = (index) => {
    switch(index) {
      case 0: return <ArticleIcon sx={{ mr: 1 }} />;
      case 1: return <VideocamIcon sx={{ mr: 1 }} />;
      case 2: return <MicIcon sx={{ mr: 1 }} />;
      case 3: return <FitnessCenterIcon sx={{ mr: 1 }} />;
      default: return null;
    }
  };

  // Render loading skeletons
  const renderSkeletons = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {[...Array(6)].map((_, index) => (
        <Box key={index} sx={{ flex: '1 1 300px', minWidth: '280px', maxWidth: { xs: '100%', sm: '45%', md: '30%' } }}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Skeleton variant="text" height={30} width="80%" />
              <Box sx={{ display: 'flex', gap: 1, my: 2 }}>
                <Skeleton variant="rounded" width={70} height={24} />
                <Skeleton variant="rounded" width={60} height={24} />
              </Box>
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} width="60%" />
              <Skeleton variant="rounded" height={36} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );

  if (showDetailPage && selectedResource) {
    return <ResourceDetailPage resource={selectedResource} onBack={handleBackToLibrary} />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#fff' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 600 }}>
          Resource Library
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Explore articles, videos, podcasts, and exercises to support your mental health journey
        </Typography>
      </Box>

      {/* Search and Filters - Using Flex */}
      <Box 
        sx={{ 
          mb: 4, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2,
          width: '100%'
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search resources..."
          size="small"
          sx={{ flex: { xs: '1 1 100%', sm: '1 1 50%' } }}
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#6a1b9a' }} />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flex: { xs: '1 1 100%', sm: '0 1 auto' },
          flexWrap: { xs: 'wrap', sm: 'nowrap' } 
        }}>
          <TextField
            variant="outlined"
            select
            value={topicFilter}
            size="small"
            sx={{ 
              flex: { xs: '1 1 calc(50% - 8px)', sm: '0 1 150px' },
              minWidth: { xs: 'calc(50% - 8px)', sm: '150px' } 
            }}
            onChange={handleTopicChange}
            SelectProps={{ 
              renderValue: value => value === 'all' ? "Filter by topic" : value
            }}
          >
            <MenuItem value="all">All topics</MenuItem>
            {getUniqueTags().map((topic) => (
              <MenuItem key={topic} value={topic}>
                {topic}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            variant="outlined"
            select
            value={languageFilter}
            size="small"
            sx={{ 
              flex: { xs: '1 1 calc(50% - 8px)', sm: '0 1 150px' },
              minWidth: { xs: 'calc(50% - 8px)', sm: '150px' } 
            }}
            onChange={handleLanguageChange}
            SelectProps={{ 
              renderValue: value => value === 'all' ? "Filter by language" : value
            }}
          >
            <MenuItem value="all">All languages</MenuItem>
            {getUniqueLanguages().map((language) => (
              <MenuItem key={language} value={language}>
                {language}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      {/* Category Tabs with Icons */}
      <Box sx={{ mb: 4, width: '100%', overflowX: 'auto' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="resource categories"
          sx={{
            minWidth: 'max-content',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              minWidth: 'auto',
              px: { xs: 2, sm: 3 }
            },
            '& .Mui-selected': {
              color: '#6a1b9a',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#6a1b9a',
            },
          }}
        >
          <Tab icon={getTabIcon(0)} label="Articles" iconPosition="start" />
          <Tab icon={getTabIcon(1)} label="Videos" iconPosition="start" />
          <Tab icon={getTabIcon(2)} label="Podcasts" iconPosition="start" />
          <Tab icon={getTabIcon(3)} label="Exercises" iconPosition="start" />
        </Tabs>
      </Box>

      {/* Resource Cards with Flex instead of Grid */}
      {isLoading ? (
        renderSkeletons()
      ) : filteredResources.length > 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          width: '100%' 
        }}>
          {filteredResources.map((resource) => (
            <Box 
              key={resource.id} 
              sx={{ 
                flex: '1 1 300px',
                minWidth: '280px',
                maxWidth: { xs: '100%', sm: '45%', md: '30%' }
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  boxShadow: 1,
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { 
                    boxShadow: 3,
                    transform: 'translateY(-4px)',
                  },
                  cursor: 'pointer',
                }}
                onClick={() => handleResourceClick(resource)}
              >
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  height: '100%',
                  p: 3 
                }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mb: 2, 
                      alignItems: 'flex-start' 
                    }}>
                      <Typography variant="h6" sx={{ 
                        color: '#333', 
                        fontSize: '1.1rem', 
                        fontWeight: 500, 
                        lineHeight: 1.3,
                        flex: '1 1 auto'
                      }}>
                        {resource.title}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(resource.id);
                        }}
                        sx={{ color: '#6a1b9a', p: 0, flex: '0 0 auto' }}
                      >
                        {bookmarkedItems[resource.id] ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </IconButton>
                    </Box>
                    
                    {/* Author info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={resource.author.avatar} alt={resource.author.name} sx={{ width: 24, height: 24, mr: 1 }} />
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {resource.author.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      mb: 2, 
                      flexWrap: 'wrap', 
                      alignItems: 'center' 
                    }}>
                      {resource.tags.map((tag, i) => (
                        <Chip
                          key={i}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: tag === 'English' || tag === 'Hindi' ? '#e0f7fa' : '#f3e5f5',
                            color: tag === 'English' || tag === 'Hindi' ? '#00695c' : '#6a1b9a',
                            fontSize: '0.75rem',
                            height: '24px',
                          }}
                        />
                      ))}
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: { xs: 1, sm: 2 }, 
                      mb: 2, 
                      alignItems: 'center' 
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: '#666', mr: 0.5 }} />
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {resource.time}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <VisibilityIcon sx={{ fontSize: 16, color: '#666', mr: 0.5 }} />
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {resource.views}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" sx={{ 
                      color: '#666', 
                      mb: 3, 
                      flex: '1 1 auto' 
                    }}>
                      {resource.description}
                    </Typography>
                  </Box>
                  
                  <Button
                    variant="outlined"
                    sx={{
                      color: '#6a1b9a',
                      borderColor: '#6a1b9a',
                      textTransform: 'none',
                      width: '100%',
                      mt: 'auto',
                      '&:hover': { backgroundColor: '#f3e5f5', borderColor: '#6a1b9a' },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResourceClick(resource);
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          py: 6 
        }}>
          <Typography variant="h6" sx={{ color: '#666' }}>
            No resources found matching your filters.
          </Typography>
          <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
            Try adjusting your search or filters to see more content.
          </Typography>
          <Button
            variant="outlined"
            sx={{
              color: '#6a1b9a',
              borderColor: '#6a1b9a',
              textTransform: 'none',
              mt: 3,
              '&:hover': { backgroundColor: '#f3e5f5', borderColor: '#6a1b9a' },
            }}
            onClick={() => {
              setSearchQuery('');
              setTopicFilter('all');
              setLanguageFilter('all');
              setTabValue(0);
            }}
          >
            Clear Filters
          </Button>
        </Box>
      )}

      {/* Load More Button - Only show if there are filtered results */}
      {filteredResources.length > 0 && filteredResources.length >= 6 && (
        <Box sx={{ 
          mt: 4, 
          display: 'flex', 
          justifyContent: 'center' 
        }}>
          <Button
            variant="outlined"
            sx={{
              color: '#6a1b9a',
              borderColor: '#6a1b9a',
              textTransform: 'none',
              px: 4,
              '&:hover': { backgroundColor: '#f3e5f5', borderColor: '#6a1b9a' },
            }}
          >
            Load More Resources
          </Button>
        </Box>
      )}
      
      {/* Summary section at bottom */}
      {filteredResources.length > 0 && (
        <Box sx={{ 
          mt: 6, 
          pt: 3, 
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Showing {filteredResources.length} resources
            {topicFilter !== 'all' && ` in ${topicFilter}`}
            {languageFilter !== 'all' && ` (${languageFilter})`}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ResourceLibrary;