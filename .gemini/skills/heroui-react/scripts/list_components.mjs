#!/usr/bin/env node
/**
 * List all available HeroUI v3 components.
 */

const API_BASE = process.env.HEROUI_API_BASE || "https://mcp-api.heroui.com";
const APP_PARAM = "app=react-skills";
const LLMS_TXT_URL = "https://v3.heroui.com/react/llms.txt";

async function fetchApi(endpoint) {
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${API_BASE}${endpoint}${separator}${APP_PARAM}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "HeroUI-Skill/1.0" },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function fetchFallback() {
  try {
    const response = await fetch(LLMS_TXT_URL);
    if (!response.ok) return null;
    const content = await response.text();
    const components = [];
    let inComponentsSection = false;

    for (const line of content.split("\n")) {
      if (line.trim() === "### Components") {
        inComponentsSection = true;
        continue;
      }
      if (inComponentsSection && line.trim().startsWith("### ")) break;
      if (inComponentsSection) {
        const match = line.match(
          /^\s*-\s*\[([^\]]+)\]\(https:\/\/v3\.heroui\.com\/docs\/react\/components\/[a-z]/,
        );
        if (match) components.push(match[1]);
      }
    }
    return components.length > 0
      ? {
          components: components.sort(),
          count: components.length,
          latestVersion: "unknown",
        }
      : null;
  } catch (error) {
    return null;
  }
}

async function main() {
  let data = await fetchApi("/v1/components");
  if (!data || !data.components || data.components.length === 0) {
    data = await fetchFallback();
  }

  if (!data) {
    console.error("Error: Failed to fetch component list");
    process.exit(1);
  }

  console.log(JSON.stringify(data, null, 2));
}

main();
