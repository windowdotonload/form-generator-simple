<!-- <template>
  <div class="toolkit-container">
    <el-form :model="formData" label-position="top" :rules="rules">
      <div class="form-item-container">
        <header class="part-name">计算信息</header>
        <div class="form-part">
          <el-row :gutter="6">
            <el-col :span="12">
              <el-form-item prop="KV_100">
                <template #label>
                  <span>
                    黏度（100°C）
                    <el-tooltip popper-class="tip-poper-class" class="item" effect="light" content="Top Center 提示文字" placement="top">
                      <template #content>
                        <div class="tip-box">
                          <div class="tip-header">填写提示</div>
                          <div class="tip-content" style="margin-bottom: 5px">100摄氏度黏度不能小于2cst; 黏度大于6800 cst时，请参考PDS</div>
                        </div>
                      </template>
                      <i class="el-icon-warning" style="color: #d10000" />
                    </el-tooltip>
                  </span>
                </template>
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model="formData.KV_100" size="small" placeholder="请输入" />
                  <span class="input-left-box" plain size="small">cSt</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="黏度（40°C）" prop="KV_40">
                <div style="display: flex; align-items: center; width: 90%">
                  <el-input v-model="formData.KV_40" size="small" placeholder="请输入" />
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
            <span style="left-key">黏度指数</span>
            <span style="right-res" :style="lackParamsStyle(calc_RES)">
              {{ calc_RES | lackParams }}
            </span>
          </div>
        </div>
      </div>
    </el-form>
    <BackFooter />
  </div>
</template>

<script>
import { validateviscosity } from "../components/ViscosityIndex/rules";
import { searchTable } from "../components/ViscosityIndex/data";
import BackFooter from "../components/toolkitBack.vue";
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
        KV_40: "",
        KV_100: "",
        calc_RES: ""
      },
      rules: {
        KV_40: [{ trigger: "change", validator: validateviscosity(this, "KV_40") }],
        KV_100: [{ trigger: "change", validator: validateviscosity(this, "KV_100") }]
      }
    };
  },
  methods: {
    validataCb(key, val) {
      this.formData[key] = val;
    },
    getSectionData(searchKey) {
      let res = {};
      Object.keys(searchTable).some(key => {
        const section = key.split("-").map(item => Number(item));
        if (searchKey > section[0] && searchKey <= section[1]) {
          res = searchTable[key];
          return true;
        }
      });
      return res;
    },
    calcMethod(val) {
      const { KV_40, KV_100 } = this.toNumber(Object.assign({}, val));
      const preData = this.getSectionData(KV_100);
      const { a, b, c, d, e, f } = this.toNumber(preData);
      const L = a * Math.pow(KV_100, 2) + b * KV_100 + c;
      const H = d * Math.pow(KV_100, 2) + e * KV_100 + f;
      if (KV_40 > H) {
        const VI = ((L - KV_40) / (L - H)) * 100;
        this.calc_RES = Math.round(VI);
        return;
      }
      const VI = (Math.pow(10, (this.getBaseLog(10, H) - this.getBaseLog(10, KV_40)) / this.getBaseLog(10, KV_100)) - 1) / 0.00715 + 100;
      this.calc_RES = Math.round(VI);
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
    <iframe ref="iframe" :src="`${location.origin}/tool/#/toolkit/ViscosityIndex`" frameborder="0" style="width:100%;height:100%"></iframe>
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
