export const selectOptions1th = [
  {
    value: 1,
    label: "1"
  },
  {
    value: 5,
    label: "5"
  },
  {
    value: 10,
    label: "10"
  }
];

export const selectOptions2nd = [
  {
    value: 1,
    label: "1"
  },
  {
    value: 0.5,
    label: "0.5"
  }
];

export const validateNum = (vm, key, numSize = 10, floatNum = 3, minLimit = 0) => {
  let T1, T2;
  return (rule, value, callback) => {
    clearInterval(T1);
    clearInterval(T2);
    if (isNaN(value)) {
      T1 = setTimeout(() => {
        vm.validataCb(key, "");
      }, 800);
      return callback(new Error("请输入数字"));
    }
    const strVal = value.toString();
    const splitDot = strVal.split(".");
    if (splitDot.length > 1 && splitDot[1].length >= floatNum) {
      splitDot[1] = splitDot[1]
        .split("")
        .splice(0, floatNum)
        .join("");
      return vm.validataCb(key, parseFloat(splitDot.join(".")));
    }
    if (value < minLimit || value > numSize) {
      T2 = setTimeout(() => {
        value < minLimit ? vm.validataCb(key, minLimit) : vm.validataCb(key, numSize);
      }, 800);
      return callback(new Error(`请输入范围${minLimit} - ${numSize}的非零正数`));
    }
    callback();
  };
};
