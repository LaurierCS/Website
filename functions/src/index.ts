import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Client as NotionClient } from "@notionhq/client";
import { v4 as uuidv4 } from 'uuid';

admin.initializeApp();
const db = admin.firestore();

const notionSecret = process.env.NOTION_SECRET
const databaseId = process.env.NOTION_DATABASE_ID


if (!notionSecret || !databaseId) {
  throw new Error("Environment variables for Notion are not set.");
}

const notionClient = new NotionClient({
  auth: notionSecret,
});


export const syncNotionEventsToFirestore = functions.https.onRequest(async (_, response) => {
    try {
        if (!databaseId) {
            throw new Error("Environment variable NOTION_DATABASE_ID is not set.");
        }

        const notionResponse = await notionClient.databases.query({ database_id: databaseId });

		notionResponse.results.forEach(async (page: any) => {
		    const blockResponse = await notionClient.blocks.children.list({
		        block_id: page.id,
		    });

		    const date = page.properties["Date"]?.date?.start ?? "";
		    const eventDate = date ? new Date(date) : null; 

		    if (!eventDate || eventDate < new Date()) {
		        return;
		    }

		    let description = "";

			for (const block of blockResponse.results) {

			    if ('type' in block && block.type === "paragraph" && block.paragraph.rich_text.length > 0) {

			        const firstNonEmptyParagraph = block.paragraph.rich_text.find(rt => rt.plain_text.trim() !== "");
			        if (firstNonEmptyParagraph) {
			            description = firstNonEmptyParagraph.plain_text;
			            break; 
			        }
			    }
			}

		    const title = page.properties["Name"]?.title[0]?.plain_text ?? "Untitled Event";
		    const eventIdentifier = page.properties["Event Identifier"]?.rich_text[0]?.plain_text ?? ""

			const docData = {
			    title,
			    date: eventDate,
			    description,
			    place: page.properties["Confirmed Room"]?.multi_select.map((select: any) => select.name).join(", ") ?? "",
			    icon: page.icon.emoji ?? "✏️",
			    igPost: "", // There's nothing on the notion, done manually? :(
    			isPublicDate: page.properties["Date Public"]?.multi_select.map((select: any) => select.name).join(", ") ?? false,
    			isPublicPlace: page.properties["Place Public"]?.multi_select.map((select: any) => select.name).join(", ") ?? false,
    			isPublicTime: page.properties["Time Public"]?.multi_select.map((select: any) => select.name).join(", ") ?? false,
    			visible: page.properties["Visible"]?.multi_select.map((select: any) => select.name).join(", ") ?? true,
			};

		    const docId = page.id.replace(/-/g, "");

		    await db.collection("events").doc(docId).set(docData, { merge: true });
		});

        response.send("Notion events synced successfully with Firestore.");
    } catch (error) {
        console.error("Error syncing Notion events to Firestore:", error);
        response.status(500).send("Internal Server Error");
    }
});