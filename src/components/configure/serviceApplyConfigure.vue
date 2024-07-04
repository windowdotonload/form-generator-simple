<template>
  <div :style="mainminheight" class="classific-service-apply-content">
    <!-- 分类与服务 -->
    <div class="classic-service-content">
      <!-- 分类 -->
      <div class="classic-service-header left">
        <div class="left-title">
          <div class="line"></div>
          分类
        </div>
        <div class="right-btn">
          <el-button type="danger" size="small" @click="addClassificAndRequest('添加分类')">添加分类</el-button>
        </div>
      </div>
      <!-- 服务 -->
      <div class="classic-service-header">
        <div class="left-title">
          <div class="line"></div>
          服务
        </div>
        <!--  -->
        <div class="right-btn">
          <el-button :type="selectClassificLineRow.id == 1 ? 'info' : 'danger'" size="small" @click="addClassificAndRequest('添加诉求')" :disabled="selectClassificLineRow.id == 1">添加诉求</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <div class="classic-service-table-content">
      <!-- 分类表格 -->
      <div class="classic-service-table" :style="contentHeight">
        <el-table
          :data="classicTableData"
          :show-header="showHeader"
          @row-click="classficRowClick"
          @current-change="handleCurrentChange"
          highlight-current-row
          :row-class-name="classicTableRowClassName"
          style="width: 100%"
        >
          <el-table-column align="center">
            <template slot-scope="scope">
              <div style="display: flex; align-items: center; margin-left: 10px">
                <div
                  class="level-point"
                  :style="{
                    backgroundColor: scope.row.status == 0 ? '#dd0000' : '#008888'
                  }"
                ></div>
                <div style="margin-left: 10px">{{ scope.row.name }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template slot-scope="scope">
              <div style="margin-right: 10px">
                <el-button :style="{ color: scope.row.id == 1 ? '#999999' : '#001450' }" type="text" @click="editClassificAndRequest(scope.row, '编辑分类')" :disabled="scope.row.id == 1"
                  >编辑</el-button
                >
                <el-button :style="{ color: scope.$index == 0 ? '#999999' : '#001450' }" type="text" @click="sortUpOrDownClassific(scope.row, 'up')" :disabled="scope.$index == 0">上移</el-button>
                <el-button
                  :style="{
                    color: scope.$index == classicTableData.length - 1 ? '#999999' : '#001450'
                  }"
                  type="text"
                  @click="sortUpOrDownClassific(scope.row, 'down')"
                  :disabled="scope.$index == classicTableData.length - 1"
                  >下移</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 服务表格 -->
      <div class="classic-service-table table-right" :style="contentHeight">
        <el-table
          :data="selectClassificLineRow.children"
          :show-header="showHeader"
          highlight-current-row
          @row-click="serviceRowClick"
          @current-change="handleCurrentChange"
          :row-class-name="serviceTableRowClassName"
          style="width: 100%"
        >
          <el-table-column align="center">
            <template slot-scope="scope">
              <div style="display: flex; align-items: center; margin-left: 10px">
                <div
                  class="level-point"
                  :style="{
                    backgroundColor: scope.row.status == 0 ? '#dd0000' : '#008888'
                  }"
                ></div>
                <div style="margin-left: 10px">{{ scope.row.name }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template slot-scope="scope">
              <div style="margin-right: 10px">
                <el-button :style="{ color: scope.row.parentId == 1 ? '#999999' : '#001450' }" type="text" @click="editClassificAndRequest(scope.row, '编辑诉求')" :disabled="scope.row.parentId == 1">
                  编辑
                </el-button>
                <el-button :style="{ color: scope.$index == 0 ? '#999999' : '#001450' }" type="text" @click="sortUpOrDownClassific(scope.row, 'up')" :disabled="scope.$index == 0">上移</el-button>
                <el-button
                  :style="{
                    color: scope.$index == selectClassificLineRow.children.length - 1 ? '#999999' : '#001450'
                  }"
                  type="text"
                  @click="sortUpOrDownClassific(scope.row, 'down')"
                  :disabled="scope.$index == selectClassificLineRow.children.length - 1"
                  >下移</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 添加/编辑分类诉求-->
    <el-drawer :title="classificaTitle" :visible.sync="classificaDrawerFlag" :direction="direction" size="60%" @close="handleCloseDrawer" :destroy-on-close="true" :wrapperClosable="wrapperClosable">
      <div style="margin-left: 30px">
        <el-form ref="classificaForm" :model="classificaDrawerForm" :rules="classificaDrawerRules" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input
              clearable
              placeholder="请输入"
              v-model="classificaDrawerForm.name"
              size="small"
              style="width: 456px"
              :maxlength="classificaTitle == '添加诉求' || classificaTitle == '编辑诉求' ? 25 : 15"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="classificaDrawerForm.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="classificaTitle == '添加诉求' || classificaTitle == '编辑诉求'">
            <el-form-item v-for="(item, index) in servcieAdvise" :key="item.serviceId" :label="item.label">
              <div style="display: flex; align-items: center">
                <el-input show-word-limit style="width: 456px" type="textarea" :rows="2" :maxlength="50" placeholder="请输入" v-model="item.content"> </el-input>
                <span class="delete-icon" v-if="index > 0" @click="deleteService(index)"><span class="delete-icon-inner"></span></span>
              </div>
            </el-form-item>
            <span :style="servcieAdvise.length < 5 ? 'color: #001450;cursor:pointer' : 'color:#999;cursor: not-allowed;'" style="font-size: 14px" @click="addService">+ 新增服务建议</span>
          </template>
        </el-form>
      </div>
      <div class="footer-drawer" style="position: fixed; bottom: 20px; right: 10px">
        <el-button style="margin-left: auto" size="small" @click="cancelClassificaDraw('classificaForm')">取消</el-button>
        <el-button size="small" type="danger" plain @click="deleteClassific" v-if="classificaTitle == '编辑分类' || classificaTitle == '编辑诉求'">删除</el-button>
        <el-button size="small" type="danger" @click="submitClassificDraw('classificaForm')" :disabled="btnLoading">保存</el-button>
      </div>
    </el-drawer>

    <!-- 删除分类，服务弹框 -->
    <el-dialog title="提示" :visible.sync="deleteClassificaFlag" width="30%" :close-on-click-modal="false" :before-close="handleClose">
      <div style="display: flex; align-items: center">
        <i class="delete-icon el-icon-warning" style="color: #dd0000"></i><span>{{ deleteTips }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteClassificaFlag = false" size="small" v-if="deleteTips != `请先删除该分类下的子项！`">取 消</el-button>
        <el-button type="danger" size="small" @click="deleteClassificaFlag = false" v-if="deleteTips == `请先删除该分类下的子项！`">知道了</el-button>
        <el-button type="danger" @click="confirmDelete" size="small" v-else>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      filterMethod(query, item) {
        return item.companyName.indexOf(query) > -1;
      },
      limitTableData: [],
      deleteClassificaFlag: false,
      isCanDeleteFlag: false,
      deleteTips: "",
      classificaFlag: false,
      mainminheight: `height:${document.documentElement.clientHeight}px`,
      contentHeight: `height:${document.documentElement.clientHeight - 200}px`,
      serviceParentId: "",
      wrapperClosable: false,
      serviceDrawerTitle: "",
      serviceDrawerFlag: false,
      classificaTitle: "",
      classificaDrawerFlag: false,
      showHeader: false,
      direction: "rtl",
      shortDescAutosize: { minRows: 4, maxRows: 8 },
      classicTableData: [],
      serviceTableData: [],
      drawerForm: {
        serviceName: "",
        status: "",
        shortDesc: ""
      },
      btnLoading: false,
      serviceDrawType: "",
      serviceTransferData: [],
      classificaTransferData: [],
      classificaDrawerForm: {
        name: "",
        status: 1
      },
      servcieAdvise: [
        {
          label: "服务建议1",
          serviceId: 0,
          content: ""
        }
      ],
      classificaDrawerRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      },
      drawerRules: {
        serviceName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        shortDesc: [{ required: true, message: "请输入列表简介", trigger: "blur" }]
      },
      classificTypeFlag: "",
      editServiceId: "",
      deleteId: "", //删除单条分类，服务ID
      currentRow: null,
      resetDrawerStatus: "",
      selectClassificLineRow: {},
      tempServiceLineId: "",
      tempSortServiceFlag: ""
    };
  },
  mounted() {},
  created() {
    // 查询分类列表
    this.getClassificList();
  },
  methods: {
    handleCloseDrawer() {
      this.servcieAdvise = [
        {
          label: "服务建议1",
          serviceId: 0,
          content: ""
        }
      ];
    },
    addService() {
      if (this.servcieAdvise.length >= 5) return;
      const len = this.servcieAdvise.length;
      const prevId = this.servcieAdvise[len - 1].serviceId;
      this.servcieAdvise.push({
        label: `服务建议${len + 1}`,
        serviceId: prevId + 1,
        content: ""
      });
    },
    deleteService(index) {
      this.servcieAdvise.splice(index, 1);
      this.servcieAdvise.forEach((item, i) => {
        item.label = `服务建议${i + 1}`;
      });
    },
    onResize() {
      this.contentHeight = `height:${document.documentElement.clientHeight - 200}px`;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 返回
    back() {
      this.$router.go(-1);
    },
    // 分类表格点击
    classficRowClick(row, column, event) {
      this.selectClassificLineRow = row;
      this.tempServiceLineId = row.children.length ? row.children[0].id : "";
    },
    // 分类列表
    getClassificList() {
      this.requestMethodGet("/serviceApply/reasonConf/queryServiceApplyReasonConfTree", {}).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          // 取出第一项分类查询该下的服务
          if (data && data.length > 0) {
            if (!this.selectClassificLineRow.id) {
              this.selectClassificLineRow = data[0];
              this.tempServiceLineId = data[0].children[0] ? data[0].children[0].id : "";
            } else {
              let row = data.filter(item => {
                return item.id == this.selectClassificLineRow.id;
              });
              this.selectClassificLineRow = row[0];
              if (!this.tempServiceLineId && this.selectClassificLineRow.children.length) {
                this.tempServiceLineId = this.selectClassificLineRow.children[0].id;
              }
            }
            this.classicTableData = data;
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 分类处理高亮
    classicTableRowClassName({ row, rowIndex }) {
      if (row.id == this.selectClassificLineRow.id) {
        return "success-row";
      }
      return "";
    },
    // 服务处理高亮
    serviceTableRowClassName({ row, rowIndex }) {
      if (row.id == this.tempServiceLineId) {
        return "success-row";
      }
      return "";
    },
    // 服务列表点击
    serviceRowClick(row, column, event) {
      this.tempServiceLineId = row.id;
    },

    // 添加分类
    addClassificAndRequest(val) {
      this.classificaTitle = val;
      this.clearClassificFrom();
      this.classificaDrawerFlag = true;
    },
    // 分类/诉求编辑
    editClassificAndRequest(row, val) {
      if (val == "编辑诉求") {
        if (row.appealSuggestions.length > 0) {
          row.appealSuggestions.forEach((item, i) => {
            if (i == 0) {
              this.servcieAdvise[0].content = item.suggestion;
            } else {
              this.servcieAdvise.push({
                label: `服务建议${i + 1}`,
                serviceId: i,
                content: item.suggestion
              });
            }
          });
        }
      }
      this.classificaTitle = val;
      this.classificaDrawerForm = {
        name: row.name,
        status: row.status,
        id: row.id
      };
      this.classificaDrawerFlag = true;
    },
    // 分类上移下移
    sortUpOrDownClassific(row, val) {
      const params = {
        id: row.id,
        level: row.level,
        sortType: val
      };
      this.upOrDownRow(params);
    },

    // 上移或者下移
    upOrDownRow(params) {
      const paramsFormData = new FormData();
      Object.keys(params).forEach(key => {
        paramsFormData.append(key, params[key]);
      });
      this.requestMethodPost("/serviceApply/reasonConf/updateSort", paramsFormData).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: params.sortType == "up" ? "上移成功" : "下移成功"
          });
          this.getClassificList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 分类抽屉取消
    cancelClassificaDraw() {
      this.classificaDrawerFlag = false;
    },
    // 删除分类
    deleteClassific() {
      if (this.classificaTitle == "编辑诉求") {
        this.deleteTips = `确认删除此诉求：${this.classificaDrawerForm.name}？`;
      } else {
        if (this.selectClassificLineRow.children.length) {
          this.deleteTips = `请先删除该分类下的子项！`;
        } else {
          this.deleteTips = `确认删除此分类：${this.classificaDrawerForm.name}？`;
        }
      }
      this.deleteClassificaFlag = true;
    },

    // 分类抽屉确定
    submitClassificDraw(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let obj = {
            level: 1
          };
          if (this.classificaTitle == "添加诉求") {
            obj.level = 2;
            obj.parentId = this.selectClassificLineRow.id;
          }
          const appealSuggestions = this.servcieAdvise
            .filter(item => item.content)
            .map(item => ({
              suggestion: item.content
            }));

          let params = { ...obj, ...this.classificaDrawerForm };

          let url = "/serviceApply/reasonConf/addServiceApplyReasonConf";
          if (this.classificaTitle == "编辑分类" || this.classificaTitle == "编辑诉求") {
            //编辑分类/编辑诉求
            url = "/serviceApply/reasonConf/updateServiceApplyReasonConf";
            params = this.classificaDrawerForm;
            if (this.classificaTitle == "编辑分类") {
              params.level = 1;
            } else if (this.classificaTitle == "编辑诉求") {
              params.level = 2;
            }
          }
          this.btnLoading = true;
          if (this.classificaTitle == "添加诉求" || this.classificaTitle == "编辑诉求") {
            if (appealSuggestions.length == 0) appealSuggestions[0] = { suggestion: "" };
            params.appealSuggestions = appealSuggestions;
          }
          this.requestMethodPost(url, params).then(res => {
            if (res.data.code == 1000) {
              this.$message({
                type: "success",
                message: "保存成功"
              });
              this.classificaDrawerFlag = false;
              this.getClassificList();
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
          });
          this.btnLoading = false;
        } else {
          return false;
        }
      });
    },
    clearClassificFrom() {
      this.classificaDrawerForm = {
        name: "",
        status: 1
      };
    },
    // 确定删除
    confirmDelete() {
      // const params = {
      //   id: this.classificaDrawerForm.id
      // };
      const params = new FormData();
      params.append("id", this.classificaDrawerForm.id);
      this.requestMethodPost("/serviceApply/reasonConf/deleteServiceApplyReasonConf", params).then(res => {
        if (res.data.code == 1000) {
          this.deleteClassificaFlag = false;
          this.classificaDrawerFlag = false;
          this.$message({
            message: "删除成功",
            type: "success"
          });
          if (this.classificaTitle == "编辑分类") {
            this.selectClassificLineRow = {};
          } else {
            this.tempServiceLineId = "";
          }
          this.getClassificList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
/deep/.el-table .success-row {
  background: #ecf5ff;
}
.classific-service-apply-content {
  margin-top: 20px;
  .classic-service-content {
    display: flex;
  }
  .classic-service-header {
    width: 50%;
    height: 48px;
    // width: 100%;
    display: flex;
    align-items: center;
    background-color: #f9f9f9;
    padding-left: 20px;
    border-top: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .line {
      width: 4px;
      height: 14px;
      background: #dd0000;
      margin-right: 10px;
    }
  }
  .left-title {
    display: flex;
    align-items: center;
  }
  .right-btn {
    margin-left: auto;
    margin-right: 20px;
  }
  .left {
    border-right: 1px solid #e9e9e9;
  }
  .classic-service-table-content {
    display: flex;
    height: 100%;
  }
  .classic-service-table {
    width: 50%;
    height: 722px;
    overflow: auto;
  }
  .service-line {
    display: inline-block;
    width: 1px;
    height: 1em;
    margin: 0;
    vertical-align: middle;
    position: relative;
    background-color: #e9e9e9;
  }
  .table-right {
    border-left: 1px solid #e9e9e9;
  }
  .level-point {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .draw-class {
    width: 50%;
  }
  .footer-drawer {
    display: flex;
    align-items: center;
    height: 52px;
    margin-right: 40px;
  }
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 263px;
    height: 32px;
    border-radius: 3px;
    font-size: 12px;
    border: 1px solid;

    cursor: pointer;
  }
  .cancel {
    margin: 0 10px 0 20px;
    border: 1px solid #e9e9e9;
    color: #666666;
  }
  .submit {
    color: #fff;
    background-color: #dd0000;
  }
  /deep/ .el-drawer .rtl {
    overflow-y: auto;
    margin-bottom: 52px;
  }
  /deep/ .el-drawer__body {
    overflow: auto;
  }
  /deep/.el-radio__input.is-checked .el-radio__inner {
    border-color: #001450 !important;
    background: #001450 !important;
  }
  /deep/ .el-upload-list__item {
    transition: none !important;
  }
  .mask {
    position: absolute;
    background: rgba(245, 108, 108, 1);
    color: #ffffff;
    opacity: 0;
    top: 0;
    width: 751px;
    height: 20px;
    top: 403px;
  }
  .mask h3 {
    position: absolute;
    top: -20px;
    left: 50%;
    cursor: pointer;
  }
  .parent-video:hover .mask {
    opacity: 1;
  }
  .el-upload-list__item {
    transition: none !important;
  }
  .delete-icon {
    margin-right: 10px;
    font-size: 24px;
  }
  /deep/ .el-transfer-panel {
    width: 200px;
  }
}
.delete-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  margin-bottom: 5px;
  border-radius: 50%;
  background: #d10000;
  width: 22px;
  height: 22px;
  cursor: pointer;
}
.delete-icon-inner {
  display: inline-block;
  width: 12px;
  height: 2px;
  background: #fff;
}
</style>
