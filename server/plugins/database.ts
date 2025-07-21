import {z} from "zod";

declare module '#auth-utils' {
    interface User {
        email: string,
        id: number,
    }
}

// Runs on server startup, creates DB tables
// If you're running this locally, look in ~/.data/db.sqlite
export default defineNitroPlugin(async () => {
    const db = useDatabase()

    await db.sql`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );`

    await db.sql`
    CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user integer not null,
        name TEXT NOT NULL,
        length REAL NOT NULL,
        pier_width TEXT NOT NULL,
        pier_height REAL NOT NULL,
        --       max_height REAL NOT NULL,
        panel_height REAL NOT NULL,
        panel_thickness REAL NOT NULL,
        pier_spacing TEXT CHECK(pier_spacing IN ('num_piers', 'distance', 'absolute_dist')) NOT NULL,
        num_piers INTEGER,
        space_betw_piers REAL,
        space_betw_piers_abs REAL,
        different_final_spacing TEXT CHECK(different_final_spacing IN ('left', 'right')),
        is_gradient TEXT CHECK(is_gradient IN ('yes', 'no')) NOT NULL,
        gradient REAL,
        rise REAL,
        run REAL,
        comments TEXT,
        FOREIGN KEY (user) REFERENCES users(id)
    );`
})

export interface User {
    email: string,
    password: string,
    id: number,
}

// Zod (JS object validation library) schemas for the same database objects
export const UserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const FieldsSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    length: z.number(),
    pier_width: z.string(),
    pier_height: z.number(),
    // max_height: z.number(),
    panel_height: z.number(),
    panel_thickness: z.number(),
    pier_spacing: z.enum(['num_piers', 'distance', 'absolute_dist']),
    num_piers: z.number().nullable().optional(),
    space_betw_piers: z.number().nullable().optional(),
    space_betw_piers_abs: z.number().nullable().optional(),
    different_final_spacing: z.enum(['left', 'right']).nullable().optional(),
    is_gradient: z.enum(['yes', 'no']),
    gradient: z.number().nullable().optional(),
    rise: z.number().nullable().optional(),
    run: z.number().nullable().optional(),
    comments: z.string().nullable().optional(),
}).strip();

export type Fields = z.infer<typeof FieldsSchema>;
export type FieldKey = keyof Fields;