/* eslint-disable */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Client as NotionClient } from "@notionhq/client";

admin.initializeApp();
const db = admin.firestore();

export const syncNotionEventsToFirestore = functions
  .runWith({
    enforceAppCheck: false,
    minInstances: 0,
    ingressSettings: 'ALLOW_ALL'
  })
  .https.onRequest(async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', '*');

    if (request.method === 'OPTIONS') {
      response.status(204).send('');
      return;
    }

    try {
      const notionKey = functions.config().notion?.key;
      const notionDatabaseId = functions.config().notion?.database_id;

      if (!notionKey || !notionDatabaseId) {
        throw new Error('Environment variables for Notion are not set.');
      }

      const notion = new NotionClient({ auth: notionKey });

      const notionResponse = await notion.databases.query({ database_id: notionDatabaseId });
      console.log(`Found ${notionResponse.results.length} events in Notion`);

      if (notionResponse.results.length === 0) {
        console.warn("No events found in Notion database");
        response.send("No events found to sync");
        return;
      }

      const writePromises = notionResponse.results.map(async (page: any) => {
        const date = page.properties["Date"]?.date?.start ?? "";
        const eventDate = date ? new Date(date) : null;

        if (!eventDate || eventDate < new Date()) {
          return;
        }

        const hasConfirmedRoom = page.properties["Confirmed Room"]?.multi_select.length > 0;
        if (!hasConfirmedRoom) {
          return;
        }

        const title = page.properties["Name"]?.title[0]?.plain_text ?? "";
        if (!title) {
          return;
        }

        const docData = {
          title,
          date: eventDate,
          place: page.properties["Confirmed Room"]?.multi_select.map((select: any) => select.name).join(", ") ?? "",
          visible: page.properties["Visible On Website"]?.checkbox ?? false,
          icon: page.icon?.emoji ?? "✏️",
        };

        const sanitizedTitle = title.replace(/\W+/g, "").toLowerCase();
        const docId = `${sanitizedTitle}_${page.id.replace(/-/g, "").substring(0, 6)}`;

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
