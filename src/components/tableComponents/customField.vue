<template>
  <div class="con">
    <div class="iconCon" @click="changeDialogVisible">
      <img src="../../assets/custonSet.png" alt="" class="iconPic" style="margin-left:0;" />
    </div>
    <el-dialog :visible.sync="dialogVisible" :before-close="cancelCustomFields" title="自定义字段" height="60%" top="100px" width="40%" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="listCon">
        <div class="listItem listHeader">
          <div class="listIcon"></div>
          <div class="listHeaderColumn">列表字段</div>
          <div class="listHeaderColumn">是否显示</div>
        </div>
        <div
          class="listItem"
          :draggable="item.visible == 2 ? false : true"
          @dragstart="handleDragStart($event, item)"
          @dragover.prevent="handleDragOver($event, item)"
          @dragenter="handleDragEnter($event, item)"
          @dragend="handleDragEnd($event, item)"
          v-for="item in customlist"
          :key="item.fieldName"
        >
          <div class="listIcon">
            <img class="listIconPic" :src="item.visible == 2 ? require('../../assets/moveNo.png') : require('../../assets/move.png')" />
          </div>
          <div class="listColumn">{{ item.fieldNameCn }}</div>
          <div class="listColumn">
            <el-switch
              v-model="item.visible"
              :disabled="item.visible == 2 ? true : false"
              :active-value="item.visible == 2 ? 2 : 1"
              :inactive-value="0"
              :active-color="item.visible == 2 ? '#99A3B9' : '#001450'"
              inactive-color="#DCE0E6"
            ></el-switch>
            <span :class="{ listColumnLock: item.visible != 1 }">{{ item.visible == 2 ? "始终展示" : item.visible == 1 ? "可见" : "隐藏" }}</span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button size="small" @click="cancelCustomFields">取消</el-button>
        <el-button size="small" type="danger" @click="saveCustomFields">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "customField",
  props: {
    customFieldlist: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 表格类行
    listType: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      dragging: null,
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      customFieldlistUnit: null,
      customlist: null
    };
  },
  watch: {
    customFieldlist: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val)) {
          this.customlist = val;
          this.customFieldlistUnit = val;
        }
      },
      immediate: true
    }
    // dragging(val) {
    //     if (this.customFieldlist.includes(val)) {
    //         this.dragging = val;
    //     } else {
    //         this.dragging = null;
    //     }
    // },
  },
  methods: {
    changeDialogVisible() {
      this.dialogVisible = !this.dialogVisible;
    },
    handleDragStart(e, item) {
      if (item.visible != 2) {
        this.dragging = item;
      }
    },
    handleDragEnd() {
      this.dragging = null;
    },
    handleDragOver(e, item) {
      if (item.visible != 2) {
        e.dataTransfer.dropEffect = "move";
      }
    },
    handleDragEnter(e, item) {
      if (this.dragging) {
        e.dataTransfer.effectAllowed = "move";
        if (item.fieldName === this.dragging.fieldName || item.visible == 2 || this.dragging.visible == 2) {
          return;
        }
        const newItems = [...this.customlist];
        const dragItemIndex = newItems.indexOf(this.dragging);
        const dropItemIndex = newItems.indexOf(item);
        newItems.splice(dropItemIndex, 0, ...newItems.splice(dragItemIndex, 1));
        this.customlist = newItems;
      }
    },
    saveCustomFields() {
      // 这里需要请求接口并修改缓存中的数据
      let fieldNameList = this.customlist.map((item, index) => {
        return {
          fieldName: item.fieldName,
          visible: item.visible,
          sort: index
        };
      });
      let param = {
        fieldNameList: fieldNameList,
        listType: this.listType,
        userId: this.userInfo.userId
      };
      this.requestMethodPost("/web/system/permission/userManage/saveUserWithListField", param)
        .then(res => {
          if (res.data.code == 1000) {
            this.$emit("get-fields", this.customlist);
            this.customFieldlist = this.customlist;
            this.dialogVisible = false;
            let fieldDtoList = JSON.parse(sessionStorage.getItem("fieldDtoList"));
            if (fieldDtoList.length == 0) {
              let obj = {
                listType: this.listType,
                fieldDtoInfos: fieldNameList
              };
              fieldDtoList.push(obj);
              sessionStorage.setItem("fieldDtoList", JSON.stringify(fieldDtoList));
            } else {
              let objIndex = fieldDtoList.findIndex(item => item.listType == this.listType);
              if (objIndex != -1) {
                fieldDtoList[objIndex].fieldDtoInfos = fieldNameList;
              } else {
                let obj = {
                  listType: this.listType,
                  fieldDtoInfos: fieldNameList
                };
                fieldDtoList.push(obj);
              }
              sessionStorage.setItem("fieldDtoList", JSON.stringify(fieldDtoList));
            }
            this.$message({
              message: "操作成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "操作失败",
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    cancelCustomFields() {
      this.customlist = this.customFieldlistUnit;
      this.dialogVisible = false;
    }
  }
};
</script>
<style scoped lang="less">
.iconCon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .iconPic {
    width: 16px;
    display: block;
  }
}
.listCon {
  width: 100%;
  .listItem {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 49px;
    .listIcon {
      width: 30px;
      .listIconPic {
        width: 16px;
        display: block;
        margin-left: 14px;
      }
    }
    .listHeaderColumn {
      width: calc(50% - 29px);
      font-weight: bold;
    }
    .listColumn {
      width: calc(50% - 29px);
      font-size: 14px;
      color: #999;
      span {
        margin-left: 8px;
      }
    }
  }
  .listHeader {
    background-color: #f9f9f9;
  }
  .listColumnLock {
    color: #ccc;
  }
}
/deep/ .el-dialog__body {
  padding: 20px 10px 0px 20px;
  height: calc(100% - 220px);
  overflow: scroll;
}
</style>
