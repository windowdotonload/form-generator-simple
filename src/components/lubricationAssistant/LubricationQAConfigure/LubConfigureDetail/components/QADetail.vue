<template>
  <div class="qadetail-container" v-loading="QASpecificListLoading">
    <div class="header-bar">
      <el-input v-model="searchName" @input="search" clearable placeholder="请输入问题" class="input-with-select" size="mini" style="width:40%" suffix-icon="el-icon-search" />
      <div>
        <el-button size="mini" type="danger" @click="batchImpport" :disabled="!provide.lv2CatalogueItem.id">批量导入</el-button>
        <el-button size="mini" type="danger" @click="evokeDrawer" :disabled="!provide.lv2CatalogueItem.id">新建</el-button>
      </div>
    </div>

    <div class="table-container">
      <el-table :data="tableData" style="width: 100%;overflow:auto" :header-cell-style="{ background: '#f7f7f7' }" height="calc(100vh - 280px)">
        <el-table-column prop="number" label="问题ID" width="180"> </el-table-column>
        <el-table-column prop="name" label="问题" width="180" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{row}">
            <span v-show="row.status" style="color:#008787">启用</span>
            <span v-show="!row.status" style="color:#d10000">禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>
        <el-table-column prop="updateTime" label="最后修改时间"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button size="mini" type="text" @click.stop="editClassifyItem(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click.stop="move('up', scope.row, scope)" :disabled="tablePageInfo.current == 1 && scope.$index == 0 ? true : false">上移</el-button>
            <el-button size="mini" type="text" @click.stop="move('down', scope.row, scope)" :disabled="tablePageInfo.current == totalSize && scope.$index == lastSizeNum - 1 ? true : false">
              下移
            </el-button>
            <!-- totalSize -->
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="tableTotal" :pageInfo="tablePageInfo" />
    </div>

    <el-dialog title="批量导入" :visible.sync="batchImportDialogVisible" width="30%" :before-close="handleCloseUploadBox" v-if="batchImportDialogVisible" :close-on-click-modal="false">
      <div class="batch-import_content" v-loading="getTemplateLoading">
        <p style="color:#d10000">当前问题分类： {{ this.provide.lv1CatalogueItem.name }} / {{ this.provide.lv2CatalogueItem.name }}</p>
        <p>第一步： 下载模板，按照模板格式填写</p>
        <el-button type="text" size="mini" @click="downloadTemplate">下载模板（问题答案导入模板）</el-button>
        <p>第二步： 填写完模板后，上传Excel文件</p>
        <OSSUploadCombine :previewAble="false" accept=".xlsx" useSlot fileType="knowledge_library" uploadType="file" uploadBtnText="选择文件" v-model="attachFileList" :limit="1">
          <template #uplaodBtn>
            <el-button size="mini" :disabled="attachFileList.length > 0">选择文件</el-button>
          </template>
        </OSSUploadCombine>
        <div style="display:flex;justify-content:flex-end">
          <el-button size="mini" @click="handleCloseUploadBox">取消</el-button>
          <el-button size="mini" type="danger" @click="confirmBatchUpload">确认</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="batchImportUploadResTitle"
      :visible.sync="batchImportResDialogVisible"
      width="30%"
      :before-close="handleCloseImportResBox"
      v-if="batchImportResDialogVisible"
      :close-on-click-modal="false"
    >
      <div class="batch-import_content">
        <template v-if="batchImportUPloadResType == 0">
          <p>本次导入数据共 {{ batchImportUploadRes.totalNum }} 条</p>
          <p style="color:#add57a">成功 {{ batchImportUploadRes.successNum }} 条</p>
          <p style="color:#d10000">失败 {{ batchImportUploadRes.errorNum }} 条</p>
        </template>
        <template v-if="batchImportUPloadResType == 1">
          <el-table :data="batchImportUploadRes.errorReasonDtoList" style="width: 100%;overflow:auto" :header-cell-style="{ background: '#f7f7f7' }" height="calc(100vh - 280px)">
            <el-table-column prop="excelLineNum" label="第几行"> </el-table-column>
            <el-table-column prop="columnName" label="字段名称"> </el-table-column>
            <el-table-column prop="errorContent" label="错误详情"> </el-table-column>
          </el-table>
        </template>
        <div style="display:flex;justify-content:flex-end;margin-top:10px">
          <el-button size="mini" @click="handleCloseImportResBox">关闭</el-button>
          <el-button size="mini" type="danger" @click="viewImportUploadDetail" v-if="batchImportUploadRes.errorReasonDtoList && batchImportUploadRes.errorReasonDtoList.length > 0">失败详情</el-button>
        </div>
      </div>
    </el-dialog>
    <CreateAndEditDrawer ref="detailDrawer" />
  </div>
</template>

<script>
import { getClassifyList, queryQAid, downladImportTemplate, moveUpDown, batchUpload } from "../../../api/LubQA";
import { fullScreen_loading } from "../../../../../generalComponents/fullScreenLoading";
import debounce from "lodash/debounce";
export default {
  inject: ["provide"],
  components: {
    CreateAndEditDrawer: () => import("./CreateAndEditDrawer.vue"),
    Pagination: () => import("../../../api/components/Pagination.vue")
  },
  watch: {
    "provide.lv2CatalogueItem.id": {
      handler(val) {
        this.searchName = "";
        if (!val) {
          this.refreshList();
          this.QASpecificListLoading = false;
          return;
        }
        this.getSpecificQAList(val);
      },
      immediate: true
    },
    tablePageInfo: {
      handler() {
        this.getSpecificQAList(this.provide.lv2CatalogueItem.id, this.searchName);
      },
      deep: true
    }
  },
  computed: {
    totalSize() {
      return Math.ceil(this.tableTotal / this.tablePageInfo.size);
    },
    lastSizeNum() {
      return this.tableTotal % this.tablePageInfo.size;
    }
  },
  data() {
    return {
      searchName: "",
      batchImportDialogVisible: false,
      QASpecificListLoading: true,
      tableData: [],
      tableTotal: 0,
      tablePageInfo: {
        current: 1,
        size: 30
      },
      attachFileList: [],
      getTemplateLoading: false,
      batchImportResDialogVisible: false,
      batchImportUploadRes: null,
      batchImportUploadResTitle: "",
      batchImportUPloadResType: ""
    };
  },
  methods: {
    refreshList() {
      this.tableData = [];
      this.tableTotal = 0;
      this.tablePageInfo = {
        current: 1,
        size: 30
      };
    },
    handleCloseUploadBox() {
      this.batchImportDialogVisible = false;
      this.attachFileList = [];
    },
    openImportResBox(params) {
      this.batchImportUploadResTitle = params.title;
      this.batchImportUPloadResType = params.type;
      this.batchImportResDialogVisible = true;
    },
    viewImportUploadDetail() {
      this.openImportResBox({ title: "失败详情", type: 1 });
    },
    handleCloseImportResBox() {
      this.batchImportResDialogVisible = false;
      this.batchImportUploadRes = null;
    },

    async downloadTemplate() {
      this.getTemplateLoading = true;
      const url = await downladImportTemplate({ url: "knowledge/file/问题答案导入模板.xlsx" });
      this.getTemplateLoading = false;
      window.open(url.data.data, "_blank");
    },
    async confirmBatchUpload() {
      if (this.attachFileList.length == 0 || !this.attachFileList)
        return this.$message({
          type: "warning",
          message: "请上传文件"
        });
      this.getTemplateLoading = true;
      const formData = new FormData();
      formData.append("lv2Id", this.provide.lv2CatalogueItem.id);
      formData.append("file", this.attachFileList[0].__fileraw.file);
      const res = await batchUpload(formData);
      this.batchImportUploadRes = res.data.data;
      this.getTemplateLoading = false;
      this.handleCloseUploadBox();
      this.openImportResBox({ title: "导入结果", type: 0 });
      this.refreshLv3List();
    },
    search: debounce(async function() {
      this.searchName = arguments[0];
      this.tablePageInfo = {
        current: 1,
        size: 30
      };
    }, 800),
    refreshLv3List() {
      this.getSpecificQAList(this.provide.lv2CatalogueItem.id);
    },
    evokeDrawer() {
      this.$refs.detailDrawer.evokeDrawer({
        title: "新建详情",
        opType: "CREATE",
        editQAItem:{
          number: "",
          linkContent: "",
          menuLv1: "",
          menuLv2: "",
          menuLv3: "",
          linkUrl: "",
          question: "",
          answer: "",
          charge: [-1, 0, 1, 2, 3, 4],
          jumpFlag: 0,
          status: true,
          picUrl: [],
          videoUrl: [],
          attachmentUrl: []
        }
      });
    },
    batchImpport() {
      this.batchImportDialogVisible = true;
    },
    async editClassifyItem(editItem) {
      fullScreen_loading.LOADING("加载问题详情...");
      const res = await queryQAid({
        id: editItem.id
      });
      this.$refs.detailDrawer.evokeDrawer({
        title: "编辑详情",
        opType: "EDIT",
        editQAItem: res.data.data
      });
      fullScreen_loading.ENDLOADING();
    },
    async move(direction, item, scope) {
      const params = {
        moveUpFlag: direction == "up" ? true : false,
        level: 3,
        id: item.id
      };
      await moveUpDown(params);
      this.refreshLv3List();
    },
    async getSpecificQAList(parentId, name) {
      if (!parentId) return;
      const params = {
        level: 3,
        parentId,
        ...this.tablePageInfo
      };
      if (name) params.name = name;
      this.QASpecificListLoading = true;
      const res = await getClassifyList(params);
      this.tableData = res.data.data.list;
      this.tableTotal = res.data.data.totalCount;
      this.QASpecificListLoading = false;
    }
  }
};
</script>

<style lang="less" scoped>
.qadetail-container {
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
  height: 100%;
  /deep/ .el-dialog__body {
    padding-top: 0;
  }

  /deep/ .el-dialog {
    border-radius: 10px;
  }
}
.header-bar {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.table-container {
  margin-top: 10px;
  &::-webkit-scrollbar {
    width: 5px !important;
  }
}
.batch-import_content {
  padding-bottom: 20px;
}
::-webkit-scrollbar {
  display: none;
}
</style>
