import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Message from './Message';

jest.mock('axios');

test('renders the message from the backend', async () => {
  axios.get.mockResolvedValue({ data: { message: 'Hello from backend!' } });

  render(<Message />);

  const messageElement = await waitFor(() => screen.getByText(/Hello from backend!/i));
  expect(messageElement).toBeInTheDocument();
});

test('handles backend error gracefully', async () => {
  axios.get.mockRejectedValue(new Error('Backend is down'));

  render(<Message />);

  const errorElement = await waitFor(() => screen.getByText(/Error fetching data/i));
  expect(errorElement).toBeInTheDocument();
});