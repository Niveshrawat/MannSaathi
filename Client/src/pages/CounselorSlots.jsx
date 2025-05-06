import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Button, TextField, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../services/api';

const defaultForm = {
  date: '',
  startTime: '',
  endTime: '',
  sessionType: 'video',
  price: ''
};

const CounselorSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await api.get('/slots/my');
      setSlots(res.data.slots);
      setError(null);
    } catch (err) {
      setError('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlots(); }, []);

  const handleOpenDialog = (slot = null) => {
    if (slot) {
      setForm({
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        sessionType: slot.sessionType,
        price: slot.price
      });
      setEditId(slot._id);
    } else {
      setForm(defaultForm);
      setEditId(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setForm(defaultForm);
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/slots/${editId}`, form);
      } else {
        await api.post('/slots', form);
      }
      await fetchSlots();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save slot');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slot?')) return;
    setSaving(true);
    try {
      await api.delete(`/slots/${id}`);
      await fetchSlots();
    } catch (err) {
      setError('Failed to delete slot');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Manage My Slots</Typography>
      <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>Add Slot</Button>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slots.map(slot => (
                <TableRow key={slot._id}>
                  <TableCell>{slot.date}</TableCell>
                  <TableCell>{slot.startTime}</TableCell>
                  <TableCell>{slot.endTime}</TableCell>
                  <TableCell>{slot.sessionType}</TableCell>
                  <TableCell>{slot.price}</TableCell>
                  <TableCell>{slot.isBooked ? 'Booked' : 'Available'}</TableCell>
                  <TableCell>
                    {!slot.isBooked && (
                      <>
                        <IconButton onClick={() => handleOpenDialog(slot)}><Edit /></IconButton>
                        <IconButton onClick={() => handleDelete(slot._id)}><Delete /></IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{editId ? 'Edit Slot' : 'Add Slot'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
          <TextField label="Date" name="date" type="date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
          <TextField label="Start Time" name="startTime" type="time" value={form.startTime} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
          <TextField label="End Time" name="endTime" type="time" value={form.endTime} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
          <Select label="Session Type" name="sessionType" value={form.sessionType} onChange={handleChange} fullWidth>
            <MenuItem value="video">Video</MenuItem>
            <MenuItem value="chat">Chat</MenuItem>
          </Select>
          <TextField label="Price" name="price" type="number" value={form.price} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CounselorSlots; 