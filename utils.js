import CryptoJS from 'crypto-js'
import axios from 'axios'

export function _uuid() {
  var d = Date.now()
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    d += performance.now() //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export function _sendAPI(
  endpoint,
  method = 'GET',
  options = { headers: null, data: null, params: null }
) {
  const payload = options.params || options.data || {}
  const headers = options.headers || {}

  if ('client_id' in payload) {
    const signature = _generateSignature(
      payload,
      CryptoJS.enc.Hex.parse(this.clientSecert)
    )
    headers['X-Vault-Signature'] = signature
  }

  const url = `${this.api}/${endpoint}`
  try {
    return axios({
      method,
      url,
      params: options.params,
      data: options.data,
      headers
    })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  } catch (e) {
    throw e
  }
}

export function _generateSignature(data, secret) {
  let query = ''
  if (data && Array.isArray(data)) {
    query = data.join(',')
  } else if (data) {
    const sortedData = _sortObject(data)
    query = Object.keys(sortedData)
      .map(key => `${key}=${sortedData[key]}`)
      .join('&')
  } else if (data) {
    query = data.toString()
  }
  const signature = CryptoJS.HmacSHA512(query, secret)
  return CryptoJS.enc.Hex.stringify(signature)
}

export function _sortObject(o) {
  return Object.keys(o)
    .sort()
    .reduce((r, k) => ((r[k] = o[k]), r), {})
}

export function _randomInt() {
  return Math.floor(Math.random() * 1e17)
}
