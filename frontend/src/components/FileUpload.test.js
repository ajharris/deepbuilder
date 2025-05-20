import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import FileUpload from './FileUpload';

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn((url, opts) => {
    if (opts && opts.body instanceof FormData) {
      return Promise.resolve({
        json: () => Promise.resolve({ message: 'File uploaded', path: '/uploads/test.txt' })
      });
    } else if (opts && opts.body && opts.body.includes('file_path')) {
      return Promise.resolve({
        json: () => Promise.resolve({ message: 'File reference accepted', path: '/some/path.txt' })
      });
    }
    return Promise.resolve({
      json: () => Promise.resolve({ error: 'No file or file_path provided' })
    });
  });
});

afterEach(() => {
  global.fetch.mockClear();
});

test('uploads a file', async () => {
  render(<FileUpload />);
  const file = new File(['hello'], 'test.txt', { type: 'text/plain' });
  const input = screen.getByLabelText(/upload file/i);
  fireEvent.change(input, { target: { files: [file] } });
  fireEvent.click(screen.getByTestId('file-upload-submit'));
  const successMsg = await screen.findByText(/file uploaded/i);
  expect(successMsg).toBeInTheDocument();
});

test('references a file path', async () => {
  render(<FileUpload />);
  const input = screen.getByPlaceholderText('/path/to/file');
  fireEvent.change(input, { target: { value: '/some/path.txt' } });
  fireEvent.click(screen.getByTestId('file-upload-submit'));
  const refMsg = await screen.findByText(/file reference accepted/i);
  expect(refMsg).toBeInTheDocument();
});

test('shows error if nothing provided', async () => {
  render(<FileUpload />);
  fireEvent.click(screen.getByTestId('file-upload-submit'));
  const errorMsg = await screen.findByText(/please select a file or enter a file path/i);
  expect(errorMsg).toBeInTheDocument();
});
