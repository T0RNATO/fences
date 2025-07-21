// Gets all the submissions associated with a user
export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    const db = useDatabase();
    const submissions = await db.sql`SELECT * FROM submissions WHERE user = ${session.user.id}`

    return submissions.rows;
})