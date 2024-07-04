<!--
* @description 账号管理
* @fileName accountManagement.vue
* @author vvx
* @date 2020/05/15 15:30:23
* @version V1.0.0
!-->
<template>
  <div class="equipment-lubr-detail">
    <div class="return-btn" style="position: absolute; right: 20px; height: 60px; line-height: 60px; top: -55px">
      <el-button type="danger" size="small" @click="handleEdit" v-if="detailData.applyUserId == userInfo.userId && userInfo.userType == 1 && (detailData.status == 0 || detailData.status == 3)"
        >编辑</el-button
      >
      <el-button type="danger" plain size="small" @click="submitDeviceLubes" v-if="userInfo.userType == 1 && detailData.status == 0 && detailData.applyUserId == userInfo.userId">提交</el-button>
      <el-button type="danger" size="small" @click="handlePass" v-if="userInfo.userType == 0 && detailData.status == 1 && detailData.nextUserId.includes(userInfo.userId.toString())"
        >通过申请</el-button
      >
      <el-button
        type="danger"
        plain
        size="small"
        @click="reasonFormVisible = true"
        v-if="userInfo.userType == 0 && detailData.status == 1 && detailData.nextUserId.includes(userInfo.userId.toString())"
        >驳回申请</el-button
      >
      <el-button type="danger" plain size="small" @click="downloadPDF" v-if="detailData.status == 2">下载设备润滑表</el-button>
      <el-button type="danger" plain size="small" @click="$router.back()">取消</el-button>
    </div>
    <!-- 内容区域 -->
    <div :style="mainminheight" class="equipment-lubr-detail" style="padding: 10px 20px 24px; overflow: auto">
      <div style="border-top: 1px solid #f0f0f0; padding-top: 24px">
        <div class="service-name-form">
          <div class="name-content" style="justify-content: space-between">
            <div class="name-content">
              <div class="title">设备润滑表</div>
              <div class="status" :style="detailData.status == 2 ? 'background:#008888' : detailData.status == 1 ? 'background:#dd0000' : 'background:#999'">
                {{ detailData.status | status }}
              </div>
              <div style="color: #001450; cursor: pointer; text-decoration: underline; margin-left: 16px" @click="previewPDF">申请表预览</div>
            </div>
            <div v-if="detailData.status > 1">
              <span style="color: #999" v-if="detailData.operateTime">{{ detailData.operateTime }}</span>
              <span style="margin: 0 10px; color: #e9e9e9" v-if="detailData.status == 3">|</span>
              <span style="color: #dd0000; cursor: pointer" @click="lookReason" v-if="detailData.status == 3">查看驳回原因</span>
            </div>
          </div>
          <div style="height: 15px"></div>
          <el-form label-width="80px" label-position="top" inline>
            <el-row>
              <el-form-item label="申请单号" class="label">
                <span style="color: #001450">{{ detailData.deviceLubesNo }}</span>
              </el-form-item>
              <el-form-item label="经销商" class="label">
                <div>{{ detailData.disCompanyName }}</div>
              </el-form-item>
              <el-form-item label="客户" class="label">
                <span>{{ detailData.companyName }}</span>
              </el-form-item>
              <el-form-item label="申请人" class="label">
                <span>{{ detailData.applyUserName }}</span
                ><span style="color: #001450; margin-left: 8px">{{ detailData.applyPhone }}</span>
              </el-form-item>
              <el-form-item label="创建时间" class="label">
                <span>{{ detailData.createTime }}</span>
              </el-form-item>
            </el-row>
            <el-row style="margin-top: 15px">
              <el-form-item label="价格时间支持段" class="label">
                <span style="color: #001450">{{ detailData.startTime }} - {{ detailData.endTime }}</span>
              </el-form-item>
              <el-form-item label="客户子账号" class="label">
                <div>{{ detailData.customerSubaccount }}</div>
              </el-form-item>
              <el-form-item label="价格申请原因" class="label">
                <el-tooltip effect="dark" :content="detailData.priceApplyReason" placement="top">
                  <span class="apply-reason-line">{{ detailData.priceApplyReason }}</span>
                </el-tooltip>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
      </div>
      <el-row :gutter="20" style="margin-top: 24px">
        <el-col :span="6" v-for="item in detailData.dtoList" :key="item.deviceId">
          <el-card class="box-card" style="margin-bottom: 20px">
            <div slot="header" class="clearfix">
              <span style="font-size: 14px; font-weight: bold; color: #000">申请信息</span>
              <el-button style="float: right; padding: 3px 0; color: #999" type="text" class="detail-btn" @click="lookDetail(item)">详情</el-button>
            </div>
            <div style="color: #999; margin-bottom: 16px">
              <span>润滑点名称：</span
              ><span style="color: #000"
                >{{ item.lubricationPointType }}<span v-if="item.lubricationPointName">-{{ item.lubricationPointName }}</span></span
              >
            </div>
            <div style="color: #999; margin-bottom: 16px">
              <span>设备名称：</span><span style="color: #000">{{ item.deviceName }}</span>
            </div>
            <div style="color: #999; margin-bottom: 16px">
              <span>设备数（台）：</span><span style="color: #dd0000">{{ item.deviceCount }}</span>
            </div>
            <div style="color: #999; margin-bottom: 16px">
              <span>产品（名称/包装）：</span><span style="color: #dd0000">{{ item.oilName }}/{{ item.oilPackage || 0 }}{{ item.oilBoxCapacityUnit }}</span>
            </div>
            <div style="color: #999; margin-bottom: 16px">
              <span>产品编号：</span><span style="color: #dd0000">{{ item.productNumber }}</span>
            </div>
            <div style="color: #999">
              <span>年度用油量申请数（件）：</span><span style="color: #dd0000">{{ item.yearOilVol }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 详情 -->
    <el-dialog title="详情" :visible.sync="detailDialogFlag" :append-to-body="true" width="750px" :close-on-click-modal="false" class="select-device">
      <el-card class="box-card" style="margin-bottom: 20px">
        <el-row :gutter="20">
          <el-col :span="12" style="border-right: 1px solid #e9e9e9">
            <div>
              <div style="color: #999; margin-bottom: 16px">
                <span style="font-size: 15px; color: #000">申请量详情信息</span>
              </div>
              <div style="color: #999; margin-bottom: 16px">
                <span>润滑点名称：</span
                ><span style="color: #000"
                  >{{ detailRow.lubricationPointType }}<span v-if="detailRow.lubricationPointName">-{{ detailRow.lubricationPointName }}</span></span
                >
              </div>
              <div style="color: #999; margin-bottom: 16px">
                <span>设备名称：</span><span style="color: #000">{{ detailRow.deviceName }}</span>
              </div>
              <div style="color: #999; margin-bottom: 16px">
                <span>设备数（台）：</span><span style="color: #dd0000">{{ detailRow.deviceCount }}</span>
              </div>
              <div style="color: #999; margin-bottom: 16px">
                <span>产品（名称/包装）：</span><span style="color: #dd0000">{{ detailRow.oilName }}/{{ detailRow.oilPackage || 0 }}{{ detailRow.oilBoxCapacityUnit }}</span>
              </div>
              <div style="color: #999; margin-bottom: 16px">
                <span>产品编号：</span><span style="color: #dd0000">{{ detailRow.productNumber }}</span>
              </div>
              <div style="color: #999">
                <span>年度用油量申请数（件）：</span><span style="color: #dd0000">{{ detailRow.yearOilVol }}</span>
              </div>
            </div>
            <div style="margin-top: 20px; padding-top: 20px">
              <!-- <div style="color: #999; margin-bottom: 16px">
                <span style="font-size: 15px; color: #000">
                  单台设备用油信息
                </span>
              </div> -->
              <div style="color: #999; margin-bottom: 16px; margin-top: -25px">
                <span>油箱容量（{{ detailRow.oilBoxCapacityUnit }}）：</span><span style="color: #000">{{ detailRow.oilTankVol }}</span>
              </div>
              <div style="color: #999; margin-bottom: 16px">
                <span>冲洗量（{{ detailRow.oilBoxCapacityUnit }}）：</span><span style="color: #000">{{ detailRow.flushingVol || 0 }}</span>
              </div>
              <div style="color: #999; margin-bottom: 16px">
                <span>添加量（{{ detailRow.oilBoxCapacityUnit }}）：</span><span style="color: #000">{{ detailRow.serviceFillVol || 0 }}</span>
              </div>
              <div style="color: #999">
                <span>换油周期（{{ detailRow.odiUnit }}）：</span><span style="color: #000">{{ detailRow.odi }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="color: #999; margin-bottom: 16px">
              <span style="font-size: 15px; color: #000">辅助信息</span>
            </div>
            <div style="color: #999; margin-bottom: 16px">
              <span>是否初装/整体换油：</span><span style="color: #000">{{ detailRow.changeOver ? "是" : "否" }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-dialog>
    <!--驳回原因 -->
    <el-dialog title="输入驳回原因" :visible.sync="reasonFormVisible" width="500px" class="email-dialog" :close-on-click-modal="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right">
        <el-row class="email-font">
          <el-col :span="24">
            <el-form-item prop="rejectReason">
              <el-input :rows="4" v-model="ruleForm.rejectReason" :clearable="true" type="textarea" maxlength="50" show-word-limit placeholder="请输入原因"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button @click="reasonFormVisible = false" size="small">取消</el-button>
        <el-button type="danger" @click="rejectReason('ruleForm')" size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseRemoteOauth2 } from "@/api/api";
export default {
  name: "EquipmentLubrTable",
  data() {
    return {
      detailData: {},
      detailRow: {},
      detailDialogFlag: false,
      reasonFormVisible: false,
      status: 2,
      mainminheight: `height:${document.documentElement.clientHeight - 140}px`,
      queryParams: {
        name: "", //客户名称
        status: "" //状态
      },
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      // userInfo: JSON.parse(this.$cookies.get("userInfo")),
      ruleForm: {
        rejectReason: ""
      },
      rules: {
        rejectReason: [{ required: true, message: "请输入驳回原因", trigger: "blur" }]
      },
      lumDataCustomers: [],
      lubricatepointNameList: [],
      statusList: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 0,
          label: "未提交"
        },
        {
          value: 1,
          label: "进行中"
        },
        {
          value: 2,
          label: "已驳回"
        },
        {
          value: 3,
          label: "已审批"
        }
      ],
      pagenation: {
        current: 1,
        size: 30
      },
      newsTableData: [],
      totalNumber: 0, //总条数
      dataRecordTableData: [],
      selectList: [],
      dialogTitle: "",
      loading: false //是否加载
    };
  },

  components: {},
  filters: {
    status(val) {
      switch (val) {
        case 0:
          return "未提交";
        case 1:
          return "进行中";
        case 3:
          return "已驳回";
        case 2:
          return "已审批";
        default:
          break;
      }
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.getDeviceLubesDetail(); //获取短信列表
  },
  methods: {
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 140}px`;
    },
    handleEdit() {
      this.$router.push({
        path: "/EquipmentLubrTable/EditEquipmentLubrTable",
        query: {
          id: this.$route.query.id
        }
      });
    },
    addTable() {
      // this.applyDialogFlag = true
      this.selectDeviceVisiable = true;
    },

    lookReason() {
      this.$alert(this.detailData.rejectRemark, "驳回原因", {
        showConfirmButton: false,
        callback: action => {}
      });
    },
    // 通过申请
    handlePass() {
      this.$confirm("确认通过申请?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "deletBtn",
        type: "warning"
      })
        .then(() => {
          this.handleFlow(2);
        })
        .catch(err => {
          console.log(err);
        });
    },
    rejectReason() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.handleFlow(0);
        }
      });
    },
    // 获取详情信息
    getDeviceLubesDetail() {
      this.loading = true;
      let params = {
        id: this.$route.query.id
      };
      this.requestMethodGet("/device/lubes/getDeviceLubesById", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.detailData = res.data;
            this.$gio.toViewLubricationTablePage({
              customer:this.detailData.companyName
            })
            // 
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    lookDetail(row) {
      this.detailRow = row;
      this.detailDialogFlag = true;
    },
    handleFlow(val) {
      let params = {
        id: this.$route.query.id,
        actionType: val,
        remark: val == 2 ? "" : this.ruleForm.rejectReason
      };
      this.requestMethodPost("/device/lubes/handleFlow", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.$message({
              message: val == 2 ? "申请已通过" : "申请已驳回",
              type: "success"
            });
            this.$router.back();
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    submitDeviceLubes(id) {
      let params = {
        id: this.$route.query.id
      };
      const formData = new FormData();
      formData.append("id", this.$route.query.id);
      this.requestMethodPost("/device/lubes/submitFlow", formData)
        .then(res => {
          res = res.data;
          this.loading = false;
          if (res.code == 1000) {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.$router.back();
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    previewPDF() {
      window.open(this.detailData.pdfUrl);
      this.$gio.clickLubricationTablePreviewButton();
    },
    downloadPDF() {
      window.location.href = this.detailData.pdfDownloadUrl;
    }
  }
};
</script>
<style lang="less" scoped>
.equipment-lubr-detail {
  height: 100%;
  font-size: 13px;
  position: relative;
  .service-name-form {
    padding: 16px;
    background: #f9f9f9;
    border-radius: 6px;
  }
  .name-content {
    display: flex;
    align-items: center;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
    color: #000;
  }
  .status {
    width: 60px;
    border-radius: 13px;
    background-color: #999;
    color: #fff;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 26px;
    line-height: 26px;
    margin-left: 10px;
  }
  /deep/.el-form-item__label {
    color: #999;
  }
  .label {
    margin-right: 30px;
    margin-bottom: 0px;
  }
  /deep/.box-card .el-card__header {
    background: rgba(204, 221, 255, 0.2);
  }
  /deep/.box-card .detail-btn:hover {
    color: #001450 !important;
  }
}
.select-device {
  /deep/.el-dialog__title {
    font-size: 16px;
  }
  /deep/.el-dialog__body {
    font-size: 14px;
    padding: 10px 20px 40px !important;
  }
}
.look-process {
  .title {
    font-weight: bold;
    color: #000;
  }
  .content {
    margin-top: 8px;
    font-size: 12px;
    color: #999;
  }
  .el-timeline-item__node--large {
    width: 20px;
    height: 20px;
    left: -5px;
    top: -3px;
  }
}
.equipment-management .el-form--label-top .el-form-item__label {
  padding: 0 !important;
}
.deletBtn .el-button--primary {
  background-color: #fe000c !important;
  border-color: #fe000c !important;
}
.deletBtn .el-message-box__container {
  position: relative;
}
.deletBtn .el-icon-warning {
  color: #fe000c !important;
  /* top: 1px !important; */
}
.apply-reason-line{
  display: inline-block;
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
