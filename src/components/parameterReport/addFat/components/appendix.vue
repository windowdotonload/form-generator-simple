<template>
  <div>
    <commonCard :cardItem="appendixItem" :formRef="formRef">
      <div v-for="(item,index) in appendixItem.nodeValue" :key="index">
        <el-col :span="24">
            <!-- string1类型 -->
            <div v-if="item.type=='string1'">
              <div v-for="(child,childInedx) in item.children" :key="childInedx">
                <div style="margin:10px 0;font-size:14px;color: #606266;display:flex;align-items:center">
                  <div v-if="child.display">
                    <span>{{child.name}}</span>
                    <span v-if="childInedx>=child.rangeMin">{{childInedx+1}}</span>
                    <el-link style="color:#dd0000;display: contents;" v-if="childInedx>=child.rangeMin" @click="deleteItem(child)">删除</el-link>
                  </div>
                </div>
                <!-- <div v-for="(nextChild,nextChildIndex) in child.children" :key="nextChildIndex">
                  <el-form-item>
                    <div slot="label">
                      <span v-if="nextChild.required && nextChild.display" class="star">*</span>
                      <span v-if="nextChild.display">{{ nextChild.name }}</span>
                      <span v-if="nextChild.type == 'img'">（最多上传{{ nextChild.length }}张图片）</span>
                      <span v-if="nextChild.tip">
                        <el-tooltip class="item" effect="dark" :content="nextChild.tip.content" placement="top-start">
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </span>
                    </div>
                    <!-- 附件列表 -->
                    <!-- <el-row class="service-items-wrap" v-for="(fileItem,fileIndex) in nextChild.serviceReportFileDtoList" :key="fileIndex" style="display:flex;align-items:center;" v-if="nextChild.serviceReportFileDtoList.length">
                      <el-col :span="18">
                          <div style="color:#333;font-size:14px;line-height:14px;margin-bottom:12px;font-weight:bold;">
                              <span style="color:#dd0000;">附件{{fileIndex+1}}：</span>{{fileItem.fileName}}
                          </div>
                          <div style="color:#999999;font-size:13px;line-height:13px;">
                              <span>创建人：{{fileItem.createUserName}}</span>
                              <span style="margin-left:24px;">创建时间：{{fileItem.createTime}}</span>
                          </div>
                      </el-col>
                      <el-col :span="6" align='right'>
                          <el-button type="text" @click="previewAttachment(fileItem)" style='color:#001450;font-size:13px;'>预览</el-button>
                          <el-button type="text" @click="handleRemove(nextChild,fileItem)" style='color:#dd0000;font-size:13px;'>删除</el-button>
                      </el-col>
                    </el-row>
                   
                  </el-form-item>
                </div> --> 
               
              </div>
            </div>
             <!-- 添加附录 -->
            <div v-if="item.type=='button'">
              <addButton 
              :loop-item="item" 
              @handlerAdd="handlerAdd(item)"/>
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
import inputNumber from '@/components/businessComponents/components/input-number'
import imgUpload from '@/components/businessComponents/components/img-upload'
import fileUpload from '@/components/businessComponents/components/file-upload'
import { getAddItem } from '@/components/businessComponents/components/addItem'
import radioCommon from '@/components/businessComponents/components/radio-common'
export default {
  components:{
    commonCard,
    inputTextarea,
    addButton,
    inputNumber,
    imgUpload,
    fileUpload,
    radioCommon
  },
  props:{
    appendixItem:{
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
      formRef:'appendixItemRef',
    }
  },
  watch:{
    appendixItem:{
      handler:function(val,oldVal){
       if(!_.isEmpty(val)){
        
       }
      },
      immediate:true
    }
  },
  methods:{
    // 上传附件
    addFile(fileItem,nextChild){
      console.log('上传附件.........',fileItem,nextChild)
      const { bindingId } = fileItem
      this.appendixItem.nodeValue.forEach(it=>{
        if(it.id == bindingId){
          it.serviceReportFileDtoList.push(fileItem)
        }else if(it.children.length){
          it.children.forEach(item=>{
            if(item.id == bindingId){
              item.serviceReportFileDtoList.push(fileItem)
            }else if(item.children.length){
              item.children.forEach(file=>{
                if(file.id==bindingId){
                  file.serviceReportFileDtoList.push(fileItem)
                }
              })
            }
          })
        }
      })
      console.log('this.appendixItem.nodeValue',this.appendixItem.nodeValue)
    },
    // 预览
    previewAttachment(fileItem){
      const params = {
        url: fileItem.filePath,
      };
      this.requestMethodGet("/web/file/getFullDownloadUrl", params).then((res) => {
          if (res.data.code == 1000) {
          window.open(res.data.data);
          } else {
          this.$message({
              message: res.data.msg,
              type: "warning",
          });
          }
      });
    },
    // 删除附件
    handleRemove(child,fileItem){
      child.serviceReportFileDtoList.forEach((it,idx)=>{
        if(it.uid == fileItem.uid){
          child.serviceReportFileDtoList.splice(idx,1)
        }
      })
    },
    // 添加
    async handlerAdd(item){
      console.log('item.........',item)
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
           this.appendixItem.nodeValue.forEach(it=>{
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
      // 绑定的ID
      const { parentId } = item
      this.appendixItem.nodeValue.forEach(it=>{
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
      const lg = this.appendixItem.nodeValue.filter(it=>{
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
    // 附件样式
.service-items-wrap {
    background: rgba(204, 221, 255, 0.2);
    font-weight: 400;
    color: #999;
    border: 1px solid #ccddff;
    border-radius: 6px;
    font-size: 13px;
    padding: 16px 20px;
    margin-top:20px;
    margin-bottom: 12px;
}
</style>