<template>
  <div class="table-container">
    <el-input v-model="token" style="width:30%;margin-bottom:10px;margin-left:10px" size="mini" placeholder="请输入token" />
    <el-button size="mini">确定</el-button>
    <!-- <tableau-viz id="tableau-viz" src="https://tab.mobil.com.cn/t/LVCB2BSite/views/IDPdemo-2308/FESSA" width="100%" height="calc(100vh - 180px)" toolbar="bottom" :token="token"></tableau-viz> -->
    <tableau-viz id="tableau-viz" src="https://tab.mobil.com.cn/t/LVCB2BSite/views/IDPdemo-2309/REGION" width="100%" height="calc(100vh - 180px)" :token="token" toolbar="bottom">
      <viz-filter field="Distributor Company Region" value="北区"> </viz-filter>
    </tableau-viz>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: ""
    };
  }
};
</script>
<style lang="less" scoped>
.table-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
