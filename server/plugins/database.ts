import {z} from "zod";

export default defineNitroPlugin(async () => {
    const db = useDatabase()

    await db.sql`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT
    )`
})

export interface User {
    email: string,
    password: string,
}

export const userValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8),
}).parse;