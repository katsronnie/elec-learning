const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection URI
const mongoURI = 'mongodb+srv://progroney:JG4fEfuNOXJ2dPI1@cluster0.jn8z4vl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Create mongoose connection
mongoose.connect(mongoURI);


const conn = mongoose.connection;

// Initialize GridFS
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
  console.log('MongoDB connection established');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
          metadata: {
            originalName: file.originalname,
            mimeType: file.mimetype
          }
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

// Upload file route
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  return res.json({ 
    fileId: req.file.id,
    filename: req.file.filename,
    originalName: req.file.metadata.originalName,
    mimeType: req.file.metadata.mimeType
  });
});

// Get file route
app.get('/api/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (err || !file || file.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      // Set appropriate headers
      res.set('Content-Type', file.contentType);
      res.set('Content-Disposition', `attachment; filename="${file.metadata.originalName}"`);
      
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
