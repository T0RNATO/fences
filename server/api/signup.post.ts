import {User, UserSchema} from "~/server/plugins/database";

// Logs a user into a newly created account
export default defineEventHandler(async (event) => {
    const db = useDatabase();

    const validation = await readValidatedBody(event, UserSchema.safeParse);

    if (!validation.success) {
        setResponseStatus(event, 400)
        return validation.error.issues
    }

    const {email, password} = validation.data;

    const hashedPassword = await hashPassword(password);

    try {
        const user = (await db.sql<{ rows: User[] }>`INSERT INTO users(email, password) VALUES (${email}, ${hashedPassword})`).rows[0];

        await setUserSession(event, {
            user: {
                email,
                id: user.id,
            },
            loggedInAt: Date.now(),
        });

        return setResponseStatus(event, 201);
    } catch (err) {
        setResponseStatus(event, 400);
        return [{path: ["email"], message: "Email already has an associated account."}]
    }
})