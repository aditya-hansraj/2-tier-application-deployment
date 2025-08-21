import express from 'express';
import upload from '../config/multer';
import { createDiaryEntry, deleteDiaryEntry, getEntries, updateDiaryEntry } from '../controllers/diaryEntry';
import isAuthenticated from '../middlewares/auth';

const router = express.Router();

router.post('/create',isAuthenticated, upload.array('files', 10), createDiaryEntry);

router.delete('/delete/:id', isAuthenticated, deleteDiaryEntry);

router.get('/', isAuthenticated, getEntries);   

router.put('/update/:id', isAuthenticated, updateDiaryEntry);

export default router;  
