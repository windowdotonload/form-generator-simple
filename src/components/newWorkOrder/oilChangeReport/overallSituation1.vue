<template>
  <el-card class="overallSituation" style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header" class="title">
      <el-divider direction="vertical"></el-divider>
      <span>{{ overallSituationName }}</span>
    </div>
    <el-form :model="overallSituationObj" ref="oilChangeRef" label-position="top" label-width="200px" style="padding:0 20px;">
      <el-row>
        <div v-for="(child, index) in overallSituationObj" :key="index">
          <el-col :span="24">
        <el-form-item>
          <span slot="label" style="width: 260px;">
            <span v-if="child.required " class="star">*</span>
            <span> {{ child.name }}:</span>
              <span v-if="child.unit">({{ child.unit }})</span>
              <span v-if="child.type == 'img'">（最多上传{{ child.length }}张图片）</span>
          </span>
          <el-select
            v-if="type == 'edit' && child.type == 'dropdown4'"
            size="small"
            clearable
            @change="selectDropdown4(child)"
            style="width: 220px"
            v-model="child.valueCode"
            placeholder="--请选择--"
          >
            <el-option v-for="item in child.fieldOption" :key="item.value" :label="item.option" :value="item.value"></el-option>
          </el-select>
          <div v-if="child.type == 'dropdown4'">
            <div  v-for="(child1, index) in child.children" :key="index" >
              <div v-if="!child1.valueCodeNotDisplay || (child1.valueCodeNotDisplay && !child1.valueCodeNotDisplay.includes(child.valueCode))">
                <el-form-item style="margin-top: 20px">
                  <span slot="label" style="width: 260px;">
                    <span v-if="child1.required " class="star">*</span>
                    <span> {{ child1.name }}:</span>
                    <span v-if="child1.unit">({{ child1.unit }})</span>
                    <span v-if="child1.type == 'img'">（最多上传{{ child1.length }}张图片）</span>
                  </span>
                  <el-select v-if="type == 'edit' && child1.type == 'dropdown4'" size="small" style="width:220px;" clearable  v-model="child1.valueCode" 
                  @change="selectDropdown4(child1)" placeholder="请选择">
                    <el-option v-for="(dic, index2) in child1.fieldOption" :key="index2" :label="dic.option" :value="dic.value"></el-option>
                  </el-select>
                  <el-input
                    v-if="child1.type == 'textarea' && type == 'edit'"
                    placeholder="请输入"
                    :disabled="child1.disabled"
                    v-model="child1.value"
                    :maxlength="child1.length"
                    type="textarea"
                    style="width: 100%"
                    size="big"
                    show-word-limit
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </div>
              <div v-if="child1.type == 'dropdown4' && !child1.valueCodeNotDisplay || (child1.valueCodeNotDisplay && !child1.valueCodeNotDisplay.includes(child.valueCode))" >
                <div  v-for="(child2, index) in child1.children" :key="index" >
                  <div v-if="!child2.valueCodeNotDisplay || (child2.valueCodeNotDisplay && !child2.valueCodeNotDisplay.includes(child1.valueCode))">
                    <el-form-item style="margin-top: 20px">
                      <span slot="label" style="width: 260px;">
                        <span v-if="child2.required " class="star">*</span>
                        <span> {{ child2.name }}:</span>
                        <span v-if="child2.unit">({{ child2.unit }})</span>
                        <span v-if="child2.type == 'img'">（最多上传{{ child2.length }}张图片）</span>
                      </span>
                      <el-input
                        v-if="child2.type == 'textarea' && type == 'edit'"
                        placeholder="请输入"
                        :disabled="child2.disabled"
                        v-model="child2.value"
                        :maxlength="child2.length"
                        type="textarea"
                        style="width: 100%"
                        size="big"
                        show-word-limit
                        clearable
                      >
                      </el-input>
                    </el-form-item>
                  </div>
              </div>
              </div>
              </div>
          </div>
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
    };
  },

  mounted() {
    console.log(this.overallSituationObj);
  },
  created() {},
  methods: {
    selectDropdown4(val) {
      let optionsData = val.fieldOption;
      let index1 = optionsData.find(item => item.value == val.valueCode);
      val.value = index1.option;
      val.valueCode = index1.value;
    },
    // 验证
    validateOverallSituation1(deviceRef) {
      const data = this.overallSituationObj;
      let dropdown4ListChildNotValue = []
      let dropdown4ListChild = []
      let emptyChildList = []
      console.log(data)
      const emptyList = data.filter(item => {
        return item.required && !item.value;
      });
      data.forEach(it3 => {
        if (it3.type == "dropdown4" && it3.children.length) {
          it3.children.forEach(it3Child => {
            dropdown4ListChild.push(it3Child)
            if ((!it3Child.valueCodeNotDisplay || (it3Child.valueCodeNotDisplay && !it3Child.valueCodeNotDisplay.includes(it3.valueCode))) &&
            it3Child.required && !it3Child.value ) {
              dropdown4ListChildNotValue.push(it3Child);
            }
          });
        }
      });
      dropdown4ListChild.forEach(it4=>{
        if (it4.type == "dropdown4" && it4.children.length && it4.valueCode) {
          it4.children.forEach(it3Child => {
            if ((!it3Child.valueCodeNotDisplay || (it3Child.valueCodeNotDisplay && !it3Child.valueCodeNotDisplay.includes(it4.valueCode))) &&
            it3Child.required && !it3Child.value ) {
              console.log(it3Child,'it3Child')
              dropdown4ListChildNotValue.push(it3Child);
            }
          });
        }
      })
      
      emptyChildList = emptyList.concat(dropdown4ListChildNotValue)
      console.log(dropdown4ListChildNotValue,emptyList)
      if (emptyChildList.length > 0) {
        this.$message({
          message: emptyChildList[0].name + "必填",
          type: "warning"
        });
        this.$emit("passModulValidate", "111");
        return;
      } else {
        this.$emit("passModulValidate", "OverallSituation1");
      }
    }
  }
};
</script>

<style lang='less' scope>
.overallSituation {
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
  .el-upload-list__item {
    transition: none !important;
  }
  .el-form-item > label {
    width: 130px;
  }
  .el-form-item > label span {
    display: flex;
  }
  .el-divider {
    background-color: #dd0000;
    position: relative;
  }
  .star {
    color: #f56c6c;
    font-size: 14px;
    margin-right: 2px;
  }
  .el-textarea {
    width: 540px;
    height: 58px;
  }
}
</style>