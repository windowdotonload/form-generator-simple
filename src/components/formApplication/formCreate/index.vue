<template>
  <div class="form-create-container" :style="{ height: containerHeight }">
    <div class="form-crate-header">
      <div></div>
      <div style="margin-left:6%">
        <el-radio-group v-model="formActivePanel" size="mini" fill="#fff" border text-color="#d10000">
          <el-radio-button :label="1" :style="getActiveStyle(1)">表单属性管理</el-radio-button>
          <el-radio-button :label="2" :style="getActiveStyle(2)">表单编辑器</el-radio-button>
        </el-radio-group>
      </div>
      <div>
        <el-button type="danger" size="mini" @click="saveForm">保存</el-button>
        <el-button type="danger" plain size="mini" @click="prevForm">预览</el-button>
        <el-button size="mini" @click="cancelCreate">取消</el-button>
      </div>
    </div>
    <div class="form-crate-content">
      <FormProperty v-show="formActivePanel == 1" ref="FormProperty" />
      <FormGenerate v-show="formActivePanel == 2" ref="FormGenerate" />
    </div>
  </div>
</template>

<script>
const { ref, reactive, onMounted, onUnmounted, provide } = VueCompositionAPI;
import { saveForm, getFormList, fieldConfigMap, backEndFullField, getFormListConfig } from "../api/index";
import { clearFormGenerateData, formOperationState } from "../formGenerate/formOperation.js";
import { createDialog } from "../formGenerate/components/util.js";
import FormProperty from "./formProperty.vue";
import FormGenerate from "../formGenerate/index";
import { PreviewComponent } from "../formGenerate/formOperation.js";
export default {
  components: {
    FormProperty,
    FormGenerate
  },
  data() {
    return {
      formId: ""
    };
  },
  mounted(){
    this.$gio.Editorpageexposure()
  },
  methods: {
    cancelCreate() {
      this.$confirm("请确认是否保存本次编辑内容，取消后将无法找回当前编辑内容", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$router.replace({ name: "formTemplateList" });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleComponentList() {
      return this.$refs.FormGenerate.getfFormContentList().map(item => {
        const copyParams = JSON.parse(JSON.stringify(backEndFullField));
        Object.entries(fieldConfigMap).forEach(([backEndFullFieldKey, frontEndFieldKey]) => {
          copyParams[backEndFullFieldKey] = item._uFieldInfo._configField[frontEndFieldKey];
        });
        this.normalCopyParamsAttr(copyParams);
        this.transferUploadLimitToLen(copyParams, item._uFieldInfo);
        this.handleEditField(copyParams, item._uFieldInfo);
        this.handleTextContent(copyParams, item._uFieldInfo);
        this.handleTableDataTransfer(copyParams, item._uFieldInfo);
        return copyParams;
      });
    },
    transferUploadLimitToLen(copyParams, _uFieldInfo) {
      if (copyParams.componentType == 7 || copyParams.componentType == 8) {
        copyParams.lengthMax = _uFieldInfo._configField.limit;
      }
    },
    normalCopyParamsAttr(copyParams) {
      copyParams.defaultValue = copyParams.defaultValue.toString();
      copyParams.style = Number(copyParams.style);
    },
    handleEditField(copyParams, _uFieldInfo) {
      if (_uFieldInfo._BACKEND_H && _uFieldInfo.formId && _uFieldInfo.id) {
        copyParams.id = _uFieldInfo.id;
        copyParams.formId = _uFieldInfo.formId;
      }
    },
    handleTextContent(copyParams, _uFieldInfo) {
      const _configField = _uFieldInfo._configField;
      if (_configField.componentType != 11) return;
      const textContent = _uFieldInfo._configField.textContent;
      const textStyle = _uFieldInfo._configField.textStyle;
      copyParams.title = textStyle + "-" + textContent;
    },
    handleTableDataTransfer(copyParams, tableFieldInfo) {
      const _configField = tableFieldInfo._configField;
      if (!_configField.TABLE || _configField.componentType != 10) return;
      const tableData = _configField.TABLE;
      const tableConfig = tableData.options;
      const tableHeaderDtoList = tableConfig.map(item => {
        const tempTableObj = {};
        tempTableObj.columnType = item.colType;
        tempTableObj.columnUuid = item.key;
        tempTableObj.length = item.colInfo.length || 10;
        tempTableObj.columnName = item.colInfo.fieldName;
        tempTableObj.defaultValue = item.colInfo.default;
        tempTableObj.options = JSON.stringify(item.colInfo.options);
        tempTableObj.requiredFlag = item.colInfo.required;
        return tempTableObj;
      });
      copyParams.tableHeaderDtoList = tableHeaderDtoList;
      copyParams.optionsDtos = undefined;
    },
    prevForm() {
      createDialog({
        title: "预览",
        width: "50%",
        ContentComponent: PreviewComponent
      });
    },
    saveFormPrevValidate() {
      if (formOperationState.activeField && !formOperationState.activeField._configField.fieldName) {
        ELEMENT.MessageBox.confirm("无法保存，表单属性管理、表单编辑器中存在未填写的必填内容。", "请填写所有必填项", {
          cancelButtonText: "继续填写",
          showConfirmButton: false
        }).catch(() => {
          // nop
        });
        return false;
      }
      return true;
    },
    async saveFormExec() {
      if (!this.saveFormPrevValidate()) return;
      const formPropertyParams = this.$refs.FormProperty.getFormMOdel();
      const componentList = this.handleComponentList();

      const params = {
        ...formPropertyParams,
        componentList
      };
      if (this.formId) params.formId = this.formId;

      const saveRes = await saveForm(params);
      if (saveRes && saveRes.data.code == 1000) {
        this.formId = saveRes.data.data;
        this.$message({
          type: "success",
          message: "保存成功"
        });
        return;
        this.$router.push({
          name: "formTemplateList"
        });
        clearFormGenerateData();
      }
    },
    async saveForm() {
      if (!this.$route.query.formData) return this.saveFormExec();
      this.$confirm("是否保存？如果该记录表已存在填写记录，修改前的字段将不会在历史记录中展示。", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.saveFormExec();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消保存"
          });
        });
    }
  },
  setup() {
    const containerHeight = ref("92%");
    const formActivePanel = ref(1);
    const leftBtnActiveStyle = "border: 1px solid #d10000;border-top-left-radius: 4px;border-bottom-left-radius: 4px;box-sizing: border-box;";
    const rightBtnActiveStyle = "border: 1px solid #d10000;border-top-right-radius: 4px;border-bottom-right-radius: 4px;padding-left:1px;box-sizing: border-box;";

    const getActiveStyle = btnType => {
      if (btnType == 1) return formActivePanel.value == 1 ? leftBtnActiveStyle : "";
      if (btnType == 2) return formActivePanel.value == 2 ? rightBtnActiveStyle : "";
    };
    onUnmounted(() => {
      clearFormGenerateData();
    });

    return {
      containerHeight,
      formActivePanel,
      getActiveStyle
    };
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-radio-button__inner:hover {
  color: #001450;
}
.form-create-container {
  position: relative;
  box-sizing: border-box;
  padding: 0 20px;
  width: 100%;
  min-width: 1330px;
  background: rgba(238, 239, 245, 0.3);
  border-radius: 5px;
  overflow: hidden;
  overflow-y: auto;
}
.form-create-container::-webkit-scrollbar {
  display: none;
}
.form-crate-header {
  width: 100%;
  box-sizing: border-box;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(238, 239, 245, 0.3);
}
.form-crate-content {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  height: calc(100% - 50px);
}
</style>
