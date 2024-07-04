export const checkName = (rule, value, callback) => {
  // if (!value.brand) {
  //   return callback(new Error("请选择油品品牌"));
  // }
  if (value.type.length == 0) {
    return callback(new Error("请选择油品名称"));
  }
  callback();
};

export const checkOilAmount = (_, value, callback) => {
  const reg = /^(\d|([1-9]\d+))(\.\d{1,3})?$/;
  if (value.quanity) {
    if (reg.test(value.quanity)) {
      callback();
    } else {
      return callback(new Error("请输入数字，小数点后最多三位"));
    }
  } else {
    callback();
  }
};
export const checkafterOilAmount = (_, value, callback) => {
  const reg = /^(\d|([1-9]\d+))(\.\d{1,3})?$/;
  if (value.quanity) {
    if (reg.test(value.quanity)) {
      callback();
    } else {
      return callback(new Error("请输入数字，小数点后最多三位"));
    }
  } else {
    callback();
  }
};
export const checkCountFillAmount = (_, value, callback) => {
  const reg = /^(\d|([1-9]\d+))(\.\d{1,3})?$/;
  if (value.quanity) {
    if (reg.test(value.quanity)) {
      callback();
    } else {
      return callback(new Error("请输入数字，小数点后最多三位"));
    }
  } else {
    return callback(new Error("请填写加注量"));
  }
};

export const changeOilTime = (_, value, callback) => {
  const reg = /^(0|\+?[1-9][0-9]{0,3})$/;
  if (value) {
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error("请输入0-9999的整数"));
    }
  } else {
    callback();
  }
};

export const rawForm = {
  name: {
    brand: "",
    type: []
  },
  beforeFillOil: {
    quanity: 0,
    unit: "L"
  },
  afterFillOil: {
    quanity: 0,
    unit: "L"
  },
  countFillAmount: {
    quanity: 0,
    unit: "L"
  },
  timeUnit: "",
  changeOilTime: 0,
  changePart: "",
  partsName: "",
  partsQuanity: 0,
  partsCode: "",
  nextChangeOilDate: "",
  nextChargePerson: "",
  changeOilReason: [],
  otherReason: "",
  taskDesc: "",
  position: "",
  picture: ""
};
