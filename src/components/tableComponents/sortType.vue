<template>
  <div class="tool-con">
    <el-select size="small" class="tool-info marRight" v-model="sortMethodChild" placeholder="请选择" @change="changeSortMethod">
      <el-option v-for="item in sortMethodList" :key="item.value" :label="'按' + item.label + '排序'" :value="item.value"></el-option>
    </el-select>
    <div class="iconCon marRight" style="width:62px;" @click="changeSortType">
      <img class="iconPic" :src="sortTypeChild ? require('../../assets/sortUp.png') : require('../../assets/sortDown.png')" alt="" />
      <div style="font-size:13px;color:#606266;padding-left:4px;">{{ sortTypeChild ? "升序" : "降序" }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "sortType",
  props: {
    sortMethodList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    sortMethod: {
      type: String,
      default: () => {
        return "";
      }
    },
    sortType: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data() {
    return {
      sortMethodChild: this.sortMethod,
      sortTypeChild: this.sortType
    };
  },
  watch: {},
  methods: {
    changeSortMethod() {
      this.$emit("sort-method", this.sortMethodChild);
    },
    changeSortType() {
      this.sortTypeChild = !this.sortTypeChild;
      this.$emit("sort-type", this.sortTypeChild);
    }
  }
};
</script>
<style scoped lang="less">
@import "../../assets/css/customTable.less";
</style>
