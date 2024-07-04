<template>
  <div>
    <commonCard :cardItem="appendixItem" :formRef="formRef">
      <div v-for="(item, index) in appendixItem.nodeValue" :key="index">
        <el-col :span="24">
          <div v-if="item.type == 'dropdown2' && item.display">
            <el-form-item>
              <div slot="label">
                <span v-if="item.required && item.display" class="star">*</span>
                <span v-if="item.display">{{ item.name }}</span>
                <span v-if="item.unit">（{{ item.unit }}）</span>
                <span v-if="item.tip">
                  <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start">
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </span>
              </div>
              <selectCommon :loop-item="item" @commonSelectChange="commonSelectChange(item)" @commonVisibleChange="commonVisibleChange(item)" />
            </el-form-item>
          </div>
          <!-- string1类型 -->
          <div v-if="item.type == 'string1'">
            <div v-for="(child, childInedx) in item.children" :key="childInedx">
              <div style="margin:10px 0;font-size:14px;color: #606266;display:flex;align-items:center">
                <div v-if="child.display">
                  <span>{{ child.name }}</span>
                  <span v-if="childInedx >= child.rangeMin">{{ childInedx + 1 }}</span>
                  <el-link style="color:#dd0000;display: contents;" v-if="childInedx >= child.rangeMin" @click="deleteItem(child, item, childInedx)">删除</el-link>
                </div>
              </div>
              <div v-for="(nextChild, nextChildIndex) in child.children" :key="nextChildIndex">
                <el-form-item>
                  <div slot="label">
                    <span v-if="nextChild.required && nextChild.display" class="star">*</span>
                    <span v-if="nextChild.display">{{ nextChild.name }}</span>
                    <span v-if="nextChild.unit && nextChild.display">（{{ nextChild.unit }}）</span>
                    <span v-if="nextChild.type == 'img'">（最多上传{{ nextChild.length }}张图片,支持.png.jpg.svn.gif图片格式）</span>
                    <span v-if="nextChild.tip && nextChild.display">
                      <el-tooltip class="item" effect="dark" :content="nextChild.tip.content" placement="top-start">
                        <i class="el-icon-warning-outline"></i>
                      </el-tooltip>
                    </span>
                  </div>
                  <div v-if="nextChild.type == 'tco' && nextChild.display">
                    <TCO :node-item="nextChild" />
                  </div>
                  <div v-for="(lastChild, lastChildIndex) in nextChild.children" :key="lastChildIndex" v-if="lastChild.display && nextChild.display" style="margin-left:15px">
                    <el-form-item>
                      <div slot="label">
                        <span v-if="lastChild.required && lastChild.display" class="star">*</span>
                        <span v-if="lastChild.display">{{ lastChild.name }}</span>
                        <span v-if="lastChild.unit">（{{ lastChild.unit }}）</span>
                        <span v-if="lastChild.type == 'img'">（最多上传{{ lastChild.length }}张图片,支持.png.jpg.svn.gif图片格式）</span>
                        <span v-if="lastChild.tip">
                          <el-tooltip class="item" effect="dark" :content="lastChild.tip.content" placement="top-start">
                            <i class="el-icon-warning-outline"></i>
                          </el-tooltip>
                        </span>
                      </div>

                      <!-- radio1 -->
                      <div v-if="lastChild.type == 'radio1'">
                        <radioCommon :loop-item="lastChild" @radioCommonChange="radioCommonChange(lastChild)" />
                      </div>
                      <!-- input2类型 -->
                      <div v-if="lastChild.type == 'input2' && lastChild.display">
                        <inputNumber :loop-item="lastChild" />
                      </div>
                    </el-form-item>
                  </div>
                  <!-- 附件列表 -->
                  <el-row
                    class="service-items-wrap"
                    v-for="(fileItem, fileIndex) in nextChild.serviceReportFileDtoList"
                    :key="fileIndex"
                    style="display:flex;align-items:center;"
                    v-if="nextChild.serviceReportFileDtoList.length"
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
                      <el-button type="text" @click="handleRemove(nextChild, fileItem)" style="color:#dd0000;font-size:13px;">删除</el-button>
                    </el-col>
                  </el-row>

                  <!-- input2类型 -->
                  <div v-if="nextChild.type == 'input2' && nextChild.display">
                    <inputNumber :loop-item="nextChild" />
                  </div>
                  <!-- dropdown2 -->
                  <div v-if="nextChild.type == 'dropdown2'">
                    <selectCommon :loop-item="nextChild" @commonSelectChange="commonSelectChange" @commonVisibleChange="commonVisibleChange" />
                  </div>
                  <!-- input1 -->
                  <div v-if="nextChild.type == 'input1' && nextChild.display">
                    <inputCommon :loop-item="nextChild" />
                  </div>
                  <!-- textarea类型 -->
                  <div v-if="nextChild.type == 'textarea' && nextChild.display">
                    <inputTextarea :loop-item="nextChild" />
                  </div>
                  <!-- img类型 -->
                  <div v-if="nextChild.type == 'img'">
                    <imgUpload :loop-item="nextChild" />
                  </div>
                  <!-- 添加附件  && nextChild.styleJsonDto.addTypeIsFileFlag-->
                  <div v-if="nextChild.type == 'button' && nextChild.display">
                    <fileUpload :loop-item="nextChild" @addFile="addFile" />
                  </div>
                </el-form-item>
              </div>
            </div>
          </div>
          <!-- 添加附录 -->
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
import addButton from "@/components/businessComponents/components/add-button";
import inputNumber from "@/components/businessComponents/components/input-number";
import imgUpload from "@/components/businessComponents/components/img-upload";
import fileUpload from "@/components/businessComponents/components/file-upload";
import { getAddItem } from "@/components/businessComponents/components/addItem";
import radioCommon from "@/components/businessComponents/components/radio-common";
import handleReport from "@/components/businessComponents/components/handleReport";
import selectCommon from "@/components/businessComponents/components/select-common";
import inputCommon from "@/components/businessComponents/components/input-common";
import TCO from "@/components/businessComponents/components/TCO/index";

export default {
  mixins: [handleReport],
  components: {
    commonCard,
    inputTextarea,
    addButton,
    inputNumber,
    imgUpload,
    fileUpload,
    radioCommon,
    selectCommon,
    inputCommon,
    TCO
  },
  props: {
    appendixItem: {
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
    return {
      formRef: "appendixItemRef",
      regList: [],
      reg: "",
      displayItem: {},
      fileDtoItem: [],
      selectValueCodeList: []
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
    radioCommonChange(item) {
      // 绑定点击事件后端需要添加标识是否有显隐控制关系，若无则直接return
      let id = "";
      this.displayItem = {};
      let attributeName = "";
      let attributeVal = "";
      let reg = "";
      this.regList.forEach(it => {
        let obj = {};
        obj.effectId = it.display.split(",")[0];
        obj.attributeName = it.display.split(",")[1];
        obj.reg = it.display.split(",")[2];
        obj.attributeVal = it.display.split(",")[it.display.split(",").length - 1];
        it.displayObj = obj;
      });
      this.regList.forEach(reg => {
        if (reg.displayObj.effectId == item.id) {
          id = reg.id;
          attributeName = reg.displayObj.attributeName;
          attributeVal = reg.displayObj.attributeVal;
          reg = reg.displayObj.reg;
        }
      });
      this.findItem(this.appendixItem.nodeValue, id);
      // 校验的时候需要校验required为true且display属性为true的
      this.displayItem.display = item[attributeName] == attributeVal;
    },
    handleRegItem() {
      // 找到表达式item
      this.regList = [];
      // 找到产生影响的字段
      // 找到styleJsonDto中display有值的，并且包装当前对象的id属性，返回的是数组，然后处理数组绑定的id值，改变需要隐藏的字段的display属性
      this.findRegItem(this.appendixItem.nodeValue);
    },
    findRegItem(arr) {
      arr.forEach(it => {
        if (!_.isEmpty(it.styleJsonDto) && it.styleJsonDto.display) {
          let obj = {};
          obj.id = it.id;
          obj.display = it.styleJsonDto.display;
          this.regList.push(obj);
          if (it.children.length) {
            this.findRegItem(it.children);
          } else {
            return;
          }
        } else {
          if (it.children.length) {
            this.findRegItem(it.children);
          }
        }
      });
    },
    findItem(arr, id) {
      arr.forEach(it => {
        if (it.id == id) {
          this.displayItem = it;
          if (it.children.length) {
            this.findItem(it.children, id);
          }
          return;
        } else {
          if (it.children.length) {
            this.findItem(it.children, id);
          }
        }
      });
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
    // 添加
    handlerAdd(item) {
      this.selectValueCodeList = [];
      this.handleSelectDisabled(this.appendixItem.nodeValue);
      this.handleAddReportItem(item, this.appendixItem, true, this.selectValueCodeList);
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
    // 返回现在children数组长度
    handlerItemLenght(bindingId) {
      const lg = this.appendixItem.nodeValue.filter(it => {
        return it.id == bindingId;
      })[0].children.length;
      return lg;
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
// 附件样式
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
