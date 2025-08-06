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

    async listNotes(opts:{
        q?: string;
        tag?: string;
        page?: number;
        limit?: number;
        sort?: 'createdAt' | 'updatedAt';
    }): Promise<{ items: Note[]; total: number }> {
        const page = opts.page && opts.page > 0 ? opts.page: 1;
        const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
        const offset = (page - 1) * limit;
        const sortBy = opts.sort === 'updatedAt' ? 'updatedAt' : 'createdAt';
        const direction = 'DESC';

        return this.repo.list({
            q: opts.q,
            tag: opts.tag,
            offset,
            limit,
            sortBy,
            direction,
        });
    }

    async getNoteById(id: string): Promise<Note> {
        const note = await this.repo.getById(id);
        if (!note) {
            const err = new Error(`Note not found`);
            (err as any).statusCode = 404;
            throw err;
        }
        return note;
    }

    async updateNote(id: string, data: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Note> {
        if (data.tags) {
            data.tags = data.tags.map(tag => tag.toLowerCase());
        }
        const updated = await this.repo.update(id, data);
        if (!updated) {
            const err = new Error(`Note not found`);
            (err as any).statusCode = 404;
            throw err;
        }
        return updated;
    }
    async deleteNote(id: string): Promise<void> {
        const deleted = await this.repo.delete(id);
        if (!deleted) {
            const err = new Error(`Note not found`);
            (err as any).statusCode = 404;
            throw err;
        }
    }
}
