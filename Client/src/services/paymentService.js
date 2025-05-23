import api from './api';

export const processPayment = async (amount, bookingId, isExtension = false, extensionOptionIndex = null) => {
  try {
    const response = await api.post('/payments/process', {
      amount,
      bookingId,
      currency: 'USD',
      isExtension,
      extensionOptionIndex
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