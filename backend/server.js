// abilito l'uso delle variabili del file .env
require('dotenv').config();

const express = require('express');
const app = express();
const authRoutes = require('./auth/routes/authRoutes');
const coursesRoutes = require('./routes/coursesRoutes');
const examRoutes = require('./routes/examRoutes');
const userRoutes = require('./routes/userRoutes');
const studyPlanRoutes = require('./routes/studyPlanRoutes');
const enrolledStudentsRoutes = require('./routes/enrolledStudentsRoutes');
const examResultsRoutes = require('./routes/examResultsRoutes');

// importiamo il modulo cors per gestire le richieste cross-origin
const cors = require('cors');

app.use(cors());

app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:8100', 'http://192.168.1.149:8100'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Intercetta errori del server
app.use((err, req, res, next) => {
  console.error('ERRORE INTERNO:', err.stack || err);
  res.status(500).json({
    success: false,
    message: 'Errore interno al server',
    error: err.message 
  });
});

// Middleware che permette di ritornare json
app.use(express.json());

// routes definite nel file authRoutes
app.use('/api/auth', authRoutes);

// routes definite nel file userRoutes
app.use('/api/user', userRoutes);

// router definite nel file coursesRoutes
app.use('/api/courses', coursesRoutes);

// routes definite nel file examRoutes
app.use('/api/exam', examRoutes);

// routes definite nel file studyPlanRoutes
app.use('/api/studyPlan', studyPlanRoutes);

// routes definite nel file enrolledStudentsRoutes
app.use('/api/enrolledStudents', enrolledStudentsRoutes);

// routes definite nel file examResultsRoutes
app.use('/api/examResults', examResultsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);       
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Avvio server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});