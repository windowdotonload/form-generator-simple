<template>
  <div class="result-container">
    <!-- SAVE -->
    <div class="result-item">
      <div class="result-catalogue">
        <div class="tco-classify-bar"><img src="@/assets/save.png" alt="" /><span class="classify-title">安全</span></div>
        <el-link type="info" href="#Save">返回填写</el-link>
      </div>
      <el-divider />
      <div class="result-calcresult">减少设备维护人员与设备的接触时间（小时）：{{ showCalcRes(state.A_Gather_Res) }}</div>
    </div>

    <!-- ENV -->
    <div class="result-item">
      <div class="result-catalogue">
        <div class="tco-classify-bar"><img src="@/assets/env.png" alt="" /><span class="classify-title">环保</span></div>
        <el-link type="info" href="#Env">返回填写</el-link>
      </div>
      <el-divider />
      <div class="result-calcresult" style="width:100%;margin-bottom:10px">
        减少废油的产生和处置（{{ envResUnit }}）<ExchangeUnit :changeSelOptions="changeSelOptions" :changeCb="changeCb" /> ： {{ showCalcRes(state.B_Gather_Res_1) }}
      </div>
      <div class="result-calcresult">减少CO₂ 排放（吨）：{{ showCalcRes(state.B_Gather_Res_2) }} 吨</div>
    </div>

    <!-- EFFICIENT -->
    <div class="result-item">
      <div class="result-catalogue">
        <div class="tco-classify-bar"><img src="@/assets/efficient.png" alt="" /><span class="classify-title">高效</span></div>
        <el-link type="info" href="#Efficient">返回填写</el-link>
      </div>
      <el-divider />
      <div class="result-calcresult">降低设备维护成本和非计划停机损失，增加效益（元）：{{ showCalcRes(state.C_Gather_Res) }}</div>
    </div>
  </div>
</template>

<script>
import ExchangeUnit from "./exchangeUnit.vue";
export default {
  inject: ["state", "mutation"],
  components: {
    ExchangeUnit
  },
  data() {
    return {
      envResUnit: "L",
      changeSelOptions: [{ label: "L", value: 1 }, { label: "kg", value: 2 }]
    };
  },
  mounted() {
    this.setEnvResUnit();
  },
  methods: {
    setEnvResUnit() {
      this.envResUnit = this.mutation.getNodeItemFieldsValueSingle("tco_hb", "hb_cal_fycz", "unit") || "L";
      this.state.BResUnit = this.envResUnit;
    },
    showCalcRes(val = 0) {
      if (isNaN(val)) return val;
      return parseInt(Number(val).toFixed(3)).toString().length < 10 ? Number(val).toFixed(2) : val.toExponential(3);
    },
    changeCb(val) {
      if (val.label != this.envResUnit) {
        this.envResUnit = val.label;
        this.state.BResUnit = this.envResUnit;

        let curVal = this.state.B_Gather_Res_1;
        if (val.value == 1) {
          curVal = curVal / 0.87;
        } else if (val.value == 2) {
          curVal = curVal * 0.87;
        }
        this.state.B_Gather_Res_1 = curVal;

        this.mutation.assignNodeItemFieldsValueSingle("tco_hb", "hb_cal_fycz", { unit: val.label, value: this.showCalcRes(curVal) });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.result-item {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
  background: rgba(221, 0, 0, 0.05);
  border-radius: 6px;
  margin-bottom: 10px;
  /deep/ .el-divider--horizontal {
    margin: 10px 0;
    margin-bottom: 15px;
  }
}
.result-catalogue {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.tco-classify-bar {
  height: 40px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-radius: 5px;
}
.classify-title {
  display: inline-block;
  font-weight: bolder;
  margin-left: 10px;
}
.result-calcresult {
  font-size: 13px;
  line-height: 13px;
  color: #999999;
}
</style>
