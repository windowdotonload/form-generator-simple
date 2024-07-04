export const validateTemperature = (vm, index, key) => {
  return (rule, value, callback) => {
    if (!value) {
      return callback(new Error("温度不可为空"));
    }
    if (isNaN(value)) {
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
        vm.validataCb(index, key, parseInt(splitDot.join(".")));
      }
      vm.validataCb(index, key, parseFloat(splitDot.join(".")));
    }
    if (value < -40 || value > 200) {
      return callback(new Error("请输入范围-40 - 200内数字"));
    }

    if (vm.formsData[index]["temperature1"] == vm.formsData[index]["temperature2"]) {
      return callback(new Error("请输入不同的温度值"));
    }
    callback();
  };
};

export const validateviscosity = (vm, index, key) => {
  let T1 = "";
  let T2 = "";
  return (rule, value, callback) => {
    if (T1 || T2) {
      console.log("htisi ", T1, T2, key);
      clearTimeout(T1);
      clearTimeout(T2);
      (T1 = ""), (T2 = "");
    }
    if (!value.toString()) {
      return callback(new Error("黏度不可为空"));
    }
    if (isNaN(value)) {
      T1 = setTimeout(() => {
        vm.validataCb(index, key, 0);
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
        callback();
        return vm.validataCb(index, key, parseInt(splitDot.join(".")));
      }
      callback();
      return vm.validataCb(index, key, parseFloat(splitDot.join(".")));
    }
    if (value <= 0 || value > 46000) {
      T2 = setTimeout(() => {
        value <= 0 ? vm.validataCb(index, key, "") : vm.validataCb(index, key, 46000);
      }, 800);
      return callback(new Error("请输入范围0 - 46000的非零正数"));
    }
    callback();
  };
};
