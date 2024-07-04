<template>
  <div class="customer-field-container">
    <CustomeFieldItem v-for="(item, index) in componentNum" :fieldItem="item" :key="item.id" :id="item.id" :fieldIdx="index" :deleteCb="deleteField" :addFieldValSum="addFieldValSum" v-bind="$props" />
    <el-button type="text" size="mini" @click="createFiled">+ 添加自定义字段</el-button>
  </div>
</template>

<script>
import CustomeFieldItem from "./customeFieldItem.vue";
export default {
  props: {
    customerFiedKeyWord: {
      type: String,
      default: ""
    },
    changeUnit: {
      type: Boolean
    },
    changeUnitOptions: {
      type: String,
      default: ""
    },
    changeUnitCb: {
      type: Function
    },
    changeInput: {
      type: Function
    },
    nameKey: {
      type: String,
      default: ""
    }
  },
  components: {
    CustomeFieldItem
  },
  data() {
    return {
      componentNum: [],
      customerFieldSum: 0,
      customerFieldSumObj: {},
      nameKeyIndexMap: {
        tco_aq: 0,
        tco_hb: 1,
        tco_gx: 2
      }
    };
  },
  mounted() {
    this.revertComponentNum();
  },
  inject: ["state", "mutation", "nodeItem"],
  methods: {
    revertComponentNum() {
      if (this.nodeItem.children[this.nameKeyIndexMap[this.nameKey]]) {
        this.componentNum = this.nodeItem.children[this.nameKeyIndexMap[this.nameKey]].tcoCustomDtoList || [];
      }
    },
    createFiled() {
      if (this.componentNum.length >= 10)
        return this.$message({
          type: "warning",
          message: "自定义字段最多添加 10 项"
        });
      const createObj = {
        id: new Date().getTime(),
        name: "",
        nameKey: `${this.nameKey}_custome_${this.componentNum.length + 1}`,
        display: false,
        value: null,
        unit: "",
        desc: "",
        unitPrefix: this.customerFiedKeyWord
      };
      this.componentNum.push(createObj);
      this.mutation.setCustomeFields(this.nameKey, this.componentNum);
    },
    calcTotalSumRes() {
      let sum = this.changeUnit ? {} : 0;
      if (this.changeUnit) {
        this.componentNum.forEach(item => {
          if (item.unit in sum) {
            sum[item.unit] += Number(item.value);
          } else {
            sum[item.unit] = Number(item.value);
          }
        });
      } else {
        this.componentNum.forEach(item => {
          sum += Number(item.value);
        });
      }
      return sum;
    },
    deleteField(id, fieldVal, unitKey) {
      const delIdx = this.componentNum.some(i => i == id);
      if (delIdx >= 0) {
        this.componentNum.splice(delIdx, 1);
        this.changeInput(undefined, undefined, undefined, this.calcTotalSumRes());
        this.mutation.setCustomeFields(this.nameKey, this.componentNum);
      }
    },
    addFieldValSum() {
      this.changeInput(undefined, undefined, undefined, this.calcTotalSumRes());
    }
  }
};
</script>
