<template>
  <div style="margin-top:30px;margin-left:100px">
    <el-form :model="operationForm" ref="operationRef" label-width="auto">
      <div v-for="(item,index) in operationForm" :key="index">
          <el-form-item :required="item.required">
            <span slot="label" v-if="item.unit">{{item.name}}（{{item.unit}}）：</span>
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

            <el-input v-if="item.type == 'input2' && type == 'edit'" clearable placeholder="--请输入--" size="small" style="width:350px" :maxlength="item.length" v-model="item.value"></el-input>
            <!-- dropdown1  这种类型的下拉框调用字典接口获取下拉信息 -->
              <el-select
                v-if="type == 'edit' && item.type == 'dropdown1'"
                size="small"
                clearable
                v-model="item.value"
                placeholder="--请选择--"
                @change="changeselect(item.valueCode)"
              >
                <el-option
                  v-for="(dic,index) in item.dicList"
                  :key="dic.code"
                  :label="dic.name"
                  :value="dic.name"
                ></el-option>
              </el-select>
              <div v-if="item.children.length>0 && item.value">
                <div class="danger-placeholder" v-for="(child,childIndex) in item.children" :key="childIndex">
                  <div v-if="item.value == item.children[childIndex].valueCode">
                    <span >{{child.name}}</span>
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
              :class="{'noUploadBtn': item.imgFullDtoUrl.length>0 || notShowUploadBtn}"
              :action="uploadUrl"
              accept="image/*" 
              list-type="picture-card"
              :limit=1
              :auto-upload="false"
              :file-list="item.imgFullDtoUrl"
              :before-upload="beforeOperationImgUpload"
              :on-change="addFileChange"
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
  </div>
</template>

<script>
import validateForm from "@/components/businessComponents/components/validateForm";
export default {
  mixins: [validateForm],
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
      operationForm:[],
      imgDialogVisible:false,
      dialogImageUrl:'',
      uploadUrl:'',
      fileList:[],
      tempImagePath:'',
      notShowUploadBtn:false,
      dicList:[]
    }
  },
  mounted(){
    
  },
  created(){
    // 找到润滑点信息中的润滑方式
    let lubricatType = ''
    let dataList = []
    //设备信息中是否有润滑点设备细分选项
    let is_lup_device_detail_value = ''
    this.deviceObj.forEach(item=>{
      if(item.nameKey == 'lup_device_detail'){
        is_lup_device_detail_value = item.value
      }
    })
    if(is_lup_device_detail_value){
      this.operationObj.forEach(it=>{
        if(it.valueCode == is_lup_device_detail_value){
          dataList = it.children
        }
      })
    }else{
      this.lubricationObj.forEach(item=>{
        if(item.nameKey == 'lup_method' && item.valueCode && item.valueCode.indexOf('lubrication')==-1){
          lubricatType = item.valueCode
        }
      })
      if(lubricatType){
        const data = this.operationObj.filter(it=>{
          return it.valueCode == lubricatType
        })
        dataList = data[0].children
      }else{
        dataList = this.operationObj
      }
    }
    this.operationForm = dataList
    // 找出dropdown1类型
    this.operationForm.forEach(item=>{
      if(item.type == 'dropdown1'){
        this.getDicList(item.nameKey)
      }
    })
    // 是否展示上传图片
    this.operationForm.forEach(item=>{
      if(item.children && item.children.length>0){
        item.children.forEach(child=>{
          if(child.type == 'img'){
            item.isUpload = true
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
    beforeOperationImgUpload(){

    },
    // 上传
    addFileChange(file,fileList){
      if (!file.raw.type.startsWith("image")) {
        this.$message.error("只能上传图片类型文件");
        return;
      }
      if(fileList.length) {
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
                      item.imgFullDtoUrl = []
                      item.imgFullDtoUrl.push({
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
              item.imgFullDtoUrl = []
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
    childMethod(){
      const flag = this.validateFormItem(this.operationForm,false)
      if(!flag) return
      this.$emit('passModulValidate')
    },
  }
}
</script>

<style lang="less" scoped>
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
