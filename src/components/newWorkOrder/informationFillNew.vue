<template>
  <div class="work-order-component" :style="mainminheight">
    <!-- 步骤条 -->
    <el-steps :active="activeStep" align-center>
      <el-step v-for="(item, index) in stepList" :key="index" :title="item.nodeName"></el-step>
    </el-steps>
    <!-- 设备信息 -->
    <DeviceInfo v-if="currentActive == 1 && hasDevice" ref="deviceRef" :type="type" :deviceObj="deviceObj" :saveParams="saveParams" v-on:passModulValidate="passModulValidate" />
    <!-- 润滑点信息 -->
    <LubricationInfo
      v-if="currentActive == 2 && haslubrication"
      ref="lubricationRef"
      :type="type"
      :deviceObj="lubDetailObj"
      :saveParams="saveParams"
      :lubricationObj="lubricationObj"
      :oilType="oilType"
      :lubricationPointTypeCode="lubricationPointTypeCode"
      v-on:passModulValidate="passModulValidate"
    />
    <!-- 运行参数 -->
    <ParameterInfo
      v-if="currentActive == 3 && hasParams"
      ref="paramsRef"
      :type="type"
      :deviceObj="lubDetailObj"
      :paramsObj="paramsObj"
      :stepListLength="stepListLength"
      v-on:passModulValidate="passModulValidate"
    />
    <!-- 运行情况 -->
    <OperationInfo
      v-if="currentActive == 4 && hasOperation"
      ref="operationRef"
      :type="type"
      :deviceObj="lubDetailObj"
      :operationObj="operationObj"
      :lubricationObj="lubricationObj"
      v-on:passModulValidate="passModulValidate"
    />
    <!-- 总结与建议 -->
    <Suggest v-if="currentActive == 5 && hasSuggest" ref="suggestRef" :type="type" :deviceObj="lubDetailObj" :suggestObj="suggestObj" v-on:passModulValidate="passModulValidate" />
    <div class="foot-botton">
      <el-button type="danger" @click="backList" size="small" v-gio.click="clickReturnToList">返回列表</el-button>
      <el-button type="danger" v-if="activeStep > 1" plain @click="lastPage(activeStep)" size="small">上一页</el-button>
      <el-button type="danger" v-if="activeStep < stepList.length" plain @click="nextPage(activeStep)" size="small">下一页</el-button>
      <el-button type="danger" v-if="activeStep == stepList.length && type == 'edit'" plain @click="saveInfo" size="small">保存</el-button>
    </div>
    <!--保存dialog  -->
    <el-dialog :visible.sync="dialogSaveVisible" width="500px" :close-on-click-modal="false" show-close>
      <div style="text-align: center;">调查表已保存，是否需要预览报告？</div>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="danger" plain @click="cancelPriview" size="small">否</el-button>
        <el-button type="danger" @click="confirmPriview" size="small">是</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DeviceInfo from "./components/deviceInfo";
import LubricationInfo from "./components/lubricationInfo";
import ParameterInfo from "./components/parameterInfo";
import OperationInfo from "./components/operationInfo";
import Suggest from "./components/suggest";
export default {
  components: { DeviceInfo, LubricationInfo, ParameterInfo, OperationInfo, Suggest },
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 170}px`,
      activeStep: 1,
      currentActive: 1,
      dialogSaveVisible: false,
      stepList: [],
      fullObj: {},
      deviceObj: [],
      lubDetailObj: [],
      lubricationObj: [],
      paramsObj: [],
      operationObj: [],
      suggestObj: [],
      type: "",
      id: "",
      hasDevice: false,
      haslubrication: false,
      hasParams: false,
      hasOperation: false,
      hasSuggest: false,
      deviceNodeNo: null,
      lubricationNo: null,
      paramsNo: null,
      operationNo: null,
      suggestNo: null,
      stepListLength: 0,
      saveParams: {},
      userInfo: {},
      lubricationPointTypeCode: "",
      oilType: null
    };
  },
  mounted() {
    this.type = this.$route.query.type;
    this.id = this.$route.query.id;
    this.userInfo = this.$route.query.userInfo;
    this.getStepList();
  },
  created() {},
  methods: {
    // 获取步骤条和内容
    getStepList() {
      this.requestMethodGet("/web/service/ps/queryPsServiceTaskDetail", { id: this.id }).then(res => {
        res = res.data;
        if (res.code == 1000) {
          // res.data[0].valueDtoList.splice(3,1)
          // const data = res.data[0].valueDtoList
          this.saveParams = res.data[0];
          this.lubricationPointTypeCode = res.data[0].lubricationPointTypeCode;
          this.oilType = res.data[0].oilType;
          this.stepList = res.data[0].valueDtoList;
          this.stepListLength = res.data[0].valueDtoList.length;
          res.data[0].valueDtoList.forEach((item, index) => {
            if (item.nodeName == "设备信息") {
              this.deviceObj = item.nodeValue;
              this.hasDevice = true;
              this.deviceNodeNo = item.nodeNo;
            } else if (item.nodeName == "润滑点信息") {
              this.lubDetailObj = item.nodeValue;
              this.lubricationObj = item.nodeValue;
              this.haslubrication = true;
              this.lubricationNo = item.nodeNo;
            } else if (item.nodeName == "运行参数") {
              this.paramsObj = item.nodeValue;
              this.hasParams = true;
              this.paramsNo = item.nodeNo;
            } else if (item.nodeName == "运行情况") {
              this.operationObj = item.nodeValue;
              this.hasOperation = true;
              this.operationNo = item.nodeNo;
            } else if (item.nodeName == "总结与建议") {
              this.suggestObj = item.nodeValue;
              this.hasSuggest = true;
              this.suggestNo = item.nodeNo;
            }
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    // 返回列表
    backList() {
      if (this.type == "view") {
        this.$router.go(-1);
        return;
      }
      const params = {
        deviceNumber: this.saveParams.deviceNumber,
        workOrderNumber: this.saveParams.workOrderNumber,
        esCompletedSave: false, //最终保存为true，中途返回为fasle
        lubricationPointNumber: this.saveParams.lubricationPointNumber,
        taskId: this.saveParams.id,
        userId: this.userInfo.userId,
        valueDtoList: this.stepList
      };
      this.requestMethodPost("/web/service/ps/savePsServiceNodeValue", params).then(res => {
        if (res.data.code == 1000) {
          this.$router.go(-1);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 上一页
    lastPage() {
      let preActive;
      this.stepList.forEach((item, index) => {
        if (item.nodeNo == this.currentActive) {
          preActive = this.stepList[index - 1].nodeNo;
        }
      });
      --this.activeStep;
      this.currentActive = preActive;
    },
    // 下一页
    nextPage(val) {
      const activeNum = this.currentActive;
      switch (activeNum) {
        case 1:
          this.$refs.deviceRef.validateDevice("deviceRef");
          break;
        case 2:
          this.$refs.lubricationRef.validateDevice("lubricationRef");
          break;
        case 3:
          this.$refs.paramsRef.childMethod("paramsRef");
          break;
        case 4:
          this.$refs.operationRef.childMethod("operationRef");
          break;
      }
    },
    // 验证通过后
    passModulValidate() {
      let nextActive;
      this.stepList.forEach((item, index) => {
        if (item.nodeNo == this.currentActive) {
          nextActive = this.stepList[index + 1].nodeNo;
        }
      });
      ++this.activeStep;
      this.currentActive = nextActive;
    },
    // 保存
    saveInfo() {
      const params = {
        deviceNumber: this.saveParams.deviceNumber,
        workOrderNumber: this.saveParams.workOrderNumber,
        esCompletedSave: true, //最终保存为true，中途返回为fasle
        lubricationPointNumber: this.saveParams.lubricationPointNumber,
        taskId: this.saveParams.id,
        userId: this.userInfo.userId,
        valueDtoList: this.stepList
      };
      this.requestMethodPost("/web/service/ps/savePsServiceNodeValue", params).then(res => {
        if (res.data.code == 1000) {
          this.$confirm("调查表已保存，是否需要预览报告？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.getFullFillPath(res.data.data);
            })
            .catch(() => {
              this.$router.go(-1);
            });
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    getFullFillPath(val) {
      const params = {
        url: encodeURI(val)
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          window.open(res.data.data);
          this.$gio.previewServiceReport_serviceReport({
            entrance: "工单详情页"
          });
          setTimeout(() => {
            this.$router.go(-1);
          }, 800);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 不预览
    cancelPriview() {
      this.dialogSaveVisible = false;
    },
    // 确定预览
    confirmPriview() {
      this.cancelPriview();
    }
  }
};
</script>

<style lang="less" scoped>
.work-order-component {
  padding: 20px;
  height: 100%;
  overflow: auto;
  &-serach-item {
    label {
      display: inline-block;
      width: 28%;
      text-align: right;
      padding-bottom: 10px;
    }
  }
}
.foot-botton {
  width: 100%;
  background-color: #fff;
  height: 50px;
  position: fixed;
  bottom: 0;
}
</style>
