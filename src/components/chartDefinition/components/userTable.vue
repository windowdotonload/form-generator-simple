<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :height="tableHeight"
      :key="tableKey"
      header-align="center">
      <el-table-column
        v-if="userType=='0'"
        prop="areaName"
        label="区域" >
      </el-table-column>
      <el-table-column
        v-if="userType!='2'"
        min-width="250"
        prop="companyName"
        show-overflow-tooltip
        :label="userType=='0'?'经销商':'客户'" >
      </el-table-column>
      <el-table-column
        label="总计" >
          <el-table-column
            v-if="showCustomerNum"
            prop="customerNum"
            label="客户数" >
          </el-table-column>
          <el-table-column
            v-if="showDeviceNum"
            prop="deviceNum"
            label="设备数" >
          </el-table-column>
          <el-table-column
            v-if="showUserNum"
            prop="userNum"
            min-width="110"
            label="经销商用户数" >
          </el-table-column>
          <el-table-column
            v-if="showUserNum"
            min-width="110"
            prop="userCustomerNum"
            label="客户用户数" >
          </el-table-column>
          <el-table-column
            v-if="showPesNum"
            min-width="110"
            prop="pesItemNum"
            label="计划工程服务服务项" >
          </el-table-column>
          <el-table-column
            v-if="showPesNum"
            min-width="110"
            prop="pesItemCompletedNum"
            label="已完成计划工程服务项" >
          </el-table-column>
          <el-table-column
            v-if="showCustomNum"
            min-width="110"
            prop="customVisitorNum"
            label="客户游客数" >
          </el-table-column>
          <el-table-column
            v-if="showWorkOrderNum"
            prop="workOrderNum"
            label="工单数" >
          </el-table-column>
          <el-table-column
            v-if="showDeviceNum && isTotalTableFlag"
            prop="integrityDevicePercent"
            min-width="100"
            :label="isTotalTableFlag?'有润滑点设备完善率':'设备完善率'" >
          </el-table-column>
      </el-table-column>
        <el-table-column v-for="(item,columIndex) in monthList" :label="item.label" :key="columIndexKey">
            <el-table-column
                v-if="showCustomerNum"
                label="客户数" >
                <template slot-scope="scope">
                  <div>
                    {{item.dataList[scope.$index].customerNum}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="showDeviceNum"
                label="设备数" >
                <template slot-scope="scope">
                  <div>
                    {{item.dataList[scope.$index].deviceNum}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="showDeviceNum"
                label="有润滑点设备数" >
                <template slot-scope="scope">
                  <div>
                    {{item.dataList[scope.$index].deviceOfHaveLubrNum}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="showDeviceNum"
                label="无润滑点设备数" >
                <template slot-scope="scope">
                  <div>
                    {{item.dataList[scope.$index].deviceOfNoLubrNum}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="showUserNum"
                min-width="110"
                label="经销商用户数" >
                <template slot-scope="scope">
                  <div>
                    {{item.dataList[scope.$index].userNum}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="showUserNum"
                min-width="110"
                label="客户用户数" >
                <template slot-scope="scope">
                  <div>
                    {{item.dataList[scope.$index].userCustomerNum}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="showPesNum"
                min-width="110"
                label="计划工程服务服务项" >
                <template slot-scope="scope">
                  <div>
                    {{item.dataList[scope.$index].pesItemNum}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="showPesNum"
                min-width="110"
                label="已完成计划工程服务项" >
                <template slot-scope="scope">
                  <div>
                    {{item.dataList[scope.$index].pesItemCompletedNum}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="showCustomNum"
                min-width="110"
                label="客户游客数" >
                <template slot-scope="scope">
                  <div>
                    {{item.dataList[scope.$index].customVisitorNum}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="showWorkOrderNum"
                label="工单数" >
                <template slot-scope="scope">
                  <div>
                    {{item.dataList[scope.$index].workOrderNum}}
                  </div>
                </template>
              </el-table-column>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props:{
    tableData:{
      type:Array,
      default:()=>{
        return []
      }
    },
    monthList:{
      type:Array,
      default:()=>{
        return []
      }
    },
    userType:{
      type:String,
      default:()=>{
        return ''
      }
    },
    tableHeight:{
      type:Number,
      default:()=>{
        return null
      }
    },
    showCustomerNum:{
      type:Boolean,
      default:()=>{
        return false
      }
    },
    showDeviceNum:{
      type:Boolean,
      default:()=>{
        return false
      }
    },
    showUserNum:{
      type:Boolean,
      default:()=>{
        return false
      }
    },
    showPesNum:{
      type:Boolean,
      default:()=>{
        return false
      }
    },
    showCustomNum:{
      type:Boolean,
      default:()=>{
        return false
      }
    },
    showWorkOrderNum:{
      type:Boolean,
      default:()=>{
        return false
      }
    },
    isTotalTableFlag:{
      type:Boolean,
      default:()=>{
        return true
      }
    }
  },
  data(){
    return{
      columIndexKey:1,
      tableKey:1
    }
  },
  watch:{
    monthList:{
      handler:function(val,oldVal){
        this.columIndexKey +=1
      },
      deep:true,
      immediate:true
    },
    isTotalTableFlag:{
      handler:function(val,oldVal){
        this.tableKey +=1
      },
      deep:true
    }
  },
  created(){

  },
  methods:{

  }
}
</script>

<style lang="less" scoped>

</style>