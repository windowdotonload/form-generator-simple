<template>
  <div class="container">
    <div class="main">
      <FormContent :formContentList="formContentList" />
    </div>
    <div class="left">
      <IconMenu ref="formGenerateIcon" />
    </div>
    <div class="right">
      <PropertyPanel :activeField="activeField.value" />
    </div>
  </div>
</template>

<script>
const { ref, reactive, onMounted, provide } = VueCompositionAPI;
import * as FORM from "./formOperation.js";
import { getFormListConfig } from "../api/index.js";
import IconMenu from "./components/iconMenu/index.vue";
import FormContent from "./components/formContent/index.vue";
import PropertyPanel from "./components/propertyPanel/index.vue";

export default {
  components: {
    IconMenu,
    FormContent,
    PropertyPanel
  },
  setup() {
    const { formContentList, createFormField } = FORM.useFormCreate();
    const { activeField, setActiveFieldProperty } = FORM.useActiveFieldProperty();
    const formGenerateIcon = ref(null);
    provide("createFormField", createFormField);
    const getfFormContentList = () => formContentList;
    const getParams = () => {
      const paramsString = window.location.hash.split("?")[1];
      if (!paramsString) return null;
      const params = paramsString.split("=");
      return {
        [params[0]]: params[1]
      };
    };

    const editFormDataRevert = async () => {
      if (!getParams() || !getParams()["formData"]) return;
      const formData = JSON.parse(decodeURIComponent(getParams()["formData"]));
      const configData = await getFormListConfig({ formId: formData.id });
      if (configData.data.code == 1000) {
        formGenerateIcon.value.editFormDataRevertFormContent(configData.data.data.componentList);
      }
    };
    onMounted(() => {
      editFormDataRevert();
    });

    return {
      formGenerateIcon,
      formContentList,
      createFormField,
      activeField,
      setActiveFieldProperty,
      getfFormContentList
    };
  }
};
</script>

<style>
@import "./index.css";
</style>
<style lang="less" scoped>
/deep/ .el-form-item {
  margin-bottom: 8px;
}
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: auto;
  user-select: none;
}
.left,
.main,
.right {
  position: relative;
  float: left;
  height: 100%;
}
.main {
  box-sizing: border-box;
  padding: 0 var(--side-width);
  width: 100%;
}
.left {
  box-sizing: border-box;
  padding: 0 12px;
  margin-left: -100%;
  width: var(--side-width);
  background: rgba(238, 239, 245, 0.3);
}
.right {
  box-sizing: border-box;
  width: var(--side-width);
  margin-left: calc(var(--side-width) * -1);
  background: rgba(238, 239, 245, 0.3);
}
</style>
