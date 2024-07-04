<template>
  <el-card class="appendix-content" style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header" class="title">
      <div style="display:flex;align-items:center">
        <el-divider direction="vertical"></el-divider>
        <span>{{appendixNode[0].nodeName}}</span>
      </div>
    </div>
    <!-- 表单循环展示 -->
    <el-form label-position="top" label-width="120px" :model="appendixNode" ref="appendixForm">
      <div v-for="(item,index) in appendixNode" :key="index">
        <el-form-item :required="item.required">
          <span slot="label" v-if="item.nameKey">
            {{item.name}}
          </span>
          <el-select v-model="item.valueCode" placeholder="--请选择--" size="small">
            <el-option
              v-for="dic in item.fieldOption"
              :key="dic.value"
              :label="dic.option" 
              :value="dic.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 描述,附件 -->
        <el-row :gutter="10" v-if="!item.valueCodeNotDisplay.includes(item.valueCode)">
          <div v-for="(child,index1) in item.children">
            <div v-for="(nextChild,index2) in child.children">
              <el-col :span="24">
                <el-form-item>
                  <div slot="label" style="display:flex;align-items:center">
                    <span style="color: #f56c6c;font-size: 14px;margin-right: 2px;" v-if="nextChild.required">*</span>
                    <span>{{nextChild.name}}</span>
                    <span style="margin:0 8px 0 4px">{{index1+1}}</span>
                    <el-link v-if="nextChild.nameKey=='key_1363' && item.children.length>1" style="color:#dd0000;" @click="deleteItem(child)">删 除</el-link>
                  </div>
                  <el-input
                    v-if="nextChild.type == 'textarea'"
                    type="textarea"
                    placeholder="请输入"
                    v-model="nextChild.value"
                    :maxlength="nextChild.length"
                    show-word-limit
                    :autosize="autosize"
                    clearable
                    style="width:100%">
                  </el-input>
                  <!-- 附件 -->
                  <el-upload
                    v-if="nextChild.type == 'file' && !nextChild.serviceReportFileDtoList.length"
                    class="upload-demo"
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="(file)=>handleAddFile(file,child)"
                    accept=".pdf">
                    <el-button size="small">点击上传</el-button>
                  </el-upload>
                  <!-- 附件列表 -->
                  <el-row class="service-items-wrap" v-for="(fileItem,index3) in nextChild.serviceReportFileDtoList" :key="index3" style="display:flex;align-items:center;" v-if="nextChild.serviceReportFileDtoList.length">
                    <el-col :span="18">
                        <div style="color:#333;font-size:14px;line-height:14px;margin-bottom:12px;font-weight:bold;">
                            <span style="color:#dd0000;">附件{{index3+1}}：</span>{{fileItem.fileName}}
                        </div>
                        <div style="color:#999999;font-size:13px;line-height:13px;">
                            <span>创建人：{{fileItem.createUserName}}</span>
                            <span style="margin-left:24px;">创建时间：{{fileItem.createTime}}</span>
                        </div>
                    </el-col>
                    <el-col :span="6" align='right'>
                        <el-button type="text" @click="previewAttachment(fileItem)" style='color:#001450;font-size:13px;'>预览</el-button>
                        <el-button type="text" @click="handleRemove(child,fileItem)" style='color:#dd0000;font-size:13px;'>删除</el-button>
                    </el-col>
                </el-row>
                </el-form-item>      
              </el-col>
            </div>
            
          </div>
          <el-button size="small"  @click="addItem">添加</el-button>
        </el-row>
      </div>
      
      
    </el-form>
  </el-card>
</template>

<script>
import OSSClient from '../../../utils/ossClient'
const oss_client = new OSSClient();
export default {
  props:{
    // 附录节点字段
    appendixNode:{
      type:Array,
      default:()=>{
        return []
      }
    },
    addAppendixObj:{
      type:Object,
      default:()=>{
        return {}
      }
    },
  },
  data() {
    return {
      userInfo:JSON.parse(this.Decrypt(sessionStorage.getItem('userInfo')))
    };
  },
  watch:{
    // appendixNode:{
    //   handler:function(val,oldVal){
    //     let obj = {}
    //     if(val){
    //       obj = val[0]
    //       val.forEach(it=>{
    //         it.uid = _.uniqueId('appendix_')
    //       })
    //     }
    //   },
    //   deep:true,
    //   immediate:true
    // },
  },
  created(){
    if(!_.isEmpty(this.appendixNode)){
      this.appendixNode[0].children.forEach(it=>{
        it.uid = _.uniqueId('appendix_')
      })
    }
  },
  methods: {
    //  添加
    addItem(){
      const obj = _.cloneDeep(this.addAppendixObj)
      obj.uid = _.uniqueId('appendix_')
      this.appendixNode[0].children.push(obj)
      console.log('this.appendixNode',this.appendixNode)
    },
    // 删除
    deleteItem(val){
      console.log('val',val)
      this.appendixNode[0].children.forEach((it,index)=>{
        if(it.uid == val.uid){
          this.appendixNode[0].children.splice(index,1)
        }
      })
    },
    // 上传附件
    async handleAddFile(file,child){
      const fileType = file.name.split('.')[1]
      if(fileType.toLowerCase() != 'pdf'){
        this.$message({
          type:'warning',
          message:'请上传pdf文件'
        })
        return
      }else{
        console.log('上传。。。。。')
        await oss_client.getOSSClientInstance('service_report_file');
        const uploadFileRes = await oss_client.uploadFile(file.raw, file.raw.name)
        this.appendixNode[0].children.forEach((it,idx)=>{
          if(it.uid == child.uid){
            it.children.forEach(item=>{
              if(item.nameKey== "key_1364"){
                let obj = {}
                obj.fileName = file.name
                obj.filePath = uploadFileRes.name
                obj.createUserName = this.userInfo.userName
                obj.createTime = this.formatDate(new Date())
                obj.uid = _.uniqueId('file_')
                item.serviceReportFileDtoList.push(obj)
              }
            })
          }
        })
        console.log('this.appendixNode',this.appendixNode)
      }
    },
    // 删除附件
    handleRemove(child,fileItem){
      console.log(child,fileItem)
      this.appendixNode[0].children.forEach((it,idx)=>{
        if(it.uid == child.uid){
          it.children.forEach(item=>{
            if(item.nameKey== "key_1364"){
              item.serviceReportFileDtoList = []
            }
          })
        }
      })
    },
    // 预览
    previewAttachment(fileItem){
      console.log('fileItem',fileItem)
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
    // 校验附录
    validateAppendix(){
      let appendixCheck = []
      let appendixChildCheck = []
      let totalCheckList = []
      let isPass = false
      const data = this.appendixNode
      data.forEach(it=>{
        if(it.valueCode){
          if(it.valueCode != it.valueCodeNotDisplay){
            it.children.forEach(item=>{
              item.children.forEach(y=>{
                if((y.type== "textarea" && _.isEmpty(y.value)) || (y.type== "file" && _.isEmpty(y.serviceReportFileDtoList))){
                  appendixChildCheck.push(y)
                }
              })
            })
          }
        }else{
          appendixCheck.push(it)
        }
      })
      totalCheckList = appendixCheck.concat(appendixChildCheck)
      console.log('totalCheckList...........',totalCheckList)
      if(totalCheckList.length){
        this.$message({
          message: totalCheckList[0].nodeName + '-'  + totalCheckList[0].name + '必填',
          type: 'warning'
        })
      }else{
        isPass = true
      }
      return isPass
    },
  }
};
</script>
<style lang='less' scoped>
  .el-divider--vertical {
    width:3px;
  }
  .el-divider {
    background-color: #dd0000;
    position: relative;
  }
  .title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    color: #000;
    line-height: 14px;
    font-weight: bold;
  }
  /deep/.el-card__header {
    background: #f9f9f9;
  }
  /deep/ .el-form-item__content {
    width: 100%;
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