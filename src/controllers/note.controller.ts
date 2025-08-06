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

export async function listNotes(req: Request, res: Response, next: NextFunction) {
    try {
        const {q, tag, page, limit, sort} = req.query;
        const result = await service.listNotes({
            q: req.query.q as string,
            tag: req.query.tag as string,
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10,
            sort: sort as 'createdAt' | 'updatedAt',
        });
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function getNote(req: Request, res: Response, next: NextFunction) {
    try {
        const note = await service.getNoteById(req.params.id);
        res.json(note);
    } catch (err) {
        next(err);
    }
}

export async function updateNote(req: Request, res: Response, next: NextFunction) {
    try {
        const note = await service.updateNote(req.params.id, req.body);
        res.json(note);
    } catch (err) {
        next(err);
    }
}

export async function deleteNote(req: Request, res: Response, next: NextFunction) {
    try {
        await service.deleteNote(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}
