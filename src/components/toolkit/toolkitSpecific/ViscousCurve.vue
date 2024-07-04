<!-- <template>
  <div class="toolkit-container">
    <div v-if="!showCharts">
      <div class="form-item-container" v-for="(item, index) in formsData" :key="item.formId">
        <header class="part-name">
          产品{{ index + 1 }}<el-button size="small" type="text" style="margin-left: 10px; color: #d10000" v-if="index > 0" @click="deleteProduct(index)">删除</el-button>
        </header>
        <div class="form-part">
          <el-form :ref="`form-${item.formId}`" :model="formsData[index]" label-position="top" :rules="generateRules(index)">
            <el-row :gutter="6">
              <el-col :span="12">
                <el-form-item label="产品名称" prop="productName">
                  <div style="display: flex; align-items: center; width: 90%">
                    <el-input type="text" maxlength="50" v-model="formsData[index].productName" size="small" placeholder="请输入" />
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="6">
              <el-col :span="12">
                <el-form-item label="温度1" prop="temperature1">
                  <div style="display: flex; align-items: center; width: 90%">
                    <el-input v-model="formsData[index].temperature1" size="small" placeholder="请输入" />
                    <span class="input-left-box" plain size="small">℃</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="温度2" prop="temperature2">
                  <div style="display: flex; align-items: center; width: 90%">
                    <el-input v-model="formsData[index].temperature2" size="small" placeholder="请输入" />
                    <span class="input-left-box" plain size="small">℃</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="6">
              <el-col :span="12">
                <el-form-item label="黏度1" prop="viscosity1">
                  <div style="display: flex; align-items: center; width: 90%">
                    <el-input v-model="formsData[index].viscosity1" size="small" placeholder="请输入" />
                    <span class="input-left-box" plain size="small">cSt</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="黏度2" prop="viscosity2">
                  <div style="display: flex; align-items: center; width: 90%">
                    <el-input v-model="formsData[index].viscosity2" size="small" placeholder="请输入" />
                    <span class="input-left-box" plain size="small">cSt</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="bottom-op-bar" :style="formsData.length < 3 ? '' : 'justify-content: flex-end'">
        <el-button v-show="formsData.length < 3" plain size="small" round icon="el-icon-plus" @click="addProduct">添加产品</el-button>
        <el-button class="generate-btn" size="small" round style="background: #001450; color: white" @click="generateCharts">生成图表</el-button>
      </div>
      <BackFooter />
    </div>
    <div v-if="showCharts">
      <div class="charts-container" style="position: relative">
        <div id="echart-box" class="chart-show-box"></div>
        <div class="xText">温度（℃）</div>
        <div class="yText">黏度（cSt）</div>
        <div class="xTip">该黏温曲线图仅在温度高于倾点20°C以上时有效。</div>
      </div>
      <div style="width: 100%; display: flex; justify-content: flex-end; margin-top: 10px">
        <el-button size="small" plain @click="showCharts = false">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BackFooter from "../components/toolkitBack.vue";
import { validateviscosity, validateTemperature } from "../components/viscousCurve/rules";
import { generateChart } from "../components/viscousCurve/generateCharts";
export default {
  components: {
    BackFooter
  },
  data() {
    return {
      formId: 0,
      showCharts: false,
      rawFormItem: { productName: "", temperature1: 40, temperature2: 100, viscosity1: "", viscosity2: "" },
      formsData: [],
      rules: {}
    };
  },
  created() {
    this.addProduct();
  },
  methods: {
    validataCb(index, key, val) {
      this.formsData[index][key] = val;
    },
    generateRules(index) {
      if (this.rules[index]) return this.rules[index];
      return (this.rules[index] = {
        productName: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        temperature1: [{ validator: validateTemperature(this, index, "temperature1"), trigger: "change" }],
        temperature2: [{ validator: validateTemperature(this, index, "temperature2"), trigger: "change" }],
        viscosity1: [{ validator: validateviscosity(this, index, "viscosity1"), trigger: "change" }],
        viscosity2: [{ validator: validateviscosity(this, index, "viscosity2"), trigger: "change" }]
      });
    },
    simpleCloneObj(obj) {
      const targetObj = obj ? obj : { formId: this.formId++, ...this.rawFormItem };
      return JSON.parse(JSON.stringify(targetObj));
    },
    deleteProduct(index) {
      this.formsData.splice(index, 1);
    },
    addProduct() {
      this.formsData.push(this.simpleCloneObj());
    },
    generateCharts() {
      const validateFlag = this.formsData.every((item, index) => {
        let validateRes = false;
        this.$refs[`form-${item.formId}`][0].validate(valid => {
          validateRes = valid;
        });
        return validateRes;
      });

      if (validateFlag) {
        this.showCharts = true;
        this.$nextTick(() => {
          generateChart(this.formsData);
        });
      } else return;
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
  padding-bottom: 60px;
  background: #fff;
}
.chart-show-box {
  position: relative;
  width: 100%;
  min-height: 390px;
}
.xText {
  position: absolute;
  font-size: 12px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bolder;
  color: #000;
}
.xTip {
  width: 100%;
  text-align: center;
  position: absolute;
  font-size: 12px;
  left: 50%;
  transform: translateX(-50%);
  color: #000;
  bottom: 10px;
}
.yText {
  position: absolute;
  font-size: 12px;
  top: 50%;
  left: -3px;
  transform: rotate(-90deg);
  font-weight: bolder;
  color: #000;
}
</style> -->

<template>
  <div v-loading="loading" style="margin:0;padding:0;width:100%;height:100%">
    <iframe ref="iframe" :src="`${location.origin}/tool/#/toolkit/ViscousCurve`" frameborder="0" style="width:100%;height:100%"></iframe>
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
