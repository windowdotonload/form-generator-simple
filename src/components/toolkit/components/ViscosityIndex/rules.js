export const validateviscosity = (vm, key) => {
  return (rule, value, callback) => {
    if (isNaN(value)) {
      setTimeout(() => {
        vm.validataCb(key, "");
      }, 800);
      return callback(new Error("请输入数字"));
    }

    if (key == "KV_100" && value < 2) {
      callback(new Error("低于2cSt时不适用该计算公式"));
    }

    const strVal = value.toString();
    const splitDot = strVal.split(".");
    if (splitDot.length > 1 && splitDot[1].length >= 1) {
      splitDot[1] = splitDot[1]
        .split("")
        .splice(0, 1)
        .join("");

      if (key == "KV_100" && value < 2) {
        vm.validataCb(key, parseFloat(splitDot.join(".")));
        return callback(new Error("低于2cSt时不适用该计算公式"));
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
