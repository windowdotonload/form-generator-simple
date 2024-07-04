<template>
  <div class="module-card-item">
    <div class="module-card-line">
      <div class="module-name">自定义项目 {{ fieldIdx + 1 }}</div>
      <el-button type="text" size="mini" style="color:#d10000;font-weight:bloder" @click="deleteItem">删除</el-button>
    </div>
    <div class="module-fields-container">
      <div class="field-item">
        <div class="field-name">自定义名称</div>
        <el-input placeholder="请输入" size="mini" maxlength="15" v-model="customName" @input="assignFieldItem" />
      </div>
      <div class="field-item">
        <div class="field-name">
          {{ changeUnit ? defaultCustomerFiedKeyWord : customerFiedKeyWord }}
          <template v-if="changeUnit">
            <div class="custome-fieldunit-container">
              <span>（{{ defaultUnit }}）</span>
              <ExchangeUnit :changeSelOptions="changeUnitOptions" :changeCb="$event => changeCb($event)" />
            </div>
          </template>
        </div>
        <el-input placeholder="0" maxlength="9" size="mini" v-model="customeItemVal" @input="changeCustomeVal" />
      </div>
      <div style="width:95%">
        <div class="field-name">描述</div>
        <el-input placeholder="请输入" v-model="customeDesc" size="mini" type="textarea" maxlength="100" show-word-limit @input="assignFieldItem" />
      </div>
    </div>
  </div>
</template>

<script>
import ExchangeUnit from "./exchangeUnit.vue";
import { validateNumRange } from "./config.js";

export default {
  props: {
    id: {
      type: Number
    },
    fieldItem: {
      type: Object
    },
    fieldIdx: {
      type: Number
    },
    deleteCb: {
      type: Function
    },
    customerFiedKeyWord: {
      type: String,
      default: ""
    },
    changeUnit: {
      type: String,
      default: false
    },
    changeUnitOptions: {
      type: String,
      default: ""
    },
    changeUnitCb: {
      type: Function
    },
    addFieldValSum: {
      type: Function
    }
  },
  components: {
    ExchangeUnit
  },
  mounted() {
    this.initUnitInfo();
    this.revertFieldItemVal();
  },
  data() {
    return {
      customName: "",
      customeItemVal: "",
      customeDesc: "",
      defaultUnit: "",
      defaultCustomerFiedKeyWord: ""
    };
  },
  inject: ["nodeItem"],
  methods: {
    revertFieldItemVal() {
      if (this.fieldItem) {
        this.customName = this.fieldItem.name;
        this.customeDesc = this.fieldItem.desc;
        this.customeItemVal = this.fieldItem.value;
        if (this.fieldItem.unit) {
          this.defaultUnit = this.fieldItem.unit;
          if (this.changeUnit) {
            if (this.defaultUnit == "t") this.defaultCustomerFiedKeyWord = "每年减少CO₂排放";
          }
        }
      }
    },
    initUnitInfo() {
      if (this.changeUnit) {
        this.defaultUnit = this.changeUnitOptions[0].label;
        this.defaultCustomerFiedKeyWord = this.customerFiedKeyWord;
      }
    },
    deleteItem() {
      this.deleteCb(this.id, this.customeItemVal, this.changeUnit ? this.defaultUnit : undefined);
    },
    assignFieldItem() {
      this.fieldItem.name = this.customName;
      this.fieldItem.desc = this.customeDesc;
      this.fieldItem.value = this.customeItemVal;
      this.fieldItem.unit = this.defaultUnit;
      this.fieldItem.unitPrefix = this.defaultCustomerFiedKeyWord;
    },
    changeCb(selVal) {
      this.defaultUnit = selVal.label;
      this.defaultCustomerFiedKeyWord = "每年减少废油";
      if (selVal.label == "t") this.defaultCustomerFiedKeyWord = "每年减少CO₂排放";
      this.changeCustomeVal();
      this.assignFieldItem();
    },
    async changeCustomeVal() {
      if (!this.customeItemVal) return;
      validateNumRange(this, "customeItemVal", 0, 999999999, 2, true);
      await this.$nextTick();
      this.assignFieldItem();
      this.addFieldValSum();
    }
  }
};
</script>

<style lang="less" scoped>
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
  justify-content: space-between;
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
  display: flex;
  flex-wrap: nowrap;
}
.field-unit {
  font-size: 13px;
  font-weight: bold;
}
.custome-fieldunit-container {
  display: flex;
}
</style>
