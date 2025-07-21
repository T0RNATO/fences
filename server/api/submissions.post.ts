// Gets a specific submission by ID
export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const body = await readBody(event);

    if (!("id" in body && typeof body.id === "number")) {
        return setResponseStatus(event, 400);
    }

    const db = useDatabase();
    const submissions = await db.sql`SELECT * FROM submissions WHERE user = ${session.user.id} AND id = ${body.id}`

    return submissions.rows?.[0];
})