<!--
* @description
* @fileName AddNotice.vue
* @author vvx
* @date 2020/09/23 17:55:23
* @version V1.0.0
!-->
<template>
  <div style="position:relative">
    <div class="return-btn" style="position:absolute;right:20px;height:55px;line-height:55px;top:-55px;color:red;cursor:pointer">
      <el-button type="danger" plain size="small" @click="handleResetFrom('ruleForm')">
        <img src="../../assets/back.png" style="vertical-align: middle;margin-right:5px;margin-top:-2px;height:10px;height:10px" />返回
      </el-button>
    </div>
    <div class="add-notice" :style="mainminheight">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" label-position="left" class="add-notice-ruleForm" style="margin-bottom:100px">
        <el-row>
          <el-col :span="16">
            <el-form-item label="标题：" prop="title">
              <el-input size="small" v-model="ruleForm.title" maxlength="15" show-word-limit placeholder="请输入公告标题" style="width:40%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="开始时间：" prop="startTime">
              <el-date-picker
                v-model="ruleForm.startTime"
                type="datetime"
                size="small"
                placeholder="请选择"
                :picker-options="pickerOptionsStart"
                style="width:40%;"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="结束时间：" prop="endTime">
              <el-date-picker
                v-model="ruleForm.endTime"
                type="datetime"
                size="small"
                placeholder="请选择"
                :picker-options="pickerOptionsEnd"
                style="width:40%;"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="内容：" prop="content">
              <el-input type="textarea" placeholder="请输入公告内容" v-model="ruleForm.content" maxlength="100" resize="none" show-word-limit rows="6"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="弹框封面：" prop="imgType">
              <el-radio-group v-model="ruleForm.imgType" @change="radioChange">
                <el-radio :label="2">无封面</el-radio>
                <el-radio :label="0">自定义图片</el-radio>
                <el-radio :label="1">视频</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="ruleForm.imgType == 0">
          <el-col :span="24">
            <el-form-item label="">
              <OSSUploadCombine fileType="notice_img" uploadType="image" v-model="upload.imgUrl" :limit="1" />
              <div class="text-tip">上传1张图片，图片建议尺寸为590*240，大小10M以内</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="ruleForm.imgType == 1">
          <el-col :span="24">
            <el-form-item label="">
              <OSSUploadCombine fileType="notice_img" uploadType="video" v-model="upload.videoUrl" />
              <div class="text-tip">上传1条视频，视频建议尺寸590*240，大小50M以内</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="对谁可见：" prop="visible">
              <el-checkbox-group v-model="ruleForm.visible" @change="visibleChange">
                <el-checkbox
                  v-for="item in visibleList"
                  :key="item.code"
                  :label="item.code"
                  :disabled="(disabledCheckBoxFlag && (item.code == 2 || item.code == 3)) || (disabledCheckDirectFlag && item.code == 4)"
                  >{{ item.name }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="跳转链接：" prop="jumpFlag">
              <el-radio-group v-model="ruleForm.jumpFlag" @change="jumpFlagChange">
                <el-radio :label="0">不跳转</el-radio>
                <el-radio :label="1">MSDP内部链接</el-radio>
                <el-radio :label="2">调研问卷</el-radio>
                <el-radio :label="3">H5页面</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ruleForm.jumpFlag == 1 || ruleForm.jumpFlag == 2 || ruleForm.jumpFlag == 3">
          <el-col :span="16">
            <el-form-item label="链接按钮文案：" prop="linkContent">
              <el-input size="small" v-model="ruleForm.linkContent" maxlength="8" show-word-limit placeholder="请输入按钮文案" style="width:40%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ruleForm.jumpFlag == 1">
          <el-col :span="16">
            <span class="route_span">*</span
            ><el-form-item label="菜单路径：" style="width:790px;display:inline-block;" label-width="122px">
              <el-select v-model="ruleForm.menuLv1" size="small" clearable placeholder="请选择一级菜单" @change="menuLv1Change">
                <el-option v-for="item in menuLv1List" :key="item.menuCode" :label="item.menuName" :value="item.menuCode"> </el-option>
              </el-select>
              <el-select v-model="ruleForm.menuLv2" size="small" :disabled="!ruleForm.menuLv1" clearable placeholder="请选择二级菜单" @change="menuLv2Change">
                <el-option v-for="item in menuLv2List" :key="item.serviceId" :label="item.serviceNameFull" :value="item.serviceId" :disabled="item.disabled"> </el-option>
              </el-select>
              <el-select v-model="ruleForm.menuLv3" size="small" :disabled="!ruleForm.menuLv2" clearable placeholder="请选择三级菜单" v-if="ruleForm.menuLv1 == 'function'" @change="change3">
                <el-option v-for="item in menuLv3List" :key="item.serviceId" :label="item.serviceNameFull" :value="item.serviceId"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="tip">路径配置完成后，小程序上支持点击跳转到具体功能页</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ruleForm.jumpFlag == 2">
          <el-col :span="16">
            <span class="route_span">*</span
            ><el-form-item label="问卷星问卷链接：" style="display:inline-block;" label-width="122px">
              <el-input size="small" v-model="ruleForm.linkUrl" placeholder="将问卷星调研问卷链接放在此处" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="tip" style="margin-top:10px;">链接配置完成后，小程序上支持点击跳转到问卷填写页</div>
              <div class="tip">
                需要在第三方网页端进行配置，网页端地址：
                <a href="https://survey.mobil.com.cn/corplogin.aspx" target="_blank" rel="noopener noreferrer">https://survey.mobil.com.cn/corplogin.aspx</a>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ruleForm.jumpFlag == 3">
          <el-col :span="16">
            <span style="margin-right:2px;" class="route_span">*</span
            ><el-form-item label="URL：" style="display:inline-block;" label-width="122px">
              <el-input size="small" v-model="ruleForm.linkUrl" placeholder="请输入URL" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="tip">链接配置完成后，小程序上支持点击跳转到对应的H5页面</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="footer">
        <el-button type="danger" plain @click="priviewNotice('ruleForm')" size="small">预览</el-button>
        <el-button type="danger" size="small" @click="handleSaveDraft('ruleForm')" v-show="ruleForm.state == 'published' || ruleForm.state == 'draft'">保存草稿</el-button>
        <el-button type="danger" @click="handleSubmitForm('ruleForm')" size="small">提交</el-button>
      </div>
    </div>
    <!-- 预览弹框 -->
    <el-dialog title="" :visible.sync="previewVisible" @close="closePreviewvideo" width="30%">
      <div style="display:flex;justify-content: space-between;flex-direction: column;align-items: center;height:500px;">
        <!-- 标题 -->
        <div class="notice-dialog-title">{{ ruleForm.title }}</div>
        <!-- 内容 -->
        <div style="margin:20px 0">{{ ruleForm.content }}</div>
        <!-- 图片 -->
        <!-- @click="viewPic()" -->
        <el-image v-if="ruleForm.imgType == 0 && imgFullUrl" style="width: 300px; height: 300px;display: flex;justify-content: center;" :src="imgFullUrl" fit="contain"> </el-image>
        <video id="previewVideo" style="width:100%;height: 300px;" v-if="ruleForm.imgType == 1 && videoFullUrl" :src="videoFullUrl" controls="controls">您的浏览器不支持视频播放</video>
        <!-- 按钮 -->
        <div class="dialog-btn" v-if="ruleForm.linkContent">{{ ruleForm.linkContent }}</div>
      </div>
    </el-dialog>
    <!-- 查看图片 -->
    <el-dialog :visible.sync="previewImg" :modal="isModal">
      <img width="100%" :src="previewImgUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const validatorVisible = (rule, value, callback) => {
      if (this.ruleForm.visible && this.ruleForm.visible.length > 0) {
        callback();
      } else {
        callback(new Error("请选择对谁可见"));
      }
    };
    const validatorJumpFlag = (rule, value, callback) => {
      if (value) {
        callback();
      } else if (value == 0) {
        callback();
      } else {
        callback(new Error("请选择跳转链接"));
      }
    };
    return {
      imgFullUrl: "",
      videoFullUrl: "",
      upload: {
        imgUrl: "",
        videoUrl: ""
      },
      mainminheight: `height:${document.documentElement.clientHeight - 130}px`,
      // 表单验证
      ruleForm: {
        imgType: 0,
        imgUrl: "",
        title: "", // 标题
        startTime: "", // 开始时间
        endTime: "", // 结束时间
        content: "", // 公告内容
        visible: [], // 对谁可见
        jumpFlag: null, // 是否跳转
        linkContent: "", // 链接按钮文案
        linkUrl: "",
        menuLv1: "", // 一级菜单
        menuLv2: "", // 二级菜单
        menuLv3: ""
      },
      // 表单验证规则
      rules: {
        title: [{ required: true, message: "请输入公告标题", trigger: "blur" }],
        startTime: [{ required: true, message: "请选择开始时间", trigger: "change" }],
        endTime: [{ required: true, message: "请选择结束时间", trigger: "change" }],
        content: [{ required: true, message: "请输入公告内容", trigger: "blur" }],
        visible: [{ required: true, validator: validatorVisible, trigger: "change" }],
        jumpFlag: [{ required: true, validator: validatorJumpFlag, trigger: "change" }],
        linkContent: [{ required: true, message: "请输入链接按钮文案", trigger: "blur" }]
      },
      pickerOptionsStart: {},
      pickerOptionsEnd: {},
      isModal: false,
      menuLv1List: [{ menuCode: "service", menuName: "服务" }, { menuCode: "function", menuName: "功能" }, { menuCode: "mine", menuName: "我的" }, { menuCode: "reviewReport", menuName: "回顾报告" }],
      menuLv2List: [],
      menuLv3List: [],
      serviceTypeList: [],
      allMenu: [],
      visibleList: [],
      disabledCheckBoxFlag: false,
      disabledCheckDirectFlag: false,
      previewVisible: false,
      dialogImgWidth: null,
      previewImg: false,
      previewImgUrl: ""
    };
  },
  mounted() {
    // 获取屏幕宽度
    this.dialogImgWidth = document.documentElement.clientWidth * 0.3 - 40;
  },
  created() {
    this.ruleForm.imgType = this.$route.query.imgType;
    if (this.$route.query.imgUrl) {
      if (this.$route.query.imgType == 0) {
        this.upload.imgUrl = this.$route.query.imgUrl && this.$route.query.imgUrl.split(",");
      } else if (this.$route.query.imgType == 1) {
        this.upload.videoUrl = this.$route.query.imgUrl && this.$route.query.imgUrl.split(",");
      }
    }
    this.getMenuLevel1List(); // 获取一级菜单路径
    this.getVisibleList(); // 获取对谁可见
    this.getMenuLevel2List(); // 获取二级菜单
  },
  watch: {},
  methods: {
    jumpFlagChange(val) {
      if (val == 0) {
        this.ruleForm.linkContent = "";
        this.ruleForm.linkUrl = "";
        this.ruleForm.menuLv1 = "";
        this.ruleForm.menuLv2 = "";
        this.ruleForm.menuLv3 = "";
      }
      if (val == 1) {
        this.ruleForm.menuLv1 = "";
        this.ruleForm.menuLv2 = "";
        this.ruleForm.menuLv3 = "";
      }
      if (val == 2 || val == 3) {
        this.ruleForm.linkUrl = "";
      }
    },
    getMenuLevel1List() {
      const params = {
        level: 1,
        menuSource: "weChat"
      };
      this.requestMethodGet("/web/system/permission/menuManage/list", params).then(res => {
        if (res.data.code == 1000) {
          this.allMenu = res.data.data;
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    getMenuLevel2List() {
      this.requestMethodGet("/notice/getMenuDropDownList", {}).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          data.forEach(it => {
            it.serviceId = it.menuIdLv1 + "," + it.menuIdLv2 + "," + it.menuIdLv3;
            it.disabled = it.statusLv3 ? false : true;
          });
          this.serviceTypeList = data;
          this.$_queryNoticeDetail(this.$route.query.id); // 设备详情
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    menuLv1Change(val) {
      this.getLv1List(val, "");
    },
    menuLv2Change(val) {
      this.getLv2List(val, "");
    },
    getLv1List(val, type) {
      if (type != "init") {
        this.ruleForm.menuLv2 = "";
        this.ruleForm.menuLv3 = "";
      }
      if (val == "service") {
        this.menuLv2List = this.serviceTypeList;
      } else if (val == "function") {
        this.menuLv2List = [
          { serviceId: "businessArchives", serviceNameFull: "业务档案", disabled: false },
          { serviceId: "servicePerformance", serviceNameFull: "服务履约", disabled: false },
          { serviceId: "serviceTools", serviceNameFull: "润滑服务工具", disabled: false },
          { serviceId: "utilities", serviceNameFull: "系统实用工具", disabled: false },
          { serviceId: "other", serviceNameFull: "其他", disabled: false }
        ];
      } else if (val == "mine") {
        this.menuLv2List = [
          { serviceId: "myTeam", serviceNameFull: "我的团队", disabled: false },
          { serviceId: "myService", serviceNameFull: "我的服务商", disabled: false },
          { serviceId: "qrcode", serviceNameFull: "邀请二维码管理", disabled: false },
          { serviceId: "userHelper", serviceNameFull: "系统使用小助手", disabled: false },
          { serviceId: "workshopView", serviceNameFull: "车间概览", disabled: false },
          { serviceId: "clause", serviceNameFull: "隐私条款", disabled: false },
          { serviceId: "updateLog", serviceNameFull: "版本更新日志", disabled: false },
          { serviceId: "feedback", serviceNameFull: "意见反馈", disabled: false },
          { serviceId: "officialAccount", serviceNameFull: "关注“美孚工业润滑油”公众号", disabled: false }
        ];
      } else if (val == "reviewReport") {
        this.menuLv2List = [{ serviceId: "reviewTypeDate", serviceNameFull: "阶段运营报告", disabled: false }, { serviceId: "reviewTypeYear", serviceNameFull: "年度数字回顾", disabled: false }];
      }
    },
    getLv2List(val, type) {
      if (type != "init") {
        this.ruleForm.menuLv3 = "";
      }
      if (val == "businessArchives") {
        this.menuLv3List = [
          { serviceId: "customer", serviceNameFull: "客户" },
          { serviceId: "distributor", serviceNameFull: "经销商" },
          { serviceId: "workorder", serviceNameFull: "工单" },
          { serviceId: "device", serviceNameFull: "设备" },
          { serviceId: "service_apply_class", serviceNameFull: "申请单" },
          { serviceId: "PESpackage_wechat", serviceNameFull: "服务包" },
          { serviceId: "Task", serviceNameFull: "任务调度" },
          { serviceId: "abnormal", serviceNameFull: "异常记录" },
          { serviceId: "planArchives", serviceNameFull: "计划工程服务档案" },
          { serviceId: "form_application_wechat", serviceNameFull: "记录表" }
        ];
      } else if (val == "servicePerformance") {
        this.menuLv3List = [{ serviceId: "function_service_report", serviceNameFull: "服务报告查询" }, { serviceId: "function_service_info", serviceNameFull: "服务介绍" },{ serviceId: 'customer_service_report', serviceNameFull: '客户服务年度报告' }];
      } else if (val == "serviceTools") {
        this.menuLv3List = [
          { serviceId: "toolkit_calculate", serviceNameFull: "计算工具" },
          { serviceId: "competition", serviceNameFull: "对标产品与相容性查询" },
          { serviceId: "lubricationOnlineClass", serviceNameFull: "润滑知识学堂" },
          { serviceId: "device_file", serviceNameFull: "设备资料管理" },
          { serviceId: "my-ymf-btn", serviceNameFull: "易美孚" },
          { serviceId: "product-manual", serviceNameFull: "产品手册" },
          { serviceId: "lubKnowledge", serviceNameFull: "润滑常见问答" },
          { serviceId: "caseInquiry", serviceNameFull: "客户案例查询" },
          { serviceId: "hxLubri", serviceNameFull: "核心设备润滑油表" },
          { serviceId: "FdFormula_apply", serviceNameFull: "配方披露和常用证书申请" }
        ];
      } else if (val == "utilities") {
        this.menuLv3List = [
          { serviceId: "function_invitate", serviceNameFull: "邀请" },
          { serviceId: "scan_equipment", serviceNameFull: "扫描设备" },
          { serviceId: "assistant", serviceNameFull: "系统使用小助手" },
          { serviceId: "loginPC", serviceNameFull: "登录PC" }
        ];
      } else if (val == "other") {
        this.menuLv3List = [
          { serviceId: "serviceApply", serviceNameFull: "服务申请" },
          { serviceId: "health", serviceNameFull: "健康中心" },
          { serviceId: "todoTask", serviceNameFull: "待办中心" },
          { serviceId: "statistic", serviceNameFull: "数据统计" }
        ];
      }
    },
    getVisibleList() {
      this.requestMethodGet("/notice/getNoticeVisitAuth", {}).then(res => {
        if (res.data.code == 1000) {
          this.visibleList = res.data.data;
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    // 对谁可见
    visibleChange() {
      this.disabledCheckBoxFlag = this.ruleForm.visible.includes("4");
      this.disabledCheckDirectFlag = this.ruleForm.visible.includes("2") && this.ruleForm.visible.includes("3");
      if (this.disabledCheckBoxFlag) {
        // 选中PES客户去掉直供客户和经销商客户
        for (let i = 0; i < this.ruleForm.visible.length; i++) {
          if (this.ruleForm.visible[i] == 2 || this.ruleForm.visible[i] == 3) {
            this.ruleForm.visible.splice(i--, 1);
          }
        }
      }
    },
    // 关闭预览
    closePreviewvideo() {
      if (this.ruleForm.imgType == 1) {
        let videoId = document.getElementById("previewVideo"); // 找到视频元素
        videoId.pause();
      }
    },
    // 查询通知详情
    $_queryNoticeDetail(id) {
      this.requestMethodGet("web/notice/getNotice", { id })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data.menuLv1 == "service") {
              let allServiceId = [];
              this.serviceTypeList.forEach(item => {
                allServiceId.push(item.serviceId);
              });
              if (!allServiceId.toString().includes(res.data.menuLv2)) {
                res.data.menuLv2 = "";
              }
            }

            this.ruleForm = res.data;
            this.ruleForm.visible = this.ruleForm.visible ? this.ruleForm.visible.split(",") : [];
            if (this.ruleForm.jumpFlag == 1) {
              if (this.ruleForm.menuLv1 !== "") {
                this.getLv1List(this.ruleForm.menuLv1, "init");
              }
              if (this.ruleForm.menuLv1 == "function" && this.ruleForm.menuLv2 !== "") {
                this.getLv2List(this.ruleForm.menuLv2, "init");
              }
            }
            this.visibleChange();
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 提交
    handleSubmitForm(formName) {
      if (new Date(this.ruleForm.startTime).getTime() >= new Date(this.ruleForm.endTime).getTime()) {
        this.$message({
          message: "开始时间要小于结束时间，请重新选择",
          type: "warning"
        });
        return;
      }
      let flag = false;
      if (this.ruleForm.jumpFlag == 1) {
        if (this.ruleForm.menuLv1 == "") {
          flag = true;
          this.$message({
            message: "请选择一级菜单路径",
            type: "warning"
          });
        } else if (this.ruleForm.menuLv2 == "") {
          flag = true;
          this.$message({
            message: "请选择二级菜单路径",
            type: "warning"
          });
        } else if (this.ruleForm.menuLv1 == "function" && this.ruleForm.menuLv3 == "") {
          flag = true;
          this.$message({
            message: "请选择三级菜单路径",
            type: "warning"
          });
        }
      } else if (this.ruleForm.jumpFlag == 2 && this.ruleForm.linkUrl == "") {
        flag = true;
        this.$message({
          message: "请输入问卷星问卷链接",
          type: "warning"
        });
      } else if (this.ruleForm.jumpFlag == 3 && this.ruleForm.linkUrl == "") {
        flag = true;
        this.$message({
          message: "请输入URL",
          type: "warning"
        });
      }
      if (flag) return;
      if (this.ruleForm.imgType == 0) {
        this.ruleForm.imgUrl = this.upload.imgUrl && this.upload.imgUrl.map(item => item.halfPath).join(",");
      } else if (this.ruleForm.imgType == 1) {
        this.ruleForm.imgUrl = this.upload.videoUrl && this.upload.videoUrl.map(item => item.halfPath).join(",");
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("确定提交编辑公告?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let params = { ...this.ruleForm };
              params.status = 0;
              // 跳转不跳转
              if (params.jumpFlag == 0) {
                params.linkContent = "";
                params.menuLv1 = "";
                params.menuLv2 = "";
                params.menuLv3 = "";
                params.linkUrl = "";
              } else if (params.jumpFlag == 1) {
                params.linkUrl = "";
              } else if (params.jumpFlag == 2 || params.jumpFlag == 3) {
                params.menuLv1 = "";
                params.menuLv2 = "";
                params.menuLv3 = "";
              }
              this.requestMethodPost("web/notice/updateNotice", params)
                .then(res => {
                  res = res.data;
                  if (res.code == 1000) {
                    this.$message({
                      message: "编辑成功",
                      type: "success"
                    });
                    this.$router.push({
                      path: "/Notice",
                      params: { isSaveQuery: true }
                    });
                  } else {
                    this.$message({
                      message: res.msg,
                      type: "warning"
                    });
                  }
                })
                .catch(res => {});
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },
    // 保存草稿
    handleSaveDraft(formName) {
      if (new Date(this.ruleForm.startTime).getTime() >= new Date(this.ruleForm.endTime).getTime()) {
        this.$message({
          message: "开始时间要小于结束时间，请重新选择",
          type: "warning"
        });
        return;
      }
      let flag = false;
      if (this.ruleForm.jumpFlag == 1) {
        if (this.ruleForm.menuLv1 == "") {
          flag = true;
          this.$message({
            message: "请选择一级菜单路径",
            type: "warning"
          });
        } else if (this.ruleForm.menuLv2 == "") {
          flag = true;
          this.$message({
            message: "请选择二级菜单路径",
            type: "warning"
          });
        } else if (this.ruleForm.menuLv1 == "function" && this.ruleForm.menuLv3 == "") {
          flag = true;
          this.$message({
            message: "请选择三级菜单路径",
            type: "warning"
          });
        }
      } else if (this.ruleForm.jumpFlag == 2 && this.ruleForm.linkUrl == "") {
        flag = true;
        this.$message({
          message: "请输入问卷星问卷链接",
          type: "warning"
        });
      } else if (this.ruleForm.jumpFlag == 3 && this.ruleForm.linkUrl == "") {
        flag = true;
        this.$message({
          message: "请输入URL",
          type: "warning"
        });
      }
      if (flag) return;
      if (this.ruleForm.imgType == 0) {
        this.ruleForm.imgUrl = this.upload.imgUrl && this.upload.imgUrl.map(item => item.halfPath).join(",");
      } else if (this.ruleForm.imgType == 1) {
        this.ruleForm.imgUrl = this.upload.videoUrl && this.upload.videoUrl.map(item => item.halfPath).join(",");
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("确定将公告保存为草稿?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let params = { ...this.ruleForm };
              params.status = 2;
              // 跳转不跳转
              if (params.jumpFlag == 0) {
                params.linkContent = "";
                params.menuLv1 = "";
                params.menuLv2 = "";
                params.menuLv3 = "";
                params.linkUrl = "";
              } else if (params.jumpFlag == 1) {
                params.linkUrl = "";
              } else if (params.jumpFlag == 2 || params.jumpFlag == 3) {
                params.menuLv1 = "";
                params.menuLv2 = "";
                params.menuLv3 = "";
              }
              this.requestMethodPost("web/notice/updateNotice", params)
                .then(res => {
                  res = res.data;
                  if (res.code == 1000) {
                    this.$message({
                      message: "编辑成功",
                      type: "success"
                    });
                    this.$router.push({
                      path: "/Notice",
                      params: { isSaveQuery: true }
                    });
                  } else {
                    this.$message({
                      message: res.msg,
                      type: "warning"
                    });
                  }
                })
                .catch(res => {});
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },
    // 预览
    priviewNotice(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let path = "";
          if (this.ruleForm.imgType == 0) {
            if (this.upload.imgUrl.length > 0) {
              if (this.upload.imgUrl[0].halfPath == this.ruleForm.imgUrl) {
                path = this.ruleForm.imgUrl;
              } else {
                path = this.upload.imgUrl[0].halfPath;
              }
            }
          } else if (this.ruleForm.imgType == 1) {
            if (this.upload.videoUrl.length > 0) {
              if (this.upload.videoUrl[0].halfPath == this.ruleForm.imgUrl) {
                path = this.ruleForm.imgUrl;
              } else {
                path = this.upload.videoUrl[0].halfPath;
              }
            }
          }
          if (!path) {
            if (this.ruleForm.imgType == 0) {
              this.imgFullUrl = "";
            } else if (this.ruleForm.imgType == 1) {
              this.videoFullUrl = "";
            }
            this.previewVisible = true;
            return;
          }
          const res = await this.requestMethodGet("/web/file/getFullUrl", { url: path });
          if (res.data.code == 1000) {
            if (this.ruleForm.imgType == 0) {
              this.imgFullUrl = res.data.data;
            } else if (this.ruleForm.imgType == 1) {
              this.videoFullUrl = res.data.data;
            }
          } else {
            if (this.ruleForm.imgType == 0) {
              this.imgFullUrl = "";
            } else if (this.ruleForm.imgType == 1) {
              this.videoFullUrl = "";
            }
          }
          this.previewVisible = true;
        } else {
          return false;
        }
      });
    },
    // 查看图片
    viewPic() {
      this.previewImgUrl = this.$route.query.imgUrl;
      this.previewImg = true;
    },
    // 返回
    handleResetFrom(formName) {
      this.$refs[formName].resetFields();
      this.$router.push({
        path: "/Notice",
        params: { isSaveQuery: true }
      });
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 160}px`;
    }
  }
};
</script>
<style lang="less" scoped>
.route_span {
  margin: 6px 3px 0 0;
  display: inline-block;
  color: red;
}
.tip {
  color: #999;
  font-size: 13px;
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
}
.dialog-btn {
  margin-top: 10px;
  height: 40px;
  background-color: rgb(204, 221, 225);
  width: 130px;
  border-radius: 40px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.text-tip {
  margin-top: 10px;
  color: rgb(153, 153, 153);
  font-size: 12px;
  line-height: 16px;
}
</style>
<style>
.add-notice .el-form-item__label {
  color: #999999;
  padding: 0;
}
.footer {
  position: fixed;
  bottom: 20px;
  padding-top: 20px;
}
.hide .el-upload--picture-card {
  display: none;
}
</style>
