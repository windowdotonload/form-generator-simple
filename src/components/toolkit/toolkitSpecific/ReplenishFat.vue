<!-- <template>
  <div class="toolkit-container">
    <div class="form-item-container">
      <header class="part-name">轴承数据</header>
      <div class="form-part">
        <el-form :model="formData" :rules="rules" label-position="top">
          <el-row :gutter="6">
            <el-col :span="12">
              <el-form-item label="轴承类型">
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input maxlength="50" v-model="other_type" size="small" placeholder="请输入" />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="轴承型号">
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input maxlength="50" v-model="other_model" size="small" placeholder="请输入" />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="6">
            <el-col :span="12">
              <el-form-item label="轴承内径" prop="Diameter_In">
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model="formData.Diameter_In" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small">mm</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="轴承外径" prop="Diameter_Out">
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model="formData.Diameter_Out" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small">mm</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="6">
            <el-col :span="12">
              <el-form-item label="轴承宽度" prop="W">
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model="formData.W" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small">mm</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="转速" prop="V">
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model="formData.V" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small">转/分钟</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="6">
            <el-col :span="12">
              <el-form-item label="轴承工作温度" prop="T">
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model="formData.T" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small">°C</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="润滑脂枪容量" prop="Capacity">
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model.number="formData.Capacity" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small"><span class="longlong-text">克/滑脂枪行程</span></span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="6">
            <el-col :span="12">
              <el-form-item prop="K">
                <template #label>
                  <span>
                    常数K
                    <el-tooltip popper-class="tip-poper-class" class="item" effect="light" content="Top Center 提示文字" placement="top">
                      <template #content>
                        <div class="tip-box">
                          <div class="tip-header">填写提示</div>
                          <div class="tip-content" style="margin-bottom: 5px">K=1, 球面滚子轴承或圆锥滚子轴承 K= 5, 圆柱滚子轴承或滚针轴承 K=10, 球轴承</div>
                        </div>
                      </template>
                      <i class="el-icon-warning" style="color: #d10000" />
                    </el-tooltip>
                  </span>
                </template>
                <el-select v-model="formData.K" placeholder="请选择" size="small" style="width: 90%">
                  <el-option v-for="item in selectOptions1th" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="Coef_Install">
                <template #label>
                  <span>
                    轴承安装方式系数
                    <el-tooltip popper-class="tip-poper-class" class="item" effect="light" content="Top Center 提示文字" placement="top">
                      <template #content>
                        <div class="tip-box">
                          <div class="tip-header">填写提示</div>
                          <div class="tip-content" style="margin-bottom: 5px">轴承用于立轴，系数取0.5；其它情况，系数取1</div>
                        </div>
                      </template>
                      <i class="el-icon-warning" style="color: #d10000" />
                    </el-tooltip>
                  </span>
                </template>
                <el-select v-model="formData.Coef_Install" placeholder="请选择" size="small" style="width: 90%">
                  <el-option v-for="item in selectOptions2nd" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="6">
            <el-col :span="12">
              <el-form-item prop="Coef_E">
                <template #label>
                  <span>
                    轴承工作环境系数
                    <el-tooltip popper-class="tip-poper-class" class="item" :hide-after="0" effect="light" content="Top Center 提示文字" placement="top">
                      <template #content>
                        <div class="tip-box">
                          <div class="tip-header">填写提示</div>
                          <div class="tip-content" style="margin-bottom: 5px">
                            轴承工作环境系数用于考虑从轴承工作环境对补脂周期的影响，取值范围为0-100%。轴承工作环境恶劣(如潮湿环境、灰尘环境等)时，补脂周期应酌情缩短，建议输入较小的轴承工作环境系数。
                          </div>
                        </div>
                      </template>
                      <i class="el-icon-warning" style="color: #d10000" />
                    </el-tooltip>
                  </span>
                </template>
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model.number="formData.Coef_E" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small">%</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <div class="form-item-container" style="padding-bottom: 16px">
      <header class="part-name">计算结果</header>
      <div class="form-part">
        <div class="result-row">
          <span class="left-key">加脂周期（小时）</span>
          <span :style="lackParamsStyle(calc_Res.Cycle_H)">{{ calc_Res.Cycle_H | lackParams }}<span v-show="showUnit(calc_Res.Cycle_H)">小时</span></span>
        </div>
        <div class="result-row">
          <span class="left-key">加脂周期（天）</span>
          <span :style="lackParamsStyle(calc_Res.Cycle_D)">{{ calc_Res.Cycle_D | lackParams }}<span v-show="showUnit(calc_Res.Cycle_D)">天</span></span>
        </div>
        <div class="result-row">
          <span class="left-key">加脂量</span>
          <span :style="lackParamsStyle(calc_Res.Amount)">{{ calc_Res.Amount | lackParams }}<span v-show="showUnit(calc_Res.Amount)">克</span></span>
        </div>
        <div class="result-row">
          <span class="left-key">滑脂枪行程</span>
          <span :style="lackParamsStyle(calc_Res.Distance)">{{ calc_Res.Distance | lackParams }}<span v-show="showUnit(calc_Res.Distance)">次</span></span>
        </div>
      </div>
    </div>
    <BackFooter />
  </div>
</template>

<script>
import BackFooter from "../components/toolkitBack.vue";
import { selectOptions1th, selectOptions2nd, validateNum } from "../components/ReplenishFat/index";
import mixin from "../components/mixin";
export default {
  inject: ["getBaseLog", "toNumber"],
  mixins: [mixin],
  components: {
    BackFooter,
  },
  data() {
    return {
      other_type: "",
      other_model: "",
      formData: {
        V: "",
        T: "",
        K: "",
        W: "",
        Coef_E: 75,
        Capacity: "",
        Coef_Install: "",
        Diameter_Out: "",
        Diameter_In: "",
      },

      selectOptions1th,
      selectOptions2nd,
      calc_Res: { Cycle_H: "", Cycle_D: "", Amount: "", Distance: "" },
      rules: {
        V: [{ trigger: "change", validator: validateNum(this, "V", 999999, 2) }],
        T: [{ trigger: "change", validator: validateNum(this, "T", 999999, 1, -999) }],
        K: "",
        W: [{ trigger: "change", validator: validateNum(this, "W", 9999) }],
        Coef_E: [{ trigger: "change", validator: validateNum(this, "Coef_E", 100) }],
        Capacity: [{ trigger: "change", validator: validateNum(this, "Capacity", 9999) }],
        Coef_Install: "",
        Diameter_Out: [{ trigger: "change", validator: validateNum(this, "Diameter_Out", 9999) }],
        Diameter_In: [{ trigger: "change", validator: validateNum(this, "Diameter_In", 9999) }],
      },
    };
  },
  methods: {
    validataCb(key, val) {
      this.formData[key] = val;
    },
    calcMethod(val) {
      const { V, T, K, W, Coef_E, Capacity, Coef_Install, Diameter_Out, Diameter_In } = this.toNumber(val);

      let Cycle_H, Cycle_D;
      if (T > 70) {
        Cycle_H = ((K * 14000000 - 4 * Diameter_In) / (V * Math.sqrt(Diameter_In))) * Math.pow(1 / 2, (T - 70) / 15) * Coef_Install * (Coef_E / 100);
        Cycle_D = Cycle_H / 24;
      } else {
        Cycle_H = ((K * 14000000 - 4 * Diameter_In) / (V * Math.sqrt(Diameter_In))) * Coef_Install * (Coef_E / 100);
        Cycle_D = Cycle_H / 24;
      }
      const Amount = 0.005 * Diameter_Out * W;
      const Distance = Amount / Capacity;
      this.calc_Res = { Cycle_H: Cycle_H.toFixed(1), Cycle_D: Cycle_D.toFixed(1), Amount: Amount.toFixed(1), Distance: Distance.toFixed(1) };
    },
  },
  watch: {
    formData: {
      handler(val) {
        this.calcMethod(Object.assign({}, val));
      },
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
.toolkit-container {
  padding: 20px;
  height: calc(100vh - 50px);
  overflow-y: auto;
  background: #f5f5f5;
}
.form-item-container {
  background: #fff;
  margin-bottom: 10px;
  .form-part {
    box-sizing: border-box;
    padding: 0 16px;
  }
}
.tab-bar {
  display: flex;
  align-items: center;

  .tab-item {
    padding: 0 30px;
    margin-right: 5px;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 33px;
    color: #000000;
    background: #ededed;
    min-width: 22%;
    border-radius: 4px 4px 0px 0px;
    cursor: pointer;
  }
}
.tab-content {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
}
.part-name {
  letter-spacing: 1px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: #000000;
  height: 50px;
  line-height: 48px;
  padding-left: 16px;
  font-weight: bold;
  border-bottom: 1px solid #eeeeee;
}
.form-part {
  margin-top: 16px;
  /deep/ .el-input__inner {
    border-radius: none;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-top-right-radius: none !important;
    border-bottom-right-radius: none !important;
  }
}
.input-left-box {
  box-sizing: border-box;
  display: inline-block;
  margin-left: -8px;
  text-align: center;
  height: 32px;
  width: 35%;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
.result-content {
  padding: 20px;
}
.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  margin-bottom: 28px;
}
.bottom-op-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-top: 10px;
}
.charts-container {
  box-sizing: border-box;
  padding: 20px;
  background: #fff;
}
.chart-show-box {
  position: relative;
  width: 100%;
  min-height: 390px;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  margin-bottom: 28px;
}
.left-key {
  color: #999999;
}
.right-val {
  color: #000;
}
.right-val-lack {
  color: #d10000;
}
.left-key-res {
  color: #999999;
  font-weight: 600;
  font-size: 16px;
}
.right-val-res {
  color: #000;
  font-weight: 600;
  font-size: 16px;
}
.tip-box {
  width: 200px;
  padding: 12px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px #888;
}
.tip-header {
  padding-bottom: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #999999;
  font-size: 15px;
  margin-bottom: 5px;
}
.tip-content {
  font-size: 12px;
  color: #999999;
  line-height: 1.5;
}
.longlong-text {
  font-size: 12px;
  transform: scale(0.8, 0.8);
  display: inline-block;
  white-space: nowrap;
}
</style>

<style>
.tip-poper-class {
  padding: 0;
  border: none !important;
  box-shadow: 0px 0px 10px #000 !important;
}
</style> -->

<template>
  <div v-loading="loading" style="margin:0;padding:0;width:100%;height:100%">
    <iframe ref="iframe" :src="`${location.origin}/tool/#/toolkit/ReplenishFat`" frameborder="0" style="width:100%;height:100%"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      location: window.location,
      loading: true
    };
  },
  mounted() {
    this.$refs.iframe.onload = () => {
      this.loading = false;
    };
  }
};
</script>

<style></style>
