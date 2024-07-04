<template>
  <div style="position:relative">
    <div style="position:absolute;right:20px;height:55px;line-height:55px;top:-50px;color:red;cursor:pointer">
      <el-button type="danger" size="small" @click="reportDialog('add')">新建</el-button>
    </div>
    <div class="review-report-content" :style="mainminheight">
      <!-- 列表 -->
      <div>
        <el-table
          ref="reviewTable"
          row-key="id"
          stripe
          v-loading="loading"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          row-style="height:20px"
          :header-cell-style="{ background: '#f7f7f7' }"
        >
          <el-table-column prop="createTime" label="创建日期" min-width="10%"></el-table-column>
          <el-table-column label="报告模板" min-width="10%">
            <template slot-scope="scope">
              <span>{{scope.row.reviewType==1?'阶段运营报告':scope.row.reviewType==2?'年度数字回顾':'客户服务年度回顾'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="报告时间范围" min-width="10%">
            <template slot-scope="scope">
              <span v-if="scope.row.reviewType==1">{{scope.row.reviewTimeStart}} 至 {{scope.row.reviewTimeEnd}}</span>
              <span v-if="scope.row.reviewType!=1">{{scope.row.reviewYear}}年 </span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="10%">
            <template slot-scope="scope">
              <span :style="{ color: scope.row.status == 1 ? 'green' : '#dd0000' }">{{ scope.row.status == 1 ? "已上线" : "已下线" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <div>
                <el-link type="primary" :underline="false" @click="reportDialog('view', scope.row)">查看</el-link>
                <el-link type="primary" :underline="false" @click="reportDialog('edit', scope.row)">编辑</el-link>
                <el-link type="primary" :underline="false" @click="changeStatus(scope.row)">{{ scope.row.status == 1 ? "下线" : "上线" }}</el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 弹框 -->
      <el-dialog
        :title="'回顾报告' + ' > ' + (dialogType == 'add' ? '新建' : dialogType == 'edit' ? '编辑' : '查看')"
        :visible.sync="reportDialogVisible"
        width="40%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form :model="reportForm" :rules="reportRules" :validate-on-rule-change="false" ref="reportRef" label-position="right" label-width="120px">
          <el-form-item label="报告模板：" prop="reviewType">
            <el-radio-group v-model="reportForm.reviewType" :disabled="dialogType!='add'" @input="changeReviewType">
              <el-radio :label="1">阶段运营报告</el-radio>
              <el-radio :label="2">年度数字回顾</el-radio>
              <el-radio :label="3">客户服务年度回顾</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="报告时间范围：" v-if="reportForm.reviewType==1" prop="dateRange">
            <el-date-picker
              key="month_range"
              :disabled="dialogType=='view'"
              v-model="reportForm.dateRange"
              style="width: 60%;"
              size="small"
              type="monthrange"
              value-format="yyyy-MM"
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份">
            </el-date-picker>
           
          </el-form-item>
          <el-form-item label="报告时间范围：" v-if="reportForm.reviewType!=1" prop="reviewYear">
            
            <el-date-picker
              size="small"
              key="year"
              v-model="reportForm.reviewYear"
              type="year"
              value-format="yyyy"
              placeholder="选择年">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="副标题：" v-if="reportForm.reviewType == 1">
            <el-input size="small" clearable v-model="reportForm.title" placeholder="请输入副标题" maxlength="10" show-word-limit :disabled="dialogType == 'view'" style="width: 60%;"></el-input>
          </el-form-item>
          <el-form-item label="权限开放：" prop="target">
            <el-checkbox-group v-model="reportForm.target">
              <el-checkbox :label="2" :disabled="dialogType == 'view'">工业客户</el-checkbox>
              <el-checkbox v-if="reportForm.reviewType == 3" :label="1" :disabled="dialogType == 'view'">经销商</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-radio-group v-model="reportForm.status" :disabled="dialogType == 'view'">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancelDialog('reportRef')">{{ dialogType == "view" ? "关 闭" : "取 消" }}</el-button>
          <el-button size="small" type="danger" @click="submitDialog('reportRef')" v-if="dialogType != 'view'">提 交</el-button>
        </span>
      </el-dialog>
    </div>
    <el-pagination
      style="display:flex;height:60px;align-items:center;background:#fff;z-index:999;bottom:0"
      :current-page="pageInfo.current"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageInfo.size"
      :total="tableTotal"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 220}px`,
      tableData: [],
      dialogType: "",
      reportDialogVisible: false,
      reportForm: {
        reviewType: 1,
        dateRange: [],
        reviewYear: "",
        title: "",
        target: [2],
        status: 0
      },
      reportRules: {
        reviewType: [{ required: true, message: "请选择报告模板", trigger: "change" }],
        dateRange: [{ required: true, message: "请选择报告时间范围", trigger: "change" }],
        reviewYear: [{ required: true, message: "请选择报告时间范围", trigger: "change" }],
        target: [{ required: true, message: "请选择权限开放", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      },
      detail: {},
      tableTotal: 0,
      pageInfo: {
        current: 1,
        size: 10
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表数据
    getList() {
      const params = {
        ...this.pageInfo
      };
      this.requestMethodGet("/reviewReport/queryReviewReportList", params).then(res => {
        if (res.data.code == 1000) {
          this.tableData = res.data.data.list;
          this.tableTotal = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    handleSizeChange(val) {
      this.pageInfo.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageInfo.current = val;
      this.getList();
    },
    // 新建，编辑，查看
    reportDialog(type, row) {
      this.dialogType = type;
      if (type != "add") {
        this.getDetail(row.id);
      } else {
        this.reportForm.reviewType = 1
          this.reportForm.dateRange = []
          this.reportForm.title = ''
          this.reportForm.target = [2]
          this.reportForm.status = 0
          this.reportForm.reviewYear = ''
          console.log(this.reportForm)
          
        this.reportDialogVisible = true;
      }
    },
    getDetail(id) {
      this.requestMethodGet("/reviewReport/queryReviewReportDetail", { id: id }).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          this.reportForm.reviewType = data.reviewType;
          this.reportForm.dateRange = [data.reviewTimeStart, data.reviewTimeEnd];
          this.reportForm.reviewYear =data.reviewYear ? data.reviewYear.toString() : ''
          this.reportForm.title = data.reviewType == 1 ? data.title : "";
          this.reportForm.target = typeof(data.target) == 'string' && data.target.includes(',') ? data.target.split(',').map(Number) : [Number(data.target)];
          this.reportForm.status = data.status;
          this.detail = data;
          this.reportDialogVisible = true;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 改变状态
    changeStatus(row) {
      const params = {
        id: row.id,
        reviewType: row.reviewType,
        status: row.status ? 0 : 1
      };
      this.requestMethodPost("/reviewReport/onlineReviewReport", params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: `${row.status ? "下线" : "上线"}成功`
          });
          this.getList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    cancelDialog(formName) {
      this.$refs[formName].resetFields();
      this.reportForm.reviewType = 1;
      this.reportForm.dateRange = [];
      this.reportForm.title = "";
      this.reportForm.target = [2];
      this.reportForm.status = 0;
      this.reportForm.reviewYear = "";
      this.reportDialogVisible = false;
    },
    submitDialog(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = this.dialogType == "add" ? "/reviewReport/insertReviewReport" : "/reviewReport/updateReviewReport";
          const params = {
            reviewType: this.reportForm.reviewType,
            reviewTimeStart: this.reportForm.dateRange[0],
            reviewTimeEnd: this.reportForm.dateRange[1],
            title: this.reportForm.reviewType == 1 ? this.reportForm.title : "",
            target: this.reportForm.target.join(','),
            status: this.reportForm.status,
            reviewYear: this.reportForm.reviewYear
          };
          if (this.dialogType == "edit") {
            params.id = this.detail.id;
          }
          this.requestMethodPost(url, params).then(res => {
            if (res.data.code == 1000) {
              this.cancelDialog(formName);
              this.getList();
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    changeReviewType(){
      if(this.dialogType != 'add'){
        return false; 
      }
      if(this.reportForm.reviewType == 3){
        this.reportForm.target = [2,1]
      }else{
        this.reportForm.target = [2]
      }
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 220}px`;
    }
  }
};
</script>
<style lang="less" scoped>
.review-report-content {
  padding: 20px;
  height: 100%;
  position: relative;
  overflow: auto;
}
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #001450 !important;
    border-color: #001450 !important;
}

/deep/ .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #001450 !important;
}
</style>
