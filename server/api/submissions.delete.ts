// Deletes a specific submission
export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const body = await readBody(event);

    if (!("id" in body && typeof body.id === "number")) {
        return setResponseStatus(event, 400);
    }

    const db = useDatabase();
    const submissions = await db.sql`DELETE FROM submissions WHERE user = ${session.user.id} AND id = ${body.id}`

    return setResponseStatus(event, 200);
})