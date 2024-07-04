<template>
  <div>
    <commonCard :cardItem="equipmentApplicationItem">
      <div v-for="(item,index) in equipmentApplicationItem.nodeValue" :key="index">
        <el-col :span="24">
          <el-form-item>
            <div slot="label">
              <span v-if="item.required" class="star">*</span>
              <span v-if="item.display">{{ item.name }}</span>
              <span v-if="item.unit">({{ item.unit }})</span>
              <span v-if="item.tip">
                <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start">
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </span>
            </div>
            <!-- textarea -->
            <div v-if="item.type == 'textarea'">
              <inputTextarea :loop-item="item"/>
            </div>
            <!-- string1类型 -->
            <div v-if="item.type == 'string1'">
              <div v-for="(stringItem,stringIndex) in item.children" :key="stringIndex">
                <div v-for="(stringChild,stringChildIdx) in stringItem.children" :key="stringChildIdx">
                  <el-form-item>
                    <div slot="label" style="display:flex;margin:20px 0">
                      <span v-if="stringChild.required" class="star">*</span>
                      <span>{{ stringChild.name }}</span>
                      <span style="margin:0 8px 0 3px">{{stringIndex+1}}</span>
                      <span v-if="stringChild.type == 'img'">（最多上传{{ stringChild.length }}张图片,支持.png.jpg.svn.gif图片格式）</span>
                      <el-link style="color:#dd0000" v-if="stringIndex>0 && stringChild.type=='img'" @click="deleteItem(stringItem)">删除</el-link>
                    </div>
                    <!-- 图片 -->
                    <div v-if="stringChild.type == 'img'">
                      <imgUpload :loop-item="stringChild"/>
                    </div>
                    <!-- 文本域 -->
                    <div v-if="stringChild.type == 'textarea'" >
                      <inputTextarea :loop-item="stringChild"/>
                    </div>
                  </el-form-item>
                  
                </div>
              </div>
            </div>
            <!-- 添加按钮 -->
            <div v-if="item.type == 'button'">
              <addButton 
              :loop-item="item" 
              @handlerAdd="handlerAdd(item)"/>
            </div>
            

          </el-form-item>



        </el-col>    
      </div>
    </commonCard>
  </div>
</template>

<script>
import commonCard from '@/components/businessComponents/components/common-card'
import inputTextarea from '@/components/businessComponents/components/input-textarea'
import imgUpload from '@/components/businessComponents/components/img-upload'
import addButton from '@/components/businessComponents/components/add-button'
import handleReport from '@/components/businessComponents/components/handleReport'
export default {
  mixins:[handleReport],
  components:{
    commonCard,
    inputTextarea,
    imgUpload,
    addButton},
  props:{
    equipmentApplicationItem:{
      type:Object,
      default:{}
    },
    // 添加池
    addFieldPoolDtoList:{
      type:Array,
      default:[]
    }
  },
  data(){
    return {
      
    }
  },
  created(){
    // console.log('equipmentApplicationItem',this.equipmentApplicationItem)
  },
  mounted(){

  },
  methods:{
    // 添加
    handlerAdd(item){
      this.handleAddReportItem(item,this.equipmentApplicationItem)
    },
    // 删除
    deleteItem(item){
      // 绑定的ID
      const { parentId } = item
      this.equipmentApplicationItem.nodeValue.forEach(it=>{
        if(it.id == parentId){
          it.children.forEach((el,idx)=>{
            if(el.id == item.id){
              it.children.splice(idx,1)
            }
          })
        }
      })
    },
  }
}
</script>

<style lang='less' scoped>
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
  .no-value{
    font-family:MicrosoftYaHei;
    margin-left:10px;
  }
</style>