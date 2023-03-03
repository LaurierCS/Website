import functions from 'firebase-functions';
import { Client as NotionClient } from '@notionhq/client';

const notion = new NotionClient({
    auth: process.env.LCS_NOTION_KEY,
});

export const getRosterDB = functions.https.onRequest(async (_req, res) => {
    try {
        // get available fields and some other data to find someone to blame
        const { properties, last_edited_by, last_edited_time } =
            await notion.databases.retrieve({
                database_id: process.env.LCS_NOTION_DATABASE_ID,
            });

        const user = await notion.users.retrieve({
            user_id: last_edited_by.id,
        });

        const { results: team } = await notion.databases.query({
            database_id: process.env.LCS_NOTION_DATABASE_ID,
        });

        res.status(200).json({
            properties,
            last_edited_by: user,
            last_edited_time,
            team,
        });
    } catch (error) {
        functions.logger.error(error);
        res.status(400).json({ error });
    }
});
