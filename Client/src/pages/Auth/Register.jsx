import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Link,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Paper,
    CircularProgress,
} from '@mui/material';
import { authAPI } from '../../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        specialization: '',
        experience: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Please enter your name');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Please enter your email');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.password) {
            setError('Please enter a password');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.role === 'counselor') {
            if (!formData.specialization.trim()) {
                setError('Please enter your specialization');
                return false;
            }
            if (!formData.experience) {
                setError('Please enter your years of experience');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = await authAPI.register({
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: formData.role,
                ...(formData.role === 'counselor' && {
                    specialization: formData.specialization.trim(),
                    experience: formData.experience,
                }),
            });

            if (response.data) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Redirect based on role
                if (response.data.user.role === 'counselor') {
                    navigate('/counselor-dashboard');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                        Register
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                            {error}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ flex: '1 1 100%', minWidth: 250 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Box>
                            <Box sx={{ flex: '1 1 100%', minWidth: 250 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Box>
                            <Box sx={{ flex: '1 1 100%', minWidth: 250 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                    helperText="Password must be at least 6 characters long"
                                />
                            </Box>
                            <Box sx={{ flex: '1 1 100%', minWidth: 250 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Box>
                            <Box sx={{ flex: '1 1 100%', minWidth: 250 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Role</InputLabel>
                                    <Select
                                        name="role"
                                        value={formData.role}
                                        label="Role"
                                        onChange={handleChange}
                                        disabled={loading}
                                    >
                                        <MenuItem value="user">User</MenuItem>
                                        <MenuItem value="counselor">Counselor</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            {formData.role === 'counselor' && (
                                <>
                                    <Box sx={{ flex: '1 1 100%', minWidth: 250 }}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Specialization"
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </Box>
                                    <Box sx={{ flex: '1 1 100%', minWidth: 250 }}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Years of Experience"
                                            name="experience"
                                            type="number"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </Box>
                                </>
                            )}
                            <Box sx={{ flex: '1 1 100%', minWidth: 250 }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                    size="large"
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Register'}
                                </Button>
                            </Box>
                            <Box sx={{ flex: '1 1 100%', minWidth: 250, display: 'flex', justifyContent: 'flex-end' }}>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register; 