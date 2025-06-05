#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import { createAPIClient } from "./lib/postmanAPI.js";
import ToolSetup from "./lib/ToolSetup.js";

/**
 * Main application entry point
 */
function main() {
	try {
		// Check for API key
		const apiKey = process.env.API_KEY;
		if (!apiKey) {
			throw new Error("API_KEY environment variable is required");
		}

		// Create server instance
		const server = new FastMCP({
			name: "Postman MCP",
			version: "1.0.0",
		});

		// Create API client
		const postmanAPI = createAPIClient(apiKey);

		// Setup tools
		ToolSetup(server, postmanAPI);

		// Start server
		server.start({
			transportType: "stdio"
		});

		// console.log("Server started successfully");
	} catch (error) {
		// console.error("Server initialization failed:", error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}

// Run the application
main();
