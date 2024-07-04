const vm = new Vue();
let validateValidNumT = null;
let validateFloatT = null;
let validateNumRangeT = null;
const delay = 800;
export const saveData = [
  {
    targetTitle: "减少设备维护人员与设备的接触时间",
    children: [
      {
        moduleTitle: "减少非计划停机",
        moduleFormula: "（公式：A=a*b*c*aa）",
        moduleTip: "因延长设备寿命、减少设备损坏而减少计划外的停机换油或设备更换。",
        moduleCalcFunc: "calcSafe_1,calcSafe_2,calcSafe_3,calcSafe_Gather",
        fields: [
          {
            fieldName: "每年减少的非计划停机时间 A",
            fieldUnit: "小时",
            fieldCalcKey: "A",
            disabled: true
          },
          {
            fieldName: "每年减少的非计划停机次数 a",
            fieldUnit: "次",
            fieldCalcKey: "a"
          },
          {
            fieldName: "每次非计划停机时间 b",
            fieldUnit: "小时",
            fieldCalcKey: "b"
          },
          {
            fieldName: "设备数量 c",
            fieldUnit: "台",
            fieldCalcKey: "c"
          },
          {
            fieldName: "人数 aa",
            fieldUnit: "个",
            fieldCalcKey: "aa",
            disabled: true
          }
        ]
      },
      {
        moduleTitle: "减少计划停机",
        moduleFormula: "（公式：B=d*e*c*aa）",
        moduleTip: "因长效润滑剂而减少计划性的换油或维护。如更换长效柴机油而使得每年的计划停机换油维护减少",
        moduleCalcFunc: "calcSafe_1,calcSafe_2,calcSafe_3,calcSafe_Gather",
        fields: [
          {
            fieldName: "每年减少的计划停机时间 B",
            fieldUnit: "小时",
            fieldCalcKey: "B",
            disabled: true
          },
          {
            fieldName: "每年减少的计划停机次数 d",
            fieldUnit: "次",
            fieldCalcKey: "d"
          },
          {
            fieldName: "每次计划停机时间 e",
            fieldUnit: "小时",
            fieldCalcKey: "e"
          },
          {
            fieldName: "设备数量 c",
            fieldUnit: "台",
            fieldCalcKey: "c"
          },
          {
            fieldName: "人数 aa",
            fieldUnit: "个",
            fieldCalcKey: "aa",
            disabled: true
          }
        ]
      },
      {
        moduleTitle: "减少不停机维护",
        moduleFormula: "（公式：C=f*g*c*aa）",
        moduleTip: "如因改善油耗、泄漏而减少的不停机加油等维护；更换备用的过滤器滤芯、油泵等。",
        moduleCalcFunc: "calcSafe_1,calcSafe_2,calcSafe_3,calcSafe_Gather",
        fields: [
          {
            fieldName: "每年减少的不停机维护时间 C",
            fieldUnit: "小时",
            fieldCalcKey: "C",
            disabled: true
          },
          {
            fieldName: "每年减少的不停机维护次数 f",
            fieldUnit: "次",
            fieldCalcKey: "f"
          },
          {
            fieldName: "每次不停机维护时间 g",
            fieldUnit: "小时",
            fieldCalcKey: "g"
          },
          {
            fieldName: "设备数量 c",
            fieldUnit: "台",
            fieldCalcKey: "c"
          },
          {
            fieldName: "人数 aa",
            fieldUnit: "个",
            fieldCalcKey: "aa",
            disabled: true
          }
        ]
      }
    ]
  }
];

export const envData = [
  {
    targetTitle: "减少废油排放",
    children: [
      {
        moduleTitle: "延长换油周期",
        moduleFormula: "（公式：D=（bb-cc）*h*c）",
        moduleCalcFunc: "calcEnviro_1,calcEnviro_2,calcEnviro_3,calcEnviro_4,calcEnviro_Gather",
        fields: [
          {
            fieldName: "每年减少换油量 D",
            fieldUnit: "L",
            fieldCalcKey: "D",
            disabled: true,
            changeUnit: true,
            assignFieldNamekey: "hb_x_hyld",
            stateNameKeyMap: "B_Changeoil_Unit",
            changeSelOptions: [
              {
                label: "L"
              },
              {
                label: "kg"
              }
            ]
          },
          {
            fieldName: "改善前年换油次数 bb",
            fieldUnit: "次",
            fieldCalcKey: "bb"
          },
          {
            fieldName: "改善后年换油次数 cc",
            fieldUnit: "次",
            fieldCalcKey: "cc"
          },
          {
            fieldName: "油箱容量 h",
            fieldUnit: "L",
            fieldCalcKey: "h",
            changeUnitLink: true,
            assignFieldNamekey: "hb_x_hyld"
          },
          {
            fieldName: "设备数量 c",
            fieldUnit: "台",
            fieldCalcKey: "c"
          }
        ]
      },
      {
        moduleTitle: "减少油耗 / 降低供油率",
        moduleFormula: "（公式：F=（i-j）*c）",
        moduleCalcFunc: "calcEnviro_1,calcEnviro_2,calcEnviro_3,calcEnviro_4,calcEnviro_Gather",
        fields: [
          {
            fieldName: "每年减少油品添加量 F",
            fieldUnit: "L",
            fieldCalcKey: "F",
            disabled: true,
            changeUnit: true,
            assignFieldNamekey: "hb_y_tjlf",
            stateNameKeyMap: "B_Addoil_Unit",
            changeSelOptions: [
              {
                label: "L"
              },
              {
                label: "kg"
              }
            ]
          },
          {
            fieldName: "改善前油品年添加量 i",
            fieldUnit: "L",
            fieldCalcKey: "i",
            changeUnitLink: true,
            assignFieldNamekey: "hb_y_tjlf"
          },
          {
            fieldName: "改善后油品年添加量 j",
            fieldUnit: "L",
            fieldCalcKey: "j",
            changeUnitLink: true,
            assignFieldNamekey: "hb_y_tjlf"
          },
          {
            fieldName: "设备数量 c",
            fieldUnit: "台",
            fieldCalcKey: "c"
          }
        ]
      }
    ]
  },
  {
    targetTitle: "减少CO2排放",
    children: [
      {
        moduleTitle: "电力",
        moduleFormula: val => `（公式：G = k * (l+) * m% * ${val} * c）`,
        moduleFormulaStateKey: "TCOP1",
        moduleCalcFunc: "calcEnviro_1,calcEnviro_2,calcEnviro_3,calcEnviro_4,calcEnviro_Gather",
        fields: [
          {
            fieldName: "每年减少的CO₂排放（电力） G",
            fieldUnit: "吨",
            fieldCalcKey: "G",
            disabled: true
          },
          {
            fieldName: "设备功率 k",
            fieldUnit: "kW",
            fieldCalcKey: "k"
          },
          {
            fieldName: "年运行时间 l+",
            fieldUnit: "小时",
            fieldCalcKey: "l+"
          },
          {
            fieldName: "电力能效提升 m",
            fieldUnit: "%",
            fieldCalcKey: "m"
          },
          {
            fieldName: "我国每度电产生的CO₂",
            moduleTip: val => `全国平均排放因子为 ${val} tCO2/kWh。`,
            moduleTipStateKey: "TCOP1",
            fieldUnit: "吨",
            fieldCalcKey: "TCOP1",
            disabled: true
          },
          {
            fieldName: "设备数量 c",
            fieldUnit: "台",
            fieldCalcKey: "c"
          }
        ]
      },
      {
        moduleTitle: "燃油",
        moduleTypeName: "柴油",
        handldRevert: true,
        changeModuleTypeName: true,
        changeModuleTypeNameOptions: [{ label: "柴油" }, { label: "汽油" }],
        moduleFormula: val => `（公式：H = n * (o+) / 100 * p% * ${val} * c）`,
        moduleFormulaStateKey: "TCOP2",
        moduleCalcFunc: "calcEnviro_1,calcEnviro_2,calcEnviro_3,calcEnviro_4,calcEnviro_Gather",
        fields: [
          {
            fieldName: "每年减少的CO₂排放（燃油） H",
            fieldUnit: "吨",
            fieldCalcKey: "H",
            disabled: true
          },
          {
            fieldName: "车辆年运行里程 n",
            fieldUnit: "公里",
            fieldCalcKey: "n"
          },
          {
            fieldName: "车辆平均燃油耗量 o+",
            fieldUnit: "L/100km",
            fieldCalcKey: "o+"
          },
          {
            fieldName: "燃油经济性提升 p",
            moduleTip: "美孚黑霸王1号™ 5W-30/5W-40 K150帮助节省燃油可高达2 - 2.6%",
            fieldUnit: "%",
            fieldCalcKey: "p"
          },
          {
            fieldName: "我国每升燃油产生的CO₂",
            moduleTip: (val1, val2) => `柴油燃烧排放因子为 ${val1} tCO₂/L; 汽油燃烧排放因子为 ${val2} tCO₂/L。`,
            moduleTipStateKey: "TCOP2,TCOP3",
            fieldUnit: "吨",
            fieldCalcKey: "TCOP2",
            disabled: true
          },
          {
            fieldName: "设备数量 c",
            fieldUnit: "台",
            fieldCalcKey: "c"
          }
        ]
      }
    ]
  }
];

export const efficientData = [
  {
    targetTitle: "增加生产效益",
    moduleTip: "减少设备停机，增加设备运行生产的可用性，从而增加潜在生产效益。须明确该设备停机是否停产，如不是则不计算该部分",
    children: [
      {
        moduleTitle: "生产效益（非计划停机）",
        moduleFormula: "（公式：II = （A / aa ）* q）",
        moduleCalcFunc:
          "calcEfficient_1,calcEfficient_2,calcEfficient_3,calcEfficient_4,calcEfficient_5,calcEfficient_6,calcEfficient_7,calcEfficient_8,calcEfficient_9,calcEfficient_10,calcEfficient_11,calcEfficient_Gather",
        fields: [
          {
            fieldName: "每年可增加生产效益(非计划停机) II",
            fieldUnit: "元",
            fieldCalcKey: "II",
            disabled: true
          },
          {
            fieldName: "每年减少的非计划停机时间 A",
            fieldUnit: "小时",
            fieldCalcKey: "A",
            disabled: true
          },
          {
            fieldName: "人数 aa",
            fieldUnit: "个",
            fieldCalcKey: "aa",
            disabled: true
          },
          {
            fieldName: "每小时生产效益 q",
            fieldUnit: "元",
            fieldCalcKey: "q"
          }
        ]
      },
      {
        moduleTitle: "生产效益（计划停机）",
        moduleFormula: "（公式：J = B / aa * q）",
        moduleCalcFunc:
          "calcEfficient_1,calcEfficient_2,calcEfficient_3,calcEfficient_4,calcEfficient_5,calcEfficient_6,calcEfficient_7,calcEfficient_8,calcEfficient_9,calcEfficient_10,calcEfficient_11,calcEfficient_Gather",
        moduleTip: "",
        fields: [
          {
            fieldName: "每年可增加生产效益（计划停机） J",
            fieldUnit: "元",
            fieldCalcKey: "J",
            disabled: true
          },
          {
            fieldName: "每年减少的非计划停机时间 B",
            fieldUnit: "小时",
            fieldCalcKey: "B",
            disabled: true
          },
          {
            fieldName: "人数 aa",
            fieldUnit: "个",
            fieldCalcKey: "aa",
            disabled: true
          },
          {
            fieldName: "每小时生产效益 q",
            fieldUnit: "元",
            fieldCalcKey: "q"
          }
        ]
      }
    ]
  },
  {
    targetTitle: "降低设备/耗材成本",
    children: [
      {
        moduleTitle: "设备/耗材成本",
        moduleFormula: "（公式：K =（r-s） * t * c）",
        moduleCalcFunc:
          "calcEfficient_1,calcEfficient_2,calcEfficient_3,calcEfficient_4,calcEfficient_5,calcEfficient_6,calcEfficient_7,calcEfficient_8,calcEfficient_9,calcEfficient_10,calcEfficient_11,calcEfficient_Gather",
        fields: [
          {
            fieldName: "每年减少的设备/耗材成本 K",
            fieldUnit: "元",
            fieldCalcKey: "K",
            disabled: true
          },
          {
            fieldName: "改善前设备/耗材年消耗量 r",
            fieldUnit: "个",
            fieldCalcKey: "r"
          },
          {
            fieldName: "改善后设备/耗材年消耗量 s",
            fieldUnit: "个",
            fieldCalcKey: "s"
          },
          {
            fieldName: "设备/耗材单价 t",
            fieldUnit: "元",
            fieldCalcKey: "t"
          },
          {
            fieldName: "设备数量 c",
            fieldUnit: "台",
            fieldCalcKey: "c"
          }
        ]
      }
    ]
  },
  {
    targetTitle: "降低人工成本",
    moduleTip: "减少设备维护，从而释放人工劳力，或节省人工维护成本。",
    children: [
      {
        moduleTitle: "人工（非计划停机）",
        moduleFormula: "（公式：L = A * u）",
        moduleCalcFunc:
          "calcEfficient_1,calcEfficient_2,calcEfficient_3,calcEfficient_4,calcEfficient_5,calcEfficient_6,calcEfficient_7,calcEfficient_8,calcEfficient_9,calcEfficient_10,calcEfficient_11,calcEfficient_Gather",
        fields: [
          {
            fieldName: "每年节省的人工成本（非计划停机）L",
            fieldUnit: "元",
            fieldCalcKey: "L",
            disabled: true
          },
          {
            fieldName: "每年减少的非计划停机时间 A",
            fieldUnit: "小时",
            fieldCalcKey: "A",
            disabled: true
          },
          {
            fieldName: "小时人工成本 u",
            fieldUnit: "元",
            fieldCalcKey: "u"
          }
        ]
      },
      {
        moduleTitle: "人工（计划停机）",
        moduleFormula: "（公式：M = B * u）",
        moduleCalcFunc:
          "calcEfficient_1,calcEfficient_2,calcEfficient_3,calcEfficient_4,calcEfficient_5,calcEfficient_6,calcEfficient_7,calcEfficient_8,calcEfficient_9,calcEfficient_10,calcEfficient_11,calcEfficient_Gather",
        fields: [
          {
            fieldName: "每年节省的人工成本（非停机维护）M",
            fieldUnit: "元",
            fieldCalcKey: "M",
            disabled: true
          },
          {
            fieldName: "每年减少的不停机维护时间 B",
            fieldUnit: "小时",
            fieldCalcKey: "B",
            disabled: true
          },
          {
            fieldName: "小时人工成本 u",
            fieldUnit: "元",
            fieldCalcKey: "u"
          }
        ]
      },
      {
        moduleTitle: "人工（非停机维护）",
        moduleFormula: "（公式：N = C * u）",
        moduleCalcFunc:
          "calcEfficient_1,calcEfficient_2,calcEfficient_3,calcEfficient_4,calcEfficient_5,calcEfficient_6,calcEfficient_7,calcEfficient_8,calcEfficient_9,calcEfficient_10,calcEfficient_11,calcEfficient_Gather",
        fields: [
          {
            fieldName: "每年节省的人工成本（非停机维护）N",
            fieldUnit: "元",
            fieldCalcKey: "N",
            disabled: true
          },
          {
            fieldName: "每年减少的不停机维护时间 C",
            fieldUnit: "小时",
            fieldCalcKey: "C",
            disabled: true
          },
          {
            fieldName: "小时人工成本 u",
            fieldUnit: "元",
            fieldCalcKey: "u"
          }
        ]
      }
    ]
  },
  {
    targetTitle: "降低用油成本",
    children: [
      {
        moduleTitle: "油品添加",
        moduleFormula: "（公式：OO =（i * v - j * w） * c）",
        moduleCalcFunc:
          "calcEfficient_1,calcEfficient_2,calcEfficient_3,calcEfficient_4,calcEfficient_5,calcEfficient_6,calcEfficient_7,calcEfficient_8,calcEfficient_9,calcEfficient_10,calcEfficient_11,calcEfficient_Gather",
        fields: [
          {
            fieldName: "每年减少油品添加成本 OO",
            fieldUnit: "元",
            fieldCalcKey: "OO",
            disabled: true
          },
          {
            fieldName: "改善前油品年消耗量 i",
            fieldUnit: "L",
            fieldCalcKey: "i",
            disabled: true
          },
          {
            fieldName: "改善前油品的单价 v",
            fieldUnit: "元",
            fieldCalcKey: "v"
          },
          {
            fieldName: "改善后油品年消耗量 j",
            fieldUnit: "L",
            fieldCalcKey: "j",
            disabled: true
          },
          {
            fieldName: "改善后油品的单价 w",
            fieldUnit: "元",
            fieldCalcKey: "w"
          },
          {
            fieldName: "设备数量 c",
            fieldUnit: "个",
            fieldCalcKey: "c",
            disabled: true
          }
        ]
      },
      {
        moduleTitle: "换油",
        moduleFormula: "（公式：P =（bb * h * v - cc * h * w）* c）",
        moduleCalcFunc:
          "calcEfficient_1,calcEfficient_2,calcEfficient_3,calcEfficient_4,calcEfficient_5,calcEfficient_6,calcEfficient_7,calcEfficient_8,calcEfficient_9,calcEfficient_10,calcEfficient_11,calcEfficient_Gather",
        fields: [
          {
            fieldName: "每年减少换油成本 P",
            fieldUnit: "元",
            fieldCalcKey: "P",
            disabled: true
          },
          {
            fieldName: "改善前年换油次数 bb",
            fieldUnit: "次",
            fieldCalcKey: "bb",
            disabled: true
          },
          {
            fieldName: "油箱容量 h",
            fieldUnit: "L",
            fieldCalcKey: "h",
            disabled: true
          },
          {
            fieldName: "改善前油品的单价 v",
            fieldUnit: "元",
            fieldCalcKey: "v"
          },
          {
            fieldName: "改善后年换油次数 cc",
            fieldUnit: "次",
            fieldCalcKey: "cc",
            disabled: true
          },
          {
            fieldName: "改善后油品的单价 w",
            fieldUnit: "元",
            fieldCalcKey: "w"
          },
          {
            fieldName: "设备数量 c",
            fieldUnit: "个",
            fieldCalcKey: "c",
            disabled: true
          }
        ]
      }
    ]
  },
  {
    targetTitle: "降低废油处理成本",
    children: [
      {
        moduleTitle: "设备/耗材成本",
        moduleFormula: "（公式：Q =（D + F）/1000*xx）",
        moduleCalcFunc:
          "calcEfficient_1,calcEfficient_2,calcEfficient_3,calcEfficient_4,calcEfficient_5,calcEfficient_6,calcEfficient_7,calcEfficient_8,calcEfficient_9,calcEfficient_10,calcEfficient_11,calcEfficient_Gather",
        fields: [
          {
            fieldName: "每年减少废油处理成本 Q",
            fieldUnit: "元",
            fieldCalcKey: "Q",
            disabled: true
          },
          {
            fieldName: "每年减少换油 D",
            fieldUnit: "L",
            fieldCalcKey: "D",
            disabled: true
          },
          {
            fieldName: "每年减少油品添加量 F",
            fieldUnit: "L",
            fieldCalcKey: "F",
            disabled: true
          },
          {
            fieldName: "废油处理成本 xx",
            fieldUnit: "元/吨",
            fieldCalcKey: "xx"
          }
        ]
      }
    ]
  },
  {
    targetTitle: "能效改善",
    children: [
      {
        moduleTitle: "电力",
        moduleFormula: "（公式：R = k * （l+） * m% * y * c）",
        moduleCalcFunc:
          "calcEfficient_1,calcEfficient_2,calcEfficient_3,calcEfficient_4,calcEfficient_5,calcEfficient_6,calcEfficient_7,calcEfficient_8,calcEfficient_9,calcEfficient_10,calcEfficient_11,calcEfficient_Gather",
        fields: [
          {
            fieldName: "电费节省 R",
            fieldUnit: "元",
            fieldCalcKey: "R",
            disabled: true
          },
          {
            fieldName: "设备功率 k",
            fieldUnit: "kW",
            fieldCalcKey: "k",
            disabled: true
          },
          {
            fieldName: "年运行时间 l+",
            fieldUnit: "小时",
            fieldCalcKey: "l+",
            disabled: true
          },
          {
            fieldName: "电力能效提升 m",
            fieldUnit: "%",
            fieldCalcKey: "m",
            disabled: true
          },
          {
            fieldName: "本地参考工业电价 y",
            fieldUnit: "元/度",
            fieldCalcKey: "y"
          },
          {
            fieldName: "设备数量 c",
            fieldUnit: "个",
            fieldCalcKey: "c",
            disabled: true
          }
        ]
      },
      {
        moduleTitle: "燃油",
        moduleTypeName: "柴油",
        handldRevert: true,
        changeModuleTypeName: true,
        changeModuleTypeNameOptions: [{ label: "柴油" }, { label: "汽油" }],
        moduleFormula: "（公式：SS = n *（o+）/ 100 * p% * z * c）",
        moduleCalcFunc:
          "calcEfficient_1,calcEfficient_2,calcEfficient_3,calcEfficient_4,calcEfficient_5,calcEfficient_6,calcEfficient_7,calcEfficient_8,calcEfficient_9,calcEfficient_10,calcEfficient_11,calcEfficient_Gather",
        fields: [
          {
            fieldName: "燃油节省 SS",
            fieldUnit: "元",
            fieldCalcKey: "SS",
            disabled: true
          },
          {
            fieldName: "车辆年运行里程 n",
            fieldUnit: "公里",
            fieldCalcKey: "n",
            disabled: true
          },
          {
            fieldName: "车辆平均燃油耗量 o+",
            fieldUnit: "L/100KM",
            fieldCalcKey: "o+",
            disabled: true
          },
          {
            fieldName: "燃油经济性提升 p",
            fieldUnit: "%",
            fieldCalcKey: "p",
            disabled: true
          },
          {
            fieldName: "本地参考燃油价格 z",
            fieldUnit: "元/升",
            fieldCalcKey: "z"
          },
          {
            fieldName: "车量数量 c",
            fieldUnit: "台",
            fieldCalcKey: "c",
            disabled: true
          }
        ]
      }
    ]
  }
];
export const toNumber = val => {
  Object.keys(val).forEach(key => {
    val[key] = isNaN(Number(val[key])) ? val[key] : Number(val[key]);
  });
  return val;
};
export const simpleDeepClone = val => toNumber(JSON.parse(JSON.stringify(val)));
export const handleFloat = (val = 0, floatNum = 2, len = 9) => {
  return parseInt(val.toFixed(floatNum)).toString().length > len ? Number(val).toExponential(3) : parseFloat(val.toFixed(floatNum));
};

export const calcState = {
  A: "",
  a: "",
  b: "",
  c: 1,
  aa: 1,
  B: "",
  d: "",
  e: "",
  C: "",
  f: "",
  g: "",
  A_Gather_Res: 0,

  B_Changeoil_Unit: "L",
  B_Addoil_Unit: "L",
  B_fuel_type: "柴油",
  D: "",
  bb: "",
  cc: "",
  h: "",
  F: "",
  i: "",
  j: "",
  G: "",
  k: "",
  "l+": "",
  m: "",
  H: "",
  n: "",
  "o+": "",
  p: "",
  B_Gather_Res_1: 0,
  B_Gather_Res_2: 0,

  II: "",
  q: "",
  J: "",
  K: "",
  r: "",
  s: "",
  t: "",
  L: "",
  u: "",
  M: "",
  N: "",
  C: "",
  OO: "",
  i: "",
  v: "",
  j: "",
  w: "",
  P: "",
  Q: "",
  xx: "",
  R: "",
  y: "",
  SS: "",
  z: "",
  C_Gather_Res: 0,

  img_url_safe: "",
  img_url_enviro: "",
  img_url_efficient: "",

  safe_add_suffix: 0,
  enviro_add_suffix_1: 0,
  enviro_add_suffix_2: 0,
  efficient_add_suffix: 0
};

export const GenerateCalcFunc = state => {
  return (window.GenerateCalcFunc = {
    calcSafe_1: () => {
      const val = state.a * state.b * state.c * state.aa;
      state.A = handleFloat(val);
    },
    calcSafe_2: () => {
      const val = state.d * state.e * state.c * state.aa;
      state.B = handleFloat(val);
    },
    calcSafe_3: () => {
      const val = state.f * state.g * state.c * state.aa;
      state.C = handleFloat(val);
    },
    calcSafe_Gather: additionalNum => {
      if (additionalNum != undefined && additionalNum.toString()) state.safe_add_suffix = additionalNum;
      state.A_Gather_Res = Number(state.A) + Number(state.B) + Number(state.C) + state.safe_add_suffix;
    },

    B_changeunit: (key, val) => {
      state[key] = val;
    },
    calcEnviro_1: () => {
      const val = (state.bb - state.cc) * state.h * state.c;
      state.D = handleFloat(val);
    },
    calcEnviro_2: () => {
      const val = (state.i - state.j) * state.c;
      state.F = handleFloat(val);
    },
    calcEnviro_3: () => {
      const val = state.k * state["l+"] * (state.m / 100) * state.c * state.TCOP1;
      state.G = handleFloat(val);
    },
    calcEnviro_4: () => {
      switch (state.B_fuel_type) {
        case "柴油":
          const val1 = state.n * (state["o+"] / 100) * (state.p / 100) * state.TCOP2 * state.c;
          state.H = handleFloat(val1);
          break;
        case "汽油":
          const val2 = state.n * (state["o+"] / 100) * (state.p / 100) * state.TCOP3 * state.c;
          state.H = handleFloat(val2);
          break;
      }
    },
    calcEnviro_Gather: sum => {
      let res1 = 0;
      let res2 = 0;
      if (sum) {
        const kg = sum["kg"] || 0;
        if (sum) {
          res1 = (sum["L"] || 0) + kg / 0.87;
          res2 = sum["t"] || 0;
        }
      }

      if (sum != undefined && res1.toString()) state.enviro_add_suffix_1 = res1;
      if (sum != undefined && res2.toString()) state.enviro_add_suffix_2 = res2;

      const D = state.B_Changeoil_Unit == "L" ? state.D : Number(state.D) / 0.87;
      const F = state.B_Addoil_Unit == "L" ? state.F : Number(state.F) / 0.87;
      const res1L = Number(D) + Number(F) + state.enviro_add_suffix_1;
      state.B_Gather_Res_1 = state.BResUnit == "L" ? res1L : res1L * 0.87;
      state.B_Gather_Res_2 = Number(state.G) + Number(state.H) + state.enviro_add_suffix_2;
    },

    calcEfficient_1: () => {
      const tempVal = (state.A / state.aa) * state.q;
      const val = tempVal.toFixed(0).toString().length > 9 ? Number(tempVal).toExponential(3) : parseFloat(tempVal.toFixed(2));
      state.II = val;
    },
    calcEfficient_2: () => {
      const tempVal = (state.B / state.aa) * state.q;
      const val = tempVal.toFixed(0).toString().length > 9 ? Number(tempVal).toExponential(3) : parseFloat(tempVal.toFixed(2));
      state.J = val;
    },
    calcEfficient_3: () => {
      const tempVal = (state.r - state.s) * state.t * state.c;
      const val = tempVal.toFixed(0).toString().length > 9 ? Number(tempVal).toExponential(3) : parseFloat(tempVal.toFixed(2));
      state.K = val;
    },
    calcEfficient_4: () => {
      const tempVal = state.A * state.u;
      const val = tempVal.toFixed(0).toString().length > 9 ? Number(tempVal).toExponential(3) : parseFloat(tempVal.toFixed(2));
      state.L = val;
    },
    calcEfficient_5: () => {
      const tempVal = state.B * state.u;
      const val = tempVal.toFixed(0).toString().length > 9 ? Number(tempVal).toExponential(3) : parseFloat(tempVal.toFixed(2));
      state.M = val;
    },
    calcEfficient_6: () => {
      const tempVal = state.C * state.u;
      const val = tempVal.toFixed(0).toString().length > 9 ? Number(tempVal).toExponential(3) : parseFloat(tempVal.toFixed(2));
      state.N = val;
    },
    calcEfficient_7: () => {
      const tempVal = (state.i * state.v - state.j * state.w) * state.c;
      const val = tempVal.toFixed(0).toString().length > 9 ? Number(tempVal).toExponential(3) : parseFloat(tempVal.toFixed(2));
      state.OO = val;
    },
    calcEfficient_8: () => {
      const tempVal = (state.bb * state.h * state.v - state.cc * state.h * state.w) * state.c;
      const val = tempVal.toFixed(0).toString().length > 9 ? Number(tempVal).toExponential(3) : parseFloat(tempVal.toFixed(2));
      state.P = val;
    },
    calcEfficient_9: () => {
      const tempVal = ((Number(state.D) + Number(state.F)) / 1000) * Number(state.xx);
      const val = tempVal.toFixed(0).toString().length > 9 ? Number(tempVal).toExponential(3) : parseFloat(tempVal.toFixed(2));
      state.Q = val;
    },
    calcEfficient_10: () => {
      const tempVal = state.k * state["l+"] * (state.m / 100) * state.y * state.c;
      const val = tempVal.toFixed(0).toString().length > 9 ? Number(tempVal).toExponential(3) : parseFloat(tempVal.toFixed(2));
      state.R = val;
    },
    calcEfficient_11: () => {
      const val = simpleDeepClone(state);
      const tempVal = val.n * (val["o+"] / 100) * (val.p / 100) * val.z * val.c;
      const val_res = tempVal.toFixed(0).toString().length > 9 ? Number(tempVal).toExponential(3) : parseFloat(tempVal.toFixed(2));
      state.SS = val_res;
    },
    calcEfficient_Gather: additionalNum => {
      if (additionalNum != undefined && additionalNum.toString()) state.efficient_add_suffix = additionalNum;
      let sum = 0;
      ["II", "J", "K", "L", "M", "N", "OO", "P", "Q", "R", "SS"].forEach(key => {
        sum += Number(state[key]);
      });
      state.C_Gather_Res = sum + state.efficient_add_suffix;
    }
  });
};

export const wecaht_toast = msg => {
  vm.$message({
    showClose: true,
    message: msg,
    type: "warning"
  });
};

export const clearStamp = stamp => {
  if (stamp) {
    clearTimeout(stamp);
    stamp = null;
  }
};

export const validateValidNum = (target, key, reserveZero) => {
  if (!target[key].toString()) return;
  const value = target[key];
  if (isNaN(value) && value != "-") {
    clearStamp(validateValidNumT);
    validateValidNumT = setTimeout(() => {
      target[key] = "";
    }, 100);
    wecaht_toast("请输入数字");
    return;
  } else {
    clearStamp(validateValidNumT);
    if (reserveZero) {
      if (!target[key].toString().includes(".") && target[key] != 0) target[key] = target[key].toString().replace(/^0+/, "");
      return;
    }
    if (!target[key].toString().includes(".")) target[key] = target[key].toString().replace(/^0+/, "");
  }
};

export const validateFloat = (target, key, floatNum = 1) => {
  const value = target[key];
  if (floatNum == 0 && value.toString().includes(".")) {
    validateFloatT = setTimeout(() => {
      target[key] = parseInt(Math.floor(value));
    }, 0);
    return;
  }
  const strVal = value.toString();
  const splitDot = strVal.split(".");
  const split_1 = splitDot[1];
  if (!split_1) return;
  if (split_1.length > floatNum) {
    splitDot[1] = splitDot[1].substr(0, floatNum);
    const newSetval = parseFloat(splitDot.join("."));
    validateFloatT = setTimeout(() => {
      target[key] = newSetval;
    }, 10);
  }
};

export const validateNumRange = (target, key, min = 0, max = 100, floatNum = 1, reserveZero = false) => {
  validateValidNum(target, key, reserveZero);
  validateFloat(target, key, floatNum);
  const value = target[key];

  if (value < min || value > max) {
    wecaht_toast(`请输入${min}-${max}的${min < 0 ? "数字" : "正数"}`);
    validateNumRangeT = setTimeout(() => {
      target[key] = value < min ? min : max;
    }, delay);
  }
};

export const validateVolume = (value, key, vm) => {
  validateNumRange(value, key, vm, 0, 9999999);
};

export const validateViscosity = (value, key, vm) => {
  validateValidNum(value);
  if (value < 0 || value > 46000) {
    wecaht_toast("请输入0 - 46 000内数字");
  }
  validateFloat(value, key, vm);
};

export const validateTemperature = (() => {
  const tempRecord = {
    Temp_1: null,
    Temp_2: null
  };
  return (value, key, vm, checkTempSame = false) => {
    validateValidNum(value);
    if (value < -40 || value > 200) {
      wecaht_toast("请输入-40 - 200内数字");
    }
    validateFloat(value, key, vm);
    if (!checkTempSame) return;
    if (vm.data.formData.Temp_1 == vm.data.formData.Temp_2 && value) {
      wecaht_toast("请输入不同温度");
      if (value != tempRecord[key]) {
      }
    }
    tempRecord[key] = value;
  };
})();

export const TCONameKeyIndexMap = {
  A: "tco_aq**aq_x_sja~~tco_gx**gx_x_sja~~tco_gx**gx_h_sja",
  a: "tco_aq**aq_x_csa",
  b: "tco_aq**aq_x_sjb",
  c:
    "tco_aq**aq_x_slc~~tco_aq**aq_y_slc~~tco_aq**aq_z_slc~~tco_hb**hb_x_slc~~tco_hb**hb_y_slc~~tco_hb**hb_z_slc~~tco_hb**hb_h_slc~~tco_gx**gx_k_slc~~tco_gx**gx_l_slc~~tco_gx**gx_n_slc~~tco_gx**gx_o_slc~~tco_gx**gx_z_slc",
  aa: "tco_aq**aq_x_rsa~~tco_aq**aq_y_rsa~~tco_aq**aq_z_rsa~~tco_gx**gx_x_rsa~~tco_gx**gx_y_rsa",
  B: "tco_aq**aq_y_sjb~~tco_gx**gx_y_sjb~~tco_gx**gx_i_sjb",
  d: "tco_aq**aq_y_csd",
  e: "tco_aq**aq_y_sje",
  C: "tco_aq**aq_z_sjc~~tco_gx**gx_j_sjc",
  f: "tco_aq**aq_z_csf",
  g: "tco_aq**aq_z_sjg",
  A_Gather_Res: "tco_aq**aq_cal_jcsj",

  B_Changeoil_Unit: "",
  B_Addoil_Unit: "",
  B_fuel_type: "",
  D: "tco_hb**hb_x_hyld~~tco_gx**gx_m_hyd",
  bb: "tco_hb**hb_x_hycsbb~~tco_gx**gx_l_csb",
  cc: "tco_hb**hb_x_hycscc~~tco_gx**gx_l_csc",
  h: "tco_hb**hb_x_rlh~~tco_gx**gx_l_rlh",
  F: "tco_hb**hb_y_tjlf~~tco_gx**gx_m_tjlf",
  i: "tco_hb**hb_y_tjli~~tco_gx**gx_k_xhli",
  j: "tco_hb**hb_y_tjlj~~tco_gx**gx_k_xhlj",
  G: "tco_hb**hb_z_pfg",
  k: "tco_hb**hb_z_glk~~tco_gx**gx_n_glk",
  "l+": "tco_hb**hb_z_sjl~~tco_gx**gx_n_sjl",
  m: "tco_hb**hb_z_tsm~~tco_gx**gx_n_tsm",
  H: "tco_hb**hb_h_ryh",
  n: "tco_hb**hb_h_lcn~~tco_gx**gx_o_lcn",
  "o+": "tco_hb**hb_h_hlo~~tco_gx**gx_o_hlo",
  p: "tco_hb**hb_h_tsp~~tco_gx**gx_o_tsp",
  B_Gather_Res_1: "tco_hb**hb_cal_fycz",
  B_Gather_Res_2: "tco_hb**hb_cal_co2pf",

  II: "tco_gx**gx_x_xyi",
  q: "tco_gx**gx_x_xyq~~tco_gx**gx_y_xyq",
  J: "tco_gx**gx_y_xyj",
  K: "tco_gx**gx_z_cbk",
  r: "tco_gx**gx_z_xhlr",
  s: "tco_gx**gx_z_xhls",
  t: "tco_gx**gx_z_djt",
  L: "tco_gx**gx_h_cbl",
  u: "tco_gx**gx_h_cbu~~tco_gx**gx_i_cbu~~tco_gx**gx_j_cbu",
  M: "tco_gx**gx_i_cbm",
  N: "tco_gx**gx_j_cbn",
  OO: "tco_gx**gx_k_cbo",
  v: "tco_gx**gx_k_djv~~tco_gx**gx_l_djv",
  w: "tco_gx**gx_l_djw~~tco_gx**gx_k_djw",
  P: "tco_gx**gx_l_cbp",
  Q: "tco_gx**gx_m_cbq",
  xx: "tco_gx**gx_m_cbx",
  R: "tco_gx**gx_n_jsr",
  y: "tco_gx**gx_n_djy",
  SS: "tco_gx**gx_o_jss",
  z: "tco_gx**gx_o_jgz",
  C_Gather_Res: "tco_gx**gx_cal_xy"
};
