# GEMINI.md - Project Context

## Project Overview
This is a Node.js-based project titled **AI_P**, designed for AI-driven signal processing and RF engineering calculations. Created by Bon (RF Engineer).

## Project Structure
- `index.js`: Main entry point with a built-in development server and example RF calculations (FSPL).
- `package.json`: Project configuration and scripts.
- `GEMINI.md`: This context file.

## Key Technologies
- **Node.js**: Backend logic and signal modeling.
- **Built-in modules**: `node:http` for the server, `node:fs` for potential signal data logging.

## Building and Running
### Development Server
To run the development server with hot-reloading:
```sh
npm run dev
```

### Production Start
To start the application:
```sh
npm start
```

## Development Conventions
- **Naming**: Use camelCase for variables and functions.
- **RF Parameters**: Always document units (GHz, dBm, km, etc.) and formulas used.
- **Architecture**: Modularize signal analysis functions (e.g., path loss, link budgets) for reuse.

## Developer Context
- **Developer**: Bon (RF Engineer)
- **Focus**: Signal analysis, RF modeling, and AI integration.
- **Current Goal**: Setting up initial RF analysis endpoints and AI-ready data structures.
