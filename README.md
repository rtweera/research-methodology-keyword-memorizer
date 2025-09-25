# Keyword Memorization App

A Next.js application for memorizing keywords organized by subject modules using drag-and-drop functionality.

## Features

- **Edit Mode**: Create keywords and lesson baskets, organize them by dragging and dropping
- **Play Mode**: Test your memory by dragging keywords to their correct baskets
- **File Management**: Save and load different subjects as JSON files
- **Progress Tracking**: Track mistakes and completion status
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Code Quality

This project uses Biome for linting and formatting:

```bash
# Check and fix linting issues
npm run lint
npm run lint:fix

# Format code
npm run format

# Check and fix both linting and formatting
npm run check
```

## How to Use

1. **Setup**: Add keywords using the "Add" button and create lesson baskets
2. **Organize**: Drag keywords from the pool to their appropriate baskets
3. **Study**: Click "Play Mode" to test your memory
4. **Save**: Export your work as a JSON file for later use
5. **Load**: Import previously saved subjects

## Project Structure

- `src/app/page.js` - Main application component
- `src/app/layout.js` - Root layout with metadata
- `src/app/globals.css` - Global styles and Tailwind imports
- `biome.json` - Biome configuration for linting and formatting
- Configuration files for Next.js, Tailwind, and PostCSS

```bash
npx create-next-app@latest keyword-memorization-app --no-typescript --tailwind --src-dir --app --turbo --no-import-alias
```

## Installation Instructions

1. Run `npx create-next-app@latest keyword-memorization-app --no-typescript --tailwind --src-dir --app --turbo --no-import-alias`

2. Replace the generated files with the code above

3. Install the lucide-react dependency:

   ```bash
   npm install lucide-react
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

This gives you a complete Next.js project matching your specifications:

- ✅ No TypeScript
- ✅ Tailwind CSS enabled
- ✅ src/ directory enabled
- ✅ App Router enabled
- ✅ Turbopack enabled
- ✅ No custom import aliases
- ✅ All functionality preserved from the original React app
