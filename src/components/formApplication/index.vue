<template>
  <div class="form-manage-container">
    <el-button type="danger" size="mini" @click="createForm" class="config-btn" v-has="form_manage">配置记录表</el-button>
    <RecordCardList ref="recordCardList" />
  </div>
</template>

<script>
import RecordCardList from "./formRecordList/index.vue";
export default {
  components: {
    RecordCardList
  },
  methods: {
    createForm() {
      this.$router.push({
        name: "formTemplateList"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.form-manage-container {
  box-sizing: border-box;
  padding: 0 20px;
}
.config-btn {
  position: absolute;
  right: 2%;
  top: 80px;
}
.search-bar {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
}
</style>
