#!/usr/bin/env node
/**
 * Retrieve documentation for a specific HeroUI component.
 *
 * Usage:
 *   node get_component_docs.mjs <component_name>
 *
 * Examples:
 *   node get_component_docs.mjs button
 *   node get_component_docs.mjs Card
 */

const API_BASE = process.env.HEROUI_API_BASE || "https://mcp-api.heroui.com";
const APP_PARAM = "app=react-skills";

/**
 * Fetch data from HeroUI API.
 */
async function fetchApi(endpoint) {
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${API_BASE}${endpoint}${separator}${APP_PARAM}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "HeroUI-Skill/1.0" },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Component not found" };
      }
      return { error: `HTTP ${response.status}: ${response.statusText}` };
    }

    return await response.json();
  } catch (error) {
    return { error: `API Error: ${error.message}` };
  }
}

async function main() {
  const componentName = process.argv[2];

  if (!componentName) {
    console.error("Usage: node get_component_docs.mjs <component_name>");
    process.exit(1);
  }

  // Convert to kebab-case for API
  const kebabName = componentName
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();

  const data = await fetchApi(`/v1/docs/components/${kebabName}`);

  if (data.error) {
    console.error(`Error: ${data.error}`);
    process.exit(1);
  }

  console.log(JSON.stringify(data, null, 2));
}

main();
