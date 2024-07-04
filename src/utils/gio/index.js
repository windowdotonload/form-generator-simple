import "./directives";
const gio = window.gio;

let specFuncCache = {};
const specTrackModule = require.context("./specTrack", true, /\.js$/);
specTrackModule.keys().forEach(key => {
  const specTrack = specTrackModule(key).default;
  specFuncCache = Object.assign(specFuncCache, specTrack);
});

export const findValueCodeCorresponding = (sourceData, targetFindValue, findCode, returnKey, treeData = false) => {
  let result = null;
  if (treeData) {
    let find = (data, targetFindValue, findCode, returnKey) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i][findCode] == targetFindValue) {
          result = data[i][returnKey];
          break;
        } else if (data[i].children && data[i].children.length) {
          find(data[i].children, targetFindValue, findCode, returnKey);
        }
      }
    };
    find(sourceData, targetFindValue, findCode, returnKey);
  } else {
    sourceData.forEach(item => {
      if (item[findCode] == targetFindValue) {
        result = item[returnKey];
      }
    });
  }
  return result;
};

export const SetUserId = userId => {
  gio("setUserId", userId);
};

export const ClearUserId = () => {
  gio("clearUserId");
};

export const Track = (eventId, eventLevelVariables) => {
  gio("track", eventId, eventLevelVariables);
};

export const PageSet = (key, value, pageLevelVariables) => {
  if (typeof key == "string") {
    gio("page.set", key, value);
  } else if (typeof key == "object") {
    pageLevelVariables = { ...key };
    gio("page.set", pageLevelVariables);
  }
};

export const EvarSet = (key, value, pageLevelVariables) => {
  if (typeof key == "string") {
    gio("evar.set", key, value);
  } else if (typeof key == "object") {
    pageLevelVariables = { ...key };
    gio("evar.set", pageLevelVariables);
  }
};

export const PeopleSet = (key, value, pageLevelVariables) => {
  if (typeof key == "string") {
    gio("people.set", key, value);
  } else if (typeof key == "object") {
    pageLevelVariables = { ...key };
    gio("people.set", pageLevelVariables);
  }
};

export const VisitorSet = (key, value, pageLevelVariables) => {
  if (typeof key == "string") {
    gio("visitor.set", key, value);
  } else if (typeof key == "object") {
    pageLevelVariables = { ...key };
    gio("visitor.set", pageLevelVariables);
  }
};

export const GIORAW = {
  SetUserId,
  ClearUserId,
  Track,
  PageSet,
  EvarSet,
  PeopleSet,
  VisitorSet,
  findValueCodeCorresponding,
  ...specFuncCache
};

const GIO = new Proxy(GIORAW, {
  get(target, key, receiver) {
    if (key in target) return target[key];
    target[key] = args => {
      Track(key, args);
    };
    return target[key];
  }
});

export default GIO;
