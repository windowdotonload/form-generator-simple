<template>
  <div class="oiledit-container">
    
    <header class="device-name">{{ opItemInfo.currentItem.deviceName }} - {{ opItemInfo.currentItem.lubricationPointName }}</header>
    <!-- 本次换油记录 -->
    <el-form :disabled="opDisabled" :rules="rules" :model="form" ref="formRef" label-width="150px">
      <div class="step-line">
        <div class="rect-icon"></div>
        <p class="step-title">打卡签到</p>
      </div>
      <el-form-item label="位置" label-width="46px" style="margin-bottom: 3px"> </el-form-item>
      <el-input v-model="form.position" type="textarea" :maxlength="100" show-word-limit :rows="2" placeholder="请输入内容" style="margin-bottom: 5px"> </el-input>
      <div class="step-line">
        <div class="rect-icon"></div>
        <p class="step-title">本次{{ taskTypeMap[taskInfo.taskType] }}记录</p>
      </div>
      <el-form-item :label="`${titleMap[taskInfo.taskType]}油品名称`" prop="name">
        <el-select size="small" ref="oilCascader" v-model="form.name.type" placeholder="请选择" clearable filterable remote :loading="loadingRemote" :remote-method="querySpecOilType" @focus="querySpecOilType('')" @change="changeAddOil" style="width: 50%">
          <el-option v-for="item in specOilTypeList" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
        </el-select>
        <!-- <el-cascader
          ref="oilCascader"
          size="small"
          :show-all-levels="false"
          clearable
          filterable
          :props="{ label: 'oilName', value: 'oilNumber' }"
          style="width: 50%"
          v-model="form.name.type"
          :options="specOilTypeList"
        ></el-cascader> -->
        <el-button type="text"  v-if="!opDisabled"   style="color: #001450;font-weight: 500;" @click="queryOilName">从润滑点中获取</el-button>
      </el-form-item>
      <el-form-item :label="`${taskTypeMap[taskInfo.taskType]}前油量`" prop="beforeFillOil">
        <el-input v-model="form.beforeFillOil.quanity" size="small" style="width: 50%" @change="beforeFillOilChange"></el-input>
        <el-select size="small" v-model="form.beforeFillOil.unit" placeholder="请选择" style="width: 20%" @change="changeUnit">
          <el-option label="L" value="L"> </el-option>
          <el-option label="KG" value="KG"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="`${taskTypeMap[taskInfo.taskType]}后油量`" prop="afterFillOil">
        <el-input v-model="form.afterFillOil.quanity" size="small" style="width: 50%" @change="afterFillOilChange"></el-input>
        <el-select size="small" v-model="form.afterFillOil.unit" placeholder="请选择" style="width: 20%" @change="changeUnit">
          <el-option label="L" value="L"> </el-option>
          <el-option label="KG" value="KG"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="`${titleMap[taskInfo.taskType]}量`" prop="countFillAmount">
       <el-input v-model="form.countFillAmount.quanity" size="small" style="width: 50%" @change="countFillAmountChange"></el-input>
        <el-select size="small" v-model="form.countFillAmount.unit" placeholder="请选择" style="width: 20%" @change="changeUnit">
          <el-option label="L" value="L"> </el-option>
          <el-option label="KG" value="KG"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务用时" prop="changeOilTime">
        <el-input v-model="form.changeOilTime" size="small" style="width: 50%"  maxlength="4"></el-input>
        <el-select size="small" v-model="form.timeUnit" placeholder="请选择" style="width: 26%">
          <el-option label="分钟" value="min"> </el-option>
          <el-option label="小时" value="h"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否更换零备件" prop="changePart" v-if="taskInfo.taskType == 1">
        <el-radio v-model="form.changePart" :label="true" :value="true">是</el-radio>
        <el-radio v-model="form.changePart" :label="false" :value="false">否</el-radio>
      </el-form-item>
      <el-form-item label="零备件名称" v-if="form.changePart" :prop="form.changePart ? 'partsName' : ''">
        <el-input size="small" style="width: 70%" :maxlength="30" v-model="form.partsName"></el-input>
      </el-form-item>
      <el-form-item label="零备件数量" v-if="form.changePart" :prop="form.changePart ? 'partsQuanity' : ''">
        <el-input v-model="form.partsQuanity" size="small" style="width: 70%"  maxlength="4"></el-input>
      </el-form-item>
      <el-form-item label="零备件代码" v-if="form.changePart" :prop="form.changePart ? 'partsCode' : ''">
        <el-input size="small" style="width: 70%" :maxlength="30" v-model="form.partsCode"> </el-input>
      </el-form-item>

      <!-- 下次换油预设 -->
      <div class="step-line" v-if="taskInfo.taskSource == 1">
        <div class="rect-icon"></div>
        <p class="step-title">下次{{taskTypeMap[taskInfo.taskType]}}预设</p>
      </div>
      <el-form-item :label="`预设下次${taskTypeMap[taskInfo.taskType]}日期`" v-if="taskInfo.taskSource == 1">
        <el-date-picker :picker-options="pickerOptions" v-model="form.nextChangeOilDate" size="small" style="width: 70%" type="date" placeholder="请选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="预设下次负责人" v-if="taskInfo.taskSource == 1">
        <el-select clearable size="small" v-model="form.nextChargePerson" placeholder="请选择" style="width: 70%">
          <el-option :label="item.nameCn" :value="item.userId" v-for="item in nextChargePersonList" :key="item.userId"></el-option>
        </el-select>
      </el-form-item>
      <!-- 润滑项目 -->
      <div class="step-line">
        <div class="rect-icon"></div>
        <div class="step-title">润滑项目<span style="color: #999;">(如果有其他事项需要记录，请添加润滑项目)</span></div>
      </div>
      <div v-for="(item, index) in iotDataList" :key="index">
        <el-form :ref="`maintainForm${index}`" :model="item" label-width="80px" :rules="itemRules">
        <div  style="margin:15px 0;background-color: #f5f5f5;padding: 16px 20px 10px;border-radius: 4px;">
            <div style="font-size: 14px;display: flex;justify-content: space-between;">
              <div style="font-weight: bold;"> 润滑项目 {{ index+1 }}</div> 
              <el-button type="text"   v-if="!opDisabled" :class="opDisabled  ? '' : 'cursor'" style="color: #dd000d;" @click="delConditions(index)" >删除</el-button>
            </div>
            <el-form-item label="项目名称" label-width="100px"  prop="projectName" >
                <el-input
                    size="small"
                    v-model="item.projectName"
                    maxlength="20"
                    show-word-limit
                    :disabled="opDisabled"
                    autocomplete="off"
                    style="width:70%"
                ></el-input>
            </el-form-item>
            <el-form-item  label="项目内容" label-width="100px" prop="projectContent" style="margin-bottom: 10px;">
                <el-input
                    type="textarea"
                    :rows="3"
                    size="small"
                    resize="none"
                    v-model="item.projectContent"
                    maxlength="100"
                    show-word-limit
                    :disabled="opDisabled"
                    autocomplete="off"
                    style="width:70%"
                ></el-input>
            </el-form-item>
          </div>
        
      </el-form>
      </div>
      <el-button type="text"  :disabled="opDisabled"  class="add-project"   @click="addProject" >+ 添加润滑项目</el-button>
      <!-- 任务描述 -->
      <div class="step-line">
        <div class="rect-icon"></div>
        <p class="step-title">任务描述</p>
      </div>
      <el-form-item :label="`${taskTypeMap[taskInfo.taskType]}原因类型`" label-width="100px" v-if="taskInfo.taskType == 1">
        <el-checkbox-group v-model="form.changeOilReason" @change="changeCheckbox">
          <el-checkbox v-for="item in typeList" :key="item.id" :label="`${item.code}***${item.name}`">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        :prop="form.changeOilReason.includes('change_device_oil_reason_type_0***其它原因') ? 'otherReason' : ''"
        type="textarea"
        v-show="form.changeOilReason.includes('change_device_oil_reason_type_0***其它原因')"
        label="其他原因描述"
        label-width="110px"
        style="margin-bottom: 3px"
      />
      <el-input
        ref="otherReason"
        :maxlength="50"
        show-word-limit
        v-show="form.changeOilReason.includes('change_device_oil_reason_type_0***其它原因')"
        v-model="form.otherReason"
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        style="margin-bottom: 5px"
      >
      </el-input>
      <p class="other-reason-tip" v-show="showOtherReasonTip">请填写其他原因</p>
      <el-form-item label="本次任务简要描述" label-width="130px" style="margin-bottom: 3px"> </el-form-item>
      <el-input v-model="form.taskDesc" type="textarea" :maxlength="50" show-word-limit :rows="2" placeholder="请输入内容" style="margin-bottom: 5px"> </el-input>

      <el-form-item label="照片" label-width="46px" style="margin-bottom: 3px"> </el-form-item>
      <el-upload
        action=""
        :class="opDisabled || uploadPicList.length >= 9 ? 'hide-upload' : ''"
        ref="uploadPic"
        :file-list="fileList"
        list-type="picture-card"
        :limit="9"
        accept="image/*"
        :auto-upload="false"
        :on-change="handleAddFile"
        :on-remove="handleRemove"
        :on-preview="handlePreview"
      >
        <i class="el-icon-plus" style="display: flex; align-items: center;justify-content: center;height: 100px;"></i>
      </el-upload>
      
    </el-form>
    
    
    <!--  -->
    
    <div class="bottom-bar" v-if="!opDisabled">
      <div class="op-btn save" @click="save">保存</div>
      <div class="op-btn cancel" @click="cancel">取消</div>
    </div>
  </div>
</template>

<script>
import { checkName, checkOilAmount, checkafterOilAmount,checkCountFillAmount, changeOilTime, rawForm } from "./rawState.js";
import { validateForms } from "../../utils/index";
export default {
  props: {
    opItemInfo: Object,
    taskInfo: Object
  },
  data() {
    return {
      loadingRemote: false,
      addOilObj: {},
      iotDataList:[],
      keyIndex:0,
      taskTypeMap: {
        1: "换油",
        2: "加油",
        3: "加脂"
      },
      titleMap: {
        1: "换油",
        2: "加油",
        3: "加脂"
      },
      opDisabled: false,
      showOtherReasonTip: false,
      currentOpitem: null,
      formDetail: null,
      typeList: [],
      oilBrandList: [],
      specOilTypeList: [],
      nextChargePersonList: [],
      uploadPicList: [],
      fileList: [],
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      form: Object.assign({}, rawForm),
      pickerOptions: {
        disabledDate: dateValue => {
          return new Date().getTime() >= new Date(dateValue).getTime() + 3600 * 1000 * 24;
        }
      },
      itemRules: {
        projectName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        projectContent: [{ required: true, message: "请输入项目内容", trigger: "blur" }]
      },
      rules: {
        name: [{ validator: checkName, trigger: "blur" }, { required: true, message: "请选择油品", trigger: "blur" }],
        afterFillOil : [{ validator: checkafterOilAmount, trigger: "blur" }],
        beforeFillOil: [{ validator: checkOilAmount, trigger: "blur" }],
        countFillAmount: [{ validator: checkCountFillAmount  , trigger: "blur" }, { required: true, message: "请填写加注量", trigger: "blur" }],
        changeOilTime: [{ validator: changeOilTime, trigger: "blur" }],
        changePart: [{ required: true, message: "请选择是否更换零件", trigger: "blur" }],
        partsName: [{ required: true, message: "请输入零备件名称", trigger: "blur" }],
        partsQuanity: [{ required: true, message: "请输入零备件数量", trigger: "blur" }, { validator: changeOilTime, trigger: "blur" }],
        partsCode: [{ required: true, message: "请输入零备件代码", trigger: "blur" }],
        otherReason: [{ required: true, message: "请输入零备件代码", trigger: "blur" }]
      },
      oilBrandCanUseFlag:false
    };
  },
  async created() {
    this._initPreData();
    if (this.taskInfo.taskStatus != 2 || this.userInfo.userId != this.taskInfo.taskUserId) {
      this.opDisabled = true;
    } else {
      this.opDisabled = false;
    }
  },
  methods: {
    // 从润滑点获取油品名称
    queryOilName() {
      let params = {
        lubricationPointNumber: this.opItemInfo.currentItem.lubricationPointNumber
      };
      this.requestMethodGet("/web/device/queryLubricationPointDetail", params)
        .then(async res => {
          res = res.data;
          if (res.code == 1000) {
            if(res.data.currentOilCode) {
              this.form.name.brand = res.data.oilBrandCode;
              this.form.name.type = res.data.currentOilCode;
              this.addOilObj = {
                oilName: res.data.currentOilName,
                oilNameCode: res.data.currentOilCode,
                oilBrand: res.data.oilBrandName,
                oilBrandCode: res.data.oilBrandCode
              }
              if(this.form.name.type){
                let resOil = await this.getOilNameByOilCode(this.form.name.type)
                this.specOilTypeList=[{oilAlias: resOil,code:this.form.name.type}]
              }
              this.$message({
                message: '获取成功',
                type: "success"
              });
            } else {
              this.$message({
                message: '获取失败，油品信息丢失，请检查润滑油信息完善度',
                type: "warning"
              });
            }
            
          } else {
            this.$message({
              message: '获取失败，油品信息丢失，请检查润滑油信息完善度',
              type: "warning"
            });
          }
        })
        .catch(res => { });
    },
    beforeFillOilChange() {
      if(this.form.beforeFillOil.quanity && this.form.afterFillOil.quanity) {
        this.form.countFillAmount.quanity = Math.abs(this.form.afterFillOil.quanity - this.form.beforeFillOil.quanity)
      }
    },
    afterFillOilChange() {
      if(this.form.beforeFillOil.quanity && this.form.afterFillOil.quanity) {
        this.form.countFillAmount.quanity = Math.abs(this.form.afterFillOil.quanity - this.form.beforeFillOil.quanity)
      }
    },  
    countFillAmountChange() {
      if(this.form.countFillAmount.quanity ) {
        this.form.beforeFillOil.quanity = null
        this.form.afterFillOil.quanity = null
      }
    },
    getOilBrandList(){
      this.requestMethodGet("/mdm/oil/queryOilList", {parentCode: 0, oilName:'', status:1}).then(res => {
        if (res.data.code == 1000) {
          this.oilBrandList = res.data.data.list;
        }else{
           this.$message({
              type: "warning",
              message: res.data.msg
            });
        }
      });
    },
    async _initPreData() {
      this.requestMethodGet("/weChat/common/dic/drops", {
        code: "change_device_oil_reason_type"
      }).then(res => {
        if (res.data.code == 1000) {
          this.typeList = res.data.data;
        }
      });
      this.requestMethodGet("/mdm/oil/queryOilList", {parentCode: 0, oilName:'', status:1}).then(res => {
        if (res.data.code == 1000) {
          this.oilBrandList = res.data.data.list;
        }
      });
      this.requestMethodGet("/oilTask/queryCompanyUsers", {
        current: 1,
        size: 500,
        companyId: this.opItemInfo.companyId,
        oilTaskType: this.opItemInfo.taskType,
        taskId: this.opItemInfo.taskId
      }).then(res => {
        if (res.data.code == 1000) {
          this.nextChargePersonList = res.data.data.list;
        } else {
          this.$message({
            type: "warning",
            message: res.data.msg
          });
        }
      });
    },
    changeUnit(val) {
      this.form.beforeFillOil.unit = val;
      this.form.afterFillOil.unit = val;
      this.form.countFillAmount.unit= val
    },
    changeCheckbox(val) {
      if (!val.includes("change_device_oil_reason_type_0***其它原因")) {
        this.otherReason = "";
      }
    },
    searchOilName(rootData) {
      let res = null;
      function search(data) {
        if (data.level == 2) {
          res = data.data;
          return;
        } else {
          search(data.parent);
        }
      }
      search(rootData);
      return res;
    },
    changeAddOil(val) {
      this.form.name.type=val
      let selectItem = this.specOilTypeList.filter(item=>{
        return item.code==val
      })
      this.addOilObj = {
        oilName: selectItem[0].name,
        oilNameCode: selectItem[0].code,
        oilBrand: selectItem[0].parentName,
        oilBrandCode: selectItem[0].parentCode
      }
    },
    save() {
      if (this.form.changeOilReason.includes("change_device_oil_reason_type_0***其它原因")) {
        if (!this.form.otherReason) {
          this.showOtherReasonTip = true;
          this.$refs.otherReason.focus();
          return;
        }
      }
      // 校验必填项
      let arr = [];
      for (let i = 0; i < this.iotDataList.length; i++) {
        let str = "maintainForm" + i;
        arr.push(str);
      }
      const formRefs = arr.map(key => this.$refs[key]).flat();
      validateForms(formRefs)
        .then(() => {
          this.$refs.formRef.validate(async (valid, field) => {
            if (valid) {
              
              const changeReasonList = this.form.changeOilReason.map(item => {
                const arr = item.split("***");
                if (arr[0] == "change_device_oil_reason_type_0") {
                  return {
                    changeOilReasonTypeCode: arr[0],
                    changeOilReasonTypeDesc: this.form.otherReason
                  };
                } else {
                  return {
                    changeOilReasonTypeCode: arr[0],
                    changeOilReasonTypeDesc: arr[1]
                  };
                }
              });
              const ExecuteOilTaskRequest = {
                changeReasonList,
                oilBrand: this.addOilObj.oilBrand,
                oilBrandCode: this.addOilObj.oilBrandCode,
                oilName: this.addOilObj.oilName,
                oilNameCode: this.addOilObj.oilNameCode,
                pictureStrList: this.uploadPicList,
                lubricationPointNumber: this.opItemInfo.currentItem.lubricationPointNumber,
                taskType: this.taskInfo.taskType,
                oilTaskCreateType: this.taskInfo.taskSource,
                oilRecordSupplementAddRequest: {
                  formDescribe: this.form.taskDesc,
                  editFlag:true,
                  oilPlanSupplementId: this.formDetail.oilPlanSupplementId,
                  beforeFillAmount: this.form.beforeFillOil.quanity,
                  beforeFillAmountUnit: this.form.beforeFillOil.unit,
                  afterFillAmount: this.form.afterFillOil.quanity,
                  afterFillAmountUnit: this.form.afterFillOil.unit,
                  countFillAmount:this.form.countFillAmount.quanity,
                  countFillAmountUnit: this.form.countFillAmount.unit,
                  timeConsum: this.form.changeOilTime,
                  timeUnit: this.form.timeUnit,
                  replaceParts: this.form.changePart,
                  partsName: this.form.partsName,
                  partsAmount: this.form.partsQuanity,
                  partsCode: this.form.partsCode,
                  nextPlanDate: this.form.nextChangeOilDate ? this.moment(this.form.nextChangeOilDate).format() : undefined,
                  oilTaskNextPrincipalUserId: this.form.nextChargePerson,
                  executionPlace: this.form.position,
                  oilPlanId: this.opItemInfo.currentItem.todoTaskFormId,
                  oilTaskId: this.taskInfo.id,
                  lupProjectList:this.iotDataList
                }
              };

              const reqRes = await this.requestMethodPost("/oilTask/saveOilTaskForm", ExecuteOilTaskRequest);
              if (reqRes.data.code == 1000) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                this.currentOpitem = null;
                this.$emit("closeOilEditDrawer");
                this.form = Object.assign({}, rawForm);
                if (this.$refs.uploadPic && this.$refs.uploadPic) {
                  this.$refs.uploadPic.clearFiles();
                }
              } else {
                this.$message({
                  type: "warning",
                  message: reqRes.data.msg || "请稍后重试"
                });
              }
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
      
    },
    cancel() {
      this.currentOpitem = null;
      this.uploadPicList = [];
      this.form = Object.assign({}, rawForm);
      if (this.$refs.uploadPic && this.$refs.uploadPic) {
        this.$refs.uploadPic.clearFiles();
      }
      this.$emit("closeOilEditDrawer");
    },
    handleAddFile(file) {
      if (!file.raw.type.startsWith("image")) {
        this.$message.error("只能上传图片类型文件");
        return;
      }
      const isLt = file.size / 1024 / 1024 < 10;
      if (!isLt) {
        this.$message.error("上传图片大小不能超过 10MB!");
        return;
      }
      let params = new FormData();
      params.append("fileType", "oil_task");
      params.append("multipartFiles", file.raw);
      this.requestMethodPost("/web/file/uploadFiles", params).then(res => {
        res = res.data;
        if (res.code == 1000) {
          this.uploadPicList.push(res.data[0]);
          file.path = res.data[0];
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    handleRemove(file) {
      const index = this.uploadPicList.findIndex(item => item == file.path);
      this.uploadPicList.splice(index, 1);
    },
    handlePreview(file) {
      this.$emit("handlePreview", file);
    },
    handleNoIdNextPrincipalUserName(targetId, setName) {
      const flag = this.nextChargePersonList.some(item => item.userId == targetId);
      if (!flag && setName) {
        this.form.nextChargePerson = setName;
      }
    },
    handleOilBrandDisabled(){
      let brandCodeList = this.oilBrandList.map(it=>{
        return it.code
      })
      if(brandCodeList.length>0) {
        this.oilBrandCanUseFlag = brandCodeList.includes(this.form.name.brand)
      }else {
        this.oilBrandCanUseFlag = true
      }
      // this.opDisabled   true:不可编辑：fasle：可编辑；不可编辑需要回显名称；可编辑可以清空
      if(this.opDisabled){
        if(!this.oilBrandCanUseFlag){
          this.form.name.brand = this.formDetail.oilBrand
          this.form.name.type = this.formDetail.oilName
        }
      }else{
        if(!this.oilBrandCanUseFlag){
          this.form.name.brand = ''
          this.form.name.type = ''
        }
      }
    },
    // 查询油品数据
    querySpecOilType(val) {
      this.loadingRemote = true
      this.requestMethodGet("/mdm/oil/queryOilListByPage", {oilName:val, status:1, size:200, current:1}).then(res => {
        this.loadingRemote = false
        this.specOilTypeList = res.data.data.list;
      });
    },
    // 添加润滑项目
    addProject() {
      if(this.iotDataList.length<5) {
        let index = this.iotDataList.length
        this.$set(this.iotDataList,index, {
          projectName:'',
          projectContent:''
        })
      }else {
        this.$message({
          type: "error",
          message:  "最多只支持添加5个润滑项目"
        });
      }
      
      // this.$forceUpdate()
      console.log(this.iotDataList)
    },
    // 删除润滑项目
    delConditions(index) {
      this.iotDataList.splice(index,1)
    },
    // // 获取图片全路径
    getFullUrl(val) {
      const params = {
        url: val
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.urlFull = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    }
  },
  watch: {
    "form.otherReason"(val) {
      if (val) {
        this.showOtherReasonTip = false;
      }
    },
    "form.changePart"(val) {
      if (!val) {
        this.form.partsName = "";
        this.form.partsQuanity = "";
        this.form.partsCode = "";
      }
    },
    opItemInfo: {
      handler(val, oldVal) {
        this.getOilBrandList()
        if (this.taskInfo.taskStatus != 2 || this.userInfo.userId != this.taskInfo.taskUserId) {
          this.opDisabled = true;
        } else {
          this.opDisabled = false;
        }
        this.uploadPicList = [];
        if (!this.currentOpitem || val.currentItem.id != oldVal.currentItem.id) {
          let oilParam = { todoTaskId: val.todoTaskId,sameTaskTypeFlag:true, lubricationPointId: val.currentItem.id}
          this.requestMethodGet("/oilTask/queryTaskFormDetail", oilParam).then(async res => {
            this.form = Object.assign({}, rawForm);
            if (res.data.code == 1000) {
              this.formDetail = res.data.data;
              const data = res.data.data;
              this.form.beforeFillOil.quanity = data.beforeFillAmount || 0;
              this.form.beforeFillOil.unit = data.beforeFillAmountUnit || "L";
              this.form.afterFillOil.quanity = data.afterFillAmount || 0;
              this.form.afterFillOil.unit = data.afterFillAmountUnit || "L";
              this.form.countFillAmount.quanity = data.countFillAmount || Math.abs(data.beforeFillAmount - data.afterFillAmount);
              this.form.countFillAmount.unit = data.countFillAmountUnit || "L";
              this.form.changeOilTime = data.timeConsum || 0;
              this.form.timeUnit = data.timeUnit ? data.timeUnit : this.taskInfo.oilTaskType == 1 ? "h" : "min";
              this.form.changePart = data.replaceParts;
              this.form.partsName = data.partsName;
              this.form.partsCode = data.partsCode;
              this.form.partsQuanity = data.partsAmount;
              this.form.position = data.executionPlace;
              this.form.taskDesc = data.formDescribe;
              this.form.name.brand = data.oilBrandCode;
              this.form.name.type = data.oilNameCode;
              this.addOilObj = {
                oilName: data.oilName,
                oilNameCode: data.oilNameCode,
                oilBrand: data.oilBrand,
                oilBrandCode: data.oilBrandCode
              }
              if(this.form.name.type){
                let resOil = await this.getOilNameByOilCode(this.form.name.type)
                this.specOilTypeList=[{oilAlias: resOil,code:this.form.name.type}]
              }
              this.form.nextChangeOilDate = data.oilTaskNextExecuteDate;
              this.form.nextChargePerson = data.oilTaskNextPrincipalUserId;
              console.log(this.form)
              if(data.lupProjectList) {
                this.iotDataList = data.lupProjectList
              } else {
                this.iotDataList = []
              }
              

              if (data.changeReasonList && data.changeReasonList.length) {
                this.form.changeOilReason = data.changeReasonList.map(item => {
                  if (item.changeOilReasonTypeCode == "change_device_oil_reason_type_0") {
                    this.form.otherReason = item.changeOilReasonTypeDesc;
                    return `${item.changeOilReasonTypeCode}***其它原因`;
                  }
                  return `${item.changeOilReasonTypeCode}***${item.changeOilReasonTypeDesc}`;
                });
              }
              if (data.pictureList && data.pictureList.length) {
                this.fileList = data.pictureList.map(item => {
                  this.uploadPicList.push(item.attachmentHalfUrl);
                  return {
                    url: item.attachmentUrl
                  };
                });
              }
              this.handleOilBrandDisabled()
            } else {
              this.$message({
                type: "error",
                message: res.data.msg || "请稍后重试"
              });
            }
          });
        }
        this.currentOpitem = val;
      },
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
.oiledit-container {
  height: 91vh;
  padding: 20px;
  padding-top: 0;
  overflow-y: auto;
  margin-bottom: 30px;
}
.step-line {
  padding: 6px;
  margin: 20px 0;
  height: 16px;
  display: flex;
  align-items: center;
  .step-title {
    font-size: 14px;
    font-weight: 400;
  }
  .rect-icon {
    margin-right: 10px;
    width: 4px;
    height: 14px;
    background: #dd0000;
  }
}
.cursor {
  cursor: pointer;
}
.device-name {
  padding: 16px;
  border-radius: 6px;
  background: #ebf2ff;
}
.bottom-bar {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  .op-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    width: 46%;
    cursor: pointer;
  }
  .save {
    color: white;
    background: #dd0000;
    border-radius: 5px;
  }
  .cancel {
    border-radius: 5px;
    background: #ffffff;
    border: 1px solid #d4d3d3;
    color: #d4d3d3;
  }
}
.other-reason-tip {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  margin: 0;
}
.hide-upload {
  /deep/ .el-upload--picture-card {
    display: none;
  }
}
/deep/.el-upload--picture-card {
  width: 100px;
  height: 100px;
}
.add-project {
  font-size: 14px;
  color: #001450;
}
/deep/.el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item-thumbnail {
  width: 100px;
  height: 100px;
}
</style>