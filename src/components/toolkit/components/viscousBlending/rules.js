export const validateviscosity = (vm, key) => {
  return (rule, value, callback) => {
    if (isNaN(value)) {
      setTimeout(() => {
        vm.validataCb(key, "");
      }, 800);
      return callback(new Error("请输入数字"));
    }
    const strVal = value.toString();
    const splitDot = strVal.split(".");
    if (splitDot.length > 1 && splitDot[1].length >= 1) {
      splitDot[1] = splitDot[1]
        .split("")
        .splice(0, 1)
        .join("");
      if (splitDot[1] == 0) {
        return vm.validataCb(key, parseInt(splitDot.join(".")));
      }
      return vm.validataCb(key, parseFloat(splitDot.join(".")));
    }
    if (value < 0 || value > 46000) {
      setTimeout(() => {
        value < 0 ? vm.validataCb(key, 0) : vm.validataCb(key, 46000);
      }, 800);
      return callback(new Error("请输入范围0 - 46000的非零正数"));
    }
    callback();
  };
};

export const validateRatio = (vm, key) => {
  return (rule, value, callback) => {
    if (isNaN(value)) {
      setTimeout(() => {
        vm.validataCb(key, "");
      }, 800);
      return callback(new Error("请输入数字"));
    }
    const strVal = value.toString();
    const splitDot = strVal.split(".");
    if (splitDot.length > 1 && splitDot[1].length >= 1) {
      splitDot[1] = splitDot[1]
        .split("")
        .splice(0, 1)
        .join("");
      if (splitDot[1] == 0) {
        return vm.validataCb(key, parseInt(splitDot.join(".")));
      }
      return vm.validataCb(key, parseFloat(splitDot.join(".")));
    }
    if (value < 0 || value > 100) {
      setTimeout(() => {
        value < 0 ? vm.validataCb(key, 0) : vm.validataCb(key, 100);
      }, 800);
      return callback(new Error("请输入范围0 - 100的非零正数"));
    }
    callback();
  };
};

export const validateVolume = (vm, key) => {
  return (rule, value, callback) => {
    if (isNaN(value)) {
      setTimeout(() => {
        vm.validataCb(key, "");
      }, 800);
      return callback(new Error("请输入数字"));
    }
    const strVal = value.toString();
    const splitDot = strVal.split(".");
    if (splitDot.length > 1 && splitDot[1].length >= 1) {
      splitDot[1] = splitDot[1]
        .split("")
        .splice(0, 1)
        .join("");
      if (splitDot[1] == 0) {
        return vm.validataCb(key, parseInt(splitDot.join(".")));
      }
      return vm.validataCb(key, parseFloat(splitDot.join(".")));
    }
    if (value < 0) {
      setTimeout(() => {
        vm.validataCb(key, 0);
      }, 800);
      return callback(new Error("请输入大于等于0的数"));
    }
    callback();
  };
};
