import { AxiosError } from "axios";
import { z } from "zod";
import { FastMCP } from "fastmcp";
import { createAPIClient } from "./postmanAPI.js";
import Utils from "./Utils.js";

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
		name: "get_all_workspaces",
		description: "사용자의 모든 workspace들을 조회할 수 있습니다.",
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
		name : "get_workspace",
		description : "workspace의 ID로 해당 workspace에 대한 정보를 조회할 수 있습니다. workspace의 id, name 그리고 collection 목록을 포함합니다.",
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
		name : "create_new_request",
		description : "uid에 해당하는 collection에 새로운 request(API)를 추가합니다. collection에 있는 folder의 id를 넣으면 해당 folder에 새로운 request를 추가할 수도 있습니다.",
		parameters: z.object({
			collectionUid: z.string().describe("추가할 collection의 id입니다."),
			folderUid : z.string().optional().describe("추가할 folder의 uid입니다. 값이 있으면, collection의 해당 folder안에 request가 생성됩니다."),
			name: z.string(),                          // 예: "POST request"
			dataMode: z.enum(["raw"]).default("raw").describe("body의 유형을 정합니다.").optional(),                      // 예: "raw"
			// dataMode: z.enum(["raw", "formdata", "none", "urlencoded"]),                      // 예: "raw"
			dataOptions: z.object({                    // dataOptions.raw.language
				raw: z.object({
					language: z.enum(["json"]).default("json"),
				}),
			}).optional(),
			rawModeData: z.string().describe("body에 들어갈 json 문자열입니다.").optional(),                   // JSON 문자열 그대로
			description: z.string().optional(),
			headers: z.string().optional(),
			method: z.enum(["POST","GET","PUT","DELETE","PATCH","HEAD","OPTIONS"]).optional(),                        // 예: "POST"
			url: z.string().describe("API의 URL입니다. path variable은 앞에 :을 붙여주세요. query params는 ?뒤에 적어주세요."),
		}),
		execute: async (args, context) => {
			try {
				const response = await postmanAPI.createItem(args.collectionUid, args, args.folderUid);
				return JSON.stringify(response.status);
			} catch (error) {
				return JSON.stringify(handleApiError(error as AxiosError));
			}
		}
	});

	server.addTool({
		name : "get_all_collections",
		description : "workspace에 상관없이 모든 collection 목록을 조회합니다. collection의 이름, id, uid를 포함합니다.",
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
		name : "get_collection",
		description : "uid에 해당하는 collection의 정보를 조회합니다. collection의 이름, id, uid, description이 있습니다. items는 컬렉션의 최상위 folder와 request 목록입니다.",
		parameters: z.object({
			collectionUid: z.string().describe("Collection UID")
		}),
		execute: async (args, context) => {
			try {
				const response = await postmanAPI.getCollection(args.collectionUid);
				const data = {
					...response.data.collection.info,
					id : response.data.collection.info_postman_id,
					items: response.data.collection.item.map((i: any) => Utils.convertItem(i))
				}
				return JSON.stringify(data);
			} catch (error) {
				return JSON.stringify(handleApiError(error as AxiosError));
			}
		},
		annotations: {
			readOnlyHint: true,
		}
	});

	server.addTool({
		name : "get_all_folders",
		description : "uid에 해당하는 collection의 모든 folder 목록을 조회합니다. folder의 이름, id, uid가 있습니다",
		parameters: z.object({
			collectionUid: z.string().describe("Collection UID")
		}),
		execute: async (args, context) => {
			try {
				const response = await postmanAPI.getCollection(args.collectionUid);
				const items = response.data.collection.item
				const folders = Utils.flatItems(items).filter((i: any) => i.type === "folder")
				return JSON.stringify(folders);
			} catch (error) {
				return JSON.stringify(handleApiError(error as AxiosError));
			}
		},
		annotations: {
			readOnlyHint: true,
		}
	});

	server.addTool({
		name : "get_folder",
		description : "collection에 있는 folder 정보를 조회합니다. folder의 id,uid, name, description, 상위 folder 등이 있습니다. requests에는 하위 request들의 목록이 있습니다. folders에는 하위 folder들의 목록이 있습니다.",
		parameters: z.object({
			collectionId : z.string().describe("조회할 folder가 존재하는 collection의 id 입니다."),
			folderUid : z.string().describe("조회할 folder의 uid입니다.")
		}),
		execute: async (args, context) => {
			try {
				const response = await postmanAPI.getFolder(args.collectionId, args.folderUid);
				const data = response.data.data;

				const folder = {
					collection: data.collection,
					folder: data.folder,
					id : response.data.model_id,
					uid: data.id,
					name: data.name,
					description: data.description,
					folders: data.folders.map((f: any) => ({
						collectionUid: f.collection,
						folderUid: f.folder,
						uid: f.id,
						name: f.name,
						description: f.description,
					})),
					requests: data.requests.map((r: any) => ({
						folderUid: r.folder,
						collectionUid: r.collection,
						uid: r.id,
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
		name : "get_request",
		description : "collection에 있는 uid에 해당하는 request(API) 정보를 조회합니다. reqeust의 id, name, description, folder, url, data, method, params 등이 있습니다.",
		parameters : z.object({
			collectionId : z.string().describe("조회할 request(API)가 존재하는 collection의 id 입니다."),
			requestUid : z.string().describe("조회할 reqeust(API)의 uid입니다.")
		}),
		execute : async (args,context) => {
			const result = await postmanAPI.getRequest(args.collectionId,args.requestUid).then(response => {
				const data = response.data.data;
				const reqeust = {
					collection : data.collection,
					folder : data.folder,
					uid : data.id,
					id : response.data.model_id,
					name : data.name,
					description : data.description,
					dataMode : data.dataMode,
					data : data.data,
					auth : data.auth,
					rawModeData : data.rawModeData,
					headers : data.headers,
					method : data.method,
					url : data.url,
					pathVariables : data.pathVariables,
					queryParams : data.queryParams
				}
				return reqeust;
			}).catch((e : AxiosError)=>{
				return e.message;
			})
			return JSON.stringify(result);
		}
	});

	server.addTool({
		name : "update_request",
		description : "id에 해당하는 collection에 있는 request(API)를 수정합니다.",
		parameters: z.object({
			collectionId: z.string().describe("수정할 collection의 id입니다."),
			requestUid : z.string().describe("수정할 request의 uid입니다."),
			name: z.string(),                          // 예: "POST request"
			dataMode: z.enum(["raw"]).default("raw").describe("body의 유형을 정합니다.").optional(),                      // 예: "raw"
			// dataMode: z.enum(["raw", "formdata", "none", "urlencoded"]),                      // 예: "raw"
			dataOptions: z.object({                    // dataOptions.raw.language
				raw: z.object({
					language: z.enum(["json"]).default("json"),
				}),
			}).optional(),
			rawModeData: z.string().describe("body에 들어갈 json 문자열입니다.").optional(),                   // JSON 문자열 그대로
			description: z.string().optional(),
			headers: z.string().optional(),
			method: z.enum(["POST","GET","PUT","DELETE","PATCH","HEAD","OPTIONS"]).optional(),                        // 예: "POST"
			url: z.string().describe("API의 URL입니다. path variable은 앞에 :을 붙여주세요. query params는 ?뒤에 적어주세요."),
		}),
		execute: async (args, context) => {
			try {
				const response = await postmanAPI.updateItem(args.collectionId, args, args.requestUid);
				return JSON.stringify(response.status);
			} catch (error) {
				return JSON.stringify(handleApiError(error as AxiosError));
			}
		}
	});
}
