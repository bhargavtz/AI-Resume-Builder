require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a simple schema and model for testing
const resumeSchema = new mongoose.Schema({
    title: String,
    userId: String,
    content: Object, // Store resume content as a flexible object
    createdAt: { type: Date, default: Date.now }
});

const Resume = mongoose.model('Resume', resumeSchema);

// Basic API Routes
app.get('/', (req, res) => {
    res.send('Resume Builder Backend API is running!');
});

// Get all resumes
app.get('/resumes', async (req, res) => {
    try {
        const resumes = await Resume.find();
        res.json(resumes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single resume by ID
app.get('/resumes/:id', async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.json(resume);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new resume
app.post('/resumes', async (req, res) => {
    const resume = new Resume({
        title: req.body.title,
        userId: req.body.userId,
        content: req.body.content // This will be an empty object initially
    });
    try {
        const newResume = await resume.save();
        res.status(201).json(newResume);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an existing resume
app.put('/resumes/:id', async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Update the content field with the new form data
        // Assuming req.body.data contains the form fields (firstName, lastName, etc.)
        resume.content = { ...resume.content, ...req.body.data };
        
        const updatedResume = await resume.save();
        res.json(updatedResume);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
