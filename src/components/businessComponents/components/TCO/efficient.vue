<template>
  <div class="module-container">
    <div class="tco-classify-bar"><img src="@/assets/efficient.png" alt="" /><span class="classify-title">高效</span></div>
    <div v-for="target in efficientData" :key="target.targetTitle">
      <div class="module-tip-text">
        {{ target.targetTitle }}
        <el-tooltip v-if="target.moduleTip" class="item" effect="dark" :content="target.moduleTip" placement="top">
          <i class="el-icon-warning module-tip" style="color:#ccc;" />
        </el-tooltip>
      </div>

      <div class="module-card-item" v-for="card in target.children" :key="card.moduleTitle">
        <div class="module-card-line">
          <div class="module-name">{{ card.moduleTitle }}</div>
          <span class="module-formula" style="margin-left:10px;margin-right:5px" v-if="card.moduleTypeName">{{ handleModuleTypeNameRevert(card) }}</span>
          <ExchangeUnit v-if="card.changeModuleTypeName" :changeSelOptions="card.changeModuleTypeNameOptions" :changeCb="$event => changeModuleTypeName($event, card)" />

          <span class="module-formula">{{ card.moduleFormula }}</span>
          <el-tooltip v-if="card.moduleTip" class="item" effect="dark" :content="card.moduleTip" placement="top">
            <i class="el-icon-warning module-tip" style="color:#ccc;" />
          </el-tooltip>
        </div>

        <div class="module-fields-container">
          <div class="field-item" v-for="field in card.fields" :key="field.fieldName">
            <div class="field-name">
              {{ field.fieldName }}
              <el-tooltip v-if="field.moduleTip" class="item" effect="dark" :content="field.moduleTip" placement="top">
                <i class="el-icon-warning module-tip" style="color:#ccc;" />
              </el-tooltip>
            </div>
            <el-input placeholder="0" size="mini" maxlength="9" v-model="state[field.fieldCalcKey]" :disabled="field.disabled" @input="changeInput($event, field, card)" />
            <span class="field-unit" :class="{ 'font-shrink': field.fieldUnit.length > 3 ? true : false }">{{ field.fieldUnit }}</span>
          </div>
        </div>
      </div>
    </div>
    <CustomerField customerFiedKeyWord="每年产生效益（元）" :changeInput="(...args) => changeInput(...args)" :nameKey="nameKey" />
  </div>
</template>

<script>
import { efficientData } from "./config";
import { validateNumRange } from "./config.js";
import cloneDeep from "lodash/cloneDeep";
import CustomerField from "./createCustomeField.vue";
import ExchangeUnit from "./exchangeUnit.vue";

export default {
  components: {
    CustomerField,
    ExchangeUnit
  },
  inject: ["state", "mutation", "nodeItem"],
  data() {
    return {
      efficientData: cloneDeep(efficientData),
      preAdditionalNum: 0,
      blockWatch: false
    };
  },
  watch: {
    state: {
      handler(val) {
        if (this.blockWatch) return;
        "calcEfficient_1,calcEfficient_2,calcEfficient_3,calcEfficient_4,calcEfficient_5,calcEfficient_6,calcEfficient_7,calcEfficient_8,calcEfficient_9,calcEfficient_10,calcEfficient_11,calcEfficient_Gather"
          .split(",")
          .reduce((prev, fn) => {
            this.mutation[fn](this.preAdditionalNum);
          }, null);
      },
      deep: true
    }
  },
  mounted() {
    this.initPreAdditionalNum();
  },
  props: {
    nameKey: {
      type: String
    }
  },
  methods: {
    initPreAdditionalNum() {
      if (!this.nodeItem.children[2].tcoCustomDtoList) return;
      this.nodeItem.children[2].tcoCustomDtoList.forEach(item => {
        this.preAdditionalNum += Number(item.value);
      });
    },
    changeInput(val, field, card, additionalNum = 0) {
      this.blockWatch = true;
      if (!card || !field) {
        this.preAdditionalNum = additionalNum;
        this.mutation["calcEfficient_Gather"](additionalNum);
        this.mutation.assignNodeItemFieldsValue();
        return;
      }
      const hintZeroFloat = field.fieldCalcKey == "c";
      const floatNumLimit = hintZeroFloat ? 0 : 2;
      validateNumRange(this.state, field.fieldCalcKey, 0, 999999999, floatNumLimit, true);
      card.moduleCalcFunc.split(",").reduce((prev, fn) => {
        this.mutation[fn]();
      }, null);
      this.mutation.assignNodeItemFieldsValue();
      this.$nextTick(() => {
        this.blockWatch = false;
      });
    },
    handleModuleTypeNameRevert(card) {
      const val = this.mutation.getNodeItemFieldsValueSingle("tco_hb", "hb_h_ry", "value") || card.moduleTypeName;
      this.state.B_fuel_type = val;

      return val;
    },
    changeModuleTypeName(selval, card) {
      card.moduleTypeName = selval.label;
      this.state.B_fuel_type = selval.label;

      if (selval.label == "柴油") {
        this.mutation.assignNodeItemFieldsValueSingle("tco_hb", "hb_h_ry", { value: "柴油" });
        this.mutation.assignNodeItemFieldsValueSingle("tco_hb", "hb_h_co2", { value: this.state.TCOP2 });
      } else {
        this.mutation.assignNodeItemFieldsValueSingle("tco_hb", "hb_h_ry", { value: "汽油" });
        this.mutation.assignNodeItemFieldsValueSingle("tco_hb", "hb_h_co2", { value: this.state.TCOP3 });
      }
      "calcEnviro_1,calcEnviro_2,calcEnviro_3,calcEnviro_4,calcEnviro_Gather".split(",").reduce((prev, fn) => {
        this.mutation[fn](this.preAdditionalNum);
      }, null);
      this.mutation.assignNodeItemFieldsValue();
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
.field-unit {
  font-size: 13px;
  font-weight: bold;
}
.font-shrink {
  display: inline-block;
  transform: scale(0.8);
  width: 44px;
}
</style>
