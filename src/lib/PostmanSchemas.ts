import { z } from "zod";

/**
 * Schema for query parameters in a Postman request
 */
export const QueryParamSchema = z.object({
	key: z.string(),
	value: z.string(),
	description: z.string().nullable().optional(),
	enabled: z.boolean().default(true).nullable().optional(),
});

/**
 * Schema for path variables in a Postman request
 */
export const PathVariableSchema = z.object({
	key: z.string(),
	value: z.string(),
	description: z.string().nullable().optional(),
});

/**
 * Schema for headers in a Postman request
 */
export const HeaderSchema = z.object({
	key: z.string(),
	value: z.string(),
}).describe("Header object definition");

/**
 * HTTP methods supported by Postman
 */
export const HttpMethodEnum = z.enum([
	"GET",
	"POST",
	"PUT",
	"DELETE",
	"PATCH",
	"HEAD",
	"OPTIONS"
]);

/**
 * Schema for a Postman request
 */
export const PostmanRequestSchema = z.object({
	name: z.string(),
	dataMode: z.enum(["raw", "formdata", "none", "urlencoded"]).default("raw")
		.describe("Type of request body").nullable().optional(),
	dataOptions: z.object({
		raw: z.object({
			language: z.enum(["json"]).default("json"),
		}),
	}).nullable().optional(),
	rawModeData: z.string().describe("JSON string for the request body").nullable().optional(),
	description: z.string().nullable().optional().describe("Brief description of the request"),
	headers: z.string().nullable().optional(),
	method: HttpMethodEnum.nullable().optional(),
	url: z.string().describe("API URL. Use :paramName for path variables and standard query string format"),
	queryParams: z.array(QueryParamSchema).nullable().optional(),
	pathVariables: z.record(z.string()).nullable().optional(),
	pathVariableData: z.array(PathVariableSchema).nullable().optional(),
});

/**
 * Type definition for a Postman request
 */
export type PostmanRequest = z.infer<typeof PostmanRequestSchema>;

/**
 * Type definition for HTTP methods
 */
export type HttpMethod = z.infer<typeof HttpMethodEnum>;