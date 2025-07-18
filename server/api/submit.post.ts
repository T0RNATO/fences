import {FieldsSchema} from "~/components/form/submission";

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event);

    const db = useDatabase();

    const body = await readValidatedBody(event, FieldsSchema.safeParse);

    if (body.success) {
        const data = body.data;

        const query = `INSERT INTO fields (user, ${Object.keys(data).join(",")}) VALUES (${session.user.id},`;
        const commas = new Array(Object.keys(data).length - 1).fill(",");

        const queryArr = [query, ...commas, ");"];

        await db.sql(Object.assign(queryArr, {raw: queryArr}), ...Object.values(data))

        return setResponseStatus(event, 200);
    }

    return setResponseStatus(event, 400, body.error.message);
});