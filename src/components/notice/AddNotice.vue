<!--
* @description
* @fileName AddNotice.vue
* @author vvx
* @date 2020/09/23 17:55:23
* @version V1.0.0
!-->
<template>
  <div style="position:relative">
    <div class="return-btn"
         style="position:absolute;right:20px;height:55px;line-height:55px;top:-55px;color:red;cursor:pointer">
      <el-button type="danger"
                 plain
                 size="small"
                 @click="handleResetFrom('ruleForm')">
        <img src="../../assets/back.png"
             style="vertical-align: middle;margin-right:5px;margin-top:-2px;height:10px;height:10px" />返回
      </el-button>
    </div>
    <div class="add-notice"
         :style="mainminheight">
      <el-form :model="addData"
               :inline="true"
               ref="ruleFormProp"
               label-width="130px"
               label-position="left"
               class="add-notice-ruleForm demo-form-inline">
        <div v-for="(ruleForm, index) in addData.formArr"
             :key="index"
             style="border-bottom: solid #ccc 3px;margin-top:30px;">
          <el-row>
            <el-col :span="16">
              <el-form-item label="标题："
                            :prop="`formArr.${index}.title`"
                            :rules="rules.title">
                <el-input size="small"
                          style="width:300px;"
                          v-model="ruleForm.title"
                          maxlength="15"
                          placeholder="请输入标题"
                          show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8"
                    v-if="addData.formArr.length>1">
              <el-button type="danger"
                         plain
                         @click="deleteItem(item,index)"
                         size="small">删除</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="开始时间："
                            :prop="`formArr.${index}.startTime`"
                            :rules="rules.startTime">
                <el-date-picker style="width:300px;"
                                v-model="ruleForm.startTime"
                                type="datetime"
                                size="small"
                                placeholder="请选择"
                                value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="结束时间："
                            :prop="`formArr.${index}.endTime`"
                            :rules="rules.endTime">
                <el-date-picker style="width:300px;"
                                v-model="ruleForm.endTime"
                                type="datetime"
                                size="small"
                                placeholder="请选择"
                                value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="内容："
                            :prop="`formArr.${index}.content`"
                            :rules="rules.content">
                <el-input style="width:300px;"
                          type="textarea"
                          placeholder="请输入内容"
                          v-model="ruleForm.content"
                          maxlength="100"
                          resize="none"
                          show-word-limit
                          rows="6"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="弹框封面："
                            prop="imgType">
                <el-radio-group v-model="ruleForm.imgType"
                                @change="(e)=>radioChange(e, ruleForm)">
                  <el-radio :label="2">无封面</el-radio>
                  <el-radio :label="0">自定义图片</el-radio>
                  <el-radio :label="1">视频</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="ruleForm.imgType==0">
            <el-col :span="24">
              <el-form-item label=""
                            style="margin-left:130px;">
                <OSSUploadCombine fileType="notice_img"
                                  uploadType="image"
                                  v-model="ruleForm.imgUrl"
                                  :limit="1" />
                <div class="text-tip">上传1张图片，图片建议尺寸为590*240，大小10M以内</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="ruleForm.imgType==1">
            <el-col :span="24">
              <el-form-item label=""
                            style="margin-left:130px;">
                <OSSUploadCombine fileType="notice_img"
                                  uploadType="video"
                                  v-model="ruleForm.imgUrl" />
                <div class="text-tip">上传1条视频，视频建议尺寸590*240，大小50M以内</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="对谁可见："
                            :prop="`formArr.${index}.visible`"
                            :rules="rules.visible">
                <el-checkbox-group v-model="ruleForm.visible"
                                   @change="(e)=>visibleChange(e, ruleForm)">
                  <el-checkbox v-for="item in visibleList"
                               :key="item.code"
                               :label="item.code"
                               :disabled="((ruleForm.visible.includes('4')) && (item.code == 2 || item.code == 3)) || ((ruleForm.visible.includes('2') && ruleForm.visible.includes('3')) && item.code == 4)">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="跳转链接："
                            :prop="`formArr.${index}.jumpFlag`"
                            :rules="rules.jumpFlag">
                <el-radio-group v-model="ruleForm.jumpFlag"
                                @change="(e)=>jumpFlagChange(e,ruleForm)">
                  <el-radio :label="0">不跳转</el-radio>
                  <el-radio :label="1">MSDP内部链接</el-radio>
                  <el-radio :label="2">调研问卷</el-radio>
                  <el-radio :label="3">H5页面</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="ruleForm.jumpFlag == 1||ruleForm.jumpFlag == 2||ruleForm.jumpFlag == 3">
            <el-col :span="16">
              <el-form-item label="链接按钮文案："
                            :prop="`formArr.${index}.linkContent`"
                            :rules="rules.linkContent">
                <el-input style="width:300px;"
                          size="small"
                          v-model="ruleForm.linkContent"
                          maxlength="8"
                          show-word-limit
                          placeholder="请输入按钮文案"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="ruleForm.jumpFlag == 1">
            <el-col :span="24">
              <span class="route_span">*</span><el-form-item label="菜单路径："
                            :prop="`formArr.${index}.menuLv1`"
                            :rules="rules.menuLv11"
                            style="width:350px;display:inline-block;"
                            v-if="ruleForm.jumpFlag == 1"
                            label-width="122px">
                <el-select v-model="ruleForm.menuLv1"
                           size="small"
                           clearable
                           placeholder="请选择一级菜单"
                           @change="menuLv1Change(ruleForm)">
                  <el-option v-for="item in menuLv1List"
                             :key="item.menuCode"
                             :label="item.menuName"
                             :value="item.menuCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label=""
                            :prop="`formArr.${index}.menuLv2`"
                            :rules="rules.menuLv22"
                            style="width:220px;display:inline-block;"
                            v-if="ruleForm.jumpFlag == 1">
                <el-select v-model="ruleForm.menuLv2"
                           size="small"
                           :disabled='!ruleForm.menuLv1'
                           clearable
                           placeholder="请选择二级菜单"
                           @change="menuLv2Change">
                  <el-option v-for="item in menuLv2List"
                             :key="item.serviceId"
                             :label="item.serviceNameFull"
                             :value="item.serviceId"
                             :disabled="item.disabled">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label=""
                            :prop="`formArr.${index}.menuLv3`"
                            :rules="rules.menuLv33"
                            v-if="(ruleForm.menuLv1=='function')&&ruleForm.jumpFlag == 1"
                            style="width:220px;display:inline-block;">
                <el-select v-model="ruleForm.menuLv3"
                           size="small"
                           :disabled='!ruleForm.menuLv2'
                           clearable
                           placeholder="请选择三级菜单"
                           v-if="ruleForm.menuLv1=='function'">
                  <el-option v-for="item in menuLv3List"
                             :key="item.serviceId"
                             :label="item.serviceNameFull"
                             :value="item.serviceId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="display:flex;margin-left:130px;">
                <div class="tip">路径配置完成后，小程序上支持点击跳转到具体功能页</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="ruleForm.jumpFlag == 2">
            <el-col :span="24">
              <span class="route_span">*</span><el-form-item style="width:600px;display:inline-block;"
                            label="问卷星问卷链接："
                            :prop="`formArr.${index}.linkUrl`"
                            :rules="rules.linkUrl1"
                            label-width="122px">
                <el-input size="small"
                          v-model="ruleForm.linkUrl"
                          style="width:400px;"
                          placeholder="将问卷星调研问卷链接放在此处"></el-input>
              </el-form-item>
              <el-form-item style="display:flex;margin-left:130px;">
                <div class="tip"
                     style="margin-top:10px;">链接配置完成后，小程序上支持点击跳转到问卷填写页</div>
                <div class="tip">需要在第三方网页端进行配置，网页端地址：
                  <a href="https://survey.mobil.com.cn/corplogin.aspx"
                     target="_blank"
                     rel="noopener noreferrer">https://survey.mobil.com.cn/corplogin.aspx</a>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="ruleForm.jumpFlag == 3">
            <el-col :span="24">
              <span style="margin-right:2px;"
                    class="route_span">*</span><el-form-item style="width:600px;display:inline-block;"
                            label="URL："
                            :prop="`formArr.${index}.linkUrl`"
                            :rules="rules.linkUrl1"
                            label-width="122px">
                <el-input size="small"
                          style="width:400px;"
                          v-model="ruleForm.linkUrl"
                          placeholder="请输入URL"></el-input>
              </el-form-item>
              <el-form-item style="display:flex;margin-left:130px;">
                <div class="tip">链接配置完成后，小程序上支持点击跳转到对应的H5页面</div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <p @click="addConfig"
         style="color:#001450;"
         class="add_config"
         v-if="addData.formArr.length<5">+添加配置项</p>
      <div slot="footer"
           style="margin-bottom: 20px;">
        <el-button type="danger"
                   plain
                   @click="priviewNotice()"
                   size="small">预览</el-button>
        <el-button type="danger"
                   @click="handleSubmitForm('2')"
                   size="small">保存草稿</el-button>
        <el-button type="danger"
                   @click="handleSubmitForm('')"
                   size="small">提交</el-button>
      </div>
    </div>
    <!-- 预览弹框 -->
    <el-dialog title=""
               :visible.sync="previewVisible"
               width="30%">
      <div style="display:flex;justify-content: center;flex-direction: column;align-items: center;">
        <el-carousel height="500px"
                     :style="{width:dialogImgWidth+'px'}"
                     indicatorPosition="outside"
                     :interval="0"
                     ref="carousel">
          <el-carousel-item v-for="(item,index) in previewArr"
                            :key="index">
            <div style="display: flex;justify-content: space-between;flex-direction: column;height: 100%;">
              <!-- 标题 -->
              <div class="notice-dialog-title">{{item.title}}</div>
              <!-- 内容 -->
              <div class="notice-dialog-content">{{item.content}}</div>
              <!-- @click="viewPic(index)" -->
              <!-- :src="item.imgUrl" -->
              <el-image v-if="item.imgType==0&&item.imgUrl"
                        :src="item.fullUrl"
                        style="height:300px;display: flex;justify-content: center;"
                        fit="contain">
              </el-image>
              <video id="previewVideo"
                     style="width:100%;height:300px;"
                     v-if="item.imgType==1&&item.imgUrl"
                     :src="item.fullUrl"
                     controls="controls">您的浏览器不支持视频播放</video>
              <div class="dialog-btn-out">
                <div class="dialog-btn"
                     v-if="item.linkContent">{{item.linkContent}}</div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
        <!-- 按钮 -->
      </div>
    </el-dialog>
    <!-- 查看图片 -->
    <el-dialog :visible.sync="previewImg"
               :modal="isModal">
      <img width="100%"
           :src="previewImgUrl"
           alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 130}px`,
      previewVisible: false,
      previewArr: [],
      addData: {
        formArr: [
          {
            imgType: 2,
            imgUrl: '',
            title: '', // 标题
            startTime: '', // 开始时间
            endTime: '', // 结束时间
            content: '', // 公告内容
            visible: ["0"], // 对谁可见
            jumpFlag: 0, // 是否跳转
            linkContent: '', // 链接按钮文案
            menuLv1: '', // 一级菜单
            menuLv2: '', // 二级菜单
            menuLv3: '', // 三级菜单
            linkUrl: '' // 跳转链接
          }
        ],
      },
      // 表单验证规则
      rules: {
        title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入公告内容', trigger: 'blur' }
        ],
        visible: [
          { required: true, message: '请选择对谁可见', trigger: 'change' }
        ],
        jumpFlag: [
          { required: true, message: '请选择跳转链接', trigger: 'change' }
        ],
        linkContent: [
          { required: true, message: '请输入链接按钮文案', trigger: 'blur' }
        ],
        linkUrl: [
          { required: true, message: '请输入链接', trigger: 'blur' }
        ],
        menuLv1: [
          { required: true, message: '请选择一级菜单', trigger: 'change' }
        ],
        menuLv2: [
          { required: true, message: '请选择二级菜单', trigger: 'change' }
        ],
        menuLv3: [
          { required: true, message: '请选择三级菜单', trigger: 'change' }
        ]
      },
      // 公告新需求
      isModal: false,
      pictureList: [],
      imgDialogVisible: false,
      dialogImageUrl: '',
      menuLv1List: [{ menuCode: 'service', menuName: '服务' }, { menuCode: 'function', menuName: '功能' }, { menuCode: 'mine', menuName: '我的' }, { menuCode: 'reviewReport', menuName: '回顾报告' }],
      menuLv2List: [],
      serviceTypeList: [],
      menuLv3List: [],
      allMenu: [],
      visibleList: [],
      dialogImgWidth: null,
      previewImg: false,
      previewImgUrl: ''
    }
  },
  mounted () {
    // 获取屏幕宽度
    this.dialogImgWidth = document.documentElement.clientWidth * 0.3 - 40
  },
  created () {
    this.getMenuLevel1List()// 获取一级菜单路径
    this.getVisibleList()// 获取对谁可见
    this.getMenuLevel2List()// 获取二级菜单
  },
  methods: {
    jumpFlagChange (val, ruleForm) {
      if (val == 0) {
        ruleForm.linkContent = ''
        ruleForm.linkUrl = ''
        ruleForm.menuLv1 = ''
        ruleForm.menuLv2 = ''
        ruleForm.menuLv3 = ''
      }
      if (val == 1) {
        ruleForm.menuLv1 = ''
        ruleForm.menuLv2 = ''
        ruleForm.menuLv3 = ''
      }
      if (val == 2 || val == 3) {
        ruleForm.linkUrl = ''
      }
    },
    // 添加配置项
    addConfig () {
      this.addData.formArr.push(
        {
          imgType: 2,
          imgUrl: '',
          title: '', // 标题
          startTime: '', // 开始时间
          endTime: '', // 结束时间
          content: '', // 公告内容
          visible: ["0"], // 对谁可见
          jumpFlag: 0, // 是否跳转
          linkContent: '', // 链接按钮文案
          menuLv1: '', // 一级菜单
          menuLv2: '', // 二级菜单
          menuLv3: '', // 三级菜单
          linkUrl: '' // 跳转链接
        }
      )
    },
    menuLv1Change (ruleForm) {
      ruleForm.menuLv2 = ''
      ruleForm.menuLv3 = ''
      if (ruleForm.menuLv1 == 'service') {
        this.menuLv2List = this.serviceTypeList
      } else if (ruleForm.menuLv1 == 'function') {
        this.menuLv2List = [{ serviceId: 'businessArchives', serviceNameFull: '业务档案', disabled: false },
        { serviceId: 'servicePerformance', serviceNameFull: '服务履约', disabled: false },
        { serviceId: 'serviceTools', serviceNameFull: '润滑服务工具', disabled: false },
        { serviceId: 'utilities', serviceNameFull: '系统实用工具', disabled: false },
        { serviceId: 'other', serviceNameFull: '其他', disabled: false }]
      } else if (ruleForm.menuLv1 == 'mine') {
        this.menuLv2List = [{ serviceId: 'myTeam', serviceNameFull: '我的团队', disabled: false },
        { serviceId: 'myService', serviceNameFull: '我的服务商', disabled: false },
        { serviceId: 'qrcode', serviceNameFull: '邀请二维码管理', disabled: false },
        { serviceId: 'userHelper', serviceNameFull: '系统使用小助手', disabled: false },
        { serviceId: 'workshopView', serviceNameFull: '车间概览', disabled: false },
        { serviceId: 'clause', serviceNameFull: '隐私条款', disabled: false },
        { serviceId: 'updateLog', serviceNameFull: '版本更新日志', disabled: false },
        { serviceId: 'feedback', serviceNameFull: '意见反馈', disabled: false },
        { serviceId: 'officialAccount', serviceNameFull: '关注“美孚工业润滑油”公众号', disabled: false }]
      }else if (ruleForm.menuLv1 == 'reviewReport') {
        this.menuLv2List = [{ serviceId: 'reviewTypeDate', serviceNameFull: '阶段运营报告', disabled: false },
        { serviceId: 'reviewTypeYear', serviceNameFull: '年度数字回顾', disabled: false }]
      }
    },
    menuLv2Change (val) {
      if (val == 'businessArchives') {
        this.menuLv3List = [{ serviceId: 'customer', serviceNameFull: '客户' },
        { serviceId: 'distributor', serviceNameFull: '经销商' },
        { serviceId: 'workorder', serviceNameFull: '工单' },
        { serviceId: 'device', serviceNameFull: '设备' },
        { serviceId: 'service_apply_class', serviceNameFull: '申请单' },
        { serviceId: 'PESpackage_wechat', serviceNameFull: '服务包' },
        { serviceId: 'Task', serviceNameFull: '任务调度' },
        { serviceId: 'abnormal', serviceNameFull: '异常记录' },
        { serviceId: 'planArchives', serviceNameFull: '计划工程服务档案' },
        { serviceId: "form_application_wechat", serviceNameFull: "记录表" }
        ]
      } else if (val == 'servicePerformance') {
        this.menuLv3List = [{ serviceId: 'function_service_report', serviceNameFull: '服务报告查询' },
        { serviceId: 'function_service_info', serviceNameFull: '服务介绍' },
        { serviceId: 'customer_service_report', serviceNameFull: '客户服务年度报告' }]
      } else if (val == 'serviceTools') {
        this.menuLv3List = [{ serviceId: 'toolkit_calculate', serviceNameFull: '计算工具' },
        { serviceId: 'competition', serviceNameFull: '对标产品与相容性查询' },
        { serviceId: 'lubricationOnlineClass', serviceNameFull: '润滑知识学堂' },
        { serviceId: 'device_file', serviceNameFull: '设备资料管理' },
        { serviceId: 'my-ymf-btn', serviceNameFull: '易美孚' },
        { serviceId: 'product-manual', serviceNameFull: '产品手册' },
        { serviceId: 'lubKnowledge', serviceNameFull: '润滑常见问答' },
        { serviceId: 'caseInquiry', serviceNameFull: '客户案例查询' },
        { serviceId: 'hxLubri', serviceNameFull: '核心设备润滑油表' },
        { serviceId: "FdFormula_apply", serviceNameFull: "配方披露和常用证书申请" }
        ]
      } else if (val == 'utilities') {
        this.menuLv3List = [{ serviceId: 'function_invitate', serviceNameFull: '邀请' },
        { serviceId: 'scan_equipment', serviceNameFull: '扫描设备' },
        { serviceId: 'assistant', serviceNameFull: '系统使用小助手' },
        { serviceId: 'loginPC', serviceNameFull: '登录PC' }]
      } else if (val == 'other') {
        this.menuLv3List = [{ serviceId: 'serviceApply', serviceNameFull: '服务申请' },
        { serviceId: 'health', serviceNameFull: '健康中心' },
        { serviceId: 'todoTask', serviceNameFull: '待办中心' },
        { serviceId: 'statistic', serviceNameFull: '数据统计' }]
      }
    },
    getMenuLevel1List () {
      const params = {
        level: 1,
        menuSource: 'weChat'
      }
      this.requestMethodGet('/web/system/permission/menuManage/list', params).then(res => {
        if (res.data.code == 1000) {
          this.allMenu = res.data.data
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    getMenuLevel2List () {
      this.requestMethodGet('/notice/getMenuDropDownList', {}).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data
          data.forEach(it => {
            it.serviceId = it.menuIdLv1 + ',' + it.menuIdLv2 + ',' + it.menuIdLv3
            it.disabled = it.statusLv3 ? false : true
          })
          this.serviceTypeList = data
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    getVisibleList () {
      this.requestMethodGet('/notice/getNoticeVisitAuth', {}).then(res => {
        if (res.data.code == 1000) {
          this.visibleList = res.data.data
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    radioChange (e, ruleForm) {
    },
    // 对谁可见
    visibleChange (e, ruleForm) {
      if (ruleForm.visible.includes('4')) { // 选中PES客户去掉直供客户和经销商客户
        for (let i = 0; i < ruleForm.visible.length; i++) {
          if (ruleForm.visible[i] == 2 || ruleForm.visible[i] == 3) {
            ruleForm.visible.splice(i--, 1)
          }
        }
      }
    },
    // 添加图片
    handleAddFile (file, fileList) {
      if (!file.raw.type.startsWith('image')) {
        this.$message.error('只能上传图片类型文件')
        return
      }
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!')
        return
      }
      if (fileList.length) {
        let params = new FormData()
        params.append('fileType', 'notice_img')
        params.append('multipartFiles', file.raw)
        this.requestMethodPost('/web/file/uploadFiles', params)
          .then((res) => {
            res = res.data
            if (res.code == 1000) {
              const data = res.data[0]
              this.getFullImgPath(data)
            } else {
              this.$message({
                message: res.msg,
                type: 'warning'
              })
            }
          })
          .catch((res) => { })
      }
    },
    // 图片上传获取全路径
    getFullImgPath (path) {
      const params = {
        url: path
      }
      this.requestMethodGet('/web/file/getFullUrl', params).then((res) => {
        if (res.data.code == 1000) {
          this.pictureList.push({
            url: res.data.data,
            submitImgUrl: path
          })
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    // 提交
    handleSubmitForm (status) {
      this.$refs.ruleFormProp.validate(valid => {
        if (valid) {
          let flag = false
          try {
            this.addData.formArr.forEach((item, index) => {
              if (new Date(item.startTime).getTime() >= new Date(item.endTime).getTime()) {
                flag = true
                this.$message({
                  message: '第' + (index + 1) + '个配置项，开始时间要小于结束时间，请重新选择',
                  type: 'warning'
                })
                throw Error()
              }
              if (item.jumpFlag == 1) {
                if (item.menuLv1 == '') {
                  flag = true
                  this.$message({
                    message: '第' + (index + 1) + '个配置项，未选择一级菜单路径',
                    type: 'warning'
                  })
                  throw Error()
                } else if (item.menuLv2 == '') {
                  flag = true
                  this.$message({
                    message: '第' + (index + 1) + '个配置项，未选择二级菜单路径',
                    type: 'warning'
                  })
                  throw Error()
                } else if (item.menuLv1 == 'function' && item.menuLv3 == '') {
                  flag = true
                  this.$message({
                    message: '第' + (index + 1) + '个配置项，未选择三级菜单路径',
                    type: 'warning'
                  })
                  throw Error()
                }
              } else if (item.jumpFlag == 2 && item.linkUrl == '') {
                flag = true
                this.$message({
                  message: '第' + (index + 1) + '个配置项，请输入问卷星问卷链接',
                  type: 'warning'
                })
                throw Error()
              } else if (item.jumpFlag == 3 && item.linkUrl == '') {
                flag = true
                this.$message({
                  message: '第' + (index + 1) + '个配置项，请输入URL',
                  type: 'warning'
                })
                throw Error()
              }
            })
          } catch (error) {

          }
          if (flag) return
          this.addData.formArr.forEach((item, index) => {
            if (item.imgUrl.length > 0 && item.imgUrl[0].halfPath) {
              item.imgUrl = item.imgUrl && item.imgUrl.map(itemA => itemA.halfPath).join(",");
            }
            if (status == '2') {
              this.$set(item, 'status', '2')
            }
            if (item.jumpFlag == 0) {
              item.linkContent = ''
              item.linkUrl = ''
              item.menuLv1 = ''
              item.menuLv2 = ''
              item.menuLv3 = ''
            }
            if (item.jumpFlag == 1) {
              item.linkUrl = ''
            }
            if (item.jumpFlag == 2 || item.jumpFlag == 3) {
              item.menuLv1 = ''
              item.menuLv2 = ''
              item.menuLv3 = ''
            }
          })
          this.$confirm(`确认${status == '2' ? '保存草稿' : '提交'}？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.requestMethodPost('/web/notice/addNotice', this.addData.formArr)
                .then(res => {
                  res = res.data
                  if (res.code == 1000) {
                    this.$message({
                      message: '添加成功',
                      type: 'success'
                    })
                    this.$router.push({
                      path: '/Notice'
                    })
                  } else {
                    this.$message({
                      message: res.msg,
                      type: 'warning'
                    })
                  }
                })
                .catch(res => { })
            })
            .catch(() => { })
        } else {
          return false
        }
      })
    },
    // 预览
    priviewNotice () {
      this.previewArr = []
      this.$refs.ruleFormProp.validate(valid => {
        if (valid) {
          this.addData.formArr.forEach(async item => {
            let obj = {}
            obj.title = item.title
            obj.content = item.content
            obj.linkContent = item.linkContent
            obj.imgType = item.imgType
            if (item.imgUrl.length > 0) {
              item.fullUrl = await this.getFullpath(item.imgUrl[0].halfPath)
            }
            this.previewArr.push(item)
          })
          this.previewVisible = true
        } else {
          return false
        }
      })
    },
    async getFullpath (halfPath) {
      const res = await this.requestMethodGet("/web/file/getFullUrl", {
        url: halfPath
      });
      if (res.data.code == 1000) {
        return Promise.resolve(res.data.data);
      } else {
        this.$message({
          type: "warning",
          message: "获取全路径失败，请稍后重试。"
        });
      }
    },
    // 查看图片
    viewPic (idx) {
      const clickImg = this.pictureList.filter((it, index) => {
        return index == idx
      })
      this.previewImgUrl = clickImg[0].url
      this.previewImg = true
    },
    // 返回
    handleResetFrom (formName) {
      // this.$refs[formName].resetFields()
      this.$router.push({
        path: '/Notice'
      })
    },
    deleteItem (item, index) {
      this.addData.formArr.splice(index, 1)
    },
    onResize () {
      this.mainminheight = `height:${document.documentElement.clientHeight -
        160}px`
    }
  }
}
</script>
<style lang='less' scoped>
.route_span {
  margin: 6px 3px 0 0;
  display: inline-block;
  color: red;
}
.tip {
  color: #999;
  font-size: 13px;
}
.add_config:hover {
  cursor: pointer;
}
.text-tip {
  margin-top: 10px;
  color: rgb(153, 153, 153);
  font-size: 12px;
  line-height: 16px;
}
.add-notice {
  padding: 20px;
  height: 100%;
  overflow: auto;
  &-title {
    font-weight: bold;
    font-size: 16px;
    span {
      color: #999;
      font-weight: normal;
      font-size: 14px;
    }
  }
  .noShowImgBtn /deep/ .el-upload--picture-card {
    display: none !important;
  }
  /deep/ .el-upload-list__item {
    transition: none !important;
  }
}
.notice-dialog-title {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: center;
}
.notice-dialog-content {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}
.dialog-btn-out {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.dialog-btn {
  height: 40px;
  background-color: rgb(204, 221, 225);
  width: 130px;
  border-radius: 40px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<style>
.add-notice .el-form-item__label {
  color: #999999;
  padding: 0;
}
.add-notice .el-textarea .el-input__count {
  right: 24px;
}
.footer {
  margin-bottom: 20px;
  /* position: fixed;
  bottom: 20px;
  padding-top: 20px; */
}
.hide .el-upload--picture-card {
  display: none;
}
</style>
