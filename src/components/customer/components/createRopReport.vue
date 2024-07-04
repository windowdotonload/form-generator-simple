<!--PES档案详情-->
<template>
  <div style="position: relative" class="benefit-wrap">
    <div class="plan-wrap" :style="mainminheight">
      <div class="right-content" style="margin-top: 20px">
        <div class="line"></div>
        <div class="right-title">基本信息</div>
      </div>
      <!-- 首页 -->
      <div style="padding: 24px 20px;margin:10px 0;">
        <el-row class="service-items-wrap">
          <div style="color:#000000;font-size:14px;line-height:14px;margin-bottom:12px;font-weight:bold;">
            客户名称：<span style="color:#008888;">{{ companyName }}</span>
          </div>
          <div style="color:#999999;font-size:13px;line-height:13px;">行业：{{ industry }}</div>
        </el-row>
        <el-form :model="basicInfoForm" :rules="basicInfoFormRules" ref="basicInfoForm" label-width="190px" label-position="right">
          <el-form-item label="报告名称">
            <el-input
              type="textarea"
              size="small"
              resize="none"
              maxlength="20"
              :autosize="{ minRows: 2, maxRows: 6 }"
              show-word-limit
              style="width: 640px; margin-right: 20px"
              v-model="basicInfoForm.pdfName"
            ></el-input>
            <div class="notice">自定义报告名称，最终报告名称将显示为：客户公司名称-年份-自定义部分+业绩XX，此处只需填写自定义部分</div>
          </el-form-item>

          <el-form-item label="公司地址" prop="companyAddress">
            <el-input
              type="textarea"
              size="small"
              resize="none"
              maxlength="50"
              :autosize="{ minRows: 2, maxRows: 6 }"
              show-word-limit
              style="width: 640px; margin-right: 20px"
              v-model="basicInfoForm.companyAddress"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <span slot="label"><span style="color:#F56C6C;margin-right:4px">*</span>润滑点设备信息</span>
            <el-button type="danger" plain size="small" :disabled="checkedDeviceForm.checkedDevice.length>=3" @click="chooseDeviceBtn">添 加</el-button>
          </el-form-item>
        </el-form>
          <el-form :model="checkedDeviceForm" :rules="checkedDeviceRules" ref="checkedDeviceForm" label-width="120px" label-position="left">
          <!-- 设备信息字段 -->
          <div v-if="checkedDeviceForm.checkedDevice.length>0">
            <div v-for="(item, index) in checkedDeviceForm.checkedDevice"  :key="index"> 
              <div style="margin: 20px 0;font-size: 14px;">润滑点 {{ index+1 }} <el-button type="text" @click="deleteDeviceBtn(index)" :disabled="checkedDeviceForm.checkedDevice.length==1" style="color: #dd0000;margin-left:10px;">删除</el-button></div> 
              <div style="background-color: #ededed;padding: 20px 20px 0;">
                <el-row>
                <el-col :span="6">
                  <el-form-item label="润滑点设备名称" >
                    {{ item.lubricationPointName ? item.lubricationPointName : " -- " }}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="设备名称" >
                    {{ item.deviceName ? item.deviceName : " -- " }}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="设备型号" >
                    {{ item.deviceModel ? item.deviceModel : " -- " }}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="设备制造商名称" >
                    {{ item.manufacturer ? item.manufacturer : " -- " }}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="台数" :prop="'checkedDevice.' + index + '.ropDeviceNum'" :rules="checkedDeviceRules.ropDeviceNum">
                    <el-input v-model="item.ropDeviceNum" placeholder="请输入" size="small" maxlength="5" style="width:220px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="现用油品">
                    <el-select disabled size="small" ref="cascaderRef" v-model="item.currentOilCode" placeholder="请选择" clearable filterable style="width: 220px;">
                      <el-option v-for="item in oilList" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
                    </el-select>
                    <!-- <el-cascader
                      size="small"
                      disabled
                      placeholder="请选择"
                      :options="oilList"
                      v-model="item.currentOilCode"
                      style="width: 220px;"
                      filterable
                      clearable
                      :props="{ value: 'oilNumber', label: 'oilName' }"
                    >
                    </el-cascader> -->
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="油品使用时间" :prop="'checkedDevice.' + index + '.ropDeviceOilStartTime'" :rules="checkedDeviceRules.ropDeviceOilStartTime">
                    <el-date-picker style="width:220px;" v-model="item.ropDeviceOilStartTime" size="small" type="date" placeholder="请选择"> </el-date-picker>
                    <div class="notice">开始使用该油品的时间，如2010年11月</div>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="设备及油品状况" :prop="'checkedDevice.' + index + '.ropDeviceOilStatus'" :rules="checkedDeviceRules.ropDeviceOilStatus">
                    <el-select v-model="item.ropDeviceOilStatus" placeholder="请选择" size="small" style="width:220px;">
                      <el-option v-for="(item, index) in ropDeviceOilStatusList" :label="item.label" :value="item.value" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              </div>
              
              
             
            </div>
          </div>
        </el-form>
        
      </div>
      <!-- 背景 -->
      <div class="right-content" style="margin-top: 20px">
        <div class="line"></div>
        <div class="right-title">背景</div>
      </div>
      <div style="padding:24px 20px;">
        <el-form :model="basicInfoForm" :rules="basicInfoFormRules" ref="backgroundForm" label-width="190px" label-position="right">
          <el-form-item label="背景说明" prop="backgroundDesc">
            <el-input
              type="textarea"
              :rows="2"
              resize="none"
              maxlength="180"
              class="font-family"
              placeholder="请输入内容"
              show-word-limit
              style="width: 100%; margin-bottom: 0px"
              v-model="basicInfoForm.backgroundDesc"
            >
            </el-input>
            <div class="notice">简述客户的润滑痛点</div>
          </el-form-item>
        </el-form>
      </div>

      <!-- 使用情况 -->
      <div class="right-content" style="margin-top: 20px">
        <div class="line"></div>
        <div class="right-title">使用情况</div>
      </div>
      <div style="padding:24px 20px;">
        <el-form :model="basicInfoForm" :rules="basicInfoFormRules" ref="useStatusForm" label-width="190px" label-position="right">
          <el-form-item label="使用情况" prop="usageDesc">
            <el-input
              type="textarea"
              :rows="2"
              resize="none"
              maxlength="180"
              class="font-family"
              placeholder="请输入内容"
              show-word-limit
              style="width: 100%; margin-bottom: 0px"
              v-model="basicInfoForm.usageDesc"
            >
            </el-input>
            <div class="notice">简单介绍美孚产品的优势及实施的美孚工程服务项目</div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 结果 -->
      <div class="right-content" style="margin-top: 20px">
        <div class="line"></div>
        <div class="right-title">结果</div>
      </div>
      <!-- 结果 -->
      <div style="padding:24px 20px;">
        <el-form :model="basicInfoForm" :rules="basicInfoFormRules" ref="resultForm" label-width="190px" label-position="right">
          <el-form-item label="结果1" prop="result">
            <el-input
              type="textarea"
              :rows="2"
              resize="none"
              maxlength="70"
              class="font-family"
              placeholder="请输入内容"
              show-word-limit
              style="width: 100%; margin-bottom: 0px"
              v-model="basicInfoForm.result"
            >
            </el-input>
            <div class="notice">如延长了换油周期、降低了设备故障、减少了非计划停机时间等</div>
          </el-form-item>
          <el-form-item label="结果2">
            <el-input
              type="textarea"
              :rows="2"
              resize="none"
              maxlength="70"
              class="font-family"
              placeholder="请输入内容"
              show-word-limit
              style="width: 100%; margin-bottom: 0px"
              v-model="basicInfoForm.result2"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="结果3">
            <el-input
              type="textarea"
              :rows="2"
              resize="none"
              maxlength="70"
              class="font-family"
              placeholder="请输入内容"
              show-word-limit
              style="width: 100%; margin-bottom: 0px"
              v-model="basicInfoForm.result3"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 效益 -->
      <div class="right-content" style="margin-top: 20px">
        <div class="line"></div>
        <div class="right-title">效益</div>
      </div>
      <div style="padding: 24px 20px 0">
        <el-form :model="basicInfoForm" :rules="basicInfoFormRules" ref="benefitsFrom" label-width="190px" label-position="right">
          <el-form-item label="安全" prop="effectSafe">
            <el-input
              size="small"
              maxlength="15"
              style="width: 380px; margin-right: 20px"
              placeholder="请输入"
              @keyup.native="proving('safe')"
              :rules="[
                { required: true, message: '请输入安全字段', trigger: 'blur' },
                { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
              ]"
              v-model="basicInfoForm.effectSafe"
            ></el-input
            >小时
            <div class="notice">减少设备维护人员与设备的接触时间（小时）</div>
          </el-form-item>
          <el-form-item>
            <div slot="label" style="display:flex;align-items:center;justify-content: flex-end;">
              <div style="color:#F56C6C;margin-right:4px">*</div>
              <div>环保</div>
            </div>
          </el-form-item>
          <el-form-item label="减少废润滑油的产生和处置" prop="effectEnvironment">
            <el-input
              size="small"
              maxlength="15"
              style="width: 380px; margin-right: 20px"
              placeholder="请输入"
              @keyup.native="proving('environment')"
              :rules="[
                { required: true, message: '请输入减少废润滑油的产生和处置', trigger: 'blur' },
                { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
              ]"
              v-model="basicInfoForm.effectEnvironment"
            ></el-input
            >升
            <div class="notice">减少废润滑油的产生和处置（升）</div>
          </el-form-item>
          <el-form-item label="减少CO2排放情况" prop="effectEnvironmentCo2Flag">
            <el-radio-group v-model="basicInfoForm.effectEnvironmentCo2Flag">
              <el-radio :label="true">有</el-radio>
              <el-radio :label="false">无</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="减少CO2排放" prop="effectEnvironmentCo2Num" v-if="basicInfoForm.effectEnvironmentCo2Flag">
            <el-input
              size="small"
              maxlength="15"
              style="width: 380px; margin-right: 20px"
              placeholder="请输入"
              @keyup.native="proving('co2Num')"
              :rules="[
                { required: true, message: '请输入减少CO2排放', trigger: 'blur' },
                { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
              ]"
              v-model="basicInfoForm.effectEnvironmentCo2Num"
            ></el-input
            >吨
          </el-form-item>
          <el-form-item label="高效" prop="effectHigh">
            <el-input
              size="small"
              maxlength="15"
              style="width: 380px; margin-right: 20px"
              placeholder="请输入"
              @keyup.native="proving('efficiency')"
              :rules="[
                { required: true, message: '请输入高效字段', trigger: 'blur' },
                { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
              ]"
              v-model="basicInfoForm.effectHigh"
            ></el-input
            >万元
            <div class="notice">降低设备维护成本和非计划停机损失，增加效益</div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="foot-botton">
      <el-button type="danger" plain :disabled="disabledPreview" @click="previewReport" size="small">预览报告</el-button>
      <el-button v-show="reportStatus=='1'" type="danger" plain @click="saveInfoPublish('draft')" size="small">保存草稿</el-button>
      <el-button type="danger" @click="saveInfoPublish('commit')" size="small">保存并提交</el-button>
      <el-button type="danger" plain @click="cancleEditInfo" size="small">取消</el-button>
    </div>
    <!-- 选择润滑点 -->
    <lupDialogNew
      :chooseDeviceAndLupDialog="chooseDeviceAndLupDialog"
      :singleFlag="false"
      :selectMax='selectMax'
      :checkedDevice="checkedDeviceForm.checkedDevice"
      :urlType="urlType"
      :companyName="companyName"
      :taskType="taskType"
      :companyId="deviceCompanyId"
      :companyNumber="$route.query.companyNumber"
      v-on:cancelChooseDeviceAndLup="cancelChooseDeviceAndLup"
      v-on:confirmChooseLup="confirmChooseLup"
    >
    </lupDialogNew>
  </div>
</template>
<script>
import lupDialogNew from "../../spotInspection/components/chooseLubricationPointWorkorder.vue";
import { validateForms } from "../../../utils/index";
export default {
  components: { lupDialogNew },
  data() {
    const validateDeviceNum = (rule, value, callback) => {
      const reg = /^[1-9]\d{0,4}$/;
      if (value) {
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("台数为正整数，且最多5位"));
        }
      } else {
        return callback(new Error("请输入台数"));
      }
    };
    return {
      hideUpload: false,
      disabledPreview:true,
      selectMax:3,
      chooseDeviceAndLupDialog:false,
      taskType:'customer',
      checkedDeviceForm:{
        checkedDevice: [],
      },
      basicInfoForm: {
        effectEnvironmentCo2Flag: true
      },
      ropDeviceOilStatusList: [
        {
          label: "良好",
          value: 1
        },
        {
          label: "一般",
          value: 2
        },
        {
          label: "较差",
          value: 3
        }
      ],
      mainminheight: `height:${document.documentElement.clientHeight - 200}px`,
      //   表单验证规则
      basicInfoFormRules: {
        companyAddress: [{ required: true, message: "请输入公司地址", trigger: "blur" }],
        backgroundDesc: [{ required: true, message: "请输入背景说明", trigger: "blur" }],
        usageDesc: [{ required: true, message: "请输入使用情况", trigger: "blur" }],
        result: [{ required: true, message: "请输入结果", trigger: "blur" }],
        effectEnvironment: [
          { required: true, message: "请输入减少废润滑油的产生和处置", trigger: "blur" },
          { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: "数值不能为空,且小数点后最多2位小数", trigger: "blur" }
        ],
        effectEnvironmentCo2Flag: [{ required: true, message: "请选择减少CO2排放情况", trigger: "change" }],
        effectEnvironmentCo2Num: [
          { required: true, message: "请输入减少CO2排放", trigger: "blur" },
          { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: "数值不能为空,且小数点后最多2位小数", trigger: "blur" }
        ],
        effectHigh: [
          { required: true, message: "请输入高效字段", trigger: "blur" },
          { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: "数值不能为空,且小数点后最多2位小数", trigger: "blur" }
        ],
        effectSafe: [
          { required: true, message: "请输入安全字段", trigger: "blur" },
          { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: "数值不能为空,且小数点后最多2位小数", trigger: "blur" }
        ]
      },
      checkedDeviceRules:{
        ropDeviceNum: [{ required: true, validator: validateDeviceNum, trigger: "blur" }],
        // ropDeviceCurrentOilCode:[{ required: true, message: '请选择现用油品', trigger: 'change' }],
        ropDeviceOilStartTime: [{ required: true, message: "请选择油品使用时间", trigger: "change" }],
        ropDeviceOilStatus: [{ required: true, message: "请选择设备及油品状况", trigger: "change" }],
      },
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      reportId: "",
      industry: "",
      customerId: "",
      id: "",
      companyName: "",
      oilList: [],
      // 选择设备
      chooseDeviceDialog: false,
      urlType: "createRop",
      singleFlag: true,
      deviceCompanyId: "",
      radioReportRow: {},
      companyNumber: "",
      deviceObj: {},
      reportStatus: '1'
    };
  },
  created() {
    this.reportStatus = this.$route.query.reportStatus;
    this.reportId = this.$route.query.reportId;
    this.customerId = this.$route.query.customerId;
    this.companyName = this.$route.query.companyName;
    this.companyNumber = this.$route.query.companyNumber;
    this.industry = this.$route.query.industry;
    // 编辑查询详情
    if (this.$route.query.reportId) {
      this.getRopDetail();
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.mainminheight = `height:${document.documentElement.clientHeight - 200}px`;
      })();
    };
  },
  methods: {
    cancelChooseDeviceAndLup() {
      this.chooseDeviceAndLupDialog = false
    },
    getOilList(code) {
      this.requestMethodGet("/mdm/oil/queryOilListByPage", {code:code, fullQueryFlag:true, size:1000, current:1})
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.oilList = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
   // 调取报告详情接口
   previewReport() {
      const params = {
        popRopId: this.reportId
      };
      this.requestMethodGet("/pes/pop/queryPopRopPdfPath", params).then(res => {
        if (res.data.code == 1000) {
          if (res.data.data.status == "2" ) {
            this.$message({
              message: "报告正在生成中，请稍后",
              type: "warning"
            });
          } else {
            if (res.data.data.path ) {
              window.open(res.data.data.path);
            } else {
              this.$message({
                message: "报告生成失败，请重试",
                type: "warning"
              });
            }
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    getRopDetail() {
      this.requestMethodGet("/pes/pop/queryPopRopDetail", { popRopId: this.reportId, customerIndustryName: this.industry }).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          this.disabledPreview = false;
          // 设备
          data.ropDevcieLubricationList.forEach(item=>{
            item.currentOilCode = item.ropDeviceCurrentOilCode
          })
          this.checkedDeviceForm.checkedDevice = data.ropDevcieLubricationList;
          delete data.ropDevcieLubricationList
          this.basicInfoForm = data;
          if(this.checkedDeviceForm.checkedDevice.length>0){
            let oilCodes = this.checkedDeviceForm.checkedDevice.map(item=>{ return item.currentOilCode })
            this.getOilList(oilCodes.toString())
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 选择设备
    chooseDeviceBtn() {
      console.log(this.checkedDeviceForm.checkedDevice)
      this.deviceCompanyId = this.customerId;
      if(this.checkedDeviceForm.checkedDevice.length>0) {
        this.selectMax = 3-this.checkedDeviceForm.checkedDevice.length
      }
      
      this.chooseDeviceAndLupDialog = true;

    },
    deleteDeviceBtn(index) {
      this.$confirm("确定要删除这个润滑点吗", "", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      })
        .then(() => {
          this.checkedDeviceForm.checkedDevice.splice(index,1)
        })
        .catch(() => {
          
        });
      
    },
    confirmChooseLup(list) {
      this.chooseDeviceAndLupDialog = false;
      this.checkedDeviceForm.checkedDevice = list;
      let oilCodes = this.checkedDeviceForm.checkedDevice.map(item=>{ return item.currentOilCode })
      this.getOilList(oilCodes.toString())
    },
    proving(val) {
      if (val == "safe") {
        this.basicInfoForm.effectSafe = this.basicInfoForm.effectSafe.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        this.basicInfoForm.effectSafe = this.basicInfoForm.effectSafe.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        this.basicInfoForm.effectSafe = this.basicInfoForm.effectSafe.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        this.basicInfoForm.effectSafe = this.basicInfoForm.effectSafe
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", "."); // 只允许输入一个小数点
        this.basicInfoForm.effectSafe = this.basicInfoForm.effectSafe.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        this.basicInfoForm.effectSafe = this.basicInfoForm.effectSafe.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        this.basicInfoForm.effectSafe = this.basicInfoForm.effectSafe.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        this.basicInfoForm.effectSafe = this.basicInfoForm.effectSafe.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
      if (val == "environment") {
        this.basicInfoForm.effectEnvironment = this.basicInfoForm.effectEnvironment.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        this.basicInfoForm.effectEnvironment = this.basicInfoForm.effectEnvironment.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        this.basicInfoForm.effectEnvironment = this.basicInfoForm.effectEnvironment.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        this.basicInfoForm.effectEnvironment = this.basicInfoForm.effectEnvironment
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", "."); // 只允许输入一个小数点
        this.basicInfoForm.effectEnvironment = this.basicInfoForm.effectEnvironment.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        this.basicInfoForm.effectEnvironment = this.basicInfoForm.effectEnvironment.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        this.basicInfoForm.effectEnvironment = this.basicInfoForm.effectEnvironment.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        this.basicInfoForm.effectEnvironment = this.basicInfoForm.effectEnvironment.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
      if (val == "efficiency") {
        this.basicInfoForm.effectHigh = this.basicInfoForm.effectHigh.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        this.basicInfoForm.effectHigh = this.basicInfoForm.effectHigh.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        this.basicInfoForm.effectHigh = this.basicInfoForm.effectHigh.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        this.basicInfoForm.effectHigh = this.basicInfoForm.effectHigh
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", "."); // 只允许输入一个小数点
        this.basicInfoForm.effectHigh = this.basicInfoForm.effectHigh.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        this.basicInfoForm.effectHigh = this.basicInfoForm.effectHigh.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        this.basicInfoForm.effectHigh = this.basicInfoForm.effectHigh.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        this.basicInfoForm.effectHigh = this.basicInfoForm.effectHigh.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
      if (val == "co2Num") {
        this.basicInfoForm.effectEnvironmentCo2Num = this.basicInfoForm.effectEnvironmentCo2Num.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        this.basicInfoForm.effectEnvironmentCo2Num = this.basicInfoForm.effectEnvironmentCo2Num.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        this.basicInfoForm.effectEnvironmentCo2Num = this.basicInfoForm.effectEnvironmentCo2Num.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        this.basicInfoForm.effectEnvironmentCo2Num = this.basicInfoForm.effectEnvironmentCo2Num
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", "."); // 只允许输入一个小数点
        this.basicInfoForm.effectEnvironmentCo2Num = this.basicInfoForm.effectEnvironmentCo2Num.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        this.basicInfoForm.effectEnvironmentCo2Num = this.basicInfoForm.effectEnvironmentCo2Num.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        this.basicInfoForm.effectEnvironmentCo2Num = this.basicInfoForm.effectEnvironmentCo2Num.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        this.basicInfoForm.effectEnvironmentCo2Num = this.basicInfoForm.effectEnvironmentCo2Num.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
    },
    // 保存草稿
    saveInfo(val) {
      
      this.checkedDeviceForm.checkedDevice.forEach(item=>{
        item.ropDeviceCurrentOilCode = item.currentOilCode
      })
      console.log(this.checkedDeviceForm.checkedDevice)
      let parmas = {
        busId: this.reportId || "",
        publishFlag: false,
        customerId: this.customerId,
        action: val,
        popRopFlag: 2,
        ropDevcieLubricationList:this.checkedDeviceForm.checkedDevice,
        ...this.basicInfoForm
      };
      if (!_.isEmpty(this.deviceObj)) {
        //选中的设备ID
        parmas.deviceId = this.deviceObj.deviceId;
        parmas.lubricationPointId = this.deviceObj.lubricationPointId;
      } else {
        parmas.deviceId = "";
        parmas.lubricationPointId = "";
      }
      this.requestMethodPost("/pes/pop/addUpdatePopRop", parmas).then(res => {
        if (res.data.code == 1000) {
          this.disabledPreview = false;
          if (res.data.data) {
            this.reportId = res.data.data;
          }
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.$router.push({
            path: "/CustomerProfile/CustomerProfileDetail",
            query: {
              companyNumber: this.$route.query.companyNumber,
              companyId: this.customerId,
              tabSource: "customerStories",
              popRopFlag: "rop"
            }
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    saveInfoPublish(val) {
      if (val == "draft") {
        this.$gio.saveDraftOfCustomerCaseReport({
          caseType: "ROP"
        });
        this.saveInfo(val);
      } else {
        if (!this.checkedDeviceForm.checkedDevice.length) {
          this.$message({
            type: "warning",
            message: "请选择设备"
          });
          return;
        }
        this.$gio.publishCustomerCaseReport({
          caseType: "ROP"
        });
        const formRef = ["checkedDeviceForm","basicInfoForm", "backgroundForm", "useStatusForm", "resultForm", "benefitsFrom"].map(key => this.$refs[key]);
        validateForms(formRef)
          .then(() => {
            this.saveInfo(val);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    commitReport(busId) {
      this.requestMethodPost("/pes/pop/processReport", {action:'commit',busId:busId,evaluate:''}).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            message: "发布成功",
            type: "success"
          });
          this.$router.push({
            path: "/CustomerProfile/CustomerProfileDetail",
            query: {
              companyNumber: this.$route.query.companyNumber,
              companyId: this.customerId,
              tabSource: "customerStories",
              popRopFlag: "rop"
            }
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 取消
    cancleEditInfo() {
      this.$gio.cancelCreateOrEditCustomerCaseReport({
        caseeType: "ROP"
      });
      this.$confirm("取消后将丢失本次编辑内容", "取消编辑", {
        cancelButtonText: "继续编辑",
        confirmButtonText: "确定",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      })
        .then(() => {
          this.$gio.cancelCreateOrEditCustomerCaseReport({
            caseeType: "ROP"
          });
          this.$router.push({
            path: "/CustomerProfile/CustomerProfileDetail",
            query: {
              companyNumber: this.$route.query.companyNumber,
              companyId: this.customerId,
              tabSource: "customerStories",
              popRopFlag: "rop"
            }
          });
        })
        .catch(() => {
          this.$gio.cancelCreateOrEditCustomerCaseReport({
            caseeType: "ROP"
          });
        });
    }
  }
};
</script>
<style lang="less" scoped>
.benefit-wrap {
  .plan-wrap {
    padding: 20px;
    height: 100%;
    position: relative;
    overflow: auto;
  }
  .right-content {
    display: flex;
    align-items: center;
    background: #ededed;
    font-size: 14px;
    margin-top: 40px;
    line-height: 50px;
    height: 50px;
    font-weight: 400;
    font-size: 14px;
    padding: 0 20px;
  }
  .device-content {
    border: 1px solid #e9e9e9;
    border-radius: 6px;
    padding: 16px 20px;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    place-items: flex-start;
  }
  .device-flex {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 400;
  }
  .device-title {
    color: #000;
  }
  .device-value {
    color: #008888;
  }
  .line {
    width: 4px;
    height: 14px;
    background-color: #dd0000;
  }
  .notice {
    font-size: 12px;
    line-height: 12px;
    color: #999;
    margin-top: 4px;
  }
  .line-grey {
    width: 1px;
    height: 14px;
    display: inline-block;
    margin: 0 24px;
    background-color: #e9e9e9;
  }
  .right-title {
    line-height: 25px;
    color: #000;
    margin-left: 8px;
    font-weight: bold;
  }
  .service-items-wrap {
    background: rgba(204, 221, 255, 0.2);
    font-weight: 400;
    color: #999;
    border: 1px solid #ccddff;
    border-radius: 6px;
    font-size: 13px;
    padding: 16px 20px;
    margin-bottom: 12px;
  }
  .no-wrap {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .plan-items-title {
    font-weight: 700;
    font-size: 14px;
    line-height: 14px;
    color: #000;
    margin-bottom: 20px;
  }
  // 设置显示两行，超出省略
  /deep/ .el-table th > .cell {
    word-break: keep-all !important;
    white-space: nowrap !important;
  }
  .foot-botton {
    width: 100%;
    background-color: #fff;
    height: 50px;
    padding: 0 20px;
    position: fixed;
    bottom: 0;
  }
  /deep/ .hide .el-upload--picture-card {
    display: none !important;
  }
  /deep/ .hide2 .el-upload--picture-card {
    display: none !important;
  }
}
</style>
