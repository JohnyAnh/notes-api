import { Router } from 'express';
import {
  createNote,
} from '../controllers/note.controller';
import {
  createNoteRules,
  validate,
} from '../middlewares/validate.note';

const router = Router();

router.post('/', createNoteRules, validate, createNote);


export default router;
