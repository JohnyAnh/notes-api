import request from 'supertest';
import app from '../src/app';
import { openDb } from '../src/repositories/db';

describe('Notes API', () => {
  let noteId: string;

  beforeAll(async () => {
    const db = await openDb();
    await db.exec('DELETE FROM notes'); // reset table
  });

  it('POST /notes → creates a note', async () => {
    const res = await request(app)
      .post('/notes')
      .send({ title: 'Test', body: 'Hello', tags: ['a','b'] });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'Test', body: 'Hello', tags: ['a','b'] });
    expect(res.body).toHaveProperty('id');
    noteId = res.body.id;
  });

  it('GET /notes → lists notes', async () => {
    const res = await request(app).get('/notes');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.total).toBeGreaterThan(0);
  });

  it('GET /notes/:id → retrieves the note', async () => {
    const res = await request(app).get(`/notes/${noteId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(noteId);
  });

  it('PATCH /notes/:id → updates the note', async () => {
    const res = await request(app)
      .patch(`/notes/${noteId}`)
      .send({ title: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated');
  });

  it('DELETE /notes/:id → deletes the note', async () => {
    const res = await request(app).delete(`/notes/${noteId}`);
    expect(res.status).toBe(204);
  });

  it('GET /notes/:id for deleted → returns 404', async () => {
    const res = await request(app).get(`/notes/${noteId}`);
    expect(res.status).toBe(404);
  });
});
