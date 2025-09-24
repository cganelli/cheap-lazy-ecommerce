import { Handler } from "@netlify/functions";
import { promises as fs } from "fs";
import path from "path";

const handler: Handler = async () => {
  try {
    // Read from the public directory
    const filePath = path.resolve(process.cwd(), "public", "api", "products.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed) ? parsed : [];
    
    return {
      statusCode: 200,
      headers: { 
        "content-type": "application/json",
        "access-control-allow-origin": "*"
      },
      body: JSON.stringify({ items }),
    };
  } catch (err) {
    // Fail safe: never block the page
    return {
      statusCode: 200,
      headers: { 
        "content-type": "application/json",
        "access-control-allow-origin": "*"
      },
      body: JSON.stringify({ items: [] }),
    };
  }
};

export { handler };