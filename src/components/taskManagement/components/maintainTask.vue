<template>
  <div style="position:relative">
    <!-- 维修/一般保养表单,根据不同任务类型标题, 添加项按钮名称动态显示-->
    <el-drawer
      :title="taskType == 7 ? '其他任务' : taskType > 5 ? '维修任务' : '保养任务'"
      :visible.sync="openMaintainDrawer"
      :direction="direction"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      size="45%"
      :wrapperClosable="false"
      :before-close="cancel"
    >
      <div class="item-container">
        <!-- 设备信息 -->
        <div class="device-info-content">
          <div style="width:85%">
            <div style="display:flex;align-items:center;margin-bottom:16px;padding-top:20px">
              <div style="font-size:14px;font-weight:bold;color:#000">
                设备名称：<span style="color:#008888">{{ taskDetail.deviceName }}</span>
              </div>
              <div style="font-size:14px;font-weight:bold;color:#000;margin-left:24px">
                设备类型：<span style="color:#008888">{{ taskDetail.deviceTypeName }}</span>
              </div>
            </div>
            <div class="device-title">
              设备位置 <span class="device-val">{{ taskDetail.devicePosition || "暂无" }}</span>
            </div>
            <div class="device-title">
              设备编码 <span class="device-val">{{ taskDetail.deviceCode || "暂无" }}</span>
            </div>
            <div class="device-title">
              设备分组 <span class="device-val">{{ taskDetail.deviceGroupNames || "暂无" }}</span>
            </div>
          </div>
          <div style="flex:1"><el-button type="danger" plain size="small" @click="viewDeviceInfo">查看设备资料</el-button></div>
        </div>
        <!-- 维修项 -->
        <div v-for="(item, index) in taskDetail.maintainanceOrRepairTaskForms" :key="index">
          <div class="item-content">
            <div class="item-title">
              <div class="item-title-left">
                <div class="line"></div>
                <div style="font-size:14px;font-weight:400;color:#000;margin-left:10px">{{ taskType == 7 ? "" : taskType > 5 ? "维修" : "保养" }}项目{{ index + 1 }}</div>
              </div>
              <div class="item-title-tight-btn">
                <el-link v-if="isEditFlag" style="color:#dd0000" :style="{ color: taskDetail.maintainanceOrRepairTaskForms.length > 1 ? '#dd0000' : '#999' }" @click="deleteItem(item)">删除</el-link>
              </div>
            </div>
          </div>
          <!-- 表单项 -->
          <el-form :ref="`maintainForm${index}`" :model="item" label-width="80px" :rules="itemRules">
            <el-form-item label="项目名称" prop="projectName" :rules="{ required: true, message: '请输入项目名称', trigger: 'blur' }">
              <el-input v-model="item.projectName" :disabled="!isEditFlag" size="small" maxlength="20" show-word-limit placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="操作描述" prop="operateDesc">
              <el-input v-model="item.operateDesc" :disabled="!isEditFlag" size="small" type="textarea" maxlength="200" :rows="5" show-word-limit placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item :label="taskType == 7 ? '原因' : taskType > 5 ? '维修原因' : '保养原因'">
              <el-input v-model="item.reason" :disabled="!isEditFlag" size="small" type="textarea" maxlength="200" :rows="5" show-word-limit placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="工时" prop="workingHours">
              <div>
                <el-input v-model="item.workingHours" :disabled="!isEditFlag" size="small" style="width: 100px"  maxlength="4"></el-input>
                <!-- <el-input-number v-model="item.workingHours" :disabled="!isEditFlag" :min="0" :max="9999999" size="small"></el-input-number> -->
                <el-select v-model="item.workingHoursUnit" placeholder="请选择" size="small" :disabled="!isEditFlag">
                  <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="零备件">
              <el-radio-group v-model="item.sparePartsUseFlag" :disabled="!isEditFlag">
                <el-radio :label="1">使用零备件</el-radio>
                <el-radio :label="0">未使用零备件</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 使用零备件的时候展示 -->
            <div v-if="item.sparePartsUseFlag">
              <el-form-item label="零备件名称" label-width="100px" prop="sparePartsName">
                <el-input v-model="item.sparePartsName" :disabled="!isEditFlag" size="small" maxlength="20" style="width: 50%" show-word-limit placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="零备件数量" label-width="100px" prop="sparePartsQuantity">
                <el-input v-model="item.sparePartsQuantity" :disabled="!isEditFlag" size="small" style="width: 50%"  maxlength="4"></el-input>
                <!-- <el-input-number v-model="item.sparePartsQuantity" :disabled="!isEditFlag" :min="0" :max="9999999" size="small"></el-input-number> -->
              </el-form-item>
              <el-form-item label="零备件代码" label-width="100px" prop="sparePartsNo">
                <el-input v-model="item.sparePartsNo" size="small" :disabled="!isEditFlag" style="width: 50%" maxlength="20" show-word-limit placeholder="请输入"></el-input>
              </el-form-item>
            </div>
            <el-form-item label="照片">
              <el-upload
                :key="index"
                :class="{ hideUploadImg: item.imageList.length == 9 || !isEditFlag }"
                :disabled="!isEditFlag"
                :action="uploadUrl"
                list-type="picture-card"
                limit="9"
                :file-list="item.imageList"
                accept=".jpg,.png"
                :auto-upload="false"
                :on-change="(file, fileList) => handleAddFile(file, fileList, item)"
                :on-remove="imgItem => handleRemove(imgItem, item)"
                :on-preview="handlePreview"
              >
                <i class="el-icon-plus" style="display: flex; align-items: center;justify-content: center;height: 100px;"></i>
              </el-upload>
              <div style="font-size:12px;color:#999">最多上传9张，规格要求：≤10M，jpg/png格式</div>
            </el-form-item>
          </el-form>
        </div>
        <!-- 添加 保养/维修任务，最多添加5个-->
        <div v-if="isEditFlag">
          <el-button type="text" :style="{ color: taskDetail.maintainanceOrRepairTaskForms.length == 5 ? '#999' : '#001450' }" style="margin-bottom:50px" @click="addItem"
            ><i class="el-icon-plus" style="color:#001450"></i>添加{{ taskType == 7 ? "项目" : taskType > 5 ? "维修任务" : "保养任务" }}</el-button
          >
        </div>
      </div>
      <!-- 底部按钮 -->
      <div class="bottom-bar" v-if="isEditFlag">
        <div class="op-btn save" @click="save">保存</div>
        <div class="op-btn cancel" @click="cancel">取消</div>
      </div>
    </el-drawer>
    <!-- 查看设备资料 -->
    <deviceDialog :deviceDialog="deviceDialogFlag" :deviceId="deviceId" :deviceNumber="deviceNumber" v-on:cancelDeviceFile="cancelDeviceFile"> </deviceDialog>
    <!-- 图片预览 -->
    <el-dialog width="30%" :visible.sync="previewImg" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeImgPreview">
      <el-image style="width: 100%; height: 100%;margin-top:20px" :src="dialogImageUrl"> </el-image>
    </el-dialog>
  </div>
</template>

<script>
import { validateForms } from "../../../utils/index";
export default {
  components: { deviceDialog: () => import("./viewDeviceInfo.vue") },
  props: {
    deviceNumber: {
      type: String
    },
    openMaintainDrawer: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    todoTaskId: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    deviceId: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    isEditFlag: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    taskType: {
      type: Number,
      default: () => {
        return 0;
      }
    }
  },
  data() {
    return {
      deviceDialogFlag: false,
      uploadUrl: "",
      taskDetail: {
        maintainanceOrRepairTaskForms: [
          {
            projectName: "",
            operateDesc: "",
            reason: "",
            workingHours: 0,
            workingHoursUnit: "m",
            sparePartsUseFlag: 0,
            sparePartsName: "",
            sparePartsQuantity: "",
            sparePartsNo: "",
            imageList: [],
            key: _.uniqueId("item_")
          }
        ]
      },
      itemRules: {
        projectName: [{ required: true, message: "请输入零备件名称", trigger: "blur" }],
        operateDesc: [{ required: true, message: "请输入操作描述", trigger: "blur" }],
        sparePartsName: [{ required: true, message: "请输入零备件名称", trigger: "blur" }],
        workingHours: [{ pattern: /^(0|\+?[1-9][0-9]{0,3})$/, message: "请输入0-9999的整数", trigger: "blur" }],
        sparePartsQuantity: [{ required: true, message: "请输入零备件数量", trigger: "blur" },{ pattern: /^(0|\+?[1-9][0-9]{0,3})$/, message: "请输入0-9999的整数", trigger: "blur" }],
        sparePartsNo: [{ required: true, message: "请输入零备件代码", trigger: "blur" }]
      },
      timeOptions: [
        {
          label: "分钟",
          value: "m"
        },
        {
          label: "小时",
          value: "h"
        }
      ],
      addFlag: true,
      deviceDialog: false,
      deviceInfoTableData: [],
      deviceInfoCurrent: 1,
      deviceInfoSize: 30,
      totalNumber: 0,
      previewImg: false,
      dialogImageUrl: ""
    };
  },
  watch: {
    openMaintainDrawer: function(val, oldVal) {
      if (val) {
        this.getDetail();
      }
    }
  },
  methods: {
    getDetail() {
      const params = {
        todoTaskId: this.todoTaskId,
        deviceId: this.deviceId
      };
      this.requestMethodGet("/device/check/todoTask/maintainanceOrRepairFormDetail", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          if (this.isEditFlag) {
            //执行，编辑
            if (data.maintainanceOrRepairTaskForms.pictures && data.maintainanceOrRepairTaskForms.pictures.length) {
              data.maintainanceOrRepairTaskForms.pictures.forEach(it => {
                it.url = it.attachmentUrl;
              });
            }
            if (data.maintainanceOrRepairTaskForms.length) {
              data.maintainanceOrRepairTaskForms.forEach(item => {
                if (item.pictures && item.pictures.length) {
                  item.pictures.forEach(img => {
                    img.url = img.attachmentUrl;
                  });
                }
                item.imageList = item.pictures || [];
                item.key = _.uniqueId("item_");
                item.sparePartsUseFlag = item.sparePartsUseFlag ? 1 : 0;
              });
            } else {
              data.maintainanceOrRepairTaskForms = [
                {
                  projectName: "",
                  operateDesc: "",
                  reason: "",
                  workingHours: 0,
                  workingHoursUnit: "m",
                  sparePartsUseFlag: 0,
                  sparePartsName: "",
                  sparePartsQuantity: "",
                  sparePartsNo: "",
                  imageList: [],
                  key: _.uniqueId("item_")
                }
              ];
            }
          } else {
            //查看
            const list = data.maintainanceOrRepairTaskForms;
            if (list.length) {
              list.forEach(item => {
                if (item.pictures && item.pictures.length) {
                  item.pictures.forEach(img => {
                    img.url = img.attachmentUrl;
                  });
                }
                item.imageList = item.pictures || [];
                item.key = _.uniqueId("item_");
                item.sparePartsUseFlag = item.sparePartsUseFlag ? 1 : 0;
              });
            } else {
              data.maintainanceOrRepairTaskForms = [
                {
                  projectName: "",
                  operateDesc: "",
                  reason: "",
                  workingHours: 0,
                  workingHoursUnit: "m",
                  sparePartsUseFlag: 0,
                  sparePartsName: "",
                  sparePartsQuantity: "",
                  sparePartsNo: "",
                  imageList: [],
                  key: _.uniqueId("item_")
                }
              ];
            }
          }
          this.taskDetail = data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 查看设备资料
    viewDeviceInfo() {
      this.deviceDialogFlag = true;
    },
    cancelDeviceFile() {
      this.deviceDialogFlag = false;
    },
    // 添加任务项
    addItem() {
      let obj = {
        projectName: "",
        operateDesc: "",
        reason: "",
        workingHours: 0,
        workingHoursUnit: "m",
        sparePartsUseFlag: 0,
        sparePartsName: "",
        sparePartsQuantity: "",
        sparePartsNo: "",
        imageList: [],
        key: _.uniqueId("item_")
      };
      if (this.taskDetail.maintainanceOrRepairTaskForms.length < 5) {
        this.taskDetail.maintainanceOrRepairTaskForms.push(obj);
      } else {
        this.addFlag = false;
      }
    },
    // 删除
    deleteItem(item) {
      if (this.taskDetail.maintainanceOrRepairTaskForms.length > 1) {
        this.taskDetail.maintainanceOrRepairTaskForms.forEach((it, index) => {
          if (it.key == item.key) {
            this.taskDetail.maintainanceOrRepairTaskForms.splice(index, 1);
          }
        });
      }
    },
    handleAddFile(file, fileList, item) {
      if (!file.raw.type.startsWith("image")) {
        this.$message.error("只能上传图片类型文件");
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 10MB!");
        return;
      }
      let params = new FormData();
      params.append("fileType", "maintenance");
      params.append("multipartFiles", file.raw);
      this.requestMethodPost("/web/file/uploadFiles", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.getFullImgPath(res.data[0], file, item);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 图片上传获取全路径
    getFullImgPath(path, file, item) {
      const params = {
        url: path
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.taskDetail.maintainanceOrRepairTaskForms.forEach(it => {
            if (it.key == item.key) {
              it.imageList.push({ url: res.data.data, attachmentHalfUrl: path });
            }
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    handleRemove(imgItem, item) {
      this.taskDetail.maintainanceOrRepairTaskForms.forEach(it => {
        if (it.key == item.key) {
          it.imageList.forEach((img, idx) => {
            if (img.uid == imgItem.uid) {
              it.imageList.splice(idx, 1);
            }
          });
        }
      });
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.previewImg = true;
    },
    closeImgPreview() {
      this.previewImg = false;
    },
    // 保存
    save() {
      // 校验必填项
      let arr = [];
      for (let i = 0; i < this.taskDetail.maintainanceOrRepairTaskForms.length; i++) {
        let str = "maintainForm" + i;
        arr.push(str);
      }
      const formRefs = arr.map(key => this.$refs[key]).flat();
      validateForms(formRefs)
        .then(() => {
          const list = this.taskDetail.maintainanceOrRepairTaskForms;
          list.forEach(it => {
            if (it.imageList) {
              let imgList = [];
              it.imageList.forEach(img => {
                imgList.push(img.attachmentHalfUrl);
              });
              it.pictureHalfPath = imgList;
            } else {
              it.pictureHalfPath = [];
            }
          });
          let params = {};
          params.deviceId = this.taskDetail.deviceId;
          params.taskId = this.todoTaskId;
          params.maintainanceOrRepairTaskForms = this.taskDetail.maintainanceOrRepairTaskForms;
          if (this.isEditFlag) {
            params.id = this.taskDetail.id;
          }
          this.createOrUpdate(params);
        })
        .catch(err => {
          console.log(err);
        });
    },
    createOrUpdate(params) {
      this.requestMethodPost("/device/check/todoTask/saveMaintainanceOrRepairForm", params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "保存成功"
          });
          this.$emit("cancelMaintainDraw");
          this.$gio.executeTaskItemForm({
            operation: "任务项表单页点击保存按钮"
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 取消
    cancel() {
      this.$emit("cancelMaintainDraw");
    },
    // 一页多少
    handleSizeChange(val) {
      this.deviceInfoCurrent = val;
      this.getDeviceTableData();
    },
    // 页数
    handleCurrentChange(val) {
      this.deviceInfoSize = val;
      this.getDeviceTableData();
    },
    // 获取设备资料列表
    getDeviceTableData() {}
  }
};
</script>
<style lang="less" scoped>
/deep/ .el-drawer__body {
  overflow-y: auto;
}
.item-container {
  height: 100%;
  margin: 20px;
  padding-bottom: 50px;
}
.device-info-content {
  display: flex;
  align-items: center;
  padding: 0px 20px;
  border: 1px solid #ccddff;
  border-radius: 6px;
  background-color: rgba(204, 221, 255, 0.4);
}
.device-title {
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;
}
.device-val {
  color: #333;
  margin-left: 16px;
}
.item-content {
  margin: 20px 0;
}
.item-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.item-title-left {
  display: flex;
  align-items: center;
}
.line {
  width: 4px;
  height: 14px;
  background-color: #dd0000;
}
.hideUploadImg /deep/ .el-upload--picture-card {
  display: none !important;
}
.bottom-bar {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  bottom: 20px;
  width: 40%;
  right: 40px;
  .op-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    width: 45%;
    cursor: pointer;
  }
  .save {
    color: white;
    background: #dd0000;
    border-radius: 5px;
  }
  .cancel {
    border-radius: 5px;
    background: #ffffff;
    border: 1px solid #d4d3d3;
    color: #d4d3d3;
  }
}
/deep/.el-upload--picture-card {
  width: 100px;
  height: 100px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
  transition: none !important;
}
/deep/.el-upload-list--picture-card .el-upload-list__item-thumbnail {
  width: 100px;
  height: 100px;
}
</style>
