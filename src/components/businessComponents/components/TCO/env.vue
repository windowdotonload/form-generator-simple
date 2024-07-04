<template>
  <div class="module-container">
    <div class="tco-classify-bar"><img src="@/assets/env.png" alt="" /><span class="classify-title">环保</span></div>
    <div v-for="target in envData" :key="target.targetTitle">
      <div class="module-tip-text">{{ target.targetTitle }}</div>
      <div class="module-card-item" v-for="card in target.children" :key="card.moduleTitle">
        <div class="module-card-line">
          <div class="module-name">{{ card.moduleTitle }}</div>
          <span class="module-formula" style="margin-left:10px;margin-right:5px" v-if="card.moduleTypeName">{{ handleModuleTypeNameRevert(card) }}</span>
          <ExchangeUnit v-if="card.changeModuleTypeName" :changeSelOptions="card.changeModuleTypeNameOptions" :changeCb="$event => changeModuleTypeName($event, card)" />

          <span class="module-formula">{{ typeof card.moduleFormula == "string" ? card.moduleFormula : card.moduleFormula(state[card.moduleFormulaStateKey]) }}</span>
          <el-tooltip
            v-if="card.moduleTip"
            class="item"
            effect="dark"
            :content="typeof card.moduleTip == 'string' ? card.moduleTip : card.moduleTip(state[card.moduleTipStateKey.split(',')[0]])"
            placement="top"
          >
            <i class="el-icon-warning module-tip" style="color:#ccc;" />
          </el-tooltip>
        </div>

        <div class="module-fields-container">
          <div class="field-item" v-for="field in card.fields" :key="field.fieldName">
            <div class="field-name">
              {{ field.fieldName }}
              <el-tooltip
                v-if="field.moduleTip"
                class="item"
                effect="dark"
                :content="typeof field.moduleTip == 'string' ? field.moduleTip : field.moduleTip(state[field.moduleTipStateKey.split(',')[0]], state[field.moduleTipStateKey.split(',')[1]])"
                placement="top"
              >
                <i class="el-icon-warning module-tip" style="color:#ccc;" />
              </el-tooltip>
            </div>
            <el-input placeholder="0" size="mini" maxlength="9" v-model="state[field.fieldCalcKey]" :disabled="field.disabled" @input="changeInput($event, field, card)" />
            <span class="field-unit" :class="{ 'font-shrink': field.fieldUnit.length > 3 ? true : false }">{{ handleFieldUnit(field) }}</span>
            <ExchangeUnit v-if="field.changeUnit" :changeSelOptions="field.changeSelOptions" :changeCb="$event => changeCb($event, field, card.fields)" />
          </div>
        </div>
      </div>
    </div>
    <CustomerField
      customerFiedKeyWord="每年减少废油"
      :nameKey="nameKey"
      :changeUnit="true"
      :changeUnitOptions="changeUnitOptions"
      :changeUnitCb="() => '-'"
      :changeInput="(...args) => changeInput(...args)"
    />
  </div>
</template>

<script>
import CustomerField from "./createCustomeField.vue";
import ExchangeUnit from "./exchangeUnit.vue";
import cloneDeep from "lodash/cloneDeep";
import { envData } from "./config";
import { validateNumRange } from "./config.js";
export default {
  components: {
    CustomerField,
    ExchangeUnit
  },
  props: {
    nameKey: {
      type: String
    }
  },
  inject: ["state", "mutation", "nodeItem"],
  data() {
    return {
      envData: cloneDeep(envData),
      preAdditionalNum: {},
      changeUnitOptions: [{ label: "L" }, { label: "kg" }, { label: "t" }],
      blockWatch: false,
      namekeyRecordUnitMap: {
        D: "B_Changeoil_Unit",
        F: "B_Addoil_Unit"
      }
    };
  },
  watch: {
    state: {
      handler(val) {
        if (this.blockWatch) return;
        "calcEnviro_1,calcEnviro_2,calcEnviro_3,calcEnviro_4,calcEnviro_Gather".split(",").reduce((prev, fn) => {
          this.mutation[fn](this.preAdditionalNum);
        }, null);
      },
      deep: true
    }
  },
  mounted() {
    this.initPreAdditionalNum();
  },
  methods: {
    initPreAdditionalNum() {
      if (!this.nodeItem.children[1].tcoCustomDtoList) return;
      this.nodeItem.children[1].tcoCustomDtoList.forEach(item => {
        if (item.unit in this.preAdditionalNum) {
          this.preAdditionalNum[item.unit] += Number(item.value);
        } else {
          this.preAdditionalNum[item.unit] = Number(item.value);
        }
      });
    },
    handleFieldUnit(field) {
      if (field.assignFieldNamekey) {
        const fieldUnit = this.mutation.getNodeItemFieldsValueSingle("tco_hb", field.assignFieldNamekey, "unit") || field.fieldUnit;
        if (field.stateNameKeyMap) this.state[field.stateNameKeyMap] = fieldUnit;
        return fieldUnit;
      }
      return field.fieldUnit;
    },
    handleModuleTypeNameRevert(card) {
      const val = this.mutation.getNodeItemFieldsValueSingle("tco_hb", "hb_h_ry", "value") || card.moduleTypeName;
      this.state.B_fuel_type = val;

      if (val == "柴油") {
        card.moduleFormulaStateKey = "TCOP2";
        card.fields[4].fieldCalcKey = "TCOP2";
      } else {
        card.moduleFormulaStateKey = "TCOP3";
        card.fields[4].fieldCalcKey = "TCOP3";
      }
      return val;
    },
    changeCb(selval, field, fields) {
      field.fieldUnit = selval.label;
      fields.forEach(fieldItem => {
        if (fieldItem.fieldUnit && fieldItem.changeUnitLink) fieldItem.fieldUnit = selval.label;
      });
      this.state[this.namekeyRecordUnitMap[field.fieldCalcKey]] = field.fieldUnit;
      if (field.assignFieldNamekey) {
        this.mutation.assignNodeItemFieldsValueSingle("tco_hb", field.assignFieldNamekey, { unit: selval.label });
      }
    },
    changeModuleTypeName(selval, card) {
      card.moduleTypeName = selval.label;
      this.state.B_fuel_type = selval.label;
      if (selval.label == "柴油") {
        card.moduleFormulaStateKey = "TCOP2";
        card.fields[4].fieldCalcKey = "TCOP2";
        this.mutation.assignNodeItemFieldsValueSingle("tco_hb", "hb_h_ry", { value: "柴油" });
        this.mutation.assignNodeItemFieldsValueSingle("tco_hb", "hb_h_co2", { value: this.state.TCOP2 });
      } else {
        card.moduleFormulaStateKey = "TCOP3";
        card.fields[4].fieldCalcKey = "TCOP3";
        this.mutation.assignNodeItemFieldsValueSingle("tco_hb", "hb_h_ry", { value: "汽油" });
        this.mutation.assignNodeItemFieldsValueSingle("tco_hb", "hb_h_co2", { value: this.state.TCOP3 });
      }
      "calcEnviro_1,calcEnviro_2,calcEnviro_3,calcEnviro_4,calcEnviro_Gather".split(",").reduce((prev, fn) => {
        this.mutation[fn](this.preAdditionalNum);
      }, null);
      this.mutation.assignNodeItemFieldsValue();
    },
    changeInput(val, field, card, additionalNum = 0) {
      this.blockWatch = true;
      if (!card || !field) {
        this.preAdditionalNum = additionalNum;
        this.mutation["calcEnviro_Gather"](additionalNum);
        this.mutation.assignNodeItemFieldsValue();
        return;
      }
      const floatNumLimit = field.fieldCalcKey == "c" ? 0 : 2;
      validateNumRange(this.state, field.fieldCalcKey, 0, 999999999, floatNumLimit, true);
      card.moduleCalcFunc.split(",").reduce((prev, fn) => {
        this.mutation[fn]();
      }, null);
      this.mutation.assignNodeItemFieldsValue();
      this.$nextTick(() => {
        this.blockWatch = false;
      });
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
.module-fields-container {
  /deep/ .el-input {
    width: 88%;
  }
}
.module-card-item {
  position: relative;
  box-sizing: border-box;
  background: #f5f5f5;
  box-sizing: border-box;
  padding: 25px 20px;
  border-radius: 6px;
  width: 100%;
  margin: 10px 0;
}
.module-card-line {
  margin-bottom: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}
.module-name {
  font-weight: bolder;
  font-size: 13px;
  color: #000000;
}
.module-formula {
  font-weight: 500;
  font-size: 13px;
  color: #999999;
}
.module-fields-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.field-item {
  width: 48%;
  box-sizing: border-box;
}
.field-name {
  font-size: 13px;
  font-weight: bold;
  margin: 8px 0;
}
.font-shrink {
  display: inline-block;
  transform: scale(0.8);
  width: 44px;
}
.field-unit {
  font-size: 13px;
  font-weight: bold;
}
</style>
