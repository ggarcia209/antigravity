---
trigger: always_on
---

# React Development Rules

Rules for development with the React UI framework.

## General Rules

- Always use responsive design principles and design for both mobile and desktop views unless otherwise specified.
- Use component libraries (ex: Mantine, MUI, Radix, Chakra, etc...) when designing components.
- Follow DRY and create re-usable components for use throughout the application. Even if a component will not be re-used within the immediate scope of your work, make it re-usable if it could possibly be re-used in the future (ex: Titles, buttons, form inputs, etc...)
- Components should be simple with a straightforward purpose. Break overly complex components down into smaller Components.
- Keep use of base HTML types (`<div>`, `<p>`, `<text`>, ...) to an absolute minimum.
- Component styles should exist as CSS files wherever possible. Keep inline styling to absolute minimum.
- Each component must have unit tests.
- Use themes / re-usable styles to maintain consistent branding across the app and code maintainability.
- Don't use `<div>` wherever a common core component (Stack, Grid, Box, etc...) can be used.
- You must minimize duplicated code. Do not recreate any existing component logic that can be moved into a shared component. Deconstuct component code into new common component files if necessary.
- All code must be formatted before committing.
- All code must pass linting check (use latest ES lint version) without any errors or warnings.
- All code must pass typecheck without any errors or warnings.
- All code must successfully build without any errors.
