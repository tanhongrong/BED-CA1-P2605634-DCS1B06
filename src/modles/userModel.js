import { eq, asc } from 'drizzle-orm';
import { db } from '../db/connections.js';
import { users } from '../db/schema.js';

export async function findUserById(id) {
    const [result] = await
    db.select()
    .from(users)
    .where(eq(users.id,id))
    .limit(1)
    return result ?? null
}