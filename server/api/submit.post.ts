import {FieldsSchema} from "~/server/plugins/database";

// Creates a new submission or modifies an existing submission
export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event);

    const db = useDatabase();

    const validation = await readValidatedBody(event, FieldsSchema.safeParse);

    if (!validation.success) return setResponseStatus(event, 400, validation.error.message);

    const data = validation.data;

    let queryArr: string[];

    // This code is messy because db.sql() expects to be called as a tagged template literal like db.sql``
    // However, this approach would only work if I knew the field names beforehand
    // But, since this is the only way I have access to the DB, I have to make do

    // The id field is only present if a pre-existing submission is being edited
    // Perhaps this code should check if that id is already in the database but the worst case is it errors so it doesn't really matter
    if ('id' in data) {
        const fields = Object.keys(data);
        // This makes an array like [`UPDATE submissions SET field1 = `, ", field2 = ", ", field3 = ", `WHERE id = <id>`];
        // The gaps between array elements are where values are filled in.
        queryArr = [`UPDATE submissions SET ${fields[0]} = `, ...fields.slice(1).map(k => `, ${k} = `), `WHERE id = ${data.id}`];

    } else {
        const query = `INSERT INTO submissions (user, ${Object.keys(data).join(",")}) VALUES (${session.user.id},`;
        const commas = new Array(Object.keys(data).length - 1).fill(",");

        // This makes an array like [`INSERT INTO submissions (user, field1, field2) VALUES (${session.user.id},`, ",", ",", ");"]
        // Again, the gaps between array elements are where values are placed
        queryArr = [query, ...commas, ");"];
    }

    // Call the sql function with a bit of bodge since it expects a tagged template literal, and substitute the values
    await db.sql(Object.assign(queryArr, {raw: queryArr}), ...Object.values(data))

    return setResponseStatus(event, 200);
});