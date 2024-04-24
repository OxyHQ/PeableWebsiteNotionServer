import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Client } from "@notionhq/client";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Initialize Notion client
    const notion = new Client({
      auth: process.env.NOTION_API_KEY, // Store API key securely
    });

    // Retrieve data from your Notion database
    const response = await notion.databases.query({
      database_id: "23883c6d64594d1ebe74f385eda2f554",
    });

    // Process the Notion data
    const notionData = response.results;

    // Send the Notion data as a JSON response
    const filteredData = notionData.map((item: any) => {
      return {
        id: item.id,
        slug: item.properties.Slug?.formula?.string,
        title: item.properties.Page.title[0].plain_text,
        date: {
          default: item.properties?.["Date"]?.date?.start,
          formatted: new Date(
            item.properties?.["Date"]?.date?.start
          )?.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
        icon: item.icon?.emoji,
      };
    });

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(JSON.stringify(filteredData, null, 2));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching Notion data" });
  }
}
