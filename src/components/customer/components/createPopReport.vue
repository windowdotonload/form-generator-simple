<!--PES档案详情-->
<template>
  <div style="position: relative" class="benefit-wrap">
    <div class="plan-wrap" :style="mainminheight">
      <div class="right-content" style="margin-top: 20px">
        <div class="line"></div>
        <div class="right-title">基本信息</div>
      </div>
      <!-- 首页 -->
      <div style="padding: 24px 20px;margin:10px 0 0;">
        <el-row class="service-items-wrap">
          <div style="color:#000000;font-size:14px;line-height:14px;margin-bottom:12px;font-weight:bold;">
            客户名称：
            <span style="color:#008888;">{{ companyName }}</span>
          </div>
          <div style="color:#999999;font-size:13px;line-height:13px;">行业：{{ industry }}</div>
        </el-row>
        <el-form :model="basicInfoForm" :rules="basicInfoFormRules" ref="basicInfoFormRef" label-width="190px" label-position="right">
          <el-form-item label="报告名称">
            <el-input
              placeholder="请输入"
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
          <el-form-item>
            <span slot="label">效益报告</span>
            <el-button size="small" type="danger" plain @click="chooseReport" :disabled="basicInfoForm.createType == 1">报告</el-button>
            <div class="notice" style="display:flex;align-items:center;margin-top:20px" v-if="radioReportRow.fileName">
              <span>{{ radioReportRow.fileName ? radioReportRow.fileName : "" }}</span>
              <el-link style="margin-left:10px" @click="toBenefitReport">前往查看</el-link>
            </div>
          </el-form-item>
          <el-form-item class="el-customer">
            <div slot="label" style="width:180px;margin-right:10px;"><span style="color:red">*</span>请上传客户图片</div>
            <imgUpload :loop-item="popImgItem" />
            <div class="notice">建议使用能代表该效益的全景照片，并做合适裁剪</div>
          </el-form-item>
          <el-form-item label="公司地址" prop="companyAddress">
            <el-input
              placeholder="请输入"
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
          <el-form-item label="业绩证明标题" prop="popTitle">
            <el-input
              placeholder="请输入"
              type="textarea"
              size="small"
              maxlength="120"
              :autosize="{ minRows: 2, maxRows: 6 }"
              show-word-limit
              resize="none"
              style="width: 640px; margin-right: 20px"
              v-model="basicInfoForm.popTitle"
            ></el-input>
            <div class="notice">如“美孚产品或/和美孚工程服务帮助xxx客户解决xxx润滑痛点，并产生效益 xxx 万元/年”</div>
          </el-form-item>
          <!-- <el-form-item label="该效益是否关联具体设备" prop="xyzjRelDeviceFlag">
            <el-select v-model="basicInfoForm.xyzjRelDeviceFlag" placeholder="请选择" size="small">
              <el-option v-for="(it, index) in xyzjRelDeviceList" :label="it.label" :value="it.value" :key="index"> </el-option>
            </el-select>
            <div class="notice">不关联具体设备的效益，如润滑培训、油品储运调研、润滑油脂品种优化等</div>
          </el-form-item> -->
          <el-form-item v-if="basicInfoForm.xyzjRelDeviceFlag">
            <span slot="label"><span style="color:#F56C6C;margin-right:4px">*</span>润滑点设备信息</span>
            <el-button type="danger" plain size="small" @click="chooseDeviceBtn">{{checkedDeviceForm.deviceName==''?'选择':'重新选择'}}</el-button>
          </el-form-item>
          <!-- 设备信息字段 -->
          <div class="device-content" v-if="basicInfoForm.xyzjRelDeviceFlag">
            <div style="display:flex;align-items:center">
              <div class="device-flex">
                <div class="device-title">润滑点设备名称：</div>
                <div class="device-value">{{ checkedDeviceForm.lubricationPointName ? checkedDeviceForm.lubricationPointName : " -- " }}</div>
              </div>
              <div class="device-flex" style="margin-left:30px;">
                <div class="device-title">设备名称：</div>
                <div class="device-value">{{ checkedDeviceForm.deviceName ? checkedDeviceForm.deviceName : " -- " }}</div>
              </div>
              <div class="device-flex" style="margin-left:30px">
                <div class="device-title">设备型号：</div>
                <div class="device-value">{{ checkedDeviceForm.deviceModel ? checkedDeviceForm.deviceModel : " -- " }}</div>
              </div>
              <div class="device-flex" style="margin-left:30px">
                <div class="device-title">设备制造商名称：</div>
                <div class="device-value">{{ checkedDeviceForm.manufacturer ? checkedDeviceForm.manufacturer : " -- " }}</div>
              </div>
            </div>
            <div class="device-flex" style="margin-top:12px">
              <div class="device-title">现用油品：</div>
              <div class="device-value">{{ currentOilName || " -- " }}</div>
            </div>
          </div>
          <!-- <el-form-item style="margin-top:20px;" v-if="basicInfoForm.xyzjRelDeviceFlag">
            <div slot="label" style="width:180px;margin-right:10px;">设备图片</div>
            <imgUpload :loop-item="popImgItem" />
            <div class="notice">建议使用能代表该效益的设备图片，并做合适裁剪</div>
          </el-form-item> -->
        </el-form>
      </div>
      <!-- 背景 -->
      <div class="right-content" style="margin-top: 20px">
        <div class="line"></div>
        <div class="right-title">背景</div>
      </div>
      <div style="padding:24px 20px;">
        <el-form :model="basicInfoForm" :rules="basicInfoFormRules" ref="bgFormRef" label-width="190px" label-position="right">
          <el-form-item label="背景说明" prop="backgroundDesc">
            <el-input
              type="textarea"
              :rows="2"
              resize="none"
              maxlength="250"
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

      <!-- 解决方案 -->
      <div class="right-content" style="margin-top: 20px">
        <div class="line"></div>
        <div class="right-title">
          解决方案
          <!-- <span class="notice" style="font-weight:400;font-size:13px;">(已上线美孚工程服务任何项目、绿色润滑项目、OCM 等)</span> -->
        </div>
      </div>
      <!-- 解决方案 -->
      <div style="padding:24px 20px;">
        <el-form :model="basicInfoForm" :rules="basicInfoFormRules" ref="solutionFormRef" label-width="190px" label-position="right">
          <el-form-item label="解决方案" prop="solution">
            <el-input
              type="textarea"
              :rows="2"
              resize="none"
              maxlength="300"
              class="font-family"
              placeholder="请输入内容"
              show-word-limit
              style="width: 100%; margin-bottom: 0px"
              v-model="basicInfoForm.solution"
            >
            </el-input>
            <div class="notice">简述美孚的解决方案，包括产品或/和服务。产品和服务名称用EM官方名称，并在初次出现时使用粗体字</div>
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
        <el-form :model="basicInfoForm" :rules="basicInfoFormRules" ref="resultFormRef" label-width="190px" label-position="right">
          <el-form-item label="结果" prop="result">
            <el-input
              type="textarea"
              :rows="2"
              resize="none"
              maxlength="100"
              class="font-family"
              placeholder="请输入内容"
              show-word-limit
              style="width: 100%; margin-bottom: 0px"
              v-model="basicInfoForm.result"
            >
            </el-input>
            <div class="notice">解决了客户润滑痛点及有关结果</div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 效益 -->
      <div class="right-content" style="margin-top: 20px">
        <div class="line"></div>
        <div class="right-title">效益</div>
      </div>
      <div style="padding: 24px 20px 0">
        <el-form :model="basicInfoForm" :rules="basicInfoFormRules" ref="benefitFormRef" label-width="190px" label-position="right">
          <el-form-item label="安全" prop="effectSafe">
            <el-input
              size="small"
              maxlength="15"
              style="width: 380px; margin-right: 20px"
              placeholder="请输入安全"
              @keyup.native="proving(index, 'safe')"
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
              placeholder="请输入减少废润滑油的产生和处置"
              @keyup.native="proving(index, 'environment')"
              :rules="[
                { required: true, message: '请输入减少废润滑油的产生和处置', trigger: 'blur' },
                { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
              ]"
              v-model="basicInfoForm.effectEnvironment"
            ></el-input
            ><el-select v-model="basicInfoForm.effectEnvironmentUnit" size="small" style="width:100px;">
              <el-option
                v-for="item in optionsUnit"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div class="notice">环境改善</div>
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
              placeholder="请输入减少CO2排放"
              @keyup.native="proving(index, 'co2Num')"
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
              placeholder="请输入高效"
              @keyup.native="proving(index, 'efficiency')"
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
    <!-- 选择效益报告 -->
    <el-dialog title="选择效益报告" :visible.sync="chooseBenefitDialog" width="70%" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancelChoose">
      <!-- 搜索项 -->
      <el-form ref="searchForm" :model="searchForm" inline label-width="80px">
        <el-form-item label="报告名称">
          <el-input v-model="searchForm.reportName" placeholder="请输入" size="small" @change="getReportList('refresh')" clearable></el-input>
        </el-form-item>

        <el-form-item label="创建人">
          <el-input v-model="searchForm.createUserName" placeholder="请输入" size="small" @change="getReportList('refresh')" clearable></el-input>
        </el-form-item>

        <el-form-item label="创建时间">
          <el-date-picker size="small" v-model="searchForm.createTime" @change="getReportList('refresh')" clearable value-format="yyyy-MM-dd" type="date" placeholder="请选择"> </el-date-picker>
        </el-form-item>

        <el-form-item>
          <div slot="label">
            <el-button size="small" @click="resetSearch">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <div class="table-container">
        <el-table height="350" :data="reportTableData" tooltip-effect="dark" ref="reportTableRef" :row-key="rowKey" @select="handleSelectReport" @select-all="selectAllReport">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="fileName" min-width="10%" label="报告名称" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="createUserName" min-width="10%" label="创建人" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="createTime" min-width="10%" label="创建时间" show-overflow-tooltip> </el-table-column>
        </el-table>
        <Pagination :total="tableTotal" :pageInfo="tablePageInfo" />
      </div>

      <span slot="footer">
        <div>
          <el-button @click="cancelChoose" size="small">取 消</el-button>
          <el-button size="small" @click="confirmChoose" type="danger">确 定</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 选择客户图片 -->
    <el-dialog title="选择所处行业或应用示例的图片" :visible.sync="showCustomer" width="50%" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancelCustomerChoose">
      <el-tabs v-model="activeName" @tab-click="handleClick" ref="elTabs">
        <el-tab-pane :label="item" :name="index" v-for="(item, index) in activeTabList" :key="index"></el-tab-pane>
      </el-tabs>
      <div class="customer-radio">
        <el-radio-group v-model="radioImage" size="mini">
          <el-radio :label="index" v-for="(item, index) in fullPathImageList" :key="index" style="display:flex;align-items:center;margin-bottom:15px;">
            <el-image :src="item" style="width:400px;height:300px;margin-left:20px;"></el-image>
          </el-radio>
        </el-radio-group>
      </div>
      <span slot="footer">
        <div>
          <el-button @click="cancelCustomerChoose" size="small">取 消</el-button>
          <el-button size="small" @click="confirmCustomerChoose" :type="radioImage===''?'info':'danger'" :disabled="radioImage===''">确 定</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 预览图片 -->
    <el-dialog :visible.sync="imgDialogVisible" append-to-body>
      <img width="100%" :src="customerFullPath" alt="" />
    </el-dialog>
    <!-- 选择设备 -->
    <!-- <ChooseDevice
      :chooseDeviceDialog="chooseDeviceDialog"
      :singleFlag="singleFlag"
      :checkedDevice="checkedDevice"
      :urlType="urlType"
      :companyId="deviceCompanyId"
      :companyNumber="companyNumber"
      v-on:cancelChooseDevice="cancelChooseDevice"
      v-on:confirmChooseDevice="confirmChooseDevice"
    ></ChooseDevice> -->
    <!-- 选择润滑点 -->
    <lupDialogNew
      :chooseDeviceAndLupDialog="chooseDeviceAndLupDialog"
      :singleFlag="false"
      :selectMax='selectMax'
      :checkedDevice="selectLupNew"
      :urlType="urlType"
      :companyName="companyName"
      :taskType="taskType"
      :companyId="deviceCompanyId"
      :companyNumber="companyNumber"
      v-on:cancelChooseDeviceAndLup="cancelChooseDeviceAndLup"
      v-on:confirmChooseLup="confirmChooseLup"
    >
    </lupDialogNew>
  </div>
</template>
<script>
import lupDialogNew from "../../spotInspection/components/chooseLubricationPointWorkorder.vue";
import ChooseDevice from "../../spotInspection/components/chooseDevice";
import imgUpload from "@/components/businessComponents/components/img-upload";
import Pagination from "./Pagination.vue";
import { validateForms } from "../../../utils/index";
export default {
  components: { lupDialogNew, ChooseDevice, imgUpload, Pagination },
  data() {
    return {
      selectLupNew: [],
      currentOilName: '',
      optionsUnit: [{value: '1',label:'升'},{value: '2',label:'千克'}],
      checkedDeviceForm:{
        lubricationPointId: '',
        lubricationPointName: '',
        manufacturer: '',
        deviceId: '',
        deviceName: '',
        deviceModel: '',
        manufacturer: '',
        currentOilCode: '',
        currentOilName: ''
      },
      taskType:'customer',
      selectMax: 1,
      imgDialogVisible: false,
      customerShowPic: [],
      customerHalfPath: '',
      customerFullPath: '',
      halfPathImageList: [],
      fullPathImageList: [],
      activeTabList: [],
      radioImage: '',
      activeName: '',
      showCustomer: false,
      tableTotal: 0,
      disabledPreview:true,
      tablePageInfo: {
        current: 1,
        size: 10
      },
      hideUpload: false,
      popImgItem: {
        imgFullDtoUrl: [],
        length: 1,
        cutWidth: 447,
        cutHeight: 466,
        styleJsonDto:{
          cutWidth: 447,
          cutHeight: 466
        }
      },
      imageList: [],
      basicInfoForm: {
        effectEnvironmentUnit:'1',
        effectEnvironmentCo2Flag: true,
        xyzjRelDeviceFlag: true
      },
      mainminheight: `height:${document.documentElement.clientHeight - 200}px`,
      //   表单验证规则
      basicInfoFormRules: {
        companyAddress: [{ required: true, message: "请输入公司地址", trigger: "blur" }],
        popTitle: [{ required: true, message: "请输入业绩证明标题", trigger: "blur" }],
        xyzjRelDeviceFlag: [{ required: true, message: "请选择该效益是否关联具体设备", trigger: "change" }],
        backgroundDesc: [{ required: true, message: "请输入背景说明", trigger: "blur" }],
        solution: [{ required: true, message: "请输入解决方案", trigger: "blur" }],
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
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      xyzjRelDeviceList: [
        {
          label: "是",
          value: true
        },
        {
          label: "否",
          value: false
        }
      ],
      reportId: "",
      industry: "",
      customerId: "",
      id: "",
      companyName: "",
      // 效益报告弹框
      chooseBenefitDialog: false,
      searchForm: {
        reportName: "",
        createUserName: "",
        createTime: ""
      },
      // 选择润滑点
      chooseDeviceAndLupDialog: false,
      checkedDevice: [],
      urlType: "createPop",
      singleFlag: true,
      deviceCompanyId: "",
      radioReportRow: {},
      companyNumber: "",
      deviceObj: {},
      reportTableData: [],
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
    // 查询效益报告
    this.getReportList();
    // 编辑查询详情
    if (this.$route.query.reportId) {
      this.getPopDetail();
    }
    // this.getIndustryTabList()
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.mainminheight = `height:${document.documentElement.clientHeight - 200}px`;
      })();
    };
  },
  methods: {
    handlePictureCardPreview() {
      this.imgDialogVisible = true
    },
    deleteCustomerPath() {
      this.customerShowPic = []
      this.customerHalfPath = ''
      this.customerFullPath = ''
    },
    getIndustryTabList() {
      this.requestMethodGet("/conf/pop/image/queryTabList", {}).then(res => {
        if (res.data.code == 1000) {
          this.activeTabList = res.data.data
          if(this.activeTabList.length>0){
            this.getCustomerImage(this.activeTabList[0])
          }
        }
      })
    },
    getCustomerImage(tabName) {
      // const loading = this.$loading({
      //   lock: true,
      //   text: "加载中，请稍后...",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)"
      // });
      this.requestMethodGet("/conf/pop/image/queryImgUrlByTabName", {tabName: tabName}).then(res => {
        // loading.close();
        if (res.data.code == 1000) {
          this.fullPathImageList = res.data.data.imgUrlList
          if(res.data.data.imgUrlStr.includes(',')){
            this.halfPathImageList = res.data.data.imgUrlStr.split(',')
          }else{
            this.halfPathImageList = [res.data.data.imgUrlStr]
          }
        }
      })
    },
    handleClick(tab, event) {
      this.radioImage = ''
      this.getCustomerImage(this.activeTabList[this.activeName])
    },
    customerImgDialog() {
      this.radioImage = ''
      this.showCustomer = true
    },
    cancelCustomerChoose() {
      this.showCustomer = false
    },
    confirmCustomerChoose() {
      this.customerHalfPath = this.halfPathImageList[this.radioImage]
      this.customerFullPath = this.fullPathImageList[this.radioImage]
      this.customerShowPic = [{url: this.customerFullPath,halfPath:this.customerHalfPath}]
      this.showCustomer = false
    },
    getPopDetail() {
      this.requestMethodGet("/pes/pop/queryPopRopDetail", { popRopId: this.reportId, customerIndustryName: this.industry }).then(res => {
        if (res.data.code == 1000) {
          this.disabledPreview = false;
          const data = res.data.data;
          // 图片
          let imgObj = {};
          if (data.picPath) {
            imgObj = {
              url: data.picPathFullUrl,
              urlHalf: data.picPath
            };
          };
          // 报告
          if (data.relationXyzjId) {
            this.radioReportRow = {
              id: Number(data.relationXyzjId),
              fileName: data.relationXyzjName,
              createType: data.createType
            };
          }
          // 设备
          let deObj = {};
          if (data.deviceId) {
              this.checkedDeviceForm.deviceModel = data.deviceModel
              this.checkedDeviceForm.deviceName = data.deviceName
              this.checkedDeviceForm.manufacturer = data.deviceManufacturer
              this.checkedDeviceForm.deviceId = data.deviceId
              this.checkedDeviceForm.lubricationPointId = data.lubricationPointId
              this.checkedDeviceForm.lubricationPointName = data.lubricationPointName
              this.checkedDeviceForm.currentOilName = data.currentOilName
              this.currentOilName = data.currentOilName
          }
          this.deviceObj = deObj;
          if (!_.isEmpty(imgObj)) {
            this.popImgItem.imgFullDtoUrl.push(imgObj);
          }
          this.basicInfoForm = data;
          this.basicInfoForm.effectEnvironmentUnit=this.basicInfoForm.effectEnvironmentUnit=='升'?'1':'2'
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
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
    // 勾选报告
    handleSelectReport(val, row) {
      if (!val.length) {
        this.$refs.reportTableRef.clearSelection();
        return;
      }
      this.radioReportRow = row
      this.$set(this.basicInfoForm,'effectSafe',row.effectSafe)
      this.$set(this.basicInfoForm,'effectEnvironment',row.effectEnvironment)
      this.$set(this.basicInfoForm,'effectHigh',row.effectHigh)
      this.$set(this.basicInfoForm,'effectEnvironmentCo2Flag',row.effectEnvironmentCo2Flag)
      this.$set(this.basicInfoForm,'effectEnvironmentCo2Num',row.effectEnvironmentCo2Num)
      // Object.assign(this.basicInfoForm,{effectEnvironmentCo2Flag:row.effectEnvironmentCo2Flag,effectEnvironmentCo2Num:row.effectEnvironmentCo2Num})
      this.$refs.reportTableRef.clearSelection();
      this.$refs.reportTableRef.toggleRowSelection(val.pop(), true);
    },
    // 全选报告
    selectAllReport(val) {
      this.$refs.reportTableRef.clearSelection();
      this.$refs.reportTableRef.toggleRowSelection(this.radioDeviceRow, true);
    },
    // 选择报告
    chooseReport() {
      this.chooseBenefitDialog = true;
      if (!_.isEmpty(this.radioReportRow) && this.reportTableData.length) {
        this.$nextTick(() => {
          this.reportTableData.forEach(it => {
            if (it.id == this.radioReportRow.id) {
              this.$refs.reportTableRef.toggleRowSelection(it, true);
            }
          });
        });
      }
    },
    resetSearch() {
      for (let key in this.searchForm) {
        this.searchForm[key] = "";
      }
      this.getReportList('refresh');
    },
    cancelChoose() {
      this.$refs.reportTableRef.clearSelection();
      this.chooseBenefitDialog = false;
    },
    confirmChoose() {
      this.chooseBenefitDialog = false;
    },
    // 前往查看报告
    toBenefitReport() {
      this.$gio.clickToViewButton({
        entrance: "业绩证明报告制作页"
      });
      if (_.isEmpty(this.radioReportRow)) {
        return;
      } else {
        if(this.radioReportRow.createType==1){ // 1制作的报告
          const routeUrl = this.$router.resolve({
            path: "/CustomerProfile/benefitReport",
            query: {
              companyName: this.companyName,
              customerId: this.customerId,
              customerCompanyNumber: this.$route.query.companyNumber,
              distributorCompanyType: this.userInfo.userType,
              distributorCompanyId: this.userInfo.companyId,
              pageType: "pop",
              benefitReportId: this.radioReportRow.id
            }
          });
          window.open(routeUrl.href, "_blank");
        }else if(this.radioReportRow.createType==2){ // 2上传报告
          const routeUploadUrl = this.$router.resolve({
            path: "/CustomerProfile/CustomerProfileDetail",
            query: {
              companyNumber: this.$route.query.companyNumber,
              xyzjIdQuery: this.radioReportRow.id,
              companyId: this.customerId,
              tabSource: 'benefitReport'
            }
          });
          window.open(routeUploadUrl.href, "_blank");
        }
      }
    },
    // 获取报告列表
    getReportList(val) {
      if(val) this.tablePageInfo.current = 1;
      const params = {
        customerId: this.customerId,
        distributorCompanyId: this.userInfo.companyId,
        distributorCompanyType: this.userInfo.roleType,
        status: 4,
        ...this.searchForm,
        ...this.tablePageInfo
      };
      const loading = this.$loading({
        lock: true,
        text: "数据加载中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.requestMethodGet("/pes/customer/list", params)
        .then(res => {
          if (res.data.code == 1000) {
            this.reportTableData = res.data.data.list;
            this.tableTotal = res.data.data.totalCount
            loading.close();
          } else {
            loading.close();
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          loading.close();
        });
    },
    // 选择润滑点
    chooseDeviceBtn() {
      this.deviceCompanyId = this.customerId;
      this.selectLupNew = [];
      this.chooseDeviceAndLupDialog = true;
    },
    // 选择设备取消
    cancelChooseDevice() {
      this.chooseDeviceDialog = false;
    },
    // 选择设备确定
    confirmChooseDevice(list) {
      this.checkedDevice = list.length ? [list.pop()] : [];
      this.deviceObj = this.checkedDevice[0];
      this.chooseDeviceDialog = false;
    },
    cancelChooseDeviceAndLup() {
      this.chooseDeviceAndLupDialog = false
    },
    async confirmChooseLup(list) {
      this.chooseDeviceAndLupDialog = false;
      this.checkedDeviceForm = {
        lubricationPointId: list[0].lubricationPointId,
        lubricationPointName: list[0].lubricationPointName,
        manufacturer: list[0].manufacturer,
        deviceId: list[0].deviceId,
        deviceName: list[0].deviceName,
        deviceModel: list[0].deviceModel,
        currentOilCode: list[0].currentOilCode,
        currentOilName: ''
      }
      if(list[0].currentOilCode){
        this.currentOilName  = await this.getOilNameByOilCode(list[0].currentOilCode)
      }
      this.checkedDeviceForm.currentOilName = this.currentOilName
    },
    proving(index, val) {
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
      let params = {
        busId: this.reportId || "",
        customerId: this.customerId,
        publishFlag: false,
        action: val,
        popRopFlag: 1,
        ...this.basicInfoForm
      };
      if (this.popImgItem.imgFullDtoUrl.length) {
        //图片半路径
        params.picPath = this.popImgItem.imgFullDtoUrl[0].urlHalf;
      }
      if (this.checkedDeviceForm.deviceId!='') {
        //选中的设备ID
        params.deviceId = this.checkedDeviceForm.deviceId
        params.deviceName = this.checkedDeviceForm.deviceName
        params.deviceModel = this.checkedDeviceForm.deviceModel
        params.lubricationPointId = this.checkedDeviceForm.lubricationPointId
        params.lubricationPointName = this.checkedDeviceForm.lubricationPointName
        params.manufacturer = this.checkedDeviceForm.manufacturer
        params.currentOilCode = this.checkedDeviceForm.currentOilCode
        params.currentOilName = this.checkedDeviceForm.currentOilName
      } else {
        params.deviceId = "";
        params.deviceName = ""
        params.deviceModel = ""
        params.lubricationPointId = ""
        params.lubricationPointName = ""
        params.manufacturer = ""
        params.currentOilCode = ""
        params.currentOilName = ""
      }
      params.effectEnvironmentUnit=params.effectEnvironmentUnit=='1'?'升':'千克'
      if (!_.isEmpty(this.radioReportRow)) {
        //选中的设备ID
        params.relationXyzjId = this.radioReportRow.id;
      } else {
        params.relationXyzjId = "";
      }
      this.requestMethodPost("/pes/pop/addUpdatePopRop", params).then(res => {
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
            popRopFlag: "pop"
          }
          });
          // if (val == "publish") {
          //   this.commitReport(this.reportId)
          // } else {

          // }
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
          caseeType: "POP"
        });
        this.saveInfo(val);
      } else {
        if (!this.popImgItem.imgFullDtoUrl.length) {
          this.$message({
            type: "warning",
            message: "请上传客户图片"
          });
          return;
        }
        if (this.basicInfoForm.xyzjRelDeviceFlag) {
          if (!this.checkedDeviceForm.deviceId) {
            this.$message({
              type: "warning",
              message: "请选择润滑点"
            });
            return;
          }
        }
        this.$gio.publishCustomerCaseReport({
          caseeType: "POP"
        });
        const formRef = ["basicInfoFormRef", "bgFormRef", "solutionFormRef", "resultFormRef", "benefitFormRef"].map(key => this.$refs[key]);
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
              popRopFlag: "pop"
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
        caseeType: "POP"
      });
      this.$confirm("取消后将丢失本次编辑内容", "取消编辑", {
        cancelButtonText: "继续编辑",
        confirmButtonText: "确定",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      })
        .then(() => {
          this.$gio.cancelCreateOrEditCustomerCaseReport({
            caseeType: "POP"
          });
          this.$router.push({
            path: "/CustomerProfile/CustomerProfileDetail",
            query: {
              companyNumber: this.$route.query.companyNumber,
              companyId: this.customerId,
              tabSource: "customerStories",
              popRopFlag: "pop"
            }
          });
        })
        .catch(() => {
          this.$gio.cancelCreateOrEditCustomerCaseReport({
            caseeType: "POP"
          });
        });
    },
    resetTabActivePosition($el){
      this.$nextTick(() => {
          const activeEl = $el.querySelector('.el-tabs__item.is-active');
          const lineEl = $el.querySelector('.el-tabs__active-bar');
          const style = getComputedStyle(activeEl);
          const pl = style.paddingLeft.match(/\d+/)[0] * 1;
          const pr = style.paddingRight.match(/\d+/)[0] * 1;
          const w = style.width.match(/\d+/)[0] * 1;
          lineEl.style.transform = 'translateX(' + (activeEl.offsetLeft + pl) + 'px)';
          lineEl.style.width = (w - pl - pr)+'px';
        })
    }
  },
  watch: {
    activeName: {
      handler() {
        this.resetTabActivePosition(this.$refs.elTabs.$el);
      },
      deep: true
    },
    tablePageInfo: {
      handler() {
        this.getReportList();
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
.isShowUploadBtn .el-upload {
  display: none;
}
.table-container {
  &::-webkit-scrollbar {
    width: 5px !important;
  }
}
/deep/ .el-tabs__item.is-active {
  color: #dd0000;
}
/deep/ .el-tabs__active-bar {
  background: #dd0000;
}
/deep/ .el-customer .el-upload-list--picture-card .el-upload-list__item {
    width: 150px;
    height: 113px;
  }
  /deep/  .el-customer .el-upload-list__item-actions .uploadMask {
    padding-top: 0px !important;
  }
.customer-img{
  cursor: pointer;
  width:120px;
  height:120px;
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  display:flex;
  justify-content:center;
  align-items:center;
}
.customer-radio{
  height:50vh;
  overflow:scroll;
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}
/deep/ .customer-radio .el-radio__input.is-checked .el-radio__inner {
    border-color: #dd0000 !important;
    background: #dd0000 !important;
}
/deep/ .customer-radio .el-radio__inner{
  border:1px solid #dd0000 !important;
}
.img-close{
  padding: 2px 0 0 2px;
  position: absolute;
  top: 0px;
  right: 0px;
  font-weight: bold;
  background: rgb(171, 168, 168);
  width: 16px;
  height: 16px;
  border-radius: 9px;
  cursor: pointer;
}
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
