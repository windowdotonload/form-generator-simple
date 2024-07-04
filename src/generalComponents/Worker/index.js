let WORKER = null;
let CALLBACKS_MAP = {};
let cacheFunc = [];
export const generateWorker = (callbacksMap = {}, path = "/static/lib/Worker/worker.js", options = { name: "debug_worker", type: "module" }) => {
  if (cacheFunc.length) {
    const curKeys = Object.keys(callbacksMap);
    curKeys.forEach(cbKey => {
      const index = cacheFunc.findIndex(cacheItem => cacheItem.cacheFuncKey === cbKey);
      if (index < 0) return;
      callbacksMap[cbKey].func(cacheFunc[index].cacheFuncData);
      cacheFunc.splice(index, 1);
    });
  }
  Object.assign(CALLBACKS_MAP, callbacksMap);
  return (
    WORKER ||
    (() => {
      const worker = new Worker(path, options);
      worker.onmessage = e => {
        const { triggerFuncKey, data } = e.data;
        if (triggerFuncKey in CALLBACKS_MAP) {
          CALLBACKS_MAP[triggerFuncKey].func(data);
        } else {
          cacheFunc.push({ cacheFuncKey: triggerFuncKey, cacheFuncData: data });
        }
      };
      return (WORKER = {
        postMessage: data => worker.postMessage(data),
        terminate: () => {
          worker.terminate();
          WORKER = null;
          CALLBACKS_MAP = {};
          cacheFunc = [];
        }
      });
    })()
  );
};
