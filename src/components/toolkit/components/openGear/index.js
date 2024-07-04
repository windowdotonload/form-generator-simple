export const selectOptions1th = [
  {
    value: 1,
    label: "美孚SHC齿轮油6800"
  },
  {
    value: 2,
    label: "美孚SHC 齿轮油22M/46M"
  },
  {
    value: 3,
    label: "美孚齿轮润滑剂OGL 007"
  },
  {
    value: 4,
    label: "美孚特嘉325 NC/375 NC"
  },
  {
    value: 5,
    label: "美孚得耐格600/800/2000/4000开式齿轮润滑脂"
  }
];

export const selectOptions2nd = [
  {
    value: 1,
    label: "正常运行"
  },
  {
    value: 2,
    label: "磨合期运行"
  }
];

export const selectOptions3th = [
  {
    value: 1,
    label: "磨机"
  },
  {
    value: 2,
    label: "回转窑/干燥机"
  }
];

export const selectOptions4th = [
  {
    value: 1,
    label: "单齿轮驱动"
  },
  {
    value: 2,
    label: "双齿轮驱动"
  }
];

export const get_LubType = val => {
  let res = null;
  if (val == 1 || val == 2 || val == 4) {
    res = 1;
  } else if (val == 3 || val == 5) {
    res = 2;
  }
  return res;
};

export const get_CoefWork = val => {
  if (val == 1) return 1;
  else if (val == 2) return 1.5;
};

export const get_CoefDevice = val => {
  if (val == 1) return 1.5;
  else if (val == 2) return 1;
};

export const get_CoefDrive = (val, Lub_Type) => {
  if (val == 1) return 1;
  else if (val == 2) {
    if (Lub_Type == 1) {
      return 1.5;
    } else if (Lub_Type == 2) {
      return 2;
    }
  }
};

export const get_CoefLub = (W, D, Lub_Type) => {
  if (W <= 0.2 && D <= 3) {
    if (Lub_Type == 1) return 0.39;
    if (Lub_Type == 2) return 0.75;
  } else if (W <= 0.4 && D <= 3.7) {
    if (Lub_Type == 1) return 0.59;
    if (Lub_Type == 2) return 1.1;
  } else if (W < 0.4 && W > 0.2 && D > 3.7 && D < 4.3) {
    if (Lub_Type == 1) return (W + (D - 3.7) / 3) * 1 + 0.19 + (D - 3.7) / 6;
    if (Lub_Type == 2) return (W + (D - 3.7) / 3) * 1.75 + 0.4 + (D - 3.7) * 0.3;
  } else if (W <= 0.2 && D < 4.3 && D > 3.7) {
    if (Lub_Type == 1) return 0.59;
    if (Lub_Type == 2) return 1.1;
  } else {
    if (Lub_Type == 1) return (W + (D - 3.7) / 3) * 1 + 0.19;
    if (Lub_Type == 2) return (W + (D - 3.7) / 3) * 1.75 + 0.4;
  }
};

export const validateW = (vm, key, numSize = 10, floatNum = 3) => {
  return (rule, value, callback) => {
    if (isNaN(value)) {
      setTimeout(() => {
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
    if (value < 0 || value > numSize) {
      setTimeout(() => {
        value < 0 ? vm.validataCb(key, 0) : vm.validataCb(key, numSize);
      }, 800);
      return callback(new Error(`请输入范围0 - ${numSize}的非零正数`));
    }
    callback();
  };
};
