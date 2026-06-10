const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads and database folders exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
const dataDir = path.join(__dirname, 'data');
const dbFilePath = path.join(dataDir, 'projects.json');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Serve uploads statically
app.use('/uploads', express.static(uploadsDir));

// Multer Config for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'project-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Helpers to Read/Write database
const getProjects = () => {
  try {
    if (!fs.existsSync(dbFilePath)) {
      return [];
    }
    const data = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading project database:', error);
    return [];
  }
};

const saveProjects = (projects) => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(projects, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to project database:', error);
  }
};

// --- REST API Endpoints ---

// 1. GET all projects
app.get('/api/projects', (req, res) => {
  const projects = getProjects();
  res.json(projects);
});

// 2. POST create a new project
app.post('/api/projects', upload.single('imageFile'), (req, res) => {
  try {
    const { title, desc, url, code, category } = req.body;
    let image = req.body.image || '';

    // If file uploaded, override image path
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const projects = getProjects();
    const newProject = {
      id: uuidv4(),
      title: title || 'Untitled Project',
      desc: desc || '',
      url: url || '',
      code: code || '',
      category: category || 'React JS',
      image: image
    };

    projects.push(newProject);
    saveProjects(projects);

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. PUT update an existing project
app.put('/api/projects/:id', upload.single('imageFile'), (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc, url, code, category } = req.body;
    let image = req.body.image;

    const projects = getProjects();
    const projectIndex = projects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const oldProject = projects[projectIndex];

    // If new file uploaded, delete old uploaded file if it was on server
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
      if (oldProject.image && oldProject.image.startsWith('/uploads/')) {
        const oldFilePath = path.join(uploadsDir, path.basename(oldProject.image));
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    const updatedProject = {
      ...oldProject,
      title: title !== undefined ? title : oldProject.title,
      desc: desc !== undefined ? desc : oldProject.desc,
      url: url !== undefined ? url : oldProject.url,
      code: code !== undefined ? code : oldProject.code,
      category: category !== undefined ? category : oldProject.category,
      image: image !== undefined ? image : oldProject.image
    };

    projects[projectIndex] = updatedProject;
    saveProjects(projects);

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. DELETE a project
app.delete('/api/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    const projects = getProjects();
    const project = projects.find(p => p.id === id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete uploaded image file if it exists
    if (project.image && project.image.startsWith('/uploads/')) {
      const filePath = path.join(uploadsDir, path.basename(project.image));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const filteredProjects = projects.filter(p => p.id !== id);
    saveProjects(filteredProjects);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(400).json({ error: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Express Backend Server is running on port ${PORT}`);
});
