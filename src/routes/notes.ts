import { Router } from 'express';
import {
  createNote,
  listNotes,
  getNote,
  updateNote,
  deleteNote,
} from '../controllers/note.controller';
import {
  createNoteRules,
  updateNoteRules,
  validate,

} from '../middlewares/validate.note';

const router = Router();

router.post('/', createNoteRules, validate, createNote);
router.get('/', listNotes);
router.get('/:id', getNote);
router.patch('/:id', updateNoteRules, validate, updateNote);
router.delete('/:id', deleteNote);


export default router;
