import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Client as NotionClient } from "@notionhq/client";

admin.initializeApp();
const db = admin.firestore();

let notionSecret: string;
let databaseId: string;

try {
	notionSecret = process.env.NOTION_SECRET ?? "";
	databaseId = process.env.NOTION_DATABASE_ID ?? "";
} catch {
  // fallback to local config file
  const localConfig = require('../.runtimeconfig.json');
  notionSecret = localConfig.notion.secret;
  databaseId = localConfig.notion.database_id;
}

if (!notionSecret || !databaseId) {
  throw new Error("Environment variables for Notion are not set.");
}

const notionClient = new NotionClient({
  auth: notionSecret,
});


export const syncNotionEventsToFirestore = functions.https.onRequest(async (_, response) => {
//export const scheduledSyncNotionEventsToFirestore = functions.pubsub.schedule('0 * * * *').onRun(async (context: functions.EventContext) => {
	try {
		if (!databaseId) {
			throw new Error("Environment variable NOTION_DATABASE_ID is not set.");
		}

		const notionResponse = await notionClient.databases.query({ database_id: databaseId });
		console.log(`Found ${notionResponse.results.length} events in Notion`);

		if (notionResponse.results.length === 0) {
			console.warn("No events found in Notion database");
			response.send("No events found to sync");
			return;
		}

		const writePromises = notionResponse.results.map(async (page: any) => {
			const blockResponse = await notionClient.blocks.children.list({
				block_id: page.id,
			});

			const date = page.properties["Date"]?.date?.start ?? "";
			console.log("date", date);
			const eventDate = date ? new Date(date) : null; 
			console.log("eventDate", eventDate);
			if (!eventDate || eventDate < new Date()) {
				return;
			}

			//const isInPersonOrOnline = page.properties["In Person/Online"]?.select?.name ?? null;
			const hasConfirmedRoom = page.properties["Confirmed Room"]?.multi_select.length > 0;
			//const hasTypeformSignIn = page.properties["Typeform Sign In"]?.url ?? null;
			//const hasTypeformFeedback = page.properties["Typeform Feedback"]?.url ?? null;

			if (!hasConfirmedRoom) {
				return;
			}
			//console.log("isInPersonOrOnline", isInPersonOrOnline);
			//console.log("hasConfirmedRoom", hasConfirmedRoom);

			let description = "";

			for (const block of blockResponse.results) {

				if ('type' in block && block.type === "paragraph" && block.paragraph.rich_text.length > 0) {

					const firstNonEmptyParagraph = block.paragraph.rich_text.find((rt: { plain_text: string }) => 
						rt.plain_text.trim() !== ""
					);
					if (firstNonEmptyParagraph) {
						description = firstNonEmptyParagraph.plain_text;
						break; 
					}
				}
			}
			console.log("description", description);

			const title = page.properties["Name"]?.title[0]?.plain_text ?? "";
			
			if (!title) {
			    return;
			}
			console.log("title", title);

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
			console.log("docId", docId);
			console.log("Setting event:", docId, "With data:", docData);
			console.log(`Attempting to write event ${docId} to Firestore`);
			try {
				await db.collection("events").doc(docId).set(docData, { merge: true });
				console.log(`Successfully wrote event ${docId}`);
				return true;
			} catch (writeError) {
				console.error(`Failed to write event ${docId}:`, writeError);
				return false;
			}
		});

		const results = await Promise.all(writePromises);
		const successCount = results.filter(Boolean).length;
		
		console.log(`Successfully wrote ${successCount} events to Firestore`);
		response.send(`Synced ${successCount} events to Firestore`);
	} catch (error) {
		console.error("Error syncing Notion events to Firestore:", error);
		response.status(500).send(`Error: ${error}`);
	}
});