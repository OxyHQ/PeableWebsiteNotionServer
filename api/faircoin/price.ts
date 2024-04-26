import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Client } from "@notionhq/client";

// Generate a random price between 1 and 10 with two decimal places
function getRandomPrice() {
  return (Math.random() * 1 + 1).toFixed(2);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const price = getRandomPrice();
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).send(JSON.stringify({ price: price }, null, 2));
}
