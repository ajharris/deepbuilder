import io
import os
import pytest
from backend.app import app, UPLOAD_FOLDER

def create_test_file(filename, content=b'data'):
    return (io.BytesIO(content), filename)

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_upload_no_file(client):
    rv = client.post('/api/upload-dataset', data={})
    assert rv.status_code == 400
    assert b'No file part' in rv.data

def test_upload_invalid_type(client):
    data = {'file': create_test_file('test.txt')}
    rv = client.post('/api/upload-dataset', data=data, content_type='multipart/form-data')
    assert rv.status_code == 400
    assert b'Invalid file type' in rv.data

def test_upload_valid_npy(client):
    data = {'file': create_test_file('test.npy')}
    rv = client.post('/api/upload-dataset', data=data, content_type='multipart/form-data')
    assert rv.status_code == 200
    assert b'File uploaded successfully' in rv.data
    os.remove(os.path.join(UPLOAD_FOLDER, 'test.npy'))

def test_upload_valid_png(client):
    data = {'file': create_test_file('test.png')}
    rv = client.post('/api/upload-dataset', data=data, content_type='multipart/form-data')
    assert rv.status_code == 200
    assert b'File uploaded successfully' in rv.data
    os.remove(os.path.join(UPLOAD_FOLDER, 'test.png'))

def test_upload_invalid_dicom(client):
    data = {'file': create_test_file('bad.dcm', b'notdicom')}
    rv = client.post('/api/upload-dataset', data=data, content_type='multipart/form-data')
    assert rv.status_code == 400
    assert b'Invalid DICOM file' in rv.data

def test_upload_valid_dicom(client):
    # Minimal valid DICOM file header: 128 bytes of zero + 'DICM'
    dicom_content = b'\0' * 128 + b'DICM' + b'\0' * 4
    data = {'file': create_test_file('good.dcm', dicom_content)}
    rv = client.post('/api/upload-dataset', data=data, content_type='multipart/form-data')
    assert rv.status_code == 200
    assert b'File uploaded successfully' in rv.data
    os.remove(os.path.join(UPLOAD_FOLDER, 'good.dcm'))
