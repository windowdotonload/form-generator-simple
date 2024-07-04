<template>
<div>
  <el-card  style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header"  class="title">
      <el-divider direction="vertical"></el-divider>
      <span>润滑推荐</span>
    </div>
    <div v-for="(val,index) in LubricationRecommendedObj" :key="index" style="padding:0 20px;">
      <div style="font-family:MicrosoftYaHei-Bold;font-size:14px;margin-bottom:20px;">
        <div v-if="index !=0 && index <= LubricationRecommendedObj.length+1" style="border-top: 1px solid #DCDFE6;  padding-top: 20px; margin-top: 10px;"></div>
        <div style="display:flex;justify-content: space-between;align-items: center;">
            <div style="color:#000;font-weight:bold;display:flex;align-items: center;">润滑点
              <span style="color:rgb(211,0,0);font-weight:bold;margin-left:4px;margin-right:40px;">{{index+1}}</span>
              <div v-if="val.lubricationPointNumber && val.deviceNumber" @click="handleRefresh(val.deviceNumber,val.lubricationPointNumber,index)"  style="color:#001450;font-weight:normal;font-size:13px;margin-right:20px;cursor: pointer;"><i class="el-icon-refresh-right" style="margin-right:4px;"></i>刷新数据</div>
              <div v-if="val.lubricationPointNumber && val.deviceNumber" @click="handleEdit(val.deviceNumber)" style="color:#001450;font-weight:normal;font-size:13px;cursor: pointer;"><i class="el-icon-edit" style="margin-right:4px;"></i> 前往补充</div>
            </div>
            <span @click="deleteLumItem(index)"  style="color:rgb(211,0,0);font-family:MicrosoftYaHei;margin-left:24px;cursor:pointer;">删除</span>
        </div>
      </div>
    <el-form :model="val" ref="LubricationRecommendedRef" label-position="top" label-width="300px"  style="padding:0 0px;">
      <el-row :gutter="24">
        <div v-for="(item,i) in val.children" :key="i"> 
          <el-col :span="item.nameKey != 'key_151' ? 6 : 24">
          <el-form-item 
          :label='item.name'
          v-if="item.nameKey != 'key_144_box_capacity_unit' && item.nameKey != 'key_146_check_period_unit' && item.nameKey != 'key_149_oil_change_unit' && item.nameKey != 'key_144_box_capacity' && item.nameKey != 'key_146_check_period' && item.nameKey != 'key_149_oil_change' "
          :required="item.required"
          >
          <el-input 
            v-if="item.type == 'input1' && type == 'edit' && item.nameKey == 'key_151'" 
            placeholder="请输入" 
            v-model="item.value"
            :maxlength="item.length"
            style="width:80%" 
            show-word-limit
            size="small"
            clearable>
          </el-input>
          <!-- 设备类型 -->
          <el-cascader
            v-if="type == 'edit' && item.type == 'dropdown' && item.nameKey == 'device_type'"
            :ref="`item+${index}`"
            :options="eptList"
            :disabled='item.disabled'
            v-model="item.valueCode"
            :key="`${index}`"
            size="small"
            style="width:80%" 
            @change="(deviceId) => deviceTypeChange(deviceId, index,)"
            :props="{value:'code',label:'name'}"
            clearable>
            </el-cascader>
          <!-- 在用油名称 -->
          <el-select v-if="type == 'edit' && item.type == 'dropdown' && (item.nameKey == 'lup_current_oil_140' ||  item.nameKey == 'lup_current_oil_141')" size="small" 
            :ref='`item+${index}+${item.nameKey}`' 
            :disabled='item.disabled'
            v-model="item.valueCode" 
            placeholder="请选择" 
            clearable 
            filterable 
            remote
            :loading="loadingRemote"
            :remote-method="getOilList" 
            @change="oilNameChange(item,index)" 
            style="width:80%;margin-bottom:20px;">
            <el-option v-for="item in oilNameList" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
          </el-select>
          <!-- <el-cascader
            v-if="type == 'edit' && item.type == 'dropdown' && (item.nameKey == 'lup_current_oil_140' ||  item.nameKey == 'lup_current_oil_141')"
            :ref='`item+${index}+${item.nameKey}`'
            :options="oilNameList"
            :disabled='item.disabled'
            filterable
            v-model="item.valueCode"
            :key="oilNameKey2"
            size="small"
            style="width:80%;margin-bottom:20px;" 
            @change="oilNameChange(item,index)"
            :props="{ 
              value:'oilNumber',
              label:'oilName',
              children:'children'
              }"
            clearable>
          </el-cascader> -->
            <!-- 润滑点设备类型 -->
          <el-select
            v-if="type == 'edit' && item.type == 'dropdown' && item.nameKey == 'lup_type'"
            size="small"
            clearable
            :disabled='item.disabled'
            :ref="`device+${index}`"
            style="width:80%" 
            v-model="item.value"
            filterable
            @change="(deptId) => lupType(deptId, index)"
            placeholder="请选择"
          >
            <el-option
              v-for="dic in lubricationPointTypeList"
              :key="dic.code"
              :label="dic.name"
              :value="dic.code"
            ></el-option>
          </el-select>
          <el-input
            v-if="item.type == 'input1' && type == 'edit' && item.name != '备注'"
            placeholder="请输入" 
            v-model="item.value"
            :disabled='item.disabled'
            :maxlength="item.length"
            style="width:80%" 
            size="small"
            clearable>
          </el-input>
          <el-select
            v-if="type == 'edit' && item.type == 'dropdown2' && item.nameKey=='key_142'"
            size="small"
            clearable
            :disabled='item.disabled'
            style="width:80%" 
            v-model="item.value"
            placeholder="请选择"
            @change="(selectId) => LumMethods(selectId, index)"
          >
            <el-option
              v-for="item in item.fieldOption"
              :key="item.value"
              :label="item.option"
              :value="item.value"
            ></el-option>
          </el-select>
          </el-form-item>
        </el-col>
            <el-col v-if="item.type == 'input2' "  v-for="(cylinder,index) in item.children" :key="index" :span="6" class="select-input">
            <el-form-item :label="item.name+'：'" :required="item.required">
              <el-input style="width:80%"  
              v-model="item.value" size="small"  
              :disabled='item.disabled'
              :maxlength="item.length"
              @focus="(unitId) => oilChangePeriodFocus(unitId, index,item)"
              class="input-with-select">
              <el-select  v-model="cylinder.value"  :disabled='item.disabled'  v-if="cylinder.type == 'dropdown2' && type == 'edit'"  size="small" slot="append" placeholder="请选择">
                <el-option
                v-for="dic in cylinder.fieldOption"
                :key="dic.value"
                :label="dic.option"
                :value="dic.option"
                ></el-option>
              </el-select>
            </el-input>
            </el-form-item>
          </el-col>
        </div>
      </el-row>
    </el-form>
    </div>
    <span style="font-family:MicrosoftYaHei-Bold;font-size:14px;color:#000;font-weight:bold;padding:0 20px;">添加润滑点：</span>
    <el-button style="font-family:MicrosoftYaHei;font-size:14px;color:rgb(0,20,80);padding-left:20px;" type="text" @click="addLubricationPoints" icon="el-icon-plus">从系统选择</el-button>
  <el-button style="font-family:MicrosoftYaHei;font-size:14px;color:rgb(0,20,80);padding-left:20px;" type="text" @click="addLumParts" icon="el-icon-plus">临时添加</el-button>
  </el-card>
  <!-- 添加润滑点弹框 -->
    <el-dialog title="添加润滑点"  :visible.sync="addLubricationPointsVisiable" :append-to-body="true" width="45%" class="create-task">
      <div style="display: flex;justify-content: space-between;align-items: center;margin-bottom:10px;">
        <div style="font-family:MicrosoftYaHei-Bold;font-size:16px;line-height:14px;color:#000;display: flex; align-items: center;">
          <span style="width:8px;height:8px;display:inline-block;border-radius:50%;background:#dd0000;margin-right:8px;"></span>
          {{contactCompanyName}}
        </div>
        <el-input
        size="small"
        v-model="queryParams.lDOName"
        placeholder="请输入关键词"
        suffix-icon="el-icon-search"
        style="width:30%;"
        maxlength="50"
        @change="handleSearchTableData"
        clearable
        ></el-input>
      </div>
      <div>
        <el-table
        :data="lumDataCustomers"
        tooltip-effect="dark"
        ref='tableAddLumData'
        v-loading="loadingLum"
        v-el-table-infinite-scroll="load"
        class='add-lum'
        :row-key="rowKey"
        @select="handleSelectLum"
        @select-all='selectAll'
        >
        <el-table-column
          type="selection"
          :selectable="checkedSelectLum" 
          :reserve-selection="true"
          width="55">
        </el-table-column>
        <el-table-column
          prop="serviceimg"
          min-width="20%"
          label="润滑点">
          <template width="90" slot-scope="scope">
            <div style="display: flex;align-items: center;">
              <img style="width:64px;height:64px;border:none;margin-right:12px;" :src="scope.row.lubricationPointPicPath ? scope.row.lubricationPointPicPath  : defaultIcon">
              <span>{{scope.row.lubricationPointType}} <span v-if="scope.row.lubricationPointName"> - {{scope.row.lubricationPointName}}</span></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="deviceName"
          min-width="18%"
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="oilName"
          min-width="10%"
          label="润滑油">
          <template slot-scope="scope">
            {{scope.row.oilName || '暂无'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="lastOilChangeTime"
          min-width="15%"
          label="上次任务日期">
          <template slot-scope="scope">
            {{scope.row.lastOilChangeTime || '暂无'}}
          </template>
        </el-table-column>
        <p v-if="this.lubrtotalCount > this.lumDataCustomers.length">加载中...</p>
        <p v-else>没有更多了</p>
      </el-table>
      </div>
      <div slot="footer">
        <el-button type="danger" plain @click="handleResetAddLum('ruleForm')" size="small">取消</el-button>
        <el-button type="danger" @click="handleSubmitAddLum()" size="small">添加</el-button>
      </div>
    </el-dialog>

    <!-- 选择润滑点 -->
    <lupDialogNew
      :chooseDeviceAndLupDialog="chooseDeviceAndLupDialog"
      :singleFlag="false"
      :checkedDevice="checkedDevice"
      :urlType="urlType"
      :taskType="taskType"
      :companyName="contactCompanyName"
      :companyId="companyId"
      :companyNumber="companyNumber"
      :workshopId="workshopId"
      :plantStudyServiceFlag="plantStudyServiceFlag"
      :reportType="reportType"
      v-on:cancelChooseDeviceAndLup="cancelChooseDeviceAndLup"
      v-on:confirmChooseLup="confirmChooseLup">
    </lupDialogNew>
</div>
  
</template>

<script>
import lupDialogNew from '../../spotInspection/components/chooseLubricationPointNew.vue'
export default {
  props:{
    type:{
      type:String,
      default:()=>{
        return ''
      }
    },
    LubricationRecommendedObj:{
      type:Array,
      default:()=>{
        return []
      }
    },
    defaultNodeDto:{
      type:Object,
      default:()=>{
        return []
      }
    },
    defaultNodeWithDisabledInfoDto:{
      type:Object,
      default:()=>{
        return []
      }
    },
    contactCompanyName:{
      type:String,
      default:()=>{
        return ''
      }
    },
    workshopId:{
      type:String,
      default:()=>{
        return ''
      }
    },
    reportType:{
      type:String,
      default:()=>{
        return ''
      }
    },
    companyNumber:{
      type:String,
      default:()=>{
        return ''
      }
    },
    companyId:{
      type:String,
      default:()=>{
        return ''
      }
    }
  },
  components:{ lupDialogNew },
  data(){
    return{
      loadingRemote: false,
      chooseDeviceAndLupDialog:false,
      plantStudyServiceFlag:false,
      urlType:'workOrderReport',
      taskType:'createTask',
      checkedDevice:[],
      checked: false,
      pagenationLumCustomer: {   // 润滑点分页
        current: 1,
        size: 30
      },   
      defaultIcon:require("../../../assets/device_default.png"),
      addLubricationPointsVisiable:false,   // 新增润滑点弹框
      oilNameList:[]      ,   // 油品下拉列表
      lubricationPointTypeList:[],   // 润滑点设备类型数据
      eptList:[],   // 设备类型下拉数据
      queryParams:{  // 润滑点的搜索字段
        taskName:'',
        lDOName:''
      },  
      lumDataCustomers:[],   // 润滑点列表数据
      lubricationPointNumbersNew:[],   // 润滑点编码列表
      seleLumsAllMsg:[],   // 选择的润滑点列表
      selectLumsNew:[],  // 最新选中的润滑点列表(除去原先选中的数据)
      loadingLum:false,
      contactCompanyName:''   // 润滑点弹框显示的公司名称
    }
  },
  mounted(){
    this.$_queryLPData()
    this.getEptList()
  },
  created(){
    this.getOilList()
    this.LubricationRecommendedObj.forEach(item=>{
          item.children.forEach(i=>{
            if(i.nameKey == 'key_149_oil_change' && i.value == '滚动轴承') {
              i.name = '加脂周期'
            } else if(i.nameKey == 'key_149_oil_change' && i.value != '滚动轴承') {
              i.name = '换油周期'
            }
          })
      })
  },
  methods:{
    // 取消添加润滑点
    handleResetAddLum() {
      this.addLubricationPointsVisiable = false
      this.queryParams.lDOName= ''
    },
    handleSearchTableData(val) {
      if(val) {
        this.queryParams.lDOName = val
        this.lumDataCustomers = []
        this.pagenationLumCustomer.current=1
        this.$_getCustomerLumData('select') 
      } else {
        this.$_getCustomerLumData('noset')
      }
    },
    // 润滑点全选
    selectAll(val) {
      this.seleLumsAllMsg = []
      if(val.length) {
        this.seleLumsAllMsg = val
      } else {
        this.lubricationPointNumbersNew = []
        this.seleLumsAllMsg=[]
      }
    },
    checkedSelectLum(row,index){
      if(this.lubricationPointNumbersNewArr.length>0) {
        return !this.lubricationPointNumbersNewArr.includes(row.lubricationPointNumber)
      } else {
        return true
      }
    },
    load() {
      if(this.loadMoreBon && !this.loadingLum) {
        this.pagenationLumCustomer.current = ++this.pagenationLumCustomer.current;
        this.$_getCustomerLumData()
      }
    },
    // 添加润滑点提交
    handleSubmitAddLum() {
      const loading = this.$loading({
        lock: true,
        text: "请稍后，Loading...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      this.lubricationPointNumbersNew=[]
      // this.lumData=[]
      // this.lumData = JSON.parse( JSON.stringify(this.seleLumsAllMsg));
      this.lubricationPointNumbersNewArr.forEach(element => {
        this.lumData.forEach((item,index) => {
            if(item.lubricationPointNumber == element) {
              this.lumData.splice(index,1)
            }
        });
      });
      // 给默认结构赋值
      this.lumData.map((item,index)=>{
          let defaultNodeDtoObj = JSON.parse(JSON.stringify(this.defaultNodeWithDisabledInfoDto))
          defaultNodeDtoObj.deviceNumber = item.deviceNumber
          defaultNodeDtoObj.lubricationPointNumber = item.lubricationPointNumber
          defaultNodeDtoObj.children.map((it)=>{
            if(it.nameKey == 'key_device_name') {
              it.value = this.lumData[index].deviceName
              it.valueCode = this.lumData[index].deviceNumber
            }
            if(it.nameKey == 'device_type') {   // 设备类型
              it.value = this.lumData[index].deviceTypeName   // 名称
              it.valueCode = this.lumData[index].deviceType  // code编码
            }
            if(it.nameKey == 'key_lup_name') {  // 润滑点设备名称
              it.value = this.lumData[index].lubricationPointName
              it.valueCode = this.lumData[index].lubricationPoint
            }
            if(it.nameKey == 'lup_type') {  // 润滑点设备类型
              it.value = this.lumData[index].lubricationPointType
              it.valueCode = this.lumData[index].lubricationPointTypeCode  // code编码
            }
            if(it.nameKey == 'key_142') {  // 润滑方式
              it.value = this.lumData[index].lubricationMethodName
              it.valueCode = this.lumData[index].lubricationMethod
            }
            if(it.nameKey == 'key_149_oil_change' && item.lubricationPointTypeCode == 'lubrication_point_type_0007') {  // 换油加脂周期  和单位
                it.name = '加脂周期'
                it.value = this.lumData[index].oilChangePeriod
                it.children[0].value = this.lumData[index].oilChangePeriodUnit
            } else if(it.nameKey == 'key_149_oil_change' && item.lubricationPointTypeCode != 'lubrication_point_type_0007') {
                it.name = '换油周期'
                it.value = this.lumData[index].oilChangePeriod
                it.children[0].value = this.lumData[index].oilChangePeriodUnit
            }
            if(it.nameKey == 'key_144_box_capacity') {  // 油箱容量 和 油箱容量单位 
              it.value = this.lumData[index].oilBoxCapacity
              it.children[0].value  = this.lumData[index].oilBoxCapacityUnit
              if(this.lumData[index].oilType && this.lumData[index].oilType == 1) {
                it.required = true
              } else {
                it.required = false
              }
            }
          })
          this.LubricationRecommendedObj.push({...defaultNodeDtoObj})
      })
      setTimeout(() => {
        loading.close();
      }, 2000);
      this.addLubricationPointsVisiable = false
    },
    rowKey(row) {
      return row.lubricationPointNumber
    },
    //添加润滑点单个选择
    handleSelectLum(rows, row) {
      // selected    true就是选中，0或者false是取消选中
      let selected = rows.length && rows.indexOf(row) !== -1
      if(selected==false || selected==0 ) {
        if(this.seleLumsAllMsg.length) {
          this.seleLumsAllMsg.splice(this.seleLumsAllMsg.findIndex(item => item.lubricationPointNumber === row.lubricationPointNumber), 1)
        }
        this.lubricationPointNumbersNew.splice(this.lubricationPointNumbersNew.findIndex(item => item === row.lubricationPointNumber), 1)
      } else {
        if(this.seleLumsAllMsg.length) {
          let cont = this.seleLumsAllMsg.filter(item=>item.lubricationPointNumber==row.lubricationPointNumber)
          if(cont.length==0) {
            this.seleLumsAllMsg.push(row)
            this.lubricationPointNumbersNew.push(row.lubricationPointNumber)
          }
        } else {
          this.seleLumsAllMsg.push(row)
          this.lubricationPointNumbersNew.push(row.lubricationPointNumber)
        }
      }
    },
    // 取消选择润滑点
    cancelChooseDeviceAndLup(){
      this.chooseDeviceAndLupDialog = false
    },
    // 选择润滑点确定按钮
    confirmChooseLup(list){
      console.log(list)
      this.lumData = list
      this.lubricationPointNumbersNew = []
      if(list.length){
        list.forEach(item=>{
          this.lubricationPointNumbersNew.push(item.lubricationPointNumber)
        })
      }
      // console.log(this.lubricationPointNumbersNew,this.lumData)
      this.handleSubmitAddLum()
      this.chooseDeviceAndLupDialog = false
    },
    // 添加润滑点
    addLubricationPoints() {
      this.lubricationPointNumbersNew = []
      this.LubricationRecommendedObj.forEach(item=>{
        if(item.lubricationPointNumber) {
          this.lubricationPointNumbersNew.push(item.lubricationPointNumber)
        }
      })
      this.checkedDevice=this.LubricationRecommendedObj.filter(it=>{
        return it.lubricationPointNumber
      })
      this.lubricationPointNumbersNewArr= JSON.parse( JSON.stringify(this.lubricationPointNumbersNew)) 
      if(this.companyNumber) {
        this.chooseDeviceAndLupDialog = true;
        this.queryParams.lDOName=''
        this.pagenationLumCustomer.current = 1
        this.$_getCustomerLumData('first')
      }  else {
        this.addLubricationPointsVisiable = true;
        this.$_getCustomerLumData('first')
      }
    },
    rowKey(row) {
      return row.lubricationPointNumber
    },
    // 获取工单中的润滑点列表
    $_getCustomerLumData(val) {
      if(val=='first') {
        this.seleLumsAllMsg=[]
        this.lumDataCustomers = []
        this.pagenationLumCustomer.current=1
        this.queryParams.lDOName=''
      }
      if(val=='noset') {
        this.pagenationLumCustomer.current=1
        this.lumDataCustomers=[]
      }
      this.loadingLum = true;
      let params = {
        companyNumber:this.companyNumber,
        current:this.pagenationLumCustomer.current,
        size:this.pagenationLumCustomer.size,
        LDOName:this.queryParams.lDOName,
        workshopId:this.workshopId,
        reportType:3,
        plantStudyServiceFlag:false
      };
      this.requestMethodGet("/workOrder/getLubricationPointByCompany", params)
        .then(res => {
          this.loadingLum = false;
          res = res.data;
          if (res.code == 1000) {
            if(res.data.list.length>0) {
              this.lumDataCustomers = this.lumDataCustomers.concat(res.data.list) 
              this.$refs.tableAddLumData.clearSelection();
              this.$nextTick(()=>{
                if(this.lubricationPointNumbersNew.length) {
                  this.lumDataCustomers.map(item=>{ 
                    this.lubricationPointNumbersNew.map(element=>{
                      if(item.lubricationPointNumber == element) {
                        this.seleLumsAllMsg.push(item)
                        this.$refs.tableAddLumData.toggleRowSelection(item);
                      }
                    })
                  })
                } 
                const hash = {};
                const newArray = this.seleLumsAllMsg.reduce((item, next)=>{
                    hash[next.lubricationPointNumber] ? '' : hash[next.lubricationPointNumber] = true && item.push(next);
                    return item;
                },[])
                this.seleLumsAllMsg = newArray
              })
              
            }
            this.lubrtotalCount = res.data.totalCount
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.loadingLum = false;
        });
    },
    // 刷新数据
    handleRefresh(deviceNumber,lubricationPointNumber,index) {
      this.$_queryEPInfo(deviceNumber,index);
      this.$_getLubricationPointDetail(lubricationPointNumber,index) 
    },
     // 查询设备档案详情
    $_queryEPInfo(val,index) {
      let params = {
        deviceNumber:val
      };
      this.requestMethodGet("/web/device/queryDevice", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const data = this.LubricationRecommendedObj[index].children
            data.filter(item=>{
              if(item.nameKey == 'key_device_name') {
                item.value = res.data.deviceName
              }
              if(item.nameKey == 'key_device_code') {
                item.value = res.data.deviceCode
              }
              if(item.nameKey == 'device_type') {
                item.value = res.data.deviceTypeName
                item.valueCode = res.data.deviceTypeDto[res.data.deviceTypeDto.length-1].code
              }

            })
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 查看润滑点详情
    $_getLubricationPointDetail(val,index) {
      let params = {
        lubricationPointNumber:val
      };
      this.requestMethodGet(
        "/web/device/queryLubricationPointDetail",
        params
      )
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const data = this.LubricationRecommendedObj[index].children
            data.filter(it=>{
            if(it.nameKey == 'lup_type') {  // 润滑点设备类型
              it.value = res.data.lubricationPointType
              it.valueCode = res.data.lubricationPointTypeCode  // code编码
            }
            if(it.nameKey == 'key_lup_name') {  // 润滑点设备名称
              it.value = res.data.lubricationPointName
            }
            if(it.nameKey == 'key_142') {  // 润滑方式
              it.value = res.data.lubricationMethodName
              it.valueCode = res.data.lubricationMethod
            }
            if(it.nameKey == 'key_144_box_capacity') {  // 油箱容量 和 油箱容量单位
              it.value = res.data.oilBoxCapacity
              it.children[0].value = res.data.oilBoxCapacityUnit
              it.required = res.data.oilType == 1 ? true : false
            }
            if(it.nameKey == 'key_149_oil_change' && res.data.lubricationPointTypeCode == "lubrication_point_type_0007") {  // 换油加脂周期  和单位
              it.name = '加脂周期'
              it.value = res.data.oilChangePeriod
              it.children[0].value  = res.data.oilChangePeriodUnitDesc
            } else if(it.nameKey == 'key_149_oil_change' && res.data.lubricationPointTypeCode != "lubrication_point_type_0007") {
              it.name = '换油周期'
              it.value = res.data.oilChangePeriod
              it.children[0].value  = res.data.oilChangePeriodUnitDesc
            }

            })
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 前往编辑
    handleEdit(val) {
      let routeUrl = this.$router.resolve({
        path: "/EquipmentProfile/EditEquipmentProfile",
        query: {deviceNumber:val}
      });
      window.open(routeUrl.href, '_blank');
    },
    // 润滑方式下拉
    LumMethods(val,index) {
      let oilTypeDevice;
      const data = this.LubricationRecommendedObj[index].children
            data.filter(it=>{
            if(it.nameKey == 'key_142') {  // 润滑方式
              let optionsData = it.fieldOption
              let index1 = optionsData.find(item=>item.value == val)
              oilTypeDevice = index1.oilType
              it.value = index1.option
              it.valueCode = index1.value
            }
            if(it.nameKey == 'key_144_box_capacity') {  // 润滑方式
                if(oilTypeDevice == 1) {
                  it.children[0].value = 'L'
                  it.required = true
                } else if(oilTypeDevice == 2){
                  it.children[0].value = 'KG'
                  it.required = false
                } else {
                  it.required = true
                  it.children[0].value = 'L'
                }
            }
            })
    },
    /**
     * arr：数组
     * key：新key名
     * replaceKey：原始key名
     **/
    replaceObjectKey(arr, key, replaceKey) {
      let newArr = [];
      arr.forEach((item, index) => {
        for (var i = 0; i < key.length; i++) {
          item[key] = item[replaceKey];
        }
        // 删除原始key名
        delete item[replaceKey];
        newArr.push(item);
      });
      return newArr;
    },
    // 通过润滑点设备类型获取 润滑方式下拉框数据
    $_queryLubricationMethodData(val,index) {
      let params = {
        typeCode:val
      };
      let oilTypeDevice;
      this.requestMethodGet("/web/device/getLubricationMethodByType", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const data = this.LubricationRecommendedObj[index].children
            data.filter(it=>{
            if(it.nameKey == 'key_142') {  // 润滑方式
              let newArr = this.replaceObjectKey(res.data, "option", "name");
              newArr = this.replaceObjectKey(res.data, "value", "code");
              it.fieldOption = newArr
              if(res.data.length == 1) {
                it.value = newArr[0].option
                it.valueCode= newArr[0].value
                oilTypeDevice = newArr[0].oilType
              } else {
                it.value =''
                it.valueCode= ''
                oilTypeDevice = ''
              }
            }
            if(it.nameKey == 'key_144_box_capacity') {  // 油箱容量
                if(oilTypeDevice == 1) {
                  it.children[0].value = 'L'
                  it.required = true
                } else if(oilTypeDevice == 2){
                  it.children[0].value = 'KG'
                  it.required = false
                } else {
                  it.required = true
                  it.children[0].value = 'L'
                }
            }
            })
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 润滑点设备类型选择框
    lupType(deptId,index) {
      this.$_queryLubricationMethodData(deptId,index)
      let arr = this.LubricationRecommendedObj[index].children.find(item=>item.nameKey=='key_149_oil_change')
      if( deptId) {
        if(deptId == 'lubrication_point_type_0007') {
          arr.name = '加脂周期'
        } else{
          arr.name = '换油周期'
        }
      } else {
        arr.name = '换油/加脂周期'
      }
      const data = this.LubricationRecommendedObj[index].children
        let arr1 = data.find(item=>item.nameKey=='lup_type')
        this.$nextTick(()=>{
          arr1.value = this.$refs[`device+${index}`][0].selectedLabel
          arr1.valueCode = deptId
        })
    },
    oilChangePeriodFocus(unitId, index,item){
      let arr = this.LubricationRecommendedObj[index].children.find(item=>item.nameKey=='lup_type')
      if(!arr.value && item.nameKey=="key_149_oil_change") {
        this.$message({
          message: '请先选择润滑点设备类型',
          type: 'error'
        });
      }
    },
     // 设备类型change事件
    deviceTypeChange(deviceId,index){
      if(deviceId) {
        const data = this.LubricationRecommendedObj[index].children
        let indexLumType = data.findIndex(it=>it.nameKey=="device_type")
        this.$nextTick(()=>{
          const checkedData = this.$refs[`item+${index}`][0].panel.getNodeByValue(deviceId)
          this.LubricationRecommendedObj[index].children[indexLumType].value = checkedData.label
          this.LubricationRecommendedObj[index].children[indexLumType].valueCode = checkedData.path[checkedData.path.length-1]
        })
      }
    },
    // 删除润滑部位
    deleteLumItem(index) {
      this.$confirm('删除后，您填写的内容将被清空', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.LubricationRecommendedObj.splice(index, 1);
        }).catch(() => {
        });
    },
    // 添加润滑部位
    addLumParts() {
      const data = JSON.parse(JSON.stringify(this.defaultNodeDto))
      data._uid = Date.now()
      this.LubricationRecommendedObj.push(data)
    },
    // 设备类型
    getEptList(){
      this.requestMethodGet('/weChat/device/queryAllDeviceTypeTree4',{}).then(res=>{
        if(res.data.code == 1000){
          this.eptList = res.data.data
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    //查询润滑点
    $_queryLPData() {
      let params = {
        parentCode: "lubrication_point_type"
      };
      this.requestMethodGet("/web/customer/getIndustryTreeList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.lubricationPointTypeList = res.data;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 获取dropdown1类型的dic下拉数据源
    getDicList(key){
      this.requestMethodGet("/web/common/dic/drops",{name:key}).then(res=>{
        res=res.data
        if(res.code == 1000){
          this.deviceForm.forEach(item=>{
          if(item.nameKey == key){
            item.dicList = res.data
          }
        })
        }else{
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      })
    }, 
      // 获取油品下拉
    getOilList(val){
      this.loadingRemote = true
      this.requestMethodGet("/mdm/oil/queryOilListByPage", {oilName:val, status:1, size:200, current:1})
        .then(res => {
          res = res.data;
          this.loadingRemote = false
          if (res.code == 1000) {
            this.oilNameList = res.data.list
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
     // 用油名称改变
    oilNameChange(item,index){
      this.$nextTick(()=>{
        const checkedData = this.$refs[`item+${index}+${item.nameKey}`][0].getCheckedNodes()[0]
        if(item.nameKey == 'lup_current_oil_140') {
        const data = this.LubricationRecommendedObj[index].children
        
        let oilNameValueCode = []
        let oilBrandValueCode = item.valueCode[0]
        data.forEach(it=>{
          // || it.nameKey == "lup_current_oil_141"
          if(it.nameKey == "lup_current_oil_140" ){
            oilNameValueCode = it.valueCode
          }
        })
        if(oilBrandValueCode == 'oil_0001'){//美孚
          if(oilNameValueCode.length != 4){
            this.$message({
              message:'请选择原推荐产品或在用产品',
              type:'error'
            })
            item.value = ''
            item.valueCode = ''
            return
          }else{
            item.value = checkedData.label
            item.valueCode = checkedData.path[checkedData.path.length-1]
          }
        }else{
          if(oilNameValueCode.length != 3){
            this.$message({
              message:'请选择原推荐产品或在用产品',
              type:'error'
            })
            item.value = ''
            item.valueCode = ''
            return
          }else{
            item.value = checkedData.label
            item.valueCode = checkedData.path[checkedData.path.length-1]
          }
        }
      } else if(item.nameKey == 'lup_current_oil_141'){
        const data1 = this.LubricationRecommendedObj[index].children
        let oilNameValueCode1 = []
        let oilBrandValueCode1 = item.valueCode[0]
        data1.forEach(it=>{
          if(it.nameKey == "lup_current_oil_141" ){
            oilNameValueCode1 = it.valueCode
          }
        })
        if(oilBrandValueCode1 == 'oil_0001'){//美孚
          if(oilNameValueCode1.length != 4){
            this.$message({
              message:'请选择推荐产品',
              type:'error'
            })
            item.value = ''
            item.valueCode = ''
            return
          }else{
            item.value = checkedData.label
            item.valueCode = checkedData.path[checkedData.path.length-1]
          }
        }else{
          if(oilNameValueCode1.length != 3){
            this.$message({
              message:'请选择推荐产品',
              type:'error'
            })
            item.value = ''
            item.valueCode = ''
            return
          }else{
            item.value = checkedData.label
            item.valueCode = checkedData.path[checkedData.path.length-1]
          }
        }
      }
      })
      
      
    },
    // 验证
    validateLubricationRecommended(){
      const data = this.LubricationRecommendedObj
      if(this.LubricationRecommendedObj.length == 0) {
        this.$message({
          message:'请添加润滑点',
          type:'error'
        })
        return
      }
      let emptyList=[]
      let dataType = [] 
      let checkPeriod =[]
      let oilChange = []
      let MaxNum = []
      let MaxNumCheck = []
      let boxCapacity = false
      let checkPeriodBol = false
      let oilChangeBol = false
      data.forEach(item=>{
        item.children.forEach(it=>{
          if(it.required && !it.value) {
            emptyList.push(it)
          }
        })
        // 找到油箱容量的数据
        item.children.forEach(iy=>{
          if(iy.nameKey == 'key_144_box_capacity') {
            dataType.push(iy)
          }
        })
        // 找到检查周期的数据
        item.children.forEach(ir=>{
          if(ir.nameKey == "key_146_check_period") {
            checkPeriod.push(ir)
          }
        })
        // 找到换油/加脂周期的数据
        item.children.forEach(iw=>{
          if(iw.nameKey == "key_149_oil_change") {
            oilChange.push(iw)
          }
        })
      })
      // 查询 加油/加脂周期 对应的单位 以及校验数据是否合规
      oilChange.forEach(io=>{
        if(io.value){
          // 校验 换油周期值是否合法
          const regst = /^[1-9]\d*$/;
          const formateNum2 = Number(io.value)
          const regTestResult2 = regst.test(formateNum2)
          if(io.name == '换油周期') {
            io.rangMax = io.children[0].value == '年' ? 20 : io.children[0].value == '月' ? 240 : io.children[0].value == '天' ? 7300 : 175200
          } else {
            io.rangMax = io.children[0].value == '年' ? 2 : io.children[0].value == '月' ? 24 : io.children[0].value == '天' ? 730 : 17520
          }
          if(regTestResult2 && formateNum2 >=1 && formateNum2 <=io.rangMax) {
          } else {
            oilChangeBol = true
            MaxNum.push(io.rangMax)
          }
        }
      })
      // 查询检查周期对应的单位 以及校验数据是否合规
      checkPeriod.forEach((ie,index)=>{
        if(ie.value){
          // 校验换油周期值是否合法
          const regs = /^[1-9]\d*$/;
          const formateNum = Number(ie.value)
          const regTestResult = regs.test(formateNum)
          ie.rangMax = ie.children[0].value == '年' ? 20 : ie.children[0].value == '月' ? 240 : ie.children[0].value == '天' ? 7300 : 175200
          if(regTestResult && formateNum >=1 && formateNum <=ie.rangMax) {
          } else {
            MaxNumCheck.push(ie.rangMax)
            checkPeriodBol = true
          }
        }
      })
      dataType.forEach(iu=>{
        if(iu.value){
          const reg = /^([0-9]\d*)(\.\d{1,3})?$/;
          const formateNum3 = Number(iu.value)
          const regTestResult = reg.test(iu.value)
          if(formateNum3!=0 && regTestResult) {
            
          }  else {
            boxCapacity = true
          }
        }
      })
      if(emptyList.length>0){
        this.$message({
          message:emptyList[0].name+'必填',
          type:'error'
        })
        return
      }else if(boxCapacity) {
        this.$message({
          message:'油箱容量数值不能为空或0,且小数点后最多三位小数',
          type:'error'
        })
        return
      }else if(checkPeriodBol) {
        this.$message({
          type:'error',
          message:`检查周期：请输入1~${MaxNumCheck[0]}的整数`
        })
        return
      }else if(oilChangeBol) {
        this.$message({
          type:'error',
          message:`换油/加脂周期：请输入1~${MaxNum[0]}的整数`
        })
        this.$emit('passModulValidate','111')
        return
      }else{
        this.$emit('passModulValidate','LubricationRecommended')
      }
    },
  }
}
</script>

<style lang='less' scoped>
  .noUploadBtn .el-upload--picture-card {
      display: none;
  }
  /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #F2F6FC !important;
    border-color: #DCDFE6 !important ;
}
  .el-divider--vertical {
    width:3px;
  }
  .el-divider {
    background-color: #dd0000;
    position: relative;
}
  .input-with-select .el-select .el-input {
    width: 180px;
  }
  .input-with-select .el-select .el-input {
    width: 180px;
  }
  /deep/.input-with-select .el-input-group__append {
    background-color: #fff;
  }
  /deep/.input-with-select  .el-select .el-input__inner:focus{
    border-color:none
  }
  /deep/ .select-input {
    .el-select .el-input {
      width: 110px;
      height: 30px;
    }
  }
  /deep/ .el-cascader--small {
    line-height: 20px !important;
  }
  /deep/ .input-with-select .el-input-group__append .is-disabled{
    background-color: #F5F7FA;
  }
  .el-icon-plus {
    color: rgb(0, 20, 80) !important;
  }
  .input-with-select .el-select .el-input.is-focus .el-input__inner, .input-with-select .el-select .el-input__inner:focus, .input-with-select .el-input.is-active .el-input__inner,.input-with-select .el-input__inner:focus,.input-with-select .el-range-editor.is-active, .el-range-editor.is-active:hover,.input-with-select .el-textarea__inner:focus {
    border-color: #DCDFE6 !important;
}
.el-col .el-col-6 {
  padding: 0px;
}
.el-form-item {
    height: 64px;;
  }
.el-form-item__content {
    line-height: 27px !important;
}
  .title {
    font-family:MicrosoftYaHei-Bold;
    font-size:14px;
    color:#000;
    line-height:14px;
    font-weight:bold;
    display: flex;
  }
  .el-upload-list__item {
    transition: none !important;
  }
</style>