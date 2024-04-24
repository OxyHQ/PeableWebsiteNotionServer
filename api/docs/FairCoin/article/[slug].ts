import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Initialize Notion client
    const notion = new Client({
      auth: process.env.NOTION_API_KEY, // Store API key securely
    });

    const response = await notion.databases.query({
      database_id: "23883c6d64594d1ebe74f385eda2f554",
    });

    // passing notion client to the option
    const n2m = new NotionToMarkdown({
      notionClient: notion,
      config: {
        separateChildPage: true, // default: false
      },
    });

    const mdblocks = await n2m.pageToMarkdown(response.results[0].id);
    const notionData = {
      title: response.results[0]?.properties?.Title?.title[0]?.plain_text,
      content: n2m.toMarkdownString(mdblocks)?.parent,
      date: {
        default: response.results[0]?.properties?.["Date"]?.date?.start,
        formatted: new Date(
          response.results[0]?.properties?.["Date"]?.date?.start
        )?.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(JSON.stringify(notionData, null, 2));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching Notion data" });
  }
}
