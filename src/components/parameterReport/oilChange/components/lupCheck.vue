<template>
  <div>
    <commonCard :cardItem="lupCheckItem" :formRef="formRef">
      <div v-for="(item, index) in lupCheckItem.nodeValue" :key="index">
        <el-col :span="24">
          <el-form-item v-if="item.display">
            <div slot="label">
              <span v-if="item.required && item.display" class="star">*</span>
              <span v-if="item.display && item.type != 'button'">{{ item.name }}</span>
              <span v-if="item.type.includes('img') && item.display">（最多上传{{ item.length }}张图片,支持.png.jpg.svn.gif图片格式）</span>
              <span v-if="item.tip && item.display">
                <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start">
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </span>
            </div>
          </el-form-item>
          <!-- select类型 -->
          <div v-if="item.type == 'dropdown2'" class="item_component">
            <selectCommon :loop-item="item" @commonSelectChange="commonSelectChange" />
          </div>
          <!-- img类型 -->
          <div class="item_component" v-if="item.type == 'img' && item.display">
            <imgUpload :loop-item="item" />
          </div>
          <!-- 文本域 -->
          <div class="item_component" v-if="item.type == 'textarea' && item.display">
            <inputTextarea :loop-item="item" />
          </div>
          <!-- string1类型 -->
          <div v-if="item.type == 'string1'">
            <!-- 第一层 -->
            <div v-for="(child1, childIndex) in item.children" :key="childIndex">
              <div style="font-size:14px;display:flex;align-items:center" class="item_component" v-if="child1.display">
                <span>{{ child1.name }}</span>
                <span style="margin-left:5px">{{ childIndex + 1 }}</span>
                <el-link style="color:#dd0000;margin-left:10px" v-if="childIndex > 0" @click="deleteItem(item, index)">删除</el-link>
              </div>
              <!-- 第二层 -->
              <div v-for="(child2, child2Index) in child1.children" :key="child2Index">
                <el-form-item v-if="child2.display">
                  <div slot="label">
                    <span v-if="child2.required" class="star">*</span>
                    <span v-if="child2.display && child2.type != 'button'">{{ child2.name }}</span>
                    <span v-if="child2.tip && child2.display">
                      <el-tooltip class="item" effect="dark" :content="child2.tip.content" placement="top-start">
                        <i class="el-icon-warning-outline"></i>
                      </el-tooltip>
                    </span>
                    <span v-if="child2.type.includes('img')">（最多上传{{ child2.length }}张图片,支持.png.jpg.svn.gif图片格式）</span>
                    <el-link style="color:#dd0000;margin-left:10px" v-if="childIndex > 0 && child2.type.includes('img')" @click="deleteItem(item, childIndex)">删除</el-link>
                  </div>
                </el-form-item>
                <!-- button类型 -->
                <div v-if="child2.type == 'button' && child2.display" class="item_component">
                  <addButton :loop-item="child2" @handlerAdd="handlerAdd(child2)" />
                </div>
                <!-- img类型 -->
                <div class="item_component" v-if="child2.type == 'img' && child2.display">
                  <imgUpload :loop-item="child2" />
                </div>
                <!-- 文本域 -->
                <div class="item_component" v-if="child2.type == 'textarea' && child2.display">
                  <inputTextarea :loop-item="child2" />
                </div>
                <!-- string1类型 -->
                <div v-if="child2.type == 'string1'">
                  <!-- 第一次循环 -->
                  <div v-for="(child3, child3Index) in child2.children" :key="child3Index">
                    <!-- 第二次循环 -->
                    <div v-for="(child4, child4Index) in child3.children" :key="child4Index" v-if="child4.display">
                      <el-form-item>
                        <div slot="label">
                          <span v-if="child4.required" class="star">*</span>
                          <span>{{ child4.name }}</span>
                          <span>{{ child3Index + 1 }}</span>
                          <span v-if="child4.tip && child4.display">
                            <el-tooltip class="item" effect="dark" :content="child4.tip.content" placement="top-start">
                              <i class="el-icon-warning-outline"></i>
                            </el-tooltip>
                          </span>
                          <span v-if="child4.type.includes('img')">（最多上传{{ child4.length }}张图片,支持.png.jpg.svn.gif图片格式）</span>
                          <el-link style="color:#dd0000;margin-left:10px" v-if="child3Index > 0 && child4.type.includes('img')" @click="deleteItem(child2, child3Index)">删除</el-link>
                        </div>
                      </el-form-item>
                      <!-- img类型 -->
                      <div class="item_component">
                        <imgUpload :loop-item="child4" v-if="child4.type == 'img'" />
                      </div>
                      <!-- 文本域 -->
                      <div class="item_component">
                        <inputTextarea :loop-item="child4" v-if="child4.type == 'textarea'" />
                      </div>
                    </div>
                  </div>
                </div>
                <!-- string1类型结束 -->
              </div>
            </div>
          </div>
          <!-- 添加按钮 -->
          <div v-if="item.type == 'button' && item.display" class="item_component">
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
import handleReport from "@/components/businessComponents/components/handleReport";
export default {
  mixins: [handleReport],
  components: {
    commonCard,
    inputTextarea,
    imgUpload,
    addButton,
    selectCommon
  },
  props: {
    lupCheckItem: {
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
      formRef: "lupCheckItemRef"
    };
  },
  watch: {
    lupCheckItem: {
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
      this.handleRegItem(this.lupCheckItem);
      this.handleHiddenOrShow(item, this.lupCheckItem);
    },
    // 添加
    handlerAdd(item) {
      this.handleAddReportItem(item, this.lupCheckItem);
    },
    // 删除
    deleteItem(item, index) {
      this.handleDeleteItem(this.lupCheckItem.nodeValue, item.id, index);
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
