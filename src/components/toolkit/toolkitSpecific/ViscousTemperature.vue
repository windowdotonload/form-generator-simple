<!-- <template>
  <div class="toolkit-container">
    <el-form :model="formData" label-position="top" :rules="rules">
      <div class="form-item-container">
        <header class="part-name">黏温信息</header>
        <div class="form-part">
          <el-row :gutter="6">
            <el-col :span="12">
              <el-form-item label="温度1" prop="Temp_1">
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model="formData.Temp_1" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small">℃</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="温度2" prop="Temp_2">
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model="formData.Temp_2" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small">℃</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="6">
            <el-col :span="12">
              <el-form-item label="黏度1" prop="KV_1">
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model="formData.KV_1" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small">cSt</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="黏度2" prop="KV_2">
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model="formData.KV_2" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small">cSt</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="form-item-container">
        <header class="part-name" style="display:flex;align-items:center">
          根据温度计算<span style="color:#d10000;margin-left:20px;font-size:13px">注意：计算结果仅在油品倾点20℃以上有参考意义</span>
        </header>
        <div class="form-part">
          <el-row :gutter="6">
            <el-col :span="12">
              <el-form-item label="温度A" prop="Temp">
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model="formData.Temp" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small">℃</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="form-item-container" style="padding-bottom: 10px">
        <header class="part-name">计算结果</header>
        <div class="form-part">
          <div class="res-showbar">
            <span style="left-key">黏度A</span>
            <span style="right-res" :style="lackParamsStyle(KV_RES)">{{ KV_RES | lackParams }}<span v-show="KV_RES && !isNaN(KV_RES)" style="margin-left: 8px">cSt</span></span>
          </div>
        </div>
      </div>
      <div class="form-item-container">
        <header class="part-name">根据黏度计算</header>
        <div class="form-part">
          <el-row :gutter="6">
            <el-col :span="12">
              <el-form-item label="黏度B" prop="KV">
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model="formData.KV" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small">cSt</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="form-item-container" style="padding-bottom: 10px">
        <header class="part-name">计算结果</header>
        <div class="form-part">
          <div class="res-showbar">
            <span style="left-key">温度B</span>
            <span style="right-res" :style="lackParamsStyle(Temp_RES)">{{ Temp_RES | lackParams }} <span v-show="Temp_RES && !isNaN(Temp_RES)" style="margin-left: 8px">℃</span> </span>
          </div>
        </div>
      </div>
    </el-form>
    <BackFooter />
  </div>
</template>

<script>
import BackFooter from "../components/toolkitBack.vue";
import { validateTemperature, validateviscosity } from "../components/ViscousTemperature/rules";
import mixin from "../components/mixin";
export default {
  inject: ["getBaseLog", "toNumber"],
  mixins: [mixin],
  components: {
    BackFooter
  },
  data() {
    return {
      formData: {
        Temp_1: 40,
        Temp_2: 100,
        KV_1: 0,
        KV_2: 0,
        Temp: "",
        KV: "",
        KV_RES: "",
        Temp_RES: ""
      },
      rules: {
        Temp_1: [{ trigger: "change", validator: validateTemperature(this, "Temp_1") }],
        Temp_2: [{ trigger: "change", validator: validateTemperature(this, "Temp_2") }],
        KV_1: [{ trigger: "change", validator: validateviscosity(this, "KV_1") }],
        KV_2: [{ trigger: "change", validator: validateviscosity(this, "KV_2") }],
        Temp: [{ trigger: "change", validator: validateTemperature(this, "Temp") }],
        KV: [{ trigger: "change", validator: validateviscosity(this, "KV") }]
      }
    };
  },
  methods: {
    validataCb(key, val) {
      this.formData[key] = val;
    },
    calcKV(Z1, Z2, B, A) {
      const Temp = this.toNumber(Object.assign({}, this.formData)).Temp;
      const Z_KNOW = Math.pow(10, Math.pow(10, A - B * this.getBaseLog(10, Temp + 273.15)));
      const val = Z_KNOW - 0.7 - Math.exp(-0.7487 - 3.295 * (Z_KNOW - 0.7) + 0.6119 * (Math.pow(Z_KNOW - 0.7, 2) - 0.3193 * Math.pow(Z_KNOW - 0.7, 3)));
      this.KV_RES = val.toFixed(1) || val;
    },
    calcTemp(Z1, Z2, B, A) {
      const KV = this.toNumber(Object.assign({}, this.formData)).KV;
      const Z_Input = KV + 0.7 + Math.exp(-1.47 - 1.84 * KV - 0.51 * Math.pow(KV, 2));
      const val = Math.pow(10, (A - this.getBaseLog(10, this.getBaseLog(10, Z_Input))) / B) - 273.15;
      this.Temp_RES = val.toFixed(1) || val;
    },
    calcMethod(val) {
      const copyObj = this.toNumber(Object.assign({}, this.formData));
      const { Temp_1, Temp_2, KV_1, KV_2, Temp, KV } = copyObj;
      const Z1 = KV_1 + 0.7 + Math.exp(-1.47 - 1.84 * KV_1 - 0.51 * Math.pow(KV_1, 2));
      const Z2 = KV_2 + 0.7 + Math.exp(-1.47 - 1.84 * KV_2 - 0.51 * Math.pow(KV_2, 2));
      const B = (this.getBaseLog(10, this.getBaseLog(10, Z1)) - this.getBaseLog(10, this.getBaseLog(10, Z2))) / (this.getBaseLog(10, Temp_2 + 273.15) - this.getBaseLog(10, Temp_1 + 273.15));
      const A = this.getBaseLog(10, this.getBaseLog(10, Z2)) + B * this.getBaseLog(10, Temp_2 + 273.15);

      this.calcKV(Z1, Z2, B, A);
      this.calcTemp(Z1, Z2, B, A);
    }
  },
  watch: {
    formData: {
      handler(val) {
        this.calcMethod(val);
      },
      deep: true
    }
  }
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
.res-showbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  span {
    font-size: 13px;
    color: #999;
  }
}
</style> -->

<template>
  <div v-loading="loading" style="margin:0;padding:0;width:100%;height:100%">
    <iframe ref="iframe" :src="`${location.origin}/tool/#/toolkit/ViscousTemperature`" frameborder="0" style="width:100%;height:100%"></iframe>
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
