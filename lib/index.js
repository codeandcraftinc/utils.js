import Promise from 'bluebird'
import { forOwn, isArray, isObject, merge } from 'lodash'

/**
 * @todo
 */
export function promiseFor(condition, action, value) {
  if (condition(value)) {
    return Promise.resolve(value)
  }

  return action(value).then(promiseFor.bind(null, condition, action))
}

/**
 * @todo
 */
export function isDev() {
  return process.env.NODE_ENV === 'development'
}

/**
 * @todo
 */
export function isProd() {
  return process.env.NODE_ENV === 'production'
}

/**
 * @todo
 */
export function isTest() {
  return process.env.NODE_ENV === 'testing'
}

/**
 * Normalize an object recursively
 *
 * Alphabetize an object by key, sort inner arrays, etc.
 * @todo
 *
 * @todo
 * @return {object} - A normalized object
 */
export function normalizeObject(obj) {
  if (!isObject(obj)) {
    return obj
  }

  let normalized = {}

  Object.keys(obj).sort().forEach((key) => {
    let val = obj[key]

    if (Array.isArray(val)) {
      val = val.sort()
    } else {
      val = normalizeObject(val)
    }

    normalized[key] = val
  })

  return normalized
}

/**
 * Recursively flatten an object into key/value pairs
 *
 * @param {Object} obj The object to be flattened.
 * @param {string} [separator=.] The string to insert between merged keys.
 * @param {string} [prefix=''] An optional prefix to prepend to top-level keys.
 * @param {number} [depth=-1] The max hierarchical depth to merge into the top-level.
 * @return {Object} The flattened object.
 */
export function flattenObject(obj, separator = '.', prefix = '', depth = -1) {
  if (!isObject(obj)) {
    return obj
  }

  let flattened = {}

  forOwn(obj, (v, k) => {
    let key = prefix ? [prefix, k].join(separator) : k

    if (isObject(v) && !isArray(v) && depth > 0) {
      merge(flattened, flattenObject(v, separator, key, depth - 1))
    } else {
      flattened[key] = v
    }
  })

  return flattened
}
