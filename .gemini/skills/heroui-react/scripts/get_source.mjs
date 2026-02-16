const API_BASE = "https://mcp-api.heroui.com";
const APP_PARAM = "app=antigravity";

async function main() {
  const component = process.argv[2];
  if (!component) {
    console.error("Error: Component name required");
    process.exit(1);
  }

  const kebabName = component
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();

  try {
    const response = await fetch(
      `${API_BASE}/v1/source/${kebabName}?${APP_PARAM}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
