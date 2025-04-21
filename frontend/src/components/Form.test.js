import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Form from './Form';

beforeAll(() => {
    window.alert = jest.fn();
  });
  

jest.mock('axios');

test('renders the form with all input fields', () => {
  render(<Form />);

  expect(screen.getByLabelText(/model type/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/loss function/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/optimizer/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/learning rate/i)).toBeInTheDocument();
});

test('shows error messages for invalid inputs', async () => {
  render(<Form />);

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

  render(<Form />);

  fireEvent.change(screen.getByLabelText(/model type/i), { target: { value: 'CNN' } });
  fireEvent.change(screen.getByLabelText(/loss function/i), { target: { value: 'CrossEntropy' } });
  fireEvent.change(screen.getByLabelText(/optimizer/i), { target: { value: 'Adam' } });
  fireEvent.change(screen.getByLabelText(/learning rate/i), { target: { value: '0.001' } });

  fireEvent.click(screen.getByText(/submit/i));

  await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/api/submit', {
    modelType: 'CNN',
    lossFunction: 'CrossEntropy',
    optimizer: 'Adam',
    learningRate: '0.001',
  }));

  expect(window.alert).toHaveBeenCalledWith('Form submitted successfully!');
});