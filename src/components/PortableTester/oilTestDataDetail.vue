<!--
* @description  查看工业客户档案
-->
<template>
  <div style="position: relative">
    <div class="add-customer-profile" :style="mainminheight">
      <!-- 公司名称 -->
      <div class="company-content">
        <div class="company-title-info">
          <div class="company-info">
            <div style="font-size: 20px; color: #000; line-height: 25px; font-weight: bold">仪器编号：{{ $route.query.portableNumber }}</div>
            <div style="height: 10px"></div>
            <div style="display: flex; align-items: center"></div>
          </div>
        </div>
      </div>
      <!-- 公司信息 -->
      <div class="company-info-content" id="header">
        <el-form ref="form" :model="ruleForm" label-width="100px" label-position="left">
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item label="仪器类型" label-width="110px">
                <el-tooltip class="item" effect="dark" :content="$route.query.portableType" placement="top">
                  <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ $route.query.portableType || "- -" }}</div>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="所属单位" label-width="110px">
                <div style="display: flex; align-items: center">
                  <el-tooltip class="item" effect="dark" :content="$route.query.companyName" placement="top">
                    <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ $route.query.companyName || "--" }}</div>
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="使用人" label-width="50px">
                <span>{{ $route.query.users || "暂无" }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="备注" label-width="110px">
                <div style="display: flex; align-items: center">
                  <el-tooltip class="item" effect="dark" :content="$route.query.remarks" placement="top">
                    <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ $route.query.remarks || "--" }}</div>
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-button type="danger" size="small" plain @click="handleRefresh" style="margin-top:20px;">刷新数据</el-button>
      <!-- 表格 -->
      <div v-if="oilList.length > 0">
        <div style="height:400px;overflow: auto;" v-loading="loading">
          <div v-for="(item, indexDevice) in oilList" :key="indexDevice" style="padding:20px;margin:20px;border:1px solid rgba(204,221,255,0.4);background:rgba(204,221,255,0.2);border-radius:8px;">
            <el-row :gutter="20">
              <el-col :span="7" style="margin-bottom:10px;">
                <span class="font-left">油品清洁度：</span>
                <span class="font-right">{{ item.indexValue.index10 }}</span>
              </el-col>
              <el-col :span="7" style="margin-bottom:10px;">
                <span class="font-left">40-C运动粘度：</span>
                <span class="font-right">{{ item.indexValue.index5 }} cst</span>
              </el-col>
              <el-col :span="7" style="margin-bottom:10px;">
                <span class="font-left">水分含量：</span>
                <span class="font-right">{{ item.indexValue.index8 }} ppm</span>
              </el-col>
              <el-col :span="7">
                <span class="font-left">上传时间：</span>
                <span class="font-right">{{ item.indexValue.create_time }} </span>
              </el-col>
              <el-col :span="7">
                <span class="font-left">备注： </span>
                <span class="font-right">{{ item.indexValue.index16 }}</span>
              </el-col>
            </el-row>
          </div>
        </div>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenation.current"
          :page-size="pagenation.size"
          :page-sizes="[5, 10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="oilTotal"
          style="float: right;display:flex; margin-top: 10px"
        ></el-pagination>
      </div>
      <div v-if="oilList.length == 0">
        <div class="empty-pes">
          <img style="width:160px;height:160px" src="../../assets/pes_empty.png" alt="" />
          <span style="font-size:13px;color:#999">
            暂无验油数据，请等待上传或检查仪器编号是否正确
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 200}px`,
      mainminheightData: `height:${document.documentElement.clientHeight - 900}px`,
      oilList: [],
      // 分页参数
      pagenation: {
        page: 1,
        size: 10
      },
      loading: false, //是否加载
      oilTotal: 0 // 总条数
    };
  },
  created() {},
  mounted() {
    window.onresize = () => {
      return (() => {
        this.mainminheight = `height:${document.documentElement.clientHeight - 200}px`;
        this.mainminheightData = `height:${document.documentElement.clientHeight - 900}px`;
      })();
    };
    this.$_getOilList();
  },
  methods: {
    // page change  事件
    handleCurrentChange(page) {
      this.pagenation.current = page;
      this.$_getOilList(); // 获取列表
    },
    // size change 事件
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.$_getOilList(); // 获取列表
    },
    // 刷新数据
    handleRefresh() {
      this.pagenation.size = 10;
      this.pagenation.current = 1;
      this.$_getOilList();
      this.$gio.clickRefreshDataButton();
    },
    $_getOilList() {
      this.loading = true;
      const params = {
        portableNumber: this.$route.query.portableNumber,
        ...this.pagenation
      };
      this.requestMethodGet("/portable/device/getIotPortableData", params)
        .then(res => {
          this.loading = false;
          if (res.data.code == 1000) {
            this.oilList = res.data.data.list;
            this.oilTotal = res.data.data.totalCount;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.team {
  min-height: 260px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  display: flex;
}
.empty-pes {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.font-left,
.font-right {
  font-weight: 400;
  font-size: 13px;
  line-height: 13px;
  color: #999;
}
.font-right {
  color: #333;
}
.left-tree-content {
  width: 300px;
  padding: 20px 0;
  padding-left: 20px;
  border-right: 1px solid #ccc;
}
.right-detail-content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}
.company-content {
  display: flex;
  align-items: center;
}
.company-img {
  width: 64px;
  height: 64px;
  background-color: #f9f9f9;
  border-radius: 6px;
  border: solid 1px #e9e9e9;
}
.company-type {
  font-size: 12px;
  color: #666;
  line-height: 25px;
  padding: 0 9px;
  background-color: #ccddff;
  border-radius: 4px;
}
.company-status {
  line-height: 25px;
  font-size: 12px;
  color: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 9px;
}
// 公司信息
.company-info-content {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 20px 0 0 20px;
  margin-top: 20px;
}
.member-number {
  height: 31px;
  display: flex;
  align-items: center;
  margin: 24px 0;
}
.tabs-item {
  margin-right: 15px;
  cursor: pointer;
}

.add-customer-profile {
  padding: 20px;
  height: 100%;
  &-title {
    font-weight: bold;
    font-size: 16px;
  }
  &-base-info {
    padding: 20px 0;
    overflow: hidden;
  }
}
</style>
<style>
.add-customer-profile .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.add-customer-profile .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.add-customer-profile .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.add-customer-profile .avatar {
  width: 128px;
  height: 128px;
  display: block;
}
.add-customer-profile .el-form-item__label {
  color: #999999;
  padding: 0;
}
.add-customer-profile .el-tabs__nav-wrap::after {
  background: none;
}
.add-customer-profile .el-tabs__item.is-active {
  color: red;
}
.add-customer-profile .el-tabs__active-bar {
  background: red;
}
.add-customer-profile .el-form-item__label {
  color: #999999;
}
.footer {
  padding: 20px 0;
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
  top: 15px !important;
}
</style>
