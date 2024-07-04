<template>
  <div style="position: relative">
    <div class="dealer-area" :style="mainminheight" id="translationDiv">
      <div class="toolbox-con flexBetween">
        <!-- 查询条件 -->
        <el-form ref="form" :model="queryParams" :inline="true" size="small" id="searchForm">
          <el-form-item>
            <el-button size="small" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="tool-con">
          <el-button type="danger" @click="handleAreaConfig" size="small" v-has="DACCityBtn">区域配置城市</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <custom-table class="table" :tableHeader="tableDataHeader" :tableData="tableData" :tableHeight="tableHeight + ''" :loading="loading" @changeSearch="tableTitleSearch">
        <template v-slot:listItemValueCn="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="中文翻译"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div v-if="!scope.row.editing">
                <span :style="{color: scope.row.assetClassStatus==-1 ?'#999':'#606266'}" >{{scope.row.listItemValueCn || '--'}}</span>
              </div>
              <div v-else>
                <span v-if="scope.row.assetClassStatus==-1" style="color:#999;" >{{scope.row.listItemValueCn || '--'}}</span>
                  <el-form-item v-else :prop="'translationTableData.' + scope.$index + '.listItemValueCn'">
                    <el-input size="mini" style="width:60%" :disabled='scope.row.state == -1 ? true :false'  v-model="scope.row.listItemValueCn"  maxlength="25"  @change="changeChineseName(scope.row)"  placeholder="最多输入25字符"></el-input>
                  </el-form-item>
              </div>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <template v-slot:assetClassStatusDesc="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="状态"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header 
              title="状态"
              :filterType="slotProps.slotData.filterType"
              :paramValue="slotProps.slotData.paramValue"
              :changeValue="slotProps.slotData.changeValue"
              :selectOptions="slotProps.slotData.selectOptions"
              @chSubmit="tableTitleSearch"/>
            </template>
            <template slot-scope="scope">
              <span style="color:#70b603;" v-if="scope.row.assetClassStatusDesc=='已维护'">{{scope.row.assetClassStatusDesc}}</span>
              <span style="color:#f56c6c;" v-else-if="scope.row.assetClassStatusDesc=='待维护'">{{scope.row.assetClassStatusDesc}}</span>
              <span style="color:#666666;" v-else>{{scope.row.assetClassStatusDesc}}</span>
            </template>
          </el-table-column>
        </template>
      </custom-table>
      <el-pagination
        v-if="totalNumber"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[10,20,30,50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        class="listOptimizePage"
      ></el-pagination>
      <!-- 区域配置城市弹框 -->
      <el-dialog
          title="区域配置城市"
          :visible.sync="dialogVisible"
          :show-close="false"
          width="800px"
          :close-on-click-modal="false">
          <el-form>
              <el-form-item label="选择区域：">
                  <el-select v-model="parentCode" clearable placeholder="请选择" @change="areaChange" size="small">
                          <el-option
                              v-for="item in areaList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                          </el-option>
                      </el-select>
              </el-form-item>
              <el-form-item label="选择管辖城市：">
              </el-form-item>
              <el-row :gutter="20">
                  <div>
                      <el-col span="24">
                          <el-cascader
                              :key="cascaderKey"
                              style="width:750px"
                              ref="demoCascader"
                              placeholder="搜索"
                              v-model="chooseCity"
                              size="small"
                              :options="provinceAndCityDataList"
                              :props="{ multiple: true,value:'code',label:'name' }"
                              filterable>
                          </el-cascader>
                      </el-col>
                  </div>
                      
                  </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align:right;">
              <el-button type="danger" @click="saveAdd" size="small">保存</el-button>
              <el-button type="danger" plain @click="cancelAdd" size="small">取消</el-button>
          </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import customTable from "../tableComponents/customTable";
export default {
    components: {
      "custom-table": customTable
    },
    data(){
        return{
          loading: false,
          tableHeight: null,
          tableDataHeader: [
            { filterType: "selection", paramValue: "areaCode", changeValue:"",selectOptions: [], prop: "areaName", label: "区域", width: "200", tooltip: true },
            { filterType: "cascaderDevice", paramValue: "queryParamsCityCode", selectOptions: [], changeValue:"", prop: "cityName", label: "管辖城市", width: "150", tooltip: true },
            { slot: "operation", label: "操作" }
          ],
          areaList:[],
          provinceAndCityList:[],
          tableData:[],
          queryParams:{
              areaCode:'',
              cityCode:''
          },
          cascaderKey:0,
          parentCode:'',
          chooseCity:[],
          provinceAndCityDataList:[],
          mainminheight: `height:${document.documentElement.clientHeight - 150}px`,
          totalNumber:0,
          pagenation:{
              current: 1,
              size: 30
          },
          dialogVisible:false,
          queryParamsCityCode:'all_000'
        }
    },
    created(){
      this.getAreaList()//获取区域下拉数据源
      this.getAllProvinceAndCityList()//获取省市数据
      this.handleTableHeight();
      window.addEventListener("resize", () => {
        this.mainminheight = `height:${document.documentElement.clientHeight - 150}px`;
        this.$nextTick(() => {
          this.handleTableHeight();
        });
      });
    },
    methods: {
      tableTitleSearch(obj){
        let searchVal = obj.changeValue
        this.tableDataHeader.forEach(item=>{
          if(obj.paramValue==item.paramValue){
            item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
          }
        })
        if(obj.paramValue=="queryParamsCityCode"){
          if(searchVal){
            this.queryParamsCityCode = searchVal
          }else{
            this.queryParamsCityCode = []
          }
        }else{
            this.queryParams[obj.paramValue] = searchVal
        }
        this.initList()
      },
      // 自适应获取table高度
      handleTableHeight() {
        setTimeout(() => {
          let translationDiv=0
          let searchFormHeight=0
          if (document.getElementById("translationDiv")) {
            translationDiv = document.getElementById("translationDiv").clientHeight;
          }
          if (document.getElementById("searchForm")) {
            searchFormHeight = document.getElementById("searchForm").clientHeight;
          }
          this.tableHeight = Number(translationDiv) - Number(searchFormHeight) - 40;
        }, 200);
      },
      getAllProvinceAndCityList(){
          this.requestMethodGet('/weChat/common/getAreaListByBusinessArea',{businessAreaCode:''}).then(res=>{
              if(res.data.code == 1000){
                  const data = res.data.data
                  data.map(item=>{
                      if(item.children && item.children.length>0){
                      item.children.unshift({code:'',name:'全部'})
                      }
                  })
                  data.unshift({code:'all_000',name:'全部'})
                  this.provinceAndCityList = data
                  this.tableDataHeader[1].selectOptions = this.provinceAndCityList
                  ++this.cascaderKey
                  this.initList()
              }else{
                  this.$message({
                      message: res.data.msg,
                      type: "warning"
                  });
              }
          })
      },
      getAreaList(){
          this.requestMethodGet('/weChat/common/getAreaDropsExcludeArea0000',{}).then(res=>{
              if(res.data.code == 1000){
                  const data = res.data.data
                  data.forEach(item=>{
                      item.label = item.name
                      item.value = item.code
                  })
                  this.areaList = data
                  this.tableDataHeader[0].selectOptions = this.areaList
              }else{
                  this.$message({
                      message: res.data.msg,
                      type: "warning"
                  });
              }
          })
      },
      // 区域下拉改变
      areaChange(e){
          this.requestMethodGet('/weChat/common/getAreaListByBusinessArea',{businessAreaCode:e}).then(res=>{
              if(res.data.code == 1000){
                  const data = res.data.data
                  this.provinceAndCityDataList = data
                  ++this.cascaderKey
                  this.chooseCity = []
                  this.getChoosedCity(e)
              }else{
                  this.$message({
                      message: res.data.msg,
                      type: "warning"
                  });
              }
          })
      },
      // 通过区域code查询该区域下的城市
      getChoosedCity(val){
          const params = {
              size:1000,
              current:1,
              areaCode:val,
              cityCode:''
          }
          this.requestMethodGet('/web/sys/conf/area/selectCityByCode',params).then(res=>{
              const data = res.data
              if(data.code == 1000){
                  let list = data.data.list
                  let arr = []
                  if(list && list.length>0){
                      list.forEach(item=>{
                          let cityList = []
                          cityList.push(item.provinceCode)
                          cityList.push(item.cityCode)
                          arr.push(cityList)
                      })
                      this.chooseCity=arr
                  }
              }
          }).catch(err=>{})
      },
      // 重置
      handleReset(){
          this.queryParams.areaCode = ''
          this.queryParams.cityCode = ''
          this.queryParamsCityCode = 'all_000'
          this.tableDataHeader.forEach(item=>{
            item.changeValue=""
          })
          this.initList()
      },
      // 保存
      saveAdd(){
          let params = {}
          if(this.parentCode && this.chooseCity.length>0){
              let cityArr = []
              this.chooseCity.forEach(item=>{
                  item.forEach((it,idx)=>{
                      if(idx == 1){
                          cityArr.push(it)
                      }
                  })
              })
              params.parentCode = this.parentCode
              params.code = cityArr
              this.requestMethodPost("/web/sys/conf/area/updateCompanyDic",params).then(res => {
                  const data = res.data
                  if(data.code == 1000){
                      // this.pagenation.size = 10
                      this.pagenation.current = 1
                      this.initList()
                      this.dialogVisible = false
                  }
              }).catch(err=>{})
          }else{
              this.pagenation.current = 1
              this.initList()
              this.dialogVisible = false
          }
          
      },
      // 取消
      cancelAdd(){
          // this.pagenation.size = 10
          this.pagenation.current = 1
          this.initList()
          this.dialogVisible = false
      },
      handleAreaConfig(){
          this.parentCode = ''
          this.chooseCity=[]
          this.dialogVisible = true
      },
      // 初始化查询
      initList(){
        this.loading=true
          if(this.queryParamsCityCode.length == 1 || this.queryParamsCityCode == 'all_000'){
              if(this.queryParamsCityCode == 'all_000'){
                  this.queryParams.provinceCode = ''
                  this.queryParams.cityCode = ''
              }
          }else {
              this.queryParams.provinceCode = this.queryParamsCityCode[0]
              this.queryParams.cityCode = this.queryParamsCityCode[1]
          }
          const params = Object.assign(this.pagenation,this.queryParams)
          this.requestMethodGet('/web/sys/conf/area/selectCityByCode',params).then(res=>{
              const data = res.data
              this.loading=false
              if(data.code == 1000){
                  const dataList = data.data.list
                  this.tableData = dataList || []
                  this.totalNumber = data.data.totalCount
              }
          }).catch(err=>{
              this.loading=false
          })
      },
      // 大小改变
      handleSizeChange(e){
          this.pagenation.size = e
          this.initList()
      },
      // 页数改变
      handleCurrentChange(e){
          this.pagenation.current = e
          this.initList()
      },
    },
    beforeDestroy() {
      window.removeEventListener("resize", () => {
        this.handleTableHeight();
      });
    }
}
</script>

<style lang="less" scoped>
@import "../../assets/css/customTable.less";
.el-cascader-menu {
  height: 300px;
}
.dealer-area {
  padding: 0 20px;
  height: 100%;
  position: relative;
  overflow: auto;
  &-serach-item {
    label {
      display: inline-block;
      width: auto;
      text-align: left;
      margin-right: 12px;
      padding-bottom: 10px;
    }
  }
}
</style>