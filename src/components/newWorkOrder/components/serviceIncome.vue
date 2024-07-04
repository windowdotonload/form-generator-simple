<template>
  <div>
    <el-row :gutter="24" style="margin-top: 10px">
      <el-col :span="24">
        <el-form-item>
          <span slot="label"><span style="color: #f56c6c; margin-right: 4px">*</span>服务创盈属性</span>
          <!-- 原来的多选改成单选 -->
          <el-radio-group v-model="applylist.serviceProperty" @change="servicePropertyChange">
            <el-radio :label="1">维护现有生意</el-radio>
            <el-radio :label="2">油品升级</el-radio>
            <el-radio :label="3">竞品转换</el-radio>
            <el-radio :label="4">服务收费</el-radio>
            <span style="margin-right: 10px">丨</span>
            <el-radio :label="5"
              >支持新项目生意<el-tooltip class="item" effect="dark" content="新项目包括新建的工厂、旧厂新增设备" placement="top">
                <i class="el-icon-warning-outline"></i> </el-tooltip
            ></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-if="applylist.serviceProperty">
        <el-form-item>
          <span slot="label"><span style="color: #f56c6c; margin-right: 4px">*</span>预估收益</span>
          <el-col :span="12" class="select-input" v-if="showIncomeBbl">
            <div style="display: flex; align-items: center">
              <el-input
                placeholder="请输入收益数值"
                clearable
                maxlength="16"
                v-model="applylist.incomeBbl"
                size="small"
                @keyup.native="validateIncome('incomeBbl')"
                @blur="validateIncome('incomeBbl')"
              ></el-input>
              <el-input size="small" v-model="incomeBblUnit" disabled class="input-unit"></el-input>
            </div>
          </el-col>
          <el-col :span="12" class="select-input" v-if="showIncomeRmb">
            <div style="display: flex; align-items: center">
              <el-input
                placeholder="请输入收益数值"
                maxlength="16"
                clearable
                v-model="applylist.incomeRmb"
                size="small"
                @keyup.native="validateIncome('incomeRmb')"
                @blur="validateIncome('incomeRmb')"
              ></el-input>
              <el-input size="small" v-model="incomeRmbUnit" disabled class="input-unit"></el-input>
            </div>
          </el-col>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    applylist: {
      type: Object,
      default: {},
    }
  },
  data() {
    return {
      incomeBblUnit: "BBL",
      incomeRmbUnit: "RMB",
      showIncomeBbl: false,
      showIncomeRmb: false,
    };
  },
  watch: {
    applylist: {
      handler: function (val, oldVal) {
        let serviceProperty = val.serviceProperty;
        if (serviceProperty) {
          serviceProperty = serviceProperty * 1;
        }
        this.servicePropertyChange(serviceProperty);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    servicePropertyChange(value) {
      this.applylist.serviceProperty = value || "";
      if (value) {
        if (value == 4) {
          // Rmb
          this.showIncomeBbl = false;
          this.showIncomeRmb = true;
          this.applylist.incomeBbl = "";
        } else {
          // bbl
          this.showIncomeBbl = true;
          this.showIncomeRmb = false;
          this.applylist.incomeRmb = "";
        }
      } else {
        this.showIncomeBbl = false;
        this.showIncomeRmb = false;
        this.applylist.incomeBbl = "";
        this.applylist.incomeRmb = "";
      }
    },
    validateIncome(type) {
      if (type == "incomeBbl") {
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); // 只允许输入一个小数点
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      } else {
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); // 只允许输入一个小数点
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
    },
  },
};
</script>
<style scoped lang="less">
.input-unit {
  width: 80px;
}
/deep/ .input-unit .el-input__inner {
  border-left: none;
}
/deep/ .el-checkbox-group {
  font-size: 14px;
}
.service-income-content {
  border: 1px solid #e9e9e9;
  margin-top: 20px;
  border-radius: 4px;
  padding-bottom: 40px;
}
.service-income {
  width: 100%;
  background: #f9f9f9;
  font-family: MicrosoftYaHei-Bold;
  font-size: 14px;
  padding: 17px 0px;
  height: 14px;
  line-height: 14px;
  border-bottom: 1px solid #e9e9e9;
}
</style
>>
