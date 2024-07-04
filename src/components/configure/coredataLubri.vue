<template>
  <div style="position:relative;">
    <div style="position: absolute; right: 20px; height: 55px; line-height: 55px; top: -50px; color: red; cursor: pointer">
      <el-button type="danger" @click="handleAdd()" size="small">新建</el-button>
    </div>
    <div class="account-management" :style="mainminheight" id="accountManage">
      <div class="toolbox-con flexBetween" style="margin-bottom:10px;">
        <div class="tool-con">
          <el-button type="danger" plain @click="operationHistory" size="small">操作历史</el-button>
          <el-button plain @click="importFile" size="small">批量导入</el-button>
          <el-button size="small" plain @click="handleClearSearch">重置</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <custom-table
        class="table"
        ref="accountTable"
        :tableHeader="tableDataHeader"
        :tableData="lubriTableData"
        :tableHeight="tableHeight + ''"
        :loading="loading"
        @changeSearch="tableTitleSearch"
        @selectionChange="handleSelectionChange"
      >
        <template v-slot:status="slotProps">
          <el-table-column
            label="状态"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
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
              <span :style="scope.row.status == 0 ? 'color:#999;' : 'color:rgb(0, 136, 136);'">{{ scope.row.status == 0 ? "已禁用" : "已启用" }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-link @click="handleEdit(scope.row)" style="margin-left:10px;color:rgb(0,20,79)">编辑</el-link>
          </template>
        </el-table-column>
      </custom-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        class="listOptimizePage"
      ></el-pagination>
      <!-- 新增/编辑 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="700px" :close-on-click-modal="false" class="oil_add">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="top">
          <div style="display:flex;padding:10px 20px;border-radius:4px;background:#f5f5f5;color:#dd0000;margin-bottom:20px;" v-if="dialogTitle=='编辑'">编号：{{ruleForm.coreDeviceOilNumber}}</div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="行业" prop="industryCode">
                <el-cascader
                  v-if="dialogTitle == '新建'"
                  size="small"
                  style="width:280px"
                  v-model="ruleForm.industryCode"
                  :options="industryList"
                  :props="typeProps"
                  clearable
                  filterable
                  @change="industryChange"
                  ref="cascaderIndustry"
                ></el-cascader>
                <el-input v-else size="small" style="width:280px" v-model="ruleForm.industryCode" placeholder="请输入" :disabled="dialogTitle == '编辑'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车间/部门" prop="depName">
                <el-select size="small" v-model="ruleForm.depName" placeholder="请选择" clearable filterable @change="depNameChange" style="width:280px" :disabled="!ruleForm.industryCode" ref="selectDepName">
                  <el-option v-for="item in depList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备名称" prop="deviceName">
                <el-select size="small" v-model="ruleForm.deviceName" placeholder="请选择" clearable filterable @change="getMainLubPointList" style="width:280px" :disabled="!ruleForm.depName" ref="selectDeviceName">
                  <el-option v-for="item in deviceList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="主要润滑点" prop="mainLubPoint">
                <el-select size="small" v-model="ruleForm.mainLubPoint" placeholder="请选择" clearable filterable style="width:280px" :disabled="!ruleForm.deviceName" ref="selectMainLubPoint">
                  <el-option v-for="item in mainLubPointList" :key="item.id" :label="item.lubPointName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="润滑剂类型" prop="lubType">
                <el-input size="small" v-model="ruleForm.lubType" maxlength="100" type="textarea" :rows="2" clearable placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div style="margin:20px 0">
                <div style="display:flex;align-items:center"><span style="background:rgb(221,0,0);width:4px;height: 12px;display: inline-block;margin-right:10px"></span>润滑推荐</div>
                <div style="flex:1;margin-top:12px;padding:20px;border-radius:4px;display:flex;border:1px solid #e9e9e9;flex-direction:column;">
                  <div style="margin-bottom:20px;"><i class="el-icon-warning" style="margin-right:8px;font-size:18px;color:#f90"></i><span style="color:#f90">以下3个推荐油品，至少填1个</span></div>
                  <el-form ref="form" :inline="true" size="small" label-width="60px" class="inner_add">
                    <el-form-item label="合成油" prop="syntheticOil" class="oil_select_item">
                      <el-select size="small" v-model="ruleForm.syntheticOil" placeholder="请选择" @focus="getInputType('syntheticOil')" clearable filterable multiple remote :remote-method="(val)=>{getOilData(val, 'syntheticOil')}" :loading="loadingRemote" style="width:280px">
                        <el-option v-for="item in syntheticOilOption" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="润滑脂" prop="grease" class="oil_select_item">
                      <el-select size="small" v-model="ruleForm.grease" placeholder="请选择" @focus="getInputType('grease')" clearable filterable multiple remote :remote-method="(val)=>{getOilData(val, 'grease')}" :loading="loadingRemote" style="width:280px">
                        <el-option v-for="item in greaseOption" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="矿物油" prop="mineralOil" class="oil_select_item">
                      <el-select size="small" v-model="ruleForm.mineralOil" placeholder="请选择" @focus="getInputType('mineralOil')" clearable filterable multiple remote :remote-method="(val)=>{getOilData(val, 'mineralOil')}" :loading="loadingRemote" style="width:280px">
                        <el-option v-for="item in mineralOilOption" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="油箱容量参考值" prop="volume">
                <el-input size="small" v-model="ruleForm.volume" maxlength="100" type="textarea" :rows="2" clearable placeholder="请输入"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="ruleForm.status" @change="radioValidChange">
                  <el-radio :label="1">启用</el-radio>
                  <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="禁用原因" prop="remark" v-if="!ruleForm.status">
                <el-input size="small" v-model="ruleForm.remark" maxlength="50" clearable placeholder="请输入"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:right;">
          <el-button plain @click="handleCancle('ruleForm')" size="small">取消</el-button>
          <el-button type="danger" @click="handleSubmit('ruleForm')" size="small">保存</el-button>
        </div>
      </el-dialog>
      <!-- 导入文件弹框 -->
      <el-dialog :visible.sync="showImportFileFlag" width="400px" :close-on-click-modal="false" @close="cancelUploadFile('fileForm')">
        <div slot="title">
          <span>批量导入</span>
        </div>
        <el-form :model="fileForm" ref="fileForm" :rules="rules" style="padding: 0px 20px">
          <div class="flex-center" style="font-size: 14px; font-family: MicrosoftYaHei; margin-top:25px;text-align: center;">
            <div >第一步： 下载模板，按照模板格式填写</div>
            <el-link type="danger" :underline="false" @click="downloadTemplate" style="color: rgb(0, 20, 80);margin-top:25px;">下载模板（核心设备润滑油导入模板）</el-link>
          </div>
          <div class="flex-center" style="font-size: 14px; font-family: MicrosoftYaHei; margin-top:25px;text-align: center;">
            <span>第二步： 填写完模板后，上传Excel文件</span>
          </div>
          <el-form-item required style="margin-top: 20px">
            <el-upload
              class="upload-demo"
              action="uploadUrl"
              :auto-upload="false"
              accept=".xlsx"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :limit="1"
              :on-exceed="handleExceed"
              :on-change="handleFileChange"
              style="text-align: center;"
              :file-list="fileForm.fileList"
            >
              <el-button size="small">选择文件</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelUploadFile('fileForm')" size="small">取 消</el-button>
          <el-button type="danger" plain @click="submitFile('fileForm')" size="small">立即导入</el-button>
        </div>
      </el-dialog>
      <!-- 导入结果弹框 -->
      <el-dialog :visible.sync="showImportResultsFlag" width="35%" :close-on-click-modal="false">
        <div slot="title">
          <span>导入结果</span>
        </div>
        <div style="padding-left:30%;line-height:40px;margin-top:30px;">
          <div>本次导入数据共 {{ Number(importResult.addCount)+Number(importResult.errorCount) }} 条</div>
          <div style="color:#70B603">成功 {{ importResult.addCount }} 条</div>
          <div style="color:#ff0000">失败 {{ importResult.errorCount }} 条</div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeImportResult()" size="small">关闭</el-button>
          <el-button v-if="importResult.errorCount != 0" type="primary" @click="handleFailDetail()" size="small">失败详情</el-button>
        </div>
      </el-dialog>
      <!-- 失败详情弹框 -->
      <el-dialog :visible.sync="showFailDetailFlag" width="70%" :close-on-click-modal="false" style="padding-bottom:40px;">
        <div slot="title">
          <span>失败详情</span>
        </div>
        <div style="padding:0px 20px;">
          <!-- 表格 -->
          <el-table
            ref="customerTable"
            :key="key"
            row-key="id"
            :data="failDetailTableData"
            tooltip-effect="dark"
            max-height="500"
            style="width: 100%"
            :header-cell-style="{ background: '#f7f7f7' }"
            stripe
          >
            <el-table-column prop="index" label="第几行" min-width="15%" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" :show-overflow-tooltip="true" label="字段名称" min-width="30%"></el-table-column>
            <el-table-column prop="content" label="错误详情" min-width="40%" show-overflow-tooltip></el-table-column>
          </el-table>
          <el-pagination
            v-if="fDDataTotalNumber"
            background
            @size-change="handleSizeChangeFD"
            @current-change="handleCurrentChangeFD"
            :current-page="pagenationFD.current"
            :page-size="pagenationFD.size"
            :pager-count="4"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="fDDataTotalNumber"
            style="float: right; display: flex; margin-top: 10px;position: static;"
          ></el-pagination>
        </div>
        <div slot="footer" class="dialog-footer" style="margin-top:40px;">
          <el-button @click="closeFailDetail()" size="small">关闭</el-button>
        </div>
      </el-dialog>
      <!-- 操作历史 -->
    <el-dialog title="操作历史" :visible.sync="operationDialogFlag" :close-on-click-modal="false" custom-class="operation-content" width="60%">
      <el-table :data="historyTableData" tooltip-effect="dark" style="width: 100%;" :header-cell-style="{ background: '#f7f7f7' }" stripe>
        <el-table-column prop="actionType" label="操作类型" min-width="8%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="操作时间" min-width="12%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userName" label="操作人" min-width="8%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="content" label="明细" min-width="30%" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="operationSizeChange"
        @current-change="operationCurrentChange"
        :current-page="operationCurrent"
        :page-size="operationSize"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="operationTotalNumber"
        style="position: absolute;"
      ></el-pagination>
    </el-dialog>
    </div>
  </div>
</template>

<script>
import customField from "../tableComponents/customField.vue";
import customTable from "../tableComponents/customTable";
import columnHeader from "../tableComponents/headerComponent";
export default {
  data() {
    return {
      mineralOilOption: [],
      syntheticOilOption: [],
      greaseOption: [],
      selectType: '',
      loadingRemote: false,
      industryList: [], // 行业
      depList: [], // 车间/部门
      deviceList: [], // 设备
      mainLubPointList: [], // 主要润滑点
      typeProps: {
        value: 'code',
        label: 'name'
      },
      operationDialogFlag: false,
      loadingTransfer:false,
      customFieldlist: [],
      tableHeight: null,
      tableDataHeader: [
        { filterType: "selection", paramValue: "industryCode", changeValue:"", selectOptions: [], label: "行业", prop: "industryCode", width: "120", tooltip: true },
        { filterType: "", paramValue: "", changeValue:"", selectOptions: [], label: "车间/部门", prop: "depName", width: "120", tooltip: true },
        { filterType: "", paramValue: "", changeValue:"", selectOptions: [], label: "设备名称", prop: "deviceName", width: "120", tooltip: true },
        { filterType: "", paramValue: "", changeValue:"", selectOptions: [], label: "主要润滑点", prop: "mainLubPoint", width: "120", tooltip: true },
        { filterType: "selection", paramValue: "lubType", changeValue:"", selectOptions: [], label: "润滑剂类型", prop: "lubType", width: "120", tooltip: true },
        { filterType: "input", paramValue: "syntheticOilName", changeValue:"", label: "润滑推荐-合成油", prop: "syntheticOil", width: "150", tooltip: true },
        { filterType: "input", paramValue: "greaseName", changeValue:"", label: "润滑推荐-润滑脂", prop: "grease", width: "150", tooltip: true },
        { filterType: "input", paramValue: "mineralOilName", changeValue:"", label: "润滑推荐-矿物油", prop: "mineralOil", width: "150", tooltip: true },
        { label: "油箱容量参考值", prop: "volume", width: "120", tooltip: true },
        { filterType: "selection", paramValue: "status", changeValue:"", selectOptions:  [{ code: 1, name: "已启用" },{ code: 0, name: "已禁用" }], slot: "status", width: "100", tooltip: true },
        { slot: "operation", label: "操作" }
      ],
      mainminheight: `height:${document.documentElement.clientHeight - 130}px`,
      accountManageHeight: 0,
      formDivHeight: 0,
      pagenation: {
        current: 1,
        size: 10
      },
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      showImportFileFlag: false,
      totalNumber: 0, // 总条数
      lubriTableData: [], // 数据
      selectList: [],
      dialogFormVisible: false, // 新增对话框
      ruleForm: {
        codeDeviceOilNumber: "", // 核心设备润滑油编号
        industryCode: "", // 行业
        depName: "", // 车间/部门
        deviceName: "", // 设备名称
        mainLubPoint: "", // 主要润滑点
        lubType: "", // 润滑剂类型
        syntheticOil: "", // 合成油
        grease: "", // 润滑脂
        mineralOil: "", // 矿物油
        volume: "", // 油箱容量参考值
        remark: "", // 禁用原因
        status: 1
      },
      rules: {
        industryCode: [{ required: true, message: "请选择行业", trigger: "blur" }],
        depName: [{ required: true, message: "请选择车间/部门", trigger: "blur" }],
        deviceName: [{ required: true, message: "请选择设备名称", trigger: "blur" }],
        mainLubPoint: [{ required: true, message: "请选择主要润滑点", trigger: "blur" }],
        lubType: [{ required: true, message: "请输入润滑剂类型", trigger: "blur" }],
        remark: [{ required: true, message: "请输入禁用原因", trigger: "blur" }]
      },
      fileForm: {
        fileList: []
      },
      oilList: [], // 油品列表
      dialogTitle: "",
      loading: false, // 是否加载
      addFlag: 1, // 是否是新建弹窗
      isloading: false, // 上传文件按钮
      failDetailTableData: [], // 失败详情表格内容
      showImportResultsFlag: false, // 展示导入结果弹框
      failNum: true, // 如果有上传失败记录，显示失败详情按钮
      showFailDetailFlag: false, // 展示失败详情弹框
      viewImportHistory: false, // 导入历史弹框
      showChangeHistoryFlag: false, // 变更历史弹框
      importHistoryTableData: [], // 导入历史表格数据
      historyTableData: [],
      operationCurrent: 1,
      operationSize: 10,
      operationTotalNumber: 0,
      queryParams: {
      },
      fDDataTotalNumber: 0, // 失败详情列表总数
      iHDataTotalNumber: 0, // 导入历史表格总条数
      pageshow: true,
      pagenationFD: {
        //   失败详情列表分页参数
        current: 1,
        size: 10
      },
      pagenationIH: {
        //   导入历史列表分页参数
        current: 1,
        size: 10
      },
      arealist: [],
      toggleSelect: true,
      showValue: "",
      fileRom: "", // 批量导入上传得附件
      unSaveChangeCurrent: false,
      companyId: "",
      selectDeptId: [], // 选择的部门数组
      depart: false,
      importResult: {
        addCount: 0,
        errorCount: 0
      } // 导入结果
    };
  },
  components: {
    "custom-field": customField,
    "custom-table": customTable,
    "column-header":columnHeader,
  },
  computed: {},
  created() {},
  async mounted() {
    const res = await this.requestMethodGet('/core/device/oil/getCoreDeviceOilByKey', {searchKey:'lubType',size:1000,current:1})
    if(res.data.code==1000){
      let list = res.data.data.list
      list.forEach(item=>{
        item.code = item.value
        item.name = item.value
      })
      this.tableDataHeader[4].selectOptions=list
    } 
    this.$_getIndustryData();
    this.getIndustryAdd();
    this.handleTableHeight();
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 130}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
  },
  watch: {
    "ruleForm.syntheticOil"(newVal, oldVal) {
       if (newVal.length > 10) {
        this.$message({
          message: '最多支持选择10个',
          duration: 3000,
          type: 'warning'
        })
        this.$nextTick(() => {
          this.ruleForm.syntheticOil = oldVal;
        })
      }
    },
    "ruleForm.grease"(newVal, oldVal) {
       if (newVal.length > 10) {
        this.$message({
          message: '最多支持选择10个',
          duration: 3000,
          type: 'warning'
        })
        this.$nextTick(() => {
          this.ruleForm.grease = oldVal;
        })
      }
    },
    "ruleForm.mineralOil"(newVal, oldVal) {
       if (newVal.length > 10) {
        this.$message({
          message: '最多支持选择10个',
          duration: 3000,
          type: 'warning'
        })
        this.$nextTick(() => {
          this.ruleForm.mineralOil = oldVal;
        })
      }
    }
  },
  methods: {
    async tableTitleSearch(obj){
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      if((obj.paramValue=='industryCode'||obj.paramValue=='depName')){
        if(obj.paramValue=='industryCode'){
          this.tableDataHeader[1].selectOptions=[]
          this.tableDataHeader[1].filterType=''
          this.tableDataHeader[1].changeValue=''
          this.tableDataHeader[1].paramValue=''
          this.tableDataHeader[2].selectOptions=[]
          this.tableDataHeader[2].filterType=''
          this.tableDataHeader[2].changeValue=''
          this.tableDataHeader[2].paramValue=''
          this.tableDataHeader[3].selectOptions=[]
          this.tableDataHeader[3].filterType=''
          this.tableDataHeader[3].changeValue=''
          this.tableDataHeader[3].paramValue=''
          this.queryParams.industryCode = ''
          this.queryParams.depName=''
          this.queryParams.deviceName=''
          this.queryParams.mainLubPoint=''
          if(searchVal.length==0){
            this.pagenation.current = 1;
            this.$_queryLubriList()
            return
          }
        }
        if(obj.paramValue=='depName'){
          this.tableDataHeader[2].selectOptions=[]
          this.tableDataHeader[2].filterType=''
          this.tableDataHeader[2].changeValue=''
          this.tableDataHeader[2].paramValue=''
          this.tableDataHeader[3].selectOptions=[]
          this.tableDataHeader[3].filterType=''
          this.tableDataHeader[3].changeValue=''
          this.tableDataHeader[3].paramValue=''
          this.queryParams.depName=''
          this.queryParams.deviceName=''
          this.queryParams.mainLubPoint=''
          if(!searchVal){
            this.pagenation.current = 1;
            this.$_queryLubriList()
            return
          }
        }
        let url = obj.paramValue=='industryCode'?'/core/device/oil/getExistDepName':'/core/device/oil/getExistDeviceName'
        let paramObj = {name:searchVal,size:1000,current:1}
        if(obj.paramValue=='depName'){
          paramObj.parentName = this.tableDataHeader[0].changeValue
        }
        const res = await this.requestMethodPost(url, paramObj)
        if(res.data.code==1000){
          res.data.data.list.forEach(item=>{
            item.code=item.name
          })
          if(obj.paramValue=='industryCode'){
            this.tableDataHeader[1].selectOptions=res.data.data.list
            this.tableDataHeader[1].paramValue = 'depName'
            this.queryParams[obj.paramValue] = searchVal
            if(this.tableDataHeader[0].changeValue) this.tableDataHeader[1].filterType = 'selection'
          }else if(obj.paramValue=='depName'){
            this.tableDataHeader[2].selectOptions=res.data.data.list
            this.tableDataHeader[2].paramValue = 'deviceName'
            if(this.tableDataHeader[1].selectOptions.length>0){
              this.tableDataHeader[1].selectOptions.forEach(item=>{
                if(item.code==searchVal) this.queryParams[obj.paramValue] = item.name
              })
            }else{
             this.queryParams[obj.paramValue] = ''
            }
            if(this.tableDataHeader[1].changeValue) this.tableDataHeader[2].filterType = 'selection'
          }
        }
      }else if(obj.paramValue=='deviceName'){
        this.tableDataHeader[3].selectOptions=[]
        this.tableDataHeader[3].filterType=''
        this.tableDataHeader[3].changeValue=''
        this.tableDataHeader[3].paramValue=''
        this.queryParams.deviceName=''
        this.queryParams.mainLubPoint=''
        if(!searchVal) {
          this.pagenation.current = 1;
          this.$_queryLubriList()
          return
        }
        const res = await this.requestMethodPost('/core/device/oil/getExistMainLubPoint', {firstName:this.tableDataHeader[0].changeValue,parentName:this.tableDataHeader[1].changeValue,name:searchVal,size:1000,current:1})
        if(res.data.code==1000){
          let dataList = []
          res.data.data.list.forEach(item=>{
            dataList.push({code:item.name})
          })
          this.tableDataHeader[3].selectOptions=dataList
          this.tableDataHeader[3].paramValue='mainLubPoint'
          if(this.tableDataHeader[2].selectOptions.length>0){
            this.tableDataHeader[2].selectOptions.forEach(item=>{
              if(item.code==searchVal) this.queryParams[obj.paramValue] = item.name
            })
          }else{
            this.queryParams[obj.paramValue] = ''
          }
        }
        if(this.tableDataHeader[2].changeValue) this.tableDataHeader[3].filterType = 'selection'
      }else if(obj.paramValue=='mainLubPoint'&&searchVal){
        if(this.tableDataHeader[3].selectOptions.length>0){
          this.tableDataHeader[3].selectOptions.forEach(item=>{
            if(item.code==searchVal) this.queryParams[obj.paramValue] = item.name
          })
        }else{
          this.queryParams[obj.paramValue] = ''
        }
      }else{
        this.queryParams[obj.paramValue] = obj.changeValue
      }
      this.pagenation.current = 1;
      this.$_queryLubriList()
    },
    async getMainLubPointList() {
      this.ruleForm.mainLubPoint = ''
      const params = {
        deviceCode:this.ruleForm.deviceName,
        lubPointName:'',
        status:1,
        current:1,
        size:100
      }
      this.requestMethodGet('/device/coreDeviceLubPoint/pageList',params).then(res=>{
        if(res.data.code == 1000){
          const data = res.data.data.list || []
          this.mainLubPointList = data
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    depNameChange() {
      this.deviceList = []
      this.mainLubPointList = []
      this.ruleForm.deviceName = ""
      this.ruleForm.mainLubPoint = ""
      this.getDeviceType(this.ruleForm.depName, 'depName')
    },
    industryChange() {
      this.depList = []
      this.deviceList = []
      this.mainLubPointList = []
      this.ruleForm.depName = ""
      this.ruleForm.deviceName = ""
      this.ruleForm.mainLubPoint = ""
      if(this.ruleForm.industryCode.length>0){
        this.getDeviceType(this.ruleForm.industryCode[1], 'industry')
      }
    },
    async getDeviceType(val, type) {
      let params = {size:5000,current:1}
      if(val){
        params.code = val
      }
      this.requestMethodGet('/core/device/oil/getDeviceType', params)
        .then((res) => {
          res = res.data
          if (res.code == 1000) {
            if(type=='depName'){
              this.deviceList = res.data.list
            }else{
              this.depList = res.data.list
            }
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {})
    },
    // 获取行业列表
    $_getIndustryData () {
      this.requestMethodPost('/core/device/oil/getExistIndustryCode', {name:'',size:1000,current:1}).then((res) => {
        res = res.data;
        if (res.code == 1000) {
          let industryList = []
          if (res.data && res.data.list.length > 0) {
            res.data.list.forEach(item=>{
              industryList.push({code: item.name,name:item.name})
            })
          }
          this.tableDataHeader[0].selectOptions = industryList
          this.$_queryLubriList(); // 获取列表
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
          });
        }
      });
    },
    getIndustryAdd() {
      this.requestMethodGet("weChat/device/queryAllDeviceTypeTree4", {filterFlag:true}).then((res) => {
        res = res.data;
        if (res.code == 1000) {
          if (res.data && res.data.length > 0) {
            res.data.forEach(item=>{
              if(item.children.length>0){
                item.children.forEach(it=>{
                  it.children=null
                })
              }
            })
            this.industryList = res.data;
          }
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
          });
        }
      });
    },
    // 下载模板
    downloadTemplate() {
      this.requestMethodGet("/web/file/getFullDownloadUrl", { url: "core_device_oil/template.xlsx" }).then(res => {
        if (res.data.code == 1000) {
          window.location.href=res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        if (document.getElementById("accountManage")) {
          this.accountManageHeight = document.getElementById("accountManage").clientHeight;
        }
        if (document.getElementById("formDiv")) {
          this.formDivHeight = document.getElementById("formDiv").clientHeight;
        }
        this.tableHeight = Number(this.accountManageHeight) - Number(this.formDivHeight) - 90;
      }, 200);
    },
    // 自定义字段
    getCustomFields(data) {
      this.customFieldlist = data;
      let tableDataHeader = [];
      data.forEach(item => {
        if (item.visible != 0) {
          tableDataHeader.push(this.tableDataHeaderInit[item.fieldName]);
        }
      });
      if (this.tableDataHeaderInit.selection) {
        tableDataHeader.unshift(this.tableDataHeaderInit.selection);
      }
      this.tableDataHeader = tableDataHeader;
    },
    greaseChange(val) {
      if (val) {
        this.ruleForm.grease = val[val.length - 1];
      }else{
        this.ruleForm.grease = ""
      }
    },
    syntheticOilChange(val) {
    },
    mineralOilChange(val) {
      if (val) {
        this.ruleForm.mineralOil = val[val.length - 1];
      }else{
        this.ruleForm.mineralOil = ""
      }
    },
    getInputType(type) {
      this.selectType = type
    },
    getOilData(val,type){
      if(type=='syntheticOil'){
        this.syntheticOilOption = []
      }else if(type=='grease'){
        this.greaseOption = []
      }else if(type=='mineralOil'){
        this.mineralOilOption = []
      }else{
        this.mineralOilOption = []
        this.syntheticOilOption = []
        this.greaseOption = []
      }
      this.loadingRemote = true
      this.requestMethodGet("/mdm/oil/queryOilListByPage",{oilName:val,parentCode:'oil_0001',status:1, size:200, current:1})
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.loadingRemote = false
            if(type=='syntheticOil'){
              this.syntheticOilOption = res.data.list
            }else if(type=='grease'){
              this.greaseOption = res.data.list
            }else if(type=='mineralOil'){
              this.mineralOilOption = res.data.list
            }else{
              this.mineralOilOption = this.syntheticOilOption = this.greaseOption = res.data.list
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
    formatData(data) {
      for (var i = 0; i < data.length; i++) {
        if (!data[i].children || data[i].children.length == 0) {
          data[i].children = null;
        } else {
          this.formatData(data[i].children);
        }
      }
      return data;
    },
    // 排序类型
    changeSortType(data) {
      this.sortType = data;
      this.pagenation.current = 1;
      this.$_queryLubriList();
    },
    changeSortMethod(data) {
      this.sortMethod = data;
      this.pagenation.current = 1;
      this.$_queryLubriList();
    },
    // 获取列表
    $_queryLubriList() {
      this.loading = true;
      let params = { ...this.queryParams, ...this.pagenation };
      this.lubriTableData = [];
      this.requestMethodGet("/core/device/oil/getCoreDeviceOilConf", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            const data = res.data.list;
            this.lubriTableData = data;
            this.totalNumber = res.data.totalCount;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    // 查询
    handleSearchTableData() {
      this.pagenation.current = 1;
      this.$_queryLubriList();
    },
    // 重置
    handleClearSearch() {
      this.queryParams = {
        industryCode: "",
        depName: "",
        deviceName: "",
        mainLubPoint: "",
        lubType: "",
        syntheticOilName: "",
        greaseName: "", 
        mineralOilName: "", 
        status: "" 
      };
      this.pagenation = {
        current: 1,
        size: 10
      };
      this.tableDataHeader[1].selectOptions = []
      this.tableDataHeader[1].filterType = ''
      this.tableDataHeader[1].paramValue = ''
      this.tableDataHeader[2].selectOptions = []
      this.tableDataHeader[2].filterType = ''
      this.tableDataHeader[2].paramValue = ''
      this.tableDataHeader[3].selectOptions = []
      this.tableDataHeader[3].filterType = ''
      this.tableDataHeader[3].paramValue = ''
      this.tableDataHeader.forEach(item=>{
        item.changeValue=""
      })
      this.$_queryLubriList();
    },
    // 新建
    handleAdd() {
      this.dialogFormVisible = true;
      this.dialogTitle = "新建";
      this.ruleForm = {
        industryCode: "", // 行业
        depName: "", // 车间/部门
        deviceName: "", // 设备名称
        mainLubPoint: "", // 主要润滑点
        lubType: "", // 润滑剂类型
        syntheticOil: "", // 合成油
        grease: "", // 润滑脂
        mineralOil: "", // 矿物油
        volume: "", // 油箱容量参考值
        remark: "", // 禁用原因
        status: 1
      };
      this.getOilData('', '');
    },
    fromDeptTree(array, selects) {
      var items = [];
      if (selects) {
        for (var i = 0; i < selects.length; i++) {
          var item = this.recursionDept(array, selects[i]);
          items.push(item);
        }
      } else {
        items = [];
      }
      return items;
    },
    recursionDept(array, id) {
      if (array) {
        for (var i = 0; i < array.length; i++) {
          if (array[i].id == id) {
            var items = [];
            items.unshift(id);
            return items;
          } else {
            if (array[i].childrens) {
              var res = this.recursionDept(array[i].childrens, id);
              if (res) {
                res.unshift(array[i].id);
                return res;
              }
            }
          }
        }
      }
    },
    // 编辑
    async handleEdit(row) {
      this.dialogTitle = "编辑";
      this.rules.depName[0].required = false;
      this.handleIndustryLevel2Code(row.industryCode)
      this.ruleForm = {
        id: row.id,
        coreDeviceOilNumber: row.coreDeviceOilNumber,
        industryCode: row.industryCode, // 行业
        depName: row.depName, // 车间/部门
        deviceName: row.deviceName, // 设备名称
        mainLubPoint: row.mainLubPoint, // 主要润滑点
        lubType: row.lubType, // 润滑剂类型
        syntheticOil: row.syntheticOilCode?row.syntheticOilCode.split(","):"", // 合成油
        grease: row.greaseCode?row.greaseCode.split(","):"", // 润滑脂
        mineralOil: row.mineralOilCode?row.mineralOilCode.split(","):"", // 矿物油
        volume: row.volume, // 油箱容量参考值
        remark: row.remark, // 禁用原因
        status: row.status
      }
      let mineralOilList = []
      let syntheticOilList = []
      let greaseList = []
      if(row.mineralOilCode){
        let names = row.mineralOil.includes(',')?row.mineralOil.split(','):[row.mineralOil]
        let codes = row.mineralOilCode.includes(',')?row.mineralOilCode.split(','):[row.mineralOilCode]
        names.forEach((itemA,indexA)=>{
          codes.forEach((itemB,indexB)=>{
            if(indexA==indexB) mineralOilList.push({code:itemB, oilAlias:itemA})
          })
        })
      }
      if(row.syntheticOilCode){
        let names = row.syntheticOil.includes(',')?row.syntheticOil.split(','):[row.syntheticOil]
        let codes = row.syntheticOilCode.includes(',')?row.syntheticOilCode.split(','):[row.syntheticOilCode]
        names.forEach((itemA,indexA)=>{
          codes.forEach((itemB,indexB)=>{
            if(indexA==indexB) syntheticOilList.push({code:itemB, oilAlias:itemA})
          })
        })
      }
      if(row.greaseCode){
        let names = row.grease.includes(',')?row.grease.split(','):[row.grease]
        let codes = row.greaseCode.includes(',')?row.greaseCode.split(','):[row.greaseCode]
        names.forEach((itemA,indexA)=>{
          codes.forEach((itemB,indexB)=>{
            if(indexA==indexB) greaseList.push({code:itemB, oilAlias:itemA})
          })
        })
      }
      this.dialogFormVisible = true;
      this.requestMethodGet("/mdm/oil/queryOilListByPage",{oilName:'',parentCode:'oil_0001',status:1, size:200, current:1})
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.mineralOilOption = res.data.list.concat(mineralOilList)
            this.syntheticOilOption = res.data.list.concat(syntheticOilList)
            this.greaseOption = res.data.list.concat(greaseList)
            // 去重
            this.mineralOilOption = _.unionWith(this.mineralOilOption,(item1, item2) => {
              return item1.code == item2.code
            })
            this.syntheticOilOption = _.unionWith(this.syntheticOilOption,(item1, item2) => {
              return item1.code == item2.code
            })
            this.greaseOption = _.unionWith(this.greaseOption,(item1, item2) => {
              return item1.code == item2.code
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
    takeOutDeduplicate(str) {
      console.log('str',str)
      let result=[];
      let obj={};
      for(let i=0;i<str.Length;i++){
      if(!obj[str[i].code]){
          result.push(str[i]);
          obj[str[i].code]=true;
          }
      }
      console.log(result)
      return result
    },
    handleIndustryLevel2Code(industryCode) {
      this.requestMethodPost('/core/device/oil/getIndustryLevel2Code', { fullIndustryName:industryCode }).then((res) => {
        res = res.data;
        if (res.code == 1000) {
          this.getDeviceType(res.data, 'industry')
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
          });
        }
      });
    },
    // 新增保存
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$nextTick(()=>{
            let param = JSON.parse(JSON.stringify(this.ruleForm))
            let industryName = ""
            if(this.dialogTitle=='编辑'){
              industryName = param.industryCode
            }else{
              industryName = this.$refs.cascaderIndustry.getCheckedNodes()[0].pathLabels.join("/");
            }
            let selectMainLubPoint = this.$refs.selectMainLubPoint.selectedLabel
            let selectDeviceName = this.$refs.selectDeviceName.selectedLabel
            let selectDepName = this.$refs.selectDepName.selectedLabel
            param.syntheticOil = param.syntheticOil==""?"":param.syntheticOil.join(",")
            param.grease = param.grease==""?"":param.grease.join(",")
            param.mineralOil = param.mineralOil==""?"":param.mineralOil.join(",")
            param.industryCode = industryName
            param.depName = selectDepName
            param.deviceName = selectDeviceName
            param.mainLubPoint = selectMainLubPoint
            if((!param.syntheticOil)&&(!param.grease)&&(!param.mineralOil)) {
              this.$message({
                message: "合成油、润滑脂，矿物油，至少填一个",
                type: "error"
              });
              return
            }
            param.remark = param.status==1?"":param.remark
            this.$confirm("是否保存?", "提示", {
              confirmButtonText: "是",
              cancelButtonText: "否",
              type: "warning"
            })
              .then(() => {
                let url = "/core/device/oil/addCoreDeviceOil"
                if(this.dialogTitle=='编辑') url="/core/device/oil/editCoreDeviceOil"
                this.requestMethodPost(url, param)
                  .then(async res => {
                    res = res.data;
                    if (res.code == 1000) {
                      this.$message({
                        message: "保存成功",
                        type: "success"
                      });
                      this.pagenation.current = 1;
                      this.dialogFormVisible = false;
                      const resLubType= await this.requestMethodGet('/core/device/oil/getCoreDeviceOilByKey', {searchKey:'lubType',size:1000,current:1})
                      if(resLubType.data.code==1000){
                        let list = resLubType.data.data.list
                        list.forEach(item=>{
                          item.code = item.value
                          item.name = item.value
                        })
                        this.tableDataHeader[4].selectOptions=list
                      }
                      this.$_getIndustryData();
                    } else {
                      this.$message({
                        message: res.msg,
                        type: "warning"
                      });
                    }
                  })
                  .catch(res => {
                    console.log(res);
                  });
              }).catch(() => {});
          })
        } else {
          return false;
        }
      });
    },
    // 新增取消
    handleCancle(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    // page change  事件
    handleCurrentChange(page) {
      this.pagenation.current = page;
      this.$_queryLubriList(); // 获取日志列表
    },
    // size change 事件
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.$_queryLubriList(); // 获取短信日志列表
    },
    // 表格多选事件
    handleSelectionChange(select) {
      this.selectList = [];
      select.forEach(item => {
        this.selectList.push(item.email);
      });
    },
    handleCurrentChangeRow(row, event, column) {},
    // 导入excel表格
    importFile() {
      this.showImportFileFlag = true;
    },
    // 文件上传删除前置
    beforeRemove(file) {
      if (file.size > 100 * 1024 * 1024) {
        this.$message.error("上传文件大小不能超过 100MB!");
        return false; // 必须返回false
      }
    },
    // 文件上传超出限制
    handleExceed(files, fileList) {
      this.$message.error(`最多上传 1 个文件`);
    },
    // 文件上传删除
    handleRemove(file, fileList) {
      this.fileForm.fileList = [];
    },
    // 文件上传改变
    handleFileChange(file, fileList) {
      this.fileForm.fileList = fileList;
      this.fileRom = file.raw;
    },
    // 弹框取消
    cancelUploadFile(formName) {
      this.fileForm.fileList = [];
      this.$refs[formName].resetFields();
      this.showImportFileFlag = false;
    },
    // 导入表格点击立即导入
    submitFile(formName) {
      if (this.fileForm.fileList.length === 0) {
        this.$message.error("请上传文件");
      } else {
        this.isloading = true;
        var params = new FormData();
        params.append("file", this.fileRom);
        this.requestMethodPost("/core/device/oil/importCoreDeviceOil", params)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              this.$_queryLubriList();
              // 导入成功
              this.isloading = false;
              this.importResult.addCount = res.data.addCount;
              this.importResult.errorCount = res.data.errorCount;
              this.failDetailTableData = res.data.importErrors
              this.showImportResultsFlag = true;
              this.showImportFileFlag = false;
              this.fileForm.fileList = [];
              this.$refs[formName].resetFields();
            } else {
              this.isloading = false;
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {});
      }
    },
    // 关闭导入结果弹框
    closeImportResult() {
      this.showImportResultsFlag = false; // 关闭导入结果弹框
    },
    // 关闭失败详情弹框
    closeFailDetail() {
      this.showFailDetailFlag = false;
    },
    // 点击失败详情
    handleFailDetail() {
      this.showFailDetailFlag = true; // 失败详情弹框展示
      this.showImportResultsFlag = false; // 关闭导入结果弹框
      // this.getFailByPage(); // 获取失败数据
    },
    // 获取失败数据
    getFailByPage() {
      this.loading = true;
      let params = { uniqueCode: this.importResult.uniqueCode, ...this.pagenationFD };
      this.requestMethodGet("/web/system/permission/userManage/importUserExcelError", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.failDetailTableData = res.data.list;
            this.fDDataTotalNumber = res.data.totalCount;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    // 点击查看导入历史
    handleViewImportHistory() {
      this.viewImportHistory = true;
      this.getImportHistoryData();
    },
    // 获取导入历史数据
    getImportHistoryData() {
      this.loading = true;
      let params = { ...this.pagenationIH };
      this.requestMethodGet("/web/sys/conf/msla/queryImportRecordByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.importHistoryTableData = res.data.list;
            this.iHDataTotalNumber = res.data.totalCount;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    // 操作历史
    operationHistory() {
      this.getOperationData();
      this.operationDialogFlag = true;
    },
    operationSizeChange(e) {
      this.operationCurrent = 1;
      this.operationSize = e;
      this.getOperationData();
    },
    operationCurrentChange(e) {
      this.operationCurrent = e;
      this.getOperationData();
    },
    //  失败详情列表 size change
    handleSizeChangeFD(size) {
      this.pagenationFD.size = size;
      this.pagenationFD.current = 1;
      this.getFailByPage(); // 获取失败数据
    },
    // current change
    handleCurrentChangeFD(current) {
      this.pagenationFD.current = current;
      this.getFailByPage(); // 获取失败数据
    },
    //  导入历史列表 size change
    handleSizeChangeIH(size) {
      this.pagenationIH.size = size;
      this.pagenationIH.current = 1;
      this.getImportHistoryData();
    },
    // current change
    handleCurrentChangeIH(current) {
      this.pagenationIH.current = current;
      this.getImportHistoryData();
    },
    // 获取操作历史数据
    getOperationData() {
      let params = {};
      params.current = this.operationCurrent;
      params.size = this.operationSize;
      this.requestMethodGet("/core/device/oil/getCoreDeviceOilHistory", params).then(res => {
        if (res.data.code == 1000) {
          let hisList = res.data.data.list;
            hisList.forEach(item=>{
              if(item.action==1){
                this.$set(item, 'actionType' ,'批量导入')
              }else if(item.action==2){
                this.$set(item, 'actionType' ,'单个新增')
              }else if(item.action==3){
                this.$set(item, 'actionType' ,'编辑')
              }
            })
          this.historyTableData = hisList;
          this.operationTotalNumber = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.handleTableHeight();
    });
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/customTable.less";
.account-management {
  padding: 0 20px;
  height: 100%;
  overflow: auto;
  &-serach-item {
    margin-bottom: 10px;
    label {
      padding-bottom: 10px;
    }
  }
}
.confirm-tips {
  padding: 16px 24px;
  background: rgba(204, 221, 255, 0.2);
  border: 1px solid rgba(204, 221, 255, 0.4);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  .img_div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .img_text {
      font-size: 14px;
      color: #000;
      margin-top: 8px;
    }
  }
}
.tips_text {
  font-weight: 400;
  font-size: 14px;
  color: #000;
}
/deep/.operation-content {
  padding-bottom: 45px;
}
</style>
<style lang="less">
.oil_select_item {
  width: 100%;
  .el-form-item__content{
    width: 70% !important;
    .el-select--small{
      width: 100% !important;
    }
  }
}
.oil_add .el-form-item__label {
  margin-bottom: 10px;
}
.inner_add .el-form-item__label {
  margin-bottom: 0px;
}
.account-management .el-form--label-top .el-form-item__label {
  padding: 0 !important;
}
.deletBtn .el-button--primary {
  background-color: #fe000c !important;
  border-color: #fe000c !important;
}
.deletBtn .el-message-box__container {
  position: relative;
}
.deletBtn .el-icon-warning {
  color: #fe000c !important;
}
.deletBtn .el-message-box__message {
  word-break: break-all !important;
}
.el-radio__input.is-checked .el-radio__inner {
  background: #001450 !important;
  border-color: #001450 !important;
}
.el-radio__input.is-checked + .el-radio__label {
  color: #001450 !important;
}
</style>
