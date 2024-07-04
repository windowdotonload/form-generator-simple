<template>
  <div class="form-record-detail-container">
    <div class="form-record-title">
      <HeaderIcon />
      <div class="form-record-title-content">
        <div class="form-record-title-formname">{{ recordDetail.formName }}</div>
        <div class="form-record-title-desc">
          <span class="form-record-title-desc-info" style="margin-bottom:10px;width:100%;display:inline-block">创建：{{ recordDetail.createUserName }} {{ recordDetail.createTime }}</span>
          <span class="form-record-title-desc-info" style="margin-bottom:3px;width:100%;display:inline-block">
            最后编辑： {{ recordDetail.updateUserName || recordDetail.createUserName }} {{ recordDetail.updateTime }}
          </span>
        </div>
      </div>
    </div>
    <div class="form-property-box" v-if="deviceId">
      <div class="form-property-box-header">相关设备</div>
      <div class="form-property-box-content">
        <div class="form-property-box-content-item" v-for="item in recordDetail.deviceDtoList" :key="item.deviceId">
          <div class="form-property-box-content-item-header">{{ item.deviceName }}</div>
          <div class="form-property-box-content-item-info">
            设备类型：{{ item.deviceType }} | 所属车间：{{ item.deviceWorkShopName }} | 设备编码：{{ item.deviceCode || "暂无" }} | 设备位置：{{ item.devicePosition || "暂无" }}
          </div>
        </div>
      </div>
    </div>
    <div class="form-property-box" v-if="deviceId">
      <div class="form-property-box-header">相关润滑点</div>
      <div class="form-property-box-content">
        <div class="form-property-box-content-item" v-for="item in recordDetail.lubricationPointDtoList" :key="item.deviceId">
          <div class="form-property-box-content-item-header">{{ item.lubricationPointType }}</div>
          <div class="form-property-box-content-item-info">
            润滑点名称：{{ item.lubricationPointName }} | 设备名称：{{ item.deviceName }} | 所属车间：{{ item.deviceWorkShopName || "暂无" }} 
          </div>
        </div>
      </div>
    </div>

    <div class="form-property-box" v-if="companyId">
      <div class="form-property-box-header">相关客户</div>
      <div class="form-property-box-content">
        <div class="form-property-box-content-item" v-for="item in recordDetail.customerDtoList" :key="item.companyId">
          <div class="form-property-box-content-item-header">{{ item.companyName }}</div>
          <div class="form-property-box-content-item-info">行业：{{ item.industryNameLv1 }} - {{ item.industryNameLv2 }}</div>
        </div>
      </div>
    </div>

    <div class="form-property-box">
      <div class="form-property-box-header">表单信息</div>
      <div class="form-property-box-content">
        <div v-for="item in recordDetail.componentList" :key="item.id">
          <div v-if="item.componentType == 7">
            <div class="form-property-info-key">{{ item.title }} <span v-if="!item.valueStr" style="margin-left:10px;margin-bottom:10px;color:#000;display:inline-block">未上传文件</span></div>
            <div style="margin-top:6px;" v-show="item.valueStr" :style="{ 'margin-bottom': item.valueStr ? '10px' : '' }">
              <RecordFileList :fileListString="item.valueStr" />
            </div>
          </div>
          <div v-else-if="item.componentType == 8">
            <div class="form-property-info-key">{{ item.title }} <span v-if="!item.valueStr" style="margin-left:10px;margin-bottom:10px;color:#000;display:inline-block">未上传图片</span></div>
            <div style="margin-top:6px;" :style="{ 'margin-bottom': item.valueStr ? '10px' : '' }">
              <OSSUploadCombine :readOnly="true" uploadType="image" :propFileList="item.valueStr ? item.valueStr.split(',') : []" downloadable />
            </div>
          </div>
          <div v-else-if="item.componentType == 10" class="form-property-table-field-container">
            <div class="form-property-info-key">
              {{ item.title }} <span v-if="!item.tableDataDtoList || !item.tableDataDtoList.length" style="margin-left:10px;margin-bottom:10px;color:#000;display:inline-block">暂无表格数据</span>
            </div>
            <div class="form-table-field-line-item" v-for="line in item.tableDataDtoList" :key="line">
              <div v-for="col in item.tableHeaderDtoList" :key="col.columnUuid" class="form-table-field-line-item-linedata">
                <div style="margin-right:10px;width:80px">{{ col.columnName }}</div>
                <div>{{ line[col.columnUuid] }}</div>
              </div>
            </div>
          </div>
          <div v-else-if="item.componentType == 11" :class="item.title && item.title.split('-')[0] == 1 ? 'form-generator-text-bloder-record' : 'form-generator-text-normal-record'">
            {{ item.title && item.title.split("-")[1] }}
          </div>
          <div class="form-property-box-content-item-forminfo" v-else>
            <div class="form-property-info-key">{{ item.title }}</div>
            <div class="form-property-info-val">{{ item | formatValueStr }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderIcon from "./headerIcon";
import RecordFileList from "./recordFileList";
import { getRecordDetail } from "../../api/index.js";
export default {
  props: {
    activeRecordId: {
      type: String,
      default: ""
    },
    external:{
      type: Boolean,
      default: false
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
  components: {
    HeaderIcon,
    RecordFileList
  },
  data() {
    return {
      recordDetail: {},
      commonFieldList: [],
      tableFieldList: [],
      textFieldList: []
    };
  },
  mounted() {
    this.getRecordDetail();
  },
  filters: {
    formatValueStr(rawValue) {
      if (rawValue.componentType == 9) return rawValue.oilNames || "暂无";
      return rawValue.valueStr || "暂无";
    }
  },
  methods: {
    async getRecordDetail() {
      if (!this.activeRecordId) return;
      const res = await getRecordDetail({
        recordId: this.activeRecordId,
        queryForDisplay: true
      });
      if (res.data.code == 1000) {
        this.recordDetail = res.data.data;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.form-record-detail-container {
  box-sizing: border-box;
  position: relative;
  height: calc(100vh - 60px);
  width: 100%;
  overflow: auto;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
}
.form-record-detail-container::-webkit-scrollbar {
  display: none;
}
.form-record-title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  width: 100%;
  flex-wrap: nowrap;
}
.form-record-title-content {
  box-sizing: border-box;
  padding-left: 18px;
}
.form-record-title-formname {
  font-size: 18px;
  margin-bottom: 8px;
  font-weight: bolder;
}
.form-record-title-desc-info {
  font-size: 12px;
  color: #999;
}
.form-property-box {
  position: relative;
  width: 100%;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-decoration: none;
  background-color: rgba(255, 255, 255, 0.5);
  margin-top: 15px;
  overflow: hidden;
}
.form-property-box-header {
  background-color: #f9f9f9;
  padding: 0 20px;
  height: 39px;
  display: flex;
  align-items: center;
  color: #000;
  font-size: 15px;
  font-weight: bolder;
}
.form-property-box-header::before {
  content: "";
  margin-right: 10px;
  display: inline-block;
  width: 5px;
  height: 20px;
  background-color: rgb(209, 0, 0, 0.8);
}
.form-property-box-content {
  position: relative;
  box-sizing: border-box;
  background: #fff;
  padding: 10px 20px;
  height: fit-content;
}
.form-property-box-content-item-header {
  font-size: 14px;
  margin-bottom: 3px;
  color: #000;
}
.form-property-box-content-item-info {
  font-size: 14px;
  color: #999999;
}
.form-property-box-content-item {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(204, 204, 204, 0.8);
}
.form-property-box-content-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}
.form-record-bottom {
  background: #fff;
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
}
.form-property-box-content-item-forminfo {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  box-sizing: border-box;
  margin-bottom: 10px;
  font-size: 13px;
}
.form-property-info-key {
  width: fit-content;
  font-size: 13px;
  color: #999;
  margin-right: 10px;
}
.form-property-info-val {
  max-width: 80%;
}
.form-property-table-field-container {
  font-size: 14px;
}
.form-table-field-line-item {
  position: relative;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  background: rgba(153, 153, 153, 0.1);
  margin-top: 5px;
  margin-bottom: 10px;
  border-radius: 6px;
}
.form-table-field-line-item-linedata {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 5px;
}
.form-table-field-line-item-linedata:last-child {
  margin-bottom: 0;
}
.form-generator-text-bloder-record {
  display: flex;
  align-items: center;
  height: fit-content;
  width: fit-content;
  max-width: 80%;
  font-size: 18px;
  font-weight: bolder;
  margin-bottom: 8px;
}
.form-generator-text-normal-record {
  display: flex;
  align-items: center;
  height: fit-content;
  width: fit-content;
  max-width: 80%;
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}
</style>
