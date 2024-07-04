export const configToolList = ["TCO"];
export const TCOConfigList = [
  { label: "每度电平均排放因子（t CO₂/kWh）", key: "TCOP1", value: "0.000581", itemRules: [{ required: true, message: "请输入平均排放因子", trigger: "blur" }] },
  { label: "柴油燃烧排放因子（t CO₂/L）", key: "TCOP2", value: "0.002624", itemRules: [{ required: true, message: "请输入柴油燃烧排放因子", trigger: "blur" }] },
  { label: "汽油燃烧排放因子（t CO₂/L）", key: "TCOP3", value: "0.002206", itemRules: [{ required: true, message: "请输入汽油燃烧排放因子", trigger: "blur" }] }
];
export const copyToolList = ["TcoCV"];
