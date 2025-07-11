import {User, userValidation} from "~/server/plugins/database";

export default defineEventHandler(async (event) => {
    const db = useDatabase();

    let body;

    try {
        body = await readValidatedBody(event, userValidation);
    } catch (err) {
        setResponseStatus(event, 400);
        return [{path: ["password"], message: "Invalid credentials."}]
    }

    const {email, password} = body;

    const user = await db.sql<{ rows: User[] }>`SELECT * FROM users WHERE email = ${email}`.then(result => result.rows[0])

    if ((!user) || !(await verifyPassword(user.password, password))) {
        setResponseStatus(event, 400);
        return [{path: ["password"], message: "Invalid credentials."}]
    }

    await setUserSession(event, {
        user: {
            email,
        },
        loggedInAt: Date.now(),
    })

    // return sendRedirect(event, "/", 201);
    return setResponseStatus(event, 201);
})