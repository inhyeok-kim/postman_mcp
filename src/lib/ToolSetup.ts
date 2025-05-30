import { AxiosError } from "axios";
import { z } from "zod";
import { FastMCP } from "fastmcp";
import { createAPIClient } from "./postmanAPI.js";
import { HttpMethodEnum } from "./PostmanSchemas.js";

/**
 * Error handler for API calls
 * @param error - Axios error
 * @returns Error message
 */
const handleApiError = (error: AxiosError): string => {
	console.error("API Error:", error.message);
	return error.message;
};

/**
 * Setup tools for FastMCP server
 * @param server - FastMCP server instance
 * @param postmanAPI - Postman API client
 */
export default function ToolSetup(server: FastMCP, postmanAPI: ReturnType<typeof createAPIClient>) {
	server.addTool({
		name: "getAllWorkspaces",
		description: "Get all workspaces for the current user",
		execute: async (args, context) => {
			try {
				const response = await postmanAPI.getAllWorkspaces();
				return JSON.stringify(response.data.workspaces);
			} catch (error) {
				return JSON.stringify(handleApiError(error as AxiosError));
			}
		},
		annotations: {
			readOnlyHint: true,
		}
	});

	server.addTool({
		name: "getWorkspace",
		description: "Get workspace information by ID including collections",
		parameters: z.object({
			id: z.string().describe("Workspace ID")
		}),
		execute: async (args, context) => {
			try {
				const response = await postmanAPI.getWorkspace(args.id);
				return JSON.stringify(response.data.workspace);
			} catch (error) {
				return JSON.stringify(handleApiError(error as AxiosError));
			}
		},
		annotations: {
			readOnlyHint: true,
		}
	});

	server.addTool({
		name: "createNewRequest",
		description: "Add a new request (API) to a collection",
		parameters: z.object({
			uid: z.string().describe("Collection UID to add the request to"),
			folderId: z.string().optional().describe("Folder ID to add the request to (optional)"),
			name: z.string().describe("Request name"),
			dataMode: z.enum(["raw", "formdata", "none", "urlencoded"]).default("raw")
				.describe("Type of request body").nullable().optional(),
			dataOptions: z.object({
				raw: z.object({
					language: z.enum(["json"]).default("json"),
				}),
			}).nullable().optional(),
			rawModeData: z.string().describe("JSON string for the request body").nullable().optional(),
			description: z.string().nullable().optional().describe("Request description"),
			headers: z.string().nullable().optional().describe("Request headers"),
			method: HttpMethodEnum.nullable().optional().describe("HTTP method"),
			url: z.string().describe("API URL. Use :paramName for path variables and standard query string format"),
		}),
		execute: async (args, context) => {
			try {
				const response = await postmanAPI.createItem(args.uid, args, args.folderId);
				return JSON.stringify(response.status);
			} catch (error) {
				return JSON.stringify(handleApiError(error as AxiosError));
			}
		}
	});

	server.addTool({
		name: "getAllCollections",
		description: "Get all collections regardless of workspace",
		execute: async (args, context) => {
			try {
				const response = await postmanAPI.getAllCollections();
				return JSON.stringify(response.data.collections);
			} catch (error) {
				return JSON.stringify(handleApiError(error as AxiosError));
			}
		},
		annotations: {
			readOnlyHint: true,
		}
	});

	server.addTool({
		name: "getCollection",
		description: "Get collection information by UID including folders and requests",
		parameters: z.object({
			uid: z.string().describe("Collection UID")
		}),
		execute: async (args, context) => {
			try {
				const response = await postmanAPI.getCollection(args.uid);
				return JSON.stringify(response.data.collection);
			} catch (error) {
				return JSON.stringify(handleApiError(error as AxiosError));
			}
		},
		annotations: {
			readOnlyHint: true,
		}
	});

	server.addTool({
		name: "getFolder",
		description: "Get folder information by ID including subfolders and requests",
		parameters: z.object({
			collectionUid: z.string().describe("Collection UID containing the folder"),
			folderId: z.string().describe("Folder ID to retrieve")
		}),
		execute: async (args, context) => {
			try {
				const response = await postmanAPI.getFolder(args.collectionUid, args.folderId);
				const data = response.data.data;

				const folder = {
					collection: data.collection,
					folder: data.folder,
					id: data.id,
					name: data.name,
					description: data.description,
					folders: data.folders.map((f: any) => ({
						collection: f.collection,
						folder: f.folder,
						id: f.id,
						name: f.name,
						description: f.description,
					})),
					requests: data.requests.map((r: any) => ({
						folder: r.folder,
						collection: r.collection,
						id: r.id,
						name: r.name,
						description: r.description,
						method: r.method,
						url: r.url
					}))
				};

				return JSON.stringify(folder);
			} catch (error) {
				return JSON.stringify(handleApiError(error as AxiosError));
			}
		}
	});

	server.addTool({
		name: "getRequest",
		description: "Get request (API) information by ID",
		parameters: z.object({
			collectionUid: z.string().describe("Collection UID containing the request"),
			requestId: z.string().describe("Request ID to retrieve")
		}),
		execute: async (args, context) => {
			try {
				const response = await postmanAPI.getRequest(args.collectionUid, args.requestId);
				const data = response.data.data;

				const request = {
					collection: data.collection,
					folder: data.folder,
					id: data.id,
					name: data.name,
					description: data.description,
					dataMode: data.dataMode,
					data: data.data,
					auth: data.auth,
					rawModeData: data.rawModeData,
					headers: data.headers,
					method: data.method,
					url: data.url,
					pathVariables: data.pathVariables,
					queryParams: data.queryParams
				};

				return JSON.stringify(request);
			} catch (error) {
				return JSON.stringify(handleApiError(error as AxiosError));
			}
		}
	});
}
