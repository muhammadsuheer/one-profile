import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { env } from '@/env'
import * as schema from './schema'

// Neon HTTP driver: ideal for serverless (one-shot queries over fetch, no
// websocket/pool to manage). Multi-statement atomicity uses db.batch().
const sql = neon(env.DATABASE_URL)

export const db = drizzle(sql, { schema })
export { schema }
