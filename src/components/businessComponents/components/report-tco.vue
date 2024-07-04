<template>
  <div>
     <el-form :ref="formRef" :model="cardItem.nodeValue" label-position="top" style="padding:0 20px;">
      <el-row>
        <div v-for="(item, index) in cardItem.nodeValue" :key="refreshKey">
          <el-col :span="item.type == 'string' ? 8 : 24">
            <el-form-item v-if="item.display || item.type == 'string1' || item.type.includes('button')">
              <div slot="label" style="display:flex;align-items:center">
                <span v-if="item.required && item.display" class="star">*</span>
                <span v-if="item.display && item.type != 'button'" :style="{ color: item.styleJsonDto && item.styleJsonDto.fontColor ? item.styleJsonDto.fontColor : '' }">{{ item.name }}</span>
                <span v-if="item.tip && item.display">
                  <el-tooltip effect="dark" :content="item.tip.content" placement="top-start">
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </span>
              </div>
              <reportIndex
                :formItem="item"
                @handleAddBlock="handleAddBlock"
                @reportAddDeviceAndLup="reportAddDeviceAndLup"
                @handleAddFile="handleAddFile"
                @selectCommonChange="selectCommonChange"
                @selectCommonVisibleChange="selectCommonVisibleChange"
              />
              <!-- children里有子项 -->
              <div v-if="item.children.length && item.type != 'tree'">
                <!-- 第一层 -->
                <div v-for="(child1, child1Index) in item.children" :key="refreshKey">
                  <el-form-item>
                    <div slot="label" style="display:flex;align-items:center" v-if="child1.display">
                      <span v-if="child1.required && child1.display" class="star">*</span>
                      <span v-if="child1.display && child1.type != 'button'">{{ child1.name }}</span>
                      <span v-if="child1.display && !child1.styleJsonDto.childIsStatic">{{ child1Index + 1 }}</span>
                      <span v-if="child1.tip">
                        <el-tooltip effect="dark" :content="child1.tip.content" placement="top-start">
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </span>
                      <el-link class="delete-link" v-if="item.children.length>0" @click="deleteItem(child1)">删除</el-link>
                    </div>
                    <reportIndex
                      v-if="child1.display"
                      :formItem="child1"
                      @handleAddBlock="handleAddBlock"
                      @handleAddFile="handleAddFile"
                      @selectCommonChange="selectCommonChange"
                      @selectCommonVisibleChange="selectCommonVisibleChange"
                    />
                    <!-- 第二层 -->
                    <div v-for="(child2, child2Index) in child1.children" :key="refreshKey" v-if="child1.name.includes('不展示') ? child1.children.length : child1.children.length && child1.display">
                      <el-form-item>
                        <div slot="label" style="display:flex;align-items:center" v-if="child2.display">
                          <span v-if="child2.required && child2.display" class="star">*</span>
                          <span v-if="child2.display && child2.type != 'button' && child2.type != 'tco'">{{ child2.name }}</span>
                          <span v-if="child2.tip">
                            <el-tooltip effect="dark" :content="child2.tip.content" placement="top-start">
                              <i class="el-icon-warning-outline"></i>
                            </el-tooltip>
                          </span>
                          <el-link class="delete-link" v-if="child2.styleJsonDto && child2.styleJsonDto.deleteIcon && child1Index + 1 > child1.rangeMin" @click="deleteItem(child1)">删除</el-link>
                        </div>
                        <reportIndex
                          v-if="child2.display"
                          :formItem="child2"
                          @handleAddBlock="handleAddBlock"
                          @handleAddFile="handleAddFile"
                          @selectCommonChange="selectCommonChange"
                          @selectCommonVisibleChange="selectCommonVisibleChange"
                        />
                        <!-- 第三层 -->
                        <div v-for="(child3, child3Index) in child2.children" :key="child3Index" v-if="child2.children.length">
                          <el-form-item>
                            <div slot="label" style="display:flex;align-items:center" v-if="child3.display">
                              <span v-if="child3.required && child3.display" class="star">*</span>
                              <span v-if="child3.display && child2.type != 'button'">{{ child3.name }}</span>
                              <span v-if="child3.tip">
                                <el-tooltip effect="dark" :content="child3.tip.content" placement="top-start">
                                  <i class="el-icon-warning-outline"></i>
                                </el-tooltip>
                              </span>
                              <el-link class="delete-link" v-if="child3.styleJsonDto && child3.styleJsonDto.deleteIcon && child2Index + 1 > child2.rangeMin" @click="deleteItem(child2)">删除</el-link>
                            </div>
                            <reportIndex
                              v-if="child3.display"
                              :formItem="child3"
                              @handleAddBlock="handleAddBlock"
                              @handleAddFile="handleAddFile"
                              @selectCommonChange="selectCommonChange"
                              @selectCommonVisibleChange="selectCommonVisibleChange"
                            />
                            <!-- 第四层 -->
                            <div v-for="(child4, child4Index) in child3.children" :key="refreshKey" v-if="child3.children.length">
                              <el-form-item>
                                <div slot="label" style="display:flex;align-items:center" v-if="child4.display">
                                  <span v-if="child4.required && child4.display" class="star">*</span>
                                  <span v-if="child4.display && child2.type != 'button'">{{ child4.name }}</span>
                                  <span v-if="child4.tip">
                                    <el-tooltip effect="dark" :content="child4.tip.content" placement="top-start">
                                      <i class="el-icon-warning-outline"></i>
                                    </el-tooltip>
                                  </span>
                                  <el-link class="delete-link" v-if="child4.styleJsonDto && child4.styleJsonDto.deleteIcon && child3Index + 1 > child3.rangeMin" @click="deleteItem(child3)"
                                    >删除</el-link
                                  >
                                </div>
                                <reportIndex
                                  v-if="child4.display"
                                  :formItem="child4"
                                  @handleAddBlock="handleAddBlock"
                                  @handleAddFile="handleAddFile"
                                  @selectCommonChange="selectCommonChange"
                                  @selectCommonVisibleChange="selectCommonVisibleChange"
                                />
                              </el-form-item>
                            </div>
                          </el-form-item>
                        </div>
                      </el-form-item>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </div>
      </el-row>
    </el-form>      
  </div>
</template>
<script>
import reportIndex from "@/components/businessComponents/components/report-index";
import handleReport from "@/components/businessComponents/components/handleReport";
export default {
   mixins: [handleReport],
  components: {
    reportIndex
  },
  props:{
    cardItem:{
      type:Object,
      default:{}
    },
    addFieldPoolDtoList: {
      type: Array,
      default: []
    },
    paramReportNode:{
      type:Array,
      default:[]
    }
  },
  data(){
    return {
      fileDtoItem: [],
      refreshKey: 1,
      selectValueCodeList:[]
    }
  },
  created(){
    
  },
   watch: {
    cardItem: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val)) {
          this.handleRegItem(val);
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods:{
    // 添加块
    handleAddBlock(blockItem) {
      if (blockItem.nodeName.includes("附录")) {
        this.selectValueCodeList = [];
        this.handleAddReportItem(blockItem, this.cardItem, true, this.selectValueCodeList);
      } else {
        this.handleAddReportItem(blockItem, this.cardItem);
      }
      this.handleRegItem(this.cardItem);
    },
    // 删除块
    deleteItem(item) {
      // 需要后端配置-删除时需要二次确认的标识
      if (item.nameKey == "key_device_lub_parent") {
        this.$confirm("是否删除该润滑点?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.deleteBlockItem(this.cardItem.nodeValue, item);
            ++this.refreshKey;
          })
          .catch(() => {});
      } else {
        this.deleteBlockItem(this.cardItem.nodeValue, item);
        ++this.refreshKey;
      }
    },
    deleteBlockItem(arr, item) {
      arr.forEach(it => {
        if (it.id == item.parentId) {
          it.children.forEach((cl, idx) => {
            if (cl.id == item.id) {
              it.children.splice(idx, 1);
            }
          });
          return;
        } else {
          if (it.children.length) {
            this.deleteBlockItem(it.children, item);
          }
        }
      });
    },
    // 上传文件
    handleAddFile(fileItem) {
      this.fileDtoItem = [];
      this.findFileDtoItem(this.cardItem.nodeValue, fileItem.bindingId);
      if (this.fileDtoItem.length > 9) {
        this.$message({
          type: "warning",
          message: "最多上传十个附件"
        });
        return;
      } else {
        this.addFileToItem(this.cardItem.nodeValue, fileItem, fileItem.bindingId);
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
    //下拉改变
    selectCommonChange(item) {
      this.handleHiddenOrShow(item, this.cardItem);
    },
    // 下拉框出现
    selectCommonVisibleChange(item) {
      if (item.nodeName.includes("附录") && item.name.includes("附录名称")) {
        let fieldOptionList = item.fieldOption;
        this.selectValueCodeList = [];
        fieldOptionList.forEach(it => {
          it.disabled = false;
        });
      }
    }
  },
}
</script>
<style lang="less" scoped>
.delete-link {
  margin-left: 10px;
  color: #dd0000;
}
.star {
  color: #f56c6c;
  font-size: 14px;
  margin-right: 2px;
}
</style>