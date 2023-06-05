import axios from 'axios'
import environtment from '../environtment';
import { getAccessToken } from './userHelper';

const instance = axios.create({
  baseURL: environtment.url,
  timeout: 20000,
})

export const post = (apiEndpoint, data, headers, noAccess) => new Promise(async(resolve, reject) => {
  const addHeaders = {...headers}
  const accessToken = getAccessToken()

  if(accessToken && !noAccess){
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

export const patch = (apiEndpoint, data, headers) => new Promise(async(resolve, reject) => {
  const addHeaders = {...headers}
  const accessToken = getAccessToken()

  if(accessToken){
    addHeaders.Authorization = `Bearer ${accessToken}`
  }

  try {
    const res = await instance.patch(apiEndpoint, data, { headers: addHeaders })
    resolve(res)
  } catch(err) {
    reject(err.response)
  } 
})