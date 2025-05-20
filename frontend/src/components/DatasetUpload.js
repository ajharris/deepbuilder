import React, { useState } from 'react';
import axios from 'axios';

const ACCEPTED_TYPES = [
  '.npy',
  '.png',
  '.dcm', // DICOM extension
  'application/dicom',
  'image/png',
  'application/octet-stream', // for .npy
];

function DatasetUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file.');
      return;
    }
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['npy', 'png', 'dcm'].includes(ext)) {
      setMessage('Invalid file type. Only .npy, .png, or DICOM files are allowed.');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('/api/upload-dataset', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message || 'Upload successful!');
    } catch (err) {
      setMessage(
        err.response?.data?.message || 'Upload failed. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload Dataset</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="dataset-upload-input">File</label>
        <input
          id="dataset-upload-input"
          type="file"
          accept=".npy,.png,.dcm,application/dicom,image/png,application/octet-stream"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
}

export default DatasetUpload;
