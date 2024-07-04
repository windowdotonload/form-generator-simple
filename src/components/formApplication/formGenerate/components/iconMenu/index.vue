<template>
  <div class="icon-menu-container">
    <div v-for="item in menuData" :key="item.componentType" class="icon-type">
      <header class="icon-title">{{ item.componentType }}</header>
      <section class="icon-item-list">
        <IconItem v-for="icon in item.subMenuData" :key="icon.name" :iconItem="icon" @click.native="() => createFormField(icon)" />
      </section>
    </div>
  </div>
</template>

<script>
import { menuData, componentData, getComponentDataByType } from "./config";
import IconItem from "./iconItem.vue";
import cloneDeep from "lodash/cloneDeep";
import { fieldRevertMap } from "../../../api/index.js";
import { generateUniqueUUID } from "../util";
const { inject } = VueCompositionAPI;
export default {
  components: {
    IconItem
  },
  data() {
    return {
      menuData
    };
  },
  setup() {
    const createFormField = inject("createFormField");
    const editFormDataRevertFormContentHandleTable = (target, sourceData) => {
      if (target.componentType != 10) return;
      const TABLE = {
        options: []
      };
      sourceData.tableHeaderDtoList &&
        sourceData.tableHeaderDtoList.map(item => {
          item.options = JSON.parse(item.options);
          const itemOptions = {
            colInfo: {
              fieldName: item.columnName,
              required: item.requiredFlag,
              length: item.length,
              default: item.defaultValue,
              options: item.options
            },
            colType: item.columnType,
            key: item.columnUuid || generateUniqueUUID()
          };
          TABLE.options.push(itemOptions);
        });
      target.configField.TABLE = TABLE;
      target.configField.options = TABLE;
    };
    const editFormRevertMiscField = __emitItem => {
      __emitItem.configField.multiLine = __emitItem.configField.multiLine ? true : false;
      if (__emitItem.configField.componentType == 7 || __emitItem.configField.componentType == 8) {
        __emitItem.configField.limit = __emitItem.configField.length.toString();
      }
      if (__emitItem.configField.componentType == 11) {
        __emitItem.configField.textStyle = __emitItem.configField.fieldName.split("-")[0];
        __emitItem.configField.textContent = __emitItem.configField.fieldName.split("-")[1];
      }
    };
    const editFormDataRevertFormContent = revertComponentList => {
      const revertMapList = revertComponentList.map(item => {
        const __emitItem = cloneDeep(getComponentDataByType(item.componentType));
        __emitItem._BACKEND_H = true;
        __emitItem.id = item.id;
        __emitItem.formId = item.formId;
        Object.entries(fieldRevertMap).forEach(([backEndFullFieldKey, frontEndFieldKey]) => {
          frontEndFieldKey in __emitItem.configField && backEndFullFieldKey in item && (__emitItem.configField[frontEndFieldKey] = item[backEndFullFieldKey]);
        });
        editFormRevertMiscField(__emitItem);
        editFormDataRevertFormContentHandleTable(__emitItem, item);
        return __emitItem;
      });
      revertMapList.forEach(icon => createFormField(icon));
    };

    return {
      createFormField,
      editFormDataRevertFormContent
    };
  }
};
</script>

<style lang="less" scoped>
.icon-menu-container {
  box-sizing: border-box;
  padding-top: 5px;
  position: relative;
  width: 100%;
  height: 98%;
  border-radius: 12px;
}
.icon-title {
  font-weight: bolder;
  font-size: 16px;
  margin-bottom: 8px;
  margin-top: 15px;
}
.icon-type {
  margin-top: 10px;
}
.icon-item-list {
  padding-right: 10px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
</style>
