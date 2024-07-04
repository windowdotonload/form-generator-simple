<!-- <template>
  <div class="toolkit-container">
    <el-form :model="formData" :rules="rules" label-position="top">
      <div class="form-item-container">
        <header class="part-name">基本信息</header>
        <div class="form-part">
          <el-row :gutter="6">
            <el-col :span="12">
              <el-form-item label="润滑剂名称" prop="Lub">
                <el-select v-model="formData.Lub" placeholder="请选择" size="small" style="width: 90%">
                  <el-option v-for="item in selectOptions1th" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工作类型" prop="Work">
                <el-select v-model="formData.Work" placeholder="请选择" size="small" style="width: 90%">
                  <el-option v-for="item in selectOptions2nd" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="6">
            <el-col :span="12">
              <el-form-item label="设备类型" prop="Device">
                <el-select v-model="formData.Device" placeholder="请选择" size="small" style="width: 90%">
                  <el-option v-for="item in selectOptions3th" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="驱动类型" prop="Drive">
                <el-select v-model="formData.Drive" placeholder="请选择" size="small" style="width: 90%">
                  <el-option v-for="item in selectOptions4th" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="form-item-container">
        <header class="part-name">大齿轮参数</header>
        <div class="form-part">
          <el-row :gutter="6">
            <el-col :span="12">
              <el-form-item label="齿宽" prop="W">
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model="formData.W" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small">m</span>
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
              <el-form-item label="直径" prop="D">
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model="formData.D" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small">m</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="form-item-container">
        <header class="part-name">喷射系统</header>
        <div class="form-part">
          <el-row :gutter="6">
            <el-col :span="12">
              <el-form-item prop="R">
                <template #label>
                  <span>
                    喷射期间大齿轮旋转转数（转）
                    <el-tooltip popper-class="tip-poper-class" class="item" effect="light" content="Top Center 提示文字" placement="top">
                      <template #content>
                        <div class="tip-box">
                          <div class="tip-header">填写提示</div>
                          <div class="tip-content">为了保证开式齿轮的润滑效果，同时又可为客户节省润滑成本，喷射期间大齿轮至少旋转 1 转，最好 2 转，确保大齿轮齿轮完全覆盖。</div>
                        </div>
                      </template>
                      <i class="el-icon-warning" style="color: #d10000" />
                    </el-tooltip>
                  </span>
                </template>

                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model.number="formData.R" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small">转</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="C">
                <template #label>
                  <span>
                    喷射周期（分钟）
                    <el-tooltip popper-class="tip-poper-class" class="item" effect="light" content="Top Center 提示文字" placement="top">
                      <template #content>
                        <div class="tip-box" style="width: 360px">
                          <div class="tip-header">填写提示</div>
                          <div class="tip-content" style="margin-bottom: 5px">设备设定的喷射周期（为两次开始喷射间的时间）应小于或等于美孚产品在设备中的最大喷射周期（最大喷射周期参数参见下表）。</div>
                          <img style="margin: 0 auto; width: 360px; cursor: pointer" src="@/assets/opengear-tip-table.png" alt="" @click="dialogVisible = true" />
                        </div>
                      </template>
                      <i class="el-icon-warning" style="color: #d10000" />
                    </el-tooltip>
                  </span>
                </template>
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model="formData.C" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small">分钟</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="form-item-container" style="padding-bottom: 16px">
        <header class="part-name">计算结果</header>
        <div class="form-part">
          <div class="result-row">
            <span class="left-key">喷射量</span>
            <span :style="lackParamsStyle(calc_Res.Amount)">{{ calc_Res.Amount | lackParams }}<span v-show="showUnit(calc_Res.Amount)">ml/分钟</span></span>
          </div>
          <div class="result-row">
            <span class="left-key">喷射时间</span>
            <span :style="lackParamsStyle(calc_Res.Time)">{{ calc_Res.Time | lackParams }}<span v-show="showUnit(calc_Res.Time)">秒</span></span>
          </div>
          <div class="result-row">
            <span class="left-key">喷射间隔</span>
            <span :style="lackParamsStyle(calc_Res.Delta)">{{ calc_Res.Delta | lackParams }}<span v-show="showUnit(calc_Res.Delta)">秒</span></span>
          </div>
          <div class="result-row">
            <span class="left-key">润滑剂日消耗量</span>
            <span :style="lackParamsStyle(calc_Res.Consumption)">{{ calc_Res.Consumption | lackParams }}<span v-show="showUnit(calc_Res.Consumption)">L/日</span></span>
          </div>
        </div>
      </div>
    </el-form>
    <BackFooter />

    <el-dialog :visible.sync="dialogVisible" append-to-body width="55%" :close-on-click-modal="false">
      <img style="margin: 0 autow; width: 100%" src="@/assets/opengear-tip-table.png" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import BackFooter from "../components/toolkitBack.vue";
import { selectOptions1th, selectOptions2nd, selectOptions3th, selectOptions4th, validateW } from "../components/openGear/index";
import { get_LubType, get_CoefWork, get_CoefDevice, get_CoefDrive, get_CoefLub } from "../components/openGear/index";
import mixin from "../components/mixin";
export default {
  inject: ["getBaseLog", "toNumber"],
  mixins: [mixin],
  components: {
    BackFooter,
  },
  data() {
    return {
      dialogVisible: false,
      formData: {
        Lub: "",
        W: "",
        D: "",
        Work: "",
        Device: "",
        Drive: "",
        V: "",
        R: "",
        C: "",
      },
      selectOptions1th,
      selectOptions2nd,
      selectOptions3th,
      selectOptions4th,
      calc_Res: {
        Amount: "",
        Time: "",
        Delta: "",
        Consumption: "",
      },
      rules: {
        Lub: "",
        Work: "",
        Device: "",
        Drive: "",
        W: [{ trigger: "change", validator: validateW(this, "W") }],
        D: [{ trigger: "change", validator: validateW(this, "D", 100) }],
        V: [{ trigger: "change", validator: validateW(this, "V", 100) }],
        R: [{ trigger: "change", validator: validateW(this, "R", 10) }],
        C: [{ trigger: "change", validator: validateW(this, "C", 50, 2) }],
      },
    };
  },
  methods: {
    validataCb(key, val) {
      this.formData[key] = val;
    },

    calcMethod(val) {
      let { Lub, W, D, Work, Device, Drive, V, R, C } = this.toNumber(val);

      W = W < 0.2 ? 0.2 : W;
      const Lub_Type = get_LubType(Lub);
      const Coef_Work = get_CoefWork(Work);
      const Coef_Device = get_CoefDevice(Device);
      const Coef_Drive = get_CoefDrive(Drive, Lub_Type);
      const Coef_Lub = get_CoefLub(W, D, Lub_Type);
      const Coef_V = (C * V) / R;

      const Amount = Coef_Lub * Coef_V * Coef_Work * Coef_Device * Coef_Drive;
      const Time = (R / V) * 60;
      const Delta = C * 60 - Time;
      const Consumption = ((((Time / 60) * Amount) / 1000) * 24 * 60) / C;
      this.calc_Res = { Amount: Amount.toFixed(2), Time: Time.toFixed(1), Delta: Delta.toFixed(1), Consumption: Consumption.toFixed(4) };
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
    <iframe ref="iframe" :src="`${location.origin}/tool/#/toolkit/openGear`" frameborder="0" style="width:100%;height:100%"></iframe>
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
