<template>
    <div>
      <el-table
       v-if="showDeviceNum && isAddEqTable"
        :data="tableEqData"
        style="width: 100%"
        tooltip-effect="dark"
        :header-cell-style="{ background: '#F5F7FA' }"
        :height="tableHeight"
        border
        :key="tableKey"
        header-align="center">
        <el-table-column
          prop="deviceNumber"
          min-width="150"
          label="设备ID" >
        </el-table-column>
        <el-table-column
            prop="deviceName"
            min-width="140"
            label="设备名称" >
        </el-table-column>
        <el-table-column
            prop="createTime"
            min-width="110"
            label="设备创建时间" >
        </el-table-column>
        <el-table-column
            prop="companyName"
            min-width="180"
            label="设备所属客户" >
        </el-table-column>
        <el-table-column
            min-width="110"
            prop="lubricationPointFlag"
            label="是否有润滑点" >
        </el-table-column>
        <el-table-column
            min-width="110"
            prop="lubricationPointNum"
            label="润滑点个数" >
        </el-table-column>
        <el-table-column  
            min-width="160"
            prop="createUser"
            label="客户创建/经销商创建" >
        </el-table-column>
        <el-table-column
            min-width="110"
            prop="copy"
            label="新建/复制创建" >
        </el-table-column>
        <el-table-column
            min-width="110"
            prop="dataIntegrityFlag"
            label="信息是否完善" >
        </el-table-column>
        <el-table-column
            min-width="180"
            prop="serviceFlag"
            label="过去90天是否做过服务" >
        </el-table-column>

        <el-table-column
            min-width="180"
            prop="distributeName"
            label="所属经销商" >
        </el-table-column>
        <el-table-column
            min-width="110"
            prop="areaName"
            label="区域" >
        </el-table-column>
        <el-table-column
            min-width="120"
            prop="saUser"
            label="经销商分管SA" >
        </el-table-column>
        <el-table-column
            min-width="120"
            prop="fesUser"
            label="经销商分管FES（包含高工）" >
        </el-table-column>
      </el-table>
      <el-table
       v-if="showWorkOrderNum && isAddWorkOrderTable"
        :data="tableWorkOrderData"
        style="width: 100%"
        :height="tableHeight"
        tooltip-effect="dark"
        :header-cell-style="{ background: '#F5F7FA' }"
        border
        :key="tableKey"
        header-align="center">
        <el-table-column
          prop="workOrderNumber"
          min-width="150"
          label="工单编码" >
        </el-table-column>
        <el-table-column
            prop="createTime"
            min-width="110"
            label="创建时间" >
        </el-table-column>
        <el-table-column
            prop="executePersonName"
            min-width="240"
            label="工单执行人" >
        </el-table-column>
        <el-table-column
            prop="valetOrderType"
            min-width="240"
            label="下单方式（客户自助/代客下单）" >
        </el-table-column>
        <el-table-column
            prop="serviceName1"
            min-width="180"
            label="工单一级服务类目" >
        </el-table-column>
        <el-table-column
            min-width="110"
            prop="serviceName2"
            label="二级服务类目" >
        </el-table-column>
        <el-table-column
            min-width="110"
            prop="serviceName3"
            label="三级服务类目" >
        </el-table-column>
        <el-table-column
            min-width="160"
            prop="workOrderStatusName"
            label="工单状态" >
        </el-table-column>
        <el-table-column
            min-width="160"
            prop="serviceGrade"
            label="服务工单级别" >
        </el-table-column>
        <el-table-column
            min-width="160"
            prop="serviceTimes"
            label="工单服务时长" >
        </el-table-column>
        <el-table-column
            min-width="210"
            prop="companyName"
            label="所属客户" >
        </el-table-column>
        <el-table-column
            min-width="180"
            prop="industryName1"
            label="客户所属行业一级分类" >
        </el-table-column>
        <el-table-column
            min-width="180"
            prop="industryName2"
            label="客户所属服务二级分类" >
        </el-table-column>

        <el-table-column
            min-width="180"
            prop="distributeName"
            label="所属经销商" >
        </el-table-column>
        <el-table-column
            min-width="110"
            prop="areaName"
            label="区域" >
        </el-table-column>
        <el-table-column
            min-width="120"
            prop="saUser"
            label="经销商分管SA" >
        </el-table-column>
        <el-table-column
            min-width="120"
            prop="fesUser"
            label="经销商分管FES（包含高工）" >
        </el-table-column>
      </el-table>

      <el-table
       v-if="showCustomerNum && isAddUserTable"
        :data="tableUserData"
        style="width: 100%"
        border
        tooltip-effect="dark"
        :header-cell-style="{ background: '#F5F7FA' }"
        :height="tableHeight"
        :key="tableKey"
        header-align="center">
        <el-table-column
          prop="userName"
          min-width="150"
          label="姓名" >
        </el-table-column>
        <el-table-column
            prop="roleName"
            min-width="110"
            label="角色" >
        </el-table-column>
        <el-table-column
            prop="phonenumber"
            min-width="110"
            label="手机号" >
        </el-table-column>
        <el-table-column
            prop="companyName"
            min-width="180"
            label="客户名称" >
        </el-table-column>
        <el-table-column
            min-width="110"
            prop="createTime"
            label="注册时间" >
        </el-table-column>
        <el-table-column
            min-width="150"
            prop="loginNum"
            label="登录次数" >
        </el-table-column>
        <el-table-column
            min-width="150"
            prop="loginTime"
            label="最后一次登录时间" >
        </el-table-column>
        <el-table-column
            min-width="180"
            prop="industryName1"
            label="客户所属行业一级分类" >
        </el-table-column>
        <el-table-column
            min-width="180"
            prop="distributorCompanyName"
            label="所属经销商" >
        </el-table-column>

        <el-table-column
            min-width="110"
            prop="areaName"
            label="区域" >
        </el-table-column>
        <el-table-column
            min-width="110"
            prop="vistorFlag"
            label="是否游客转化" >
        </el-table-column>
        <el-table-column
            min-width="110"
            prop="vistorCreateTime"
            label="游客登记时间" >
        </el-table-column>
        <el-table-column
            min-width="110"
            prop="vistorTransformTimes"
            label="游客转化时长" >
        </el-table-column>
      </el-table>

      <el-table
       v-if="showCustomerNum && isAddCustomerTable"
        :data="tableCustomerData"
        style="width: 100%"
        border
        :height="tableHeight"
        tooltip-effect="dark"
        :header-cell-style="{ background: '#F5F7FA' }"
        :key="tableKey"
        header-align="center">
        <el-table-column
          prop="companyName"
          min-width="150"
          label="客户" >
        </el-table-column>
        <el-table-column
            prop="industryName1"
            min-width="110"
            label="所属一级行业" >
        </el-table-column>
        <el-table-column
            prop="industryName2"
            min-width="240"
            label="所属二级行业" >
        </el-table-column>
        <el-table-column
            prop="labelName"
            min-width="180"
            label="PES/DPES/SP" >
        </el-table-column>
        <el-table-column
            min-width="140"
            prop="workOrderFlag"
            label="过去90天是否下单" >
        </el-table-column>
        <el-table-column
            min-width="150"
            prop="servicePackageName"
            label="当年计划工程服务档案名称" >
        </el-table-column>
        <el-table-column
            min-width="180"
            prop="servicePackageCreateTime"
            label="当年计划工程服务档案创建时间" >
        </el-table-column>

        <el-table-column
            min-width="180"
            prop="servicePackageCreateUser"
            label="当年计划工程服务档案创建人" >
        </el-table-column>
        <el-table-column
            min-width="150"
            prop="serviceItemNumFinish"
            label="已完成服务项数量" >
        </el-table-column>
        <el-table-column
            min-width="140"
            prop="serviceItemNumAll"
            label="所有服务项数量" >
        </el-table-column>
        <el-table-column
            min-width="110"
            prop="serviceItemNumRatio"
            label="服务项完成率" >
        </el-table-column>
        <el-table-column
            min-width="110"
            prop="distributeName"
            label="所属经销商" >
        </el-table-column>
        <el-table-column
            min-width="110"
            prop="areaName"
            label="区域" >
        </el-table-column>
        <el-table-column
            min-width="120"
            prop="saUser"
            label="经销商分管SA" >
        </el-table-column>
        <el-table-column
            min-width="120"
            prop="fesUser"
            label="经销商分管FES" >
        </el-table-column>
        <el-table-column
            min-width="120"
            prop="dbcUser"
            label="经销商分管DBC" >
        </el-table-column>
      </el-table>
      
      
    </div>
  </template>
  
  <script>
  export default {
    props:{
      tableEqData:{
        type:Array,
        default:()=>{
          return []
        }
      },
      tableUserData:{
        type:Array,
        default:()=>{
          return []
        }
      },
      tableWorkOrderData:{
        type:Array,
        default:()=>{
          return []
        }
      },
      tableCustomerData:{
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
      isAddCustomerTable:{
        type:Boolean,
        default:()=>{
          return false
        }
      },
      isAddEqTable:{
        type:Boolean,
        default:()=>{
          return false
        }
      },
      isAddUserTable:{
        type:Boolean,
        default:()=>{
          return false
        }
      },
      isAddWorkOrderTable:{
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