<template>
  <div class="edit-servies-configure"  :style="mainminheight" >
          <div style="margin-top: 30px;width:100%">
            <!-- 类型封面 -->
            <span class="servies-title">类型封面</span>
            <div class="type-cover">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" v-show="currentStep==0">
                    <el-form-item prop="serviceName">
                        <div style="font-size:18px;font-weight:900"><span class="red">*</span>服务类型：<span class="colccc">字体颜色白色(25字),覆盖在封面图片上方</span> </div>
                        <el-input v-model="ruleForm.serviceName" maxlength="25" clearable :disabled="$route.query.serviceNumber" placeholder="请输入" size="small"></el-input>
                    </el-form-item>
                     <el-form-item prop="coverSubtitle">
                        <div style="font-size:18px;font-weight:900">封面副标题：<span class="colccc">字体颜色白色(25字),覆盖在封面图片上方</span> </div>
                        <el-input v-model="ruleForm.coverSubtitle"  maxlength="25" clearable placeholder="请输入" size="small"></el-input>
                    </el-form-item>
                    <el-form-item prop="serviresType">
                        <div style="font-size:18px;font-weight:900"> 服务类型封面：<span class="colccc">建议上传图片大小10M以内,宽高比例为：710*200</span> </div>
                     <el-upload
                        :class="{hide:hideCoverUpload || coverImageList.length}"
                        :action="uploadUrl"
                        list-type="picture-card"
                        limit=1
                        accept="image/*"
                        :auto-upload="false"
                        :file-list="coverImageList"
                        :before-upload="beforeAvatarUpload"
                        :on-change="handleChange"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 详细信息 -->
            <span class="servies-title">详细信息</span>
                <div class="type-cover">
                    <div style="font-size:18px;font-weight:900;line-height:40px">详情页标题：</div>
                    <el-input v-model="ruleForm.serviceName" style="margin-bottom:22px" disabled size="small"></el-input>
                    <el-form class="upload-ruleForm" v-for="(item,index) in ruleForm.itemList" :key="index" style="padding-bottom:22px;margin-bottom:30px;">
                        <el-form-item prop="backgroundUrl" v-show="!item.hide" style="border-bottom:1px dashed #999;padding-bottom:22px">
                            <div style="font-size:18px;font-weight:900"> 详情页图片：<span class="colccc">建议上传图片大小10M以内,宽为：750</span> </div>
                        <el-upload
                            :class="{hide:item.backgroundUrlList.length}"
                            :action="uploadUrl"
                            accept="image/*"
                            list-type="picture-card"
                            limit=1
                            :auto-upload="false"
                            :file-list="item.backgroundUrlList"
                            :before-upload="beforeAvatarUpload"
                            :on-change="file=>{addFileChange(file,item,fileList)}"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="file=>{removeFileChange(file,item,fileList)}">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                            <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                        <el-button type="danger" plain @click="deleteDetailPagemModel(index,item)" style="float:right;margin-top:-40px"  v-show="index>0" size="small">删除详情图</el-button>
                    </el-form-item>
                    </el-form>
                    <el-button type="danger" plain @click="addDetailPagemModel" style="float:right;z-index: 99;" size="small">新增详情图</el-button>
                </div>
                <!-- sop文件上传 -->
                <div class="type-cover-sop">
                    <el-form :model="ruleForm" ref="ruleForm1" class="demo-ruleForm">
                        <el-form-item prop="sopUrl">
                            <div style="font-size:18px;font-weight:900"><span class="red">*</span> SOP文件：<span class="colccc"></span> </div>
                                <el-upload
                                    class="upload-demo"
                                    :action="uploadUrl"
                                    accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
                                    :auto-upload="false"
                                    :before-upload="beforeSopUpload"
                                    :on-remove="handleSopRemove"
                                    :on-change="handleSopChange"
                                    :limit="2"
                                    :file-list="sopFileList">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <span slot="tip" class="el-upload__tip"> 只能上传pdf / word / excel / ppt 文件（大小10M以内）</span>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 视频上传 -->
                <div class="type-cover">
                    <el-form :model="videoForm" class="demo-ruleForm">
                        <el-form-item>
                            <div style="font-size:18px;font-weight:900">上传视频：<span class="colccc">您可以对该服务项上传小于100M的视频，支持的视频格式：mp4。显示在详情页顶端</span> </div>
                            <el-upload

                                    :action="videoUploadUrl"
                                    :headers="myHeaders"
                                    ref="upload"
                                    accept=".mp4"
                                    :auto-upload="false"
                                    :before-remove="beforeRemove"
                                    :on-remove="handleVideoRemove"
                                    :on-change="handleVideoChange"
                                    :on-success="uploadVideoSuccess"
                                    :on-error="uploadVideoError"
                                    :limit="1"
                                    :before-upload="beforUpload"
                                    :on-progress="uploadFileProcess"
                                    :file-list="videoFileList">
                                <el-button size="small" type="primary">点击上传视频</el-button>
                            </el-upload>
                            <!-- 删除视频 -->
                            <el-dialog
                                title="提示"
                                :visible.sync="deleteVideoDialogVisible"
                                width="30%"
                                :show-close="false">
                                <span>是否要删除当前视频？</span>
                                <span slot="footer" class="dialog-footer">
                                    <el-button type="danger" plain @click="deleteVideoDialogVisible = false" size="small">取 消</el-button>
                                    <el-button type="danger" @click="confirmDeleteVideo" size="small">确 定</el-button>
                                </span>
                            </el-dialog>
                            <video
                                style="width:300px;height:300px;display:none"
                                id="upvideo"
                                :src="videoRealUrl"
                            ></video>
                            <canvas id="canvasDom" height="300" width="300" style="display:none"></canvas>
                            <div>
                                <span class="colccc" v-if="uploadVideoFlag">视频上传成功，你可以继续编辑其它信息保存提交。</span>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <div style="font-size:18px;font-weight:900">视频封面:
                                <span class="colccc">
                                    <el-radio-group v-model="coverModel" :disabled="!videoFileList.length>=1">
                                        <el-radio :label="1">推荐封面</el-radio>
                                        <el-radio :label="2"><span class="red" v-if="coverModel===2">*</span>自定义封面</el-radio>
                                    </el-radio-group>
                                </span>
                            </div>
                        </el-form-item>
                        <div style="margin-top:-22px">
                            <div v-show="coverModel===1" >
                                <div style="margin:10px 0" class="colccc">系统为您截取视频第一帧作为封面图，您也可以选择上传其他图片作为封面图，图片预览</div>
                                <img class="recommended-cover" :src="videoCoverRealUrl" alt="" id="image">
                            </div>
                            <div v-show="coverModel===2" class="customer-cover">
                                <div style="margin:10px 0">建议上传750*422尺寸的图片</div>
                                <el-upload
                                    :class="{hide:hideVideoCoverUpload || customerCoverList.length}"
                                    :action="uploadUrl"
                                    list-type="picture-card"
                                    id="customerCoverId"
                                    limit=1
                                    accept="image/*"
                                    :auto-upload="false"
                                    :file-list="customerCoverList"
                                    :before-upload="beforeUploadCover"
                                    :on-change="handleCustomerCoverChange"
                                    :on-preview="handlePictureCoverCardPreview"
                                    :on-remove="handleVideoCustomerCoverRemove">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="dialogCoverVisible">
                                    <img id="coverImg" width="100%" :src="dialogCoverImageUrl" alt="">
                                </el-dialog>
                            </div>
                        </div>
                        <el-form-item v-show="videoPreUrl !== ''">
                                <div style="font-size:18px;font-weight:900">视频预览:</div>
                                <div class="parent-video">
                                    <video class="vido-content" controls="controls" :src="videoPreUrl"></video>
                                    <div class="mask">
                                        <h3 @click="deleteVideo"><i class="el-icon-delete"></i></h3>
                                    </div>
                                </div>
                        </el-form-item>
                    </el-form>
                </div>

            <!-- 经销商信息 -->
            <div class="servies-title" style="margin-top:50px;">经销商信息</div>
            <div style="margin: 30px 20px 20px;">
                <el-form ref="dealersForm" :model="dealersForm" :rules="dealersFormRules" label-width="140px" label-position="left">
                    <el-form-item label="经销商指定方式：" prop="dealersWay">
                        <el-select v-model="dealersForm.dealersWay" placeholder="请选择经销商指定方式" @change="selectDealerWay" size="small">
                            <el-option label="指定经销商" value="specified"></el-option>
                            <el-option label="默认经销商" value="default"></el-option>
                        </el-select>
                        <span class="captions"  v-if="dealersForm.dealersWay =='specified'"><i class="el-icon-info" ></i>指定经销商：客户发起该服务，仅有指定经销商能进行工单服务</span>
                        <span class="captions" v-if="dealersForm.dealersWay =='default'"><i class="el-icon-info" ></i>默认经销商：客户发起该服务，客户所属的经销商能进行工单服务</span>
                    </el-form-item>
                </el-form>
                <el-transfer
                    v-if="dealersForm.dealersWay =='specified'"
                    :titles="titles"
                    filterable
                    :button-texts="['加入左侧', '加入右侧']"
                    :props="{
                        key: 'companyNumber',
                        label: 'companyName'
                    }"
                    :filter-method="filterMethod"
                    filter-placeholder="请输入经销商名称"
                    v-model="value"
                    @change="changeData"
                    :data="generateData">
                </el-transfer>
            </div>
                <div class="foot-botton">
                    <el-button type="danger" plain @click="cancelServies" size="small">取消</el-button>
                    <el-button type="danger" @click="submitServies" size="small">提交</el-button>
                </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      value: [],
      filterMethod (query, item) {
        return item.companyName.indexOf(query) > -1
      },
      dealersForm: { // 经销商表单
        dealersWay: ''
      },
      isSpecified: false, // 穿梭框是否展示
      titles: [
        '所有经销商', '指定经销商'
      ],
      generateData: [],
      currentStep: 0,
      mainminheight: `height:${document.documentElement.clientHeight - 190}px`,
      uploadUrl: `${process.env.api}/web/config/serviceConfiguration/addServiceConfiguration`,
      videoUploadUrl: `${process.env.api}/web/config/serviceConfiguration/uploadVideo`,
      hidden: true,
      equipmentObj: {},
      coverImageList: [], // 封面图片
      backgroundUrlList: [], // 详情背景图片
      sopFileList: [], // sop文件列表
      sopFileRow: '', // sop文件流
      ruleForm: {
        itemList: [{title: '', content: '', backgroundUrlList: []}],
        coverImageBaseUrl: ''
      },
      dealersFormRules: {
        dealersWay: [
          { required: true, message: '请选择sop文件', trigger: 'change' }
        ]
      },
      rules: {
        serviceName: [
          { required: true, message: '请输入服务类型', trigger: 'blur' }
        ],
        sop: [
          { required: true, message: '请选择sop文件', trigger: 'change' }
        ]
      },
      key: 1, // table key
      imageUrl: '',
      totalNumber: 0, // 总条数
      currPageNumber: 1, // 当前页
      workStatusOptions: [], // 状态
      pagesize: 30, // 当前页展示条
      hideCoverUpload: false, // 封面图片超过1个隐藏
      dialogImageUrl: '',
      dialogVisible: false,
      coverModel: '', // 视频封面,
      uploadVideoFlag: false, // 上传视频成功标识
      videoFileList: [], // 上传视频列表
      customerCoverList: [], // 自定义视频封面列表
      videoRealUrl: '',
      videoCoverRealUrl: '',
      videoPreUrl: '',
      dialogCoverVisible: false, // 自定义视频上传封面预览
      dialogCoverImageUrl: '', // 视频自定义封面预览路径
      hideVideoCoverUpload: false, // 自定义封面超过1张隐藏
      videoCoverImageBaseUrl: '',
      hideVideoUpload: false,
      deleteVideoDialogVisible: false,
      submitVideoUrl: '', // 提交视频路径
      submitVideoImgUrl: '', // 提交封面路径
      videoCoverPicDeleteFlag: null, // 视频封面更改标识
      tempVideoCoverFlag: null, // 编辑时视频封面方式
      videoHeight: '', // 视频的高
      videoWidth: '', // 视频的宽
      videoLoading: '',
      loadingVideo: ''
    }
  },
  computed: {

  },
  methods: {
    //   获取经销商列表
    getDealerList () {
      let param = {
        serviceNumber: this.$route.query.serviceNumber
      }
      this.requestMethodGet('/web/config/serviceConfiguration/selectServiceCompany', param).then(res => {
        if (res.data.code == 1000) {
          this.generateData = res.data.data.companyDtoList
          if (res.data.data.type == '1') {
            this.dealersForm.dealersWay = 'specified'
          } else if (res.data.data.type == '0') {
            this.dealersForm.dealersWay = 'default'
          }
          this.generateData.map(item => {
            if (item.flag == '1') {
              this.value.push(item.companyNumber)
            }
          })
        }
      })
    },
    //   取消服务
    cancelServies () {
      this.$router.push({
        path: '/ServiesConfigure' // 跳转的路径
      })
    },
    // 选择经销商指定方式
    selectDealerWay (val) {
      if (val == 'default') {
        this.value = []
      }
    },
    // 选中的经销商列表
    changeData (val) {
    },
    // 提交服务
    submitServies () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (!this.sopFileRow) {
            this.$message({
              type: 'error',
              message: '请上传sop文件'
            })
            return
          }
          if (this.coverModel === 2 && this.videoCoverImageBaseUrl === '') {
            this.$message({
              type: 'error',
              message: '请上传自定义封面'
            })
            return
          }
          this.$confirm('请确认是否提交数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let itemList = []
            this.ruleForm.itemList = this.ruleForm.itemList.filter(item => {
              return !item.hide
            })
            this.ruleForm.itemList.forEach(item => {
              let obj = {}
              if (item.id) {
                obj = {
                  id: item.id || '',
                  title: item.title || '',
                  content: item.content || '',
                  backgroundImageString: item.backgroundImageBaseUrl || '',
                  picDeleteFlag: item.picDeleteFlag || item.picDeleteFlag == 0 ? item.picDeleteFlag : ''
                }
              } else {
                obj = {
                  id: '',
                  title: item.title || '',
                  content: item.content || '',
                  backgroundImageString: item.backgroundImageBaseUrl || '',
                  picDeleteFlag: ''
                }
              }
              itemList.push(obj)
            })
            // 视频提交字段
            let videoCoverList = []
            let coverObj = {}
            let customerCover = {}
            if (this.coverModel === 1) { // 推荐封面
              coverObj.videoCoverUrl = this.submitVideoImgUrl
              coverObj.videoCoverImageString = ''
              coverObj.isMaster = 1
              coverObj.isSystem = 1
              videoCoverList.push(coverObj)
            } else if (this.coverModel === 2) { // 自定义封面
              let obj = {}
              obj.videoCoverUrl = this.submitVideoImgUrl
              obj.videoCoverImageString = ''
              obj.isMaster = 0
              obj.isSystem = 1
              customerCover.videoCoverPicDeleteFlag = this.videoCoverPicDeleteFlag
              customerCover.videoCoverUrl = ''
              customerCover.videoCoverImageString = this.videoCoverImageBaseUrl
              customerCover.isMaster = 1
              customerCover.isSystem = 0
              videoCoverList.push(obj)
              videoCoverList.push(customerCover)
            }
            let param = new FormData()
            param.append('serviceName', this.ruleForm.serviceName)
            param.append('coverSubtitle', this.ruleForm.coverSubtitle || '')
            param.append('coverImageStr', this.ruleForm.coverImageBaseUrl || '')
            param.append('file', this.sopFileRow)
            param.append('itemListJsonStr', JSON.stringify(itemList))
            param.append('videoCoverListJsonStr', JSON.stringify(videoCoverList))// 视频封面
            param.append('videoUrl', this.submitVideoUrl)
            param.append('videoHeight', this.videoHeight)
            param.append('videoWidth', this.videoWidth)
            // 如果 选中的有经销商
            if (this.value.length) {
              param.append('companyNumbers', this.value)
            }
            // 编辑
            if (this.$route.query.serviceNumber) {
              param.append('picDeleteFlag', this.ruleForm.picDeleteFlag || this.ruleForm.picDeleteFlag == 0 ? this.ruleForm.picDeleteFlag : '')
              param.append('serviceNumber', this.$route.query.serviceNumber || '')
              this.requestMethodPost('/web/config/serviceConfiguration/updateServiceConfiguration', param).then(res => {
                if (res.data.code == 1000) {
                  this.$message({
                    type: 'success',
                    message: '修改成功'
                  })
                  setTimeout(() => {
                    this.$router.push({ // 核心语句
                      path: '/ServiesConfigure' // 跳转的路径
                    })
                  }, 1000)
                } else {
                  this.$message({
                    type: 'error',
                    message: res.data.msg
                  })
                }
              }).catch(err => {
                this.$message({
                  type: 'error',
                  message: '保存失败，请重新提交'
                })
              })
            } else { // 新建
              this.requestMethodPost('/web/config/serviceConfiguration/addServiceConfiguration', param).then(res => {
                if (res.data.code == 1000) {
                  this.$message({
                    type: 'success',
                    message: '保存成功'
                  })
                  setTimeout(() => {
                    this.$router.push({ // 核心语句
                      path: '/ServiesConfigure' // 跳转的路径
                    })
                  }, 1000)
                } else {
                  this.$message({
                    type: 'error',
                    message: res.data.msg
                  })
                }
              }).catch(err => {
                this.$message({
                  type: 'error',
                  message: '保存失败，请重新提交'
                })
              })
            }
          }).catch(() => {})
        }
      })
    },
    // 删除上传的视频前置
    beforeRemove () {
      this.resetVideo()
    },
    // 删除视频确认框
    confirmDeleteVideo () {

    },
    // 删除上传的视频
    handleVideoRemove () {
      this.resetVideo()
    },
    resetVideo () {
      this.videoPreUrl = ''
      this.videoCoverRealUrl = ''
      this.coverModel = ''
      this.videoFileList = []
      this.customerCoverList = []// 自定义封面
      this.dialogCoverImageUrl = ''
      this.uploadVideoFlag = false
      this.hideVideoUpload = false
      this.deleteVideoDialogVisible = false
      this.submitVideoUrl = ''
      this.submitVideoImgUrl = ''
      this.videoHeight = 0
      this.videoWidth = 0
    },
    // 上传视频变化事件
    handleVideoChange (file, fileList) {
      if (!file.raw.type.startsWith('video/mp4')) {
        fileList.pop()
        this.$message.error('只能上传mp4类型视频')
        return
      }
      const size = file.size / 1024 / 1024 < 100
      if (!size) {
        fileList.pop()
        this.$message.error('上传视频大小不能超过 100MB!')
        return
      }
      this.hideVideoUpload = true
      this.$refs.upload.submit()
    },
    beforUpload () {
      this.loadingVideo = this.$loading({
        lock: true,
        text: '视频上传中，请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    // 文件上传过程中的函数(在这里获取进度条的进度)
    uploadFileProcess (event, file, fileList) {
      if ((file.percentage > 50 && file.percentage < 100) || file.size / 1024 / 1024 < 5) {
        file.progressFlag = true
        event.percent = 90
      }
    },
    // 上传成功
    uploadVideoSuccess (response, file, fileList) {
      const data = response.data
      this.videoPreUrl = data.ossVideoUrl
      this.videoCoverRealUrl = data.videoCoverList[0].ossVideoCoverUrl
      // 提交数据时路径
      this.submitVideoUrl = data.videoUrl// 视频路径
      this.videoHeight = data.videoHeight
      this.videoWidth = data.videoWidth
      this.submitVideoImgUrl = data.videoCoverList[0].videoCoverUrl// 第一帧图片路径
      this.videoFileList = [{
        name: file.name,
        url: file.url
      }]
      this.coverModel = 1
      this.uploadVideoFlag = true
      this.loadingVideo.close()
    },
    // 上传失败
    uploadVideoError (err, file, fileList) {
      this.videoPreUrl = ''
      this.videoCoverRealUrl = ''
      this.coverModel = ''
      this.videoFileList = []
      this.uploadVideoFlag = false
      this.hideVideoUpload = false
    },
    // 删除视频
    deleteVideo () {
      this.resetVideo()
    },
    // 确认删除视频
    confirmDeleteVideo () {
      this.resetVideo()
    },
    // 自定义封面上传前置
    beforeUploadCover (file) {

    },
    // 自定义封面上传事件
    handleCustomerCoverChange (file, fileList) {
      if (!file.raw.type.startsWith('image')) {
        this.customerCoverList = []
        this.$message.error('只能上传图片类型文件')
        return
      }
      const size = file.size / 1024 / 1024 < 10
      if (!size) {
        this.customerCoverList = []
        this.$message.error('上传图片大小不能超过 10MB!')
        return
      }
      this.hideVideoCoverUpload = fileList.length >= 1
      this.customerCoverList.push({
        url: file.url
      })
      if (this.$route.query.serviceNumber) {
        this.videoCoverPicDeleteFlag = 0
      }
      var that = this
      var reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = function (e) {
        this.result // base64编码
        that.videoCoverImageBaseUrl = this.result
      }
    },
    // 自定义封面预览
    handlePictureCoverCardPreview (file) {
      this.dialogCoverImageUrl = file.url
      this.dialogCoverVisible = true
    },
    // 自定义封面删除
    handleVideoCustomerCoverRemove (file, fileList) {
      if (this.$route.query.serviceNumber) {
        this.videoCoverPicDeleteFlag = 1
      }
      this.hideVideoCoverUpload = fileList.length >= 1
      this.dialogCoverImageUrl = ''
      this.customerCoverList = []
    },
    //   下一步
    nextStep (val) {
      if (!this.ruleForm.serviceName && val == 'first') {
        this.$message({
          type: 'error',
          message: '请输入服务类型'
        })
        return
      }
      this.currentStep++
    },
    //   上一步
    preStep () {
      this.currentStep--
    },
    //   返回
    retunStep () {
      this.$router.push({ // 核心语句
        path: '/ServiesConfigure' // 跳转的路径
      })
    },
    searchTableData () {
      let param = {
        serviceNumber: this.$route.query.serviceNumber
      }
      this.requestMethodGet('/web/config/serviceConfiguration/getServiceConfigurationInfo', param).then(res => {
        if (res.data.code == 1000) {
          if (res.data.data.coverImageUrl) {
            this.coverImageList.push({
              url: res.data.data.coverImageUrl
            })
          }
          if (res.data.data.sopUrl) {
            this.sopFileRow = this.sopFileList.push({
              name: res.data.data.sopUrl.split('/')[res.data.data.sopUrl.split('/').length - 1],
              url: res.data.data.sopUrl
            })
          }
          if (res.data.data.itemList.length) {
            res.data.data.itemList.forEach(res => {
              res.backgroundUrlList = []
              if (res.backgroundUrl) {
                res.backgroundUrlList = [{ url: res.backgroundUrl}]
              }
            })
          } else {
            res.data.data.itemList = [{title: '', content: '', backgroundUrlList: []}]
          }
          // 视频区域字段赋值
          if (res.data.data.videoUrl) {
            this.videoFileList.push({
              name: res.data.data.videoUrl.split('/')[res.data.data.videoUrl.split('/').length - 1],
              url: res.data.data.videoUrl
            })
            this.uploadVideoFlag = true
            this.submitVideoUrl = res.data.data.videoUrl
          }
          if (res.data.data.videoCoverList.length !== 0) {
            this.coverModel = res.data.data.videoCoverList.length
            this.tempVideoCoverFlag = res.data.data.videoCoverList.length
            this.videoCoverRealUrl = res.data.data.videoCoverList[0].ossVideoCoverUrl
            this.submitVideoImgUrl = res.data.data.videoCoverList[0].videoCoverUrl
            if (res.data.data.videoCoverList.length === 2) { // 自定义
              this.customerCoverList.push({
                url: res.data.data.videoCoverList[1].ossVideoCoverUrl
              })
            }
          }
          if (res.data.data.ossVideoUrl) {
            this.videoPreUrl = res.data.data.ossVideoUrl
            this.hideVideoUpload = true
          }
        }
        this.ruleForm = res.data.data
      })
    },
    //   添加详情页模块
    addDetailPagemModel () {
      this.ruleForm.itemList.push({
        title: '', content: '', backgroundUrlList: []
      })
    },
    deleteDetailPagemModel (index, row) {
      row.hide = true
      this.ruleForm.itemList.splice(this.ruleForm.itemList.length, 1)
    },
    //   sop上传文件
    handleSopChange (file, fileList) {
      if (!file.raw.type.startsWith('application')) {
        fileList.pop()
        this.$message.error('只能上传pdf / word / excel / ppt 类型文件')
        return
      }
      const fileSize = file.size / 1024 / 1024 < 10
      if (!fileSize) {
        fileList.pop()
        this.$message.error('上传sop文件大小不能超过 10MB!')
        return
      }
      this.sopFileList = [{
        name: file.raw.name,
        url: file.url
      }]
      this.sopFileRow = file.raw
    },
    //   sop删除文件
    handleSopRemove (file, fileList) {
      this.sopFileList = []
      this.sopFileRow = ''
    },
    //   封面上传change事件
    handleChange (file, fileList) {
      if (!file.raw.type.startsWith('image')) {
        this.ImageList = []
        this.$message.error('只能上传图片类型文件')
        return
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.coverImageList = []
        this.$message.error('上传图片大小不能超过 10MB!')
        return
      }
      this.hideCoverUpload = fileList.length >= 1
      this.coverImageList.push({
        url: file.url
      })
      if (this.$route.query.serviceNumber) {
        this.ruleForm.picDeleteFlag = 0
      }
      var that = this
      var reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = function (e) {
        this.result // base64编码
        that.ruleForm.coverImageBaseUrl = this.result
      }
    },
    //   封面删除事件
    handleRemove (file, fileList) {
      if (this.$route.query.serviceNumber) {
        this.ruleForm.picDeleteFlag = 1
      }
      this.hideCoverUpload = fileList.length >= 1
      this.coverImageList = []
    },
    //   服务详情图片上传
    addFileChange (file, row) {
      if (!file.raw.type.startsWith('image')) {
        row.backgroundUrlList = []
        this.$message.error('只能上传图片类型文件')
        return
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        row.backgroundUrlList = []
        this.$message.error('上传图片大小不能超过 10MB!')
        return
      }
      row.backgroundUrlList.push({
        url: file.url
      })
      if (this.$route.query.serviceNumber) {
        row.picDeleteFlag = 0
      }
      var reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = function (e) {
        this.result // base64编码
        row.backgroundImageBaseUrl = this.result
      }
    },
    removeFileChange (file, row) {
      if (this.$route.query.serviceNumber) {
        row.picDeleteFlag = 1
      }
      row.backgroundImageBaseUrl = ''
      row.backgroundUrlList = []
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    onResize () {
      this.mainminheight = `height:${document.documentElement.clientHeight - 160}px`
    }
  },
  mounted () {
    if (this.$route.query.serviceNumber) {
      this.searchTableData()
      this.getDealerList() // 获取经销商列表
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .edit-servies-configure {
    position: relative;
    overflow: auto;
    padding: 0px 30px 0;
    .demo-ruleForm .el-upload--picture-card,
    .demo-ruleForm .el-upload-list--picture-card .el-upload-list__item{
      width: 100% !important;
    }
    .el-link {
      margin-right: 10px;
    }
    .el-switch__label.is-active {
      color:red;
    }
    .el-icon-info {
        font-size: 15px;
        color: #FFBF00;
        margin-right:4px;
    }
    .captions {
        background-color: rgba(255, 251, 230, 1);
        border:1px solid rgba(255, 229, 143, 1);
        padding:0 10px;
        border-radius:4px;
        display:inline-block;
        margin-left:20px;
    }
    .colccc{
        color: #999;
        font-size: 14px;
        font-weight: 400;
    }
    .red {
      color: red;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #409EFF  !important;
        border-color: #409EFF !important;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .el-transfer-panel {
        width:300px;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .hide .el-upload--picture-card {
        display: none;
    }
    .foot-botton {
        position: fixed;
        bottom:20px;
        left:16%;
    }
    .upload-ruleForm {
        padding-bottom: 0px !important;
        margin-bottom: 0px !important;
    }
    .servies-title{
        font-size: 20px;
        font-weight: 900;
    }
    .type-cover{
        width:40%;
        margin: 20px;
    }
    .type-cover-sop{
        width:40%;
        margin-top: 50px;
        margin-left: 20px;
    }
    .recommended-cover{
        width: 100%;
        height: 200px;
    }
    .customer-cover{
        color: #999;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
    }
    .vido-content{
        width: 100%;
        height: 200px;
        object-fit: fill;
    }
    .parent-video{
        display: block;
        position: relative;
    }
    .mask {
        position: absolute;
        background: rgba(245, 108, 108, 1);
        color: #ffffff;
        opacity: 0;
        top: 0;
        right: 0;
        width: 100%;
        height: 20px;
        top: 180px;
        }
        .mask h3 {
            position: absolute;
            top: -20px;
            left: 50%;
            cursor: pointer;
        }
        .parent-video:hover .mask {
            opacity: 1;
        }
        .el-upload-list__item {
            transition: none !important;
        }
  }
</style>
