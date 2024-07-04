<template>
  <div>
    <commonCard :cardItem="faultDescItem" :formRef="formRef">
      <div v-for="(item,index) in faultDescItem.nodeValue" :key="index">
        <el-col :span="24">
          <el-form-item>
            <div slot="label">
              <span v-if="item.required" class="star">*</span>
              <span v-if="item.display">{{ item.name }}</span>
               <!-- string类型 -->
               <span v-if="item.type=='string'">：</span>
               <span v-if="item.type=='string'">{{item.value}}</span>
            </div>
           
            <!-- dropdown2 -->
            <div v-if="item.type=='dropdown2'">
              <selectCommon :loop-item="item"/>
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
                      <el-link style="color:#dd0000" v-if="stringIndex>0 && stringChild.type=='textarea'" @click="deleteItem(stringItem)">删除</el-link>
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
import selectCommon from '@/components/businessComponents/components/select-common'
import { getAddItem } from '@/components/businessComponents/components/addItem'
export default {
  components:{
    commonCard,
    inputTextarea,
    imgUpload,
    addButton,
    selectCommon},
  props:{
    faultDescItem:{
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
      formRef:'faultDescItemRef'
    }
  },
  created(){
    // console.log('faultDescItem',this.faultDescItem)
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
           this.faultDescItem.nodeValue.forEach(it=>{
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
      this.faultDescItem.nodeValue.forEach(it=>{
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
      const lg = this.faultDescItem.nodeValue.filter(it=>{
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