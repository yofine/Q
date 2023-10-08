import axios, { CreateAxiosDefaults, AxiosInstance } from 'axios'

export type { CreateAxiosDefaults } from 'axios'

let instance: AxiosInstance = axios.create()

export const create = (config: CreateAxiosDefaults = {}) => {
  const _instance = axios.create(config)

  instance = _instance

  return _instance
}

export default instance
