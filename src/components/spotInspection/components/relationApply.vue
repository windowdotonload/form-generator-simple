<template>
<div style="position:relative">
  <el-dialog
    title="关联申请单"
    :visible.sync="chooseApply"
    width="75%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :before-close="cancelChooseApply">
    <!-- 搜索项 -->
    <el-form ref="searchForm" :model="searchForm" label-width="100px">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="申请单编号">
            <el-input v-model="searchForm.serviceApplyNo" placeholder="请输入" size="small" style="width:90%" clearable @change="getApplyTableData('refresh')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="searchForm.serviceApplyStatus" clearable size="small" placeholder="请选择" clearable @change="getApplyTableData('refresh')">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <div slot="label">
              <el-button size="small" @click="resetSearch">重置</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <div >
        <el-table
          :data="applyTableData"
          tooltip-effect="dark"
          ref="apply"
          v-loading="loadingApply"
          v-el-table-infinite-scroll="loadMore"
          :row-key="rowKey"
          @select="handleSelectApply"
          @select-all="selectAllApply"
        >
          <el-table-column type="selection" :reserve-selection="true" width="50"> </el-table-column>
          <el-table-column prop="serviceApplyNo" min-width="8%" label="申请单号" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="questionDesc" min-width="8%" label="问题概述" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="applyTime" min-width="8%" label="申请时间" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="serviceApplyStatus" min-width="5%" label="状态" show-overflow-tooltip> 
            <template slot-scope="scope">
              <span v-if="scope.row.serviceApplyStatus==0" style="color:#dd0000">待确认</span>
              <span v-if="scope.row.serviceApplyStatus==1" style="color:#dd0000">待处理</span>
              <span v-if="scope.row.serviceApplyStatus==2" style="color:#008888">进行中</span>
              <span v-if="scope.row.serviceApplyStatus==3" style="color:#999">已完成</span>
              <span v-if="scope.row.serviceApplyStatus==4" style="color:#999">已取消</span>
            </template>
          </el-table-column>
          <p v-if="loadMoreApplyFlag">加载中...</p>
          <p v-if="!loadMoreApplyFlag">没有更多了</p>
        </el-table>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelChooseApply" size="small">取 消</el-button>
      <el-button type="danger" size="small" @click="confirmChooseApply">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  props:{
    chooseApply:{
      type:Boolean,
      default:()=>{
        return false
      }
    },
    abnormalId:{
      type:Number,
      default:()=>{
        return 0
      }
    },
    companyId:{
      type:Number,
      default:()=>{
        return null
      }
    },
  },
  data() {
    return {
      searchForm:{
        serviceApplyNo:'',
        serviceApplyStatus:''
      },
      statusList:[
        {
          label:'待确认',
          value:0
        },{
          label:'待处理',
          value:1
        },{
          label:'进行中',
          value:2
        },{
          label:'已完成',
          value:3
        },{
          label:'已取消',
          value:4
        }
      ],
      applyTableData:[],
      applyCurrent:1,
      applyTotal:0,
      loadingApply:false,
      loadMoreApplyFlag:false,
      checkedApplyList:[]
    };
  },
  watch:{
    chooseApply:function(val,oldVal){
      if(val){
        this.$nextTick(()=>{
          this.$refs.apply.clearSelection()
        })
        this.getApplyTableData('refresh')
      }
    }
  },
  methods: {
    // 获取任务列表
    getApplyTableData(val){
      const params = {
        size:30,
        current:this.applyCurrent,
        ...this.searchForm
      }
      params.dataFlag = 0
      params.abnormalId = this.abnormalId
      params.customerId = this.companyId
      params.menuCode='ServiceApply'
      this.loadingApply = true
      this.requestMethodGet("/serviceApply/serviceApplyOrderListByPage", params).then(res => {
          if (res.data.code == 1000) {
            let list = []
            if(val){
              list = res.data.data.list
            }else{
              list = this.applyTableData.concat(res.data.data.list)
            }
            this.applyTableData = list
            this.applyTotal = res.data.data.totalCount
            if(this.applyTableData.length<this.applyTotal){
              this.loadMoreApplyFlag = true
            }else{
              this.loadMoreApplyFlag = false
            }
            this.loadingApply = false;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 重置
    resetSearch(){
      for(let key in this.searchForm){
        this.searchForm[key] = ''
      }
      this.applyCurrent = 1
      this.getApplyTableData('refresh')
    },
    rowKey(row){
      return row.id
    },
    // 加载更多
    loadMore(){
      if(this.loadMoreApplyFlag && this.applyTableData.length<this.applyTotal){
        ++this.applyCurrent
        this.getApplyTableData()
      }
    },
    // 选择申请单
    handleSelectApply(list){
      this.checkedApplyList = list
    },
    // 全选
    selectAllApply(list){
      this.checkedApplyList = list
    },
    // 取消选择
    cancelChooseApply(){
      this.checkedApplyList = []
      this.$refs.apply.clearSelection()
      this.$emit('cancelApplyDialog')
    },
    // 确定选择
    confirmChooseApply(){
      const checkArr = this.$refs.apply.selection
      this.$emit('confirmChooseApply',checkArr)
    },
  }
};
</script>
<style lang='less' scoped>
  /deep/ .el-checkbox{
    border:none
  }
</style>