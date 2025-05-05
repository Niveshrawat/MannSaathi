import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Grid,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { Editor } from '@tinymce/tinymce-react';
import Navbar from '../components/CommonComponents/Navbar';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resourceAPI } from '../services/api';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const ResourceEditor = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
    isPublished: false
  });

  // Fetch resource data if editing an existing resource
  useEffect(() => {
    const fetchResource = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await resourceAPI.getResource(id);
        const resource = response.data.data;
        
        // Map the resource data to form fields
        setFormData({
          title: resource.title || '',
          content: resource.content || '',
          category: resource.category || resource.type ? resource.type.charAt(0).toUpperCase() + resource.type.slice(1) : '',
          tags: resource.tags || [],
          isPublished: resource.isPublished || false
        });
      } catch (err) {
        console.error('Error fetching resource:', err);
        setError('Failed to load resource. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResource();
  }, [id]);

  const handleChange = (e, fieldName) => {
    // Check if e is an event object or a direct value
    if (e && e.target) {
      // It's an event object from a form field
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      // It's a direct value (from TinyMCE editor)
      setFormData(prev => ({
        ...prev,
        [fieldName]: e
      }));
    }
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      // Prepare the resource data
      const resourceData = {
        ...formData,
        type: formData.category.toLowerCase(),
        category: formData.category, // Keep the category field
        description: formData.content.substring(0, 200) + '...' // Create a description from content
      };
      
      let response;
      
      if (id) {
        // Update existing resource
        response = await resourceAPI.updateResource(id, resourceData);
      } else {
        // Create new resource
        response = await resourceAPI.createResource(resourceData);
      }
      
      setSuccess(true);
      
      // Redirect to resources page after a short delay
      setTimeout(() => {
        navigate('/resources');
      }, 2000);
      
    } catch (err) {
      console.error('Error saving resource:', err);
      setError(err.response?.data?.message || 'Failed to save resource. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (!window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      await resourceAPI.deleteResource(id);
      
      setSuccess(true);
      
      // Redirect to resources page after a short delay
      setTimeout(() => {
        navigate('/resources');
      }, 2000);
      
    } catch (err) {
      console.error('Error deleting resource:', err);
      setError(err.response?.data?.message || 'Failed to delete resource. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.3)} 100%)`,
          minHeight: '100vh',
          py: 4,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
          >
            {/* Header Section */}
            <motion.div variants={itemVariants}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 4, 
                  mb: 4, 
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h4" gutterBottom fontWeight="bold">
                    {id ? 'Edit Resource' : 'Create Resource'}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {id ? 'Update your counseling resource' : 'Create and manage your counseling resources'}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>

            {error && (
              <motion.div variants={itemVariants}>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div variants={itemVariants}>
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  Resource saved successfully!
                </Alert>
              </motion.div>
            )}

            <motion.div variants={itemVariants} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 4, 
                  borderRadius: 2,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
                        <TextField
                          label="Title"
                          name="title"
                          value={formData.title}
                          onChange={(e) => handleChange(e, 'title')}
                          fullWidth
                          required
                          sx={{ flex: 1 }}
                        />
                        <FormControl sx={{ minWidth: { xs: '100%', md: '200px' } }}>
                          <InputLabel>Category</InputLabel>
                          <Select
                            name="category"
                            value={formData.category}
                            onChange={(e) => handleChange(e, 'category')}
                            required
                          >
                            <MenuItem value="Article">Article</MenuItem>
                            <MenuItem value="Video">Video</MenuItem>
                            <MenuItem value="Podcast">Podcast</MenuItem>
                            <MenuItem value="Exercise">Exercise</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <TextField
                          label="Add Tags"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          fullWidth
                          InputProps={{
                            endAdornment: (
                              <IconButton onClick={handleAddTag}>
                                <AddIcon />
                              </IconButton>
                            ),
                          }}
                        />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {formData.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              onDelete={() => handleDeleteTag(tag)}
                              sx={{ borderRadius: 2 }}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Content
                        </Typography>
                        <Box sx={{ flex: 1, minHeight: '400px' }}>
                          <Editor
                            apiKey="36gyf2ciqalcbb60jpj027zzxbumve468qlkkkzd0xjgqv1k"
                            value={formData.content}
                            onEditorChange={handleEditorChange}
                            init={{
                              height: '100%',
                              menubar: true,
                              plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'help', 'wordcount'
                              ],
                              toolbar: 'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                            }}
                          />
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 'auto' }}>
                        {id && (
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleDelete}
                            disabled={saving}
                          >
                            Delete
                          </Button>
                        )}
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<SaveIcon />}
                          disabled={saving}
                          sx={{ 
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            boxShadow: `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.39)}`,
                            '&:hover': {
                              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                            }
                          }}
                        >
                          {saving ? 'Saving...' : 'Save Resource'}
                        </Button>
                      </Box>
                    </Box>
                  </form>
                )}
              </Paper>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </>
  );
};

export default ResourceEditor; 