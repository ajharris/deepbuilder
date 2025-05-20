import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import DatasetUpload from './DatasetUpload';

jest.mock('axios');

describe('DatasetUpload', () => {
  it('renders upload form', () => {
    render(<DatasetUpload />);
    expect(screen.getByText(/Upload Dataset/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload/i })).toBeInTheDocument();
  });

  it('shows error for no file', async () => {
    render(<DatasetUpload />);
    fireEvent.click(screen.getByRole('button', { name: /Upload/i }));
    expect(await screen.findByText(/Please select a file/i)).toBeInTheDocument();
  });

  it('shows error for invalid file type', async () => {
    render(<DatasetUpload />);
    const file = new File(['dummy'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByLabelText(/file/i), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /Upload/i }));
    expect(await screen.findByText(/Invalid file type/i)).toBeInTheDocument();
  });

  it('uploads valid file and shows success', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Upload successful!' } });
    render(<DatasetUpload />);
    const file = new File(['dummy'], 'test.npy', { type: 'application/octet-stream' });
    fireEvent.change(screen.getByLabelText(/file/i), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /Upload/i }));
    expect(await screen.findByText(/Upload successful!/i)).toBeInTheDocument();
  });

  it('shows error on upload failure', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Upload failed.' } } });
    render(<DatasetUpload />);
    const file = new File(['dummy'], 'test.npy', { type: 'application/octet-stream' });
    fireEvent.change(screen.getByLabelText(/file/i), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /Upload/i }));
    expect(await screen.findByText(/Upload failed./i)).toBeInTheDocument();
  });
});
