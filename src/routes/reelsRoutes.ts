import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const reelsRouter = express.Router(); 

const imagesPath = path.join(__dirname, '../../src/upload/images'); // Make sure this path is correct

// Serve static files from the 'images' directory
reelsRouter.use('/post', express.static(imagesPath));

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {        
    cb(null, imagesPath); // Use absolute path
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Initialize multer with file size limit
const upload = multer({
  storage: storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB limit
});

// Route to upload a file
reelsRouter.post('/upload', upload.single('post'), (req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    res.json({
      success: 1,
      post_url: `http://localhost:3000/api/reels/post/${req.file.filename}`
    });
  } else {
    res.status(400).json({
      success: 0,
      message: 'File upload failed. Ensure the file is less than 8 MB and try again.',
    });
  }
});

// Route to fetch all posts
reelsRouter.get('/fetchallposts', (req: Request, res: Response) => {
  fs.readdir(imagesPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: 0, message: 'Unable to scan files' });
    }

    const allFiles = files.map(file => `http://localhost:3000/api/reels/post/${file}`);
    res.json({ success: 1, files: allFiles });
  });
});

export default reelsRouter;
