<template>
  <el-drawer :title="title" :visible.sync="drawerVis" direction="rtl" size="43%" :before-close="beforClose">
    <div class="drawer-content-container">
      <el-form :model="CEdetailForm" :rules="rules" ref="ceForm" label-width="100px" class="demo-ruleForm" style="width:85%">
        <el-form-item label="名称：" prop="classifyName">
          <el-input size="mini" v-model="CEdetailForm.classifyName" placeholder="请输入" style="width:60%" maxlength="20" />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio v-model="CEdetailForm.status" :label="true">启用</el-radio>
          <el-radio v-model="CEdetailForm.status" :label="false">禁用</el-radio>
        </el-form-item>
        <el-form-item label="对谁可见：" prop="visible" v-if="level == 2">
          <el-checkbox-group v-model="CEdetailForm.visible" @change="changeSelBox">
            <el-checkbox :label="-1" @click.stop.prevent.native="selAll">全部</el-checkbox>
            <el-checkbox :label="0">对美孚内部</el-checkbox>
            <el-checkbox :label="1">对经销商</el-checkbox>
            <el-checkbox :label="2">对经销商客户</el-checkbox>
            <el-checkbox :label="3">对直供客户</el-checkbox>
            <el-checkbox :label="4">对游客</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="bottom-bar">
        <el-button @click="cancelCEdetail(true)" size="mini" type="info" plain>取消</el-button>
        <el-button @click="deleteCEdetail" plain type="danger" size="mini" v-show="opType == 'EDIT'">删除</el-button>
        <el-button @click="saveCEdetail" type="danger" size="mini">保存</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { generalFormValidate, createClassify, deleteClassifyItem, checkDeleteable } from "../../../api/LubQA";
export default {
  inject: ["firstActiveId"],
  data() {
    return {
      imageFileList: [],
      videoFileList: [],
      attachFileList: [],
      title: "",
      level: "",
      opType: "",
      editItem: null,
      drawerVis: false,
      CEdetailForm: {
        classifyName: "",
        status: true,
        visible: []
      },
      allSelected: false,
      editItemRawStatus: "",
      rules: {
        classifyName: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
        visible: [{ required: true, message: "请选择对谁可见", trigger: "blur" }]
      }
    };
  },
  methods: {
    beforClose() {
      this.cancelCEdetail(true);
    },
    selAll(e) {
      this.allSelected = !this.allSelected;
      if (this.allSelected) {
        this.CEdetailForm.visible = [0, 1, 2, 3, -1, 4];
      } else {
        this.CEdetailForm.visible = [];
      }
    },
    changeSelBox(val) {
      if (val.includes(0) && val.includes(1) && val.includes(2) && val.includes(3) && val.includes(4)) {
        this.CEdetailForm.visible.push(-1);
      } else {
        const index = this.CEdetailForm.visible.indexOf(-1);
        if (index >= 0) this.CEdetailForm.visible.splice(index, 1);
      }
    },
    evokeDrawer(params) {
      this.title = params.title;
      this.level = params.level;
      this.opType = params.opType;
      this.editItem = params.editItem;
      if (this.opType == "EDIT") {
        this.CEdetailForm.classifyName = this.editItem.name;
        this.CEdetailForm.status = this.editItem.status;
        this.editItemRawStatus = this.editItem.status;
        this.CEdetailForm.visible = this.editItem.visible ? this.editItem.visible.split(",").map(item => Number(item)) : [];
      }
      this.drawerVis = true;
    },
    deleteCEdetail() {
      this.$confirm("确认删除？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const deleteAble = await checkDeleteable({ id: this.editItem.id, level: this.level });
          if (deleteAble.data.data) {
            const laoding = this.$loading({
              lock: true,
              text: "请稍后...",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.6)"
            });
            const delteRes = await deleteClassifyItem({
              id: this.editItem.id,
              level: this.level
            });
            laoding.close();
            this.cancelCEdetail(false);
            this.$emit("postFunc", { level: this.level });
          } else {
            this.$message({
              message: "请先删除该分类下的子项",
              type: "warning"
            });
            this.cancelCEdetail(false);
          }
        })
        .catch(e => e);
    },
    cancelCEdetail(needConfirm = true) {
      const exec = () => {
        this.CEdetailForm = {
          classifyName: "",
          status: true,
          visible: []
        };
        this.editItem = null;
        this.editItemRawStatus = "";
        this.$refs.ceForm.resetFields();
        this.drawerVis = false;
      };

      if (!needConfirm) return exec();
      this.$confirm("确认取消？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          exec();
        })
        .catch(e => e);
    },
    async saveCEdetail() {
      generalFormValidate(this, "ceForm", async () => {
        const params = {
          name: this.CEdetailForm.classifyName,
          status: this.CEdetailForm.status,
          level: this.level
        };
        if (this.level == 2) {
          params.idLv1 = this.firstActiveId.value;
          params.visible = this.CEdetailForm.visible.join(",");
        }
        if (this.opType == "EDIT") params.id = this.editItem.id;
        const res = await createClassify(params);
        if (res.data.code !== 1000) return;
        this.cancelCEdetail(false);
        this.$emit("postFunc", { level: this.level, all: this.editItemRawStatus == this.CEdetailForm.status ? false : true });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.drawer-content-container {
  box-sizing: border-box;
  padding: 20px;
  padding-top: 0;
  height: calc(100vh - 80px);
  overflow: auto;
  &::-webkit-scrollbar {
    width: 5px !important;
  }
}
.bottom-bar {
  display: flex;
  justify-content: flex-end;
}
</style>
