import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { resourceAPI } from '../../services/api';
import Navbar from '../CommonComponents/Navbar';
import Footer from '../CommonComponents/Footer';

const MyResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const navigate = useNavigate();

  // Add loading state for publish/unpublish
  const [publishLoading, setPublishLoading] = useState({});

  // Fetch counselor's resources
  useEffect(() => {
    fetchMyResources();
  }, []);

  const fetchMyResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await resourceAPI.getMyResources();
      setResources(response.data.data);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load your resources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resourceId) => {
    navigate(`/resources/edit/${resourceId}`);
  };

  const handleDelete = async () => {
    if (!resourceToDelete) return;

    try {
      await resourceAPI.deleteResource(resourceToDelete);
      setResources(resources.filter(r => r._id !== resourceToDelete));
      setDeleteDialogOpen(false);
      setResourceToDelete(null);
    } catch (err) {
      console.error('Error deleting resource:', err);
      setError('Failed to delete resource. Please try again.');
    }
  };

  const confirmDelete = (resourceId) => {
    setResourceToDelete(resourceId);
    setDeleteDialogOpen(true);
  };

  const handlePublishToggle = async (resourceId, currentStatus) => {
    try {
      setPublishLoading(prev => ({ ...prev, [resourceId]: true }));
      
      const updatedResource = await resourceAPI.updateResource(resourceId, {
        isPublished: !currentStatus
      });

      // Update the resources list with the updated resource
      setResources(resources.map(resource => 
        resource._id === resourceId ? updatedResource.data.data : resource
      ));

      // Show success message (you can add a toast/snackbar here)
      console.log(`Resource ${currentStatus ? 'unpublished' : 'published'} successfully`);
    } catch (err) {
      console.error('Error toggling publish status:', err);
      setError(`Failed to ${currentStatus ? 'unpublish' : 'publish'} resource. Please try again.`);
    } finally {
      setPublishLoading(prev => ({ ...prev, [resourceId]: false }));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4, minHeight: '80vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            My Resources
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/resources/create')}
            sx={{
              backgroundColor: '#6a1b9a',
              '&:hover': { backgroundColor: '#4a148c' }
            }}
          >
            Create New Resource
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Flexbox layout for resource cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: { xs: 'center', md: 'flex-start' }, alignItems: 'stretch' }}>
          {resources.map((resource) => (
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
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                  ...(!resource.isPublished && {
                    border: '1px dashed #666',
                    backgroundColor: '#fafafa'
                  })
                }}
              >
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h2" sx={{ color: '#333' }}>
                        {resource.title}
                      </Typography>
                      <Box>
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(resource._id);
                          }}
                          sx={{ color: '#6a1b9a' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(resource._id);
                          }}
                          sx={{ color: '#d32f2f' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      <Chip 
                        label={resource.type}
                        size="small"
                        sx={{
                          bgcolor: '#f3e5f5',
                          color: '#6a1b9a',
                        }}
                      />
                      {resource.tags?.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: '#e3f2fd',
                            color: '#1976d2',
                          }}
                        />
                      ))}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} component="div">
                      <div dangerouslySetInnerHTML={{ __html: resource.description }} />
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </Typography>
                    <Button
                      variant={resource.isPublished ? "outlined" : "contained"}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePublishToggle(resource._id, resource.isPublished);
                      }}
                      disabled={publishLoading[resource._id]}
                      sx={{
                        minWidth: '100px',
                        color: resource.isPublished ? '#2e7d32' : '#fff',
                        backgroundColor: resource.isPublished ? 'transparent' : '#2e7d32',
                        borderColor: '#2e7d32',
                        '&:hover': {
                          backgroundColor: resource.isPublished ? '#e8f5e9' : '#1b5e20',
                          borderColor: '#2e7d32',
                        }
                      }}
                    >
                      {publishLoading[resource._id] ? (
                        <CircularProgress size={20} />
                      ) : (
                        resource.isPublished ? 'Unpublish' : 'Publish'
                      )}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Resource</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this resource? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </>
  );
};

export default MyResources; 