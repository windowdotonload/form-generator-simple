<template>
  <el-card class="deviceInfo" style="margin-top: 20px; border: 1px solid #ededed; border-radius: 4px">
    <div slot="header" class="title">
      <el-divider direction="vertical"></el-divider>
      <span
        >总结与建议 <span class="font-style" :style="deviceDetailObj.reportType == 1 ? 'color:#666' : 'color:#dd0000'">{{ deviceDetailObj.reportType == 1 ? "（选填）" : "（必填）" }}</span></span
      >
    </div>
    <el-form :model="suggestForm" ref="suggestRef" style="padding: 0 20px">
      <el-row>
        <div v-for="(item, index) in suggestForm" :key="index" style="width: 100%">
          <el-form-item>
            <el-input
              v-if="type == 'edit'"
              type="textarea"
              placeholder="请根据执行结果填写总结或建议"
              v-model="item.value"
              maxlength="500"
              show-word-limit
              style="width: 100%"
              :autosize="autosize"
              clearable
            />
            <span v-if="type == 'view'">{{ item.value }}</span>
          </el-form-item>
        </div>
      </el-row>
      <el-row v-if="type == 'edit' && deviceDetailObj.reportType == 1" style="color: #dd0000">
        <el-form-item>
          <span>请从以下几个方面总结该设备的润滑现状、潜在故障风险和相应建议</span>
        </el-form-item>
      </el-row>
      <el-row v-if="type == 'edit' && deviceDetailObj.reportType == 2">
        <el-form-item>
          <span style="color: #dd0000">*</span>
          <span>本检测结果仅对取样油样负责，试验结果仅供参考</span>
        </el-form-item>
      </el-row>
      <el-row v-if="type == 'edit'">
        <div v-for="(example, idx) in examplesList" :key="idx">
          <span style="font-family: MicrosoftYaHei-Bold; color: #000; font-size: 14px">{{ example.name }}</span
          ><span class="copy-btn" @click="copyText(example.id)" :id="example.nameKey">复制</span>
          <p v-html="example.value" style="white-space: pre-wrap; font-size: 13px; color: #666; line-height: 24px"></p>
        </div>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: () => {
        return "";
      },
    },
    deviceObj: {
      type: Array,
      default: () => {
        return [];
      },
    },
    deviceDetail: {
      type: Object,
      default: () => {
        return "";
      },
    },
    suggestObj: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      suggestForm: [],
      examplesList: [],
      deviceDetailObj: this.deviceDetail,
      autosize: { minRows: 8, maxRows: 10 },
    };
  },
  mounted() {},
  created() {
    //设备信息中是否有润滑点设备细分选项
    let is_lup_device_detail_value = "";
    let data = [];
    this.deviceObj.forEach((item) => {
      if (item.nameKey == "lup_device_detail") {
        is_lup_device_detail_value = item.value;
      }
    });
    if (is_lup_device_detail_value) {
      this.suggestObj.forEach((it) => {
        if (it.valueCode == is_lup_device_detail_value) {
          data = it.children;
        }
      });
    } else {
      data = this.suggestObj;
    }
    this.suggestForm = data;
    const examplesData = data[0].children;
    examplesData.forEach((it) => {
      if (it.value) {
        it.value = it.value.replace(/@#!/g, "<br/>");
      }
    });
    this.examplesList = examplesData;
    this.deviceDetailObj = this.deviceDetail;
  },
  methods: {
    // 复制
    copyText(val) {
      const data = this.examplesList;
      let copyText = "";
      data.forEach((item) => {
        if (item.id == val) {
          copyText = item.value;
        }
      });
      copyText = copyText.replace(/<br\/>/g, "");
      const oInput = document.createElement("input"); //创建一个隐藏input（重要！）
      oInput.value = copyText; //赋值
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message({ message: "复制成功", type: "success" });
    },
    childMethod() {
      this.$emit("passModulValidate");
    },
    validateSuggest() {
      const data = this.suggestForm;
      let radio5EmptyList = [];
      let emptyChildList = [];
      let emptyList = data.filter((item) => {
        return item.required && !item.value;
      });
      emptyList = emptyList.concat(emptyList).concat(radio5EmptyList);
      if (emptyList.length > 0) {
        this.$message({
          message: emptyList[0].name + "必填",
          type: "warning",
        });
        return;
      } else {
        this.$emit("passModulValidate", "suggest");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.suggest-title {
  margin-left: 10px;
}
.font-style {
  font-family: MicrosoftYaHei;
  font-size: 14px;
  font-weight: normal;
}
/deep/.el-form-item {
  width: 100%;
}
/deep/ .el-form-item__content {
  width: 100%;
}
.copy-btn {
  color: #001450;
  cursor: pointer;
  font-size: 13px;
  margin-left: 24px;
}
</style>
