import axios from 'axios'
import environtment from '../environtment';
import { getAccessToken } from './userHelper';

const instance = axios.create({
  baseURL: environtment.url
})

export const post = (apiEndpoint, data, headers) => new Promise(async(resolve, reject) => {
  const addHeaders = {...headers}
  const accessToken = getAccessToken()

  if(accessToken){
    addHeaders.Authorization = `Bearer ${accessToken}`
  }

  try {
    const res = await instance.post(apiEndpoint, data, { headers: addHeaders })
    resolve(res)
  } catch(err) {
    reject(err.response)
  } 
})

export const get = (apiEndpoint, headers, noAccess) => new Promise(async(resolve, reject) => {
  const addHeaders = {...headers}
  const accessToken = getAccessToken()

  if(accessToken && !noAccess){
    addHeaders.Authorization = `Bearer ${accessToken}`
  }

  try {
    const res = await instance.get(apiEndpoint, { headers: addHeaders })
    resolve(res)
  } catch(err) {
    reject(err.response)
  } 
})

export const del = (apiEndpoint, data, headers) => new Promise(async(resolve, reject) => {
  const addHeaders = {...headers}
  const accessToken = getAccessToken()

  if(accessToken){
    addHeaders.Authorization = `Bearer ${accessToken}`
  }

  try {
    const res = await instance.delete(apiEndpoint, { headers: addHeaders, data })
    resolve(res)
  } catch(err) {
    reject(err.response)
  } 
})


// const API_URL = 'http://18.140.182.54/api/';

// export class Request {
// 	constructor(baseUrl, bearer = null) {
// 		this.axios = axios.create({
// 			baseURL: baseUrl || API_URL
// 		});

// 		if (bearer) {
// 			this.axios.defaults.headers.common['Authorization'] = `Bearer ${bearer}`;
// 		}

// 		this.axios.defaults.headers.common['Content-Type'] = `application/json`;
// 		this.axios.defaults.headers.common['Accept'] = `application/json`;
//     this.axios.defaults.headers.common['Access-Control-Allow-Origin'] = `*`;
// 	}

// 	// { key: string, value: string }[]
// 	addHeaders(headers) {
// 		if (headers) {
// 			headers.map(header => {
// 				this.axios.defaults.headers.common[header.key] = header.value;
// 			});
// 		}
// 	}

// 	get(url, opts) {
// 		return this.res('get', url, opts);
// 	}

// 	post(url, data, opts) {
// 		return this.res('post', url, data, opts);
// 	}

// 	put(url, data, opts) {
// 		return this.res('put', url, data, opts);
// 	}

// 	del(url, opts) {
// 		return this.res('delete', url, opts);
// 	}

// 	async res(method, url, payload, config) {
// 		url = `${API_URL}${url}`;
// 		var data, error, resp;
// 		try {
// 			resp = await this.axios[method](url, payload, config);
// 			if (resp && resp.data) {
// 				data = resp.data.data;
// 				error = (config && config.errorData) ?  resp.data : resp.data.error;
// 			}
// 		} catch (e) {
// 			if (e && e.response) {
// 				error = (config && config.errorData) ?  e.response.data : e.response.data.error;
// 				if (!error) {
// 					error = e.response.data.message;
// 				}
// 			} else {
// 				console.log(e);
// 			}
// 		}
// 		return [data, error];
// 	}
// }