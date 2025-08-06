import { Note } from '../models/note';
import { NoteRepo } from '../repositories/note.repo';

export class NoteService {
  private repo = new NoteRepo();

  async createNote(data: Omit<Note, 'id'|'createdAt'|'updatedAt'>): Promise<Note> {
    const normalized = {
      ...data,
      tags: data.tags.map(tag => tag.toLowerCase()),
    };
    return this.repo.create(normalized);
  }

  // TODO: implement other methods like list, getById, update, delete
}
