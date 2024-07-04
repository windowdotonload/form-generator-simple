<template>
  <div style="position:relative">
    <div class="device-document" :style="mainminheight" id="deviceDocumentDiv">
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
          <el-button size="small" plain @click="downloadFile">批量导出</el-button>
          <el-button size="small" type="danger" @click="uplaodFile">上传文件</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <custom-table class="table" :tableHeader="tableDataHeader" :tableData="tableData" :tableHeight="tableHeight + ''" :loading="tableLoading" @selectionChange="selectTable" @changeSearch="tableTitleSearch">
        <el-table-column fixed slot="selection" type="selection" :reserve-selection="true" width="40"></el-table-column>
        <template v-slot:companyName="slotProps" v-if="userInfo.userType != 2">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="客户"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div style="display: flex; align-items: center">
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.companyName }}</span>
                <!-- <span class="self-tips" v-if="scope.row.companyName == 0">直</span> -->
                <!-- <img v-if="scope.row.customerPesFlag == '1' || scope.row.customerPesFlag == '3'" src="../../assets/pes-icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" /> -->
                <!-- <img v-if="scope.row.customerPesFlag == '2' || scope.row.customerPesFlag == '3'" src="../../assets/DPES_icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" /> -->
                <!-- <img v-if="scope.row.spFlag == '1'" src="../../assets/sp-icon.png" alt="" style="width: 20px; height: 20px; margin-left: 8px" /> -->
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:status="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="状态"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header 
                title="状态"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"/>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">使用中</span>
              <span v-if="scope.row.status == 0">已停用</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column :resizable="false" slot="operation" fixed="right" label="操作" width="200" align="center">
          <i class="el-icon-share"></i>
          <template #default="{ row }">
            <el-link style="margin-right: 10px; color: rgb(0, 20, 79)" :underline="false" @click="editFile(row)">编辑</el-link>
            <el-link
              :underline="false"
              :disabled="!row.fileName.includes('pdf')"
              @click="previewFile(row)"
              :style="row.fileName.includes('pdf') ? 'margin-right: 10px; color: rgb(0, 20, 79)' : 'margin-right: 10px; color:#999'"
            >
              预览
            </el-link>
            <el-link style="margin-right: 10px; color: rgb(0, 20, 79)" :underline="false" @click="downloadRowFile(row)">下载</el-link>
            <el-link type="danger" :underline="false" @click="deleteFile(row)">删除</el-link>
          </template>
        </el-table-column>
      </custom-table>
      <!-- 分页 -->
      <el-pagination
        v-if="tableTotalCount"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.current"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="pageInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableTotalCount"
        class="listOptimizePage"
      ></el-pagination>
      <el-dialog v-loading="editDialogLoding" title="文件信息" :visible.sync="dialogVisible" width="26%" top="3%" @close="cancel" :close-on-click-modal="false">
        <el-form ref="uploadForm" hide-required-asterisk :rules="uploadRules" :model="uplodForm" label-position="top">
          <el-form-item prop="companyId" v-if="userInfo.userType != 2">
            <template #label>
              <h3 style="margin: 0; margin-bottom: 5px"><span style="color: #d10000">*</span>客户</h3>
            </template>
            <el-select
              no-data-text="加载中..."
              size="small"
              clearable
              filterable
              v-model="uplodForm.companyId"
              :disabled="editFileFlag"
              :filter-method="customerFilter"
              @clear="clearCustomer"
              @change="changeSelCustomer"
              placeholder="请选择"
              style="width: 85%"
            >
              <el-option v-for="item in customerSearchList" :key="item.companyNumber" :label="item.companyName" :value="item.companyId" @click.native="selCompany(item)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="workshopIds">
            <template #label>
              <h3 style="margin: 0; margin-bottom: 5px"><span style="color: #d10000">*</span>选择对应车间</h3>
            </template>
            <el-select
              @click.native="noCustomerTip('error')"
              multiple
              collapse-tags
              size="small"
              clearable
              v-model="uplodForm.workshopIds"
              @clear="clearWorkshop"
              placeholder="请选择"
              @change="worshopSearchChange"
              style="width: 85%"
            >
              <el-option v-for="item in workShopSearchList" :key="item.workshopId" :label="item.workshopName" :value="item.workshopId"></el-option>
            </el-select>
            <div>提示：车间内的所有设备都能够查看该文件</div>
          </el-form-item>
          <el-form-item>
            <template #label>
              <h3 style="margin: 0; margin-bottom: 5px">状态</h3>
            </template>
            <el-radio v-model="uplodForm.status" label="1">使用中</el-radio>
            <el-radio v-model="uplodForm.status" label="0">已停用</el-radio>
          </el-form-item>
          <el-form-item>
            <template #label>
              <h3 style="margin: 0; margin-bottom: 5px">文件描述</h3>
            </template>
            <el-input style="width: 85%" type="textarea" placeholder="请输入内容" maxlength="20" show-word-limit v-model="uplodForm.fileDesc" />
          </el-form-item>
          <el-form-item v-if="!editFileFlag">
            <template #label>
              <h3 style="margin: 0; margin-bottom: 5px">上传文件</h3>
            </template>
            <BatchUploadFile ref="BatchUpload" />
          </el-form-item>
        </el-form>
        <div style="display: flex; justify-content: flex-end">
          <el-button size="small" style="margin-right: 10px" @click="cancel">取消</el-button>
          <el-button size="small" style="margin-right: 10px" type="danger" @click="updateFile" v-if="editFileFlag">保存</el-button>
          <el-button size="small" type="danger" @click="uploadFormFile" v-else>上传文件</el-button>
        </div>
      </el-dialog>
      <el-dialog title="预览" @close="previewImgSrc = ''" :visible.sync="previewImgDialogVisible" width="60%">
        <div v-loading="!previewImgSrc" style="width: 100%; height: 100%; min-height: 300px; display: flex; align-items: center; justify-content: center">
          <img style="max-width: 100%" :src="previewImgSrc" alt="" />
        </div>
      </el-dialog>
    </div>
    <customer-list ref="selectCustomer" :showCustomerDialog="showCustomerDialog" @handleSubmitCustomer="handleSubmitCustomer" @handleCloseCustomer="handleCloseCustomer"></customer-list>
  </div>
</template>

<script>
import { baseRemoteOauth2 } from "@/api/api";
import BatchUploadFile from "./components/BatchUploadFile.vue";
import mixin from "./mixin/index";
import customTable from "../tableComponents/customTable";
import columnHeader from "../tableComponents/headerComponent";
import customerList from "../tableComponents/customerList";
export default {
  mixins: [mixin],
  components: {
    BatchUploadFile,
    "custom-table": customTable,
    "column-header":columnHeader,
    "customer-list": customerList
  },
  data() {
    return {
      tableHeight: null,
      tableDataHeader: [
        { slot: "selection" },
        { filterType: "input", paramValue: "fileName", changeValue:"", prop: "fileName", label: "文件名", width: "200", fixed: "left", tooltip: true },
        { filterType: "input", paramValue: "userName", changeValue:"", prop: "userName", label: "上传人", width: "130", tooltip: true },
        { slot: "companyName", label: "客户", width: "250" },
        { filterType: "selection", paramValue: "status", selectMultiple: true, changeValue:"", selectOptions: [{code: "5", name: "全部"},{code: "1", name: "使用中"},{code: "0", name: "已停用"}], slot: "status", label: "状态", width: "100" },
        { filterType: "dateRange", paramValue: "date", changeValue:"", prop: "createTime", label: "上传时间", width: "150", tooltip: true },
        { slot: "operation", label: "操作" }
      ],
      selectCustomerList: [],
      showCustomerDialog: false,
      mainminheight: `height:${document.documentElement.clientHeight - 140}px`,
      previewImgSrc: "",
      previewImgDialogVisible: false,
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      fileList: [],
      pageInfo: {
        size: 10,
        current: 1
      },
      customerSearchList: [],
      workShopSearchList: [],
      searchForm: {
        fileName: "",
        companyId: "",
        workshopId: "",
        status:"",
        userName: ""
      },
      listStatus: [
        {code: "5", name: "全部"},
        {code: "1", name: "使用中"},
        {code: "0", name: "已停用"}
      ],
      uplodForm: {
        companyId: "",
        workshopIds: [],
        status: "1",
        fileDesc: "",
        filePath: ""
      },
      uploadRules: {
        companyId: [{ required: true, message: "请选择客户", trigger: "blur" }],
        workshopIds: [{ required: true, message: "请选择车间", trigger: "blur" }]
      },
      tableData: [],
      tableTotalCount: 0,
      tableLoading: false,
      dialogVisible: false,
      tableSelections: [],
      editFileFlag: false,
      editDialogLoding: false,
      customerLoading: false,
      firstLoadCustomerList: true,
      rawFirstLoadedCustomerList: [],
      prevWorkShopList: [],
      batchUploadFileList: []
    };
  },
  async mounted() {
    this.getDeviceList();
    if (this.userInfo.userType == 2) {
      this.getSearchWorkShopList(this.userInfo.companyId);
      this.uplodForm.companyId = this.userInfo.companyId;
    }
    this.handleTableHeight();
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 140}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
    if (this.userInfo.userType != 2) {
      await this.customerFilter();
    }
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
      this.getDeviceList()
      this.$refs["selectCustomer"].clearSelectCustomer()
    },
    tableTitleSearch(obj){
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      if(obj.paramValue=="date"){
        if(searchVal){
          this.searchForm.startTime = searchVal[0]
          this.searchForm.endTime = searchVal[1]
        }else{
          delete this.searchForm.startTime
          delete this.searchForm.endTime
        }
      }else if(obj.paramValue=="status"){
        if(searchVal.includes('5')) searchVal = []
        this.searchForm[obj.paramValue] = searchVal.toString()
      }else{
        this.searchForm[obj.paramValue] = searchVal
      }
      this.getDeviceList()
    },
    changeSortTable() {},
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
      this.getDeviceList()
    },
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        let deviceDocumentDiv=0
        let searchFormHeight=0
        if (document.getElementById("deviceDocumentDiv")) {
          deviceDocumentDiv = document.getElementById("deviceDocumentDiv").clientHeight;
        }
        if (document.getElementById("searchForm")) {
          searchFormHeight = document.getElementById("searchForm").clientHeight;
        }
        this.tableHeight = Number(deviceDocumentDiv) - Number(searchFormHeight) - 40;
      }, 200);
    },
    gioTrack() {
      
    },
    noCustomerTip(tipType = "warning") {
      if (this.userInfo.userType == 2) return;
      const flag = tipType == "warning" ? !this.searchForm.companyId : !this.uplodForm.companyId;
      if (flag) {
        this.workShopSearchList = [];
        this.$message({
          type: tipType,
          message: "请先选择客户"
        });
      }
    },
    selectTable(val) {
      this.tableSelections = val;
    },
    handleSizeChange(val) {
      this.pageInfo.size = val;
      this.getDeviceList();
    },
    handleCurrentChange(val) {
      this.pageInfo.current = val;
      this.getDeviceList();
    },
    changeSelCustomer() {
      this.uplodForm.workshopIds = [];
    },
    async previewFile(row) {
      const params = {
        url: encodeURI(row.fileUrl)
      };
      const res = await this.requestMethodGet("/web/file/getFullUrl", params);
      if (res.data.code == 1000) {
        window.open(res.data.data, "_blank");
      } else {
        this.$message({
          type: "warning",
          message: res.data.msg
        });
      }
    },
    async editFile(row) {
      console.log(row)
      this.editFileFlag = true;
      this.uplodForm.companyId = row.companyId;
      this.uplodForm.status = row.status.toString();
      this.uplodForm.fileDesc = row.fileDesc || "";
      this.uplodForm.id = row.id;
      this.customerFilter(row.companyName)
      this.dialogVisible = true;
      this.editDialogLoding = true;
      const detail = await this.getFileDetail(row.id, row.companyId);
      await this.getSearchWorkShopList(row.companyId);
      this.editDialogLoding = false;
      const { workshopIds } = detail;
      this.uplodForm.workshopIds = (workshopIds.split(",")).map(Number);
      console.log(this.uplodForm.workshopIds)
      this.$gio.editDeviceDoc({
        customer: row.companyName
      });
    },
    async getFileDetail(id, companyId) {
      const params = {
        id,
        companyId
      };
      const res = await this.requestMethodGet("/web/deviceInstructions/getInstructionsDetail", params);
      if (res.data.code == 1000) {
        return res.data.data;
      } else {
        this.$message({
          type: "warning",
          message: res.data.msg
        });
      }
    },
    deleteFile(row) {
      this.$confirm("此操作将删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const params = {
            id: row.id,
            companyId: row.companyId
          };
          const res = await this.requestMethodGet("/web/deviceInstructions/deleteDeviceInstructions", params);
          if (res.data.code == 1000) {
            this.getDeviceList();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.$gio.deleteDeviceDocument({
              operation: "确认删除设备资料",
              customer: row.companyName,
              docType: "公共资料"
            });
          } else {
            this.$message({
              type: "warning",
              message: res.data.msg
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    cancel() {
      if (!this.editFileFlag) {
        this.$refs.BatchUpload && this.$refs.BatchUpload.resetUplaod();
      }
      this.uplodForm = {
        companyId: this.userInfo.userType == 2 ? this.userInfo.companyId : "",
        workshopIds: [],
        status: "1",
        fileDesc: ""
      };
      this.$refs.uploadForm.resetFields();
      this.customerSearchList = this.rawFirstLoadedCustomerList;
      this.editFileFlag = false;
      this.dialogVisible = false;
      if (this.searchForm.companyId) {
        this.workShopSearchList = this.prevWorkShopList;
      }
      this.$gio.editExclusiveDoc({
        operation: "取消编辑",
        customer: this.$gio.findValueCodeCorresponding(this.customerSearchList, this.uplodForm.companyId, "companyId", "companyName")
      });
    },
    downloadFile() {
      if (!this.tableSelections || this.tableSelections.length == 0) {
        this.$message({
          message: "请先选择文件",
          type: "warning"
        });
        return;
      }
      if (this.tableSelections.length == 1) {
        this.downloadRowFile(this.tableSelections[0]);
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: '数据下载中，请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const paramObj = {
        ids: this.tableSelections.map(item => item.id).join(","),
        responseTypeBlob: true
      };
      this.requestMethodGet("/web/deviceInstructions/downloadInstructions", paramObj).then(res => {
          let fileReader = new FileReader()
          loading.close()
          const downLoadFileName = res.headers["content-disposition"].split("; ")[1].split("=")[1];
          let that = this;
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
                type: "application/zip"
              });
              const objectUrl = URL.createObjectURL(blob);
              let link = document.createElement("a");
              link.style.display = "none";
              link.href = objectUrl;
              link.setAttribute("download", "设备资料.zip");
              document.body.appendChild(link);
              link.click();
              that.$message({
                message: "下载成功",
                type: "success"
              });
            }
          };
          fileReader.readAsText(res.data);
        })
        .catch((res) => {
          loading.close()
        });
    },
    downloadRowFile(row) {
      this.$gio.downloadDeviceDocument({
        operation: "点击下载按钮",
        docType: "公共资料",
        customer: row.companyName
      });
      const params = {
        url: row.fileUrl
      };
      this.requestMethodGet("/web/file/getFullDownloadUrl", params).then(res => {
        if (res.data.code == 1000) {
          window.open(res.data.data);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    uplaodFile() {
      this.customerSearchList = this.rawFirstLoadedCustomerList;
      this.dialogVisible = true;
      this.$gio.uploadPublicDoc({
        customer: this.$userInfo.orgInfo.companyName
      });
    },
    uploadFormFile() {
      this.$refs.uploadForm.validate(async valid => {
        if (valid) {
          this.batchUploadFileList = this.$refs.BatchUpload.uploadFileList;
          if (this.batchUploadFileList.length == 0) {
            this.$message({
              type: "warning",
              message: "请选择文件"
            });
            return;
          }

          const uplaodRes = await this.batchUpload(this.saveDeviceFile, this.uplodForm);
          const allSuccessfFlag = uplaodRes.every(item => item == 200);
          if (allSuccessfFlag) {
            this.$message({
              type: "success",
              message: "文件上传成功"
            });
            this.resetSearch();
            this.getDeviceList();
            this.cancel();
            this.$refs.BatchUpload.resetUplaod();
          }
        }
      });
    },
    async saveDeviceFile(uploadForm) {
      return this.requestMethodPost("/web/deviceInstructions/saveDeviceInstructions", { ...uploadForm }).then(res => {
        if (res.data.code == 1000) {
          return 200;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    updateFile() {
      const editForm = JSON.parse(JSON.stringify(this.uplodForm));
      delete editForm.filePath;
      this.requestMethodPost("/web/deviceInstructions/updateDeviceInstructions", { ...editForm }).then(res => {
        if (res.data.code == 1000) {
          this.getDeviceList();
          this.cancel();
          this.$gio.editExclusiveDoc({
            operation: "确定编辑",
            customer: this.$gio.findValueCodeCorresponding(this.customerSearchList, editForm.companyId, "companyId", "companyName")
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    getDeviceList() {
      this.tableLoading = true;
      const params = {
        ...this.pageInfo,
        instructionType: 2
      };
      Object.assign(params, this.searchForm);
      if(params.status=="5"){
        params.status=""
      }
      params.companyIds = this.searchForm.companyId
      delete params.companyId

      this.requestMethodGet("/web/deviceInstructions/getMyInstructions", params).then(res => {
        if (res.data.code == 1000) {
          this.tableData = res.data.data.list;
          this.tableTotalCount = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
        this.tableLoading = false;
      });
    },
    resetSearch() {
      if(this.searchForm.companyId) {
        this.$refs["selectCustomer"].clearSelectCustomer()
      }
      this.searchForm = {
        fileName: "",
        companyId: "",
        workshopId: "",
        userName: "",
      };
      if (this.userInfo.userType != 2) {
        this.workShopSearchList = [];
      }
      this.selectCustomerList = []
      this.tableDataHeader.forEach(item=>{
        item.changeValue=""
      })
      this.getDeviceList()
    },
    clearCustomer(val) {
      if (!val) {
        this.customerFilter("");
        this.searchForm.workshopId = "";
        this.workShopSearchList = [];
        this.prevWorkShopList = [];
      }
    },
    async selCompany(companyItem, recordFlag) {
      if (recordFlag) {
        this.searchForm.workshopId = "";
      }
      const recorList = await this.getSearchWorkShopList(companyItem.companyId);
      if (recordFlag) {
        this.prevWorkShopList = recorList;
      }
    },
    async customerFilter(val) {
      let params = {
        size: 300,
        status: 1,
        accountName: val,
        menuCode:'CustomerProfileList'
      };
      this.customerLoading = true;
      await this.requestMethodPost("/web/customer/filterAccount", params).then(res => {
        res = res.data;
        if (res.code == 1000) {
          if (this.firstLoadCustomerList) {
            this.rawFirstLoadedCustomerList = JSON.parse(JSON.stringify(res.data.list));
            this.firstLoadCustomerList = false;
          }
          this.customerSearchList = res.data.list;
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
        this.customerLoading = false;
      });
    },
    gioFilterDocTrack(params) {
      this.$gio.filterDeviceDocument({
        docName: params.fileName,
        customer: this.$gio.findValueCodeCorresponding(this.customerSearchList, params.companyId, "companyId", "companyName"),
        workshop: this.$gio.findValueCodeCorresponding(this.workShopSearchList, params.workshopId, "workshopId", "workshopName"),
        uploadTime: `${params.startTime} - ${params.endTime}`
      });
    },
    async getSearchWorkShopList(id) {
      const params = {
        companyId: id,
        workshopName: "",
        current: 1,
        size: 500
      };
      return this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", params).then(res => {
        if (res.data.code == 1000) {
          const list = res.data.data.list || [];
          this.workShopSearchList = list;
          this.gioFilterDocTrack(params);
          return Promise.resolve(list);
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    }
  },
  watch: {
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/customTable.less";
.tab-wrap {
  /deep/ .el-button {
    font-size: 14px;
  }
  /deep/ .el-button:hover {
    border: 1px solid #e4e7ed;
    color: #dd0000;
    cursor: pointer;
    background-color: #fff;
  }
  /deep/ .el-button--danger:hover {
    color: #fff;
    cursor: pointer;
  }
}
.device-document {
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
.layout-container {
  /deep/ .el-dialog__body {
    padding-top: 0;
  }
  /deep/ .el-dialog {
    min-width: 440px;
  }
}
.search-bar {
  margin-top: 20px;
  display: flex;
  /deep/ .el-form {
    display: flex;
  }
  /deep/ .el-form-item {
    display: flex;
    margin-left: 20px;
    margin-bottom: 0;
  }
}
.upload-mask {
  z-index: 99999;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
