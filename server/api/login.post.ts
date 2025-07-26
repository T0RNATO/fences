import {User, UserSchema} from "~/server/plugins/database";

// Logs a user into an existing account
export default defineEventHandler(async (event) => {
    const db = useDatabase();

    const validation = await readValidatedBody(event, UserSchema.safeParse);

    if (!validation.success) {
        setResponseStatus(event, 400)
        return [{path: ["password"], message: "Invalid credentials."}]
    }

    const {email, password} = validation.data;

    const user = await db.sql<{ rows: User[] }>`SELECT * FROM users WHERE email = ${email}`.then(result => result.rows[0])

    if ((!user) || !(await verifyPassword(user.password, password))) {
        setResponseStatus(event, 400);
        return [{path: ["password"], message: "Invalid credentials."}]
    }

    await setUserSession(event, {
        user: {
            email,
            id: user.id
        },
        loggedInAt: Date.now(),
    })

    return setResponseStatus(event, 201);
})