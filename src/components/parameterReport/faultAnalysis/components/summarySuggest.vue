<template>
  <div>
    <commonCard :cardItem="summarySuggestItem" :formRef="formRef">
      <div v-for="(item,index) in summarySuggestItem.nodeValue" :key="index">
        <el-col :span="24">
          <!-- button类型 -->
            <div v-if="item.type=='button'">
              <addButton 
              :loop-item="item" 
              @handlerAdd="handlerAdd(item)"/>
            </div>
            <!-- string1类型 -->
            <div v-if="item.type=='string1'">
              <div v-for="(child,childInedx) in item.children" :key="childInedx">
                <div style="margin:10px 0;font-size:14px;color: #606266;display:flex;align-items:center">
                  <span>{{child.name}}</span>
                  <span>{{childInedx+1}}</span>
                  <el-link style="color:#dd0000;margin-left:10px" v-if="childInedx>1" @click="deleteItem(child)">删 除</el-link>
                  </div>
                <div v-for="(nextChild,nextChildIndex) in child.children" :key="nextChildIndex">
                  <el-form-item>
                    <div slot="label">
                      <span v-if="nextChild.required" class="star">*</span>
                      <span v-if="nextChild.display">{{ nextChild.name }}</span>
                      <span v-if="nextChild.type.includes('img')">（最多上传{{ nextChild.length }}张图片,支持.png.jpg.svn.gif图片格式）</span>
                    </div>
                    <!-- textarea类型 -->
                    <div v-if="nextChild.type == 'textarea'">
                      <inputTextarea :loop-item="nextChild"/>
                    </div>
                    <!-- img -->
                    <div v-if="nextChild.type == 'img'">
                      <imgUpload :loop-item="nextChild"/>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
        </el-col>    
      </div>
    </commonCard>
  </div>
</template>

<script>
import commonCard from '@/components/businessComponents/components/common-card'
import inputTextarea from '@/components/businessComponents/components/input-textarea'
import addButton from '@/components/businessComponents/components/add-button'
import imgUpload from '@/components/businessComponents/components/img-upload'
import { getAddItem } from '@/components/businessComponents/components/addItem'
export default {
  components:{
    commonCard,
    inputTextarea,
    addButton,
    imgUpload
  },
  props:{
    summarySuggestItem:{
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
      formRef:'summarySuggestItemRef'
    }
  },
  created(){
    
  },
  mounted(){

  },
  methods:{
    // 添加
    async handlerAdd(item){
      // 绑定的ID
      const { bindingId } = item.styleJsonDto
      // 可添加，可删除的最大，最小值
      const { rangeMax, rangeMin} = item
      // 现在要添加的数组的长度
      const nowLength = this.handlerItemLenght(bindingId)
      let addItem = {}
      if(nowLength<Number(rangeMax)){//可添加
        this.addFieldPoolDtoList.forEach(item=>{
          if(item.addToId == bindingId){
            addItem = item.currentFieldDto
          }
        })
        if(!_.isEmpty(addItem)){
          const data = await getAddItem(addItem)
           this.summarySuggestItem.nodeValue.forEach(it=>{
              if(it.id == bindingId){
                it.children.push(data)
              }
            })
        }else{
          console.log('未找到')
        }
      }else{
        this.$message({
          type:'warning',
          message:`最多添加${rangeMax}条数据`
        })
      }
    },
    // 删除
    deleteItem(item){
      console.log('删除',item)
      // 绑定的ID
      const { parentId } = item
      this.summarySuggestItem.nodeValue.forEach(it=>{
        if(it.id == parentId){
          it.children.forEach((el,idx)=>{
            if(el.id == item.id){
              it.children.splice(idx,1)
            }
          })
        }
      })
    },
    // 返回现在children数组长度
    handlerItemLenght(bindingId){
      const lg = this.summarySuggestItem.nodeValue.filter(it=>{
        return it.id == bindingId
      })[0].children.length
      return lg
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