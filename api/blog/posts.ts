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
      database_id: "5ccf9e058fc74c6d81127991f0307b5b",
      filter_properties: ["title", "tD%60A", "Zw%3AK", "otfg", "yCn%40"],
      filter: {
        property: "Published Date",
        date: { before: new Date().toISOString() },
      },
      sorts: [
        {
          property: "Published Date",
          direction: "descending",
        },
      ],
    });

    // Process the Notion data
    const notionData = response.results;

    // Send the Notion data as a JSON response
    const filteredData = notionData.map((item: any) => {
      return {
        id: item.id,
        slug: item.properties.Slug?.formula?.string,
        title: item.properties.Title?.title[0]?.plain_text,
        date: {
          default: item.properties?.["Published Date"]?.date?.start,
          formatted: new Date(
            item.properties?.["Published Date"]?.date?.start
          )?.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
        icon: item.icon?.emoji,
        categories: item.properties.Category?.multi_select?.map(
          (category: any) => {
            return {
              name: category.name,
              color: category.color,
            };
          }
        ),
        featuredImage: item.properties["Featured Image"]?.files[0]?.file.url,
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
