<template>
  <div class="advertisement-configure">
    <div class="toolbox-con flexEnd">
      <el-button size="small" type="danger" @click="addAdvert" v-has="AdvertiseAdd">新建广告</el-button>
      <el-button size="small" type="danger" plain style="margin:0px 5PX;" @click="priviewDialog" v-has="AdvertisePreview">预览</el-button>
    </div>
    <div>
      <custom-table :tableHeader="tableDataHeader" :tableData="tableData" :tableHeight="tableHeight + ''" :loading="loading" class="moreSelectMar">
        <template v-slot:sortName="slotProps">
          <el-table-column
            label="位置"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
            :render-header="renderHeader"
          >
            <template slot-scope="scope">
              <div style="width:100%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">{{ scope.row.sortName || "-" }}</div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:createTime="slotProps">
          <el-table-column
            label="创建时间"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div style="width:100%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">{{ scope.row.createTime | dateFormat }}</div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:status="slotProps">
          <el-table-column
            label="状态"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div :style="!scope.row.status ? 'color:rgb(221, 0, 0)' : 'color:rgb(0, 136, 136)'">{{ scope.row.status ? "已启用" : "已停用" }}</div>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="200" align="center">
          <i class="el-icon-share"></i>
          <template slot-scope="scope">
            <el-link type="danger" style="color:#001450" :underline="false" v-has="AdvertiseEdit" v-show="!scope.row.status" @click="openAdvert(scope.row)">启用</el-link>
            <el-link type="danger" style="color:#001450" :underline="false" v-has="AdvertiseEdit" v-show="scope.row.status" @click="stopAdvert(scope.row)">停用</el-link>
            <el-link type="danger" @click="editAdvert(scope.row)" style="color:#001450" :underline="false" v-has="AdvertiseEdit">编辑</el-link>
            <el-link
              type="danger"
              :style="scope.row.id == tableData[0].id || !scope.row.status ? 'color:#AAA' : 'color:#001450'"
              :disabled="scope.row.id == tableData[0].id || !scope.row.status"
              @click="moveRow(scope.row, 1)"
              :underline="false"
              v-has="AdvertiseMove"
              >&nbsp;上移</el-link
            >
            <el-link
              type="danger"
              :style="scope.row.id == tableData[tableData.length - 1].id || !scope.row.status ? 'color:#AAA' : 'color:#001450'"
              :disabled="scope.row.id == tableData[tableData.length - 1].id || !scope.row.status"
              :underline="false"
              @click="moveRow(scope.row, 2)"
              v-has="AdvertiseMove"
              >&nbsp;下移</el-link
            >
          </template>
        </el-table-column>
      </custom-table>
    </div>
    <el-drawer @close="closeDrawer" :title="drawerTitle" :visible.sync="drawer" :wrapperClosable="false" size="40%" style="height:100%;">
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm" style="padding:0 20px;width:90%;height:100%;position:relative">
          <el-form-item label="广告标题：" prop="title">
            <el-input v-model="ruleForm.title" placeholder="最多输入20个字" maxlength="20" clearable show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :label="true">启用</el-radio>
              <el-radio :label="false">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="广告位封面：" prop="imageType">
            <el-radio-group v-model="ruleForm.imageType" @change="radioChange">
              <el-radio :label="0">默认图片</el-radio>
              <el-radio :label="1">自定义图片</el-radio>
              <el-radio :label="2">视频</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="!isRadioChange">
            <el-form-item prop="imageType" v-if="ruleForm.imageType == 0">
              <div style="width: 140px; height: 120px;border-radius:5px;display:flex;align-items: center;background:rgba(204,221,255,0.4)">
                <img style="width: 120px;margin:auto" src="../../assets/prew-index-defualt-1.png" object-fit="contain" />
              </div>
            </el-form-item>
            <el-form-item prop="img" v-if="ruleForm.imageType == 1">
              <el-upload
                action=""
                list-type="picture-card"
                :file-list="imageList"
                :on-remove="handleRemove"
                :http-request="uplaodImg"
                accept=".jpg,.jpeg,.png,.gif"
                :class="imageList.length == 1 ? 'hide_box' : ''"
              >
                <i slot="default" class="el-icon-plus" />
                <div slot="file" slot-scope="{ file }">
                  <el-image v-if="ruleForm.imageType == 1 && imageUrl" :src="imageUrl" fit="cover" class="avatar"></el-image>
                  <div class="right-top-con" v-if="imageUrl">
                    <i class="el-icon-check right-top-icon"></i>
                  </div>
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
              <div v-if="ruleForm.imageType == 1" style="color:#999;font-size:12px;line-height:16px;">上传1张图片，图片建议尺寸670*200像素，大小10M以内，推荐格式jpg、jpeg、png、gif</div>
            </el-form-item>
            <el-form-item prop="img" v-if="ruleForm.imageType == 2">
              <el-upload action="" list-type="picture-card" :file-list="videoList" :on-remove="handleRemove" :http-request="uplaodVideo" accept=".mp4" :class="videoList.length == 1 ? 'hide_box' : ''">
                <i slot="default" class="el-icon-plus" />
                <div slot="file" slot-scope="{ file }">
                  <video v-if="ruleForm.imageType == 2 && videoUrl" ref="video" :src="videoUrl" class="avatar video-avatar videoBox">您的浏览器不支持视频播放</video>
                  <div class="right-top-con" v-if="videoUrl">
                    <i class="el-icon-check right-top-icon"></i>
                  </div>
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
              <div v-if="ruleForm.imageType == 2" style="color:#999;font-size:12px;line-height:16px;">上传1条视频，最大100M，建议大小50M左右，视频建议尺寸670*200，推荐格式mp4，文件名不能出现空格</div>
            </el-form-item>
          </div>
          <el-form-item label="广告位文案：" prop="content">
            <el-input type="textarea" placeholder="请输入文案" v-model="ruleForm.content" maxlength="45" clearable show-word-limit></el-input>
          </el-form-item>
          <div style="display:flex">
            <el-form-item label="跳转链接：" prop="frontPathType">
              <el-select v-model="ruleForm.frontPathType" placeholder="请选择一级菜单" @change="firstMenuChange">
                <el-option label="MSDP内部链接" :value="1"></el-option>
                <el-option label="公众号文章" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-row v-if="ruleForm.frontPathType == 1">
            <el-col :span="24">
              <el-form-item label="">
                <span slot="label"><span style="margin: 6px 3px 0 0;display: inline-block;color: red;">*</span>菜单路径：</span>
                <el-select v-model="ruleForm.menuLv1" clearable placeholder="请选择一级菜单" @change="menuLv1Change">
                  <el-option v-for="item in menuLv1List" :key="item.menuCode" :label="item.menuName" :value="item.menuCode"> </el-option>
                </el-select>
                <el-select v-model="ruleForm.menuLv2" :disabled="!ruleForm.menuLv1" clearable placeholder="请选择二级菜单" style="width: 160px; " @change="menuLv2Change">
                  <el-option v-for="item in menuLv2List" :key="item.serviceId" :label="item.serviceNameFull" :value="item.serviceId" :disabled="item.disabled"> </el-option>
                </el-select>
                <el-select v-model="ruleForm.menuLv3" :disabled="!ruleForm.menuLv2" clearable placeholder="请选择三级菜单" style="width: 160px; " v-if="ruleForm.menuLv1 == 'function'">
                  <el-option v-for="item in menuLv3List" :key="item.serviceId" :label="item.serviceNameFull" :value="item.serviceId"> </el-option>
                </el-select>
              </el-form-item>
              <div class="tip" style="margin: 10px 0 20px;color:#999;font-size:12px;">路径配置完成后，小程序上支持点击跳转到具体功能页</div>
            </el-col>
          </el-row>

          <el-form-item v-show="ruleForm.frontPathType == 3" label="URL：" prop="frontPath">
            <el-input v-model="ruleForm.frontPath" placeholder="请输入公众号链接" clearable></el-input>
          </el-form-item>
          <el-form-item label="对谁可见：" prop="auth">
            <el-checkbox-group v-model="ruleForm.auth" @change="typeRadioChange">
              <el-checkbox label="1">对美孚内部</el-checkbox>
              <el-checkbox label="2">对经销商</el-checkbox>
              <el-checkbox label="3" :disabled="disabledType">对直供客户</el-checkbox>
              <el-checkbox label="4" :disabled="disabledType">对经销商客户</el-checkbox>
              <el-checkbox label="5">对PES客户</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="drawer-footer" style="padding-right:20px;text-align:right;padding-bottom:20px">
        <el-button size="small" @click="resetForm('ruleForm')">取消</el-button>
        <el-button size="small" type="danger" @click="submitForm('ruleForm')">保存</el-button>
      </div>
    </el-drawer>
    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogVisible" @close="closePreviewvideo">
      <img width="100%" v-if="ruleForm.imageType == 1" :src="imageUrl" alt="" />
      <video id="previewVideo" style="width:100%;" v-if="ruleForm.imageType == 2" :src="videoUrl" controls="controls">您的浏览器不支持视频播放</video>
    </el-dialog>
    <!-- 预览 -->
    <el-dialog title="预览" :visible.sync="priviewDialogFlag" custom-class="preview-dialog" width="490px" top="20px">
      <div style="display: flex;align-items: center;justify-content: center;">
        <el-scrollbar style="height:800px;">
          <div style="height:100%;position:relative">
            <img src="../../assets/prew-index-bg-new.jpg" style="width:100%;display:block;" object-fit="cover" />
            <div id="content-prew" style="width:100%;background-color:#f9f9f9;padding-bottom:40px;" v-if="addAdvertList.length">
              <div style="font-size:17px;font-weight:bold;color:#000;cursor:pointer;padding-left:20px;" @click="showAddAdvert = !showAddAdvert">
                为您推荐 <i :class="showAddAdvert ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" style="margin-left:5px;font-weight:bold;"></i>
              </div>
              <div v-if="showAddAdvert" style="width:100%;">
                <div class="advertList-con" v-for="(item, index) in addAdvertList" :key="index">
                  <el-image class="advertList-img" :src="item.imgFullUrl" fit="cover" v-if="item.imgFullUrl && item.imgType == 1"></el-image>
                  <div class="advertList-img-con" v-if="item.imgType == 0">
                    <img class="advertList-con-img" src="../../assets/prew-index-defualt-1.png" object-fit="contain" />
                  </div>
                  <div class="advertList-video-con" v-if="item.imgFullUrl && item.imgType == 2">
                    <video :src="item.imgFullUrl" class="advertList-video">您的浏览器不支持视频播放</video>
                    <div class="advertList-video-mask"></div>
                    <i class="el-icon-video-play open-video"></i>
                  </div>
                  <div class="advertList-tit-con">
                    <span class="advertList-tit">{{ item.title }}</span>
                    <span class="advertList-tit-icon"><i class="el-icon-arrow-right advertList-tit-more"></i></span>
                  </div>
                  <div class="advertList-content">{{ item.content }}</div>
                </div>
              </div>
            </div>
            <img src="../../assets/prew-index-footer.jpg" class="advertList-footer" alt="" />
          </div>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import customTable from "../tableComponents/customTable.vue";
import { fullScreen_loading } from "../../generalComponents/fullScreenLoading";
import OSSClient from "../../utils/ossClient";
const oss_client = new OSSClient();
export default {
  name: "HelloWorld",
  components: {
    "custom-table": customTable
  },
  data() {
    var validateSort = (rule, value, callback) => {
      if (this.ruleForm.imageType == 1 && !this.imageUrl) {
        return callback(new Error("请上传图片"));
      } else if (this.ruleForm.imageType == 2 && !this.videoUrl) {
        return callback(new Error("请上传视频"));
      } else {
        callback();
      }
    };
    var validatefrontPath = (rule, value, callback) => {
      let reg = /^(?:(http|https|ftp)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
      if (this.ruleForm.frontPathType == 3 && !reg.test(this.ruleForm.frontPath)) {
        return callback(new Error("请输入正确的链接"));
      } else {
        callback();
      }
    };
    return {
      editRowFlag: false,
      value: true,
      drawer: false,
      d: true,
      menuLv1List: [{ menuCode: "service", menuName: "服务" }, { menuCode: "function", menuName: "功能" }, { menuCode: "mine", menuName: "我的" }],
      menuLv2List: [],
      menuLv3List: [],
      serviceTypeList: [],
      mainminheight: `height:${document.documentElement.clientHeight - 180}px`,
      saveStatus: false,
      disabledType: false,
      loading: false,
      priviewDialogFlag: false,
      isRadioChange: false,
      imageUrl: "",
      drawerTitle: "",
      equipmentObj: {},
      key: 1, // table key
      totalNumber: 0, // 总条数
      currPageNumber: 1, // 当前页
      workStatusOptions: [], // 状态
      options: [],
      adMenusList: [],
      pageSize: 30, // 当前页展示条数
      tableData: [],
      addAdvertList: [],
      ruleForm: {
        title: "",
        status: true,
        img: "",
        imageType: 0,
        auth: [],
        frontPathType: 1,
        frontPath: "",
        content: "",
        menuLv1: "", // 一级菜单
        menuLv2: "", // 二级菜单
        menuLv3: ""
      },
      rules: {
        title: [{ required: true, message: "请输入广告标题", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        imageType: [{ required: true, message: "请选择广告图片", trigger: "change" }],
        img: [{ required: true, validator: validateSort, trigger: "change" }],
        auth: [{ type: "array", required: true, message: "请至少选择一个", trigger: "change" }],
        frontPathType: [{ required: true, message: "请选择一级菜单", trigger: "change" }],
        frontPath: [{ required: true, validator: validatefrontPath, trigger: "change" }],
        content: [{ required: true, message: "请填写广告位文案", trigger: "blur" }]
      },
      showAddAdvert: true,
      dialogVisible: false, // 预览图片弹框开关
      videoUrl: "", // 视频图地址
      imageList: [], // 文件列表
      videoList: [], // 文件列表
      ruleFormImg: "",
      ruleFormVideo: "",
      tableHeight: null,
      tableDataHeader: [
        { label: "广告标题", prop: "title", width: "180", tooltip: true },
        { label: "位置", slot: "sortName", width: "150" },
        { label: "创建日期", slot: "createTime", width: "120" },
        { label: "状态", slot: "status", width: "100" },
        { label: "操作", slot: "operation" }
      ]
    };
  },
  filters: {
    dateFormat(value) {
      const dt = new Date(value);
      const y = dt.getFullYear();
      const m = (dt.getMonth() + 1 + "").padStart(2, "0");
      const d = (dt.getDate() + "").padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
  },
  methods: {
    renderHeader() {
      return (
        <div style="display:flex;align-items:center">
          位置{" "}
          <el-tooltip class="item" effect="dark" content="位置1～5，顺序分别对应小程序首页广告位从上到下的5个位置" placement="top">
            <i class="el-icon-warning-outline" style="font-size:20px;margin-left:10px;color:#FAAD14"></i>
          </el-tooltip>
        </div>
      );
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
        this.$set(this.ruleForm, "menuLv2", "");
        this.$set(this.ruleForm, "menuLv3", "");
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
      }
    },
    getLv2List(val, type) {
      if (type != "init") {
        this.$set(this.ruleForm, "menuLv3", "");
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
        this.menuLv3List = [{ serviceId: "function_service_report", serviceNameFull: "服务报告查询" }, { serviceId: "function_service_info", serviceNameFull: "服务介绍" }];
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
    priviewDialog() {
      this.priviewDialogFlag = true;
      this.showAddAdvert = true;
      this.addAdvertList.forEach(async element => {
        if (element.img) {
          element.imgFullUrl = await this.getFullpath(element.img);
        }
      });
      setTimeout(() => {
        document.getElementById("content-prew").scrollIntoView({ block: "start", behavior: "smooth" });
      }, 100);
    },
    addAdvert() {
      this.drawer = true;
      this.drawerTitle = "首页-广告位  >  新建";
      this.imageUrl = "";
      this.ruleFormImg = "";
      this.imageList = [];
      this.videoUrl = "";
      this.videoList = [];
      this.ruleFormVideo = "";
      this.ruleForm = {
        title: "",
        status: false,
        img: "",
        imageType: 0,
        auth: [],
        frontPathType: 1,
        frontPath: "",
        content: "",
        menuLv1: "", // 一级菜单
        menuLv2: "", // 二级菜单
        menuLv3: ""
      };
      if (this.$refs["ruleForm"]) {
        this.$refs["ruleForm"].resetFields();
      }
    },
    radioChange() {
      this.isRadioChange = true;
      this.$nextTick(() => {
        this.isRadioChange = false;
      });
      this.$refs["ruleForm"].clearValidate("img");
    },
    typeRadioChange(val) {
      if (this.ruleForm.auth.indexOf("5") > -1) {
        this.disabledType = true;
        this.ruleForm.auth = this.ruleForm.auth.filter(item => {
          return item != "3" && item != "4";
        });
      } else {
        this.disabledType = false;
      }
    },
    resetForm(formName) {
      this.imageUrl = "";
      this.videoUrl = "";
      this.$refs[formName].resetFields();
      this.drawer = false;
    },
    firstMenuChange() {
      this.ruleForm.frontPath = "";
    },
    $_getBtnsList(val) {
      val.forEach(item => {
        if (!item.children.length) {
          item.children = null;
        } else {
          this.$_getBtnsList(item.children);
        }
      });
    },
    // 获取服务3级树
    queryAdvertiseConfList() {
      let param = {};
      this.requestMethodGet("/web/config/serviceConfiguration/getServiceConfTree", param)
        .then(res => {
          this.loading = false;
          if (res.data.code == 1000) {
            this.options = res.data.data;
            this.$_getBtnsList(this.options);
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    // 获取广告菜单
    queryAdMenusList() {
      let param = {};
      this.requestMethodGet("/advertise/conf/queryAdMenus", param)
        .then(res => {
          if (res.data.code == 1000) {
            this.adMenusList = res.data.data;
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    getSearchTableData() {
      let param = {};
      this.loading = true;
      this.requestMethodGet("/advertise/conf/queryAdvertiseConfList", param)
        .then(res => {
          this.loading = false;
          if (res.data.code == 1000) {
            this.tableData = res.data.data;
            this.addAdvertList = res.data.data.filter(item => {
              return item.status;
            });
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },

    async editAdvert(row) {
      this.editRowFlag = true;
      this.drawerTitle = "首页-广告位  >  编辑";
      this.imageUrl = "";
      this.ruleFormImg = "";
      this.imageList = [];
      this.videoUrl = "";
      this.videoList = [];
      this.ruleFormVideo = "";
      this.ruleForm = {
        id: row.id,
        title: row.title,
        status: row.status,
        img: row.img,
        imageType: 0,
        auth: row.auth.split(","),
        frontPathType: row.frontPathType,
        frontPath: row.frontPath,
        content: row.content,
        menuLv1: row.menuLv1, // 一级菜单
        menuLv2: row.menuLv2, // 二级菜单
        menuLv3: row.menuLv3
      };
      if (this.ruleForm.frontPathType == 1) {
        if (this.ruleForm.menuLv1 !== "") {
          this.getLv1List(this.ruleForm.menuLv1, "init");
        }
        if (this.ruleForm.menuLv1 == "function" && this.ruleForm.menuLv2 !== "") {
          this.getLv2List(this.ruleForm.menuLv2, "init");
        }
      }
      if (row.img && row.imgType == 1) {
        this.ruleForm.imageType = 1;
        this.imageUrl = await this.getFullpath(row.img);
        this.ruleFormImg = row.img;
        this.imageList = [{ url: this.imageUrl }];
      } else if (row.img && row.imgType == 2) {
        this.ruleForm.imageType = 2;
        this.videoUrl = await this.getFullpath(row.img);
        this.ruleFormVideo = row.img;
        this.videoList = [{ url: this.videoUrl }];
      }
      // 服务回写
      if (row.frontPathType == 1) {
        let newList = row.frontPath.split("?")[1].split("&");
        let frontPathList = [];
        for (let item of newList) {
          let tem = item.split("=");
          frontPathList.push(tem[1]);
        }
        this.ruleForm.frontPath = frontPathList;
      }
      if (this.ruleForm.auth.indexOf("5") > -1) {
        this.disabledType = true;
      } else {
        this.disabledType = false;
      }
      this.drawer = true;
    },

    // 上下移动
    moveRow(row, moveType) {
      let param = {
        id: row.id,
        sort: row.sort,
        upOrDown: moveType
      };
      this.requestMethodPost("/advertise/conf/moveAdvertiseConf", param).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "移动成功"
          });
          this.getSearchTableData();
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        }
      });
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 180}px`;
    },
    handleAvatarSuccess(file, fileList) {
      this.$refs["ruleForm"].clearValidate("img");
      let params = new FormData();
      let fileTypeName = this.ruleForm.imageType == 1 ? "advertise_img" : "advertise_video";
      params.append("fileType", fileTypeName);
      params.append("multipartFiles", file.raw);
      this.requestMethodPost("/web/file/uploadFiles", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (this.ruleForm.imageType == 1) {
              this.imageUrl = URL.createObjectURL(file.raw);
              this.imageList = fileList;
              this.ruleFormImg = res.data[0];
            } else {
              this.videoUrl = URL.createObjectURL(file.raw);
              this.videoList = fileList;
              this.ruleFormVideo = res.data[0];
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },

    async getFullpath(halfPath) {
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

    uplaodImg(file) {
      const isJPG = file.file.type.startsWith("image");
      if (!isJPG) {
        this.$message.error("只能上传图片类型文件");
      }
      const isLt2M = file.file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 10MB!");
      }
      if (!isJPG || !isLt2M) {
        this.imageUrl = "";
        this.imageList = [];
        return;
      }
      this.AddOssFile(file.file);
    },
    AddOssFile(file) {
      const loading = this.$loading({
        lock: true,
        text: "正在上传文件中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let params = new FormData();

      params.append("fileType", "service_apply_img");
      params.append("multipartFiles", file);
      this.requestMethodPost("/web/file/uploadFiles", params).then(async res => {
        res = res.data;
        if (res.code == 1000) {
          this.ruleFormImg = res.data[0];
          this.imageUrl = await this.getFullpath(res.data[0]);
          this.imageList = [{ url: this.imageUrl }];
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
        loading.close();
      });
    },

    async uplaodVideo(file) {
      const isVideo = file.file.type.startsWith("video");
      if (!isVideo) {
        this.$message.error("只能上传视频类型文件");
      }
      const isvideoLimit = file.file.size / 1024 / 1024 < 100;
      if (!isvideoLimit) {
        this.$message.error("上传视频大小不能超过 100MB!");
      }
      const haveKong = file.file.name.indexOf(" ");
      if (haveKong != -1) {
        this.$message.error("文件名不能出现空格!");
      }
      if (!isvideoLimit || !isVideo || haveKong != -1) {
        this.videoUrl = "";
        this.videoList = [];
        return;
      }
      fullScreen_loading.LOADING();
      await oss_client.getOSSClientInstance();
      const uploadFileRes = await oss_client.uploadFile(file.file, file.file.name);
      fullScreen_loading.ENDLOADING();
      if (uploadFileRes && uploadFileRes.name) {
        this.videoUrl = await this.getFullpath(uploadFileRes.name);
        this.videoList = [{ url: this.videoUrl }];
        this.ruleFormVideo = uploadFileRes.name;
      } else {
        this.$message({
          type: "warning",
          message: "文件上传失败，请稍后重试。"
        });
      }
    },
    submitFormValidateOpenLenTip(params) {
      const openListId = this.addAdvertList
        .filter(item => {
          return item.status;
        })
        .map(item => item.id);
      if (!params.id && params.status && openListId.length == 5) {
        this.$message({
          type: "warning",
          message: "已经有5个广告为已启用状态"
        });
        return true;
      }
      if (params.id && params.status && !openListId.includes(params.id) && openListId.length == 5) {
        this.$message({
          type: "warning",
          message: "已经有5个广告为已启用状态"
        });
        return true;
      }
      return false;
    },

    submitForm(formName) {
      console.log(this.ruleForm.frontPathType, this.ruleForm.menuLv1);
      let flag = false;
      if (this.ruleForm.frontPathType == 1) {
        if (!this.ruleForm.menuLv1) {
          flag = true;
          this.$message({
            message: "请选择一级菜单路径",
            type: "warning"
          });
        } else if (!this.ruleForm.menuLv2) {
          flag = true;
          this.$message({
            message: "请选择二级菜单路径",
            type: "warning"
          });
        } else if (this.ruleForm.menuLv1 == "function" && !this.ruleForm.menuLv3) {
          flag = true;
          this.$message({
            message: "请选择三级菜单路径",
            type: "warning"
          });
        }
      }
      console.log(flag);
      if (flag) return;
      console.log(9999222);
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(99222299222);
          let openList = this.addAdvertList.filter(item => {
            return item.status;
          });

          let params = {
            auth: this.ruleForm.auth.join(),
            content: this.ruleForm.content,
            frontPath: this.ruleForm.frontPath,
            frontPathType: this.ruleForm.frontPathType,
            img: "",
            status: this.ruleForm.status,
            title: this.ruleForm.title,
            imgType: this.ruleForm.imageType
          };
          console.log(9999);
          if (this.ruleForm.frontPathType == 1) {
            params.menuLv1 = this.ruleForm.menuLv1;
            params.menuLv2 = this.ruleForm.menuLv2;
            params.menuLv3 = this.ruleForm.menuLv3;
          } else {
            params.menuLv1 = "";
            params.menuLv2 = "";
            params.menuLv3 = "";
          }
          console.log(111);
          if (this.ruleForm.frontPathType == 1) {
            params.frontPath = `/goodsPages/serviceApply/serviceList/serviceList?firstNumber=${this.ruleForm.frontPath[0]}&sencondNumber=${this.ruleForm.frontPath[1]}&thirdNumber=${
              this.ruleForm.frontPath[2]
            }`;
          } else {
            this.adMenusList.forEach(item => {
              if (item.frontUrl == this.ruleForm.frontPath) {
                params.menuId = item.menuId;
              }
            });
          }
          console.log(22222222222222);
          if (this.ruleForm.imageType == 1) {
            params.img = this.ruleFormImg || null;
          } else if (this.ruleForm.imageType == 2) {
            params.img = this.ruleFormVideo || null;
          }
          if (this.ruleForm.id) {
            params.id = this.ruleForm.id;
            params.updateFlag = true;
          }
          if (this.submitFormValidateOpenLenTip(params)) return;
          this.requestMethodPost("/advertise/conf/addOrUpdateAdvertiseConf", params).then(res => {
            if (res.data.code == 1000) {
              this.$message({
                type: "success",
                message: this.ruleForm.id ? "修改成功" : "新建成功"
              });
              this.drawer = false;
              this.getSearchTableData();
            } else {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 上传视频移除
    handleRemove() {
      if (this.ruleForm.imageType == 1) {
        this.imageList = [];
        this.imageUrl = "";
        this.ruleFormImg = "";
      } else {
        this.videoList = [];
        this.videoUrl = "";
        this.ruleFormVideo = "";
      }
    },
    // 上传视频预览
    handlePictureCardPreview() {
      this.dialogVisible = true;
    },
    // 解决上传文件action报错404
    UploadUrl: function() {
      return "";
    },
    // 启用广告
    openAdvert(row) {
      let param = {
        id: row.id
      };
      this.requestMethodPost("/advertise/conf/enableAdvertiseConf", param).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "启用成功"
          });
          this.getSearchTableData();
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        }
      });
    },
    // 停用广告
    stopAdvert(row) {
      let param = {
        id: row.id
      };
      this.requestMethodPost("/advertise/conf/disableAdvertiseConf", param).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "停用成功"
          });
          this.getSearchTableData();
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        }
      });
    },
    // 关闭图片预览
    closePreviewvideo() {
      if (this.ruleForm.imageType == 2) {
        let videoId = document.getElementById("previewVideo"); // 找到视频元素
        videoId.pause();
      }
    },
    closeDrawer() {
      this.editRowFlag = false;
    },
    getTableHeight() {
      this.tableHeight = document.documentElement.clientHeight - 230;
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.getTableHeight();
    });
  },
  created() {
    this.getSearchTableData();
    this.queryAdMenusList();
    this.queryAdvertiseConfList();
  },
  mounted() {
    this.getTableHeight();
    this.getMenuLevel1List(); // 获取一级菜单路径
    this.getMenuLevel2List(); // 获取二级菜单
    window.addEventListener("resize", () => {
      this.getTableHeight();
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import "../../assets/css/customTable.less";
.advertisement-configure {
  overflow: auto;
  padding: 0px 20px;
  .el-link {
    margin-right: 10px;
  }
  .el-switch__label.is-active {
    color: red;
  }
  .colccc {
    color: #ccc;
  }
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 40px;
    line-height: 70px;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.1);
    i {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .sencond-style {
    .el-form-item__content {
      margin-left: 20px !important;
    }
    .el-select,
    .el-cascader {
      width: 100% !important;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
  .el-form-item__label {
    color: #aaa;
  }
  .oneHeight {
    width: 335px;
  }
  .twoHeight {
    width: 160px;
    margin-right: 15px;
  }
  .otherHeight {
    width: 145px;
    margin-right: 15px;
  }
}
.preview-dialog .el-scrollbar__wrap {
  overflow-x: hidden;
}
.hide_box .el-upload--picture-card {
  display: none;
}
</style>
<style lang="less" scoped>
/deep/ .el-drawer__body {
  overflow: auto;
}
/deep/ .el-drawer__container ::-webkit-scrollbar {
  display: none;
}
/deep/.el-upload-list--picture-card {
  .el-upload-list__item {
    width: 120px !important;
    height: 120px !important;
  }
}
/deep/.el-upload--picture-card {
  width: 120px !important;
  height: 120px !important;
  line-height: 120px !important;
  margin-bottom: 10px;
}
.right-top-con {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-top: 30px solid #19cc66;
  border-left: 30px solid transparent;
}
.right-top-icon {
  font-size: 12px;
  position: absolute;
  top: -26px;
  left: -16px;
  color: #fff;
}
.advertList-con {
  width: 90%;
  margin: 20px auto 0 auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  margin-top: 20px;
  background-color: #fff;
  padding-bottom: 20px;
}
.advertList-img {
  height: 100px;
  width: 100%;
  border-radius: 10px 10px 0 0;
}
.advertList-video-con {
  height: 100px;
  width: 100%;
  border-radius: 10px 10px 0 0;
  background: rgba(0, 0, 0, 1);
  position: relative;
  .advertList-video {
    width: 100% !important;
    height: 100%;
    object-fit: contain;
  }
  .advertList-video-mask {
    width: 100%;
    height: 100%;
    border-radius: 10px 10px 0 0;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .open-video {
    position: absolute;
    font-size: 40px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
  }
}
.advertList-img-con {
  height: 100px;
  width: 100%;
  border-radius: 10px 10px 0 0;
  background: rgba(204, 221, 255, 0.4);
  display: flex;
  align-items: center;
  .advertList-con-img {
    width: 75%;
    margin: auto;
  }
}
.advertList-tit-con {
  font-size: 16px;
  font-weight: bold;
  color: #000;
  margin: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .advertList-tit {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 15px;
  }
  .advertList-tit-icon {
    display: block;
    height: 20px;
    width: 20px;
    border: 1px solid #001450;
    text-align: center;
    line-height: 20px;
    border-radius: 50%;
    margin-left: 10px;
  }
  .advertList-tit-more {
    font-weight: bold;
    font-size: 14px;
  }
}
.advertList-content {
  font-size: 14px;
  color: rgb(153, 153, 153);
  margin: 0px 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.advertList-footer {
  width: 100%;
  display: block;
  box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.05);
}
/deep/.el-upload-list--picture-card .el-upload-list__item {
  margin: 0;
}
/deep/.el-textarea .el-input__count {
  line-height: 12px;
  bottom: 1px;
}
/deep/.el-input__clear {
  background-color: #fff;
  height: 14px;
}
</style>
