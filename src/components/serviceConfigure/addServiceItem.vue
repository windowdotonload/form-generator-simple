<template>
  <div class="add-service-content">
    <div style="display: flex; justify-content: flex-end; margin-right: 20px">
      <el-button size="small" @click="cancelItems('basic')">取消</el-button>
      <el-button type="danger" plain size="small" @click="deleteItems" v-if="type == 'edit'">删除</el-button>
      <el-button size="small" type="danger" plain @click="priviewItems('basic')">预览</el-button>
      <el-button type="danger" size="small" @click="submitItems('basic')">提交</el-button>
    </div>
    <el-scrollbar :style="mainminheight" class="add-content">
      <!-- 基础信息 -->
      <div class="basic-content-title" style="margin-top: 20px">
        <div class="line"></div>
        基础信息
      </div>
      <div style="margin-top: 24px"></div>
      <!-- 基础信息form -->
      <el-form ref="basic" :model="basicForm" :rules="basicRules" label-width="140px">
        <el-form-item label="名称" prop="serviceName">
          <el-input clearable v-model="basicForm.serviceName" size="small" maxlength="30" style="width: 380px" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="服务级别" prop="serviceGrade">
          <el-select v-model="basicForm.serviceGrade" size="small" placeholder="请选择" style="width: 380px" clearable>
            <el-option label="基础型服务" :value="'1'"></el-option>
            <el-option label="增强型服务" :value="'2'"></el-option>
            <el-option label="高阶型服务" :value="'3'"></el-option>
          </el-select>
          <el-link type="primary" :underline="false" @click="configScore">配置分数</el-link>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="basicForm.status" :disabled="isDisabled">
            <!-- <el-radio v-for="(item,index) in radioList" :key="index" :label="item.value">{{item.label=""}}</el-radio> -->
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="简介" prop="shortDesc">
          <el-input clearable v-model="basicForm.shortDesc" :autosize="shortDescAutosize" style="width: 380px" type="textarea" placeholder="请输入" maxlength="300" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="服务的行业" prop="serviceIndustrys">
          <el-select v-model="basicForm.serviceIndustrys" multiple placeholder="请选择" size="small" style="width: 380px">
            <el-option v-for="item in serviceIndustry" :key="item.id" :label="item.name" :value="item.id"></el-option>
            <li class="serviceIndustry-btn">
              <el-button size="mini" type="danger" @click.prevent="handlerConfigServiceIndustry">配置服务行业</el-button>
            </li>
            <li class="serviceIndustry-btn" slot="empty">
              <el-button size="mini" type="danger" @click.prevent="handlerConfigServiceIndustry">配置服务行业</el-button>
            </li>
          </el-select>
          <span style="color: #999999; margin-left: 10px"
            >配置完成的服务的行业，已经关联了哪些服务项？
            <el-button type="text" @click.prevent="handlerLookServiceIndustry">点击查看</el-button>
          </span>
        </el-form-item>
        <el-form-item label="关联工单" prop="serviceType" v-if="basicForm.serviceType != 11">
          <el-radio-group v-model="basicForm.serviceType" @change="serviceTypeChange">
            <el-radio v-for="item in relaseOrderList" :label="item.code" :key="item.id">{{ item.name }}</el-radio>
          </el-radio-group>
          <div style="color: #999999">1、关联工单决定用户会通过该服务创建何种工单。2、MSAA工单的服务属性、润滑点为非必填。</div>
        </el-form-item>
        <!-- msla工单隐藏 -->
        <div v-if="isShowBlock">
          <el-form-item label="报告模板" prop="serType">
            <el-radio-group v-model="basicForm.serType" @change="reportTypeChange">
              <el-radio v-for="item in typeData" :label="item.value" :key="item.value" :disabled="basicForm.serviceType == 1">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="固定模板" prop="reportType" v-if="basicForm.serType == '1'">
            <el-select v-model="basicForm.reportType" filterable :filter-method="templateAllFilter" @clear="clearTemplate" style="width: 220px" size="small" placeholder="请选择">
              <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="自定义报告模板" prop="woFormType" v-if="basicForm.serType == '2'">
            <el-select v-model="basicForm.woFormType" filterable style="width: 220px" size="small" placeholder="请选择">
              <el-option v-for="item in reportTypeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="故障种类" prop="reportTypeMappingCode" v-if="basicForm.reportType == '14' && basicForm.serType == '1'">
            <el-cascader
              :key="reportTypeKey"
              ref="cascader"
              style="width: 220px"
              v-model="basicForm.reportTypeMappingCode"
              size="small"
              :checkStrictly="true"
              placeholder="请选择"
              @change="faultListChange"
              :options="faultList"
              :props="props"
              collapse-tags
              clearable
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="信息录入模板" prop="infoReportTemplate">
            <el-radio-group v-model="basicForm.infoReportTemplate" @change="infoReportTypeChange" :disabled="basicForm.serviceType == 1">
              <el-radio v-for="item in infoReportTemplateList" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="模板" prop="coreDataTemplateId" v-if="basicForm.infoReportTemplate == '1'">
            <el-select
              v-model="basicForm.coreDataTemplateId"
              filterable
              :filter-method="templateInfoAllFilter"
              @change="changeInfoTemplate"
              @clear="clearInfoTemplate"
              style="width: 220px"
              size="small"
              placeholder="请选择"
            >
              <el-option v-for="item in infoReportTemplateData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="适用角色" v-if="basicForm.infoReportTemplate == '1'">
            <el-select v-model="basicForm.coreDataTemplateRoleIds" filterable multiple style="width: 220px" size="small" placeholder="请选择">
              <el-option v-for="item in roleList" :key="item.accessTemplateId" :label="item.accessTemplateName" :value="item.accessTemplateId"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="操作权限" prop="authorityType">
          <el-radio-group v-model="basicForm.authorityType">
            <el-radio :label="1" :disabled="basicForm.serviceType == '3'">所有用户</el-radio>
            <el-radio :label="2" :disabled="basicForm.serviceType == '3'">指定经销商</el-radio>
            <el-radio :label="3" :disabled="basicForm.serviceType == '3'">指定可操作角色</el-radio>
          </el-radio-group>
          <div style="color: #999999">
            {{
              basicForm.authorityType == 3
                ? "仅下列指定角色可进行工单服务，其他角色只能查看"
                : basicForm.authorityType == 1
                ? basicForm.serviceType == 3
                  ? "所有MSDP用户可查看线上培训"
                  : "所有MSDP用户可查看并使用该分类下内容"
                : "仅下列指定经销商可进行工单服务"
            }}
          </div>
        </el-form-item>

        <!-- 选中指定经销商时展示 -->
        <el-transfer
          v-if="basicForm.authorityType == 2"
          style="margin-left: 120px"
          v-model="basicForm.authorityDistributorNum"
          filterable
          :filter-method="filterMethod"
          :button-texts="['加入左侧', '加入右侧']"
          :titles="['所有经销商', '指定经销商']"
          filter-placeholder="请输入经销商名称"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}',
          }"
          :props="{
            label: 'companyName',
            key: 'companyNumber',
          }"
          :data="transferData"
        >
        </el-transfer>

        <el-transfer
          class="filter-role-transer"
          v-if="basicForm.authorityType == 3"
          style="margin-left: 120px"
          filterable
          :filter-method="filterRoleMethod"
          filter-placeholder="请输入角色名称"
          v-model="basicForm.authorityroleIds"
          :button-texts="['加入左侧', '加入右侧']"
          :titles="['所有角色', '指定角色']"
          :data="roleList"
        />

        <el-form-item label="市场建议价" style="margin-top: 20px" prop="marketPriceShow" v-if="basicForm.serviceType != '3'">
          <el-radio-group v-model="basicForm.marketPriceShow" @change="marketPriceShowChange">
            <el-radio :label="true">显示</el-radio>
            <el-radio :label="false">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="basicForm.marketPriceShow" prop="marketPrice">
          <!-- onkeyup="value=value.replace(/[^0-9.]/g,'')"  -->
          <el-input
            maxlength="8"
            style="width: 380px"
            @focus="marketPriceFocus(basicForm.marketPrice)"
            @blur="marketPriceFormate(basicForm.marketPrice)"
            placeholder="请输入"
            clearable
            v-model="basicForm.marketPrice"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="新建服务项/工单" style="margin-top: 20px" prop="serviceDisplay">
          <el-radio-group v-model="basicForm.serviceDisplay">
            <el-radio :label="true">显示</el-radio>
            <el-radio :label="false">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 可选信息 -->
      <div class="basic-content-title">
        <div class="line"></div>
        可选信息
      </div>
      <el-form ref="optionalForm" :model="optionalForm" style="margin-left: 20px; margin-bottom: 120px">
        <!-- <el-form-item> -->
        <div style="display: flex; align-items: center; font-size: 14px">
          <div slot="label">顶部展示视频/图片</div>
          <div class="tips"><i class="el-icon-warning" style="margin-right: 10px"></i>(顶部展示指小程序进入服务详情的头部内容)</div>
        </div>
        <!-- </el-form-item> -->
        <!-- 视频 -->
        <el-form-item label="视频" style="width: 700px">
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
            :file-list="videoFileList"
          >
            <el-button type="danger" size="small" v-if="videoFileList.length < 1">点击上传</el-button
            ><span style="color: #999999; margin-left: 20px" v-if="videoFileList.length < 1">请上传100M以内的.mp4文件</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="视频封面">
          <span class="colccc">
            <el-radio-group v-model="optionalForm.videoCoverImgType" :disabled="videoFileList.length < 1">
              <el-radio :label="1">推荐封面</el-radio>
              <el-radio :label="2"><span class="red" v-if="optionalForm.videoCoverImgType === 2"></span>自定义封面</el-radio>
            </el-radio-group>
          </span>
        </el-form-item>
        <el-form-item>
          <div v-show="optionalForm.videoCoverImgType === 1" style="margin-left: 68px">
            <div style="color: #999999" class="colccc">系统为您截取视频第一帧作为封面图，您也可以选择上传其他图片作为封面图，图片预览</div>
            <img class="recommended-cover" :src="videoCoverRealUrl" alt="" id="image" />
          </div>
          <div v-show="optionalForm.videoCoverImgType === 2" class="customer-cover" style="margin-left: 68px">
            <div style="margin: 10px 0; color: #999999">建议上传750*422尺寸的图片</div>
            <el-upload
              :class="{ noBtnUpload: hideVideoCoverUpload || customerCoverList.length }"
              id="customerCoverId"
              :on-remove="
                (file) => {
                  handleVideoCustomerCoverRemove(file);
                }
              "
              :http-request="handleCustomerCoverChange"
              :on-preview="
                (file) => {
                  handlePictureCoverCardPreview(file);
                }
              "
              list-type="picture-card"
              limit="1"
              action=""
              accept="image/*"
              :file-list="customerCoverList"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogCoverVisible" :modal="isModal">
              <img id="coverImg" width="100%" :src="dialogCoverImageUrl" alt="" />
            </el-dialog>
          </div>
        </el-form-item>

        <el-form-item v-show="videoPreUrl" label="视频预览">
          <div class="parent-video">
            <video class="vido-content" controls="controls" :src="videoPreUrl"></video>
            <div class="mask">
              <h3 @click="deleteVideo"><i class="el-icon-delete"></i></h3>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            :class="{ noShowServiceImgList: serviceImgList.length >= 3 || notShowUploadBtn }"
            :on-remove="removeFileChange"
            :http-request="handleAddImg"
            :on-preview="
              (file) => {
                handlePictureCardPreview(file);
              }
            "
            list-type="picture-card"
            :limit="3"
            action=""
            accept="image/*"
            :file-list="serviceImgList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- 请上传20M以内的 .jpg .png .gif .svg 文件 -->
          <div style="color: #999999; margin-left: 40px; margin-top: 10px">注意：单独添加多张照片，在小程序上将以轮播的样式展示，同时添加视频+照片，在小程序上将以先视频、后照片的轮播样式展示</div>
          <el-dialog :visible.sync="imgDialogVisible" :modal="isModal">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>

        <!-- 服务概要 -->
        <el-form-item style="width: 700px">
          <div style="display: flex; align-items: center">
            <div slot="label">
              <span>服务概要</span>
            </div>
            <div class="tips"><i class="el-icon-warning" style="margin-right: 10px"></i>上传后，可在小程序服务介绍中查看</div>
          </div>
          <el-upload ref="uploadDescription" class="upload-demo" :on-remove="handleDescriptionRemove" :http-request="handleDescriptionChange" action="" accept=".pdf" :file-list="descriptionList">
            <el-button type="danger" size="small">点击上传</el-button>
            <span slot="tip" class="el-upload__tip"> 只能上传pdf （大小10M以内）</span>
          </el-upload>
        </el-form-item>

        <!-- SOP文件 -->
        <el-form-item style="width: 700px" v-if="isShowBlock">
          <div style="display: flex; align-items: center">
            <div slot="label">
              <span>SOP文件</span>
            </div>
            <div class="tips"><i class="el-icon-warning" style="margin-right: 10px"></i>上传后，可在工单创建时及小程序服务介绍中查看</div>
          </div>
          <el-upload ref="uploadSop" class="upload-demo" :on-remove="handleSopRemove" :http-request="handleSopChange" action="" accept=".pdf" :file-list="sopFileList">
            <el-button type="danger" size="small">点击上传</el-button>
            <span slot="tip" class="el-upload__tip"> 只能上传pdf （大小10M以内）</span>
          </el-upload>
        </el-form-item>

        <!-- JSA文件 -->
        <el-form-item style="width: 700px" v-if="isShowBlock">
          <div style="display: flex; align-items: center">
            <div slot="label">
              <span>JSA文件</span>
            </div>
            <div class="tips"><i class="el-icon-warning" style="margin-right: 10px"></i>上传后，可在工单创建时及小程序服务介绍中查看</div>
          </div>
          <el-upload ref="uploadJsa" class="upload-demo" :on-remove="handleJsaRemove" :http-request="handleJsaChange" action="" accept=".pdf" :file-list="jsaFileList">
            <el-button type="danger" size="small">点击上传</el-button>
            <span slot="tip" class="el-upload__tip"> 只能上传pdf （大小10M以内）</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 删除提示 -->
      <el-dialog title="提示" :visible.sync="deleteClassificaFlag" width="30%" :before-close="handleClose">
        <div style="display: flex; align-items: center">
          <i class="delete-icon" :class="isCanDeleteFlag ? 'el-icon-warning' : 'el-icon-error'" :style="{ color: isCanDeleteFlag ? '#e6a23c' : '#dd0000' }"></i
          ><span>{{ isCanDeleteFlag ? "是否删除当前服务项？服务项删除后将无法找回" : "无法删除该服务项，当前服务项已被使用，无法删除。" }}</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteClassificaFlag = false" size="small">取 消</el-button>
          <el-button type="danger" @click="confirmDelete" size="small">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 取消提示 -->
      <el-dialog title="提示" :visible.sync="cancelFlag" width="30%" :before-close="handleClose">
        <div style="display: flex; align-items: center"><i class="delete-icon el-icon-warning" style="color: #e6a23c"></i><span>当前结果尚未保存，是否取消？</span></div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelFlag = false" size="small">取 消</el-button>
          <el-button type="danger" @click="confirmCancel('basic')" size="small">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 预览 -->
      <el-dialog title="预览" :visible.sync="priviewDialogFlag" custom-class="preview-dialog" width="490px">
        <div style="background-color: #f4f4f4; display: flex; align-items: center; flex-direction: column">
          <!-- 视频/图片/都无 -->
          <div style="width: 450px; height: 300px">
            <!-- 视频 -->
            <video v-if="videoPreUrl" style="width: 450px; height: 300px" controls="controls" :src="videoPreUrl"></video>
            <!-- 图片 -->
            <div v-if="!videoPreUrl && !videoCoverRealUrl && serviceImgList.length > 0" style="margin-top: 20px">
              <el-carousel indicator-position="outside">
                <el-carousel-item v-for="item in serviceImgList" :key="item">
                  <img :src="item.url" alt="" />
                </el-carousel-item>
              </el-carousel>
            </div>
            <img v-if="videoCoverRealUrl" style="position: absolute; top: 84px; left: 20px; width: 450px; height: 300px" :src="videoCoverRealUrl" alt="" id="image" />
            <img
              v-if="!videoPreUrl && !videoCoverRealUrl && serviceImgList.length == 0"
              style="position: absolute; top: 84px; left: 20px; width: 450px; height: 300px"
              src="../../assets/paper.jpg"
              alt=""
            />
            <!-- <img src="../../assets/video_play.png" alt="" style="position: absolute;top: 235px;left: 335px;cursor: pointer;"> -->
            <!-- 视频/图片切换按钮 -->
            <!-- <div style="background:#ccc" class="switch-btn">
                <div class="switch-item" :class="{activeItem:activeVideoFlag}" @click="switchBtnClick('video')">视频</div>
                <div class="switch-item" :class="{activeItem:activePicFlag}" @click="switchBtnClick('img')">图片</div>
              </div> -->
          </div>
          <!-- 服务介绍 -->
          <div style="background-color: #fff; padding: 10px; border-radius: 10px; position: relative; margin-top: -30px; width: 400px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); z-index: 9">
            <div style="font-size: 17px; font-weight: bold; margin: 5px 0 10px 0">服务介绍</div>
            <div style="color: rgb(153, 153, 153); line-height: 30px; padding-bottom: 10px">
              <p v-html="serviceShortDesc"></p>
            </div>
            <div class="serviceDownInfo">
              <div class="serviceDownTitCon">
                <div :class="[descriptionList.length > 0 ? 'serviceDownTit' : 'serviceDownTitdis']">服务概要</div>
                <div :class="[descriptionList.length > 0 ? 'serviceDownTitBot' : 'serviceDownTitBotdis']"></div>
              </div>
              <!-- <img src="../../assets/download-icon.png" :src='' alt="" class="serviceDownIcon"> -->
              <img :src="descriptionList.length > 0 ? require('../../assets/download-icon.png') : require('../../assets/download-icon-disable.png')" alt="" class="serviceDownIcon" />
            </div>
          </div>
          <div style="height: 20px"></div>
          <!-- 服务项目 -->
          <div style="background-color: #fff; padding: 10px 10px 20px 10px; border-radius: 10px; width: 400px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
            <div style="font-size: 17px; font-weight: bold; margin: 5px 0 10px 0">服务项目</div>
            <div class="change-oil-name" :style="'width:' + (basicForm.serviceName.length * 14 + 20) + 'px'">{{ basicForm.serviceName }}</div>
          </div>
          <div style="height: 20px"></div>
          <!-- 价格 -->
          <div v-if="basicForm.marketPriceShow" style="background-color: #fff; width: 100%; height: 60px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); display: flex; align-items: center">
            <div style="margin-left: 20px">
              市场建议价：<span style="font-size: 16px; font-weight: bold; color: rgb(0, 20, 80)">￥{{ basicForm.marketPrice }}</span>
            </div>
          </div>
        </div>
      </el-dialog>
      <el-dialog title="服务的行业已关联服务项" :visible.sync="serviceIndustryDialog" width="30%">
        <el-tree :data="serviceIndustryTree" :props="defaultProps" v-loading="serviceIndustryTreeLoading"></el-tree>
      </el-dialog>
      <OtherDrawer :siData="serviceIndustry" :visible="configServiceIndustryDialog" @close="csiDialogbeforeClose"></OtherDrawer>
    </el-scrollbar>
    <!-- 配置分数 -->
    <el-dialog title="服务级别-配置分数" :visible.sync="scoreDialog" width="25%" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="scoreForm" label-width="90px" :rules="scoreFormRules" ref="scoreFormRef">
        <el-form-item label="基础型服务" prop="base">
          <el-input size="small" clearable placeholder="请输入数字" v-model="scoreForm.base"></el-input>
        </el-form-item>
        <el-form-item label="增强型服务" prop="heighten">
          <el-input size="small" clearable placeholder="请输入数字" v-model="scoreForm.heighten"></el-input>
        </el-form-item>
        <el-form-item label="高阶型服务" prop="great">
          <el-input size="small" clearable placeholder="请输入数字" v-model="scoreForm.great"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelScore('scoreFormRef')">取 消</el-button>
        <el-button size="small" type="danger" @click="connfirmScore('scoreFormRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fullScreen_loading } from "../../generalComponents/fullScreenLoading";
import OSSClient from "../../utils/ossClient";
const oss_client = new OSSClient();
import serviceOptimize from "./serviceOptimize";
import addServiceItem from "./addSreviceItem/index";
import OtherDrawer from "./addSreviceItem/otherDrawer.vue";

export default {
  components: { OtherDrawer },
  mixins: [serviceOptimize, addServiceItem],
  data() {
    var checkPrice = (rule, value, callback) => {
      const reg = /^(?:[1-9]\d{0,7}|0)(?:\.\d{1,2})?$/;
      let val = value.trim().replace(/,/g, "");
      let parseVal = Number(val);
      let I;
      let F;
      if (parseVal) {
        I = parseVal.toString().indexOf(".") > 0 ? parseVal.toString().split(".")[0] : parseVal; // 整数
        F = parseVal.toString().indexOf(".") > 0 ? parseVal.toString().split(".")[1] : 0; // 小数
      } else {
        callback(new Error("请请入正确市场建议价"));
        return;
      }
      if (this.basicForm.marketPriceShow) {
        if (value == "") {
          callback(new Error("请请入市场建议价"));
        } else if (F > 0) {
          if (F.toString().length > 2) {
            callback(new Error("只能输入两位小数"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var validateScore = (rule, value, callback) => {
      const reg = /^([0-9]{1,2}|100)$/;
      if (rule.field == "base") {
        if (value != "" && !reg.test(value)) {
          callback(new Error("基础型服务请输入0-100的正整数"));
        } else {
          callback();
        }
      }
      if (rule.field == "heighten") {
        if (value != "" && !reg.test(value)) {
          callback(new Error("增强型服务请输入0-100的正整数"));
        } else {
          callback();
        }
      }
      if (rule.field == "great") {
        if (value != "" && !reg.test(value)) {
          callback(new Error("高阶型服务请输入0-100的正整数"));
        } else {
          callback();
        }
      }
    };
    return {
      filterMethod(query, item) {
        return item.companyName.indexOf(query) > -1;
      },
      reportTypeKey: 1,
      activeVideoFlag: false,
      activePicFlag: true,
      deleteClassificaFlag: false,
      isCanDeleteFlag: false,
      cancelFlag: false,
      mainminheight: `height:${document.documentElement.clientHeight - 132}px`,
      sopActionUrl: "",
      typeData: [
        { value: "0", label: "不使用模板" },
        { value: "1", label: "固定模板" },
        { value: "2", label: "自定义模板" },
      ],
      infoReportTemplateList: [
        { value: 0, label: "不使用" },
        { value: 1, label: "使用" },
      ],
      faultList: [], // 故障级联数据
      props: { multiple: false, value: "code", label: "name" },
      roleList: [],
      basicForm: {
        authorityroleIds: [],
        reportType: "",
        reportTypeMappingCode: [],
        serviceName: "",
        status: "",
        serType: "0",
        infoReportTemplate: 0,
        coreDataTemplateId: "",
        shortDesc: "",
        authorityType: 1,
        authorityDistributorNum: [],
        marketPrice: "",
        marketPriceShow: false,
        serviceDisplay: true,
        serviceType: 9,
        coreDataTemplateRoleIds: [],
        woFormType: "",
      },
      infoReportTemplateData: [],
      basicRules: {
        serviceName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        // serviceGrade: [{ required: true, message: "请选择服务级别", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        serviceType: [{ required: true, message: "请选择关联工单", trigger: "change" }],
        reportType: [{ required: true, message: "请选择模板", trigger: "change" }],
        reportTypeMappingCode: [{ required: true, message: "请选择故障种类", trigger: "change" }],
        shortDesc: [{ required: true, message: "请输入简介", trigger: "blur" }],
        // serviceIndustrys: [{ required: true, message: "请选择服务的行业", trigger: "change" }],
        serType: [{ required: true, message: "请选择报告模板", trigger: "change" }],
        infoReportTemplate: [{ required: true, message: "请选择信息录入模板", trigger: "change" }],
        coreDataTemplateId: [{ required: true, message: "请选择信息录入模板", trigger: "change" }],
        marketPriceShow: [{ required: true, message: "请选择市场建议价", trigger: "change" }],
        serviceDisplay: [{ required: true, message: "请选择新建服务项/工单", trigger: "change" }],
        marketPrice: [{ validator: checkPrice, required: true, trigger: "blur" }],
        authorityType: [{ required: true, message: "请选择操作权限", trigger: "change" }],
      },
      shortDescAutosize: { minRows: 14, maxRows: 20 },
      transferData: [],
      type: "",
      rowId: "",
      parentId: "",
      showBtn: false,
      sopFileList: [],
      jsaFileList: [],
      submitSopUrl: "",
      submitJsaUrl: "",
      isDisabled: false,
      relaseOrderList: [],
      // 改造三级
      videoFileList: [],
      serviceImgList: [],
      notShowUploadBtn: false,
      optionalForm: {
        videoCoverImgType: "",
        videoFullUrl: [],
      },
      customerCoverList: [],
      hideVideoCoverUpload: false,
      myHeaders: {},
      videoUploadUrl: `${process.env.api}/web/config/serviceConfiguration/uploadVideo`,
      customCoverImgPath: "", // 自定义封面半路径
      dialogCoverVisible: false, // 自定义封面弹框
      dialogCoverImageUrl: "", // 自定义封面路径
      videoHeight: "", // 视频的高
      videoWidth: "", // 视频的宽
      submitVideoUrl: "", // 提交视频路径
      submitVideoImgUrl: "", // 提交第一帧图片路径
      submitCustomerCoverImg: "", // 自定义封面路径
      videoPreUrl: "",
      imgDialogVisible: false,
      dialogImageUrl: "",
      priviewDialogFlag: false,
      loadingVideo: "",
      serviceShortDesc: "",
      radioList: [
        {
          label: "启用",
          value: 1,
        },
        {
          label: "停用",
          value: 0,
        },
      ],
      templateList: [],
      reportTypeList: [],
      descriptionUrl: "",
      descriptionList: [],
      isShowBlock: true,
      scoreDialog: false,
      scoreForm: {
        base: "",
        heighten: "",
        great: "",
      },
      scoreFormRules: {
        base: [{ validator: validateScore, trigger: "blur" }],
        heighten: [{ validator: validateScore, trigger: "blur" }],
        great: [{ validator: validateScore, trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.myHeaders = { MSDPAuthorization: this.getCookie(), Source: "web" };
  },
  created() {
    this.type = this.$route.query.type;
    this.rowId = this.$route.query.rowId;
    this.parentId = this.$route.query.parentId;
    this.basicForm.status = this.$route.query.defaultStatus;
    this.isDisabled = this.basicForm.status == 0;
    this.getInfoTemplateList("");
    this.getDistributorData();
    this.getRelaseOrderList();
    this.getTemplateOptionsList("");
    this.getDictionaryList();
    this.getRoleList();
    this.getCustomeFormReportType();
  },
  methods: {
    async getRoleList() {
      const params = {
        roleType: 0,
      };
      const res = await this.requestMethodGetTip("/web/system/permission/roleManage/list", params);
      res.data.data.forEach((item) => {
        item.key = item.accessTemplateId;
        item.name = item.accessTemplateName;
        item.label = item.accessTemplateName;
      });
      this.roleList = res.data.data;
    },
    // 配置分数
    configScore() {
      this.requestMethodGet("/emEcActivity/getServiceGrade", {}).then((res) => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          data.forEach((it) => {
            if (it.id == 1) {
              this.scoreForm.base = it.score;
            } else if (it.id == 2) {
              this.scoreForm.heighten = it.score;
            } else {
              this.scoreForm.great = it.score;
            }
          });
          this.scoreDialog = true;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error",
          });
        }
      });
    },
    cancelScore(formName) {
      this.scoreDialog = false;
      for (let key in this.scoreForm) {
        this.scoreForm[key] = "";
      }
      this.$refs[formName].resetFields();
    },
    connfirmScore(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const scoreList = [
            {
              id: 1,
              name: "基础型服务",
              score: this.scoreForm.base,
            },
            {
              id: 2,
              name: "增强型服务",
              score: this.scoreForm.heighten,
            },
            {
              id: 3,
              name: "高阶型服务",
              score: this.scoreForm.great,
            },
          ];
          this.requestMethodPost("/emEcActivity/setServiceGrade", scoreList).then((res) => {
            if (res.data.code == 1000) {
              this.$message.success("配置成功");
              this.cancelScore(formName);
            } else {
              this.$message({
                message: res.data.msg,
                type: "error",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    getInfoTemplateList(val) {
      let params = {
        name: val,
        type: 2,
      };
      this.requestMethodGet("/service/report/template/queryTemplateConfList", params).then((res) => {
        if (res.data.code == 1000) {
          this.infoReportTemplateData = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error",
          });
        }
      });
    },
    templateInfoAllFilter(val) {
      this.getInfoTemplateList(val);
    },
    clearInfoTemplate(val) {
      if (!val) {
        this.getInfoTemplateList("");
        this.roleList = [];
      }
    },
    infoReportTypeChange(val) {
      this.$set(this.basicForm, "infoReportTemplate", val);
      this.$forceUpdate();
    },
    faultListChange() {
      ++this.reportTypeKey;
    },
    // 获取故障种类数据
    getDictionaryList() {
      let params = {
        likeCode: "gzzl",
        parentLevel: 1,
      };
      this.requestMethodGet("/weChat/common/dic/getDictionaryListTreeOrderBySort", params).then(async (res) => {
        if (res.data.code === 1000) {
          this.faultList = res.data.data;
          if (this.rowId) {
            await this.getServiceItemDetail(this.rowId);
            this.basicForm.authorityroleIds = this.basicForm.authorityRole ? this.basicForm.authorityRole.split(",") : [];
          }
        }
      });
    },
    reportTypeChange(val) {
      if (val != 2) {
        this.$set(this.basicForm, "woFormType", "");
      }
      this.$set(this.basicForm, "serType", val);
      this.$forceUpdate();
    },
    getTemplateOptionsList(val) {
      this.requestMethodGet("/service/report/template/queryTemplateConfList", { name: val, type: 1 }).then((res) => {
        if (res.data.code === 1000) {
          this.templateList = res.data.data;
        }
      });
    },
    getCustomeFormReportType() {
      const params = {
        current: 1,
        size: 30,
      };
      this.requestMethodGet("/wo/formConfig/getWoFormTypeForConf", params).then((res) => {
        if (res.data.code === 1000) {
          res.data.data.list.forEach((item) => {
            item.value = item.code;
            item.name = item.name;
          });
          this.reportTypeList = res.data.data.list;
        }
      });
    },
    // 模板的模糊搜索
    templateAllFilter(val) {
      this.getTemplateOptionsList(val);
    },
    // 清空模板的模糊搜索内容
    clearTemplate(val) {
      if (!val) {
        this.getTemplateOptionsList("");
      }
    },
    marketPriceShowChange() {
      this.basicForm.marketPrice = "";
    },
    marketChange(val) {
      if (val.length > 8) {
      }
    },
    serviceTypeChange(val) {
      if (val == 3) {
        this.basicForm.authorityType = 1;
        this.basicForm.marketPriceShow = false;
      }
      this.isShowBlock = !(val == 1);
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 132}px`;
    },
    // 市场建议价格式化
    marketPriceFormate(val) {
      let price = "";
      if (val.indexOf(".") > 0) {
        price = String(val.split(".")[0]).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + String(val.split(".")[1]);
      } else {
        price = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + "00";
      }
      this.basicForm.marketPrice = price;
    },
    // 反格式化
    marketPriceFocus(val) {
      let value = "";
      if (val) {
        const i = val.split(".")[0];
        const f = val.split(".")[1];
        if (parseInt(f) > 0) {
          // 有小数
          value = val;
        } else {
          // 无小数
          value = i;
        }
      }
      this.basicForm.marketPrice = value.replace(/,/g, "");
    },
    // 获取关联工单值
    getRelaseOrderList() {
      this.getDicDataList("service_type_code").then((res) => {
        res.forEach((item) => {
          item.code = Number(item.code);
        });
        this.relaseOrderList = res;
      });
    },
    // 查询详情
    async getServiceItemDetail(val) {
      const params = {
        id: val,
      };
      await this.requestMethodGet("/web/config/serviceConfiguration/queryServiceConfInfoById", params).then(async (res) => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          if (data.woFormType) {
            data.serType = "2";
          } else if (data.reportType == "0") {
            data.serType = "0";
            data.reportType = "";
          } else {
            data.serType = "1";
          }
          if (!data.coreDataTemplateId) {
            data.infoReportTemplate = 0;
            data.coreDataTemplateId = "";
          } else {
            data.infoReportTemplate = 1;
          }
          this.isShowBlock = data.serviceType != 1;
          this.basicForm = Object.assign({}, this.basicForm, data);
          this.basicForm.woFormType = this.basicForm.woFormType ? this.basicForm.woFormType.toString() : "";
          this.basicForm.serviceDisplay = this.basicForm.serviceDisplay ? true : false;
          this.basicForm.coreDataTemplateRoleIds = data.coreDataTemplateRoleIds ? data.coreDataTemplateRoleIds.split(",").map((i) => parseInt(i)) : [];
          // 对故障种类数据处理，获取故障种类的一级和二级
          if (this.basicForm.reportTypeMappingCode) {
            this.faultList.forEach((itemA) => {
              if (itemA.children && itemA.children.length > 0) {
                itemA.children.forEach((itemB) => {
                  if (itemB.code == this.basicForm.reportTypeMappingCode) {
                    this.basicForm.reportTypeMappingCode = [itemB.parentCode, itemB.code];
                  }
                });
              }
            });
          }
          if (this.basicForm.authorityType == 2) {
            if (this.basicForm.authorityDistributorNum.length > 0) {
              this.basicForm.authorityDistributorNum = this.basicForm.authorityDistributorSelectedNums || [];
            }
          } else {
            this.basicForm.authorityDistributorNum = [];
          }
          this.basicForm.serviceIndustrys = this.basicForm.serviceIndustrys ? this.basicForm.serviceIndustrys.split(",") : [];
          const val = String(this.basicForm.marketPrice);
          let price = "";
          if (val.indexOf(".") > 0) {
            price = String(val.split(".")[0]).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + String(val.split(".")[1]);
          } else {
            price = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + "00";
          }
          this.basicForm.marketPrice = price;
          this.basicForm.status = String(this.basicForm.status);
          // 视频
          if (data.videoUrl) {
            this.videoFileList = [
              {
                name: data.videoUrl.split("/")[data.videoUrl.split("/").length - 1],
                url: data.videoUrl,
              },
            ];
            this.submitVideoUrl = data.videoUrl;
            this.videoHeight = data.videoHeight;
            this.videoWidth = data.videoWidth;
            this.videoPreUrl = await this.fileGetFullPath(data.videoUrl);
            // 视频封面
            this.optionalForm.videoCoverImgType = data.videoCoverImgType;
            // 推荐封面
            // this.videoCoverRealUrl = await this.fileGetFullPath(data.videoCoverImgUrl);
            // this.submitVideoImgUrl = data.videoCoverImgUrl; // 推荐封面半路经提交时用
            const coverFullUrl = await this.requestMethodGet("/web/file/getVideoCoverPath", {
              videoPath: data.videoUrl,
            });
            this.videoCoverRealUrl = coverFullUrl.data.data;
            // 自定义封面
            if (data.videoCoverImgType == 2) {
              this.customerCoverList.push({
                url: await this.fileGetFullPath(data.customVideoCoverImgUrl),
              });
              this.submitCustomerCoverImg = data.customVideoCoverImgUrl;
              this.hideVideoCoverUpload = this.customerCoverList.length >= 1;
            }
          }
          // 图片
          let list = [];
          if (data.serviceImgUrl) {
            let serviceImgUrlList = data.serviceImgUrl.split(",");
            serviceImgUrlList.forEach(async (item, index) => {
              let obj = {};
              obj.uid = index;
              obj.submitImgUrl = item;
              obj.url = await this.fileGetFullPath(item);
              list.push(obj);
            });
          }
          this.serviceImgList = list;
          this.notShowUploadBtn = this.serviceImgList.length >= 3;
          // sop文件
          let sopName;
          let sopList = [];
          if (data.sopUrl) {
            sopName = data.sopUrl.split("/")[data.sopUrl.split("/").length - 1];
            sopList.push({
              name: sopName,
              url: data.sopUrl,
            });
          }
          this.submitSopUrl = data.sopUrl;
          this.sopFileList = sopList;
          // this.showBtn = this.sopFileList.length>0
          // JSA文件
          let jsaName;
          let jsaList = [];
          if (data.jsaUrl) {
            jsaName = data.jsaUrl.split("/")[data.jsaUrl.split("/").length - 1];
            jsaList.push({
              name: jsaName,
              url: data.jsaUrl,
            });
          }
          this.submitJsaUrl = data.jsaUrl;
          this.jsaFileList = jsaList;
          // 服务概要
          let descriptionName;
          let descriptionList = [];
          if (data.descriptionUrl) {
            descriptionName = data.descriptionUrl.split("/")[data.descriptionUrl.split("/").length - 1];
            this.descriptionUrl = data.descriptionUrl;
            descriptionList.push({
              name: descriptionName,
              url: data.descriptionUrl,
            });
            this.descriptionList = descriptionList;
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning",
          });
        }
      });
    },
    // 获取经销商穿梭框数据源
    getDistributorData() {
      const params = {
        parentId: this.parentId,
      };
      this.requestMethodGet("/web/config/serviceConfiguration/queryCompanyListForSelectOfCustomer", params).then((res) => {
        if (res.data.code == 1000) {
          this.transferData = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning",
          });
        }
      });
    },
    /***********************************************************************/
    // 删除上传的视频前置
    beforeRemove() {
      this.resetVideo();
    },
    // 删除上传的视频
    handleVideoRemove() {
      this.resetVideo();
    },
    resetVideo() {
      this.videoFileList = [];
      this.videoRealUrl = "";
      this.optionalForm.videoCoverImgType = "";
      this.videoCoverRealUrl = "";
      this.hideVideoCoverUpload = false;
      this.customerCoverList = [];
      this.submitCustomerCoverImg = "";
      this.videoPreUrl = "";
      this.videoHeight = 0;
      this.videoWidth = 0;
      (this.submitVideoUrl = ""), // 提交视频路径
        (this.submitVideoImgUrl = ""),
        (this.optionalForm.coverImgList = []);
    },
    // 上传视频变化事件
    handleVideoChange(file, fileList) {
      if (!file.raw.type.startsWith("video/mp4")) {
        fileList.pop();
        this.$message.error("只能上传mp4类型视频");
        return;
      }
      const size = file.size / 1024 / 1024 < 100;
      if (!size) {
        fileList.pop();
        this.$message.error("上传视频大小不能超过 100MB!");
        return;
      }
      this.hideVideoUpload = true;
      this.$refs.upload.submit();
    },
    beforUpload() {
      this.loadingVideo = this.$loading({
        lock: true,
        text: "视频上传中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    // 文件上传过程中的函数(在这里获取进度条的进度)
    uploadFileProcess(event, file, fileList) {
      if ((file.percentage > 50 && file.percentage < 100) || file.size / 1024 / 1024 < 5) {
        file.progressFlag = true;
        event.percent = 90;
      }
    },
    // 上传成功
    async uploadVideoSuccess(response, file, fileList) {
      const data = response.data;
      const videoFullUrl = await this.requestMethodGet("/web/file/getFullUrl", {
        url: data.videoUrl,
      });
      const coverFullUrl = await this.requestMethodGet("/web/file/getVideoCoverPath", {
        videoPath: data.videoUrl,
      });
      this.videoPreUrl = videoFullUrl.data.data;
      this.optionalForm.videoFullUrl = [];
      this.optionalForm.videoFullUrl.push({
        url: videoFullUrl.data.data,
      });
      this.videoCoverRealUrl = coverFullUrl.data.data;
      // 提交数据时路径
      this.submitVideoUrl = data.videoUrl; // 视频路径
      this.videoHeight = data.videoHeight;
      this.videoWidth = data.videoWidth;
      // this.submitVideoImgUrl = coverFullUrl.data.data; // 第一帧图片路径
      this.videoFileList = [
        {
          name: file.name,
          url: file.url,
        },
      ];
      this.optionalForm.videoCoverImgType = 1;
      this.uploadVideoFlag = true;
      this.loadingVideo.close();
    },
    // 上传失败
    uploadVideoError(err, file, fileList) {
      this.resetVideo();
    },
    // 删除视频
    deleteVideo() {
      this.resetVideo();
    },
    // 自定义封面上传事件
    async handleCustomerCoverChange(file, fileList) {
      if (!file.file.type.startsWith("image")) {
        this.customerCoverList = [];
        this.$message.error("只能上传图片类型文件");
        return;
      }
      const size = file.file.size / 1024 / 1024 < 10;
      if (!size) {
        this.customerCoverList = [];
        this.$message.error("上传图片大小不能超过 10MB!");
        return;
      }
      fullScreen_loading.LOADING();
      await oss_client.getOSSClientInstance("service_conf_img");
      const uploadFileRes = await oss_client.uploadFile(file.file, file.file.name);
      fullScreen_loading.ENDLOADING();
      if (uploadFileRes && uploadFileRes.name) {
        this.submitCustomerCoverImg = uploadFileRes.name;
        this.customCoverImgPath = uploadFileRes.name;
        this.getFullCoverImgPath(uploadFileRes.name);
      } else {
        this.$message({
          type: "warning",
          message: "文件上传失败，请稍后重试。",
        });
      }
    },
    // 自定义封面获取全路径
    getFullCoverImgPath(path) {
      const params = {
        url: path,
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then((res) => {
        if (res.data.code == 1000) {
          this.customerCoverList.push({
            url: res.data.data,
          });
          this.hideVideoCoverUpload = this.customerCoverList.length >= 1;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning",
          });
        }
      });
    },
    // 自定义封面预览
    handlePictureCoverCardPreview(file) {
      this.dialogCoverImageUrl = file.url;
      this.dialogCoverVisible = true;
    },
    // 自定义封面删除
    handleVideoCustomerCoverRemove(file, fileList) {
      this.hideVideoCoverUpload = false;
      this.dialogCoverImageUrl = "";
      this.submitCustomerCoverImg = "";
      this.customerCoverList = [];
    },
    // 添加照片
    async handleAddImg(file, fileList) {
      if (!file.file.type.startsWith("image")) {
        this.$message.error("只能上传图片类型文件");
        fileList.pop();
        return;
      }
      const isLt2M = file.file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 20MB!");
        fileList.pop();
        return;
      }
      fullScreen_loading.LOADING();
      await oss_client.getOSSClientInstance("service_conf_img");
      const uploadFileRes = await oss_client.uploadFile(file.file, file.file.name);
      fullScreen_loading.ENDLOADING();
      if (uploadFileRes && uploadFileRes.name) {
        this.getFullImgPath(uploadFileRes.name);
      } else {
        this.$message({
          type: "warning",
          message: "文件上传失败，请稍后重试。",
        });
      }
    },
    // 图片上传获取全路径
    getFullImgPath(path) {
      const params = {
        url: path,
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then((res) => {
        if (res.data.code == 1000) {
          this.serviceImgList.push({
            url: res.data.data,
            submitImgUrl: path,
          });
          this.notShowUploadBtn = this.serviceImgList.length >= 3;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning",
          });
        }
      });
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.serviceImgList.forEach((item) => {
        if (item.uid == file.uid) {
          this.dialogImageUrl = item.url;
        }
      });
      this.imgDialogVisible = true;
    },
    // 删除图片
    removeFileChange(file) {
      this.serviceImgList.forEach((item, index) => {
        if (item.uid == file.uid) {
          this.serviceImgList.splice(index, 1);
        }
      });
      this.notShowUploadBtn = this.serviceImgList.length >= 3;
    },
    // sop上传文件
    async handleSopChange(file, fileList) {
      console.log(file);

      var testmsg = file.file.name.substring(file.file.name.lastIndexOf(".") + 1);
      if (testmsg !== "pdf") {
        this.$message.error("只能上传pdf类型文件");
        fileList.pop();
        this.$refs.uploadSop.abort();
        return;
      }
      const fileSize = file.file.size / 1024 / 1024 < 10;
      if (!fileSize) {
        this.$message.error("上传sop文件大小不能超过 10MB!");
        fileList.pop();
        this.$refs.uploadSop.abort();
        return;
      }
      fullScreen_loading.LOADING();
      await oss_client.getOSSClientInstance("service_conf_file");
      const uploadFileRes = await oss_client.uploadFile(file.file, file.file.name);
      fullScreen_loading.ENDLOADING();
      if (uploadFileRes && uploadFileRes.name) {
        this.submitSopUrl = uploadFileRes.name;
        this.sopFileList = [
          {
            name: file.file.name,
            url: this.submitSopUrl,
          },
        ];
      } else {
        this.$message({
          type: "warning",
          message: "文件上传失败，请稍后重试。",
        });
      }
    },
    //   sop删除文件
    handleSopRemove(file, fileList) {
      this.sopFileList = [];
      this.submitSopUrl = "";
      // this.showBtn = this.sopFileList.length>0
    },
    // sop上传文件
    async handleJsaChange(file, fileList) {
      var testmsg = file.file.name.substring(file.file.name.lastIndexOf(".") + 1);
      if (testmsg !== "pdf") {
        this.$message.error("只能上传pdf类型文件");
        fileList.pop();
        this.$refs.uploadSop.abort();
        return;
      }
      const fileSize = file.file.size / 1024 / 1024 < 10;
      if (!fileSize) {
        this.$message.error("上传jsa文件大小不能超过 10MB!");
        fileList.pop();
        this.$refs.uploadJsa.abort();
        return;
      }
      fullScreen_loading.LOADING();
      await oss_client.getOSSClientInstance("service_conf_file");
      const uploadFileRes = await oss_client.uploadFile(file.file, file.file.name);
      fullScreen_loading.ENDLOADING();
      if (uploadFileRes && uploadFileRes.name) {
        this.submitJsaUrl = uploadFileRes.name;
        this.jsaFileList = [
          {
            name: file.file.name,
            url: this.submitJsaUrl,
          },
        ];
      } else {
        this.$message({
          type: "warning",
          message: "文件上传失败，请稍后重试。",
        });
      }
    },
    //   sop删除文件
    handleJsaRemove(file, fileList) {
      this.jsaFileList = [];
      this.submitJsaUrl = "";
    },
    // 返回
    back() {
      this.$router.go(-1);
    },
    // 取消
    cancelItems(formName) {
      if (this.type == "edit") {
        this.cancelFlag = true;
      } else {
        this.$refs[formName].resetFields();
        this.back();
      }
    },
    // 确定取消
    confirmCancel(formName) {
      this.cancelFlag = false;
      this.$refs[formName].resetFields();
      this.back();
    },
    // 删除
    deleteItems() {
      const params = {
        id: this.rowId,
      };
      this.requestMethodGet("/web/config/serviceConfiguration/deleteCheckById", params).then((res) => {
        if (res.data.code == 1000) {
          if (res.data.data) {
            // 可以删除
            this.isCanDeleteFlag = true;
          } else {
            // 不可以删除
            this.isCanDeleteFlag = false;
          }
          this.deleteClassificaFlag = true;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning",
          });
        }
      });
    },
    // 确定删除
    confirmDelete() {
      const params = {
        id: this.rowId,
      };
      this.requestMethodPost("/web/config/serviceConfiguration/deleteServiceConfInfoById", params).then((res) => {
        if (res.data.code == 1000) {
          this.deleteClassificaFlag = false;
          this.basicForm = {
            serviceName: "",
            status: "",
            shortDesc: "",
            authorityType: "",
            authorityDistributorNum: [],
            marketPrice: "",
          };
          this.back();
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning",
          });
        }
      });
    },
    // 提交
    submitItems(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let imgUrl = [];
          let url;
          let imgUrlStr = "";
          if (this.serviceImgList.length > 0) {
            this.serviceImgList.forEach((it) => {
              imgUrl.push(it.submitImgUrl);
            });
          }
          imgUrlStr = imgUrl.toString();
          if (this.basicForm.serviceType !== 9 && this.basicForm.serviceType !== 10) {
            this.basicForm.serType = "0";
            this.basicForm.reportType = "";
            this.basicForm.reportTypeMappingCode = "";
            this.basicForm.infoReportTemplate = 0;
            this.basicForm.coreDataTemplateId = null;
          }
          if (this.basicForm.serType == "0") {
            this.basicForm.reportType = "0";
          }
          let param = {
            parentId: this.parentId,
            serviceLevel: 3,
          };
          if (this.type == "add") {
            // 新增
            url = "/web/config/serviceConfiguration/addServiceConf";
          } else {
            // 编辑
            param.id = this.rowId;
            url = "/web/config/serviceConfiguration/updateServiceConfInfoById";
          }
          if (this.basicForm.authorityType == 2) {
            if (this.basicForm.authorityDistributorNum.length > 0) {
              this.basicForm.authorityDistributorNum = this.basicForm.authorityDistributorNum.toString();
            } else {
              this.$message({
                type: "warning",
                message: "请选择指定经销商",
              });
              return;
            }
          } else {
            this.basicForm.authorityDistributorNum = "";
          }
          if (this.basicForm.marketPriceShow) {
            this.basicForm.marketPrice = this.basicForm.marketPrice.replace(/,/g, "");
          } else {
            this.basicForm.marketPrice = "";
          }
          const params = Object.assign({}, param, this.basicForm, this.optionalForm);
          params.sopUrl = this.submitSopUrl;
          params.jsaUrl = this.submitJsaUrl;
          params.serviceImgUrl = imgUrlStr;
          params.videoUrl = this.submitVideoUrl;
          params.videoHeight = this.videoHeight;
          params.videoWidth = this.videoWidth;
          params.serviceDisplay = params.serviceDisplay ? 1 : 0;
          // params.videoCoverImgUrl = this.optionalForm.videoCoverImgType == 2 ? this.submitVideoImgUrl:'';
          params.customVideoCoverImgUrl = this.optionalForm.videoCoverImgType == 2 ? this.submitCustomerCoverImg : "";
          params.descriptionUrl = this.descriptionUrl;
          if (params.reportType != "14") {
            params.reportTypeMappingCode = "";
          } else {
            params.reportTypeMappingCode = params.reportTypeMappingCode[1];
          }
          if (!params.infoReportTemplate) {
            params.coreDataTemplateId = 0;
          }
          if (this.basicForm.authorityType == 3 && !this.basicForm.authorityroleIds.length) {
            return this.$message({
              message: "请选择指定可操作角色",
              type: "warning",
            });
          }
          if (this.basicForm.authorityType == 3) {
            console.log(this.basicForm.authorityroleIds);
            let arr = this.basicForm.authorityroleIds.filter(Boolean);
            params.authorityRole = arr.join(",");
          } else if (this.basicForm.authorityType != 3) {
            params.authorityRole = "";
          }
          params.serviceIndustrys = params.serviceIndustrys.join(",");
          params.coreDataTemplateRoleIds = this.basicForm.coreDataTemplateRoleIds.join(",");
          // if (!this.basicForm.woFormType) delete params.woFormType;
          this.requestMethodPost(url, params).then((res) => {
            if (res.data.code == 1000) {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              setTimeout(() => {
                this.back();
              }, 800);
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning",
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 预览
    priviewItems(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.serviceShortDesc = this.basicForm.shortDesc.replace(/\n/g, "<br/>");
          this.priviewDialogFlag = true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 视频/图片切换按钮点击
    switchBtnClick(type) {
      if (type == "video") {
        if (!this.activeVideoFlag) {
          this.activeVideoFlag = true;
          this.activePicFlag = false;
        }
      } else {
        if (!this.activePicFlag) {
          this.activeVideoFlag = false;
          this.activePicFlag = true;
        }
      }
    },
    // 服务文档上传文档
    async handleDescriptionChange(file, fileList) {
      const isPdf = file.file.name.substring(file.file.name.lastIndexOf(".")) == ".pdf";
      if (!isPdf) {
        this.$message.error("只能上传pdf类型文件");
      }
      const ispdfLimit = file.file.size / 1024 / 1024 < 10;
      if (!ispdfLimit) {
        this.$message.error("上传文件大小不能超过 10MB!");
      }
      if (!ispdfLimit || !isPdf) {
        fileList.pop();
        this.$refs.uploadDescription.abort();
        return;
      }
      fullScreen_loading.LOADING();
      await oss_client.getOSSClientInstance("service_conf_file");
      const uploadFileRes = await oss_client.uploadFile(file.file, file.file.name);
      fullScreen_loading.ENDLOADING();
      if (uploadFileRes && uploadFileRes.name) {
        this.descriptionUrl = uploadFileRes.name;
        this.descriptionList = [
          {
            name: file.file.name,
            url: this.descriptionUrl,
          },
        ];
      } else {
        this.$message({
          type: "warning",
          message: "文件上传失败，请稍后重试。",
        });
      }
    },
    // 服务文档删除文当
    handleDescriptionRemove(file, fileList) {
      this.descriptionList = [];
      this.descriptionUrl = "";
    },
    // 所有文件通过半路径获取全路径
    async fileGetFullPath(halfPath) {
      const res = await this.requestMethodGet("/web/file/getFullUrl", {
        url: halfPath,
      });
      if (res.data.code == 1000) {
        return Promise.resolve(res.data.data);
      } else {
        this.$message({
          type: "warning",
          message: "获取全路径失败，请稍后重试。",
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.basic-content-title {
  height: 50px;
  // width: 100%;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  padding-left: 20px;
  border-top: 1px solid #e9e9e9;
  border-bottom: 1px solid #e9e9e9;
  .line {
    width: 4px;
    height: 14px;
    background: #dd0000;
    margin-right: 10px;
  }
}
/deep/.el-radio__input.is-checked .el-radio__inner {
  border-color: #001450 !important;
  background: #001450 !important;
}
.tips {
  width: 472px;
  height: 36px;
  line-height: 36px;
  font-size: 13px;
  margin: 20px 0 24px 20px;
  background-color: #ccddff;
  border-radius: 4px;
  padding-left: 20px;
}
.add-content {
  overflow-y: auto;
}
/deep/ .el-transfer-panel {
  width: 300px;
}
.delete-icon {
  margin-right: 10px;
  font-size: 24px;
}
/deep/ .el-upload-list__item {
  transition: none !important;
}
// 三级改造
.noShowServiceImgList /deep/ .el-upload--picture-card {
  display: none !important;
}
.recommended-cover {
  width: 750px;
  height: 422px;
}
.vido-content {
  width: 750px;
  height: 422px;
  object-fit: fill;
}
.mask {
  position: absolute;
  background: rgba(245, 108, 108, 1);
  color: #ffffff;
  opacity: 0;
  top: 0;
  width: 751px;
  height: 20px;
  top: 403px;
  left: 68px;
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
.delete-icon {
  margin-right: 10px;
  font-size: 24px;
}
.noBtnUpload /deep/ .el-upload--picture-card {
  display: none !important;
}
.switch-btn {
  display: flex;
  align-items: center;
  width: 160px;
  background: red;
  height: 40px;
  border-radius: 20px;
  position: absolute;
  bottom: 110px;
  right: 60px;
  color: #000;
}
.switch-item {
  display: flex;
  justify-content: center;
  width: 80px;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  cursor: pointer;
}
.activeItem {
  background-color: rgb(211, 0, 0);
  color: #fff;
}
// .preview-dialog .el-dialog__body{
//   background-color: #f4f4f4;
//   padding: 0;
// }
.change-oil-name {
  font-size: 14px;
  color: rgb(255, 255, 255);
  background-color: rgb(204, 221, 255);
  padding: 10px 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.serviceDownInfo {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  .serviceDownTitCon {
    margin-right: 10px;
    .serviceDownTit {
      font-size: 16px;
      font-weight: bold;
      color: #00144f;
    }
    .serviceDownTitdis {
      font-size: 16px;
      font-weight: bold;
      color: #ccc;
    }
    .serviceDownTitBot {
      margin-top: -2px;
      height: 8px;
      border-radius: 8px 0 0 8px;
      width: 100%;
      background: linear-gradient(left, #e6eeff, rgb(255, 255, 255));
    }
    .serviceDownTitBotdis {
      margin-top: -2px;
      height: 8px;
      border-radius: 8px 0 0 8px;
      width: 100%;
      background: linear-gradient(left, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0));
    }
  }
  .serviceDownIcon {
    width: 24px;
    display: block;
  }
}
.serviceIndustry-btn {
  width: 100%;
  padding: 10px 0 5px;
  text-align: center;
  list-style: none;
}
</style>
<style>
.add-service-content .preview-dialog .el-dialog__body {
  background-color: #f4f4f4;
  padding: 0;
}
</style>
