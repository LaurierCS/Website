import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Client as NotionClient } from "@notionhq/client";

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


//export const syncNotionEventsToFirestore = functions.https.onRequest(async (_, response) => {
export const scheduledSyncNotionEventsToFirestore = functions.pubsub.schedule('0 * * * *').onRun(async (context) => {
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

			const isInPersonOrOnline = page.properties["In Person/Online"]?.select?.name ?? null;
			const hasConfirmedRoom = page.properties["Confirmed Room"]?.multi_select.length > 0;
			//const hasTypeformSignIn = page.properties["Typeform Sign In"]?.url ?? null;
			//const hasTypeformFeedback = page.properties["Typeform Feedback"]?.url ?? null;

			if (!isInPersonOrOnline || !hasConfirmedRoom) {
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

			const title = page.properties["Name"]?.title[0]?.plain_text ?? "";
			
			if (!title) {
			    return;
			}

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

			const sanitizedTitle = title.replace(/\W+/g, "").toLowerCase(); // Remove non-alphanumeric characters and convert to lower case
			const docId = `${sanitizedTitle}_${page.id.replace(/-/g, "").substring(0, 6)}`;

			await db.collection("events").doc(docId).set(docData, { merge: true });
		});
		console.log("Notion events synced successfully with Firestore.");
		//response.send("Notion events synced successfully with Firestore.");
	} catch (error) {
		console.error("Error syncing Notion events to Firestore:", error);
		//response.status(500).send("Internal Server Error");
	}
});