<template>
  <div>
    <commonCard :cardItem="oilSuggestItem" :formRef="formRef">
      <div v-for="(item, index) in oilSuggestItem.nodeValue" :key="index">
        <el-col :span="24">
          <el-form-item v-if="item.display">
            <div slot="label">
              <span v-if="item.required && item.display" class="star">*</span>
              <span v-if="item.display">{{ item.name }}</span>
              <span v-if="item.unit"> （{{ item.id == "1846" ? stepList[0].nodeValue[18].unit : item.unit }}）</span>
              <span v-if="item.tip">
                <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start">
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </span>
            </div>
          </el-form-item>
          <!-- input2 -->
          <div v-if="item.type == 'input2'" class="item_component">
            <inputNumber :loop-item="item" />
          </div>
          <!--textarea -->
          <div v-if="item.type == 'textarea' && item.display" class="item_component">
            <inputTextarea :loop-item="item" />
          </div>
          <!-- dropdown2 -->
          <div v-if="item.type == 'dropdown2'" class="item_component">
            <selectCommon :loop-item="item" @commonSelectChange="commonSelectChange" />
          </div>
          <div v-if="item.type == 'dropdown_cascade_multi' && item.display" class="item_component">
            <selectMultipleCascader :loop-item="item" />
          </div>
        </el-col>
      </div>
    </commonCard>
  </div>
</template>

<script>
import commonCard from "@/components/businessComponents/components/common-card";
import inputTextarea from "@/components/businessComponents/components/input-textarea";
import imgUpload from "@/components/businessComponents/components/img-upload";
import addButton from "@/components/businessComponents/components/add-button";
import selectCommon from "@/components/businessComponents/components/select-common";
import inputNumber from "@/components/businessComponents/components/input-number";
import selectMultipleCascader from "@/components/businessComponents/components/select-multiple-cascader";
import handleReport from "@/components/businessComponents/components/handleReport";
export default {
  mixins: [handleReport],
  components: {
    commonCard,
    inputTextarea,
    imgUpload,
    addButton,
    selectCommon,
    inputNumber,
    selectMultipleCascader
  },
  props: {
    oilSuggestItem: {
      type: Object,
      default: {}
    },
    stepList: {
      type: Object,
      default: {}
    },
    paramReportNode: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      formRef: "oilSuggestItemRef"
    };
  },
  watch: {
    oilSuggestItem: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val)) {
          this.handleRegItem(val);
        }
      },
      immediate: true
    }
  },
  methods: {
    commonSelectChange(item) {
      this.handleRegItem(this.oilSuggestItem);
      this.handleHiddenOrShow(item, this.oilSuggestItem);
    }
  }
};
</script>

<style lang="less" scoped>
.star {
  color: #f56c6c;
  font-size: 14px;
  margin-right: 2px;
}
.item-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.no-value {
  font-family: MicrosoftYaHei;
  margin-left: 10px;
}
.item_component {
  margin-bottom: 20px;
}
</style>
