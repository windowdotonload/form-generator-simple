import { requestMethodGet, requestMethodGetTip, requestMethodPostTip } from "@/api/api";
const { reactive } = VueCompositionAPI;

let selectOilCascadeMenu = reactive({
  value: null
});

export const backEndFullField = {
  accuracy: "",
  componentType: "",
  defaultValue: "default",
  format: 0,
  lengthMax: 0,
  lengthMin: 0,
  listShowFlag: 0,
  example: 0,
  options: 0,
  optionsDtos: 0,
  placeholder: 0,
  requiredFlag: 0,
  example: 0,
  sort: 0,
  style: 0,
  title: 0
};

export const fieldConfigMap = Object.freeze({
  componentType: "componentType",
  defaultValue: "default",
  lengthMax: "length",
  listShowFlag: "showInRecordList",
  optionsDtos: "options",
  requiredFlag: "required",
  style: "multiLine",
  title: "fieldName"
});

export const fieldRevertMap = Object.freeze({
  componentType: "componentType",
  defaultValue: "default",
  lengthMax: "length",
  listShowFlag: "showInRecordList",
  optionsDtos: "options",
  requiredFlag: "required",
  style: "multiLine",
  title: "fieldName",
  id: "id",
  formId: "formId"
});

const validateFormList = [
  {
    validateKey: "formName",
    validateName: "表单名称"
  },
  {
    validateKey: "managerUserIds",
    validateName: "记录表管理者"
  }
];

export const saveForm = async params => {
  const emptyField = validateFormList.some(item => {
    if (!params[item.validateKey]) {
      ELEMENT.MessageBox.confirm("无法保存，表单属性管理、表单编辑器中存在未填写的必填内容。", "请填写所有必填项", {
        cancelButtonText: "继续填写",
        showConfirmButton: false
      }).catch(() => {
        // nop
      });
      return true;
    }
  });
  if (emptyField) return;
  return await requestMethodPostTip("/customize/form/saveUpdateForm", params);
};

export const getWorkShopList = async params => {
  return await requestMethodGetTip("weChat/workshop/queryWorkshopListByPage", params);
};

export const getFormRelationPersonList = async params => {
  return await requestMethodGetTip("customize/form/getCurrentUserList", params);
};

export const getFormList = async params => {
  return await requestMethodGetTip("customize/form/getFormsByPage", params);
};

export const getFormListConfig = async params => {
  return await requestMethodGetTip("customize/form/getFormConfInfo", params);
};

export const getFormListOverview = async params => {
  return await requestMethodGetTip("customize/form/getFormOverview", params);
};

export const getOilCascadeMenu = async () => {
  if (selectOilCascadeMenu.value) return selectOilCascadeMenu;
  const reqRes = await requestMethodGetTip("/mdm/oil/queryOilList", {oilName:'', status:1});
  selectOilCascadeMenu.value = reqRes.data.data;
  return selectOilCascadeMenu;
};

export const resetOilCascadeMenu = async () => {
  selectOilCascadeMenu.value = null;
  getOilCascadeMenu();
};

export const checkDeleteFormTemplate = async params => {
  const res = await requestMethodGet("customize/form/removeFormCheck", params);
  return res;
};

export const deleteFormTemplateItem = async (params, failCb, successCb) => {
  const checkFlag = await checkDeleteFormTemplate({
    formId: params.id
  });
  if (checkFlag.data.code != 1000) {
    return ELEMENT.MessageBox.alert("该记录表存在历史记录，无法删除，请清空记录后再删除记录表", "删除记录表", {
      showClose: false,
      confirmButtonText: "前往历史记录",
      callback: () => failCb()
    });
  }
  return new Promise(resolve => {
    ELEMENT.MessageBox.confirm("确认删除?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(async () => {
      const res = await requestMethodPostTip("customize/form/removeForm", params);
      if (res && res.data.code == 1000) {
        ELEMENT.Message({
          message: `删除成功`,
          type: "success"
        });
        successCb();
        resolve(res);
      }
    });
  });

  // const res = await requestMethodPostTip("customize/form/removeForm", params);
  // return res;
};

export const saveFormRecord = async params => {
  const res = await requestMethodPostTip("customize/form/record/saveFormRecord", params);
  return res;
};

export const getRecordList = async params => {
  const res = await requestMethodPostTip("customize/form/record/getFormRecordListByPage", params);
  return res;
};

export const getRecordDetail = async params => {
  const res = await requestMethodGetTip("customize/form/record/getFormRecordDetail", params);
  return res;
};

export const deleteRecordItem = async params => {
  const res = await requestMethodPostTip("customize/form/record/removeFormRecord", params);
  return res;
};

export const exportData = async params => {
  const res = await requestMethodPostTip("customize/form/record/export", params);
  return res;
};
