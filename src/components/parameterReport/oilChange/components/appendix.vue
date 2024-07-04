<template>
  <div>
    <commonCard :cardItem="appendixItem" :formRef="formRef">
      <div v-for="(item, index) in appendixItem.nodeValue" :key="index">
        <el-col :span="24">
          <el-form-item>
            <div slot="label">
              <span v-if="item.required" class="star">*</span>
              <span v-if="item.display">{{ item.name }}</span>
              <span v-if="item.unit">（{{ item.unit }}）</span>
              <span v-if="item.tip">
                <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start">
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </span>
            </div>
            <div v-if="item.type == 'dropdown2'">
              <selectCommon :loop-item="item" @commonSelectChange="commonSelectChange" />
            </div>
          </el-form-item>

          <!-- string1 -->
          <div v-if="item.type == 'string1'">
            <div v-for="(child1, child1Index) in item.children" :key="child1Index">
              <el-form-item>
                <div slot="label" style="display:flex;align-items:center">
                  <span v-if="child1.required" class="star">*</span>
                  <span v-if="child1.display">{{ child1.name }}</span>
                  <span v-if="isAddFat ? child1Index > 0 : child1Index >= item.rangeMin">{{ child1Index + 1 }}</span>
                  <span v-if="child1.tip && child1.display" style="margin-left:8px;">
                    <el-tooltip class="item" effect="dark" :content="child1.tip.content" placement="top-start">
                      <i class="el-icon-warning-outline"></i>
                    </el-tooltip>
                  </span>
                  <el-link style="color:#dd0000;margin-left:10px" v-if="isAddFat ? child1Index > 0 : child1Index >= item.rangeMin" @click="deleteItem(child1, item, child1Index)">删除</el-link>
                </div>
              </el-form-item>

              <div v-for="(child2, child2Index) in child1.children" :key="child2Index" v-if="child2.display || child2.type == 'button'">
                <el-form-item>
                  <div slot="label" style="display:flex">
                    <span v-if="child2.required && child2.display" class="star">*</span>
                    <span v-if="child2.display && child2.type != 'tco' && child2.type != 'button'">{{ child2.name }}</span>
                    <span v-if="child2.unit && child2.display">（{{ child2.unit }}）</span>
                    <span v-if="child2.tip && child2.display">
                      <el-tooltip class="item" effect="dark" :content="child2.tip.content" placement="top-start">
                        <i class="el-icon-warning-outline"></i>
                      </el-tooltip>
                    </span>
                  </div>
                  <!-- 附件列表 -->
                  <el-row
                    class="service-items-wrap"
                    v-for="(fileItem, fileIndex) in child2.serviceReportFileDtoList"
                    :key="fileIndex"
                    style="display:flex;align-items:center;"
                    v-if="child2.serviceReportFileDtoList.length"
                  >
                    <el-col :span="18">
                      <div style="color:#333;font-size:14px;line-height:14px;margin-bottom:12px;font-weight:bold;">
                        <span style="color:#dd0000;">附件{{ fileIndex + 1 }}：</span>{{ fileItem.fileName }}
                      </div>
                      <div style="color:#999999;font-size:13px;line-height:13px;">
                        <span>创建人：{{ fileItem.createUserName }}</span>
                        <span style="margin-left:24px;">创建时间：{{ fileItem.createTime }}</span>
                      </div>
                    </el-col>
                    <el-col :span="6" align="right">
                      <el-button type="text" @click="previewAttachment(fileItem)" style="color:#001450;font-size:13px;">预览</el-button>
                      <el-button type="text" @click="handleRemove(child2, fileItem)" style="color:#dd0000;font-size:13px;">删除</el-button>
                    </el-col>
                  </el-row>
                  <!-- input2 -->
                  <div v-if="child2.type == 'input2'">
                    <inputNumber :loop-item="child2" />
                  </div>
                  <!-- textarea -->
                  <div v-if="child2.type == 'textarea'">
                    <inputTextarea :loop-item="child2" />
                  </div>
                  <!-- dropdown2 -->
                  <div v-if="child2.type == 'dropdown2'">
                    <selectCommon :loop-item="child2" @commonSelectChange="commonSelectChange" @commonVisibleChange="commonVisibleChange" />
                  </div>
                  <!-- input1 -->
                  <div v-if="child2.type == 'input1' && child2.display">
                    <inputCommon :loop-item="child2" />
                  </div>
                  <!-- 添加附件 -->
                  <div v-if="child2.type == 'button' && (child2.display && child2.name.includes('上传文件'))">
                    <fileUpload :loop-item="child2" @addFile="addFile" />
                  </div>
                  <div v-if="child2.type == 'tco'">
                    <TCO :node-item="child2" />
                  </div>
                </el-form-item>

                <div v-for="(child3, child3Index) in child2.children" :key="child3Index" v-if="child3.display || child3.type == 'button'">
                  <el-form-item>
                    <div slot="label" style="display:flex">
                      <span v-if="child3.required && child3.display" class="star">*</span>
                      <span v-if="child3.display">{{ child3.name }}</span>
                      <span v-if="child3.unit && child3.display">（{{ child3.unit }}）</span>
                      <span v-if="child3.tip && child3.display">
                        <el-tooltip class="item" effect="dark" :content="child3.tip.content" placement="top-start">
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </span>
                    </div>
                    <div v-if="child3.type == 'radio1' && child3.display">
                      <radioCommon :loop-item="child3" @radioCommonChange="radioCommonChange(child3)" />
                    </div>
                    <!-- input2 -->
                    <div v-if="child3.type == 'input2' && child3.display">
                      <inputNumber :loop-item="child3" />
                    </div>
                    <!-- textarea -->
                    <div v-if="child3.type == 'textarea' && child3.display">
                      <inputTextarea :loop-item="child3" />
                    </div>
                    <!-- dropdown2 -->
                    <div v-if="child3.type == 'dropdown2' && child3.display">
                      <selectCommon :loop-item="child3" @commonSelectChange="commonSelectChange" @commonVisibleChange="commonVisibleChange" />
                    </div>
                    <!-- input1 -->
                    <div v-if="child3.type == 'input1' && child3.display">
                      <inputCommon :loop-item="child3" />
                    </div>
                    <!-- 添加附件 -->
                    <div v-if="child3.type == 'button' && child3.display">
                      <fileUpload :loop-item="child3" @addFile="addFile" />
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <!-- button -->
          <div v-if="item.type == 'button'">
            <addButton :loop-item="item" @handlerAdd="handlerAdd(item)" />
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
import handleReport from "@/components/businessComponents/components/handleReport";
import fileUpload from "@/components/businessComponents/components/file-upload";
import inputCommon from "@/components/businessComponents/components/input-common";
import radioCommon from "@/components/businessComponents/components/radio-common";
import TCO from "@/components/businessComponents/components/TCO/index";

export default {
  mixins: [handleReport],
  components: {
    commonCard,
    inputTextarea,
    imgUpload,
    addButton,
    selectCommon,
    inputNumber,
    fileUpload,
    inputCommon,
    radioCommon,
    TCO
  },
  props: {
    appendixItem: {
      type: Object,
      default: {}
    },
    addFieldPoolDtoList: {
      type: Array,
      default: []
    },
    isAddFat: {
      type: Boolean,
      default: false
    },
    paramReportNode: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      formRef: "appendixItemRef",
      selectValueCodeList: [],
      fileDtoItem: []
    };
  },
  watch: {
    appendixItem: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val)) {
          this.handleRegItem(val);
        }
      },
      immediate: true
    }
  },
  methods: {
    // radio显隐控制
    radioCommonChange(radioItem) {
      this.handleRegItem(this.appendixItem);
      this.handleHiddenOrShow(radioItem, this.appendixItem);
    },
    // 添加附录
    handlerAdd(item) {
      this.selectValueCodeList = [];
      this.handleSelectDisabled(this.appendixItem.nodeValue);
      this.handleAddReportItem(item, this.appendixItem, true, this.selectValueCodeList);
    },
    // dropdown2类型下拉事件
    commonSelectChange(item) {
      if (item.nameKey == "key_appendix_one") {
        let flag = item.valueCode == "1";
        this.handleCo2(this.appendixItem.nodeValue, flag);
      }
      this.handleRegItem(this.appendixItem);
      this.handleHiddenOrShow(item, this.appendixItem);
    },
    handleCo2(arr, flag) {
      arr.forEach(it => {
        if (it.nameKey == "key_jsco2pfqk_num") {
          it.display = flag;
          if (it.children.length) {
            this.handleCo2(it.children, flag);
          } else {
            return;
          }
        } else {
          if (it.children.length) {
            this.handleCo2(it.children, flag);
          }
        }
      });
    },
    // 下拉项显示时
    commonVisibleChange(item) {
      let fieldOptionList = item.fieldOption;
      this.selectValueCodeList = [];
      this.handleSelectDisabled(this.appendixItem.nodeValue);
      let str = this.selectValueCodeList.join(",");
      if (str.length) {
        fieldOptionList.forEach(it => {
          it.disabled = str.includes(it.value);
        });
      } else {
        fieldOptionList.forEach(it => {
          it.disabled = false;
        });
      }
      item.fieldOption = JSON.parse(JSON.stringify(item.fieldOption));
    },
    // 处理下拉项中不可选择
    handleSelectDisabled(arr) {
      // 先找出"dropdown2"类型的且有valueCode值的字段
      // 找到当前字段的fieldOption数组
      // 根据已有的valueCode值对当前字段的fieldOption处理不可选
      arr.forEach(it => {
        if (it.type == "dropdown2" && it.valueCode && it.valueCode != "0" && it.name.includes("附录名称")) {
          this.selectValueCodeList.push(it.valueCode);
          return;
        } else {
          if (it.children.length) {
            this.handleSelectDisabled(it.children);
          }
        }
      });
    },
    // 删除
    deleteItem(currentItem, upLevItem, index) {
      this.selectValueCodeList = [];
      this.handleSelectDisabled(this.appendixItem.nodeValue);
      // 在当前的currentItem中找出dropdown2类型并拿到选到的值，
      // 有值则赋值并且删除this.selectValueCodeList（已选中）的对应值，无值则直接删除该item
      let isSelect = false;
      let selectVal = "";
      currentItem.children.forEach(item => {
        if (item.type == "dropdown2" && item.valueCode) {
          isSelect = true;
          selectVal = item.valueCode;
        }
      });
      if (isSelect) {
        //先删除已选中的
        if (this.selectValueCodeList.length) {
          this.selectValueCodeList.forEach((it, idx) => {
            if (it == selectVal) {
              this.selectValueCodeList.splice(idx, 1);
            }
          });
        }
        this.handleDeleteItem(this.appendixItem.nodeValue, upLevItem.id, index);
      } else {
        //直接删除
        this.handleDeleteItem(this.appendixItem.nodeValue, upLevItem.id, index);
      }
    },
    // 上传附件
    addFile(fileItem) {
      this.fileDtoItem = [];
      this.findFileDtoItem(this.appendixItem.nodeValue, fileItem.bindingId);
      if (this.fileDtoItem.length > 9) {
        this.$message({
          type: "warning",
          message: "最多上传十个附件"
        });
        return;
      } else {
        this.addFileToItem(this.appendixItem.nodeValue, fileItem, fileItem.bindingId);
      }
    },
    addFileToItem(arr, fileItem, bindingId) {
      arr.forEach(it => {
        if (it.id == bindingId) {
          it.serviceReportFileDtoList.push(fileItem);
          return;
        } else {
          if (it.children.length) {
            this.addFileToItem(it.children, fileItem, bindingId);
          }
        }
      });
    },
    // 预览
    async previewAttachment(fileItem) {
      const params = {
        url: encodeURI(fileItem.filePath)
      };
      const res = await this.requestMethodGet("/web/file/getFullUrl", params);
      if (res.data.code == 1000) {
        window.open(res.data.data, "_blank");
      } else {
        this.$message({
          type: "warning",
          message: res.data.msg
        });
      }
    },
    // 删除附件
    handleRemove(child, fileItem) {
      child.serviceReportFileDtoList.forEach((it, idx) => {
        if (it.uid == fileItem.uid) {
          child.serviceReportFileDtoList.splice(idx, 1);
        }
      });
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
.service-items-wrap {
  background: rgba(204, 221, 255, 0.2);
  font-weight: 400;
  color: #999;
  border: 1px solid #ccddff;
  border-radius: 6px;
  font-size: 13px;
  padding: 16px 20px;
  margin-top: 20px;
  margin-bottom: 12px;
}
</style>
