<template>
 <el-card class="deviceInfo" style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header"  class="title">
      <el-divider direction="vertical"></el-divider>
      <span>运行情况</span>
    </div>
    <el-form :model="operationForm" ref="operationRef" label-width="auto" label-position="right" style="padding:0 20px;">
      <div v-for="(item,index) in operationForm" :key="index">
          <el-form-item :required="item.required">
            <span slot="label" v-if="item.unit">{{item.name}}{{item.unit}}：</span>
            <span slot="label" v-else>{{item.name}}：</span>
            <el-radio-group v-model="item.value" v-if="type == 'edit'">
              <el-radio v-for="(it,idx) in item.fieldOption" :label="it.value" :key="idx">{{it.option}}</el-radio>
            </el-radio-group>
            <span v-if="type == 'view'">{{item.radioValueDesc}}</span>
            <div v-if="type == 'view'&& item.type == 'img'" >
              <div v-for="(pic,index) in item.imgFullUrl" :key="index">
                <img style="width:120px" :src="pic"/>
              </div>
            </div>
            <div v-if="item.children.length>0 && item.value">
              <div class="danger-placeholder" v-for="(child,childIndex) in item.children" :key="childIndex">
                <div v-if="item.value == item.children[childIndex].valueCode">
                  <span v-if="child.required">*</span>
                  <span>{{child.name}}</span>
                  <div v-if="child.children.length>0" >
                    <div v-for="(tips,tipsIndex) in child.children" :key="tipsIndex">
                      <p class="tips-placeholder">{{tipsIndex+1}}<span style="margin:0 5px">.</span>{{tips.name}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-upload
              v-if="item.type == 'radio3' && item.value == item.children[0].valueCode && type == 'edit' && item.isUpload"
              :class="{'noUploadBtn': item.children[0].imgFullDtoUrl.length>0 || notShowUploadBtn}"
              :action="uploadUrl"
              accept="image/*" 
              list-type="picture-card"
              :limit='1'
              :auto-upload="false"
              :file-list="item.children[0].imgFullDtoUrl"
              :before-upload="beforeOperationImgUpload"
              :on-change="addFileChange.bind(null,{'data':item})"
              :on-preview="handlePictureCardPreview"
              :on-remove="removeFileChange">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="imgDialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            </el-form-item>
      </div>
    </el-form>
 </el-card>
</template>

<script>
export default {
   props:{
    type:{
      type:String,
      default:()=>{
        return ''
      }
    },
    operationObj:{
      type:Array,
      default:()=>{
        return []
      }
    },
    deviceObj:{
      type:Array,
      default:()=>{
        return []
      }
    },
    lubricationObj:{
      type:Array,
      default:()=>{
        return []
      }
    }
  },
  data(){
    return{
      operationForm:this.operationObj,
      imgDialogVisible:false,
      dialogImageUrl:'',
      uploadUrl:'',
      fileList:[],
      tempImagePath:'',
      notShowUploadBtn:false,
      dicList:[],
    }
  },
  mounted(){
    
  },
  created(){
    this.operationForm = this.operationObj
    // 是否展示上传图片
    this.operationForm.forEach(item=>{
      if(item.children && item.children.length>0){
        item.children.forEach(child=>{
          if(child.type == 'img'){
            item.isUpload = true
            if(child.imgFullDtoUrl.length>0) {
              item.notShowUploadBtn = false
            }
          }
        })
      }
    })
  },
  methods:{
    // 获取dropdown1类型的dic下拉数据源
    getDicList(key){
      this.requestMethodGet("/web/common/dic/drops",{name:key}).then(res=>{
        res=res.data
        if(res.code == 1000){
          this.operationForm.forEach(item=>{
          if(item.nameKey == key){
            item.dicList = res.data
          }
        })
        }else{
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      })
    },
    // 上传前置
    beforeOperationImgUpload(file){
    },
    // 上传
    addFileChange(obj,file,fileList){
      if (!file.raw.type.startsWith("image")) {
        this.$message.error("只能上传图片类型文件");
        return;
      }
      let isLt2M = file.size / 1024 / 1024 < 50
      if (!isLt2M) {
        obj.data.children[0].imgFullDtoUrl = [];
        this.$message.error("上传图片大小不能超过 50MB!");
        return;
      }
      if(fileList.length>0) {
        this.notShowUploadBtn = true
        let params = new FormData();
        params.append("fileType",'oil_err_img');
        params.append("multipartFiles",  file.raw);
        this.requestMethodPost("/web/file/uploadFiles", params)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.tempImagePath = res.data[0]
                this.getFullImgPath(res.data[0])
              } else {
                this.notShowUploadBtn=false
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {});
      }
    },
    // 获取全路径赋值imgFullDtoUrl
    getFullImgPath(path){
      const params = {
          url:path
        }
        this.requestMethodGet("/web/file/getFullUrl", params).then(res=>{
          if (res.data.code == 1000) {
            this.notShowUploadBtn=true
            this.operationForm.forEach(item=>{
              if(item.type == 'radio3'){
                if(item.children && item.children.length>0){
                  item.children.forEach(it=>{
                    if(it.nameKey == 'oil_err_img'){
                      it.value = path
                      it.imgFullDtoUrl = []
                      it.imgFullDtoUrl.push({
                        name:item.nameKey,
                        url:res.data.data
                      })
                    }
                  })
                }
              }
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
    },
    // 删除
    removeFileChange(){
      this.notShowUploadBtn=false
      this.operationForm.forEach(item=>{
        if(item.type == 'radio3'){
          item.children.forEach(it=>{
            if(it.nameKey == 'oil_err_img'){
              it.value = ''
              it.imgFullDtoUrl = []
              it.imgFullDtoUrl = []
            }
          })
        }
      })
    },
    // 预览
    handlePictureCardPreview(){
      const params = {
        url:this.tempImagePath
      }
      this.requestMethodGet("/web/file/getFullUrl", params).then(res=>{
        if (res.data.code == 1000) {
          this.dialogImageUrl = res.data.data
          this.imgDialogVisible = true
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      })
    },
      // dic下拉改变事件
    changeselect(val){

    },
    // 验证
    validateOperation(){
      const data = this.operationForm
      let radio5EmptyList = []
      let emptyChildList = []
      let emptyList = data.filter(item=>{
        return item.required && !item.value
      })
      // 找出radio5类型
      data.forEach(item=>{
        if(item.type == 'radio3' && item.value == '1'){
          radio5EmptyList = item.children.filter(it=>{
            return it.required && !it.value
          })
        }
      })
      emptyChildList = emptyChildList.concat(emptyList).concat(radio5EmptyList)
      if(emptyChildList.length>0){
        this.$message({
          message:emptyChildList[0].name+'必填',
          type:'warning'
        })
      }else{
        this.$emit('passModulValidate','operation')
      }
    },
  }
}
</script>

<style lang="less" scoped>
  .noUploadBtn .el-upload--picture-card {
      display: none;
  }
  .danger-placeholder{
    color: red;
  }
  .tips-placeholder{
    color: #C0C4CC;
  }
  .el-upload-list__item {
    transition: none !important;
  }
</style>