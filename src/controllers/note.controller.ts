import { Request, Response, NextFunction } from 'express';
import { NoteService } from '../services/note.service';

const service = new NoteService();

export async function createNote (req: Request, res: Response, next: NextFunction){
    try{
        const note = await service.createNote(req.body);
        res.status(201).json(note);
    }catch(err){
        next(err);
    }
}