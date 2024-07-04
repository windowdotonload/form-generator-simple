<template>
  <div class="toolkit-container">
    <div style="display:flex;justify-content:flex-end;margin-bottom:10px;">
      <el-button :type="configData.length>19?'info':'danger'" :disabled="configData.length>19" size="small" @click="handleAddEdit('add')">新建</el-button>
    </div>
    <custom-table :tableHeader="tableDataHeader" :tableData="configData" :tableHeight="tableHeight + ''" :loading="loading">
      <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-link style="margin-right: 10px; color: rgb(0, 20, 79)" :underline="false" @click="handleAddEdit('edit', scope.row)">编辑</el-link>
          <el-link :style="scope.row.status==1?'color: #666;cursor:default;':'color: #dd0000'" :underline="false" @click="deleteConfigParams(scope.row)">删除</el-link>
        </template>
      </el-table-column>
    </custom-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
      <div>
        <el-form ref="configForm" label-width="100px" :model="configForm" label-position="left" :rules="configRules">
          <el-form-item label="应用示例：" prop="name">
            <el-input size="small" v-model="configForm.name" style="width: 40%" placeholder="请输入(10字以内)" :maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-radio-group v-model="configForm.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="图片：" prop="picPath">
            <span style="color:#999;">(最多上传10张)</span>
          </el-form-item>
          <el-form-item>
            <imgUpload :loop-item="popImgItem" />
          </el-form-item>
        </el-form>
        <div class="footer-btn">
          <el-button plain size="small" @click="cancelSave">取消</el-button>
          <el-button type="danger" size="small" @click="saveConfig">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import customTable from "../tableComponents/customTable.vue";
import columnHeader from "../tableComponents/headerComponent";
import imgUpload from "@/components/businessComponents/components/img-upload";
export default {
  components: {
    imgUpload,
    "custom-table": customTable,
    "column-header": columnHeader
  },
  created() {
    this.getConfigList();
  },
  data() {
    var validateImage = (rule, value, callback) => {
      if (this.popImgItem.imgFullDtoUrl.length==0) {
        return callback(new Error("请上传图片"));
      } else {
        callback();
      }
    };
    return {
      dialogTitle: '',
      configData: [],
      existUpload: false,
      dialogVisible: false,
      popImgItem: {
        imgFullDtoUrl: [],
        length: 10,
        cutWidth: 500,
        cutHeight: 100,
        styleJsonDto:{
          cutWidth: 500,
          cutHeight: 100
        }
      },
      configForm: {
        id: '',
        name: "",
        status: 1
      },
      configRules: {
        name: [{ required: true, message: "请输入应用示例", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态 ", trigger: "blur" }],
        picPath: [{ required: true, validator: validateImage, trigger: "blur" }]
      },
      loading: false,
      tableHeight: null,
      tableDataHeader: [
        { label: "应用示例", prop: "name", width: "400", tooltip: true },
        { label: "图片数量", prop: "imgCount", width: "200", tooltip: true },
        { label: "状态", prop: "statusDesc", width: "200", tooltip: true },
        { label: "操作", slot: "operation" }
      ]
    };
  },
  mounted() {
    this.getTableHeight();
    window.addEventListener("resize", () => {
      this.getTableHeight();
    });
  },
  methods: {
    async deleteConfigParams(row) {
      if(row.status==1) return
      this.$confirm(`请确认是否删除？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'deletBtn',
          type: 'warning'
        })
        .then(() => {
          this.confirmSelect(row)
        })
        .catch(() => {})
    },
    async confirmSelect(row) {
      const res = await this.requestMethodGet('/conf/pop/image/delete', {id: row.id});
      if (res.data.code == 1000) {
        this.$message({
          type: "success",
          message: "删除成功"
        });
        this.getConfigList();
      } else {
        this.$message({
          type: "warning",
          message: res.data.msg
        });
      }
    },
    async getFullpath(halfPath) {
      const res = await this.requestMethodGet("/web/file/getFullUrl", {
        url: halfPath
      });
      if (res.data.code == 1000) {
        return Promise.resolve(res.data.data);
      } else {
        this.$message({
          type: "warning",
          message: "获取全路径失败，请稍后重试。"
        });
      }
    },
    async getConfigList() {
      this.loading = true;
      const res = await this.requestMethodGet("/conf/pop/image/list", {});
      if (res.data.code == 1000) {
        this.configData = res.data.data;
      }
      this.loading = false;
    },
    async saveForm() {
      let imgUrlStr = this.popImgItem.value
      let url = '/conf/pop/image/add'
      let params = {
        name: this.configForm.name,
        status: this.configForm.status,
        imgUrlStr: imgUrlStr
      };
      if(this.configForm.id){
        params.id=this.configForm.id
        url = '/conf/pop/image/update'
      }
      const res = await this.requestMethodPost(url, params);
      if (res.data.code == 1000) {
        if(this.configForm.id){
          this.$message({
            type: "success",
            message: "编辑成功"
          });
        }else{
          this.$message({
            type: "success",
            message: "新增成功"
          });
        }
        this.dialogVisible = false;
        await this.getConfigList();
      } else {
        this.$message({
          type: "warning",
          message: res.data.msg
        });
      }
    },
    handleClose() {
      this.dialogVisible = false;
    },
    async handleAddEdit(type, rowData) {
      if(type=='add'){
        this.dialogTitle = '图片配置-新建'
        this.configForm = {
          name: "",
          status: 1
        }
        this.popImgItem = {
            imgFullDtoUrl: [],
            length: 10,
            cutWidth: 500,
            cutHeight: 100,
            styleJsonDto:{
              cutWidth: 500,
              cutHeight: 100
            }
          }
      }else{
        this.dialogTitle = '图片配置-编辑'
        const res = await this.requestMethodGet('/conf/pop/image/detail', {id: rowData.id});
        if (res.data.code == 1000) {
          let urlHalfList = res.data.data.imgUrlStr.split(',')
          let imgUrlList = res.data.data.imgUrlList
          this.popImgItem.imgFullDtoUrl = []
          this.configForm = {
            id: res.data.data.id,
            name: res.data.data.name,
            status: res.data.data.status
          }
          urlHalfList.forEach((item,index)=>{
            this.popImgItem.imgFullDtoUrl.push({
              url: imgUrlList[index],
              urlHalf: item
            })
          })
          this.popImgItem.value = urlHalfList.join(',')
        } 
      }
      this.dialogVisible = true;
    },
    /** 编辑配置数据*/
    cancelSave() {
      this.configForm = {
        toolName: "",
        toolType: "",
        target: [],
        picPath: ""
      };
      this.dialogVisible = false;
    },
    saveConfig() {
      this.$refs.configForm.validate(valid => {
        if (valid) {
          this.saveForm();
          return;
        }
      });
    },
    getTableHeight() {
      this.tableHeight = document.documentElement.clientHeight - 190;
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.getTableHeight();
    });
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/customTable.less";
.toolkit-container {
  padding: 0 20px 0 20px;
}
.footer-btn {
  display: flex;
  justify-content: flex-end;
}
</style>
