<template>
  <div>
    <commonCard :cardItem="summarySuggestItem">
      <div v-for="(item, index) in summarySuggestItem.nodeValue" :key="index">
        <el-col :span="24">
          <el-form-item>
            <div slot="label">
              <span v-if="item.required" class="star">*</span>
              <span v-if="item.display && item.type != 'button'">{{ item.name }}</span>
              <span v-if="item.unit">（ {{ item.unit }}）</span>
              <span v-if="item.tip">
                <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start">
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </span>
            </div>
            <!-- dropdown1 -->
            <div v-if="item.type == 'dropdown'">
              <selectCascader :loop-item="item" />
            </div>
            <div v-if="item.type == 'dropdown_cascade_multi' && item.display" class="item_component">
              <selectMultipleCascader :loop-item="item" />
            </div>
            <!-- input2 -->
            <div v-if="item.type == 'input2'">
              <inputNumber :loop-item="item" />
            </div>
            <!-- string1循环 -->
            <div v-if="item.type == 'string1'">
              <div v-for="(child1, chil1Index) in item.children" :key="chil1Index">
                <el-form-item style="margin-bottom:20px" v-if="child1.display">
                  <div slot="label" style="display:flex;align-items:center;margin-bottom:10px">
                    <span v-if="child1.required" class="star">*</span>
                    <span v-if="child1.display">{{ child1.name }}</span>
                    <span v-if="child1.unit">（{{ child1.unit }}）</span>
                    <span>{{ chil1Index + 1 }}</span>
                    <span v-if="child1.tip" style="margin:0 5px">
                      <el-tooltip effect="dark" :content="child1.tip.content" placement="top-start">
                        <i class="el-icon-warning-outline"></i>
                      </el-tooltip>
                    </span>
                    <el-link style="color:#dd0000;margin-left:10px" v-if="chil1Index > 0" @click="deleteItem(item, chil1Index)">删除</el-link>
                  </div>
                  <!-- input1 -->
                  <div v-if="child1.type == 'input1'">
                    <inputCommon :loop-item="child1" />
                  </div>
                  <!-- textarea -->
                  <div v-if="child1.type == 'textarea'">
                    <inputTextarea :loop-item="child1" />
                  </div>
                </el-form-item>
                <!-- 再次循环 -->
                <div v-for="(child2, child2Index) in child1.children" :key="child2Index" class="item_component">
                  <el-form-item v-if="child2.display">
                    <div slot="label">
                      <span v-if="child2.required" class="star">*</span>
                      <span v-if="child2.display">{{ child2.name }}</span>
                      <span v-if="child2.unit">（{{ child2.unit }}）</span>
                      <span v-if="child2.tip">
                        <el-tooltip effect="dark" :content="child2.tip.content" placement="top-start">
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </span>
                    </div>
                    <div v-if="child2.type == 'textarea' || child2.type == 'input1'">
                      <inputTextarea :loop-item="child2" />
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>

            <!-- dropdown2 -->
            <div v-if="item.type == 'dropdown2'">
              <selectCommon :loop-item="item" @commonSelectChange="commonSelectChange" />
            </div>
            <!-- button -->
            <div v-if="item.type == 'button' && item.display" class="item_component">
              <addButton :loop-item="item" @handlerAdd="handlerAdd(item)" />
            </div>
          </el-form-item>
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
import selectCascader from "@/components/businessComponents/components/select-cascader";
import inputCommon from "@/components/businessComponents/components/input-common";
import handleReport from "@/components/businessComponents/components/handleReport";
import selectMultipleCascader from "@/components/businessComponents/components/select-multiple-cascader";

export default {
  mixins: [handleReport],
  components: {
    commonCard,
    inputTextarea,
    imgUpload,
    addButton,
    selectCommon,
    inputNumber,
    selectCascader,
    inputCommon,
    selectMultipleCascader
  },
  props: {
    summarySuggestItem: {
      type: Object,
      default: {}
    },
    stepList: {
      type: Object,
      default: {}
    },
    // 添加池
    addFieldPoolDtoList: {
      type: Array,
      default: []
    },
    paramReportNode: {
      type: Array,
      default: []
    }
  },
  data() {
    return {};
  },
  watch: {
    summarySuggestItem: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val)) {
          this.handleRegItem(val);
        }
      },
      immediate: true
    }
  },
  methods: {
    // dropdown下拉事件
    commonSelectChange(item) {
      this.handleRegItem(this.summarySuggestItem);
      this.handleHiddenOrShow(item, this.summarySuggestItem);
    },
    // 添加
    handlerAdd(item) {
      console.log("添加", item);
      this.handleAddReportItem(item, this.summarySuggestItem);
    },
    // 删除
    deleteItem(item, index) {
      this.handleDeleteItem(this.summarySuggestItem.nodeValue, item.id, index);
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
