import { openDb } from './db';
import { Note } from '../models/note';
import { v4 as uuid } from 'uuid';

export interface ListOpts {
  q?: string;
  tag?: string;
  offset: number;
  limit: number;
  sortBy: 'createdAt' | 'updatedAt';
  direction: 'ASC' | 'DESC';
}

export class NoteRepo{
    async create(data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
        const db = await openDb();
        const id = uuid();
        const now = new Date().toISOString();
        await db.run(`
            INSERT INTO notes (id, title, body, tags, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?)`,
            id, data.title, (data.body ?? ''), JSON.stringify(data.tags), now, now
        );
        return {id, ...data, createdAt: now, updatedAt: now};
    }
    async list(opts: ListOpts): Promise<{ items: Note[]; total: number }> {
    const db = await openDb();

    const filters: string[] = [];
    const params: any[] = [];

    if (opts.q) {
      filters.push('(title LIKE ? OR body LIKE ?)');
      params.push(`%${opts.q}%`, `%${opts.q}%`);
    }
    if (opts.tag) {
      filters.push('tags LIKE ?');
      params.push(`%${opts.tag}%`);
    }
    const whereClause = filters.length ? 'WHERE ' + filters.join(' AND ') : '';

    const totalRow = await db.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM notes ${whereClause}`,
      ...params
    );
    const total = totalRow?.count ?? 0;

    //  Lấy data theo pagination & sort
    const rawRows: Array<{ [key: string]: any }> = await db.all(
      `SELECT * FROM notes
       ${whereClause}
       ORDER BY ${opts.sortBy} ${opts.direction}
       LIMIT ? OFFSET ?`,
      ...params,
      opts.limit,
      opts.offset
    );

    const items: Note[] = rawRows.map(row => ({
      id: row.id,
      title: row.title,
      body: row.body,
      tags: Array.isArray(row.tags)
    ? row.tags
    : JSON.parse(row.tags ?? '[]'),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));

    return { items, total };
  }

  async getById(id: string): Promise<Note | null> {
    const db = await openDb();
    const row = await db.get<{
        id: string;
        title: string;
        body: string;
        tags: string;
        createdAt: string;
        updatedAt: string;
    }>(`SELECT * FROM notes WHERE id = ?`, id);
    if (!row) return null;
    return {
        id: row.id,
        title: row.title,
        body: row.body,
        tags: JSON.parse(row.tags),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
  }

  async update(id: string, data: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Note | null> {
    const db = await openDb();
    // Kiểm tra xem note có tồn tại không
    const existing = await this.getById(id);
    if (!existing) return null;

    const sets: string[] = [];
    const params: any[] = [];
    if (data.title !== undefined) {
      sets.push('title = ?');
      params.push(data.title);
    }
    if (data.body !== undefined) {
      sets.push('body = ?');
      params.push(data.body);
    }
    if (data.tags !== undefined) {
      sets.push('tags = ?');
      params.push(JSON.stringify(data.tags));
    }

    if (sets.length === 0) return existing;
    const now = new Date().toISOString();
    sets.push('updatedAt = ?');
    params.push(now);

    const sql = `UPDATE notes SET ${sets.join(', ')} WHERE id = ?`;
    params.push(id);
    await db.run(sql, ...params);

    return this.getById(id);
    }

    async delete(id: string): Promise<boolean> {
        const db = await openDb();
        //kiểm tra xem note có tồn tại không
        const existing = await this.getById(id);
        if (!existing) return false;

        await db.run(`DELETE FROM notes WHERE id = ?`, id);
        return true;
    }
    
}
