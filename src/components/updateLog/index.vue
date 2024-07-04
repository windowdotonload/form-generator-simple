<template>
  <div class="train-qaconfiure-container">
    <div class="log-container">
      <!-- 美孚 -->
      <div class="log-inner" style="margin-right:20px;">
        <div class="inner-container">
          <div class="inner-top">
            <p class="top-left"></p>
            <p style="font-weight:bold;">美孚</p>
          </div>
          <div class="add-log" @click="addEditItem('','新建','美孚')" style="">
            +&nbsp;&nbsp;新建日志
          </div>
        </div>
        <div class="bot-log">
          <el-timeline :reverse="reverse" style="padding-inline-start: 20px !important;" v-if="tableData0.length>0">
              <el-timeline-item v-for="(item, index) in tableData0" :key="index" :timestamp="item.renewDate+'    '+item.renewVersion" color="#ccddff" size="large" placement="top">
                <div style="font-size:14px">
                  <div class="timeline-head">{{item.renewContent}}</div>
                  <div class="timeline-edit" @click="addEditItem(item,'编辑','美孚')">编辑</div>
                  <div class="timeline-delete" @click="deleteItem(item)">删除</div>
                </div>
              </el-timeline-item>
          </el-timeline>
          <div v-else class="no-data">暂无日志</div>
        </div>
      </div>
      <!-- 经销商 -->
      <div class="log-inner" style="margin-right:20px;">
        <div class="inner-container">
          <div class="inner-top">
            <p class="top-left"></p>
            <p style="font-weight:bold;">经销商</p>
          </div>
          <div class="add-log" @click="addEditItem('','新建','经销商')">
            +&nbsp;&nbsp;新建日志
          </div>
        </div>
        <div class="bot-log">
          <el-timeline :reverse="reverse" style="padding-inline-start: 20px !important;" v-if="tableData1.length>0">
              <el-timeline-item v-for="(item, index) in tableData1" :key="index" :timestamp="item.renewDate+'    '+item.renewVersion" color="#ccddff" size="large" placement="top">
                <div style="font-size:14px">
                  <div class="timeline-head">{{item.renewContent}}</div>
                  <div class="timeline-edit" @click="addEditItem(item,'编辑','经销商')">编辑</div>
                  <div class="timeline-delete" @click="deleteItem(item)">删除</div>
                </div>
              </el-timeline-item>
          </el-timeline>
          <div v-else class="no-data">暂无日志</div>
        </div>
      </div>
      <!-- 客户 -->
      <div class="log-inner">
        <div class="inner-container">
          <div class="inner-top">
            <p class="top-left"></p>
            <p style="font-weight:bold;">客户</p>
          </div>
          <div class="add-log" @click="addEditItem('','新建','客户')">
            +&nbsp;&nbsp;新建日志
          </div>
        </div>
        <div class="bot-log">
          <el-timeline :reverse="reverse" style="padding-inline-start: 20px !important;" v-if="tableData2.length>0">
              <el-timeline-item v-for="(item, index) in tableData2" :key="index" :timestamp="item.renewDate+'    '+item.renewVersion" color="#ccddff" size="large" placement="top">
                <div style="font-size:14px">
                  <div class="timeline-head">{{item.renewContent}}</div>
                  <div class="timeline-edit" @click="addEditItem(item,'编辑','客户')">编辑</div>
                  <div class="timeline-delete" @click="deleteItem(item)">删除</div>
                </div>
              </el-timeline-item>
            </el-timeline>
            <div v-else class="no-data">暂无日志</div>
        </div>
      </div>
    </div>
    <CreateAndEditDrawer ref="detailDrawer" @confirmBack="refreshTableList"/>
  </div>
</template>

<script>
export default {
  components: {
    CreateAndEditDrawer: () => import("./CreateAndEditDrawer.vue"),
  },
  data() {
    return {        
      loading: false, //是否展示加载动画，默认隐藏
      reverse:false,
      tableData0: [],
      tableData1: [],
      tableData2: [],
    };
  },
  watch: {
  },
  created() {
    this.getUpdateLog();
  },
  methods: {
    getUpdateLog() {
      this.loading = true
      this.requestMethodGet("/updateLog/queryUpdateLogList", {})
        .then(res => {
          this.loading = false;
          if (res.data.code == 1000) {
            let resData = res.data.data
            resData.forEach(item => {
              if(item.target==0) this.tableData0 = item.updateLogList
              else if(item.target==1) this.tableData1 = item.updateLogList
              else if(item.target==2) this.tableData2 = item.updateLogList
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    async addEditItem(editItem,type,roleType) {
      if(type=='编辑'){
        this.$refs.detailDrawer.evokeDrawer({
          title: "编辑",
          roleType: roleType,
          opType: "EDIT",
          target: editItem.target,
          editQAItem: editItem
        });
      }else if(type=='新建'){
        this.$refs.detailDrawer.evokeDrawer({
          title: "新建",
          target: roleType=='美孚'?0:roleType=='经销商'?1:2,
          roleType: roleType,
          opType: "CREATE"
        });
      }
    },
    // 删除
    deleteItem(item) {
      this.$confirm("是否删除本条日志？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.requestMethodPost("updateLog/editUpdateLog", {...item, delFlag:1});
        if (res.data.code == 1000) {
          this.getUpdateLog();
          this.$message({
            message: '删除成功',
            type: "success"
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      }).catch();
    },
    refreshTableList() {
      this.getUpdateLog()
    }
  }
};
</script>

<style lang="less" scoped>
.no-data{
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 13px;
  line-height: 13px;
  text-align: center;
  color: #999;
}
.bot-log{
  padding:20px 0;
  height:83% !important;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
}
.el-timeline{
  /deep/ .el-timeline-item__timestamp {
    font-weight: 400;
    font-size: 14px;
    color: #333;
  }
}
.timeline-head{
  white-space: pre-wrap;
  color:#666;
  line-height:22px;
  font-size:14px;
  font-weight:400;
  max-height: 200px;
  overflow: scroll;
}
.timeline-edit{
  font-weight:400;
  font-size:14px;
  line-height:22px;
  text-decoration-line:underline;
  color:#001450;
  display:inline-block;
  width:40px;
  cursor: pointer;
}
.timeline-delete{
  font-weight:400;
  font-size:14px;
  line-height:22px;
  text-decoration-line:underline;
  color:#dd0000;
  display:inline-block;
  cursor: pointer;
}
.train-qaconfiure-container {
  width: 97%;
  height: 86%;
  margin: 20px 0 0 20px;
  /deep/ .el-dialog {
    border-radius: 8px;
  }
  /deep/ .el-link {
    color:#001450;
    margin-right: 10px;
  }
}
.log-container{
  width:100%;
  height:100%;
  display:flex;
  .log-inner{
    flex:1;
    border:1px solid #e9e9e9;
  }
  .inner-container{
    padding: 0px 20px;
    height:50px;
    background:#f9f9f9;
    border-bottom:1px solid #e9e9e9;
    display:flex;
    justify-content:space-between;
    align-items:center;
  }
  .inner-top{
    display:flex;
    align-items:center;
  }
  .top-left{
    width:4px;
    height:16px;
    background:#dd0000;
    margin-right:10px;
  }
  .add-log{
    font-size:14px;
    line-height:14px;
    color:#001450;
    cursor: pointer;
  }
}
.qa-table-list {
  height: calc(100vh - 250px);
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
