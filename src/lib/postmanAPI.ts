import axios from "axios";
import {PostmanRequest} from "./PostmanSchemas.js";

export function createAPIClient(apikey : string){
	const client = createAxiosInstance(apikey);

	return {
		getApiKey : ()=>{
			return client.defaults.headers;
		},
		getAllWorkspaces: () => {
			return client.get("/workspaces");
		},
		getWorkspace: (id: string) => {
			return client.get(`/workspaces/${id}`);
		},
		getAllCollections: () => {
			return client.get("/collections");
		},
		getCollection: (uid: string) => {
			return client.get(`/collections/${uid}?model=minimal`);
		},
		createItem: (collectionUId: string, data: PostmanRequest, folderId?: string) => {
			return client.post(`/collections/${collectionUId}/requests` + (folderId ? "$folder=" + folderId : ""), data);
		},
		getFolder: (collectionId: string, folderId: string) => {
			return client.get(`/collections/${collectionId}/folders/${folderId}?populate=true`);
		},
		getRequest: (collectionId: string, requestId: string) => {
			return client.get(`/collections/${collectionId}/requests/${requestId}`);
		}
	}
}




function createAxiosInstance(apiKey : string){
	const axiosInstance = axios.create({
		baseURL : "https://api.getpostman.com",
		headers : {
			"X-API-Key" : `${apiKey}`
		}
	});
	axiosInstance.interceptors.response.use(response=>{
		return response;
	},error=>{
		throw error;
	});
	return axiosInstance;
}
