import api from './api';

export const processPayment = async (amount, bookingId) => {
  try {
    const response = await api.post('/payments/process', {
      amount,
      bookingId,
      currency: 'USD'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Payment processing failed' };
  }
};

export const verifyPayment = async (paymentId) => {
  try {
    const response = await api.get(`/payments/verify/${paymentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Payment verification failed' };
  }
}; 