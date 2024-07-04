<template>
<div style="position:relative">
  <!-- 检查任务-->
    <el-drawer
      title="检查任务"
      :visible.sync="checkTaskDrawer"
      :direction="direction"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      size="45%"
      :wrapperClosable="false"
      :before-close="cancelCheck">
      <div class="item-container">
        <!-- 设备信息 -->
        <div class="device-info-content">
          <div style="width:85%">
            <div style="display:flex;align-items:center;margin-bottom:16px;padding-top:20px">
              <div style="font-size:14px;font-weight:bold;color:#000">
                设备名称：<span style="color:#008888">{{taskDetail.deviceName}}</span>
              </div>
              <div style="font-size:14px;font-weight:bold;color:#000;margin-left:24px">
                设备类型：<span style="color:#008888">{{taskDetail.deviceTypeName}}</span>
              </div>
            </div>
            <div class="device-title">设备位置 <span class="device-val">{{taskDetail.devicePosition || '暂无'}}</span></div>
            <div class="device-title">设备编码 <span class="device-val">{{taskDetail.deviceCode || '暂无'}}</span></div>
            <div class="device-title">设备分组 <span class="device-val">{{taskDetail.deviceGroupNames || '暂无'}}</span></div>
          </div>
          <div style="flex:1"><el-button type="danger" plain size="small" @click="viewDeviceInfo">查看设备资料</el-button></div>
        </div>
        <div class="right-content">
          <div class="line"></div>
          <div class="right-title">打卡签到</div>
        </div>
        <!-- 打卡签字 -->
        <div style="margin-top:20px">
          <div>
            <div style="font-size:14px;color:#000;margin-bottom:10px">位置</div>
            <el-input v-model="signForm.punchPosition" :disabled="!isEditFlag" placeholder="请输入" size="small" clearable style="flex:1" maxlength="100" show-word-limit></el-input>
          </div>
          <div style="margin-top:20px">
            <span style="font-size:14px;color:#000">签字</span>
            <div  v-if="isEditFlag">
              <el-upload
                style="margin-top:10px;margin-left:10px"
                :class="{noShowImgUpload:hideUploadSign || signForm.imageList.length ==1}"
                :disabled="!isEditFlag"
                :action="uploadSignUrl"
                list-type="picture-card"
                limit="1"
                :file-list="signForm.imageList"
                accept=".jpg,.png"
                :auto-upload="false"
                :on-change="handleAddSign"
                :on-remove="handleRemoveSign"
                :on-preview="handlePreviewSign"
              >
                <i class="el-icon-plus" style="display: flex; align-items: center;justify-content: center;height: 100px;"></i>
              </el-upload>
              <div style="font-size:12px;color:#999;margin-top:10px">最多上传1张，规格要求：≤10M，jpg/png格式</div>
            </div>
            <div v-if="!isEditFlag && !signForm.imageList.length" style="font-size:12px;color:#999;margin-top:10px">暂无签名</div>
            <div v-if="!isEditFlag && signForm.imageList.length">
              <el-upload
                style="margin-top:10px;margin-left:10px"
                :class="{noShowImgUpload:hideUploadSign || signForm.imageList.length ==1}"
                :disabled="!isEditFlag"
                :action="uploadSignUrl"
                list-type="picture-card"
                limit="1"
                :file-list="signForm.imageList"
                accept=".jpg,.png"
                :auto-upload="false"
                :on-change="handleAddSign"
                :on-remove="handleRemoveSign"
                :on-preview="handlePreviewSign"
              >
                <i class="el-icon-plus" style="display: flex; align-items: center;justify-content: center;height: 100px;"></i>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="right-content">
          <div class="line"></div>
          <div class="right-title">执行记录</div>
        </div>
        <!-- 动态表单循环 -->
        <el-form ref="checkForm" :model="deviceCheckItemForm" style="margin-top:20px">
          <div v-for="(item,index) in taskDetail.deviceCheckItemDtos">
            <el-form-item>
              <div slot="label" style="display: flex;align-items: center;justify-content: space-between;">
                <div>
                  <span style="color:#dd0000">*</span>
                  <span style="font-weight: bold;">{{index+1}}.{{item.content}}</span>
                </div>
                <div>
                  <el-link @click="()=>viewCheckStand(item,index)">查看检查标准</el-link>
                </div>
              </div>
              
              <div v-if="item.isAbnormal && item.editFlag" style="float:right">
                <div style="display:flex;align-items:center;color:#dd0000">
                  <span style="margin-right:10px">检查项异常</span>
                  <el-link style="color:#dd0000" @click="()=>handleAbnormal(item,index)">立即处理 ></el-link></el-link>
                </div>
              </div>
              <!-- 数字区间 数值输入框-->
              <div v-if="item.checkType==1">
                <!-- <div class="item-stand">标准：{{item.digitalIntervalItem.standValues}}</div> -->
                <div class="item-stand">标准值：{{item.digitalIntervalItem.standValues}}</div>
                <el-input-number v-model="item.enterValue" :disabled="!item.editFlag" @change="handleChange" :min="-99999999" :max="9999999999"></el-input-number>
                <span>{{item.digitalIntervalItem.unitName =='无单位'?'':item.digitalIntervalItem.unitName}}</span>
              </div>
              <!-- 正常/异常 单选框-->
              <div v-if="item.checkType==2">
                <!-- <div class="item-stand">标准：{{item.abnormalItem.standValue}}</div> -->
                <div class="item-stand">标准值：正常</div>
                <el-radio-group v-model="item.enterValue" :disabled="!item.editFlag">
                  <el-radio :label="1">正常</el-radio>
                  <el-radio :label="2">异常</el-radio>
                </el-radio-group>
              </div>
              <!-- 选项 下拉值-->
              <div v-if="item.checkType==3">
                <!-- <div class="item-stand">标准：{{item.optionsItem.stand}}</div> -->
                <div class="item-stand">标准值：{{item.optionsItem.stand}}</div>
                <el-select  v-model="item.enterValue" placeholder="请选择" size="small" clearable multiple :disabled="!item.editFlag">
                  <el-option
                    v-for="item in item.optionsItem.optionValues"
                    :key="item.code"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </div>
              <!-- 数字 数值输入框-->
              <div v-if="item.checkType==4">
                <!-- <div class="item-stand">标准：{{item.digitalItem.standValues}}</div> -->
                <div class="item-stand">标准值：{{item.digitalItem.standValues}}</div>
                  <el-input-number v-model="item.enterValue" :disabled="!item.editFlag" @change="handleChangeNumber" :min="-99999999" :max="9999999999"></el-input-number>
                  <span>{{item.digitalItem.unitName=='无单位'?'':item.digitalItem.unitName}}</span>
              </div>
              <!-- 文本类型 -->
              <div v-if="item.checkType==5">
                <div class="item-stand">标准值：不限</div>
                  <el-input
                    type="textarea"
                    :disabled="!item.editFlag"
                    placeholder="请输入50字以内的字符"
                    v-model="item.enterValue"
                    maxlength="50"
                    show-word-limit>
                  </el-input>
              </div>
            </el-form-item>

            <!-- <div v-if="item.isAbnormal"> -->
              <div>
              <!-- 异常说明 -->
              <el-form-item>
                <div slot="label">
                  <!-- <span style="color:#dd0000">*</span> -->
                  <span style="color:#6c6c6c">说明</span>
                </div>
                <el-input type="textarea" placeholder="请输入" :disabled="!item.editFlag" v-model="item.description" maxlength="50" show-word-limit size="small"></el-input>
              </el-form-item>
              <!-- 现场照片 -->
              <el-form-item v-if="item.isAbnormal">
                <span style="color:#6c6c6c" slot="label">现场照片</span>
                <div style="font-size:12px;color:#999" v-if="!item.editFlag && item.imageList.length == 0">暂无照片</div>
                <el-upload
                  v-if="item.editFlag"
                  :class="{noShowImgUpload:item.imageList.length == 9}"
                  :disabled="!item.editFlag"
                  :action="uploadUrl"
                  list-type="picture-card"
                  limit="9"
                  :file-list="item.imageList"
                  accept=".jpg,.png"
                  :auto-upload="false"
                  :on-change="(file,fileList)=>handleAddFile(file,fileList,item)"
                  :on-remove="(imgItem)=>handleRemove(imgItem,item)"
                  :on-preview="handlePreview"
                >
                  <i class="el-icon-plus" style="display: flex; align-items: center;justify-content: center;height: 100px;"></i>
                </el-upload>
                <div style="font-size:12px;color:#999" v-if="item.editFlag && item.imageList.length<9">最多上传9张，规格要求：≤10M，jpg/png格式</div>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <!-- 底部按钮 -->
        <div class="bottom-bar" v-if="taskDetail.deviceId">
          <div class="op-btn save" @click="save" v-if="isEditFlag">保存</div>
          <div class="op-btn cancel" @click="cancelCheck" v-if="isEditFlag">取消</div>
        </div>
      </div>
    </el-drawer>
    <!-- 检查标准 -->
    <el-dialog
      title="检查标准"
      :visible.sync="checkStandDialog"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div>{{checkStandItem.checkStandard || '暂无检查标准'}}</div>
      <div class="img-content" v-if="checkStandItem.pictureList && checkStandItem.pictureList.length">
        <div v-for="img in checkStandItem.pictureList" :key="fit" @click="viewStandImg(img)">
          <el-image
            style="width: 100px; height: 100px;margin:10px 10px 10px 0"
            :src="img.attachmentUrl"
            fit="fit">
          </el-image>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkStandDialog = false" size="small">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 异常处理 -->
    <el-dialog
      title="异常处理"
      :visible.sync="errorDialog"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <span>发现设备异常，系统将自动生成异常记录，生成后相关检查结果将无法修改，请谨慎操作。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="errorDialog = false" size="small">取 消</el-button>
        <el-button type="danger" @click="confirmCreateError" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看设备资料 -->
    <deviceDialog :deviceId="deviceId" :deviceDialog="deviceDialogFlag" :deviceNumber="deviceNumber" v-on:cancelDeviceFile="cancelDeviceFile"> </deviceDialog>
    <!-- 图片预览 -->
    <el-dialog width="30%" :visible.sync="previewImg" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeImgPreview">
      <el-image
        style="width: 100%; height: 100%;margin-top:20px"
        :src="dialogImageUrl">
      </el-image>
    </el-dialog>
    <!-- 异常详情 -->
    <AbnormalDraw
    :openDrawFlag="openDrawFlag"
    :abnormalStatus="abnormalStatus"
    :id="abnormalId"
    v-on:refreshList="refreshList"
    v-on:closeDraw="closeDraw"
    ></AbnormalDraw>
</div>
</template>

<script>
import AbnormalDraw from "../../spotInspection/abnormalRecord/abnormalDetail";
export default {
  components: { deviceDialog: () => import("./viewDeviceInfo.vue"), AbnormalDraw },
  props: {
    checkTaskDrawer: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    todoTaskId:{
      type:Number,
      default:()=>{
        return 0
      }
    },
    deviceId:{
      type:Number,
      default:()=>{
        return 0
      }
    },
    deviceNumber: { type: String },
    isEditFlag: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data() {
    var validatorCheckItem = (rule, value, callback) => {
        callback();
      };
    return {
      openDrawFlag:false,
      abnormalStatus:0,
      deviceDialogFlag:false,
      checkStandDialog:false,
      errorDialog:false,
      taskDetail:{},
      deviceCheckItemForm:{
        enterValue:'',
      },
      userInfo:JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      hideUpload:false,
      uploadUrl:'',
      checkStandItem:{},
      checkFormRules:{
        enterValue:[{ required: true, validator: validatorCheckItem, trigger: 'change' }]
      },
      abnormalItem:'',
      uploadSignUrl:'',
      hideUploadSign:false,
      signForm:{
        punchPosition:'',
        imageList:[]
      },
      previewImg:false,
      dialogImageUrl:'',
      createAbnormalResult:''
    };
  },
  watch:{
    checkTaskDrawer:function(val,oldVal){
      if(val){
        this.getCheckDetail()
      }
    },
    'taskDetail.deviceCheckItemDtos':{
      handler:function(val,oldVal){
        if(val){
          val.forEach(it=>{
            if(it.checkType==1){//数字区间
              if(it.digitalIntervalItem.minStandValueSymbol==3 && it.digitalIntervalItem.maxStandValueSymbol==1){//>-<
                if(it.enterValue>it.digitalIntervalItem.minStandValue && it.enterValue<it.digitalIntervalItem.maxStandValue){
                  it.isAbnormal = false
                }else{
                  it.isAbnormal = true
                }
              }else if(it.digitalIntervalItem.minStandValueSymbol==3 && it.digitalIntervalItem.maxStandValueSymbol==2){//>-≤
                if(it.enterValue>it.digitalIntervalItem.minStandValue && it.enterValue<=it.digitalIntervalItem.maxStandValue){
                  it.isAbnormal = false
                }else{
                  it.isAbnormal = true
                }
              }else if(it.digitalIntervalItem.minStandValueSymbol==4 && it.digitalIntervalItem.maxStandValueSymbol==1){//≥-<
                if(it.enterValue>=it.digitalIntervalItem.minStandValue && it.enterValue<it.digitalIntervalItem.maxStandValue){
                  it.isAbnormal = false
                }else{
                  it.isAbnormal = true
                }
              }else if(it.digitalIntervalItem.minStandValueSymbol==4 && it.digitalIntervalItem.maxStandValueSymbol==2){//≥-≤
                if(it.enterValue>=it.digitalIntervalItem.minStandValue && it.enterValue<=it.digitalIntervalItem.maxStandValue){
                  it.isAbnormal = false
                }else{
                  it.isAbnormal = true
                }
              }
            }else if(it.checkType==2){//正常/异常
              if(it.enterValue>1){
                it.isAbnormal = true
              }else{
                it.isAbnormal = false
              }
            }else if(it.checkType==3){//选项
            const result = it.optionsItem.standValues.length==it.enterValue.length &&it.optionsItem.standValues.every((v,i) =>{ return v ===it.enterValue[i]})
             if(result){
                it.isAbnormal = false
              }else{
                it.isAbnormal = true
              }
            }if(it.checkType==4){//数字
              if(it.digitalItem.standValue.includes(it.enterValue.toString())){
                it.isAbnormal = false
              }else{
                it.isAbnormal = true
              }
            }
          })
        }
      },
      deep:true,
      immediate:true
    },
  },
  methods: {
    viewStandImg(img){
      this.dialogImageUrl = img.attachmentUrl
      this.previewImg = true
    },
    // 获取检查详情
    getCheckDetail(){
      const params = {
        todoTaskId:this.todoTaskId,
        deviceId:this.deviceId
      }
      this.requestMethodGet('/device/check/todoTask/checkFormDetail',params).then(res=>{
        if(res.data.code == 1000){
          const data = res.data.data
          // 位置
          this.signForm.punchPosition = data.punchPosition
          // 签字
          let arr = []
          if(data.punchSignPicture){
            data.punchSignPicture.url = data.punchSignPicture.attachmentUrl
            arr.push(data.punchSignPicture)
          }
          this.signForm.imageList = arr
          const itemList = data.deviceCheckItemDtos
          if(itemList.length){
            itemList.forEach(it=>{
              // 是否异常
              it.isAbnormal = !(_.isEmpty(it.taskDeviceAbnormal))
              // 是否可编辑
              it.editFlag = this.isEditFlag && it.editFlag
              // 异常照片
              it.imageList = (it.taskDeviceAbnormal && it.taskDeviceAbnormal.livePictureList)?it.taskDeviceAbnormal.livePictureList:[]
              if(it.taskDeviceAbnormal && it.taskDeviceAbnormal.livePictureList && it.taskDeviceAbnormal.livePictureList.length){
                it.taskDeviceAbnormal.livePictureList.forEach(img=>{
                  img.url = img.attachmentUrl
                })
              }
              if(it.checkType==1){//数字区间
                // 找出对应单位
                it.digitalIntervalItem.maxSymbol = it.digitalIntervalItem.maxStandValueSymbol==1?'<':'≤'
                it.digitalIntervalItem.minSymbol = it.digitalIntervalItem.minStandValueSymbol==3?'>':'≥'
                it.digitalIntervalItem.standValues = '标准值' + it.digitalIntervalItem.minSymbol + it.digitalIntervalItem.minStandValue + '且标准值' + it.digitalIntervalItem.maxSymbol + it.digitalIntervalItem.maxStandValue  //it.digitalIntervalItem.minStandValue + it.digitalIntervalItem.minSymbol + '标准值' + it.digitalIntervalItem.maxSymbol + it.digitalIntervalItem.maxStandValue
              }else if(it.checkType==2){//正常/异常
                it.enterValue = (it.enterValue == '正常' || it.enterValue == '')?1:2
              }else if(it.checkType==3){//选项
                it.optionsItem.stand = it.optionsItem.standValues.join(',')
                it.enterValue = it.enterValue?JSON.parse(it.enterValue):[]
              }if(it.checkType==4){//数字
                it.digitalItem.standValues = it.digitalItem.standValue.join(',')
              }
            })
          }
          this.taskDetail = data
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    // 查看检查标准
    viewCheckStand(item,index){
      this.checkStandItem = item
      this.checkStandDialog = true
    },
    // 查看设备资料
    viewDeviceInfo(){
      this.deviceDialogFlag = true
    },
    cancelDeviceFile(){
      this.deviceDialogFlag = false
    },
    // 添加图片
    handleAddFile(file,fileList,item) {
      if (!file.raw.type.startsWith("image")) {
        this.$message.error("只能上传图片类型文件");
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 10MB!");
        return;
      }
      const data = this.taskDetail.deviceCheckItemDtos
      data.forEach(it=>{
        if(it.id == item.id){
          it.imageList.push({ url: file.url})
        }
      })
      let params = new FormData();
      params.append("fileType",'device_check_item_abnormal');
      params.append("multipartFiles",file.raw);
      this.requestMethodPost("/web/file/uploadFiles", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            item.imageList.map(it=>{
              if(it.url == file.url) {
                it.attachmentHalfUrl = res.data[0]
              }
            })
            this.hideUpload = item.imageList.length == 9
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
        });
    },
    // 添加签字照片
    handleAddSign(file,fileList){
      if (!file.raw.type.startsWith("image")) {
        this.$message.error("只能上传图片类型文件");
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 10MB!");
        return;
      }
      this.signForm.imageList.push({ url: file.url})
      let params = new FormData();
      params.append("fileType",'device_check_punch_sign');
      params.append("multipartFiles",file.raw);
      this.requestMethodPost("/web/file/uploadFiles", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.signForm.imageList.map(it=>{
              if(it.url == file.url) {
                it.attachmentHalfUrl = res.data[0]
              }
            })
            this.hideUploadSign = true
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
        });
    },
    // 删除签字照片
    handleRemoveSign(item){
      this.signForm.imageList = []
      this.hideUploadSign = false
    },
    handlePreviewSign(file){
      this.dialogImageUrl = file.url
      this.previewImg = true
    },
    closeImgPreview(){
      this.previewImg = false
    },
    // 删除图片
    handleRemove(imgItem,item){
      let imgList = []
      this.taskDetail.deviceCheckItemDtos.forEach(it=>{
        if(it.id == item.id){
          it.imageList.forEach((img,idx)=>{
            if(img.uid == imgItem.uid){
              it.imageList.splice(idx,1)
            }
          })
          imgList = it.imageList
        }
        
      })
      this.hideUpload = imgList.length == 9
    },
    handlePreview(file){
      this.dialogImageUrl = file.url
      this.previewImg = true
    },
    // 创建异常
    handleAbnormal(item,index){
      if(item.enterValue === '' || item.enterValue === undefined){
        this.$message({
          type:'error',
          message:'请先填写' + item.content
        })
        return
      }
      if(!item.description){
        // this.$message({
        //   type:'error',
        //   message:'请先填写异常说明'
        // })
        // return
        item.description = '检查项目' + item.content + '异常'
      }
      this.abnormalItem = item
      this.errorDialog = true
    },
    confirmCreateError(){
      const params = {
        abnormalDesc:this.abnormalItem.description,
        companyId:this.userInfo.companyId,
        deviceId:this.taskDetail.deviceId,
        lubricationPointIds:this.abnormalItem.lubricationIds,
        checkItemId:this.abnormalItem.id,
        todoTaskId:this.todoTaskId
      }
      // 异常照片
      let data = this.taskDetail.deviceCheckItemDtos
      let imgList = []
      let attachmentHalfUrlList = []
      data.forEach(d=>{
        if(d.id == this.abnormalItem.id){
          imgList = d.imageList
        }
      })
      if(imgList.length){
        imgList.forEach(img=>{
          attachmentHalfUrlList.push(img.attachmentHalfUrl)
        })
      }
      params.pictureOssPaths  = attachmentHalfUrlList
      this.requestMethodPost('/device/check/abnormal/create',params).then(res=>{
        if(res.data.code == 1000){
          this.createAbnormalResult = res.data.data
          this.saveCheckForm()
          this.errorDialog = false
          const data = this.taskDetail.deviceCheckItemDtos
          data.forEach(it=>{
            if(it.id == this.abnormalItem.id){
              it.editFlag = false
            }
          })
          this.taskDetail.deviceCheckItemDtos = data
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    // 创建异常并保存检查项表单
    saveCheckForm(){
      const data = this.taskDetail.deviceCheckItemDtos
      let params = {}
      let numberRangeOverTenList = []
      let numberRangePointOverThree = []
      let numberOverTenList = []
      let numberPointOverThree = []
      data.forEach(it=>{
        let imgList = []
        if(it.checkType == 2){
          it.enterValue = it.enterValue == 1?'正常':'异常'
        }
        if(it.isAbnormal){//异常
          let obj = {}
          if(it.imageList.length){
            it.imageList.forEach(img=>{
              imgList.push(img.attachmentHalfUrl)
            })
          }
          obj.abnormalDesc  = it.description 
          it.pictureHalfPaths  = imgList
          if(it.taskDeviceAbnormal){
            obj.id = it.taskDeviceAbnormal.id
          }
          it.taskDeviceAbnormal = obj
        }
        // 选项类型
        if(it.checkType == 3){
          it.enterValue = (it.enterValue && it.enterValue.length)?JSON.stringify(it.enterValue):''
        }
        if(it.checkType==1){//数字区间
          if(it.enterValue && it.enterValue.length>10){
            numberRangeOverTenList.push(it)
          }
          if(this.judgePointNum(it.enterValue)){
            numberRangePointOverThree.push(it)
          }
        }
        if(it.checkType==4){//数字
          if(it.enterValue && it.enterValue.length>10){
            numberOverTenList.push(it)
          }
          // 数字区间输入值小数最多三位
          if(this.judgePointNum(it.enterValue)){
            numberPointOverThree.push(it)
          }
        }
      })
      params.createAbnormalFlag = false
      params.deviceCheckItems  = data
      params.deviceId  = this.taskDetail.deviceId 
      params.taskId  = this.todoTaskId
      params.id = this.taskDetail.id
      params.punchPosition = this.signForm.punchPosition
      params.punchSignImageHalfPath = this.signForm.imageList.length?this.signForm.imageList[0].attachmentHalfUrl:''
      this.requestMethodPost('/device/check/todoTask/saveDeviceCheckForm',params).then(res=>{
        if(res.data.code == 1000){
          this.cancelCheck()
           // 打开异常详情
          this.abnormalStatus = this.createAbnormalResult.abnormalStatus
          this.abnormalId = this.createAbnormalResult.id
          this.openDrawFlag = true
          this.$gio.executeTaskItemForm({
            operation:"任务项表单页点击保存按钮"
          })
        }else{
           const data = this.taskDetail.deviceCheckItemDtos
           data.forEach(it=>{
              if(it.checkType == 2){
                it.enterValue = it.enterValue == '正常'?1:2
              }
            })
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    // 关闭异常详情抽屉
    closeDraw(){
      this.openDrawFlag = false
    },
    refreshList(){
      this.openDrawFlag = false
    },
    // 保存
    save(){
      const data = this.taskDetail.deviceCheckItemDtos
      // let descList = []
      let params = {}
      let validateItemList = []
      data.forEach(it=>{
        if(it.isAbnormal && !it.description){
          // descList.push(it)
          it.description = '检查项目' + it.content + '异常'
        }
        if(it.enterValue === '' || it.enterValue === undefined){
          validateItemList.push(it)
        }
      })
      // if(descList.length){
      //   this.$message({
      //     type:'error',
      //     message:'请先填写异常说明'
      //   })
      //   return
      // }
      if(validateItemList.length){
        this.$message({
          type:'error',
          message:validateItemList[0].content +'必填'
        })
        return
      }
      let numberRangeOverTenList = []
      let numberRangePointOverThree = []
      let numberOverTenList = []
      let numberPointOverThree = []
      data.forEach(it=>{
        let imgList = []
        if(it.checkType == 2){
          it.enterValue = it.enterValue == 1?'正常':'异常'
        }
        // 选项类型
        if(it.checkType == 3){
          it.enterValue = (it.enterValue && it.enterValue.length)?JSON.stringify(it.enterValue):''
        }
        if(it.isAbnormal){//异常
          let obj = {}
          if(it.imageList.length){
            it.imageList.forEach(img=>{
              imgList.push(img.attachmentHalfUrl)
            })
          }
          obj.abnormalDesc  = it.description 
          it.pictureHalfPaths  = imgList
          if(it.taskDeviceAbnormal){
            obj.id = it.taskDeviceAbnormal.id
          }
          it.taskDeviceAbnormal = obj
        }
        if(it.checkType==1){//数字区间
          if(it.enterValue && it.enterValue.length>10){
            numberRangeOverTenList.push(it)
          }
          if(this.judgePointNum(it.enterValue)){
            numberRangePointOverThree.push(it)
          }
        }
        if(it.checkType==4){//数字
          if(it.enterValue && it.enterValue.length>10){
            numberOverTenList.push(it)
          }
          // 数字区间输入值小数最多三位
          if(this.judgePointNum(it.enterValue)){
            numberPointOverThree.push(it)
          }
        }
      })
      if(numberRangeOverTenList.length){
        this.$message({
          type:'warning',
          message:'数字区间最多十个字符'
        })
        return
      }
      if(numberRangePointOverThree.length){
        this.$message({
          type:'warning',
          message:'数字区间最多三位小数'
        })
        return
      }
      if(numberOverTenList.length){
        this.$message({
          type:'warning',
          message:'数字最多十个字符'
        })
        return
      }
      if(numberPointOverThree.length){
        this.$message({
          type:'warning',
          message:'数字区间最多三位小数'
        })
        return
      }
      params.createAbnormalFlag = true
      params.deviceCheckItems  = data
      params.deviceId  = this.taskDetail.deviceId 
      params.taskId  = this.todoTaskId
      params.id = this.taskDetail.id
      params.punchPosition = this.signForm.punchPosition
      params.punchSignImageHalfPath = this.signForm.imageList.length?this.signForm.imageList[0].attachmentHalfUrl:''
      console.log('params',params)
      this.requestMethodPost('/device/check/todoTask/saveDeviceCheckForm',params).then(res=>{
        if(res.data.code == 1000){
          this.$message({
            type:'success',
            message:'保存成功'
          })
          this.$gio.executeTaskItemForm({
            opetaion:"任务项表单页点击保存按钮"
          })
          this.cancelCheck()
        }else{
          const data = this.taskDetail.deviceCheckItemDtos
           data.forEach(it=>{
              if(it.checkType == 2){
                it.enterValue = it.enterValue == '正常'?1:2
              }
            })
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    judgePointNum(val){
      let flag = false
      if(val && val.toString().indexOf('.')>-1 && val.toString().split('.')[1].length>3){
        flag = true
        return flag
      }
      return flag
    },
    // 取消
    cancelCheck(){
      this.$emit('cancelCheck')
    },
  }
};
</script>
<style lang='less' scoped>
/deep/ .el-drawer__body{
  overflow-y: auto;
}
.item-container{
  height: 100%;
  margin: 20px;
  padding-bottom: 50px;
}
.device-info-content{
  display: flex;
  align-items: center;
  padding: 0px 20px;
  border: 1px solid #ccddff;
  border-radius: 6px;
  background-color: rgba(204,221,255,0.4);
}
.device-title{
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;
}
.device-val{
  color: #333;
  margin-left: 16px;
}
.img-content{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
/deep/.el-form-item{
  display: flex;
  flex-direction: column;
}
/deep/.el-form-item__label{
  text-align: left;
  color:#000
}
.item-stand{
  color: #999;
}
.noShowImgUpload /deep/ .el-upload--picture-card {
  display: none !important;
}
.bottom-bar {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  .op-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    width: 45%;
    cursor: pointer;
  }
  .save {
    color: white;
    background: #dd0000;
    border-radius: 5px;
  }
  .cancel {
    border-radius: 5px;
    background: #ffffff;
    border: 1px solid #d4d3d3;
    color: #d4d3d3;
  }
}
.right-content{
  margin-top:20px;
  display: flex;
  align-items: center;
  font-size: 14px;
}
.line{
  width: 4px;
  height: 14px;
  background-color: #dd0000;
}
.right-title{
  color: #000;
  margin-left: 10px;
  font-weight: bold;
}
/deep/.el-upload--picture-card{
  width: 100px;
  height: 100px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item{
  width: 100px;
  height: 100px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item-thumbnail{
  width: 100px;
  height: 100px;
}
</style>
