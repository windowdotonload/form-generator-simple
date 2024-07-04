<template>
  <div class="toolkit-container">
    <custom-table :tableHeader="tableDataHeader" :tableData="configData" :tableHeight="tableHeight + ''" :loading="loading">
      <template v-slot:toolType="slotProps">
        <el-table-column
          label="类型"
          :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
          :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
          show-overflow-tooltip
        >
          <template #default="scope">
            <span>{{ scope.row | convertFilter("toolType", $options.customProperties) }}</span>
          </template>
        </el-table-column>
      </template>
      <template v-slot:target="slotProps">
        <el-table-column
          label="权限开放"
          :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
          :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
          show-overflow-tooltip
        >
          <template #default="scope">
            <span>{{ scope.row | convertFilter("target", $options.customProperties) }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
      <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="300" align="center">
        <template #default="scope">
          <el-link style="margin-right: 10px; color: rgb(0, 20, 79)" :underline="false" @click="editConfig(scope.row)">编辑</el-link>
          <el-link style="color: rgb(0, 20, 79)" :underline="false" v-if="configToolList.includes(scope.row.toolCode)" @click="editConfigParams(scope.row)">配置数据</el-link>
        </template>
      </el-table-column>
    </custom-table>
    <el-dialog title="计算工具配置编辑" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div>
        <el-form ref="configForm" label-width="90px" :model="configForm" label-position="left" :rules="configRules">
          <el-form-item label="标题" prop="toolName">
            <el-input size="small" v-model="configForm.toolName" style="width: 70%" placeholder="请输入标题" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="toolType">
            <el-radio-group v-model="configForm.toolType">
              <el-radio :label="0">基本</el-radio>
              <el-radio :label="1">高级</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="权限开放" prop="target">
            <el-checkbox-group v-model="configForm.target">
              <el-checkbox :label="0">美孚账号</el-checkbox>
              <el-checkbox :label="1">经销商账号</el-checkbox>
              <el-checkbox :label="2">工业客户账号</el-checkbox>
              <el-checkbox :label="3">游客</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="上传图标" prop="picPath">
            <el-upload
              style="width: 100%; display: flex"
              size="small"
              action=""
              ref="uploadPic"
              accept="image/*"
              :limit="1"
              :multiple="false"
              :auto-upload="false"
              :on-change="handleAddFile"
              :on-remove="handleRemove"
              :file-list="fileList"
              :list-type="uploadListType"
              :class="existUpload ? 'upload-hide' : ''"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="footer-btn">
          <el-button plain size="small" @click="cancelSave">取消</el-button>
          <el-button type="danger" size="small" @click="saveConfig">保存</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="计算工具配置编辑" :visible.sync="configParamsDialogVisible" :width="configEditParams.toolCode == 'TCO' ? '30%' : '50%'" :before-close="handleCloseConfig">
      <div>
        <el-form :model="configEditParams" ref="configFormParams" label-width="120px" label-position="left">
          <el-form-item label-width="255px" label="标题">
            <el-input size="small" v-model="configEditParams.toolName" style="width: 70%" placeholder="请输入标题" :maxlength="50" disabled></el-input>
          </el-form-item>
          <el-form-item
            :prop="'TCOConfigList.' + index + '.value'"
            label-width="255px"
            v-for="(item, index) in configEditParams.TCOConfigList"
            :key="item.key"
            :label="item.label"
            :rules="item.itemRules"
          >
            <el-input size="small" v-model="item.value" style="width: 70%" placeholder="请输入标题" :maxlength="10"></el-input>
          </el-form-item>
        </el-form>
        <div class="footer-btn">
          <el-button plain size="small" @click="cancelSaveConfigParams">取消</el-button>
          <el-button type="danger" size="small" @click="saveConfigParams">保存</el-button>
        </div>
      </div>
      <!-- <ConfigTCOCV :configEditParams="configEditParams" :parent="this" /> -->
    </el-dialog>
  </div>
</template>

<script>
import { configToolList, TCOConfigList, copyToolList } from "./data";
import customTable from "../tableComponents/customTable.vue";
import columnHeader from "../tableComponents/headerComponent";
const customProperties = {
  rangeTarget: {
    0: "美孚",
    1: "经销商",
    2: "客户",
    3: "游客"
  },
  toolTypeMap: {
    0: "基本",
    1: "高级"
  }
};
export default {
  components: {
    "custom-table": customTable,
    "column-header": columnHeader,
    ConfigTCOCV: () => import("./components/configTCOCV/index.vue")
  },
  customProperties,
  created() {
    this.getToolkitList();
  },
  data() {
    return {
      editActiveEditParamsRowId: null,
      configToolList,
      copyToolList,
      configEditParams: {
        TCOConfigList: JSON.parse(JSON.stringify(TCOConfigList))
      },
      configData: [],
      uploadListType: "picture-card",
      existUpload: false,
      dialogVisible: false,
      configParamsDialogVisible: false,
      configForm: {
        toolName: "",
        toolType: "",
        target: [],
        picPath: ""
      },
      fileList: [],
      opActiveRow: null,
      configRules: {
        toolName: [{ required: true, message: "请输入标题", trigger: "blur" }],
        toolType: [{ required: true, message: "请选择类型", trigger: "blur" }],
        target: [{ required: true, message: "请选权限开放", trigger: "blur" }],
        picPath: [{ required: true, message: "请上传图标", trigger: "blur" }]
      },
      loading: false,
      tableHeight: null,
      tableDataHeader: [
        { label: "标题", prop: "toolName", width: "180", tooltip: true },
        { label: "类型", slot: "toolType", width: "180", tooltip: true },
        { label: "权限开放", slot: "target", width: "180", tooltip: true },
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
    copyURL(row) {
      console.log(row);
      const src = `${location.origin}/tool/#/toolkit/tcocv?configuration=${encodeURIComponent(row.configuration)}`;
      const input = document.createElement("input");
      input.setAttribute("readonly", "readonly");
      input.setAttribute("value", src);
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, 9999);
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        this.$message({
          type: "success",
          message: "复制成功"
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
    async getToolkitList() {
      this.loading = true;
      const res = await this.requestMethodGet("/toolkit/queryToolConfigList", {
        isConfig: 1,
        current: 1,
        size: 30
      });
      if (res.data.code == 1000) {
        this.configData = res.data.data.list;
      }
      this.loading = false;
      const configParmas = JSON.parse(this.configData[this.configData.length - 1].configuration);

      configParmas &&
        configParmas.forEach((item, index) => {
          TCOConfigList[index].value = item.value;
        });
    },
    async saveForm() {
      const params = JSON.parse(JSON.stringify(this.configForm));
      params.target = params.target.join(",");
      const res = await this.requestMethodPost("/toolkit/updateToolConfig", {
        ...params,
        id: this.opActiveRow.id
      });
      if (res.data.code == 1000) {
        this.$message({
          type: "success",
          message: "编辑成功"
        });
        await this.getToolkitList();
        this.dialogVisible = false;
      } else {
        this.$message({
          type: "warning",
          message: res.data.msg
        });
      }
    },
    handleAddFile(file) {
      this.existUpload = true;
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
      params.append("fileType", "toolkit_file");
      params.append("multipartFiles", file.raw);
      this.requestMethodPost("/web/file/uploadFiles", params).then(res => {
        res = res.data;
        if (res.code == 1000) {
          this.configForm.picPath = res.data[0];
        } else {
          this.existUpload = false;
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    handleRemove() {
      this.configForm.picPath = "";
      this.existUpload = false;
    },
    handleClose() {
      this.fileList = [];
      this.opActiveRow = null;
      this.dialogVisible = false;
    },
    editConfig(rowData) {
      this.existUpload = false;
      this.opActiveRow = rowData;
      if (rowData.picPath) {
        this.fileList = [
          {
            name: "existPic",
            url: rowData.picFullPath
          }
        ];
        this.existUpload = true;
      } else {
        this.fileList = [];
        this.existUpload = false;
      }
      this.configForm.toolName = rowData.toolName || "";
      this.configForm.toolType = parseInt(rowData.toolType || "0");
      this.configForm.target = rowData.target.split(",").map(item => parseInt(item));
      this.configForm.picPath = rowData.picPath;
      this.dialogVisible = true;
    },

    /** 编辑配置数据*/

    editConfigParams(row) {
      const { picPath, target, toolName, toolType, toolCode } = row;
      this.configEditParams = {
        toolCode,
        picPath,
        target,
        toolName,
        toolType,
        ...row,
        TCOConfigList: JSON.parse(row.configuration)
      };
      this.configEditParams.toolName = row.toolName;
      this.editActiveEditParamsRowId = row.id;
      this.configParamsDialogVisible = true;
    },
    cancelSaveConfigParams() {
      this.configEditParams = {
        TCOConfigList: JSON.parse(JSON.stringify(TCOConfigList))
      };
      this.editActiveEditParamsRowId = null;
      this.configParamsDialogVisible = false;
    },
    handleCloseConfig() {
      this.configEditParams = {
        TCOConfigList: JSON.parse(JSON.stringify(TCOConfigList))
      };
      this.editActiveEditParamsRowId = null;
      this.configParamsDialogVisible = false;
    },
    saveConfigParams() {
      const tempParams = this.configEditParams.TCOConfigList.map(item => {
        const { key, value, label } = item;
        return {
          key,
          value,
          label
        };
      });

      this.$refs.configFormParams.validate(async val => {
        if (val) {
          const params = {
            ...this.configEditParams,
            configuration: JSON.stringify(tempParams)
          };

          const res = await this.requestMethodPost("/toolkit/updateToolConfig", {
            ...params,
            id: this.editActiveEditParamsRowId
          });
          if (res.data.code == 1000) {
            this.$message({
              type: "success",
              message: "编辑数据成功"
            });
            await this.getToolkitList();
            this.handleCloseConfig();
          } else {
            this.$message({
              type: "warning",
              message: res.data.msg
            });
          }
        }
      });
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
      this.tableHeight = document.documentElement.clientHeight - 160;
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.getTableHeight();
    });
  },
  filters: {
    convertFilter(value, rowType, keyMap) {
      const { rangeTarget, toolTypeMap } = keyMap;
      switch (rowType) {
        case "target":
          return value.target
            .split(",")
            .map(item => rangeTarget[item])
            .join(",");
        case "toolType":
          return toolTypeMap[value.toolType];
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/customTable.less";
.toolkit-container {
  padding: 0 20px 0 20px;

  /deep/ .el-upload--picture-card {
    display: flex;
    width: 100px;
    height: 100px;
    align-items: center;
    justify-content: center;
  }

  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
    transition: none;
  }
}
.footer-btn {
  display: flex;
  justify-content: flex-end;
}
.upload-hide {
  /deep/ .el-upload--picture-card {
    display: none;
  }
}
</style>
