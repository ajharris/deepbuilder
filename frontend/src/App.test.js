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
  axios.get.mockImplementation((url) => {
    if (url === '/api/parameter-options') {
      return Promise.resolve({ data: {
        modelTypes: ['CNN', 'RNN', 'UNet', 'ResNet', 'Transformer'],
        lossFunctions: ['CrossEntropy', 'MSE', 'MAE', 'Dice', 'BCEWithLogits'],
        optimizers: ['Adam', 'SGD', 'RMSprop', 'Adagrad', 'AdamW'],
      }});
    }
    if (url === '/api/hello') {
      return Promise.resolve({ data: { message: 'Hello from backend!' } });
    }
    if (url === '/api/training_progress') {
      return Promise.resolve({ data: { current_epoch: 1, total_epochs: 5, loss: 0.1 } });
    }
    // fallback for other GETs
    return Promise.resolve({ data: {} });
  });
  axios.post.mockResolvedValue({ data: { success: true } });
});

afterEach(() => {
  jest.clearAllMocks();
});

const customRender = async (ui, options) => {
  let result;
  await act(async () => {
    result = render(ui, options);
  });
  return result;
};

test('renders data from backend', async () => {
  axios.get.mockResolvedValue({ data: { message: 'Hello from Flask!' } });

  await customRender(<App />);

  const messageElement = await screen.findByText(/Hello from Flask!/i);
  expect(messageElement).toBeInTheDocument();
});

test('handles backend error gracefully', async () => {
  axios.get.mockRejectedValue(new Error('Backend is down'));

  await customRender(<App />);

  const errorElement = await screen.findByText(/Error fetching data/i);
  expect(errorElement).toBeInTheDocument();
});

test('renders the form with all input fields', async () => {
  await customRender(<App />);

  expect(screen.getByLabelText(/model type/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/loss function/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/optimizer/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/learning rate/i)).toBeInTheDocument();
});

test('updates optimizer field correctly', async () => {
  await customRender(<App />);

  const optimizerSelect = screen.getByLabelText(/optimizer/i);
  fireEvent.change(optimizerSelect, { target: { value: 'Adam' } });
  expect(optimizerSelect.value).toBe('Adam');
});

test('shows error messages for invalid inputs', async () => {
  await customRender(<App />);

  // Use the first submit button (model form)
  const submitButtons = screen.getAllByText(/submit/i);
  fireEvent.click(submitButtons[0]);

  await waitFor(() => {
    expect(screen.getByText(/Model type is required/i)).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.getByText(/Loss function is required/i)).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.getByText(/Optimizer is required/i)).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.getByText(/Learning rate must be a valid number/i)).toBeInTheDocument();
  });
});

test('submits the form with valid inputs', async () => {
  axios.post.mockResolvedValueOnce({ data: { success: true } });

  await customRender(<App />);

  fireEvent.change(screen.getByLabelText(/model type/i), { target: { value: 'CNN' } });
  fireEvent.change(screen.getByLabelText(/loss function/i), { target: { value: 'CrossEntropy' } });
  fireEvent.change(screen.getByLabelText(/optimizer/i), { target: { value: 'Adam' } });
  fireEvent.change(screen.getByLabelText(/learning rate/i), { target: { value: '0.001' } });

  // Use the first submit button (model form)
  const submitButtons = screen.getAllByText(/submit/i);
  fireEvent.click(submitButtons[0]);

  await waitFor(() =>
    expect(axios.post).toHaveBeenCalledWith('/api/submit', {
      modelType: 'CNN',
      lossFunction: 'CrossEntropy',
      optimizer: 'Adam',
      learningRate: '0.001',
    })
  );

  expect(window.alert).toHaveBeenCalledWith("Form submitted successfully!");
});

test('updates shared state after form submission', async () => {
  axios.post.mockResolvedValue({ data: { success: true } });

  const mockSharedState = jest.fn();
  // Replace this with actual dependency injection if App expects a prop
  await customRender(<App setSharedState={mockSharedState} />);
  
  const messageElement = await screen.findByText(/Hello from backend!/i);
  expect(messageElement).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/model type/i), { target: { value: 'RNN' } });
  fireEvent.change(screen.getByLabelText(/loss function/i), { target: { value: 'MSE' } });
  fireEvent.change(screen.getByLabelText(/optimizer/i), { target: { value: 'SGD' } });
  fireEvent.change(screen.getByLabelText(/learning rate/i), { target: { value: '0.01' } });

  // Use the first submit button (model form)
  const submitButtons = screen.getAllByText(/submit/i);
  fireEvent.click(submitButtons[0]);

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

  await customRender(<App />);

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

  await customRender(<App />);

  expect(await screen.findByText(/Could not fetch training progress/i)).toBeInTheDocument();
});
