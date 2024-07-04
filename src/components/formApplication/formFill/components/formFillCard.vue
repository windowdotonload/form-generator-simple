<template>
  <div class="form-addinfo-box">
    <div class="form-addinfo-title">{{ cardTitle }}</div>
    <div class="form-addinfo-btn" @click="createAction" v-show="cardInfoList && !cardInfoList.length"><i class="el-icon-plus" style="margin-right:8px" /> {{ buttonText }}</div>
    <div class="form-addinfo-addeditem" v-for="item in cardInfoList" :key="item.id">
      <div class="form-addinfo-header">
        <div class="form-addinfo-header-title">{{ item.cardName }}</div>
        <span>
          <span @click="createAction" class="form-addinfo-card-edit-btn">修改</span>
          <span @click="deleteCardItem(item)" class="form-addinfo-card-edit-btn">移除</span>
        </span>
        <!-- <i class="el-icon-delete delete-icon" @click="deleteCardItem(item)" /> -->
      </div>
      <div class="form-addinfo-content">
        <div class="form-addinfo-content-line" v-for="key in cardInfoKeys" :key="key.prop">
          <div class="form-addinfo-content-line-key">{{ key.label }}</div>
          <div class="form-addinfo-content-line-val">{{ item[key.prop] || "暂无" }}</div>
        </div>
      </div>
    </div>
    <ChooseLubPoint
      v-if="cardType == 3"
      :chooseDeviceAndLupDialog="chooseDeviceAndLupDialog"
      :singleFlag="false"
      :checkedDeviceId="cardInfoList[0] ? cardInfoList[0].deviceId : ''"
      :checkedlubricationPointNumber="cardInfoList[0] ? cardInfoList[0].lubricationPointNumber : ''"
      :companyId="$userInfo.companyId"
      :companyName="$userInfo.companyName"
      :companyNumber="$userInfo.companyNumber"
      v-on:cancelChooseDeviceAndLup="cancelChooseDeviceAndLup"
      v-on:confirmChooseLup="confirmChooseLup"
    />
  </div>
</template>

<script>
export default {
  components: {
    ChooseLubPoint: () => import("../../../spotInspection/components/chooseLubricationPointWorkorderForRecord")
  },
  props: {
    cardTitle: {
      type: String,
      default: "相关"
    },
    cardType: {
      type: String
    },
    buttonText: {
      type: String,
      default: "添加"
    },
    cardInfoList: {
      type: Array,
      default: () => []
    },
    cardInfoKeys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chooseDeviceAndLupDialog: false
    };
  },
  methods: {
    createAction() {
      if (this.cardType == 3) {
        return (this.chooseDeviceAndLupDialog = true);
      }
      this.$emit("createAction", this.cardType);
    },
    cancelChooseDeviceAndLup() {
      this.chooseDeviceAndLupDialog = false;
    },
    confirmChooseLup(lubList) {
      this.$parent.addLubPoint(lubList);
      this.chooseDeviceAndLupDialog = false;
    },
    deleteCardItem(cardItem) {
      this.$confirm("此移除相关信息后将无法在对应的详情中找到该记录，是否确认操作？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("deleteCard", {
            cardType: this.cardType,
            cardItem
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.form-addinfo-other-content {
  height: calc(100% - 100px);
  overflow-y: auto;
}

.form-addinfo-other-content::-webkit-scrollbar {
  display: none;
}

.form-addinfo-box {
  margin: 3px;
  margin-top: 15px;
  box-sizing: border-box;
  position: relative;
  padding: 16px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.form-addinfo-title {
  font-size: 16px;
  font-weight: bolder;
}
.form-addinfo-btn {
  cursor: pointer;
  color: #d10000;
  padding: 5px;
  margin-top: 8px;
  width: 100%;
  align-items: center;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  border-radius: 3px;
  font-size: 13px;
  border: 1px solid var(--dd-0000, #d00);
  background: var(--dd-00005, rgba(221, 0, 0, 0.05));
}
.form-addinfo-addeditem {
  padding: 12px;
  margin-top: 8px;
  width: 100%;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  justify-content: center;
  border-radius: 3px;
  font-size: 13px;
  border-radius: 5px;
  background: var(--f-9-f-9-f-9, #f9f9f9);
}
.form-addinfo-header {
  width: 100%;
  font-size: 13px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.delete-icon {
  font-size: 15px;
  cursor: pointer;
}
.delete-icon:hover {
  color: #d10000;
}
.form-addinfo-header-title {
  color: #000;
  font-size: 15px;
  font-weight: bolder;
  width: 60%;
}
.form-addinfo-content {
  width: 100%;
  margin-top: 10px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-wrap: wrap;
}
.form-addinfo-content-line {
  margin: 3px 0;
  display: flex;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}
.form-addinfo-content-line-key {
  width: 80px;
  margin-right: 10px;
  color: #999;
}
.form-addinfo-card-edit-btn {
  color: #666;
  font-weight: bold;
  cursor: pointer;
  margin-left: 5px;
  font-family: Microsoft YaHei;
}
</style>
