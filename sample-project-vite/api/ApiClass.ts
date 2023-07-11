import { AxiosRequestConfig, AxiosInstance } from 'axios'
import qs from 'query-string'
import { replaceUrlFn } from '@/utils/stringUtils'
import { getLocalStorageObject, LocalStorageKeys } from '@/utils/localStorage'

type AppAxiosRequestConfig = AxiosRequestConfig & {
  replaceUrl?: ReplaceUrl
  needFullAxiosResp?: boolean
}

function filterNonNull(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => {
      return !isNaN(v as any) || (v && (v as string).length)
    })
  )
}

export class ApiClass {
  headers: Record<string, string> = {}

  // eslint-disable-next-line no-useless-constructor
  constructor(private axios: AxiosInstance) {}

  request(options: AppAxiosRequestConfig) {
    const { token } = getLocalStorageObject(LocalStorageKeys.USER)
    this.headers.Authorization = `Bearer ${token}`
    const { needFullAxiosResp, replaceUrl } = options
    let { url } = options

    if (url && replaceUrl) url = replaceUrlFn(url, replaceUrl)

    return this.axios
      .request({
        ...options,
        url,
        headers: {
          ...this.headers,
          ...options.headers,
        },
        params: filterNonNull({ ...options.params }),
        //@ts-ignore
        paramsSerializer: {
          serialize: (params: any) => qs.stringify(params, { arrayFormat: 'none' }),
        },

        // loading progress
        // onUploadProgress: (p) => {
        //   console.log(p);
        //   //this.setState({
        //   //fileprogress: p.loaded / p.total
        //   //})
        // }
      })
      .then((resp) => {
        if (needFullAxiosResp) {
          return resp
        }

        return resp.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  get(url: string, options?: AppAxiosRequestConfig) {
    return this.request({
      ...options,
      method: 'GET',
      url,
    })
  }

  post(url: string, data: any, options?: AppAxiosRequestConfig) {
    return this.request({
      ...options,
      method: 'POST',
      data: { ...data },
      url,
    })
  }

  put(url: string, data: any, options?: AppAxiosRequestConfig) {
    return this.request({
      ...options,
      method: 'PUT',
      data,
      url,
    })
  }

  delete(url: string, options?: AppAxiosRequestConfig) {
    return this.request({
      ...options,
      method: 'DELETE',
      url,
    })
  }

  options(url: string, options?: AppAxiosRequestConfig) {
    return this.request({
      ...options,
      method: 'OPTIONS',
      url,
    })
  }
}
