<template>
  <div v-if="loopItem.type=='dropdown_multi_oil'">
    <el-select ref="multipleSelectRef" size="small" style="width:220px" clearable filterable multiple v-model="loopItem.valueCheckBoxList" :placeholder="placeholder" @change="multipleSelectChange" remote
      :loading="loadingRemote"
      :remote-method="getOilDataFilter">
      <el-option v-for="op in loopItem.fieldOption" :key="op.value" :label="op.option" :value="op.value"> </el-option>
    </el-select>
  </div>
  <div v-else>
    <el-select ref="multipleSelectRef" size="small" style="width:220px" clearable filterable multiple v-model="loopItem.valueCheckBoxList" :placeholder="placeholder" @change="multipleSelectChange">
      <el-option v-for="op in loopItem.fieldOption" :key="op.value" :label="op.option" :value="op.value"> </el-option>
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
    }
  },
  data() {
    return {
      loadingRemote: false,
      placeholder: "请选择"
    };
  },
  watch: {
    loopItem: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val)) {
          if(val.type=='dropdown_multi_oil'){
            this.getOilData('')
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    getOilData(){
      let code = this.loopItem.valueCheckBoxList.toString()
      this.requestMethodGet("/mdm/oil/queryOilListByPage", {code: code, oilName:'', status:1, size:50, current:1})
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            res.data.list.forEach(item => {
              item.value = item.code
              item.option = item.name
            });
            this.loopItem.fieldOption = res.data.list
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    getOilDataFilter(val) {
      this.loadingRemote = true
      this.requestMethodGet("/mdm/oil/queryOilListByPage", {code: '', oilName:val, status:1, size:50, current:1})
        .then(res => {
          res = res.data;
          this.loadingRemote = false
          if (res.code == 1000) {
            res.data.list.forEach(item => {
              item.value = item.code
              item.option = item.name
            });
            this.loopItem.fieldOption = res.data.list
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 选中的值
    async multipleSelectChange(val) {
      if (this.loopItem.id == "3438" && this.loopItem.valueCheckBoxList) {
        // 润滑推荐报告，背景说明字段特殊处理
        this.loopItem.value = this.loopItem.valueCheckBoxList.join(",");
      }
      if (this.loopItem.type=='dropdown_multi_oil'&&val.length>0){
        this.loopItem.value = await this.getOilNameByOilCode(val.toString())
      }
      this.$emit("multipleSelectChange", this.loopItem);
    }
  }
};
</script>
<style lang="less" scoped></style>
