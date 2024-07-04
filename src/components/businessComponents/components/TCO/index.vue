<template>
  <div class="tco-container">
    <Save id="Save" nameKey="tco_aq" />
    <Env id="Env" nameKey="tco_hb" />
    <Efficient id="Efficient" nameKey="tco_gx" />
    <Result />
  </div>
</template>

<script>
import Save from "./save.vue";
import Env from "./env.vue";
import Efficient from "./efficient.vue";
import Result from "./result.vue";
import cloneDeep from "lodash/cloneDeep";

import { calcState, GenerateCalcFunc, TCONameKeyIndexMap } from "./config";
const rawCalcState = JSON.parse(JSON.stringify(calcState));
export default {
  props: {
    nodeItem: {
      type: Object
    }
  },
  components: {
    Save,
    Env,
    Efficient,
    Result
  },
  provide() {
    return {
      nodeItem: this.nodeItem,
      state: this.calcState,
      mutation: { ...GenerateCalcFunc(this.calcState), assignNodeItemFieldsValue: this.assignNodeItemFieldsValue, setCustomeFields: this.setCustomeFields, ...this }
    };
  },
  created() {
    this.generateTcoParamsNameKeyToIndex(this.nodeItem);
    this.getTcoConfiguration();
  },
  mounted() {
    this.revertState();
  },
  data() {
    return {
      calcState: cloneDeep(Object.assign(calcState, { TCOP1: "", TCOP2: "", TCOP3: "", B_fuel_type: "柴油", BResUnit: "L" })),
      configureation: null,
      rg_tcoNameKeyIndexParams: null
    };
  },
  methods: {
    revertState() {
      const revertTCONameKeyIndexMap = {};
      const revertState = {};
      Object.entries(TCONameKeyIndexMap).forEach(([key, val]) => {
        const targetKey = val.split("~~")[0].split("**")[1];
        revertTCONameKeyIndexMap[targetKey] = key;
      });
      this.nodeItem.children.forEach(child => {
        child.children.forEach(field => {
          if (revertTCONameKeyIndexMap[field.nameKey]) {
            revertState[revertTCONameKeyIndexMap[field.nameKey]] = field.value;
          }
        });
      });
      Object.entries(revertState).forEach(([key, val]) => {
        this.calcState[key] = val;
      });
    },
    setProvideStateVal(key, val) {
      this.calcState[key] = val;
    },
    async getTcoConfiguration() {
      const res = await this.requestMethodGetTip("toolkit/queryToolConfigList", {
        isConfig: 1,
        current: 1,
        size: 30
      });
      const tcoParams = res.data.data.list.reverse().find(item => item.toolCode == "TCO");

      const configureation = JSON.parse(tcoParams.configuration);
      this.configureation = {};
      configureation.forEach(item => {
        this.configureation[item.key] = item.value;
      });
      Object.entries(this.configureation).forEach(([key, val]) => {
        this.calcState[key] = val;
      });

      this.assignNodeItemFieldsValueSingle("tco_hb", "hb_z_co2", { value: this.calcState.TCOP1 });
      const val = this.getNodeItemFieldsValueSingle("tco_hb", "hb_h_ry", "value") || "柴油";
      const key = val == "柴油" ? "TCOP2" : "TCOP1";
      this.assignNodeItemFieldsValueSingle("tco_hb", "hb_h_co2", { value: this.calcState[key] });
    },
    generateTcoParamsNameKeyToIndex() {
      this.rg_tcoNameKeyIndexParams = {};

      this.nodeItem.children.forEach((child, childIndex) => {
        this.rg_tcoNameKeyIndexParams[child.nameKey] = {
          index: childIndex,
          originBackendChildrenLen: child.children.length,
          tcoFields: {}
        };

        child.children.forEach((tcoField, fieldIndex) => {
          this.rg_tcoNameKeyIndexParams[child.nameKey].tcoFields[tcoField.nameKey] = fieldIndex;
        });
      });
    },
    assignNodeItemFieldsValue() {
      Object.entries(this.calcState).forEach(([key, val]) => {
        const fieldConfig = TCONameKeyIndexMap[key];
        if (!fieldConfig) return;

        const fieldConfigDecipherGather = fieldConfig.split("~~");
        fieldConfigDecipherGather.forEach(fieldConfigDecipherItemString => {
          const fieldConfigDecipherArr = fieldConfigDecipherItemString.split("**");
          const TCOFirstLevelNamekey = fieldConfigDecipherArr[0];
          const TCOSecLevelNamekey = fieldConfigDecipherArr[1];
          const TCOFirstLevelIndex = this.rg_tcoNameKeyIndexParams[TCOFirstLevelNamekey].index;
          const TCOSecLevelIndex = this.rg_tcoNameKeyIndexParams[TCOFirstLevelNamekey].tcoFields[TCOSecLevelNamekey];

          if (this.nodeItem.children[TCOFirstLevelIndex] && this.nodeItem.children[TCOFirstLevelIndex].children[TCOSecLevelIndex]) {
            this.nodeItem.children[TCOFirstLevelIndex].children[TCOSecLevelIndex].value =
              parseInt(Number(val).toFixed(3)).toString().length < 10 ? parseFloat(Number(val).toFixed(2)) : val.toExponential(3);
          }
        });
      });
    },
    assignNodeItemFieldsValueSingle(TCOFirstLevelNamekey, TCOSecLevelNamekey, setParams) {
      const TCOFirstLevelIndex = this.rg_tcoNameKeyIndexParams[TCOFirstLevelNamekey].index;
      const TCOSecLevelIndex = this.rg_tcoNameKeyIndexParams[TCOFirstLevelNamekey].tcoFields[TCOSecLevelNamekey];

      if (this.nodeItem.children[TCOFirstLevelIndex] && this.nodeItem.children[TCOFirstLevelIndex].children[TCOSecLevelIndex]) {
        Object.entries(setParams).forEach(([key, val]) => {
          this.nodeItem.children[TCOFirstLevelIndex].children[TCOSecLevelIndex][key] = val;
        });
      }
    },
    getNodeItemFieldsValueSingle(TCOFirstLevelNamekey, TCOSecLevelNamekey, key) {
      const TCOFirstLevelIndex = this.rg_tcoNameKeyIndexParams[TCOFirstLevelNamekey].index;
      const TCOSecLevelIndex = this.rg_tcoNameKeyIndexParams[TCOFirstLevelNamekey].tcoFields[TCOSecLevelNamekey];
      if (this.nodeItem.children[TCOFirstLevelIndex] && this.nodeItem.children[TCOFirstLevelIndex].children[TCOSecLevelIndex]) {
        return this.nodeItem.children[TCOFirstLevelIndex].children[TCOSecLevelIndex][key];
      }
      return null;
    },
    setCustomeFields(firstLevelNamekey, customeFields) {
      const opItem = this.nodeItem.children[this.rg_tcoNameKeyIndexParams[firstLevelNamekey].index];
      if (customeFields.length) return (opItem.tcoCustomDtoList = customeFields);
      opItem.tcoCustomDtoList = null;
    }
  }
};
</script>

<style lang="less" scoped>
.tco-classify-bar {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-radius: 5px;
  background: rgba(204, 221, 255, 0.2);
  padding: 5px 10px;
  margin: 10px 0;
}
.module-tip-text {
  font-style: normal;
  margin-left: 5px;
  font-size: 15px;
  color: #999999;
}
.classify-title {
  display: inline-block;
  font-weight: bolder;
  margin-left: 10px;
}
</style>
