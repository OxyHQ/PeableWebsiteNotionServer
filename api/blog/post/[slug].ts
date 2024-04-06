import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Initialize Notion client
    const notion = new Client({
      auth: process.env.NOTION_API_KEY, // Store API key securely
    });

    // passing notion client to the option
    const n2m = new NotionToMarkdown({
      notionClient: notion,
      config: {
        separateChildPage: true, // default: false
      },
    });

    const mdblocks = await n2m.pageToMarkdown(req.query.slug as string);
    const notionData = n2m.toMarkdownString(mdblocks);

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(JSON.stringify(notionData, null, 2));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching Notion data" });
  }
}
