import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import axios from 'axios';
import Form from './Form';

jest.mock('axios');

beforeAll(() => {
    window.alert = jest.fn();
  });
  
beforeEach(() => {
  axios.get.mockImplementation((url) => {
    if (url === '/api/parameter-options') {
      return Promise.resolve({ data: {
        modelTypes: ['CNN', 'RNN', 'UNet', 'ResNet', 'Transformer'],
        lossFunctions: ['CrossEntropy', 'MSE', 'MAE', 'Dice', 'BCEWithLogits'],
        optimizers: ['Adam', 'SGD', 'RMSprop', 'Adagrad', 'AdamW'],
      }});
    }
    return Promise.resolve({ data: {} });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

// Wrap all renders in act to suppress act warnings
const customRender = async (ui, options) => {
  let result;
  await act(async () => {
    result = render(ui, options);
  });
  return result;
};

test('renders the form with all input fields', async () => {
  await customRender(<Form />);

  expect(await screen.findByLabelText(/model type/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/loss function/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/optimizer/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/learning rate/i)).toBeInTheDocument();
});

test('shows error messages for invalid inputs', async () => {
  await customRender(<Form />);

  const submitButton = await screen.findByText(/submit/i);
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

  await customRender(<Form />);

  await act(async () => {
    fireEvent.change(await screen.findByLabelText(/model type/i), { target: { value: 'CNN' } });
    fireEvent.change(await screen.findByLabelText(/loss function/i), { target: { value: 'CrossEntropy' } });
    fireEvent.change(await screen.findByLabelText(/optimizer/i), { target: { value: 'Adam' } });
    fireEvent.change(await screen.findByLabelText(/learning rate/i), { target: { value: '0.001' } });
  });

  fireEvent.click(await screen.findByText(/submit/i));

  await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/api/submit', {
    modelType: 'CNN',
    lossFunction: 'CrossEntropy',
    optimizer: 'Adam',
    learningRate: '0.001',
  }));

  expect(window.alert).toHaveBeenCalledWith('Form submitted successfully!');
});