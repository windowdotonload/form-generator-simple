<template>
  <div style="position: relative">
    <div class="english-translation" :style="mainminheight" id="translationDiv">
      <div class="toolbox-con flexBetween">
        <!-- 查询条件 -->
        <el-form ref="form" :model="queryParams" :inline="true" size="small" id="searchForm">
          <el-form-item>
            <el-button size="small" @click="handleClearSearch">重置</el-button>
          </el-form-item>
          <el-form-item>
            MSLA数据最近更新时间：{{lastedPullMslaTime}}
          </el-form-item>
        </el-form>
        <div class="tool-con">
          <el-button plain v-has='ETDownLoadBtn' @click="exportData" size="small">批量导出</el-button>
          <el-button plain v-has='ETUpLoadBtn' @click="importFile" size="small">批量导入</el-button>
          <el-button type="danger" plain v-has='ETHistoryBtn' @click="handleChangeHistory" size="small">变更历史</el-button>
          <el-button type="danger" @click="handleRefresh" v-has='ETUpdataBtn' size="small">更新MSLA数据</el-button>
          <el-button type="danger" v-if="editBtn" v-has='ETEditBtn' @click="handleEdit" size="small">编辑</el-button>
          <el-button type="danger" v-has='ETEditBtn' v-if="saveBtn" @click="handleSave" size="small">保存</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <el-form :model="chineseListForm" ref="chineseListForm" :rules="chineseListFormRules">
        <el-table
        :height="tableHeight"
        v-loading="loading"
        ref="customerTable"
        :key="tableKey"
        row-key="id"
        :data="chineseListForm.translationTableData"
        tooltip-effect="dark"
        style="width: 100%;"
        stripe
        header-row-class-name="table_header_class"
        element-loading-text="加载中..."
        border
        >
        <el-table-column prop="lubricationPointNames" label="润滑部件/元件1层" min-width="10%" show-overflow-tooltip>
          <template slot="header">
            <column-header 
            title="润滑部件/元件1层"
            filterType="selection"
            paramValue="lubricationPointType"
            :changeValue="queryParams.lubricationPointType"
            :selectOptions="tableDataHeader[0].selectOptions"
            @chSubmit="tableTitleSearch"/>
          </template>
        </el-table-column>
        <el-table-column
            prop="assetClassNameCn"
            label="MSLA Asset class名称"
            min-width="10%"
            show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="fieldTitleCn" :show-overflow-tooltip="true" label="类型" min-width="10%">
          <template slot="header">
            <column-header 
            title="类型"
            filterType="selection"
            paramValue="assetClassFieldTitleEn"
            :changeValue="queryParams.assetClassFieldTitleEn"
            :selectOptions="tableDataHeader[2].selectOptions"
            @chSubmit="tableTitleSearch"/>
          </template>
        </el-table-column>
        <el-table-column prop="listItemValue" label="英文名称" min-width="15%" show-overflow-tooltip>
          <template slot="header">
            <column-header 
            title="英文名称"
            filterType="input"
            paramValue="listItemValue"
            :changeValue="queryParams.listItemValue"
            @chSubmit="tableTitleSearch"/>
          </template>
        </el-table-column>
        <el-table-column prop="listItemValueCn" label="中文翻译" min-width="15%" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="!scope.row.editing">
                <span :style="{color: scope.row.assetClassStatus==-1 ?'#999':'#606266'}" >{{scope.row.listItemValueCn || '-'}}</span>
              </div>
              <div v-else>
                <span v-if="scope.row.assetClassStatus==-1" style="color:#999;" >{{scope.row.listItemValueCn || '-'}}</span>
                <el-form-item v-else :prop="'translationTableData.' + scope.$index + '.listItemValueCn'">
                  <el-input size="mini" style="width:60%" :disabled='scope.row.state == -1 ? true :false'  v-model="scope.row.listItemValueCn"  maxlength="25"  @change="changeChineseName(scope.row)"  placeholder="最多输入25字符"></el-input>
                </el-form-item>
              </div>
            </template>
        </el-table-column>
        <el-table-column prop="assetClassStatusDesc" label="状态" min-width="6%" show-overflow-tooltip>
          <template slot="header">
            <column-header 
            title="状态"
            filterType="selection"
            paramValue="assetClassStatus"
            :changeValue="queryParams.assetClassStatus"
            :selectOptions="tableDataHeader[5].selectOptions"
            @chSubmit="tableTitleSearch"/>
          </template>
          <template slot-scope="scope">
            <span style="color:#70b603;" v-if="scope.row.assetClassStatusDesc=='已维护'">{{scope.row.assetClassStatusDesc}}</span>
            <span style="color:#f56c6c;" v-else-if="scope.row.assetClassStatusDesc=='待维护'">{{scope.row.assetClassStatusDesc}}</span>
            <span style="color:#666666;" v-else>{{scope.row.assetClassStatusDesc}}</span>
          </template>
        </el-table-column>
        <template slot="empty">
          <div style="font-size: 13px;line-height: 21px;color: #999;">
            <img src="../../assets/pes_empty.png" style="width: 160px;height: 160px;" alt="" />
            <div>暂无数据</div>
          </div>
        </template>
        </el-table>
        <div v-if="pageshow">
            <el-pagination
            v-if="eTDataTotalNumber"
            background
            @size-change="handleSizeChangeET"
            @current-change="handleCurrentChangeET"
            :current-page="pagenationET.current"
            :page-size="pagenationET.size"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="eTDataTotalNumber"
            class="listOptimizePage"
            ></el-pagination>
        </div>
        </el-form>
      <!-- 导入文件弹框 -->
        <el-dialog
        :visible.sync="showImportFileFlag"
        width="45%"
        :close-on-click-modal="false"
        @close='cancelUploadFile("fileForm")'
        >
        <div slot="title">
            <span>导入表格</span>
        </div>
        <el-form
            :model="fileForm"
            ref="fileForm"
            :rules="rules"
            style="padding: 40px 20px"
            label-width="100px"
            label-position="left"
        >
            <div style="float:right;">
                <el-button
                type="primary"
                plain
                @click="handleViewImportHistory"
                size="small"
                >查看导入历史</el-button
                >
            </div>
            <el-form-item   style="margin-top:40px;">
            <el-upload
                drag
                action="uploadUrl"
                :auto-upload="false"
                accept=".xls, .xlsx"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :limit="1"
                :on-exceed="handleExceed"
                :on-change="handleFileChange"
                :file-list="fileForm.fileList"
            >
                <div>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">点击或将表格拖拽到这里上传</div>
                </div>
            </el-upload>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelUploadFile('fileForm')">取 消</el-button>
            <el-button type="primary" :loading="isloading"  @click="submitFile('fileForm')"
            >{{isloading?'正在上传文件，请稍等':'确认上传'}}</el-button
            >
        </div>
        </el-dialog>
        <!-- 导入结果弹框 -->
        <el-dialog
        :visible.sync="showImportResultsFlag"
        width="35%"
        :close-on-click-modal="false"
        >
        <div slot="title">
            <span>导入结果</span>
        </div>
        <div style="padding-left:30%;line-height:40px;margin-top:30px;">
            <div>本次导入数据共 {{importResult.totalNum}} 条</div>
            <div style="color:#70B603">已修改{{importResult.changeNum}}条</div>
            <div style="color:#70B603">未变化{{importResult.noChangeNum}}条</div>
            <div style="color:#ff0000">失败{{importResult.failedNum}}条</div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeImportResult()">关闭</el-button>
            <el-button  v-if="importResult.failedNum != 0" type="primary" @click="handleFailDetail()"
            >失败详情</el-button
            >
        </div>
        </el-dialog>
        <!-- 失败详情弹框 -->
        <el-dialog
        :visible.sync="showFailDetailFlag"
        width="50%"
        :close-on-click-modal="false"
        style="padding-bottom:40px;"
        >
        <div slot="title">
            <span>失败详情</span>
        </div>
        <div style="padding:20px 60px;">
            <!-- 表格 -->
        <el-table
        ref="customerTable"
        :key="key"
        row-key="id"
        :data="failDetailTableData"
        tooltip-effect="dark"
        max-height="400"
        style="width: 100%"
        :header-cell-style="{ background: '#f7f7f7' }"
        stripe
        >
        <el-table-column
            prop="excelRowNum"
            label="第几行"
            min-width="15%"
            show-overflow-tooltip
        ></el-table-column>
        <el-table-column
            prop="excelColumnName"
            :show-overflow-tooltip="true"
            label="字段名称"
            min-width="30%"
        ></el-table-column>
        <el-table-column
            prop="errMsg"
            label="错误详情"
            min-width="40%"
            show-overflow-tooltip
        ></el-table-column>
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
        style="float: right; display: flex; margin-top: 10px"
        ></el-pagination>
        </div>
        <div slot="footer" class="dialog-footer" style="margin-top:40px;">
            <el-button @click="closeFailDetail()">关闭</el-button>
            <el-button type="primary" @click="downLoadFalDetail()"
            >导出失败详情</el-button
            >
        </div>
        </el-dialog>
        <!-- 导入历史弹框 -->
        <el-dialog
        :visible.sync="viewImportHistory"
        width="55%"
        style="padding-bottom:40px;"
        :close-on-click-modal="false"
        >
        <div slot="title">
            <span>导入历史</span>
        </div>
        <div style="padding:20px 60px;">
            <!-- 表格 -->
        <el-table
        ref="customerTable"
        :key="key"

        row-key="id"
        :data="importHistoryTableData"
        tooltip-effect="dark"
        style="width: 100%"
        max-height="400"
        :header-cell-style="{ background: '#f7f7f7' }"
        stripe
        >
        <el-table-column
            prop="fileName"
            label="表格名称"
            min-width="30%"
            show-overflow-tooltip
        ></el-table-column>
        <el-table-column
            prop="createTime"
            :show-overflow-tooltip="true"
            label="导入时间"
            min-width="30%"
        ></el-table-column>
        <el-table-column
            prop="createUser"
            label="操作人"
            min-width="20%"
            show-overflow-tooltip
        ></el-table-column>
        <el-table-column  min-width="20%" align="center">
            <i class="el-icon-download"></i>
            <template slot-scope="scope">
            <el-link type="danger" @click="uploadTable(scope.row)" style="margin-left:10px" >下载表格</el-link>
            </template>
        </el-table-column>
        </el-table>
        <el-pagination
        v-if="iHDataTotalNumber"
        background
        @size-change="handleSizeChangeIH"
        @current-change="handleCurrentChangeIH"
        :current-page="pagenationIH.current"
        :page-size="pagenationIH.size"
        :page-sizes="[10, 20, 30, 50]"
        :pager-count="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="iHDataTotalNumber"
        style="float: right; display: flex; margin-top: 10px"
        ></el-pagination>
        </div>
        <div slot="footer" class="dialog-footer" style="margin-top:40px">
            <el-button @click="closeImportHistory()">关闭</el-button>
        </div>
        </el-dialog>
        <!-- 变更历史弹框 -->
        <el-dialog
        :visible.sync="showChangeHistoryFlag"
        width="54%"
        :close-on-click-modal="false"
        >
        <div slot="title">
            <span>变更历史</span>
        </div>
        <div style="padding:20px 60px;">
            <!-- 表格 -->
        <el-table
        ref="customerTable"
        :key="key"
        row-key="id"
        :data="changeHistoryTableData"
        tooltip-effect="dark"
        style="width: 100%"
        max-height="400"
        :header-cell-style="{ background: '#f7f7f7' }"
        stripe
        >
            <el-table-column
                prop="lubricationPointNames"
                label="润滑部件/元件1层"
                min-width="20%"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                prop="listItemValueOrigin"
                label="英文名称"
                min-width="25%"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                prop="listItemValueOld"
                :show-overflow-tooltip="true"
                label="变更内容"
                min-width="25%"
            >
            <template slot-scope="scope">
                {{scope.row.listItemValueOld}} 
                <i class="el-icon-right"></i>
                {{scope.row.listItemValue}}
            </template>
            </el-table-column>
            <el-table-column
                prop="updateTime"
                label="变更时间"
                min-width="20%"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                prop="createUser"
                label="变更人"
                min-width="20%"
                show-overflow-tooltip
            ></el-table-column>
        </el-table>
        <el-pagination
        v-if="cHDataTotalNumber"
        background
        @size-change="handleSizeChangeCH"
        @current-change="handleCurrentChangeCH"
        :current-page="pagenationCH.current"
        :page-size="pagenationCH.size"
        :page-sizes="[10, 20, 30, 50]"
        :pager-count="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="cHDataTotalNumber"
        style="float: right; display: flex; margin-top: 10px"
        ></el-pagination>
        </div>
        <div slot="footer" class="dialog-footer" style="margin-top:20px;">
        </div>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import { baseRemoteOauth2 } from "@/api/api";
import customTable from "../tableComponents/customTable";
import columnHeader from "../tableComponents/headerComponent";
export default {
  props: {},
  data() {
    return {
    tableKey: Date.now(),
    tableHeight: null,
    tableDataHeader: [
      { filterType: "selection", paramValue: "lubricationPointType", changeValue:"",selectOptions: [], prop: "lubricationPointNames", label: "润滑部件/元件1层", width: "200", tooltip: true },
      { prop: "assetClassNameCn", label: "MSLA Asset class名称", width: "200", tooltip: true },
      { filterType: "selection", paramValue: "assetClassFieldTitleEn", selectOptions: [], changeValue:"", prop: "fieldTitleCn", label: "类型", width: "150", tooltip: true },
      { filterType: "input", paramValue: "listItemValue", changeValue:"", prop: "listItemValue", label: "英文名称", width: "180", tooltip: true },
      { slot: "listItemValueCn", label: "中文翻译", width: "180", tooltip: true },
      { filterType: "selection", paramValue: "assetClassStatus", changeValue:"",selectOptions: [], slot: "assetClassStatusDesc", label: "状态", width: "180", tooltip: true },
      { slot: "operation" }
    ],
    mainminheight: `height:${document.documentElement.clientHeight - 140}px`,
    lastedPullMslaTime:'', // 更新时间
    uploadUrl: `${process.env.api}/web/config/serviceConfiguration/addServiceConfiguration`,
    showMslaSuccess:false,
    lubricationNameList:[],   //润滑点名称所在数组
    lubricationTypeList:[],  //类型所在数组
    staticList:[],  //状态所在数组
    chineseListForm:{
    translationTableData:[]}, 
    showImportFileFlag: false,
    editBtn:true,   // 编辑按钮
    saveBtn:false,  //保存按钮
    isloading:false,  // 上传文件按钮
    paramList:[],  // 存放修改的数据list
    changeListIdList:[],   // 存放修改数据的 id 数组
    fileForm: {
        customerNumber: "",
        fileList: [],
    },
    failDetailTableData:[],   // 失败详情表格内容
    // 变更历史表格内容
    changeHistoryTableData:[],
    showImportResultsFlag:false,   // 展示导入结果弹框
    failNum:true,  // 如果有上传失败记录，显示失败详情按钮
    showFailDetailFlag:false,   // 展示失败详情弹框
    viewImportHistory:false,  // 导入历史弹框
    showChangeHistoryFlag:false,   // 变更历史弹框
    importHistoryTableData:[],  // 导入历史表格数据
    queryParams: {
        lubricationPointType: "", //润滑点名称
        assetClassFieldTitleEn: "", //资产类型
        listItemValue: "", //英文名称
        assetClassStatus: "", //状态码
    },
    // selectList: [], //选中的设备列表
    loading: false, //是否显示加载动画，默认隐藏
    eTDataTotalNumber: 0, //英文翻译列表总条数
    fDDataTotalNumber: 0, //失败详情列表总数
    iHDataTotalNumber: 0, //导入历史表格总条数
    cHDataTotalNumber: 0, //变更历史列表总条数
    pageshow:true,
    pagenationET: {  //  英文翻译列表分页参数
        current: 1,
        size: 30,
    },
    pagenationFD: {  //   失败详情列表分页参数
        current: 1,
        size: 30,
    },
    pagenationIH: {   //   导入历史列表分页参数
        current: 1,
        size: 30,
    },
    pagenationCH: {   //   变更历史列表分页参数
        current: 1,
        size: 30,
    },
    showValue: "",
    fileRom: "", // 批量导入上传得附件
    currentPre:1, //原先的页码
    unSaveChangeCurrent:false,
    importResult:'' // 导入结果
    };
  },
  components: {
    "custom-table": customTable,
    "column-header":columnHeader,
  },
  computed: {},
  mounted() {
    this.$_getLubricationNameData() ;  // 获取润滑点部件名称数据
    this.$_getLubricationTypeData() ;  // 获取润滑点设备类型数据
    this.$_getStaticData();  // 获取状态数据
    this.handleTableHeight();
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 140}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
  },
  created() {
  },
  watch: {
  },
  methods: {
    tableTitleSearch(obj){
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      this.queryParams[obj.paramValue] = searchVal
      if(obj.paramValue == 'lubricationPointType'){
        this.lubricationPointTypeChange()
      }
      this.handleSearchTableData()
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
    lubricationPointTypeChange(){
        this.queryParams.assetClassFieldTitleEn = ''
        this.tableDataHeader[2].changeValue = ''
        this.$_getLubricationTypeData()
    },
    // 获取润滑点部件名称数据
    $_getLubricationNameData() {
      this.getDicDataList('lubrication_point_type').then(res=>{
          this.lubricationNameList = res
          this.tableDataHeader[0].selectOptions = this.lubricationNameList
          this.$_getEPData(); //获取中英文列表
      })
    },
    // 获取 类型 数据
    $_getLubricationTypeData(val) {
      this.requestMethodGet("/web/sys/conf/msla/queryAssetClassFieldKeys",{lubricationPointTypeCode:this.queryParams.lubricationPointType})
        .then(res => {
        res = res.data;
        if (res.code == 1000) {
          this.lubricationTypeList= res.data;
          this.lubricationTypeList.forEach(item=>{
            item.code = item.fieldTitle
            item.name = item.fieldTitleCn
          })
          this.tableDataHeader[2].selectOptions = this.lubricationTypeList
          if(val=='重置'){
            this.$_getEPData('重置');
          }
        } else {
            this.$message({
            message: res.msg,
            type: "warning"
            });
          }
        }).catch(res => {});
    },
    // 获取 状态 数据
    $_getStaticData() {
        this.requestMethodGet("/web/sys/conf/msla/queryAssetStatusList")
            .then(res => {
            res = res.data;
            if (res.code == 1000) {
                this.staticList= res.data;
                this.tableDataHeader[5].selectOptions = this.staticList
            } else {
                this.$message({
                message: res.msg,
                type: "warning"
                });
            }
            })
            .catch(res => {});
    },
    // 刷新数据
    handleRefresh() {
    this.loading = true;
    this.requestMethodPost("/msla/asset/class/updateMslaAssetClass")
        .then(res => {
        res = res.data;
        if (res.code == 1000) {
            this.loading = false;
            this.$message({
                message: 'MSLA数据已更新！',
                type: 'success'
            });
            this.$_getEPData();  // 刷新列表数据
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
    // 导入excel表格
    importFile() {
    this.showImportFileFlag = true;
    },
    // 文件上传删除前置
    beforeRemove(file) {
        if (file.size > 100 * 1024 * 1024) {
            this.$message.error('上传文件大小不能超过 100MB!');
            return false   //必须返回false
        }
    },
    // 文件上传超出限制
    handleExceed(files, fileList) {
    this.$message.error(`最多上传 1 个文件`);
    },
    // 文件上传删除
    handleRemove(file,fileList) {
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
    // 点击变更历史按钮
    handleChangeHistory() {
        this.showChangeHistoryFlag = true;
        this.getChangeHistoryData()  // 查询变更历史
    },
    // 获取变更历史的数据
    getChangeHistoryData() {
        this.loading = true;
        let params = {...this.pagenationCH };
        this.requestMethodGet("/web/sys/conf/msla/queryAssetClassLogByPage", params)
        .then((res) => {
        this.loading = false;
        res = res.data;
        if (res.code == 1000) {
            this.changeHistoryTableData = res.data.list;
            this.cHDataTotalNumber = res.data.totalCount;
        } else {
            this.$message({
            message: res.msg,
            type: "warning",
            });
        }
        })
        .catch((res) => {
            this.loading = false;
        });
    },
    // 点击编辑按钮
    handleEdit() {
        this.saveBtn = true;
        this.editBtn = false;
        this.chineseListForm.translationTableData.map(item=>{
            this.$set(item, 'editing', true)
        })
    },
    // 点击保存按钮
    handleSave() {
        this.unSaveChangeCurrent = false;
        if(this.paramList.length) {
            // 调取保存接口
            this.requestMethodPost("/web/sys/conf/msla/batchUpdateAssetClass",this.paramList).then(res => {
                if(res.data.code == 1000) {
                    this.$_getEPData();
                    if(!this.unSaveChangeCurrent) {
                        this.saveBtn = false;
                        this.editBtn = true;
                        this.chineseListForm.translationTableData.map(item=>{
                            this.$set(item, 'editing', false)
                        })
                    } else {
                        this.handleEdit()
                    }
                }
            }).catch(res => {
            });
        } else {
            this.saveBtn = false;
            this.editBtn = true;
            this.$_getEPData();
            this.chineseListForm.translationTableData.map(item=>{
                this.$set(item, 'editing', false)
            })
        }
    },
    // 修改中文翻译事件
    changeChineseName(row) {
        this.replacePreData(row)
    },
      // 保存修改的数据，如果之前修改过已在修改数组
    replacePreData(row) {
        if(this.changeListIdList.length != 0) {
            // 查不到这个 id
            if(this.changeListIdList.findIndex(item => item == row.id)== '-1') {
                this.changeListIdList.push(row.id)
                this.paramList.push(row)

            } else {  // 查得到，删除之前的数组数据
                this.paramList.splice( this.paramList.findIndex(item => item.id === row.id), 1)
                this.paramList.push(row)
            }
        } else {
            this.paramList.push(row)
            this.changeListIdList.push(row.id)
        }
        this.paramList = this.paramList.map(item =>{return {'id':item.id,"listItemValueCn":item.listItemValueCn}})
    },
    // 导入表格 点击  确认上传 
    submitFile(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
            if (this.fileForm.fileList.length === 0) {
                this.$message.error("请上传文件");
                return;
            } else {
                this.isloading = true
                var params = new FormData();
                params.append("file", this.fileRom);
                this.requestMethodPost("/web/sys/conf/msla/importAssetClassExcel", params)
                .then((res) => {
                    res = res.data;
                    if (res.code == 1000) {
                    // 导入成功
                    this.isloading = false;
                        this.importResult = res.data;
                        this.showImportResultsFlag = true;
                        this.showImportFileFlag = false;
                        this.fileForm.fileList = [];
                        this.$refs[formName].resetFields();
                        this.$_getEPData(); //获取中英文列表
                    } else {
                        this.isloading = false;
                        this.$message({
                            message: res.msg,
                            type: "warning",
                        });
                    }
                })
                .catch((res) => {});
            }
            }
        });
    },
    // 关闭导入结果弹框
    closeImportResult() {
        this.showImportResultsFlag = false;   // 关闭导入结果弹框
    },
    // 关闭失败详情弹框
    closeFailDetail() {
        this.showFailDetailFlag = false;
    },
    // 点击失败详情
    handleFailDetail() {
        this.showFailDetailFlag = true;   // 失败详情弹框展示
        this.showImportResultsFlag = false;   // 关闭导入结果弹框
        // this.importResult.recordId
        this.getFailByPage(); // 获取失败数据
    },
    // 获取失败数据
    getFailByPage() {
        this.loading = true;
        let params = { recordId:this.importResult.recordId, ...this.pagenationFD };
        this.requestMethodGet("/web/sys/conf/msla/queryExcelFailedByPage", params)
        .then((res) => {
        this.loading = false;
        res = res.data;
        if (res.code == 1000) {
            this.failDetailTableData = res.data.list;
            this.fDDataTotalNumber = res.data.totalCount;
        } else {
            this.$message({
            message: res.msg,
            type: "warning",
            });
        }
        })
        .catch((res) => {
            this.loading = false;
        });
    },
    // 点击查看导入历史
    handleViewImportHistory() {
        this.viewImportHistory = true;
        this.getImportHistoryData()
    },
    // 获取导入历史数据
    getImportHistoryData() {
        this.loading = true;
        let params = {  ...this.pagenationIH };
        this.requestMethodGet("/web/sys/conf/msla/queryImportRecordByPage", params)
            .then((res) => {
            this.loading = false;
            res = res.data;
            if (res.code == 1000) {
                this.importHistoryTableData = res.data.list;
                this.iHDataTotalNumber = res.data.totalCount;
            } else {
                this.$message({
                message: res.msg,
                type: "warning",
                });
            }
            })
            .catch((res) => {
                this.loading = false;
            });
    },
    // 关闭查看导入历史
    closeImportHistory() {
        this.viewImportHistory = false;
    },
    // 导出失败详情
    downLoadFalDetail() {
        // 导出文件
        const loading = this.$loading({
        lock: true,
        text: "数据下载中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        });
        let paramObj = {
          recordId: this.importResult.recordId,
          responseTypeBlob: true
        }
        this.requestMethodGet("/web/sys/conf/msla/exportExcelFailed", paramObj).then(res => {
          let data = res.data;
          let fileReader = new FileReader();
          let that = this;
          loading.close();
          fileReader.onload = function () {
          try {
              let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
              if (jsonData.code) {
              that.$message({
                  message: jsonData.msg,
                  type: "error",
              });
              return;
              }
          } catch (err) {
              // 解析成对象失败，说明是正常的文件流
              const blob = new Blob([res.data], {
              type: "application/vnd.ms-excel",
              });
              const objectUrl = URL.createObjectURL(blob);
              // window.location.href = objectUrl
              let link = document.createElement("a");
              link.style.display = "none";
              link.href = objectUrl;
              link.setAttribute("download", "失败详情.xls");
              document.body.appendChild(link);
              link.click();
          }
          };
          fileReader.readAsText(data);
        })
        .catch(res => {
          loading.close();
        });
        this.showFailDetailFlag = false;   // 失败详情弹框展示
    },
    // 导入历史   --   下载表格
    uploadTable(row) {
        // 下载表格
        window.location.href = row.filePath
    },
    // 查询
    handleSearchTableData() {
    this.pagenationET.current = 1;
    this.$_getEPData('查询');
    },
    // 重置
    handleClearSearch() {
    this.queryParams = {
        lubricationPointType: "", //润滑点名称
        assetClassFieldTitleEn: "", //资产类型
        listItemValue: "", //英文名称
        assetClassStatus: "", //状态码
    };
    this.pagenationET = {
        current: 1,
        size: 30,
    };
    this.tableDataHeader.forEach(item=>{
      item.changeValue=""
    })
    this.$_getLubricationTypeData('重置')
    },
    // 批量导出
    exportData() {
        const loading = this.$loading({
        lock: true,
        text: "数据下载中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        });
        let paramObj = {
          lubricationPointType: this.queryParams.lubricationPointType,
          assetClassFieldTitleEn: this.queryParams.assetClassFieldTitleEn,
          listItemValue: this.queryParams.listItemValue,
          assetClassStatus: this.queryParams.assetClassStatus,
          responseTypeBlob: true
        }
        this.requestMethodGet("/web/sys/conf/msla/exportAssetClassExcel", paramObj).then(res => {
          let data = res.data;
          let fileReader = new FileReader();
          let that = this;
          loading.close();
          fileReader.onload = function () {
          try {
              let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
              if (jsonData.code) {
              that.$message({
                  message: jsonData.msg,
                  type: "error",
              });
              return;
              }
          } catch (err) {
              // 解析成对象失败，说明是正常的文件流
              const blob = new Blob([res.data], {
              type: "application/vnd.ms-excel",
              });
              const objectUrl = URL.createObjectURL(blob);
              // window.location.href = objectUrl
              let link = document.createElement("a");
              link.style.display = "none";
              link.href = objectUrl;
              link.setAttribute("download", "MSLA英文翻译.xls");
              document.body.appendChild(link);
              link.click();
          }
          };
          fileReader.readAsText(data);
        })
        .catch(res => {
          loading.close();
        });
    },
    // 获取中英文翻译列表
    $_getEPData() {
    this.loading = true;
    let params = { ...this.queryParams, ...this.pagenationET };
    this.requestMethodGet("/web/sys/conf/msla/queryConfAssetClassByPage", params)
        .then((res) => {
        this.loading = false;
        res = res.data;
        if (res.code == 1000) {
            this.chineseListForm.translationTableData = res.data.list;
            this.eTDataTotalNumber = res.data.totalCount;
            this.lastedPullMslaTime = res.data.lastedPullMslaTime;
            if(this.unSaveChangeCurrent) {
                this.chineseListForm.translationTableData.map(item=>{
                    this.$set(item, 'editing', true)
                })
            } else {
                this.chineseListForm.translationTableData.map(item=>{
                    this.$set(item, 'editing', false)
                })
            }
            this.tableKey = Date.now();
        } else {
            this.$message({
                message: res.msg,
                type: "warning",
            });
        }
        })
        .catch((res) => {
            this.loading = false;
        });
    },

    //  英文翻译列表 size change
    handleSizeChangeET(size) {
        this.pagenationET.size = size;
        this.pagenationET.current = 1;
        this.$_getEPData();
    },
    //current change
    handleCurrentChangeET(current) {
        if(this.saveBtn) {
            this.$confirm("本页已填数据需要还未保存，确认是否保存?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(() => {
                this.pagenationET.current = current;
                // 调取保存接口
                this.handleSave() 
                this.saveBtn = true;
                this.editBtn = false;
                this.paramList=[];
                this.changeListIdList = [];
                this.unSaveChangeCurrent = true
            })
            .catch(() => {
                this.pagenationET.current = this.currentPre;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(() => {//重新渲染分页
                    this.pageshow = true;
                });
            });
        } else {
            this.pagenationET.current = current;
            this.$_getEPData(current);
        }
    },
    //  失败详情列表 size change
    handleSizeChangeFD(size) {
        this.pagenationFD.size = size;
        this.pagenationFD.current = 1;
        this.getFailByPage(); // 获取失败数据
    },
    //current change
    handleCurrentChangeFD(current) {
        this.pagenationFD.current = current;
        this.getFailByPage(); // 获取失败数据
    },
    //  导入历史列表 size change
    handleSizeChangeIH(size) {
        this.pagenationIH.size = size;
        this.pagenationIH.current = 1;
        this.getImportHistoryData()
    },
    //current change
    handleCurrentChangeIH(current) {
        this.pagenationIH.current = current;
        this.getImportHistoryData()
    },
    //  变更历史列表 size change
    handleSizeChangeCH(size) {
        this.pagenationCH.size = size;
        this.pagenationCH.current = 1;
        this.getChangeHistoryData()  // 查询变更历史
    },
    //current change
    handleCurrentChangeCH(current) {
        this.pagenationCH.current = current;
        this.getChangeHistoryData()  // 查询变更历史
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.handleTableHeight();
    });
  }
};
</script>
<style lang='less' scoped>
@import "../../assets/css/customTable.less";
.english-translation {
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
  /deep/ .el-dialog__body {
  padding: 0;
  }
}
</style>