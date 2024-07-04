export const validateTemperature = (vm, key) => {
  let T1;
  return (rule, value, callback) => {
    clearTimeout(T1);
    value = value.toString();
    if (!value) {
      return callback(new Error("温度不可为空"));
    }
    if (isNaN(value)) {
      T1 = setTimeout(() => {
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
        vm.validataCb(key, parseInt(splitDot.join(".")));
      }
      vm.validataCb(key, parseFloat(splitDot.join(".")));
    }
    if (value < -40 || value > 200) {
      return callback(new Error("请输入范围-40 - 200内数字"));
    }

    if (vm.formData["Temp_1"] == vm.formData["Temp_2"]) {
      return callback(new Error("请输入不同的温度值"));
    }
    callback();
  };
};

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
