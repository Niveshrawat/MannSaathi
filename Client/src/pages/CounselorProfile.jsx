import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import {
  PhotoCamera,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import Navbar from '../components/CommonComponents/Navbar';

const CounselorProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Clinical Psychology',
    experience: '8 years',
    education: 'Ph.D. in Clinical Psychology',
    bio: 'Experienced counselor specializing in anxiety and depression treatment. Certified in CBT and mindfulness techniques.',
    availability: 'Mon-Fri, 9 AM - 5 PM',
    languages: ['English', 'Spanish'],
    certifications: ['Licensed Clinical Psychologist', 'CBT Certified', 'Mindfulness Practitioner'],
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement API call to save profile
    setIsEditing(false);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">Profile</Typography>
            <Button
              variant="contained"
              startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* Profile Picture */}
            <Box sx={{ flex: '1 1 300px', textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 200,
                  height: 200,
                  margin: '0 auto',
                  mb: 2,
                }}
                src="/path-to-profile-image.jpg"
              />
              {isEditing && (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  sx={{ mt: 2 }}
                >
                  Upload Photo
                  <input hidden accept="image/*" type="file" />
                </Button>
              )}
            </Box>

            {/* Profile Information */}
            <Box sx={{ flex: '2 1 500px' }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label="Name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label="Phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label="Specialization"
                  name="specialization"
                  value={profile.specialization}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <TextField
                  sx={{ flex: '1 1 100%' }}
                  multiline
                  rows={4}
                  label="Bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label="Experience"
                  name="experience"
                  value={profile.experience}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label="Education"
                  name="education"
                  value={profile.education}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <TextField
                  sx={{ flex: '1 1 100%' }}
                  label="Availability"
                  name="availability"
                  value={profile.availability}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Languages
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {profile.languages.map((language) => (
                    <Chip key={language} label={language} />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Certifications
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {profile.certifications.map((cert) => (
                    <Chip key={cert} label={cert} />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default CounselorProfile; 