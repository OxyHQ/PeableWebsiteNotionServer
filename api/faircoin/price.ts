import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Client } from "@notionhq/client";

function getMinuteBasedRandomPrice(basePrice, variationFactor) {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Simple hash-like function to combine minutes and seconds
  const pseudoSeed = (minutes * 60 + seconds) * 37; // 37 is an arbitrary prime number

  // Use pseudoSeed to influence Math.random()
  const offset = (pseudoSeed % 1000) / 1000; // Number between 0 and 1
  const randomDelta = (offset * 2 - 1) * variationFactor;

  return (basePrice + randomDelta).toFixed(2);
}

const basePrice = 5; // Replace with your desired base price
const variationFactor = 1; // Adjust for desired price variation
const price = getMinuteBasedRandomPrice(basePrice, variationFactor);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).send(JSON.stringify({ price: price }, null, 2));
}
