export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    const db = useDatabase();
    const submissions = await db.sql`SELECT (name) FROM fields WHERE user = ${session.user.id}`

    return submissions.rows;
})