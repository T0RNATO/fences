import {H3Error} from "h3";
import {userValidation} from "~/server/plugins/database";

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
        await db.sql`INSERT INTO users(email, password) VALUES (${email}, ${hashedPassword})`;
    } catch (err) {
        setResponseStatus(event, 400);
        return [{path: ["email"], message: "Email already has an associated account."}]
    }

    await setUserSession(event, {
        user: {
            email,
        },
        loggedInAt: Date.now(),
    });

    // return sendRedirect(event, "/", 201);
    return setResponseStatus(event, 201);
})