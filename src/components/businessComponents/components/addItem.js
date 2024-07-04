import { requestMethodPost,requestMethodGet } from '../../../api/api'
export const getAddItem = async (params) => {
  const res = await requestMethodPost('/service/report/template/getDynamicField',params)
  if (res.data.code !== 1000) {
    Vue.prototype.$message({
      type: "warning",
      message: res.data.msg
    });
  }
  return res.data.data
};
export const getLupDeviceInfo = async (params) => {
  const res = await requestMethodGet('/web/device/queryDevice',params)
  if (res.data.code !== 1000) {
    Vue.prototype.$message({
      type: "warning",
      message: res.data.msg
    });
  }
  return res.data.data
};