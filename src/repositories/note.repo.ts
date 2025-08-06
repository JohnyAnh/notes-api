import { openDb } from './db';
import { Note } from '../models/note';
import { v4 as uuid } from 'uuid';

export class NoteRepo{
    async create(data: Omit<Note, 'id' | 'createAt' | 'updateAt'>): Promise<Note> {
        const db = await openDb();
        const id = uuid();
        const now = new Date().toISOString();
        await db.run(`
            INSERT INTO notes (id, titel, body, tags, createAt, updateAt)
            VALUES (?, ?, ?, ?, ?, ?)`,
            id, data.titel, data.body, JSON.stringify(data.tags), now, now
        );
        return {id, ...data, createAt: now, updateAt: now};
    }
    //TODO: list, getById, update, delete methods
}