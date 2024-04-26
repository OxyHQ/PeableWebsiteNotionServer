import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Client } from "@notionhq/client";

function getTimeBasedPrice(amplitude, period, offset) {
  const minutes = new Date().getMinutes();
  const price = amplitude * Math.sin((2 * Math.PI * minutes) / period) + offset;
  return price.toFixed(2);
}

// Example usage:
const amplitude = 2; // Price variation range
const period = 60000; // One full cycle every minute (milliseconds)
const offset = 1; // Base price

const currentPrice = getTimeBasedPrice(amplitude, period, offset);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).send(JSON.stringify({ price: currentPrice }, null, 2));
}
