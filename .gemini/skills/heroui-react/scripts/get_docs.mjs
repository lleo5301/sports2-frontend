#!/usr/bin/env node
/**
 * Retrieve general HeroUI documentation by topic.
 *
 * Usage:
 *   node get_docs.mjs <topic>
 *
 * Examples:
 *   node get_docs.mjs installation
 *   node get_docs.mjs custom-variants
 */

const API_BASE = process.env.HEROUI_API_BASE || "https://mcp-api.heroui.com";
const APP_PARAM = "app=react-skills";

async function fetchApi(endpoint) {
  const url = `${API_BASE}${endpoint}?${APP_PARAM}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "HeroUI-Skill/1.0" },
    });

    if (!response.ok) return { error: `HTTP ${response.status}` };
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

async function main() {
  const topic = process.argv[2] || "introduction";
  const data = await fetchApi(`/v1/docs/${topic}`);

  if (data.error) {
    console.error(`Error: ${data.error}`);
    process.exit(1);
  }

  console.log(JSON.stringify(data, null, 2));
}

main();
