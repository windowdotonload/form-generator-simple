<template>
  <div class="card-container">
    <div class="card-top-inner">
      <div class="card-top-left">
        <div class="card-info-tip">
          <img src="../../assets/icon/record.svg" style="margin-right:10px" />
          <div class="card-info-title">{{ formItemInfo.formName }}</div>
        </div>
        <div class="card-info-desc">{{ formItemInfo.remark }}</div>
      </div>
      <div class="card-top-right" v-show="viewAuth">
        <img src="../../assets/icon/fakeQRcode.svg" style="cursor:pointer" @click="viewQRCode(formItemInfo)" />
      </div>
    </div>
    <div class="card-bottom-inner" v-show="viewAuth || fillAuth">
      <div class="card-history" @click="viewHistoryRecord" v-show="viewAuth"><i class="el-icon-time" style="margin-right:5px" />历史记录</div>
      <el-button type="danger" plain size="mini" @click="fillForm" v-show="fillAuth">填表</el-button>
    </div>
  </div>
</template>

<script>
import { createDialog } from "../../formGenerate/components/util";
import QR from "./QRCode.vue";
export default {
  props: {
    formItemInfo: {
      type: Object,
      default: () => {}
    },
    fillAuth: {
      type: Boolean,
      default: true
    },
    viewAuth: {
      type: Boolean,
      default: true
    },
    companyId: {
      type: String,
      default: ""
    },
    deviceId: {
      type: String,
      default: ""
    }
  },
  methods: {
    viewQRCode(item) {
      createDialog({
        width: "20%",
        noStyle: true,
        title: "查看二维码",
        ContentComponent: QR,
        componentProps: {
          cardInfo: item
        }
      });
    },
    fillForm() {
      this.$router.push({
        name: "formFill",
        query: {
          formId: this.formItemInfo.id,
          formName: this.formItemInfo.formName
        }
      });
      this.$gio.ClickFillformrecord()
    },
    viewHistoryRecord() {
      const query = {
        formName: this.formItemInfo.formName,
        formId: this.formItemInfo.id
      };
      if (this.companyId) query.companyId = this.companyId;
      if (this.deviceId) query.deviceId = this.deviceId;
      this.$router.push({
        name: "formHistoryRecord",
        query
      });
      this.$gio.Clickhistory()
    }
  }
};
</script>

<style lang="less" scoped>
.card-container {
  position: relative;
  height: fit-content;
  width: 23%;
  margin-bottom: 20px;
  margin-right: calc((100% - (23% * 4)) / 3);
  border-radius: 12px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  box-sizing: border-box;
  padding-bottom: 0;
}
.card-container:nth-child(4n) {
  margin-right: 0;
}
.card-top-left {
  width: 80%;
  position: relative;
}
.card-info-tip {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}
.card-info-title {
  height: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: bolder;
  font-size: 16px;
}
.card-info-desc {
  margin-top: 8px;
  font-size: 14px;
  color: #999;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40px;
}
.card-top-inner {
  position: relative;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-height: 80px;
  padding-bottom: 16px;
  height: fit-content;
  border-bottom: 0.5px solid var(--e-9-e-9-e-9, #e9e9e9);
}
.card-bottom-inner {
  align-self: flex-end;
  position: relative;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: fit-content;
  height: 60px;
  align-items: center;
  width: 100%;
}
.card-history {
  cursor: pointer;
}
.card-history:hover {
  color: rgba(209, 0, 0, 0.8);
}
</style>
