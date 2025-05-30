import { z } from "zod";

// queryParams 항목 스키마
export const QueryParamSchema = z.object({
	key: z.string(),
	value: z.string(),
	description: z.string().nullable().optional(),
	enabled: z.boolean().nullable().optional(),
});

// pathVariableData 항목 스키마
export const PathVariableDataSchema = z.object({
	key: z.string(),
	value: z.string(),
	description: z.string().nullable().optional(),
});

export const HeaderSchema = z.object({
	key : z.string(),
	value : z.string(),
}).describe("header 객체 입니다.")

// 전체 요청 스키마
export const PostmanRequestSchema = z.object({
	name: z.string(),                          // 예: "POST request"
	dataMode: z.enum(["raw"]).default("raw").describe("body의 유형을 정합니다.").nullable().optional(),                      // 예: "raw"
	// dataMode: z.enum(["raw", "formdata", "none", "urlencoded"]),                      // 예: "raw"
	dataOptions: z.object({                    // dataOptions.raw.language
		raw: z.object({
			language: z.enum(["json"]).default("json"),
		}),
	}).nullable().optional(),
	rawModeData: z.string().describe("body에 들어갈 json 문자열입니다.").nullable().optional(),                   // JSON 문자열 그대로
	description: z.string().nullable().optional().describe("해당 request(api)에 대한 간략한 설명입니다."),
	headers: z.string().nullable().optional(),               // 예: "Content-Type: application/json\n"
	method: z.enum(["POST","GET","PUT","DELETE","PATCH","HEAD","OPTIONS"]).nullable().optional(),                        // 예: "POST"
	url: z.string(),                           // 예: "https://postman-echo.com/user/:id?active={{boolean}}"
	// queryParams: z.array(QueryParamSchema).nullable().optional(),
	// pathVariables: z.record(z.string()).nullable().optional(),       // 동적 키(id 등)에 대응
	// pathVariableData: z.array(PathVariableDataSchema).nullable().optional(),
});

// 타입 추출 예시
export type PostmanRequest = z.infer<typeof PostmanRequestSchema>;

// 사용 예시
// const parsed = PostmanRequestSchema.parse(yourJsonObject);
