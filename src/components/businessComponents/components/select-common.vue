<template>
  <div>
    <el-select
      size="small"
      :key="commonSelectKey"
      :style="isNotLimitWith ? 'width:100%' : 'width:220px'"
      clearable
      filterable
      v-model="loopItem.valueCode"
      :disabled="disabledEditFlag"
      @change="commonSelectChange"
      @visible-change="commonVisibleChange"
      :placeholder="placeholder"
    >
      <el-option v-for="op in loopItem.fieldOption" :disabled="op.disabled" :key="op.value" :label="op.option" :value="op.value"> </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    loopItem: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isNotLimitWith:{
      type:Boolean,
      default:false
    },
    disabledEditFlag:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      placeholder: "请选择",
      commonSelectKey: 1,
      commonVisibleFlag: false,
    };
  },
  watch: {
    loopItem: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val) && val.valueCode) {
          // this.placeholder = _.isEmpty(val.styleJsonDto.placeholder)?'请选择':val.styleJsonDto.placeholder
          // this.$emit("commonSelectChange", this.loopItem);
        }
      },
      immediate: true,
      deep: true
    }
  },
  created(){
    if(this.loopItem.valueCode){
      this.$emit("commonSelectChange", this.loopItem);
    }
  },
  methods: {
    commonSelectChange(val) {
      if (val && this.commonVisibleFlag) {
        this.$emit("commonSelectChange", this.loopItem);
      }
      if(!val){
        this.$emit("commonSelectChange", this.loopItem);
        this.loopItem.valueCode = ''
        this.loopItem.value = ''
      }
    },
    commonVisibleChange(val) {
      this.commonVisibleFlag = val
      if (val) {
        this.$emit("commonVisibleChange", this.loopItem);
      }
    }
  }
};
</script>
<style lang="less" scoped></style>
