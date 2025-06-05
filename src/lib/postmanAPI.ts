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
			return client.get(`/collections/${uid}`);
		},
		createItem: (collectionUId: string, data: PostmanRequest, folderId?: string) => {
			return client.post(`/collections/${collectionUId}/requests` + (folderId ? "?folder=" + folderId : ""), data);
		},
		updateItem: (collectionId: string, data: PostmanRequest, requestId: string) => {
			return client.put(`/collections/${collectionId}/requests/${requestId}`, data);
		},
		getFolder: (collectionId: string, folderId: string) => {
			return client.get(`/collections/${collectionId}/folders/${folderId}?populate=true&uid=true`);
		},
		getRequest: (collectionId: string, requestId: string) => {
			return client.get(`/collections/${collectionId}/requests/${requestId}?uid=true`);
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
