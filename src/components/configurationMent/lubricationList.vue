<template>
  <div class="customer-group-container">
    <!-- 查询 -->
    <div class="search-bar">
      <el-form :model="searchForm" style="display: flex; align-items: center; margin-left: 25px; width: 100%">
        <el-form-item label="设备类型" style="display: flex">
          <el-cascader
            size="small"
            v-model="searchForm.deviceCode"
            placeholder="请选择设备类型"
            :options="deviceTypeList"
            filterable
            clearable
            style="width: 100%"
            @change="searchTable"
            ref="searchDeviceRef"
            :props="{ value: 'code', label: 'name' }"
          >
          </el-cascader>
        </el-form-item>

        <el-form-item label="润滑点设备名称" style="display: flex; margin-left: 15px">
          <el-input size="small" @change="searchTable" v-model="searchForm.lubPointName" clearable style="width: 185px" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="状态" style="display: flex; margin-left: 15px">
          <el-select v-model="searchForm.status" @change="searchTable" clearable placeholder="请选择" label="状态" size="small" style="height: 32px; line-height: 32px; width: 185px">
            <el-option
              v-for="item in [
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ]"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-button size="small" style="margin-left: 5%" @click="resetSearch">重置</el-button>
      </el-form>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <div style="margin-bottom: 20px;">
        <el-button size="small" type="danger" @click="handleAdd">添加</el-button>
        <el-button size="small" type="danger" plain   @click="importData">批量导入</el-button>
        <el-button size="small" type="danger" plain   @click="handleDownloadSystem">批量下载</el-button>
      </div>
      <el-table :header-cell-style="{ background: '#f7f7f7' }" :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column show-overflow-tooltip prop="deviceCodeName" label="设备类型" />
        <el-table-column show-overflow-tooltip prop="lubPointName" label="润滑点设备名称" />
        <el-table-column show-overflow-tooltip prop="status" label="操作" width="150">
          <template slot-scope="scope">
            <div class="dv-item-table" style="display: inline-block">
              <el-button type="text" @click="handleEide(scope.row)">编辑</el-button>
            </div>
            <div v-if="scope.row.status == 1" class="dv-item-table" style="display: inline-block">
              <el-button type="text" @click="handleConif(scope.row, false)" style="color: red">禁用</el-button>
            </div>
            <div v-else class="dv-item-table" style="display: inline-block">
              <el-button type="text" @click="handleConif(scope.row, true)">启用</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="(dialogType=='add' ? '新建' : '编辑')+'核心设备润滑点'" :visible.sync="dialogTableVisible" width="30%" :close-on-click-modal="false">
      <el-form ref="deviceAndLupForm" :model="form" :rules="darules" label-position="left">
        <el-form-item label="设备类型" prop="deviceCode">
          <el-cascader
            :disabled="dialogType=='edit'"
            size="small"
            v-model="form.deviceCode"
            placeholder="请选择设备类型"
            :options="typeList"
            filterable
            clearable
            style="width: 100%"
            ref="deviceRef"
            :props="{ value: 'code', label: 'name' }"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="润滑点设备名称" prop="lubPointName">
          <el-input size="small" v-model="form.lubPointName" placeholder="请输入润滑点设备名称" maxlength="50">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelDialog('deviceAndLupForm')">取 消</el-button>
        <el-button type="danger" size="small" @click="onSubmit('deviceAndLupForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分页器 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.current"
      :page-size="pageInfo.size"
      :page-sizes="[10, 30, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableTotal1"
      style="float: right; display: flex; margin-top: 10px;margin-right:20px"
    >
    </el-pagination>
    <!-- 批量导入 -->
    <el-dialog title="批量导入" :visible.sync="dialogImportFlag" :close-on-click-modal="false" width="480px">
      <el-form ref="importForm">
        <el-form-item>
          <div>第一步： 下载模版，按照模版格式填写</div>
        </el-form-item>
        <el-form-item>
          <div style="color:rgb(0,20,80);cursor: pointer;display: flex;justify-content: center;" @click="downloadTemplate">下载模版（核心设备润滑点清单导入模版）</div>
        </el-form-item>
        <el-form-item>
          <div>第二步： 填写完模版后，上传Excel文件</div>
        </el-form-item>
        <el-form-item style="margin-top:20px;">
          <el-upload
            :class="{ hide: hideUpload || fileList.length > 0 }"
            drag
            action="uploadUrl"
            :key="uploadKey"
            :auto-upload="false"
            accept=".xlsx"
            :limit="1"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :on-change="handleFileChange"
            :file-list="fileList"
          >
            <div>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em style="color:#001450">点击上传</em></div>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelImport">取消</el-button>
        <el-button size="small" type="danger" @click="submitImport" :disabled="!fileList.length">立即导入</el-button>
      </span>
    </el-dialog>
    <!-- 导入结果 -->
    <el-dialog title="导入结果" :visible.sync="importResult" width="480px" :close-on-click-modal="false">
      <div style="padding-left:30%;line-height:40px;margin-top:30px;">
        <div>本次导入数据共 {{ batchEditResultObj.totalCount }} 条</div>
        <div style="color:#70B603">成功 {{ batchEditResultObj.successNums }} 条</div>
        <div style="color:#ff0000">失败 {{ batchEditResultObj.failNums }} 条</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importResult = false" size="small">关闭</el-button>
        <el-button v-if="batchEditResultObj.failNums > 0" type="danger" @click="failDetail" size="small">失败详情</el-button>
      </div>
    </el-dialog>
    <!-- 失败详情 -->
    <el-dialog title="失败详情" :visible.sync="failDetailVisible" width="70%" :close-on-click-modal="false" style="padding-bottom:40px;">
      <div style="padding:0px 20px;">
        <!-- 表格 -->
        <el-table ref="failTable" :key="failTableKey" :data="failTableData" tooltip-effect="dark" max-height="500" style="width: 100%" :header-cell-style="{ background: '#f7f7f7' }" stripe>
          <el-table-column prop="lineNumber" label="第几行" min-width="15%" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fieldsName" show-overflow-tooltip label="字段名称" min-width="30%"></el-table-column>
          <el-table-column prop="failureDetails" label="失败详情" min-width="40%" show-overflow-tooltip></el-table-column>
        </el-table>
        <!-- <el-pagination
          background
          @size-change="failSizeChange"
          @current-change="failCurrentChange"
          :current-page="failCurrent"
          :page-size="failSize"
          :page-sizes="[10, 20, 30, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="failTotal"
          style="float: right; display: flex; margin-top: 10px;position: static;"
        ></el-pagination> -->
      </div>
      <div slot="footer" class="dialog-footer" style="margin-top:40px;">
        <el-button @click="failDetailVisible = false" size="small">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      centerDialogVisible: false, //弹出对话框
      searchForm: {
        deviceCode: "",
        lubPointName: "",
        status: "",
      },
      readFlag: [
        { value: "1", label: "启用" },
        { value: "0", label: "禁用" },
      ],
      pageInfo: {
        current: 1,
        size: 30,
      },
      dialogTableVisible: false, // 弹出框
      form: {
        deviceCode: "",
        lubPointName: "",
      },
      darules: {
        deviceCode: [{ required: true, message: "请选择设备类型", trigger: "change" }],
        lubPointName: [{ required: true, message: "请输入润滑点设备名称", trigger: "blur" }],
      },
      lubricationPointTypeList: [], // 类别下拉
      lubricationPointNameList: [], // 名称下拉
      typeList:[],
      dialogType:'',
      tableTotal1:0,
      dialogImportFlag:false,
      hideUpload:false,
      fileList:[],
      uploadKey:1,
      importResult:false,
      batchEditResultObj: {
        failNums: 0,
        successNums: 0,
        totalCount: 0,
      },
      failTableKey: 1,
      failDetailVisible: false,
      deviceTypeList:[]
    };
  },
  created() {
    this.getCustomerGruopList(); //列表数据
    this.$_queryLPData(); // 获取类型下拉
    this.getDeviceFilterData()
  },
  methods: {
    // 批量导入
    importData(){
      this.uploadKey += 1;
      this.hideUpload = false;
      this.dialogImportFlag = true
    },
    // 下载模板
    downloadTemplate() {
      this.requestMethodGet("/web/file/getFullDownloadUrl", { url: 'device/core/核心设备润滑点清单导入模板.xlsx' }).then(res => {
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
    // 文件上传删除
    handleRemove(file, fileList) {
      this.fileList = [];
      this.hideUpload = fileList.length >= 1;
    },
    // 文件上传超出限制
    handleExceed(files, fileList) {
      this.$message.error(`最多上传 1 个文件`);
    },
    // 文件上传改变
    handleFileChange(file, fileList) {
      this.hideUpload = fileList.length >= 1;
      this.fileList = fileList;
    },
    // 取消导入
    cancelImport() {
      this.dialogImportFlag = false;
      this.fileList = [];
    },
    // 导入
    submitImport() {
      let params = new FormData();
      params.append("multipartFile", this.fileList[0].raw);
      this.requestMethodPost('/device/coreDeviceLubPoint/import', params).then(res => {
          if (res.data.code == 1000) {
            const data = res.data.data
            const total = data.failNums + data.successNums
            this.batchEditResultObj = data
            this.batchEditResultObj.totalCount = total
            this.cancelImport()
            this.importResult = true;
            this.getCustomerGruopList();
            if (data.failNums > 0) {
              // 查询失败详情
              this.failSize = 10;
              this.failCurrent = 1;
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
     // 失败详情
     failDetail() {
      ++this.failTableKey;
      this.failTableData = this.batchEditResultObj.errorRecordInfos
      this.failTotal = this.batchEditResultObj.errorRecordInfos.length
      this.failDetailVisible = true;
    },
    handleDownloadSystem() {
      let deviceCode = ''
      if(this.searchForm.deviceCode.length){
        deviceCode = this.searchForm.deviceCode[this.searchForm.deviceCode.length-1]
      }
      const loading = this.$loading({
        lock: true,
        text: "数据下载中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.requestMethodGet("/device/coreDeviceLubPoint/export", { deviceCode: deviceCode, lubPointName: this.searchForm.lubPointName,status: this.searchForm.status, responseTypeBlob: true }).then(res => {
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
              link.setAttribute("download", "核心设备润滑点清单.xlsx");
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
    handleEide(item) {
      this.form = _.cloneDeep(item)
      this.dialogType = 'edit'
      this.dialogTableVisible = true;
      console.log('this.form',this.form)
    },
    handleAdd() {
      this.dialogType = 'add'
      this.dialogTableVisible = true;
    },
    getDeviceFilterData(){
      this.requestMethodGet("weChat/device/queryDeviceTypeTree4ByStatus", {filterFlag:true}).then((res) => {
        res = res.data;
        if (res.code == 1000) {
          if (res.data && res.data.length > 0) {
            this.deviceTypeList = res.data;
          }
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
          });
        }
      });
    },
    $_queryLPData() {
      this.requestMethodGet("weChat/device/queryAllDeviceTypeTree4", {filterFlag:true}).then((res) => {
        res = res.data;
        if (res.code == 1000) {
          if (res.data && res.data.length > 0) {
            this.lubricationPointTypeList = res.data;
            this.typeList = res.data;
          }
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
          });
        }
      });
    },
    // 润滑点设备类型 change 事件 ================
    handleLubricationPointTypeChange(val) {
      if (val) {
        var obj = {};
        obj = this.lubricationPointTypeList.filter((item) => {
          return item.code === val;
        });
        if (obj[0].state == 1) {
          // 选择没有启用的类型
          this.requestMethodGet("/web/config/oil/getOilCascadeMenu", { deviceCode: obj[0].code, status: 1 }).then((res) => {
            this.form.lubricationPointName;
            // 请求列表数据 --- 赋值给lubricationPointNameList，
            this.lubricationPointNameList = res.data.data;
          });
        }
      }
    },
    resetSearch() {
      // 重置功能 所有定义为空
      this.searchForm = {
        deviceCode: "",
        lubPointName: "",
        status: "",
      };
      this.pageInfo.current = 1
      this.pageInfo.size = 30
      this.getCustomerGruopList()
    },
    getCustomerGruopList() {
       this.loading = true;
       const params = {
          ...this.pageInfo,
          ...this.searchForm
        };
       if (this.searchForm.deviceCode.length) {
        params.deviceCode = this.searchForm.deviceCode[this.searchForm.deviceCode.length-1]
       }
      this.requestMethodGet("/device/coreDeviceLubPoint/pageList", params).then(res=>{
        if (res.data.code == 1000) {
          this.tableData = res.data.data.list;
          this.tableTotal1 = res.data.data.totalCount;
          this.loading = false;
        }else{
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      })
      
    },
    handleSizeChange(val) {
      this.pageInfo.size = val
      this.getCustomerGruopList()
    },
    handleCurrentChange(val) {
      this.pageInfo.current = val
      this.getCustomerGruopList()
    },
    searchTable(){
      this.pageInfo.current = 1
      this.getCustomerGruopList()
    },
    // 禁用启用
    handleConif(item, pd) {
      if (pd) {
        this.$confirm("确定要启用这条数据吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // 发送启用的请求  item拿信息
            this.requestMethodGet("/device/coreDeviceLubPoint/enableOrDisable", { id: item.id, status: 1 }).then((res) => {
              this.getCustomerGruopList(); //列表数据
              this.$message({
                message: "启用成功",
                type: "success",
              });
            });
          })
          .catch(() => {
            
          });
      } else {
        this.$confirm("确定要禁用这条数据吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // 发送启用的请求  item拿信息
            this.requestMethodGet("/device/coreDeviceLubPoint/enableOrDisable", { id: item.id, status: 0 }).then((res) => {
              this.getCustomerGruopList(); //列表数据
              this.$message({
                message: "禁用成功",
                type: "success",
              });
            });
          })
          .catch(() => {
           
          });
      }
    },

    // 编辑确认
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url =''
          let params = {}
          this.form.deviceCode = this.$refs.deviceRef.getCheckedNodes()[0].data.code
          if(this.dialogType == 'add'){
            params = Object.assign({},this.form,{status:1})
            url = '/device/coreDeviceLubPoint/insert'
          }else{
            params = this.form
            url = '/device/coreDeviceLubPoint/update'
          }
          // console.log('======',this.form,this.$refs.deviceRef.getCheckedNodes()[0])
          this.requestMethodPost(url, params).then((res) => {
            if(res.data.code==1000){
              let msg = this.dialogType == 'add' ? '添加成功' : '编辑成功'
              this.$message({
                message: msg,
                type: "success",
              })
              this.cancelDialog(formName)
              this.getCustomerGruopList() //列表数据
            }else{
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 取消
    cancelDialog(formName){
      this.$refs['deviceAndLupForm'].resetFields();
      for(let key in this.form){
        this.form[key] = ''
      }
      this.dialogTableVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.customer-group-container {
  position: relative;
}
.search-bar {
  margin-top: 20px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: 100%;
  justify-content: space-around;
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
}
.table-container {
  height: calc(100vh - 300px);
  cursor: pointer;
  overflow: auto;
  margin-top: 50px;
  padding: 0 20px;
  .dv-item-table {
    > span.red {
      display: inline-block;
      color: red;
      margin-right: 10px;
    }
    span:last-child {
      color: #3f82ef;
    }
  }
}
.hide /deep/.el-upload {
  display: none !important;
}
</style>
