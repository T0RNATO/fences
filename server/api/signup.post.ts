import {UserSchema} from "~/server/plugins/database";

// Logs a user into a newly created account
export default defineEventHandler(async (event) => {
    const db = useDatabase();

    // Validate data using Zod - specifically, check for 8+ character password and valid email.
    // You can look at the schema in "~/server/plugins/database"
    const validation = await readValidatedBody(event, UserSchema.safeParse);

    if (!validation.success) {
        setResponseStatus(event, 400)
        return validation.error.issues
    }

    const {email, password} = validation.data;

    const hashedPassword = await hashPassword(password);

    const alreadyExists = await db.sql`SELECT EXISTS(SELECT 1 FROM users WHERE email = ${email})`;

    if (!alreadyExists.rows?.[0]?.['EXISTS(SELECT 1 FROM users WHERE email = ?)']) {
        // Create an account and log them into it
        const id = (await db.sql`INSERT INTO users(email, password) VALUES (${email}, ${hashedPassword})`).lastInsertRowid;

        await setUserSession(event, {
            user: {
                email,
                id,
            },
            loggedInAt: Date.now(),
        });

        return setResponseStatus(event, 201);
    } else {
        setResponseStatus(event, 400);
        return [{path: ["email"], message: "Email already has an associated account."}];
    }
})