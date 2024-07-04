<!--
* @description  查看工单详情
* @author vvx
* @date 2020/04/15 16:57:26
* @version V1.0.0
!-->
<template>
<div style="position:relative">
  <div class="return-btn" style="position:absolute;right:20px;height:55px;line-height:55px;top:-55px;color:red;cursor:pointer" >
      <el-button type="danger" plain size="small" @click="handleBack"><img src="../../assets/back.png" style  ="vertical-align: middle;margin-right:5px;margin-top:-2px;height:10px;height:10px">返回</el-button>
  </div>
  <div class="qr-management-detail" :style="mainminheight">
    <p class="qr-management-detail-title">二维码信息</p>
    <el-form
      :model="woInfo"
      :rules="rules"
      ref="woInfo"
      label-width="100px"
      label-position="top"
      class="qr-management-detail-woInfo"
    >
    <div style="display:flex;justify-content:start">
      <div style="width:75%">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="二维码ID">
              <span>{{woInfo.qrNumber || '- -'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <span>{{woInfo.qrStatusStr || '- -'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生成时间">
              <span>{{woInfo.createTime || '- -'}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="8">
            <el-form-item label="所属公司">
              <!-- <span  style="color:rgb(0,160,240);cursor:pointer;">{{woInfo.companyName || '暂无'}}</span> -->
              <span>{{woInfo.companyName || '暂无'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="绑定设备">
              <span>{{woInfo.deviceName || '暂无'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="woInfo.qrStatus == 1">
            <el-form-item label="绑定时间">
              <span>{{woInfo.bindingTime || '- -'}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div style="width:180px;height:180px">
           <el-image 
            style="width: 100%; height: 100%"
            :src="woInfo.qrUrl" 
            :preview-src-list="[woInfo.qrUrl]">
          </el-image>
          <div class="qr-management-detail-title" style="text-align:center">二维码</div>
      </div>
    </div>
    <p class="qr-management-detail-title">变更记录</p>
        <el-table
            row-key="id"
            class="customer-no-border-table"
            :data="woInfo.recordList"
            style="width: 50%;margin-left:-10px"
          >
            <el-table-column prop="createTime" label="时间" min-width="15%" ></el-table-column>
            <el-table-column prop="content" label="内容" min-width="15%"></el-table-column>
            <el-table-column prop="operateUserName" label="操作人" min-width="15%" ></el-table-column>
            <el-table-column prop="createUser" label="操作人账号" min-width="15%"></el-table-column>
          </el-table>
    </el-form>  
  </div> 
    <div slot="footer"  style="margin:30px 20px;position:fixed;bottom:0px;">
      <el-button type="danger" @click="unbinding" size="small" style="background:#fe000c" v-if="woInfo.qrStatus == 1">解除绑定</el-button>
    </div> 
</div>
</template>
<script>
export default {
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 230}px`,
      // 工单信息
      woInfo: {},
      //表单验证
      ruleForm: {
        close: "",
        text: "" //关闭原因
      },
      dialogFormVisible: false, //是否显示关闭说明，默认隐藏
      dialogTableVisibleWO: false, //是否展示工单跟踪，默认隐藏
      img1: require("../../assets/checked2.png"),
      img2: require("../../assets/checked.png"),
      reportList: [], //服务报告
      src1: require("../../assets/xingxing_1.png"),
      src2: require("../../assets/xingxing.png")
    };
  },

  components: {},

  computed: {},

  mounted() {},

  created() {
    this.$_getWOInfo(this.$route.query.id);
  },

  methods: {
    // 返回
    handleBack() {
      history.back()
    },
    // 获取工单详情
    $_getWOInfo(id) {
      let params = {
        id:id
      };
      this.requestMethodGet("/qr/manage/queryQrById", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.woInfo = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    unbinding(){
      let params = { 
        id:this.woInfo.id
      };
        this.$confirm("确定解除二维码和设备的绑定吗？解除后，扫一扫将无法读取二维码中设备信息", "提交", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            customClass:'deletBtn',
            closeOnClickModal:false,
            type: "warning"
        }).then(() => {
          this.requestMethodPost("/qr/manage/unBindingQr", params)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              this.$message({
                  message: "解绑成功",
                  type: "success"
              });
              this.$_getWOInfo(this.$route.query.id); //获取列表
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {});
        }).catch(() => {});
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight -
        240}px`;
    },
    //下载服务报告
    handleDownLoad(url) {
      window.open(url);
    }
  }
};
</script>
<style lang='less'>
.qr-management-detail {
  padding: 20px;
  height: calc(100% - 40px);
  overflow: auto;
  &-title {
    font-weight: bold;
    font-size: 16px;
  }
  &-base-info {
    padding: 20px 0;
    overflow: hidden;
  }
  &-woInfo {
    &-img {
      display: flex;
      justify-content: start;
      img {
        width: 128px;
        height: 128px;
        margin-right: 20px;
      }
    }
  }
  &-status-box {
    position: relative;
    &-flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &-line {
        height: 2px;
        width: 100%;
        position: absolute;
        top: 10px;
        left: 0px;
        background: rgb(204, 204, 204);
      }
      img {
        width: 48px;
        height: 48px;
        background: #ffffff;
      }
      &-progress {
        padding-top: 20px;
      }
    }
  }
   .customer-no-border-table th{
     border:none;
    }
  .customer-no-border-table td,.customer-no-border-table th.is-leaf {
    border:none;
  }
  /*表格最外边框*/
  .customer-no-border-table .el-table--border, .el-table--group{
      border: none;
    }
    /*头部边框*/
    .customer-no-border-table thead tr th.is-leaf{
      border: 0px solid #EBEEF5;
      border-right: none;
    }
  .customer-no-border-table thead tr th:nth-last-of-type(2){
    border-right: 0px solid #EBEEF5;
  }
  /*表格最外层边框-底部边框*/
  .customer-no-border-table .el-table--border::after,.customer-no-border-table .el-table--group::after{
      width: 0;
    }
  .customer-no-border-table::before{
    width: 0;
  }
  .customer-no-border-table .el-table__fixed-right::before,.el-table__fixed::before{
    width: 0;
  }
  .customer-no-border-table .el-table__header tr th{
    background: #fff;
    // color: #333333 ;
    padding: 3px ;
    height: 36px ;
    border: 0px;
    font-size: 15px;
  }
}
  .deletBtn .el-button--primary {
    background-color:#fe000c !important;
    border-color:#fe000c !important;
  }   
  .deletBtn .el-message-box__container {
      position: relative;
  }
  .deletBtn .el-icon-warning {
    color: #fe000c !important;
    top: 15px !important;
  }
</style>