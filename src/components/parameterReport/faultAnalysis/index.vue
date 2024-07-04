<template>
  <div class="report-content" :style="mainminheight" id="rightCardId">
    <reportCommon :reportObj="reportObj" :stepList="stepList" :stepListIndex="stepListIndex">
      <div style="margin-bottom: 80px;">
        <!-- 设备&润滑&用油信息 -->
        <deviceLupOilInfo id="id0" :deviceLupOilInfoItem="deviceLupOilInfoItem" :reportObj="reportObj" />
        <!-- 设备应用功能及环境描述 -->
        <equipmentApplication id="id1" :equipmentApplicationItem="equipmentApplicationItem" :addFieldPoolDtoList="addFieldPoolDtoList" />
        <!-- 故障描述 -->
        <faultDesc id="id2" :faultDescItem="faultDescItem" :addFieldPoolDtoList="addFieldPoolDtoList" />
        <!-- 调查及原因分析 -->
        <causeAnalysis id="id3" :causeAnalysisItem="causeAnalysisItem" :addFieldPoolDtoList="addFieldPoolDtoList" :paramReportNode="stepList"/>
        <!-- 总结与建议 -->
        <summarySuggest id="id4" :summarySuggestItem="summarySuggestItem" :addFieldPoolDtoList="addFieldPoolDtoList" />
        <!-- 附录 -->
        <appendix id="id5" :appendixItem="appendixItem" :paramReportNode="stepList" :addFieldPoolDtoList="addFieldPoolDtoList" />
      </div>
      <div class="foot-botton">
        <el-button type="danger" plain :disabled="!disabledPreview" @click="previewReport" size="small">预览报告</el-button>
        <el-button type="danger" v-if="publishStatus == 0" plain @click="saveInfoDraft" size="small">保存草稿</el-button>
        <el-button type="danger" @click="saveInfoPublish" size="small">保存并发布</el-button>
        <el-button type="danger" plain @click="cancleEditInfo" size="small">取消</el-button>
      </div>
    </reportCommon>
  </div>
</template>
<script>
import scroll from "@/components/businessComponents/components/scroll";
import handle from "@/components/parameterReport/faultAnalysis/components/handle";
import validateForm from "@/components/businessComponents/components/validateForm";
import reportCommon from "@/components/businessComponents/components/reportCommon";
import deviceLupOilInfo from "@/components/parameterReport/faultAnalysis/components/deviceLupOilInfo";
import equipmentApplication from "@/components/parameterReport/faultAnalysis/components/equipmentApplication";
import faultDesc from "@/components/parameterReport/faultAnalysis/components/faultDesc";
import causeAnalysis from "@/components/parameterReport/faultAnalysis/components/causeAnalysis";
import summarySuggest from "@/components/parameterReport/faultAnalysis/components/summarySuggest";
import appendix from "@/components/parameterReport/oilChange/components/appendix";
import { reportParamSimplify } from '@/components/businessComponents/components/report-param-simplify'
export default {
  mixins: [handle, scroll, validateForm],
  components: {
    reportCommon,
    deviceLupOilInfo,
    equipmentApplication,
    faultDesc,
    causeAnalysis,
    summarySuggest,
    appendix
  },
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 170}px`,
      stepListIndex: 0,
      reportKey: 1,
      disabledPreview: true,
      publishStatus: 0,
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo")))
    };
  },
  created() {
    this.publishStatus = this.$route.query.publishStatus;
    this.queryReportStatus("first");
  },
  mounted() {
    this.$nextTick(() => {
      let timeId;
      const el = document.getElementById("rightCardId");
      el.addEventListener(
        "scroll",
        () => {
          // 页面滚动停止100毫秒后才会执行下面的函数。
          clearTimeout(timeId);
          timeId = setTimeout(() => {
            this.scrollToTop();
          }, 100);
        },
        true
      );
    });
  },
  destroy() {
    // 必须移除监听器，不然当该vue组件被销毁了，监听器还在就会出错
    window.removeEventListener("scroll", this.scrollToTop);
  },
  methods: {
    // 处理拼装数据
    handleParamData() {
      const data = [this.deviceLupOilInfoItem, this.equipmentApplicationItem, this.faultDescItem, this.causeAnalysisItem, this.summarySuggestItem, this.appendixItem];
      return data;
    },
    // 预览
    previewReport() {
      this.queryReportStatus();
    },
    // 调取报告详情接口
    queryReportStatus(val) {
      const params = {
        draftId: this.$route.query.draftId
      };
      this.requestMethodPost("/serviceReport/currentStatus", params).then(res => {
        if (res.data.code == 1000) {
          if (res.data.data.status == "0") {
            this.disabledPreview = false;
          }
          if (res.data.data.status == "1" && val != "first") {
            window.open(res.data.data.reportFileUrl);
          }
          if (res.data.data.status == "2" && val != "first") {
            this.$message({
              message: "报告正在生成中，请稍后",
              type: "warning"
            });
          }
          if (res.data.data.status == 3 && val != "first") {
            this.$message({
              message: "报告生成失败，请重试",
              type: "warning"
            });
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 保存草稿
    saveInfoDraft() {
      let valueDtoLisOriginal = this.handleParamData()
      const { valueDtoList, lubricationPointNumberList }  = reportParamSimplify(JSON.parse(JSON.stringify(valueDtoLisOriginal)))
      const params = {
        workOrderNumber: this.$route.query.workOrderNumber,
        saveAndPublish: false, // 最终保存为true，中途返回为fasle
        draftId: this.$route.query.draftId,
        deviceNumber: this.reportObj.deviceNumber,
        lubricationPointNumber: [...new Set([...lubricationPointNumberList,this.reportObj.lubricationPointNumber])].join(','),
        userId: this.userInfo.userId,
        valueDtoList: valueDtoList
      };
      this.requestMethodPost("/serviceReport/saveTemplateDetail", params)
        .then(res => {
          if (res.data.code == 1000) {
            this.disabledPreview = true;
            this.$message({
              message: "报告草稿已保存",
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(() => {});
    },
    // 保存并发布
    saveInfoPublish() {
      const data = [
        ...this.deviceLupOilInfoItem.nodeValue,
        ...this.equipmentApplicationItem.nodeValue,
        ...this.faultDescItem.nodeValue,
        ...this.causeAnalysisItem.nodeValue,
        ...this.summarySuggestItem.nodeValue,
        ...this.appendixItem.nodeValue
      ];
      const flag = this.validateFormItem(data);
      if (!flag) return;
      let valueDtoLisOriginal = this.handleParamData()
      const { valueDtoList, lubricationPointNumberList }  = reportParamSimplify(JSON.parse(JSON.stringify(valueDtoLisOriginal)))
      let lubricationPointNumberStr = [...new Set([...lubricationPointNumberList,this.reportObj.lubricationPointNumber])].join(',')
      if (this.reportObj.publishStatus == 1) {
        this.$confirm("新生成的文件将覆盖当前发布的文件，是否继续操作？", "保存并发布", {
          confirmButtonText: "覆 盖",
          cancelButtonText: "取消"
        })
          .then(() => {
            const params = {
              workOrderNumber: this.$route.query.workOrderNumber,
              saveAndPublish: true, // 最终保存为true，中途返回为fasle
              draftId: this.$route.query.draftId,
              deviceNumber: this.reportObj.deviceNumber,
              lubricationPointNumber: lubricationPointNumberStr,
              userId: this.userInfo.userId,
              valueDtoList: valueDtoList
            };
            this.requestMethodPost("/serviceReport/saveTemplateDetail", params).then(res => {
              if (res.data.code == 1000) {
                this.disabledPreview = true;
                this.$message({
                  message: "服务报告发布成功",
                  type: "success"
                });
                this.$router.go(-1);
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            });
          })
          .catch(() => {});
      } else {
        const params = {
          workOrderNumber: this.$route.query.workOrderNumber,
          saveAndPublish: true, // 最终保存为true，中途返回为fasle
          draftId: this.$route.query.draftId,
          deviceNumber: this.reportObj.deviceNumber,
          lubricationPointNumber: lubricationPointNumberStr,
          userId: this.userInfo.userId,
          valueDtoList: valueDtoList
        };
        this.requestMethodPost("/serviceReport/saveTemplateDetail", params).then(res => {
          if (res.data.code == 1000) {
            this.$message({
              message: "服务报告发布成功",
              type: "success"
            });
            this.$router.go(-1);
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
      }
    },
    // 取消
    cancleEditInfo() {
      this.$confirm("取消后将丢失本次编辑内容", "取消编辑", {
        cancelButtonText: "继续编辑",
        confirmButtonText: "确定",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      })
        .then(() => {
          this.$router.go(-1);
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="less" scoped>
.report-content {
  padding: 20px;
  height: 100%;
  position: relative;
  overflow: auto;
}
.foot-botton {
  width: 100%;
  background-color: #fff;
  height: 50px;
  position: fixed;
  bottom: 0;
}
</style>
