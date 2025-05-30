import axios from "axios";
import {PostmanRequest} from "./PostmanSchems.js";

export function createAPIClient(apikey : string){
	const client = createAxiosInstance(apikey);

	return {
		getApiKey : ()=>{
			return client.defaults.headers;
		},
		get_all_workspaces : () => {
			return client.get("/workspaces");
		},
		get_workspace : (id : string) => {
			return client.get(`/workspaces/${id}`);
		},
		get_all_collections : () => {
			return client.get("/collections");
		},
		get_collection : (uid : string) => {
			return client.get(`/collections/${uid}?model=minimal`);
		},
		create_item : (collectionUId : string, data : PostmanRequest) => {
			return client.post(`/collections/${collectionUId}/requests`,data);
		},
		get_folder : (collectionId : string, folderId : string)=>{
			return client.get(`/collections/${collectionId}/folders/${folderId}?populate=true`);
		},
		get_request : (collectionId : string, requestId : string)=>{
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
