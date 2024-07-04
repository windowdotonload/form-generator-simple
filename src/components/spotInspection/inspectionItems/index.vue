<template>
  <div style="position:relative">
    <div class="work-order-component" :style="mainminheight" id="spotItemsDiv">
      <div class="toolbox-con flexBetween">
        <!-- 查询条件 -->
        <el-form ref="searchForm" :model="searchForm" :inline="true" size="small" id="searchForm">
          <el-form-item label="所属客户" v-if="userInfo.userType != 2" class="form-item-outline">
            <div class="select_customer" @click="showSelectCustomer" :style="selectCustomerList.length>0?'color:#606266;':''">{{selectCustomerList.length>0?'指定客户'+selectCustomerList.length:'请选择'}}
              <i class="el-icon-close" style="color:#C0C4CC;" v-show="selectCustomerList.length>0" @click.stop="handleClearCustomer"></i>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="tool-con">
          <el-button plain size="small" @click="importCheckItem">批量导入</el-button>
          <el-button type="danger" size="small" @click="createCheckItem">创建检查项</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <custom-table class="table" :listEmptyType="listEmptyType" :limitFlag="limitFlag" :tableHeader="tableDataHeader" :tableData="inspectionTableData" :tableHeight="tableHeight + ''" :loading="loadingTable" @changeSearch="tableTitleSearch">
        <template v-slot:companyName="slotProps" v-if="userInfo.userType < 2">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="客户"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div style="display: flex; align-items: center">
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.companyName }}</span>
              </div>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column :resizable="false" slot="operation" fixed="right" label="操作" width="150" align="center">
          <i class="el-icon-share"></i>
          <template slot-scope="scope">
            <el-link @click="edit(scope.row)" style="margin-right:10px;color:#001450" v-if="scope.row.editFlag">编辑 </el-link>
            <el-link @click="deleteItem(scope.row)" style="margin-right:10px;color:#DD0000">删除 </el-link>
          </template>
        </el-table-column>
      </custom-table>
      <!-- 分页 -->
      <el-pagination
        v-if="totalNumber"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="searchForm.current"
        :page-size="searchForm.size"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        class="listOptimizePage"
      ></el-pagination>
      <!-- 导入检查项弹框 -->
      <el-dialog title="导入检查项" :visible.sync="importVisible" width="30%" @close="cancelImport('importForm')" :close-on-click-modal="false">
        <div class="import-title">第一步：整理需要导入检查项的设备，用于填入《检查项导入模板》中</div>
        <el-form ref="importForm" :rules="importRules" :model="importForm" label-width="80px" style="margin-top:10px">
          <el-form-item label="所属客户" v-if="userInfo.userType < 2" prop="companyId">
            <el-select
              size="small"
              clearable
              filterable
              v-model="importForm.companyId"
              :filter-method="customerAllFilter"
              @clear="clearCustomer"
              placeholder="请选择"
              @change="getWorkshopList"
              style="width:80%;"
            >
              <el-option v-for="item in customerList" :key="item.companyId" :label="item.companyName" :value="item.companyId"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="dialog-template">
          <el-link @click="downloadDeviceExcel('importForm')" style="margin-right:10px;color:#001450">点击下载《设备信息清单》 </el-link>
        </div>
        <div class="import-title">第二步：请下载检查项导入模板，并按要求填写</div>
        <div style="margin-top:10px;line-height:21px">
          <span>导入提示：</span>
          <div>1.请确保导入文件中的设备在系统中存在且编号一致，否则将<span style="color:#dd0000">导入失败</span>或<span style="color:#dd0000">检查项与设备不匹配</span>；</div>
          <div>2.系统会根据导入表格<span style="color:#dd0000">自动创建</span>检查项。</div>
        </div>
        <div class="dialog-template">
          <el-link @click="downloadTemplate('importForm')" style="margin-right:10px;color:#001450">点击下载《检查项导入模板》 </el-link>
        </div>
        <div class="import-title">第三步：请上传填写后的《检查项导入模板》</div>
        <div style="margin-top:20px;width:100%">
          <el-upload
            drag
            action="uploadUrl"
            :auto-upload="false"
            accept=".xls, .xlsx, .csv"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :on-change="handleFileChange"
            :file-list="importForm.fileList"
          >
            <div>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em style="color:#001450">点击上传</em></div>
            </div>
          </el-upload>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelImport('importForm')" size="small">取 消</el-button>
          <el-button type="danger" @click="confirmImport('importForm')" size="small">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 导入结果 -->
      <el-dialog :visible.sync="importResult" width="35%" :close-on-click-modal="false">
        <div slot="title">
          <span>导入结果</span>
        </div>
        <div style="margin: 0 20px">
          <div class="import-item-content">
            <div><span style="width: 10px; height: 10px; border-radius: 50%; background: rgba(0, 136, 136); display: inline-block; margin-right: 8px"></span>新建</div>
            <div>新建检查项 {{ importResultData.successNums }} 个</div>
          </div>
          <div class="import-item-content">
            <div><span style="width: 10px; height: 10px; border-radius: 50%; background: rgba(221, 0, 0); display: inline-block; margin-right: 8px"></span>失败</div>
            <div>新建失败 {{ importResultData.failNums }} 行数据，详情请下载错误数据查看</div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeImportResult" size="small">关闭</el-button>
          <!-- <el-button  v-if="importResultData.failNums != 0" type="danger" @click="failDetail" size="small">失败详情</el-button> -->
          <el-button type="danger" v-if="importResultData.failNums != 0" size="small" @click="downloadErrorData">错误结果下载</el-button>
        </div>
      </el-dialog>
      <!-- 失败详情 -->
      <el-dialog :visible.sync="failDetailVisible" width="70%" :close-on-click-modal="false" style="padding-bottom:40px;">
        <div slot="title">
          <span>失败详情</span>
        </div>
        <div style="padding:0px 20px;">
          <!-- 表格 -->
          <el-table
            ref="failTable"
            :key="key"
            :data="importResultData.importErrorRowMsgs"
            tooltip-effect="dark"
            max-height="500"
            style="width: 100%"
            :header-cell-style="{ background: '#f7f7f7' }"
            stripe
          >
            <el-table-column prop="rowIndex" label="第几行" min-width="15%" show-overflow-tooltip></el-table-column>
            <el-table-column prop="fieldName" show-overflow-tooltip label="字段名称" min-width="30%"></el-table-column>
            <el-table-column prop="errmsg" label="错误详情" min-width="40%" show-overflow-tooltip></el-table-column>
          </el-table>
          <el-pagination
            background
            @size-change="failSizeChange"
            @current-change="failCurrentChange"
            :current-page="failCurrent"
            :page-size="failSize"
            :page-sizes="[10, 20, 30, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="failTotal"
            style="float: right; display: flex; margin-top: 10px;position: static;"
          ></el-pagination>
        </div>
        <div slot="footer" class="dialog-footer" style="margin-top:40px;">
          <el-button @click="closeFailDialog" size="small">关闭</el-button>
        </div>
      </el-dialog>
      <!-- 删除提示框 -->
      <el-dialog title="删除检查项" :visible.sync="deleteItemVisible" :close-on-click-modal="false" width="30%">
        <span>删除后，未来的任务中将不在出现该检查项（但不会影响已生成的任务），请谨慎操作。</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteItemVisible = false" size="small">取 消</el-button>
          <el-button type="danger" @click="confirmDeleteItem" size="small">删 除</el-button>
        </span>
      </el-dialog>
    </div>
    <customer-list ref="selectCustomer" :showCustomerDialog="showCustomerDialog" @handleSubmitCustomer="handleSubmitCustomer" @handleCloseCustomer="handleCloseCustomer"></customer-list>
  </div>
</template>
<script>
import { baseRemoteOauth2 } from "@/api/api";
import customTable from "../../tableComponents/customTable";
import columnHeader from "../../tableComponents/headerComponent";
import customerList from "../../tableComponents/customerList";
export default {
  data() {
    return {
      listEmptyType:'spot_item',
      limitFlag:true,
      tableHeight: null,
      tableDataHeader: [
        { filterType: "input", paramValue: "content", changeValue:"", prop: "content", label: "检查内容", width: "200", tooltip: true },
        { filterType: "selection", paramValue: "", selectOptions: [], changeValue:"", prop: "taskNames", label: "适用任务", width: "200", tooltip: true },
        { slot: "companyName", label: "客户", width: "300" },
        { filterType: "input", paramValue: "deviceName", changeValue:"", prop: "deviceName", label: "所属设备", width: "200", tooltip: true },
        { slot: "operation", label: "操作" }
      ],
      selectCustomerList: [],
      showCustomerDialog: false,
      mainminheight: `height:${document.documentElement.clientHeight - 130}px`,
      searchForm: {
        content: "",
        optionId: "",
        companyId: "",
        deviceName: "",
        current: 1,
        size: 30
      },
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      selectCompanyName: "",
      taskList: [],
      customerList: [],
      inspectionTableData: [],
      totalNumber: 0,
      pageHeight: "",
      importVisible: false,
      importForm: {
        companyId: "",
        workshopId: "",
        fileList: []
      },
      workshopList: [],
      importRules: {
        companyId: [{ required: true, message: "请选择所属客户", trigger: "change" }]
      },
      fileRaw: "",
      importResult: false,
      importResultData: {
        allCount: 12,
        updatedCount: 3,
        noChangeCount: 8,
        failCount: 1
      },
      failDetailVisible: false,
      failCurrent: 1,
      failSize: 10,
      failTotal: 10,
      deleteItemVisible: false,
      deleteRow: {},
      loadingTable: false,
      type: ""
    };
  },
  components: {
    "custom-table": customTable,
    "column-header":columnHeader,
    "customer-list": customerList
  },
  created() {
    this.pageHeight = document.documentElement.clientHeight;
    // 获取适用任务
    this.getApplyTaskOptions();
    // 查询所属客户
    if(this.userInfo.userType<2) {
      this.$_queryCustomerData();
    }
    
    // 查询车间
    this.getWorkshopList();
    this.handleTableHeight();
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 130}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$gio.editCheckItem();
    if (to.path == "/inspectItem/createItem") {
      if (to.query.type == "edit") {
        to.meta.title = "检查项管理,编辑检查项";
      } else {
        to.meta.title = "检查项管理,创建检查项";
      }
    }
    next();
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.handleTableHeight();
    });
  },
  methods: {
    handleClearCustomer() {
      this.selectCustomerList = []
      this.searchForm.companyId = ""
      this.getInspectList()
      this.$refs["selectCustomer"].clearSelectCustomer()
    },
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        let spotItemsDiv=0
        let searchFormHeight=0
        if (document.getElementById("spotItemsDiv")) {
          spotItemsDiv = document.getElementById("spotItemsDiv").clientHeight;
        }
        if (document.getElementById("searchForm")) {
          searchFormHeight = document.getElementById("searchForm").clientHeight;
        }
        this.tableHeight = Number(spotItemsDiv) - Number(searchFormHeight) - 70;
      }, 200);
    },
    tableTitleSearch(obj){
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      this.searchForm[obj.paramValue] = searchVal
      this.getInspectList()
    },
    showSelectCustomer() {
      this.showCustomerDialog = true
    },
    handleCloseCustomer(){
      this.showCustomerDialog = false
    },
    handleSubmitCustomer(e){
      this.selectCustomerList = e
      let selectList = this.selectCustomerList.map(item=>{
        return item.companyId
      })
      this.searchForm.companyId = selectList.join(",")
      this.showCustomerDialog = false
      this.getInspectList()
    },
    importWorkshopVisible(val) {
      if (val) {
        if (this.userInfo.userType < 2) {
          if (!this.importForm.companyId) {
            this.$message({
              type: "warning",
              message: "请选择所属客户"
            });
            return;
          }
        }
      }
    },
    getWorkshopList() {
      const params = {
        companyId: this.userInfo.userType < 2 ? this.importForm.companyId : this.userInfo.companyId,
        current: 1,
        size: 300
      };
      this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", params).then(res => {
        if (res.data.code == 1000) {
          const list = res.data.data.list || [];
          this.workshopList = list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 下载设备信息清单
    downloadDeviceExcel(formName) {
      this.$gio.clickDownloadDeviceInfoList();
      this.$refs[formName].validate(valid => {
        if (valid) {
          const companyId = this.userInfo.userType < 2 ? this.importForm.companyId : this.$userInfo.orgInfo.companyId;
          let url = '/device/check/checkItem/device/export';
          let paramObj = { 
            companyId: companyId,
            workshopId: this.importForm.workshopId,
            responseTypeBlob: true
          }
          const loading = this.$loading({
            lock: true,
            text: "模板下载中，请稍后",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          this.requestMethodGet(url, paramObj).then(res => {
            let data = res.data;
            let fileReader = new FileReader();
            let that = this;
            loading.close();
            fileReader.onload = function() {
              try {
                let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
                if (jsonData.code) {
                  that.$message({
                    message: jsonData.msg,
                    type: "error"
                  });
                  return;
                }
              } catch (err) {
                // 解析成对象失败，说明是正常的文件流
                const blob = new Blob([res.data], {
                  type: "application/vnd.ms-excel"
                });
                const objectUrl = URL.createObjectURL(blob);
                let link = document.createElement("a");
                link.style.display = "none";
                link.href = objectUrl;
                link.setAttribute("download", "设备信息清单.xlsx");
                document.body.appendChild(link);
                link.click();
              }
            };
            fileReader.readAsText(data);
          })
          .catch(res => {
            loading.close();
          });
        } else {
          return false;
        }
      });
    },
    getApplyTaskOptions() {
      const params = {
        companyId: this.userInfo.orgId
      };
      this.requestMethodGet("/device/check/checkItem/deviceOptionList", params).then(res => {
        if (res.data.code == 1000) {
          this.taskList = res.data.data;
          this.taskList.forEach(item=>{
            item.code=item.id
            item.name=item.taskTypeName
          })
          if(this.userInfo.userType == 2){
            this.tableDataHeader.forEach(item=>{
                if(item.paramValue=='optionId'){
                  item.paramValue = 'optionId'
                  item.selectOptions = this.taskList
                }
              })
          }
        // 获取检查项列表
        this.getInspectList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 重置
    resetSearch() {
      if(this.searchForm.companyId){
        this.$refs["selectCustomer"].clearSelectCustomer()
      }
      for (let key in this.searchForm) {
        this.searchForm[key] = "";
      }
      this.tableDataHeader.forEach(item=>{
        item.changeValue=""
      })
      this.selectCustomerList = []
      this.searchForm.size = 30;
      this.searchForm.current = 1;
      this.getInspectList();
    },
    // 创建检查项
    createCheckItem() {
      this.type = "add";
      this.$router.push({
        path: "/inspectItem/createItem",
        query: {
          type: "add"
        }
      });
    },
    // 导入检查项
    importCheckItem() {
      this.importVisible = true;
      this.$gio.clickImportChectItemsButton();
    }, 
    // 下载模板
    downloadTemplate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$gio.clickDownloadtChectItemsImportTemplate();
          const companyId = this.userInfo.userType < 2 ? this.importForm.companyId : this.userInfo.companyId;
          let url = '/device/check/checkItem/export';
          let paramObj = { 
            companyId: companyId,
            responseTypeBlob: true
          }
          const loading = this.$loading({
            lock: true,
            text: "模板下载中，请稍后",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          this.requestMethodGet(url, paramObj).then(res => {
            let data = res.data;
            let fileReader = new FileReader();
            let that = this;
            loading.close();
            fileReader.onload = function() {
              try {
                let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
                if (jsonData.code) {
                  that.$message({
                    message: jsonData.msg,
                    type: "error"
                  });
                  return;
                }
              } catch (err) {
                // 解析成对象失败，说明是正常的文件流
                const blob = new Blob([res.data], {
                  type: "application/vnd.ms-excel"
                });
                const objectUrl = URL.createObjectURL(blob);
                let link = document.createElement("a");
                link.style.display = "none";
                link.href = objectUrl;
                link.setAttribute("download", "检查项导入模板.xlsx");
                document.body.appendChild(link);
                link.click();
              }
            };
            fileReader.readAsText(data);
          })
          .catch(res => {
            loading.close();
          });
        } else {
          return false;
        }
      });
    },
    // 文件上传删除前置
    beforeRemove(file) {
      if (file.size > 100 * 1024 * 1024) {
        this.$message.error("上传文件大小不能超过 100MB!");
        return false; //必须返回false
      }
    },
    // 文件上传超出限制
    handleExceed(files, fileList) {
      this.$message.error(`最多上传 1 个文件`);
    },
    // 文件上传删除
    handleRemove(file, fileList) {
      this.importForm.fileList = [];
    },
    // 文件上传改变
    handleFileChange(file, fileList) {
      this.importForm.fileList = fileList;
      this.fileRaw = file.raw;
    },
    // 弹框取消
    cancelImport(formName) {
      this.importForm.companyId = "";
      this.importForm.workshopId = "";
      this.importForm.fileList = [];
      this.$refs[formName].resetFields();
      this.importVisible = false;
    },
    // 导入点击确认
    confirmImport(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.importForm.fileList.length === 0) {
            this.$message.error("请上传文件");
          } else {
            var params = new FormData();
            const companyId = this.userInfo.userType < 2 ? this.importForm.companyId : this.$userInfo.orgInfo.companyId;
            params.append("multipartFile", this.fileRaw);
            params.append("companyId", companyId);
            this.requestMethodPost("/device/check/checkItem/import", params).then(res => {
              res = res.data;
              if (res.code == 1000) {
                // 导入成功,打开导入结果弹框
                this.cancelImport(formName);
                const data = res.data;
                data.allCount = data.failNums + data.successNums;
                this.importResultData = data;
                this.importResult = true;
                setTimeout(() => {
                  this.searchForm.size = 30;
                  this.searchForm.current = 1;
                  this.getInspectList();
                }, 800);
                this.$gio.submitImportChectItems({
                  customer: this.$gio.findValueCodeCorresponding(this.customerList, companyId, "companyId", "companyName")
                });
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    // 关闭导入结果
    closeImportResult() {
      this.importResult = false;
    },
    // 错误结果下载
    downloadErrorData() {
      const loading = this.$loading({
        lock: true,
        text: "数据下载中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let paramObj = {
        errorDataList: this.importResultData.errorDeviceCheckItemDtos,
        responseTypeBlob: true
      }
      this.requestMethodPost("/device/check/checkItem/exportError", paramObj).then(res => {
        let data = res.data;
        let fileReader = new FileReader();
        let that = this;
        that.errorDataDialog = false;
        loading.close();
        fileReader.onload = function() {
          try {
            let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
            if (jsonData.code) {
              that.$message({
                message: jsonData.msg,
                type: "error"
              });
              return;
            }
          } catch (err) {
            // 解析成对象失败，说明是正常的文件流
            const blob = new Blob([res.data], {
              type: "application/vnd.ms-excel"
            });
            const objectUrl = URL.createObjectURL(blob);
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = objectUrl;
            link.setAttribute("download", "设备检查项导入失败原因信息.xlsx");
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
    // 导入详情
    failDetail() {
      this.failDetailVisible = true;
    },
    // 导入详情分页
    failSizeChange(val) {
      this.failSize = val;
      this.getFailList();
    },
    failCurrentChange(val) {
      this.failCurrent = val;
      this.getFailList();
    },
    // 关闭失败详情弹框
    closeFailDialog() {
      this.failDetailVisible = false;
    },
    // 获取检查项列表
    getInspectList() {
      const params = this.searchForm;
      this.loadingTable = true;
      this.requestMethodPost("/device/check/checkItem/checkItemsListByPage", params).then(res => {
        if (res.data.code == 1000) {
          const list = res.data.data.list;
          if (list.length) {
            list.forEach(item => {
              let names = [];
              if (item.deviceOptionList && item.deviceOptionList.length) {
                item.deviceOptionList.forEach(it => {
                  names.push(it.taskTypeName);
                });
              }
              item.taskNames = names.length ? names.join(",") : "全部";
            });
          }
          this.inspectionTableData = list;
          this.totalNumber = res.data.data.totalCount;
          this.loadingTable = false;
          this.$gio.filterChectItems({
            checkContent: params.content,
            applicableTasks: this.$gio.findValueCodeCorresponding(this.taskList, params.optionId, "id", "taskTypeName"),
            customer: this.$gio.findValueCodeCorresponding(this.taskList, params.companyId, "companyId", "companyName"),
            device: params.deviceName
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 编辑
    edit(row) {
      this.type = "edit";
      this.$router.push({
        path: "/inspectItem/createItem",
        query: {
          type: "edit",
          checkItemsId: row.id,
          companyName: row.companyName
        }
      });
    },
    // 删除
    deleteItem(row) {
      this.deleteRow = row;
      this.deleteItemVisible = true;
    },
    // 确定删除
    confirmDeleteItem() {
      const params = {
        checkItemId: this.deleteRow.id
      };
      this.requestMethodGet("/device/check/checkItem/delete", params).then(res => {
        if (res.data.code == 1000) {
          this.deleteItemVisible = false;
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.searchForm.size = 30;
          this.searchForm.current = 1;
          this.getInspectList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 模糊搜索公司
    customerAllFilter(val) {
      this.selectCompanyName = val;
      this.$_queryCustomerData();
    },
    clearCustomer(val) {
      if (!val) {
        this.selectCompanyName = "";
        this.$_queryCustomerData();
      }
      this.getInspectList();
    },
    //查询所属客户
    $_queryCustomerData() {
      let params = {
        companyType: 2,
        size: 500,
        status: 1,
        companyName: this.selectCompanyName
      };
      this.requestMethodGet("/web/customer/queryCompanyListByPage", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.customerList = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    handleSizeChange(size) {
      this.searchForm.size = size;
      this.getInspectList();
    },
    handleCurrentChange(current) {
      this.searchForm.current = current;
      this.getInspectList();
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../assets/css/customTable.less";
.import-item-content {
  display: flex;
  align-items: center;
  margin-top: 16px;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid rgba(233, 233, 233, 0.4);
  justify-content: space-between;
}
.import-title {
  font-size: 14px;
  color: #000;
  font-weight: bold;
}
.dialog-template {
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 17px 16px;
  background: #f9f9f9;
  border-radius: 4px;
}
.work-order-component {
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
