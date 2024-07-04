<template>
  <div>
    <div class="tab-content">
      <div class="top-part">
        <header class="part-name">计算信息</header>
        <div class="form-part">
          <el-form :model="compoutedFormPostive" :rules="rules" label-position="top">
            <el-row :gutter="6">
              <el-col :span="12">
                <el-form-item label="混合油品的目标黏度" prop="viscosityTarget">
                  <div style="display: flex; align-items: center; width: 90%">
                    <el-input v-model="compoutedFormPostive.viscosityTarget" size="small" placeholder="推荐输入40°C时油品黏度" />
                    <span class="input-left-box" plain size="small">cSt</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="油品A的黏度" prop="viscosityA">
                  <div style="display: flex; align-items: center; width: 90%">
                    <el-input v-model="compoutedFormPostive.viscosityA" size="small" placeholder="推荐输入40°C时油品黏度" />
                    <span class="input-left-box" plain size="small">cSt</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="6">
              <el-col :span="12">
                <el-form-item label="油品B的黏度" prop="viscosityB">
                  <div style="display: flex; align-items: center; width: 90%">
                    <el-input v-model="compoutedFormPostive.viscosityB" size="small" placeholder="请输入油品A的体积" />
                    <span class="input-left-box" plain size="small">cSt</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="混合油品的体积" prop="volumeMix">
                  <div style="display: flex; align-items: center; width: 90%">
                    <el-input v-model="compoutedFormPostive.volumeMix" size="small" placeholder="请输入油品B的体积" maxlength="7" />
                    <span class="input-left-box" plain size="small">L</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>

    <div class="tab-content" style="margin-top: 10px">
      <div class="top-part">
        <header class="part-name">计算结果</header>
        <div class="result-content">
          <div class="result-row">
            <span class="left-key">A油品体积百分比</span>
            <span :style="lackParamsStyle(VolumeA_P)">{{ VolumeA_P | lackParams }}<span style="margin-left: 5px" v-show="showUnit(VolumeA_Res)">%</span></span>
          </div>
          <div class="result-row">
            <span class="left-key">A油品体积</span>
            <span :style="lackParamsStyle(VolumeA_Res)">{{ VolumeA_Res | lackParams }}<span style="margin-left: 5px" v-show="showUnit(VolumeA_Res)">L</span></span>
          </div>
          <div class="result-row">
            <span class="left-key">B油品体积百分比</span>
            <span :style="lackParamsStyle(VolumeB_P)">{{ VolumeB_P | lackParams }}<span style="margin-left: 5px" v-show="showUnit(VolumeB_Res)">%</span></span>
          </div>
          <div class="result-row">
            <span class="left-key">B油品体积</span>
            <span :style="lackParamsStyle(VolumeB_Res)">{{ VolumeB_Res | lackParams }}<span style="margin-left: 5px" v-show="showUnit(VolumeB_Res)">L</span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validateviscosity, validateVolume } from "./rules";
import mixin from "../mixin";
export default {
  inject: ["getBaseLog", "toNumber"],
  mixins: [mixin],
  data() {
    return {
      compoutedFormPostive: {
        viscosityTarget: "",
        viscosityA: "",
        viscosityB: "",
        volumeMix: "",
      },
      rules: {
        viscosityTarget: [{ validator: validateviscosity(this, "viscosityTarget"), trigger: "change" }],
        viscosityA: [{ validator: validateviscosity(this, "viscosityA"), trigger: "change" }],
        viscosityB: [{ validator: validateviscosity(this, "viscosityB"), trigger: "change" }],
        volumeMix: [{ validator: validateVolume(this, "volumeMix"), trigger: "change" }],
      },
      VolumeA_Res: "",
      VolumeB_Res: "",
      VolumeA_P: "",
      VolumeB_P: "",
    };
  },
  methods: {
    validataCb(key, val) {
      this.compoutedFormPostive[key] = val;
    },
    calcMethod() {
      const { viscosityTarget, viscosityA, viscosityB, volumeMix } = this.toNumber(Object.assign({}, this.compoutedFormPostive));
      const P_A =
        (this.getBaseLog(10, this.getBaseLog(10, viscosityTarget + 0.7)) - this.getBaseLog(10, this.getBaseLog(10, viscosityB + 0.7))) /
        (this.getBaseLog(10, this.getBaseLog(10, viscosityA + 0.7)) - this.getBaseLog(10, this.getBaseLog(10, viscosityB + 0.7)));
      const P_B = 1 - P_A;
      this.VolumeA_P = (P_A * 100).toFixed(2);
      this.VolumeB_P = (P_B * 100).toFixed(2);
      this.VolumeA_Res = (volumeMix * P_A).toFixed(1);
      this.VolumeB_Res = (volumeMix * P_B).toFixed(1);
    },
  },
  watch: {
    compoutedFormPostive: {
      handler(val, oldVal) {
        this.calcMethod();
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
</style>
