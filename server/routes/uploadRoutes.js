import express from 'express';
import { uploadToMinio } from '../middleware/fileUploadMiddleware.js';
import { authenticate } from '../utils/authorizationMiddleware.js';
import upload from '../middleware/fileUploadMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filename = await uploadToMinio(req.file, req.user._id);
    res.json({ filename, message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload file' });
  }
});

router.post('/expense-receipt', upload.single('receiptImage'), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file ? 'Present' : 'Missing');
    console.log('User:', req.user ? req.user._id : 'Missing');
    
    if (!req.file) {
      return res.status(400).json({ message: 'No receipt image uploaded' });
    }

    const filename = await uploadToMinio(req.file, req.user._id, 'expense');
    const imageUrl = `http://localhost:5000/api/images/${filename}`;
    
    console.log('Upload successful, returning:', { filename, imageUrl });
    res.json({ filename, imageUrl, message: 'Receipt image uploaded successfully' });
  } catch (error) {
    console.error('Receipt upload error:', error);
    res.status(500).json({ 
      message: 'Failed to upload receipt image', 
      error: error.message 
    });
  }
});

export default router;