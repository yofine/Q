/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useContext } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { isFunction, getDataField } from './utils'
import { QContext } from './context'
import { create as createRequest, CreateAxiosDefaults } from './request'

export interface IParams {
  [key: string]: any
}

export interface IQueryProps {
  children: React.ReactElement
  url?: string
  method?: 'get' | 'post' | 'put' | 'delete' | 'option'
  params?: IParams
  onBefore(params: any): void
  onError(e: Error, params: any): void
  onSuccess(data: any, params: any): void
  onFinally(params: any, data: any, error: Error): void
  formatter<T>(res: T): T
}

export interface IConfig {
  request?: CreateAxiosDefaults
  [key: string]: any
}

const Query: React.FC<IQueryProps> = (props) => {
  const { children, url, method = 'get', params, onError, onSuccess, onFinally, onBefore, formatter } = props

  const config: IConfig = useContext(QContext)

  useEffect(() => {
    createRequest(config.request)
  }, [])

  const dataField: string = getDataField(children)

  const [data, setData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error>()

  const fetchData = useCallback(async () => {
    let error
    try {
      isFunction(onBefore) && onBefore(params)
      setLoading(true)
      let res = await fetch.request({ method, url, params })
      if (formatter && isFunction(formatter)) {
        res = formatter(res)
      }
      setData(res)
      isFunction(onSuccess) && onSuccess(res, params)
    } catch (err: any) {
      error = err
      setError(err)
      isFunction(onError) && onError(err, params)
    }
    setLoading(false)
    onFinally(params, data, error)
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const THE_REAL_CHILDREN = React.cloneElement(children, {
    [dataField]: data,
    params,
    loading,
    error,
  })

  return <ErrorBoundary fallback={<div>Something went wrong</div>}>{THE_REAL_CHILDREN}</ErrorBoundary>
}

export default Query
