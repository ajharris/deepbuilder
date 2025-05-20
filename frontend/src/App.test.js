import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';
import axios from 'axios';
import { act } from 'react';

jest.mock('axios');

// Mock window.alert to avoid JSDOM errors
beforeAll(() => {
  window.alert = jest.fn();
});

// Ensure axios mock is reset before each test
beforeEach(() => {
  jest.clearAllMocks();
  axios.get.mockResolvedValue({ data: { message: 'Hello from backend!' } });
});

test('renders data from backend', async () => {
  axios.get.mockResolvedValue({ data: { message: 'Hello from Flask!' } });

  await act(async () => {
    render(<App />);
  });

  const messageElement = await screen.findByText(/Hello from Flask!/i);
  expect(messageElement).toBeInTheDocument();
});

test('handles backend error gracefully', async () => {
  axios.get.mockRejectedValue(new Error('Backend is down'));

  await act(async () => {
    render(<App />);
  });

  const errorElement = await screen.findByText(/Error fetching data/i);
  expect(errorElement).toBeInTheDocument();
});

test('renders the form with all input fields', async () => {
  await act(async () => {
    render(<App />);
  });

  expect(screen.getByLabelText(/model type/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/loss function/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/optimizer/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/learning rate/i)).toBeInTheDocument();
});

test('updates form state on input change', async () => {
  await act(async () => {
    render(<App />);
  });

  const optimizerSelect = screen.getByLabelText(/optimizer/i);
  fireEvent.change(optimizerSelect, { target: { value: 'Adam' } });
  expect(optimizerSelect.value).toBe('Adam');
});

test('shows error messages for invalid inputs', async () => {
  await act(async () => {
    render(<App />);
  });

  const submitButton = screen.getByText(/submit/i);
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(/Model type is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Loss function is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Optimizer is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Learning rate must be a valid number/i)).toBeInTheDocument();
  });
});

test('submits the form with valid inputs', async () => {
  axios.post.mockResolvedValueOnce({ data: { success: true } });

  await act(async () => {
    render(<App />);
  });

  fireEvent.change(screen.getByLabelText(/model type/i), { target: { value: 'CNN' } });
  fireEvent.change(screen.getByLabelText(/loss function/i), { target: { value: 'CrossEntropy' } });
  fireEvent.change(screen.getByLabelText(/optimizer/i), { target: { value: 'Adam' } });
  fireEvent.change(screen.getByLabelText(/learning rate/i), { target: { value: '0.001' } });

  fireEvent.click(screen.getByText(/submit/i));

  await waitFor(() =>
    expect(axios.post).toHaveBeenCalledWith('/api/submit', {
      modelType: 'CNN',
      lossFunction: 'CrossEntropy',
      optimizer: 'Adam',
      learningRate: '0.001',
    })
  );

  expect(window.alert).toHaveBeenCalledWith("Form submitted successfully!");
  // Remove if "submission successful" isn't actually shown in UI
  // expect(screen.getByText(/submission successful/i)).toBeInTheDocument();
});

test('updates shared state after form submission', async () => {
  axios.post.mockResolvedValue({ data: { success: true } });

  const mockSharedState = jest.fn();
  // Replace this with actual dependency injection if App expects a prop
  await act(async () => {
    render(<App setSharedState={mockSharedState} />);
  });
  
  const messageElement = await screen.findByText(/Hello from backend!/i);
  expect(messageElement).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/model type/i), { target: { value: 'RNN' } });
  fireEvent.change(screen.getByLabelText(/loss function/i), { target: { value: 'MSE' } });
  fireEvent.change(screen.getByLabelText(/optimizer/i), { target: { value: 'SGD' } });
  fireEvent.change(screen.getByLabelText(/learning rate/i), { target: { value: '0.01' } });

  fireEvent.click(screen.getByText(/submit/i));

  await waitFor(() => {
    expect(mockSharedState).toHaveBeenCalledWith({
      modelType: 'RNN',
      lossFunction: 'MSE',
      optimizer: 'SGD',
      learningRate: '0.01',
    });
  });
});

test('renders training progress from backend', async () => {
  axios.get.mockImplementation((url) => {
    if (url === '/api/training_progress') {
      return Promise.resolve({ data: { current_epoch: 3, total_epochs: 10, loss: 0.123 } });
    }
    return Promise.resolve({ data: { message: 'Hello from backend!' } });
  });

  await act(async () => {
    render(<App />);
  });

  expect(await screen.findByText(/Training Progress/i)).toBeInTheDocument();
  expect(await screen.findByText(/Current Epoch: 3/i)).toBeInTheDocument();
  expect(await screen.findByText(/Total Epochs: 10/i)).toBeInTheDocument();
  expect(await screen.findByText(/Loss: 0.123/i)).toBeInTheDocument();
});

test('shows error if training progress cannot be fetched', async () => {
  axios.get.mockImplementation((url) => {
    if (url === '/api/training_progress') {
      return Promise.reject(new Error('Network error'));
    }
    return Promise.resolve({ data: { message: 'Hello from backend!' } });
  });

  await act(async () => {
    render(<App />);
  });

  expect(await screen.findByText(/Could not fetch training progress/i)).toBeInTheDocument();
});
