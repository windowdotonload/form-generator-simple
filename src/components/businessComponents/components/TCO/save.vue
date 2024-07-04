<template>
  <div class="module-container">
    <div class="tco-classify-bar"><img src="@/assets/save.png" alt="" /><span class="classify-title">安全</span></div>
    <div v-for="target in saveData" :key="target.targetTitle">
      <div class="module-tip-text">{{ target.targetTitle }}</div>
      <div class="module-card-item" v-for="card in target.children" :key="card.moduleTitle">
        <div class="module-card-line">
          <div class="module-name">{{ card.moduleTitle }}</div>
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
    <CustomerField customerFiedKeyWord="减少接触时间（小时）" :changeInput="(...args) => changeInput(...args)" :nameKey="nameKey" />
  </div>
</template>

<script>
import { saveData } from "./config";
import { validateNumRange } from "./config.js";
import CustomerField from "./createCustomeField.vue";
import cloneDeep from "lodash/cloneDeep";

export default {
  components: {
    CustomerField
  },
  inject: ["state", "mutation", "nodeItem"],
  data() {
    return {
      saveData: cloneDeep(saveData),
      preAdditionalNum: 0,
      blockWatch: false
    };
  },
  watch: {
    state: {
      handler(val) {
        if (this.blockWatch) return;
        "calcSafe_1,calcSafe_2,calcSafe_3,calcSafe_Gather".split(",").reduce((prev, fn) => {
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
      if (!this.nodeItem.children[0].tcoCustomDtoList) return;
      this.nodeItem.children[0].tcoCustomDtoList.forEach(item => {
        this.preAdditionalNum += Number(item.value);
      });
    },
    changeInput(val, field, card, additionalNum = 0) {
      this.blockWatch = true;
      if (!card || !field) {
        this.preAdditionalNum = additionalNum;
        this.mutation["calcSafe_Gather"](additionalNum);
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
