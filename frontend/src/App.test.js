import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

// Ensure axios mock is reset before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Mock axios responses
axios.get.mockResolvedValueOnce({ data: { message: 'Hello from backend!' } });
axios.get.mockRejectedValueOnce(new Error('Backend is down'));

test('renders data from backend', async () => {
  axios.get.mockResolvedValue({ data: { message: 'Hello from Flask!' } });

  render(<App />);

  const messageElement = await waitFor(() => screen.getByText(/Hello from Flask!/i));
  expect(messageElement).toBeInTheDocument();
});

test('handles backend error gracefully', async () => {
  axios.get.mockRejectedValue(new Error('Backend is down'));

  render(<App />);

  const errorElement = await waitFor(() => screen.getByText(/Error fetching data/i));
  expect(errorElement).toBeInTheDocument();
});
