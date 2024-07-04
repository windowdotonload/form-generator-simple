<template>
  <div>
    <div class="tab-content">
      <div class="top-part">
        <header class="part-name">计算信息</header>
        <div class="form-part">
          <el-form :model="compoutedFormPostive" :rules="rules" label-position="top">
            <el-row :gutter="6">
              <el-col :span="12">
                <el-form-item label="油品A的黏度" prop="viscosityA">
                  <div style="display: flex; align-items: center; width: 90%">
                    <el-input v-model="compoutedFormPostive.viscosityA" size="small" placeholder="推荐输入40°C时油品黏度" />
                    <span class="input-left-box" plain size="small">cSt</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="油品B的黏度" prop="viscosityB">
                  <div style="display: flex; align-items: center; width: 90%">
                    <el-input v-model="compoutedFormPostive.viscosityB" size="small" placeholder="推荐输入40°C时油品黏度" />
                    <span class="input-left-box" plain size="small">cSt</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="6">
              <el-col :span="12">
                <el-form-item label="混合比例">
                  <div>
                    <el-radio v-model="compoutedFormPostive.mixingRatio" :label="1">按比例输入</el-radio>
                    <el-radio v-model="compoutedFormPostive.mixingRatio" :label="2">按体积输入</el-radio>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="6" v-if="compoutedFormPostive.mixingRatio == 1">
              <el-col :span="12">
                <el-form-item label="油品A的比例" prop="ARatio">
                  <div style="display: flex; align-items: center; width: 90%">
                    <el-input v-model="compoutedFormPostive.ARatio" size="small" placeholder="请输入油品A的比例" />
                    <span class="input-left-box" plain size="small">%</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="6" v-if="compoutedFormPostive.mixingRatio == 2">
              <el-col :span="12">
                <el-form-item label="油品A的体积" prop="volumeA">
                  <div style="display: flex; align-items: center; width: 90%">
                    <el-input v-model="compoutedFormPostive.volumeA" size="small" placeholder="请输入油品A的体积" />
                    <span class="input-left-box" plain size="small">L</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="油品B的体积" prop="volumeB">
                  <div style="display: flex; align-items: center; width: 90%">
                    <el-input v-model="compoutedFormPostive.volumeB" size="small" placeholder="请输入油品B的体积" />
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
            <span class="left-key">混合油品黏度</span>
            <span :class="Viscosity_Mix_Res ? 'right-val' : 'right-val-lack'"
              >{{ Viscosity_Mix_Res || "缺少必要信息" }}<span style="margin-left: 5px" v-show="showUnit(Viscosity_Mix_Res)">cSt</span></span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validateviscosity, validateRatio, validateVolume } from "./rules";
import mixin from "../mixin";
export default {
  inject: ["getBaseLog", "toNumber"],
  mixins: [mixin],
  data() {
    return {
      compoutedFormPostive: {
        viscosityA: "",
        viscosityB: "",
        mixingRatio: 1,
        ARatio: "",
        volumeA: "",
        volumeB: "",
      },
      rules: {
        viscosityA: [{ validator: validateviscosity(this, "viscosityA"), trigger: "change" }],
        viscosityB: [{ validator: validateviscosity(this, "viscosityB"), trigger: "change" }],
        ARatio: [{ validator: validateRatio(this, "ARatio"), trigger: "change" }],
        volumeA: [{ validator: validateVolume(this, "volumeA"), trigger: "change" }],
        volumeB: [{ validator: validateVolume(this, "volumeB"), trigger: "change" }],
      },
      Viscosity_Mix_Res: "",
    };
  },
  methods: {
    validataCb(key, val) {
      this.compoutedFormPostive[key] = val;
    },
    calcMethod(type) {
      // type - 1:按比例 2:按体积
      switch (type) {
        case 1:
          this.calcRatio();
          break;
        case 2:
          this.calcVolume();
          break;
      }
    },
    calcRatio() {
      const { viscosityA, viscosityB, ARatio } = this.toNumber(Object.assign({}, this.compoutedFormPostive));
      if (!viscosityA || !viscosityB || !ARatio) return;
      const WA = this.getBaseLog(10, this.getBaseLog(10, viscosityA + 0.7));
      const WB = this.getBaseLog(10, this.getBaseLog(10, viscosityB + 0.7));
      const P_A = ARatio / 100;
      const WBlend = P_A * WA + (1 - P_A) * WB;
      const Viscosity_Mix = Math.pow(10, Math.pow(10, WBlend)) - 0.7;
      this.Viscosity_Mix_Res = Viscosity_Mix.toFixed(1);
    },
    calcVolume() {
      const { viscosityA, viscosityB, volumeA, volumeB } = this.toNumber(Object.assign({}, this.compoutedFormPostive));
      if (!viscosityA || !viscosityB || !volumeA || !volumeB) return;
      const WA = this.getBaseLog(10, this.getBaseLog(10, viscosityA + 0.7));
      const WB = this.getBaseLog(10, this.getBaseLog(10, viscosityB + 0.7));
      const P_A = volumeA / (volumeA + volumeB);
      const WBlend = P_A * WA + (1 - P_A) * WB;
      const Viscosity_Mix = Math.pow(10, Math.pow(10, WBlend)) - 0.7;
      this.Viscosity_Mix_Res = Viscosity_Mix.toFixed(1);
    },
    tipLackField(fields) {},
  },
  watch: {
    compoutedFormPostive: {
      handler(val, oldVal) {
        this.Viscosity_Mix_Res = "";
        this.calcMethod(val.mixingRatio);
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
