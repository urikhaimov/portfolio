import { stub } from '@/utils/function';

/**
 * @export
 * @param {Map} [cache]
 * @param {function} [callback]
 * @param {number} [expiredAt]
 * @description Function called memoizePromise that takes a function that
 * returns a promise as input and return memoized version of the function.
 * @example
 * function fetchTodo(id) {
 *   return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
 *     .then((response) => response.json())
 *     .then((json) => json);
 * }
 *
 * async function getTodos() {
 *
 *   // Here the higher order function is called
 *   let cachedFetchTodos = memoizePromise(fetchTodo);
 *
 *   let response1 = await cachedFetchTodos(1); // Call to server with id 1
 *   let response2 = await cachedFetchTodos(2); // Call to server with id 2
 *   let response3 = await cachedFetchTodos(1); // id is 1, will be served from cache
 *   let response4 = await cachedFetchTodos(3); // Call to server with id 3
 *   let response5 = await cachedFetchTodos(2); // id is 2, will be served from cache
 *
 *   // Total number of calls - 3
 * }
 *
 * getTodos();
 * @return {*}
 */
export const memoizePromise = (
    {
      cache = new Map(),
      callback = stub,
      expiredAt = 10000
    }) => {

  return async (...args) => {
    const api = JSON.stringify(args);

    if (cache.has(api)) {
      const { createdAt, response } = cache.get(api);

      if (createdAt + expiredAt > +(new Date)) {
        if (DEBUG) {
          console.debug('Cached data', {
            api,
            response: await response
          });
        }

        return response;

      } else {

        // Delete cache entry if expired
        cache.delete(api);
      }
    }

    cache.set(api, {
      createdAt: +(new Date),
      response: callback(...args).catch((error) => {
        // Delete cache entry if API call fails
        cache.delete(api);
        return Promise.reject(error);
      })
    });

    return cache.get(api).response;
  };
};