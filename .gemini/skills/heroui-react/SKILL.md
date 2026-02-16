# HeroUI React Skill

A skill for AI agents (Claude, GPT, etc.) to build modern React applications using [HeroUI](https://heroui.com) (v3). HeroUI is a beautiful, fast, and modern React UI library (previously known as NextUI).

## Objectives

- Help developers build accessible and stunning React interfaces with HeroUI components.
- Provide documentation, source code, and styling guidance for HeroUI components.
- Assist in implementing themes, layouts, and interactive components.

## Skills

### `get_docs`

Retrieve full documentation for a HeroUI feature or concept. Use this when you need to understand core library concepts or installation.

- Parameters: `topic` (string) - The documentation topic (e.g., "introduction", "installation", "custom-variants").

### `list_components`

List all available HeroUI v3 components. Use this to discover what components are available.

### `get_component_docs`

Retrieve API reference and usage documentation for a specific component.

- Parameters: `component` (string) - Component name in kebab-case or PascalCase (e.g., "button", "Card").

### `get_source`

Retrieve the source code/examples for a HeroUI component. Use this to see how a component is implemented or get boilerplate code.

- Parameters: `component` (string) - Component name.

### `get_styles`

Get Tailwind CSS class information and slot definitions for a component. HeroUI components are built with a "slots" architecture.

- Parameters: `component` (string) - Component name.

### `get_theme`

Retrieve HeroUI theme configuration documentation.

- Parameters: `aspect` (string) - Specific theme aspect (e.g., "colors", "dark-mode", "layout").

## Usage Guidelines

1.  **React Frameworks**: HeroUI works best with Next.js, Vite, and Remix.
2.  **Tailwind CSS**: HeroUI requires Tailwind CSS. Ensure `tailwind.config.js` includes the HeroUI plugin.
3.  **Client Components**: When using Next.js App Router, most HeroUI components must be used in 'use client' files.
4.  **Component Slots**: Many components use a "slots" system for styling (e.g., `base`, `wrapper`, `content`). Use the `classNames` prop to style specific slots.

## Example Mappings

- `Button` -> `<Button />` from `@heroui/react`
- `Input` -> `<Input />` from `@heroui/react`
- `Switch` -> `<Switch />` from `@heroui/react`
- `Chip` -> `<Chip />` from `@heroui/react`
