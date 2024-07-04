<template>
<div style="position:relative">
  <el-dialog
    title="选择润滑点"
    :visible.sync="chooseLupDialog"
    width="75%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelChoose">
    <!-- 搜索项 -->
    <el-form ref="searchForm" :model="searchForm" label-width="100px">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="润滑点名称">
            <el-input style="width:100%" v-model="searchForm.lubricationPointName" @change="getLupTableData('refresh')" placeholder="请输入" size="small" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="润滑点设备类型">
            <el-select style="width:100%"  v-model="searchForm.lubricationPointTypeCode" @change="getLupTableData('refresh')" clearable size="small" clearable placeholder="请选择">
              <el-option
                v-for="item in lupTypeList"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备名称">
            <el-input v-model="searchForm.deviceName" @change="getLupTableData('refresh')" placeholder="请输入" size="small" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备类型">
            <!-- <el-select v-model="searchForm.deviceType" clearable size="small" placeholder="请选择" clearable>
              <el-option
                v-for="item in deviceTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
            <el-cascader
              size="small"
              v-model="searchForm.deviceType"
              placeholder="试试搜索：设备"
              :options="deviceTypeList"
              filterable
              clearable
              @change="getLupTableData('refresh')"
              style="width: 100%"
              ref="deviceRef"
              :props="{ value: 'code', label: 'name' }"
            >
              <!-- <template slot="empty">
                <div style="display: flex; align-items: center; justify-content: center; padding: 5px 0px">
                  暂无匹配数据<el-link style="margin-left: 10px; color: #409eff" @click="createDevice">去创建</el-link>
                </div>
              </template> -->
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="设备分组">
                <el-cascader
                  :options="deviceGroupList"
                  :props="{label:'groupName',value:'id'}"
                  collapse-tags
                  size="small"
                  style="width:100%"
                  v-model="searchForm.groupId"
                  placeholder="请选择"
                  no-data-text="暂无分组"
                  @change="getLupTableData('refresh')"
                  filterable
                  clearable>
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备位置">
                <el-input v-model="searchForm.devicePosition" @change="getLupTableData('refresh')" placeholder="请输入" size="small" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备编码">
                <el-input v-model="searchForm.deviceCode" @change="getLupTableData('refresh')" placeholder="请输入" size="small" clearable></el-input>
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
          :data="lupTableData"
          tooltip-effect="dark"
          ref="lupTableRef"
          v-loading="loadingLup"
          v-el-table-infinite-scroll="loadMore"
          :row-key="rowKey"
          @select="handleSelectLup"
          @select-all="selectAllLup"
        >
          <el-table-column type="selection" :reserve-selection="true" width="55"> </el-table-column>
          <el-table-column prop="lubricationPointName" min-width="12%" label="润滑点名称" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="lubricationPointType" min-width="8%" label="润滑点设备类型" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="deviceName" min-width="6%" label="设备名称" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="deviceTypeName" min-width="6%" label="设备类型" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="deviceGroupName" min-width="10%" label="设备分组" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="devicePosition" min-width="5%" label="设备位置" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="deviceCode" min-width="8%" label="设备编码" show-overflow-tooltip> </el-table-column>
          <p v-if="loadMoreLupFlag">加载中...</p>
          <p v-if="!loadMoreLupFlag">没有更多了</p>
        </el-table>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelChoose" size="small">取 消</el-button>
      <el-button type="danger" size="small" @click="confirmChoose">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  props:{
    chooseLupDialog:{
      type:Boolean,
      default:()=>{
        return false
      }
    },
    checkedLup:{
      type:Array,
      default:()=>{
        return []
      }
    },
    actionType:{
      type:Number,
      default:()=>{
        return 0
      }
    },
    actionTargets:{
      type:Array,
      default:()=>{
        return []
      }
    },
    abnormalDeviceId:{
      type:Number,
      default:()=>{
        return null
      }
    }
  },
  data() {
    return {
      searchForm:{
        lubricationPointName:'',
        lubricationPointTypeCode:'',
        deviceName:'',
        deviceType:[],
        groupId:[],
        devicePosition:'',
        deviceCode:''
      },
      lupTypeList:[],
      deviceTypeList:[],
      deviceGroupList:[],
      lupCurrent:1,
      lupTotal:0,
      lupTableData:[],
      loadingLup:false,
      loadMoreLupFlag:false,
      userInfo:JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
    };
  },
  watch:{
    chooseLupDialog:function(val,oldVal){
      if(val){
        this.lupCurrent = 1
        this.getLupTableData('refresh')
      }
    }
  },
  created(){
    // 获取润滑点设备类型
    this.getLupTypeData()
    // 设备类型
    this.getDeviceTypeData()
    // 分组
    this.getGroupData()
  },
  methods: {
    // 获取润滑点列表
    getLupTableData(val){
      const params = {...this.searchForm}
      if(val){
        this.lupCurrent = 1
      }
      params.current = this.lupCurrent
      params.size = 30
      if(params.deviceType.length){
        params.deviceType = params.deviceType[params.deviceType.length-1]
      }else{
        params.deviceType = ''
      }
      if(params.groupId.length){
        params.groupId = params.groupId[params.groupId.length-1]
      }else{
        params.groupId = ''
      }
      params.companyId = this.userInfo.companyId
      params.actionType = this.actionType
      params.actionTargets = this.actionType<3?this.actionTargets.join(','):this.actionTargets
      params.deviceId = this.abnormalDeviceId
      this.loadingLup = true
      this.requestMethodGet('/device/check/taskManage/lubricationPointsByPage',params).then(res=>{
        if(res.data.code == 1000){
          let list = []
          if(val){
          list = res.data.data
          }else{
            list = this.lupTableData.concat(res.data.data)
          }
          this.lupTableData = list 
          this.lupTotal = res.data.data.totalCount
          if(this.lupTableData.length<this.lupTotal){
            this.loadMoreLupFlag = true
          }else{
            this.loadMoreLupFlag = false
          }
          if(this.checkedLup.length && this.lupTableData.length){
            // this.lupTableData.forEach(item=>{
            //   this.checkedLup.forEach(row=>{
            //     this.$nextTick(()=>{
            //       this.$refs.lupTableRef.toggleRowSelection(this.lupTableData.find(item=>{
            //         return item.id == row.id
            //       }),true)
            //     })
            //   })
            // })
            console.log('this.checkedLup',this.checkedLup)
            this.$refs.lupTableRef.clearSelection();
            this.$nextTick(() => {
                for(let i = 0; i < this.checkedLup.length; i++){
                    for(let j = 0; j < this.lupTableData.length; j++){
                        if(this.checkedLup[i].id == this.lupTableData[j].id){
                          console.log('this.lupTableData[j]',this.lupTableData[j])
                            this.$refs.lupTableRef.toggleRowSelection(this.lupTableData[j], true);
                        }
                    }
                }
            })
          }
          this.loadingLup=false
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    getLupTypeData(){
      let params = {
        parentCode: "lubrication_point_type",
      };
      this.requestMethodGet("/web/customer/getIndustryTreeList", params)
        .then((res) => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.lupTypeList = res.data;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning",
            });
          }
        })
        .catch((res) => {});
    },
    getDeviceTypeData(){
      this.requestMethodGet("/weChat/device/queryAllDeviceTypeTree4", {filterFlag:true}).then((res) => {
        if (res.data.code == 1000) {
          this.deviceTypeList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error",
          });
        }
      });
    },
    getGroupData(){
      const params = {
        companyId:this.userInfo.companyId
      }
      this.requestMethodGet('/weChat/deviceGroup/getDeviceGroupTree',params).then(res=>{
        if(res.data.code == 1000){
          this.deviceGroupList = res.data.data
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    // 重置
    resetSearch(){
      for(let key in this.searchForm){
        this.searchForm[key] = ''
      }
      this.searchForm.deviceType = []
      this.searchForm.groupId = []
      this.getLupTableData('refresh')
    },
    rowKey(row){
      return row.id
    },
    // 加载更多
    loadMore(){
      if(this.loadMoreLupFlag && this.lupTableData.length<this.lupTotal && !this.loadingLup){
        ++this.lupCurrent
        this.getLupTableData()
      }
    },
    // 选择润滑点
    handleSelectLup(list){
      this.checkedLup = list
    },
    // 全选
    selectAllLup(list){
      this.checkedLup = list
    },
    // 取消选择
    cancelChoose(){
      this.$emit('cancelChooseLupDialog')
    },
    // 确定选择
    confirmChoose(){
      this.$emit('confirmChooseLup',this.checkedLup)
    },
  }
};
</script>
<style lang='less' scoped>

</style>