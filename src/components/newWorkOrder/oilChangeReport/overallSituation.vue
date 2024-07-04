<template>
  <el-card class="overallSituationWrap" style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header" class="title">
      <el-divider direction="vertical"></el-divider>
      <span>{{ overallSituationName }}</span>
    </div>
    <el-form :model="overallSituationObj" ref="oilChangeRef" label-position="top" label-width="300px" style="padding:0 20px;">
      <el-row>
        <div v-for="(item, index) in overallSituationObj" :key="index">
          <el-col :span="24">
            <el-form-item :label="item.name + '：'" :required="item.required">
              <!-- 文本域 -->
              <el-input
                v-if="type == 'edit' && item.type == 'textarea'"
                type="textarea"
                placeholder="请输入"
                v-model="item.value"
                :maxlength="item.length"
                show-word-limit
                :autosize="autosize"
                clearable
              />
              <!-- 文本域 -->
              <el-input
                v-if="type == 'edit' && item.type == 'input1'"
                type="textarea"
                placeholder="请输入"
                v-model="item.value"
                :maxlength="item.length"
                show-word-limit
                :autosize="autosize"
                style="width: 100%;height: 120;"
                clearable
              />
              <el-select v-if="type == 'edit' && item.type == 'dropdown2'" size="small" clearable style="width:220px" v-model="item.valueCode" @change="changeVal(item)" placeholder="--请选择--">
                <el-option v-for="(dic, index) in item.fieldOption" :key="dic.value" :label="dic.option" :value="dic.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
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
      }
    },
    overallSituationName: {
      type: String,
      default: () => {
        return "";
      }
    },
    overallSituationObj: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      uploadUrl: "",
      imgDialogVisible: false,
      notShowUploadBtn: false,
      dialogImageUrl: "",
      tempImagePath: "",
      oilNameKey: 0,
      oilNameList: [],
      editOil: false,
      handleEditData: []
    };
  },
  mounted() {},
  created() {},
  methods: {
    changeVal(item) {
      let obj = item.fieldOption.filter(it => it.value == item.valueCode);
      item.value = obj[0].option;
    },
    // 验证
    validateOverallSituation(deviceRef) {
      const data = this.overallSituationObj;
      const emptyList = data.filter(item => {
        return item.required && !item.value;
      });
      if (emptyList.length > 0) {
        this.$message({
          message: emptyList[0].name + "必填",
          type: "warning"
        });
        this.$emit("passModulValidate", "111");
        return;
      } else {
        this.$emit("passModulValidate", "OverallSituation");
      }
    }
  }
};
</script>

<style lang='less'>
.overallSituationWrap {
  .noUploadBtn .el-upload--picture-card {
    display: none;
  }
  .title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    color: #000;
    line-height: 14px;
    font-weight: bold;
    display: flex;
  }
  .el-divider--vertical {
    width: 3px;
  }
  .el-divider {
    background-color: #dd0000;
    position: relative;
  }
  .el-upload-list__item {
    transition: none !important;
  }
}
</style>
