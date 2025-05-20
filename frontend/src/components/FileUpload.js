import React, { useState } from 'react';

function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFilePath('');
  };

  const handlePathChange = (e) => {
    setFilePath(e.target.value);
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      if (onUpload) onUpload(data);
    } else if (filePath) {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_path: filePath }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      if (onUpload) onUpload(data);
    } else {
      setMessage('Please select a file or enter a file path.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Upload file:
          <input type="file" onChange={handleFileChange} />
        </label>
      </div>
      <div>or</div>
      <div>
        <label>Reference file path:
          <input type="text" value={filePath} onChange={handlePathChange} placeholder="/path/to/file" />
        </label>
      </div>
      <button type="submit" data-testid="file-upload-submit">Submit</button>
      {message && <div>{message}</div>}
    </form>
  );
}

export default FileUpload;
