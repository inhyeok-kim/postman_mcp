#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import {createAPIClient} from "./lib/postmanAPI.js";
import ToolSetup from "./lib/ToolSetup.js";

try {
	const server = new FastMCP({
		name: "My Server",
		version: "1.0.0",
	});
	const postmanAPI = createAPIClient(process.env.API_KEY!);

	ToolSetup(server, postmanAPI);

	// server.start({
	// 	transportType: "httpStream",
	// 	httpStream : {
	// 		port : 8080
	// 	}
	// });
	server.start({
		transportType : "stdio"
	})
} catch (e) {
	console.error(e);
}
