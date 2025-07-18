import {z} from "zod";

export default defineNitroPlugin(async () => {
    const db = useDatabase()

    await db.sql`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );`

    await db.sql`
    CREATE TABLE IF NOT EXISTS fields (
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

export const userValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8),
}).parse;