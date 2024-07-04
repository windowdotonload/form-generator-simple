<template>
  <div>
    <commonCard :cardItem="formItem">
      <div v-for="(item,index) in formItem.nodeValue" :key="index">
        <el-col :span="item.type=='string'?6:24">
          <el-form-item>
            <div slot="label" style="display:flex;align-items:center">
              <span v-if="item.required" class="star">*</span>
              <span v-if="item.display && item.type !='tree'">{{ item.name }}</span>
              <span v-if="item.unit">({{ item.unit }})</span>
              <span v-if="item.tip" style="margin-left:5px">
                <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start">
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </span>
              <!-- string类型展示 -->
              <div  v-if="item.type == 'string'">
                <div class="item-overflow" v-if="item.value" style="margin-left:10px;">
                  <el-tooltip class="item" effect="dark" :content="item.value" placement="top-start">
                    <span>{{ item.value }}{{ item.unit }}</span>
                  </el-tooltip>
                </div>
                <div v-else>
                  <span class="no-value" v-if="item.required" :style="{color:item.required?'#dd0000':'#666'}">{{item.required?'暂无，请补充':'暂无'}}</span>
                </div>
              </div>
            </div>
            <!-- 根据type展示不同组件 -->
            <reportIndex :item="item"/>
            <!-- string1类型 -->
            <div v-if="item.type == 'string1' || item.type.includes('radio')">
              <div v-for="(child1,index1) in item.children" :key="index1">
                <div v-if="child1.display" style="display:flex;align-items:center;margin-top:15px">
                  <div>{{child1.name}} {{index1+1}}</div>
                  <!-- 删除模块 -->
                  <el-link style="color:#dd0000;margin-left:10px" v-if="item.children.length>1" @click="deleteItem(item,index1)">删除</el-link>
                </div>
                <div v-for="(child2,index2) in child1.children" :key="index2">
                  <el-form-item>
                    <div slot="label" style="display:flex;margin:20px 0">
                      <span v-if="child2.required" class="star">*</span>
                      <span v-if="child2.display">{{ child2.name }}</span>
                      <span v-if="child2.type == 'img'">（最多上传{{ child2.length }}张图片）</span>
                      <el-link style="color:#dd0000" v-if="item.children.length>1 && child2.type=='img'" @click="deleteItem(child1)">删除</el-link>
                    </div>
                   <!-- 根据type展示不同组件 -->
                  <reportIndex :item="child2"/>
                  <!-- 二次循环string1类型 -->
                  <div v-if="child2.type=='string1'">
                    <div v-for="(child2_child1,child2_child1_index) in child2.children" :key="child2_child1_index">
                      <div v-if="child2_child1.display" style="display:flex;align-items:center;margin-top:15px">
                        <div>{{child2_child1.name}} {{child2_child1_index+1}}</div>
                      </div>
                      <div v-for="(child2_child2,child2_child2_index) in child2_child1.children" :key="child2_child2_index">
                        <el-form-item>
                          <div slot="label" style="display:flex;margin:20px 0">
                            <span v-if="child2_child2.required" class="star">*</span>
                            <span >{{ child2_child2.name }}</span>
                            <span>{{child2_child1_index+1}}</span>
                            <span v-if="child2_child2.type == 'img'">（最多上传{{ child2_child2.length }}张图片）</span>
                            <!-- 删除 -->
                            <el-link style="color:#dd0000" v-if="child2.children.length>1 && nextChild.type == 'img'" @click="deleteItem(child2,child2_child1_index)">删除</el-link>
                          </div>
                        </el-form-item>
                         <!-- 根据type展示不同组件 -->
                        <reportIndex :item="child2_child2"/>
                      </div>


                    </div>
                  </div>


                  </el-form-item>
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
import cardInfo from '@/components/businessComponents/components/card-info' 
import commonCard from '@/components/businessComponents/components/common-card'
import reportIndex from '@/components/businessComponents/components/report-index'
export default {
  mixins:[],
  components:{
    cardInfo,
    commonCard,
    reportIndex
  },
  props:{
    formItem:{
      type:Object,
      default:{}
    },
    addFieldPoolDtoList:{
      type:Array,
      default:[]
    }
  },
  data(){
    return {
      
    }
  },
  watch:{
    formItem:{
      handler:function(val,oldVal){
        if(!_.isEmpty(val)){
          this.formItem = val
        }
      },
      immediate:true
    },
  },
  created(){
    console.log('========',this.formItem)
  },
  methods:{
    
  },
}
</script>

<style lang="less" scoped>
  .star {
    color: #f56c6c;
    font-size: 14px;
    margin-right: 2px;
  }
  .item-overflow{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>