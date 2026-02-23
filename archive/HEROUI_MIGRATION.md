# HeroUI Migration Documentation

## Overview

This document summarizes the migration from **DaisyUI** to **HeroUI** in the `sports2-frontend` project. The goal was to modernize the UI component library while maintaining theme-aware accessibility and premium aesthetics.

## Component Mappings

| Element / Class         | Target HeroUI Component | Props / Variants                                |
| :---------------------- | :---------------------- | :---------------------------------------------- |
| `.loading-spinner`      | `<Spinner />`           | `size="sm"`, `size="lg"`                        |
| `.toggle`               | `<Switch />`            | `defaultSelected`, `onValueChange`              |
| `.checkbox`             | `<Checkbox />`          | `isSelected`, `onValueChange`                   |
| `tab`, `tab-active`     | `<Tabs>`, `<Tab>`       | `variant="underlined"`, `color="primary"`       |
| `.badge`                | `<Chip />`              | `color`, `variant="bordered"`, `variant="flat"` |
| `.btn`                  | `<Button />`            | `color`, `variant`, `isIconOnly`, `fullWidth`   |
| `button` / `Link` / `a` | `<Button />`            | `as={Link}`, `as="a"`                           |

## Migration Phases

### ✅ Phase A: Spinner Migration

- Replaced approximately **60 instances** across **36 files**.
- Automated conversion of DaisyUI loading classes to HeroUI `<Spinner />`.

### ✅ Phase B: Switch & Checkbox Migration

- Replaced **31 instances** across **12 files**.
- Safely handled controlled (`checked`) and uncontrolled (`defaultChecked`) components.
- Excluded checkboxes using `react-hook-form`'s `register()` to preserve form integrity.

### ✅ Phase C: Tabs Migration

- Verified that all major tab implementations were already using HeroUI.

### ✅ Phase D: Badge → Chip Migration

- Replaced DaisyUI badges with HeroUI `<Chip />` in **27 files**.
- Mapped DaisyUI colors (primary, success, error) to HeroUI semantic colors.

### ✅ Phase E: Button Migration

- The largest structural change: migrated **350+ buttons** in **60+ files**.
- Handled nested JSX logic and arrow functions safely using a custom parser.
- Converted functional DaisyUI classes (`btn-circle`, `btn-block`) to HeroUI props (`isIconOnly`, `fullWidth`).

## Visual & Build Verification

- **Build Status**: `npm run build` passed successfully after all phases.
- **Theme Support**: Components correctly inherit the professional Executive Oxford (dark) theme.
- **Responsive Design**: Button and Spinner sizes remain consistent with the original layout.

## How to Proceed with New Components

When adding new UI elements, always prefer HeroUI components from `@heroui/react`. Avoid adding new DaisyUI classes (e.g., `btn`, `badge`, `tab`) to ensure consistency.

---

_Last Updated: February 16, 2026_
