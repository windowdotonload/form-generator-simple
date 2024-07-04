<template>
<div>
  <el-card class="deviceInfo" style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header"  class="title">
      <el-divider direction="vertical"></el-divider>
      <span>验油数据  <span  class="font-style" :style="deviceDetailObj.reportType == 1 ?'color:#666':'color:#dd0000'">{{deviceDetailObj.reportType == 1 ? '（选填）' :'（必填）'}}</span></span>
    </div>
    <el-form :model="checkOilForm" ref="checkOilRef" label-width="200px" label-position="left" style="padding:0 20px;">
      <el-row>
      <div v-for="(item,index) in checkOilForm" :key="index">
          <el-col :span="20" v-if="item.name == '油样产品名称'">
          <el-form-item
          :required="item.required"
          >
          <span slot="label" >{{item.name}}：</span>
          <!-- 油样产品名称 -->
          <el-select v-if="type == 'edit' && item.type == 'dropdown'" size="small" ref="cascaderRef" v-model="item.valueCode" placeholder="请选择" clearable filterable remote :loading="loadingRemote" :remote-method="getOilList" @change="oilNameChange(item,index,`cascaderRef`)" style="width:80%">
            <el-option v-for="item in oilNameList" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
          </el-select>
          <!-- <el-cascader
            v-if="type == 'edit' && item.type == 'dropdown'"
            ref='cascaderRef'
            :options="oilNameList"
            v-model="item.valueCode"
            :key="oilNameKey"
            size="small"
            style="width:90%" 
            :show-all-levels="false"
            @change="oilNameChange(item,index,`cascaderRef`)"
            :props="{ 
              value:'oilNumber',
              label:'oilName',
              children:'children'
              }"
            clearable>
          </el-cascader> -->
          </el-form-item>

          </el-col>
          <el-col :span="20" >
          <el-form-item
          :required="item.required"
          v-if="item.name == '是否做过油品实验室检测'"
          >
          <span slot="label" >{{item.name}}：</span>
          <el-radio-group v-model="item.value" v-if="type == 'edit' && item.type == 'radio5'" >
                <el-radio v-for="(it,idx) in item.fieldOption" :label="it.value" :key="idx">{{it.option}}</el-radio>
          </el-radio-group>
          </el-form-item>
          </el-col>
          <div >
              <el-col :span="24" v-if="item.type == 'radio5' && item.value == item.children[0].valueCode" v-for="(cylinder,index) in item.children" :key="index">
                <el-form-item :label="cylinder.name+'：'" :required="cylinder.required">
                  <el-date-picker
                    v-if="cylinder.type == 'datepicker3' && type == 'edit'" 
                    v-model="cylinder.value"
                    :picker-options="expireTimeOption2"
                    size="small"
                    prefix-icon='el-icon-date'
                    clearable
                    value-format="yyyy-MM-dd"
                    style="width:90%" 
                    type="date"
                    placeholder="请选择">
                  </el-date-picker>
                </el-form-item>
            </el-col>
          </div>
      </div>
      </el-row>
    </el-form>
    <div style="padding:0 20px;">
      <el-button size="medium" @click="handleImportData" :disabled='iotData.length>=3'>导入</el-button>
      <span style="font-size:13px;color:#999;font-family:MicrosoftYaHei;margin-left:12px;">如果进行现场验油，请导入检测数据（最多导入3组数据）</span>
    </div>
    <!-- 展示导入的数据 -->
      <div v-for="(item,index) in iotData" :key="index" style="padding:20px;background:rgb(249,249,249);border-radius:4px;margin-top:20px;display:flex;align-items: center;">
        <div style="flex:1;">
          <el-row>
            <div style="font-family:MicrosoftYaHei-Bold;font-size:14px;color:rgb(0,0,0);">第{{index+1}}组</div>
            <div v-for="(it,index) in item.children" :key="index" >
              <el-col :span="20" v-if="it.name == '备注' && it.name !='隐藏字段_iot_id'" style="margin:16px 48px 0px 0;">
                <span style="font-family:MicrosoftYaHei;font-size:13px;color:rgb(153,153,153)">{{it.name}}：</span>
                <span v-if="it.type == 'string' && type == 'edit'" style="font-family:ArialMt;font-size:13px;color:rgb(51,51,51)">{{it.value}}</span>
              </el-col>
              <el-col :span="6" v-if="it.name != '备注' &&  it.name !='隐藏字段_iot_id'" style="margin:16px 48px 0px 0;">
                <span style="font-family:MicrosoftYaHei;font-size:13px;color:rgb(153,153,153)">{{it.name}}：</span>
                <span v-if="it.type == 'string' && type == 'edit'" style="font-family:ArialMt;font-size:13px;color:rgb(51,51,51)">{{it.value}}{{it.unit}}</span>
              </el-col>
            </div>
          </el-row>
        </div>
          <el-button type="danger"  plain @click="deleteIot(index)" size="small" style="height:28px;width:57px;line-height:28px;padding:0px;">移除</el-button>
    </div>

  </el-card>
    <!-- 选择验油数据弹框 -->
    <el-dialog title="选择验油数据"  :visible.sync="importDataVisiable" :append-to-body="true" width="45%" class="create-task">
      <div  style="display: flex;align-items: center;margin-bottom:10px;margin-top:10px;">
        <el-input
        size="small"
        v-model="queryParams.deviceNo"
        placeholder="请搜索测试仪编号"
        suffix-icon="el-icon-search"
        style="width:30%;"
        maxlength="50"
        @change="handleSearchTableData"
        clearable
        ></el-input>
        <el-date-picker
          v-model="queryParams.time"
          style="margin:0 20px;"
          suffix-icon="el-icon-date"
          prefix-icon = 'el-icon-date'
          value-format="yyyy-MM-dd HH:mm"
          size="small"
          type="datetime"
          @change="handleSearchTableData"
          placeholder="请选择上传时间">
        </el-date-picker>
        <el-button size="small" @click="handleClearParams">重置</el-button>
      </div>
      <div>
        <el-table
        :data="lumDataCustomers"
        tooltip-effect="dark"
        ref='tableAddLum'
        :row-key="rowKey"
        :header-cell-class-name="cellClass"
        @selection-change="handleSelectionChange"
        >
      <el-table-column :selectable="checkedSelectTask"  :reserve-selection="true"  type="selection"  width="55" align="center"></el-table-column>
        <el-table-column
          prop="indexValue.index14"
          min-width="20%"
          label="测试仪编号">
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="18%"
          label="上传时间">
        </el-table-column>
        <el-table-column
          prop="remark"
          min-width="10%"
          label="备注">
        </el-table-column>
      </el-table>
      <el-pagination
      v-if="totalNumber"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pagenation.current"
      :page-size="pagenation.size"
      layout="prev, pager, next"
      :total="totalNumber"
      style="float: right;display:flex; margin-top: 10px;position:static;"
      ></el-pagination>
      </div>
      <div slot="footer" style="margin-top:20px;">
        <el-button type="danger" plain @click="handleResetAddLum()" size="small">取消</el-button>
        <el-button type="danger" @click="handleSubmitOilCheck()" size="small">确定</el-button>
      </div>
    </el-dialog>
</div>
  
</template>

<script>
export default {
  props:{
    type:{
      type:String,
      default:()=>{
        return ''
      }
    },
    deviceDetail:{
      type:Object,
      default:()=>{
        return ''
      }
    },
    defaultNodeDto:{
      type:Object,
      default:()=>{
        return []
      }
    },
    deviceObj:{
      type:Array,
      default:()=>{
        return []
      }
    },
    checkOilDataObj:{
      type:Array,
      default:()=>{
        return []
      }
    }
  },
  data(){
    return{
      loadingRemote: false,
      checkOilForm:{},
      totalNumber: 0, //总条数
      //  分页参数
      pagenation: {
        current: 1,
        size: 10
      },
      deviceDetailObj:this.deviceDetail,
      lumDataCustomers:[],
      queryParams:{
        deviceNo:'',
        time:''
      },  // 验油数据搜索字段
      importDataVisiable:false,
      oilNameList:[],
      oilNameKey:0,
      selectIotData :{},   // 表格单选选中的数据
      selectedIotList:[] ,   // 已经选中的IOT数据
      iotData:[]  // 验油数据
    }
  },
  created(){
    this.checkOilForm = this.checkOilDataObj
    this.deviceDetailObj = this.deviceDetail
    this.getOilList('')
    this.checkOilForm.map(item=>{
      if(item.name == '导入的数据') {
        this.iotData = item.children
      }
    })
  },
  mounted(){
    this.getCheckData()
  },
  methods:{
    rowKey(row) {
      return row.time
    },
    // 移除Iot 数据
    deleteIot(index) {
      this.$confirm('是否移除该数据？?', '提示', {
          confirmButtonText: '移除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.iotData.splice(index,1)
        }).catch(() => {
        });
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
    oilNameChange(item){
      if(item && item.valueCode.length>0) {
        const data = this.checkOilForm
        const checkedData = this.$refs.cascaderRef[0].getCheckedNodes()[0]
        let oilNameValueCode = []
        let oilBrandValueCode = item.valueCode[0]
        data.forEach(it=>{
          if(it.name == '油样产品名称'){
            oilNameValueCode = it.valueCode
          }
        })
        if(oilBrandValueCode == 'oil_0001'){//美孚
          if(oilNameValueCode.length != 4){
            this.$message({
              message:'请选择油样产品名称',
              type:'warning'
            })
            return
          }else{
            item.value = checkedData.label
            item.valueCode = checkedData.path[checkedData.path.length-1]
          }
        }else{
          if(oilNameValueCode.length != 3){
            this.$message({
              message:'请选择油样产品名称',
              type:'warning'
            })
            return
          }else{
            item.value = checkedData.label
            item.valueCode = checkedData.path[checkedData.path.length-1]
          }
        }
      }  else {
        item.value = ''
        item.valueCode = ''
      }
    },
    handleSearchTableData() {
      this.getCheckData()
    },
    // size change
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.getCheckData();
    },
    //current change
    handleCurrentChange(current) {
      this.pagenation.current = current;
      this.getCheckData();
    },
    // 获取验油数据
    getCheckData(){
      this.lumDataCustomers = []
      let params = { ...this.queryParams, ...this.pagenation };
      this.requestMethodGet("/portable/device/getPortableDeviceData",params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.list.length > 0) {
              const data = res.data.list
              this.totalNumber = res.data.totalCount
              this.lumDataCustomers = data
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
    // 导入验油数据 重置
    handleClearParams() {
      this.queryParams = {
        deviceNo:'',
        time:''
      }
      this.getCheckData()
    },
    // 必填校验
    validateOil(){
      const data = this.checkOilForm
      let radio5EmptyList = []
      let emptyChildList = []
      let emptyList = data.filter(item=>{
        return item.required && !item.value
      })
      emptyList = emptyList.concat(emptyList)
      // 找出radio5类型
      data.forEach(item=>{
        if(item.type == 'radio5' && item.value == '1'){
          radio5EmptyList = item.children.filter(it=>{
            return it.required && !it.value
          })
        }
      })
      let indexValue  =  this.checkOilForm.findIndex((value)=>value.name=='导入的数据');
      if(this.checkOilForm[indexValue].children.length > 0) {
        emptyChildList = emptyChildList.concat(emptyList).concat(radio5EmptyList)
          if(emptyChildList.length>0){
            this.$message({
              message:emptyChildList[0].name+'必填',
              type:'warning'
            })
            return
          }else{
            this.$emit('passModulValidate','checkOil')
          }
      } else {
          this.$message({
            message:'请导入验油数据',
            type:'warning'
          })
          return
      }
    },
    // 导入验油数据 -- 点击事件
    handleImportData() {
      this.importDataVisiable = true;
      let obj = {
        time:'',
        iotId:''
      }
      this.selectedIotList = []
      this.iotData.forEach((item,index)=>{
        let defaultNodeDtoObj = JSON.parse(JSON.stringify(obj))
        this.iotData[index].children.map(it=>{
          if(it.nameKey == "key_hide_iot_id") {
            defaultNodeDtoObj.iotId = it.value
          }
          if(it.nameKey == 'createTime') {
            defaultNodeDtoObj.time = it.valueCode
          }
        })
        this.selectedIotList.push({...defaultNodeDtoObj})
      })
      this.$nextTick(() =>{
        this.lumDataCustomers.forEach((item ,index)=> {
        // 勾选上之前选中的数据
        if(this.selectedIotList.some(el=>{return el.time==item.time && el.iotId==item.iotId})){
          this.$refs.tableAddLum.toggleRowSelection(item, true)
        } else{
          this.$refs.tableAddLum.toggleRowSelection(item, false)
        }
      })
      })
    },
    checkedSelectTask(row,index){
      let flag = true
      if(this.selectedIotList.some(el=>{return el.time===row.time && el.iotId===row.iotId})){
          flag =  false;
      }
      return flag
    },
    // 选中事件
    handleSelectionChange(val) {
      this.selectIotData = val
      this.lumDataCustomers.forEach((item ,index)=> {
        if (this.selectIotData[this.selectIotData.length -1] == item) {
          // 勾选新选中的
          this.$refs.tableAddLum.toggleRowSelection(item, true)
        } else {
          // 勾选上之前选中的数据
          if(this.selectedIotList.some(el=>{return el.time==item.time && el.iotId==item.iotId})){
            this.$refs.tableAddLum.toggleRowSelection(item, true)
          } else{
            this.$refs.tableAddLum.toggleRowSelection(item, false)
          }
        }
      })
    },
    handleResetAddLum() {
      this.importDataVisiable = false
    },
    handleSubmitOilCheck() {
        this.importDataVisiable = false
        this.selectedIotList= this.selectIotData
        if(this.selectedIotList.length == 0) {
          return
        }
        this.iotData = []
        this.selectedIotList.map((item,index)=>{
          let defaultNodeDtoObj = JSON.parse(JSON.stringify(this.defaultNodeDto))
          defaultNodeDtoObj.children.map((it)=>{
            if(it.nameKey == 'levelValue') {
              it.value = this.selectedIotList[index].levelValue
              it.unit =  this.selectedIotList[index].unit
            }
            if(it.nameKey == 'key_water') {
              it.value = this.selectedIotList[index].indexValue.index8
            }
            if(it.nameKey == 'key_ydnd') {
              it.value = this.selectedIotList[index].indexValue.index5
            }
            if(it.nameKey == 'key_hide_iot_id') {
              it.value = this.selectedIotList[index].iotId
            }
            if(it.nameKey == 'iotId') {
              it.value = this.selectedIotList[index].indexValue.index14
            }
            if(it.nameKey == 'createTime') {
              it.value = this.selectedIotList[index].createTime
              it.valueCode = this.selectedIotList[index].time
            }
            if(it.nameKey == 'remark') {
              it.value = this.selectedIotList[index].indexValue.index16
            }
          })
          this.iotData.push({...defaultNodeDtoObj})
        })
        let indexValue  =  this.checkOilForm.findIndex((value)=>value.name=='导入的数据');
        this.checkOilForm[indexValue].children = []
        this.iotData.forEach(im=>{
          this.checkOilForm[indexValue].children.push(im)
        })
    },

  }
}
</script>

<style lang='less' scoped>
.font-style {
    font-family:MicrosoftYaHei;
    font-size:14px;
    font-weight:normal;
  }
.title {
    font-family:MicrosoftYaHei-Bold;
    font-size:14px;
    color:#000;
    line-height:14px;
    font-weight:bold;
    display: flex;
  }
  .el-card__header {
    background: #f9f9f9;
  }
  /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #F2F6FC !important;
    border-color: #DCDFE6 !important ;
}
/deep/ .el-table__header-wrapper .el-checkbox {
    display: none;
}
  .el-divider--vertical {
    width:3px;
  }
  .el-divider {
    background-color: #dd0000;
    position: relative;
}
.el-upload-list__item {
    transition: none !important;
  }
.hide .el-upload--picture-card {
      display: none;
  }
</style>