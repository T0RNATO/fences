import {H3Error} from "h3";
import {User, userValidation} from "~/server/plugins/database";

export default defineEventHandler(async (event) => {
    const db = useDatabase();

    let body;

    try {
        body = await readValidatedBody(event, userValidation);
    } catch (err) {
        if (err instanceof H3Error) {
            setResponseStatus(event, 400);
            return err.data.issues;
        }
        throw err;
    }

    const {email, password} = body;

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

        // return sendRedirect(event, "/", 201);
        return setResponseStatus(event, 201);
    } catch (err) {
        setResponseStatus(event, 400);
        return [{path: ["email"], message: "Email already has an associated account."}]
    }
})