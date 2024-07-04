<template>
  <div>
    <commonCard :cardItem="causeAnalysisItem" :formRef="formRef">
      <div v-for="(item, index) in causeAnalysisItem.nodeValue" :key="index">
        <el-col :span="24">
          <!-- 折叠面板 -->
          <el-collapse v-model="activeNames" v-if="index == 0">
            <el-collapse-item :title="item.name" name="guide">
              <div style="font-size:13px;line-height:21px;color:#333;">
                <div v-for="(lev1, treeIndex) in item.children" :key="treeIndex">
                  <!-- 一级 -->
                  <div>
                    <span>{{ lev1.name }}</span>
                  </div>
                  <!-- 二级 -->
                  <div v-for="(lev2, lev2Index) in lev1.children" :key="lev2Index">
                    <div style="margin-left:5px">
                      <span>（{{ lev2Index + 1 }}）</span>
                      <span>{{ lev2.name }}</span>
                    </div>
                    <!-- 三级 -->
                    <div v-for="(lev3, lev3Index) in lev2.children" :key="lev3Index">
                      <div style="display:flex;align-items:center;margin-left:30px">
                        <div style="width:4px;height:4px;border-radius:50%;background-color:#000;margin-right:5px"></div>
                        <div>{{ lev3.name }}</div>
                      </div>
                      <!-- 四级 -->
                      <div v-for="(lev4, lev4Index) in lev3.children" :key="lev4Index">
                        <div style="margin-left:45px">
                          <span>-</span>
                          <span>{{ lev4.name }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
          <el-form-item>
            <div slot="label">
              <span v-if="item.required" class="star">*</span>
              <span v-if="item.display && index > 0 && item.type != 'button'">{{ item.name }}</span>
              <span v-if="item.tip">
                <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start">
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </span>
            </div>
            <!-- button类型 -->
            <div v-if="item.type == 'button' && item.display">
              <addButton :loop-item="item" @handlerAdd="handlerAdd(item)" />
            </div>
            <!-- string类型 -->
            <div v-if="item.type == 'string'">
              <span>{{ item.value }}</span>
            </div>
            <!-- radio类型 -->
            <div v-if="item.type == 'radio1'">
              <radioCommon :loop-item="item" @radioCommonChange="radioCommonChange(item)" />
            </div>
            <!-- string1类型 -->
            <div v-if="item.type == 'string1' || item.type == 'radio1'">
              <div v-for="(stringItem, stringItemIndex) in item.children" :key="stringItemIndex">
                <div v-for="(stringChild, stringChildIndex) in stringItem.children" :key="stringChildIndex">
                  <el-form-item v-if="stringChild.display">
                    <div slot="label" style="display:flex;margin:20px 0">
                      <span v-if="stringChild.required && stringChild.display" class="star">*</span>
                      <span v-if="stringChild.type != 'button' && stringChild.display">{{ stringChild.name }}</span>
                      <span v-if="stringChild.type != 'button' && stringChild.display">{{ stringItemIndex + 1 }}</span>
                      <el-link style="color:#dd0000;margin-left:10px" v-if="stringItemIndex > 0 && stringChild.name.includes('发现') && stringChild.display" @click="deleteItem(item, stringItemIndex)"
                        >删除</el-link
                      >
                      <span v-if="stringChild.type == 'img' && stringChild.display">（最多上传{{ stringChild.length }}张图片,支持.png.jpg.svn.gif图片格式）</span>
                    </div>
                    <!-- button类型 -->
                    <div v-if="stringChild.type == 'button' && stringChild.display">
                      <addButton :loop-item="stringChild" @handlerAdd="handlerAdd(stringChild)" />
                    </div>

                    <!-- 图片 -->
                    <div v-if="stringChild.type == 'img' && stringChild.display">
                      <imgUpload :loop-item="stringChild" />
                    </div>
                    <!-- 文本域 -->
                    <div v-if="stringChild.type == 'textarea' && stringChild.display">
                      <inputTextarea :loop-item="stringChild" />
                    </div>
                  </el-form-item>
                  <!-- string1类型 -->
                  <div v-if="stringChild.type == 'string1'">
                    <div v-for="(child, childIndex) in stringChild.children" :key="childIndex">
                      <div v-for="(nextChild, nextChildIndex) in child.children" :key="nextChildIndex" v-if="nextChild.display">
                        <el-form-item>
                          <div slot="label" style="display:flex;margin:20px 0">
                            <span v-if="nextChild.required && nextChild.display" class="star">*</span>
                            <span v-if="nextChild.display && nextChild.type != 'button'">{{ nextChild.name }}</span>
                            <span v-if="nextChild.display">{{ childIndex + 1 }}</span>
                            <span v-if="nextChild.type == 'img' && nextChild.display">（最多上传{{ nextChild.length }}张图片,支持.png.jpg.svn.gif图片格式）</span>
                            <!-- 删除图片和分析 -->
                            <el-link style="color:#dd0000" v-if="childIndex > 0 && nextChild.type == 'img' && nextChild.display" @click="deleteItem(stringChild, childIndex)">删除</el-link>
                          </div>
                        </el-form-item>
                        <!-- 图片 -->
                        <div v-if="nextChild.type == 'img' && nextChild.display">
                          <imgUpload :loop-item="nextChild" />
                        </div>
                        <!-- 文本域 -->
                        <div v-if="nextChild.type == 'textarea' && nextChild.display">
                          <inputTextarea :loop-item="nextChild" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
import radioCommon from "@/components/businessComponents/components/radio-common";
import handleReport from "@/components/businessComponents/components/handleReport";
export default {
  mixins: [handleReport],
  components: {
    commonCard,
    inputTextarea,
    imgUpload,
    addButton,
    selectCommon,
    radioCommon
  },
  props: {
    causeAnalysisItem: {
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
      formRef: "causeAnalysisItemRef",
      activeNames: "",
      findItem: {}
    };
  },
  created() {
    // console.log('causeAnalysisItem',this.causeAnalysisItem)
  },
  watch: {
    causeAnalysisItem: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val)) {
          this.handleRegItem(val);
        }
      },
      immediate: true
    }
  },
  methods: {
    // radio1改变
    radioCommonChange(item) {
      this.handleHiddenOrShow(item, this.causeAnalysisItem);
    },
    // 添加
    async handlerAdd(item) {
      await this.handleAddReportItem(item, this.causeAnalysisItem);
      this.handleRegItem(this.causeAnalysisItem);
    },
    // 删除
    deleteItem(item, index) {
      this.handleDeleteItem(this.causeAnalysisItem.nodeValue, item.id, index);
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
/deep/.el-collapse {
  border: 1px solid #ccddff;
  padding: 0px 20px;
  border-radius: 4px;
  background-color: rgba(204, 221, 255, 0.2);
}
/deep/.el-collapse-item__header {
  background-color: transparent;
  border-bottom: none;
  color: #dd0000;
}
/deep/.el-collapse-item__wrap {
  background-color: transparent;
  border-bottom: none;
}
</style>
