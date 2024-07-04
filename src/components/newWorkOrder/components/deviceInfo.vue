<template>
  <div style="margin-top:30px;margin-left:100px">
    <el-form :model="deviceForm" ref="deviceRef" label-width="auto">
      <div v-for="(item,index) in deviceForm" :key="index">
          <el-form-item 
            :label="item.name+'：'"
            :required="item.required"
          >
          <span v-if="item.type == 'string'">{{item.value}}</span>
          <span v-if="item.type=='img'">
            <imgUpload :loop-item="item"></imgUpload>
          </span>
          <span v-if="item.type == 'string' && !item.value && item.required "  style="color:#dd0000;font-family:MicrosoftYaHei;">暂无，请补充</span>
          <span v-if="item.type == 'string' && !item.value && !item.required "  style="color:#666;font-family:MicrosoftYaHei;">暂无</span>
          </el-form-item>
      </div>
    </el-form>
    <div style="display:flex;align-items:center;">
      <!-- <div @click="handleRefresh"  style="color:#001450;font-weight:normal;font-size:13px;margin-right:20px;cursor: pointer;"><i class="el-icon-refresh-right" style="margin-right:4px;"></i>刷新数据</div> -->
      <div @click="handleEdit" style="color:#001450;font-weight:normal;font-size:13px;cursor: pointer;"><i class="el-icon-edit" style="margin-right:4px;"></i> 前往补充</div>
    </div>
    <!-- 编辑设备弹框 -->
    <CreateDevice
      v-if="addDeviceDialog"
      :deviceTypeDialog="deviceTypeDialog"
      :selectLubricationPointNumber="selectLubricationPointNumber"
      :addDeviceDialog="addDeviceDialog"
      :epInfo='epInfo'
      :resource="resource"
      v-on:addOrEditDeviceAndLumpoint="addOrEditDeviceAndLumpoint"
      v-on:closeDialogAddDevice="closeDialogAddDevice"
    />
  </div>
</template>

<script>
import CreateDevice from '../../equipment/components/CreateDevice.vue'
import imgUpload from "@/components/businessComponents/components/img-upload";
export default {
  components:{ imgUpload, CreateDevice },
  props:{
    type:{
      type:String,
      default:()=>{
        return ''
      }
    },
    saveParams:{
      type:Object,
      default:()=>{
        return []
      }
    },
    deviceObj:{
      type:Array,
      default:()=>{
        return []
      }
    }
  },
  data(){
    return{
      resource: '',
      epInfo: {},
      addDeviceDialog: false,
      deviceTypeDialog: 'editDeviceAndLumPoint',
      selectLubricationPointNumber: "",
      uploadUrl:'',
      deviceForm:this.deviceObj,
      saveParams:this.saveParams,
      imgDialogVisible:false,
      notShowUploadBtn:false,
      dialogImageUrl:'',
      tempImagePath:'',
      deviceValidate:{
        device_manufacturer:[
          { required: true, message: "请输入设备制造商", trigger: "blur" }
        ],
        device_model:[
          { required: true, message: "请输入设备型号", trigger: "blur" }
        ]
      },
    }
  },
  mounted(){
    
  },
  created(){
    this.deviceForm = this.deviceObj
    // 找出dropdown1类型
    this.deviceForm.forEach(item=>{
      if(item.type == 'dropdown1'){
        this.getDicList(item.nameKey)
      }
    })
  },
  methods:{
    // 取消编辑设备
    closeDialogAddDevice() {
      this.addDeviceDialog = false
    },  
    // 编辑设备弹框点击确定
    addOrEditDeviceAndLumpoint() {
      this.addDeviceDialog = false
      this.handleRefresh()
    },
    // 刷新数据
    handleRefresh() {
        this.$_queryEPInfo();
    },
    // 前往编辑
    async handleEdit() {
      // let routeUrl = this.$router.resolve({
      //   path: "/EquipmentProfile/EditEquipmentProfile",
      //   query: {deviceNumber:this.saveParams.deviceNumber,resource:'',lubricationPointNumber:this.saveParams.lubricationPointNumber}
      // });
      // window.open(routeUrl.href, '_blank');
      let res = await this.requestMethodGet("/web/device/queryDevice", {deviceNumber: this.saveParams.deviceNumber})
      if(res.data.code==1000){
        const data = res.data.data;
        data.createTime = this.moment(new Date(data.createTime)).format("YYYY-MM-DD");
        const date = new Date().getTime();
        if (Math.floor((date - data.createTimeMills) / 1000 / 60 / 60 / 24) == 0) {
          data.creatNew = true;
        }
        if (Math.floor((date - data.updateTimeMills) / 1000 / 60 / 60 / 24) == 0) {
          data.editNew = true;
        }
        this.epInfo = data;
      }
      this.selectLubricationPointNumber = this.saveParams.lubricationPointNumber
      this.addDeviceDialog = true
    },
     // 查询设备档案详情
    $_queryEPInfo() {
      console.log(this.deviceForm)
      let params = {
        deviceNumber:this.saveParams.deviceNumber
      };
      this.requestMethodGet("/web/device/queryDevice", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.deviceForm.filter(item=>{
              if(item.nameKey == 'device_name') {
                item.value = res.data.deviceName
              }
              if(item.nameKey == 'device_type') {
                item.value = res.data.deviceTypeName
                item.valueCode = res.data.deviceType
              }
              if(item.nameKey == 'device_manufacturer') {
                item.value = res.data.manufacturer
              }
              if(item.nameKey == 'key_device_code') {
                item.value = res.data.deviceCode
              }
              if(item.nameKey == 'key_device_position') {
                item.value = res.data.devicePosition
              }
              if(item.nameKey == 'device_model') {  // 设备型号
                item.value = res.data.deviceModel
              }
            })
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 获取dropdown1类型的dic下拉数据源
    getDicList(key){
      this.requestMethodGet("/web/common/dic/drops",{name:key}).then(res=>{
        res=res.data
        if(res.code == 1000){
          this.deviceForm.forEach(item=>{
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
    beforeAvatarUpload(file){
      // console.log('file',file)
    },
    // 上传改变
    addFileChange(file,fileList){
      if (!file.raw.type.startsWith("image")) {
        this.$message.error("只能上传图片类型文件");
        return;
      }
      if(fileList.length) {
        this.notShowUploadBtn=true
        let params = new FormData();
        params.append("fileType",'device');
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
            .catch(res => {
            });
      }
    },
    // 获取全路径赋值imgFullDtoUrl
    getFullImgPath(path){
      const params = {
          url:path
        }
        this.requestMethodGet("/web/file/getFullUrl", params).then(res=>{
          if (res.data.code == 1000) {
            this.deviceForm.forEach(item=>{
              if(item.nameKey == 'device_img'){
                item.value = path
                item.imgFullDtoUrl = []
                item.imgFullDtoUrl.push({
                  name:item.nameKey,
                  url:res.data.data
                })
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
    removeFileChange(file,fileList){
      this.notShowUploadBtn=false
      this.deviceForm.forEach(item=>{
        if(item.nameKey == 'device_img'){
          item.value = ''
          item.imgFullDtoUrl = []
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
    // 验证
    validateDevice(deviceRef){
      const data = this.deviceForm
      let valueArr = []
      const emptyList = data.filter(item=>{
        return item.required && !item.value
      })
      if(emptyList.length>0){
        this.$message({
          message:emptyList[0].name+'必填',
          type:'warning'
        })
      }else{
        this.$emit('passModulValidate')
      }
    },
  }
}
</script>

<style lang='less'>
  .noUploadBtn .el-upload--picture-card {
      display: none;
  }
  .el-upload-list__item {
    transition: none !important;
  }
</style>