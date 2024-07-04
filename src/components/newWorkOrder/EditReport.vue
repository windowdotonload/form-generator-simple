<template>
  <div class="work-order-component" :style="mainminheight">
    <div>
      <div style="height: 100%; width: 300px">
        <!-- 跳转到指定模块 -->
        <div class="btn-box">
          <ul class="navgator">
            <li class="navgatorLi" :class="{ isActive: index === navgatorIndex }" @click="handleLeft(index)" v-for="(item, index) in navgator" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
      <div :style="clintminheight">
        <div style="height: 100%; padding-left: 300px; padding-bottom: 70px; overflow-y: auto" class="xq-box" ref="xqBox">
          <div>
            <span class="base-publish unPublish" v-if="stepList.publishStatus == 0">未发布</span>
            <span class="base-publish published" v-if="stepList.publishStatus == 1">已发布</span>
            <span style="font-family: MicrosoftYaHei-Bold; color: #000; font-size: 16px; line-height: 16px; font-weight: bold">{{ stepList.draftName }}</span>
          </div>
          <div v-if="deviceDetail.reportType == '4' || deviceDetail.reportType == '5' || deviceDetail.reportType == '6' || deviceDetail.reportType == '7' || deviceDetail.reportType == '8'">
            <!-- 设备&润滑点信息 -->
            <DeviceInfo
              id="id0"
              v-if="hasDevice"
              ref="deviceRef"
              :type="type"
              @fatherMethod6="fatherMethod6"
              :deviceName="deviceName"
              :deviceDetail="deviceDetail"
              :deviceObj="deviceObj"
              v-on:passModulValidate="passModulValidate1"
            />
            <!-- 运行参数 operationParametersObj -->
            <OperationParameters
              id="id1"
              v-if="hasOperationParameters"
              ref="OperationParametersRef"
              :type="type"
              @fatherMethod="fatherMethod"
              @fatherMethod1="fatherMethod1"
              :OperationParametersNodeName="OperationParametersNodeName"
              :operationParametersObj="operationParametersObj"
              v-on:passModulValidate="passModulValidate9"
            />
            <!-- 润滑系统检查 -->
            <LubricationSystemInspection
              id="id2"
              v-if="hasLubricationSystemInspection"
              ref="LubricationSystemInspectionRef"
              @fatherMethod6="fatherMethod6"
              @fatherMethod7="fatherMethod7"
              :type="type"
              :defaultNoticeDto="defaultNoticeDto"
              :dynamicItemDto="dynamicItemDto"
              :hydraulicPumpObj="hydraulicPumpObj"
              :chiLunItemDto="chiLunItemDto"
              :deviceObj="deviceObj"
              :operationParametersObj="operationParametersObj"
              :LubricationSystemInspectionName="LubricationSystemInspectionName"
              :lubricationSystemInspectionObj="lubricationSystemInspectionObj"
              :deviceDetail="deviceDetail"
              v-on:passModulValidate="passModulValidate10"
            />
            <!-- 润滑改进建议 -->
            <OverallSituation
              id="id3"
              v-if="hasOverallSituation"
              ref="OverallSituationRef"
              :type="type"
              :overallSituationName="overallSituationName"
              :overallSituationObj="overallSituationObj"
              v-on:passModulValidate="passModulValidate11"
            />
            <!-- 附录 -->
            <appendixNew
              id="id4"
              v-if="showAppendixNew"
              ref="appendixNewRef"
              :stepList="appendixNewStepList"
              :cardItem="appendixNewStepList[0]"
              :addFieldPoolDtoList="addFieldPoolDtoList"
              :paramReportType="deviceDetail.reportType"
            ></appendixNew>
          </div>
          <!-- 换油报告 -->
          <div v-if="deviceDetail.reportType == '1'">
            <!-- 设备&润滑点信息 -->
            <DeviceInfo
              id="id0"
              v-if="hasDevice"
              ref="deviceRef"
              :type="type"
              @fatherMethod="fatherMethodWind"
              :deviceName="deviceName"
              :deviceDetail="deviceDetail"
              :deviceObj="deviceObj"
              v-on:passModulValidate="passModulValidate1"
            />
            <!-- 风机参数 -->
            <SupplementaryInfoWind
              id="id1"
              v-if="hasSupplementary"
              ref="supplementaryRef1"
              :type="type"
              :deviceDetail="deviceDetail"
              :moduleTitle="moduleTitleOne"
              :deviceObj="deviceObj"
              :supplementaryObj1="supplementaryObjOne"
              v-on:passModulValidate="passModulValidate2Wind"
            />
            <SupplementaryInfo
              id="id2"
              v-if="hasSupplementary"
              ref="supplementaryRef"
              :deviceDetail="deviceDetail"
              :type="type"
              :moduleTitle="moduleTitleTwo"
              :deviceObj="deviceObj"
              :supplementaryObj="supplementaryObjTwo"
              v-on:passModulValidate="passModulValidate2"
            />
            <!-- 换油记录 -->
            <OilChangeHistory
              id="id3"
              v-if="hasParams"
              ref="oilChangeRef"
              :type="type"
              :deviceObj="deviceObj"
              :oilChangeObj="oilChangeObj"
              :stepListLength="stepListLength"
              v-on:passModulValidate="passModulValidate3"
            />
            <!-- 验油数据 -->
            <OilData
              id="id4"
              v-if="hasCheckOilData"
              ref="checkOilRef"
              :type="type"
              :deviceDetail="deviceDetail"
              :defaultNodeDto="defaultNodeDto"
              :checkOilDataObj="checkOilDataObj"
              :lubricationObj="lubricationObj"
              v-on:passModulValidate="passModulValidate4"
            />
            <!-- 运行情况 -->
            <Operation
              id="id5"
              v-if="hasOperation"
              ref="operationRef"
              :type="type"
              :deviceObj="deviceObj"
              :operationObj="operationObj"
              :lubricationObj="lubricationObj"
              v-on:passModulValidate="passModulValidate7"
            />
            <!-- 现场图片 -->
            <ScenePictures
              id="id6"
              v-if="hasScenePicturesObj"
              ref="scenePicturesRef"
              :type="type"
              :deviceObj="deviceObj"
              :operationObj="operationObj"
              :scenePicturesObj="scenePicturesObj"
              :lubricationObj="lubricationObj"
            />
            <!-- 人员信息 -->
            <PersonnelInfo id="id7" v-if="hasPersonnelInfo" ref="personnelInfoRef" :type="type" :personnelInfoObj="personnelInfoObj" v-on:passModulValidate="passModulValidate5" />
            <!-- 总结与建议 -->
            <Suggest
              id="id8"
              v-if="hasSuggest"
              ref="suggestRef"
              :deviceDetail="deviceDetail"
              :type="type"
              :deviceObj="deviceObj"
              :suggestObj="suggestObj"
              v-on:passModulValidate="passModulValidate6"
            />
            <!-- 客户信息 -->
            <CustomerMsg id="id0" v-if="hasCustomer" ref="CustomerMsgRef" :type="type" :customerObj="customerObj" v-on:passModulValidate="passModulValidate1" />
            <!-- 润滑推荐 -->
            <LubricationRecommended
              id="id1"
              v-if="hasLubricationRecommended"
              ref="LubricationRecommendedRef"
              :type="type"
              :workshopId="workshopId"
              :companyNumber="companyNumber"
              :contactCompanyName="contactCompanyName"
              :defaultNodeDto="defaultNodeDto"
              :defaultNodeWithDisabledInfoDto="defaultNodeWithDisabledInfoDto"
              :LubricationRecommendedObj="LubricationRecommendedObj"
              v-on:passModulValidate="passModulValidate8"
            />
            <!-- 运行参数 operationParametersObj -->
            <OperationParameters
              id="id1"
              v-if="hasOperationParameters"
              ref="OperationParametersRef"
              :type="type"
              @fatherMethod="fatherMethod"
              @fatherMethod1="fatherMethod1"
              @fatherMethod2="fatherMethod2"
              :OperationParametersNodeName="OperationParametersNodeName"
              :operationParametersObj="operationParametersObj"
              v-on:passModulValidate="passModulValidate9"
            />
            <OverallSituation
              id="id3"
              v-if="hasOverallSituation"
              ref="OverallSituationRef1"
              :type="type"
              :overallSituationName="overallSituationName"
              :overallSituationObj="overallSituationObj"
              v-on:passModulValidate="passModulValidate11"
            />
          </div>
          <div v-if="deviceDetail.reportType == '2'">
            <!-- 设备&润滑点信息 -->
            <DeviceInfo
              id="id0"
              v-if="hasDevice"
              ref="deviceRef"
              :type="type"
              :deviceName="deviceName"
              :deviceDetail="deviceDetail"
              :deviceObj="deviceObj"
              v-on:passModulValidate="passModulValidate1"
            />
            <!-- 验油数据 -->
            <OilData
              id="id1"
              v-if="hasCheckOilData"
              ref="checkOilRef"
              :type="type"
              :deviceDetail="deviceDetail"
              :defaultNodeDto="defaultNodeDto"
              :checkOilDataObj="checkOilDataObj"
              :lubricationObj="lubricationObj"
              v-on:passModulValidate="passModulValidate4"
            />
            <!-- 现场图片 -->
            <ScenePictures
              id="id2"
              v-if="hasScenePicturesObj"
              ref="scenePicturesRef"
              :type="type"
              :deviceObj="deviceObj"
              :operationObj="operationObj"
              :scenePicturesObj="scenePicturesObj"
              :lubricationObj="lubricationObj"
            />
            <!-- 总结与建议 -->
            <Suggest
              id="id12"
              v-if="hasSuggest"
              ref="suggestRef"
              :deviceDetail="deviceDetail"
              :type="type"
              :deviceObj="deviceObj"
              :suggestObj="suggestObj"
              v-on:passModulValidate="passModulValidate6"
            />
          </div>
          <div v-if="deviceDetail.reportType == '3'">
            <!-- 客户信息 -->
            <CustomerMsg id="id0" v-if="hasCustomer" ref="CustomerMsgRef" :type="type" :customerObj="customerObj" v-on:passModulValidate="passModulValidateCustomer" />
            <!-- 润滑推荐 -->
            <LubricationRecommended
              id="id1"
              v-if="hasLubricationRecommended"
              ref="LubricationRecommendedRef"
              :type="type"
              :workshopId="workshopId"
              :companyNumber="companyNumber"
              :reportType="reportType"
              :companyId="companyId"
              :contactCompanyName="contactCompanyName"
              :defaultNodeDto="defaultNodeDto"
              :defaultNodeWithDisabledInfoDto="defaultNodeWithDisabledInfoDto"
              :LubricationRecommendedObj="LubricationRecommendedObj"
              v-on:passModulValidate="passModulValidate8"
            />
          </div>
          <!-- 现场油品分析 -->
          <div v-if="deviceDetail.reportType == '9'">
            <!-- 设备&润滑点信息 -->
            <DeviceInfo
              id="id0"
              v-if="hasDevice"
              ref="deviceRef"
              :type="type"
              :deviceName="deviceName"
              :deviceDetail="deviceDetail"
              :deviceObj="deviceObj"
              v-on:passModulValidate="passModulValidate1"
            />
            <!-- 运行参数 operationParametersObj -->
            <OperationParameters
              id="id1"
              v-if="hasOperationParameters"
              ref="OperationParametersRef"
              :type="type"
              @fatherMethod="fatherMethod"
              @fatherMethod1="fatherMethod1"
              :OperationParametersNodeName="OperationParametersNodeName"
              :operationParametersObj="operationParametersObj"
              v-on:passModulValidate="passModulValidate9"
            />
            <!-- 润滑改进建议 -->
            <OverallSituation
              id="id2"
              v-if="hasOverallSituation"
              ref="OverallSituationRef"
              :type="type"
              :overallSituationName="overallSituationName"
              :overallSituationObj="overallSituationObj"
              v-on:passModulValidate="passModulValidate11"
            />
          </div>
          <!-- 培训总结 -->
          <div v-if="deviceDetail.reportType == '10'">
            <!-- 培训信息 -->
            <OperationParameters
              id="id0"
              v-if="hasOperationParameters"
              ref="OperationParametersRef"
              :type="type"
              @fatherMethod="fatherMethod"
              @fatherMethod1="fatherMethod1"
              @fatherMethod2="fatherMethod2"
              :OperationParametersNodeName="OperationParametersNodeName"
              :operationParametersObj="operationParametersObj"
              v-on:passModulValidate="passModulValidate9"
            />
            <!-- 其它信息 -->
            <OverallSituation1
              id="id1"
              v-if="hasOverallSituation"
              ref="OverallSituationRef1"
              :type="type"
              :overallSituationName="overallSituationName"
              :overallSituationObj="overallSituationObj"
              v-on:passModulValidate="passModulValidate12"
            />
          </div>
          <!-- 换油建议咨询书 -->
          <div v-if="deviceDetail.reportType == '11'">
            <!-- 设备&润滑点信息 -->
            <DeviceInfo
              id="id0"
              v-if="hasDevice"
              ref="deviceRef"
              :type="type"
              @fatherMethod6="fatherMethod6"
              :deviceName="deviceName"
              @fatherMethodOilLevel="fatherMethodOilLevel"
              :deviceDetail="deviceDetail"
              :deviceObj="deviceObj"
              v-on:passModulValidate="passModulValidate1"
            />
            <!-- 换油基本信息 -->
            <OilChangeBasicMsg
              id="id1"
              v-if="hasOilChangeBasicMsg"
              ref="oilChangeBasicMsgRef"
              :type="type"
              @fatherMethod="fatherMethod"
              @fatherMethodOil="fatherMethodOil"
              :oilChangeBasicMsg="oilChangeBasicMsg"
              :deviceDetail="deviceDetail"
              :oilChangeBasicMsgObj="oilChangeBasicMsgObj"
              v-on:passModulValidate="passModulValidate13"
            />
            <!-- 换油冲洗建议 -->
            <WashingAdviceOilChange
              id="id2"
              v-if="hasWashingAdviceOilChange"
              ref="washingAdviceOilChangeRef"
              :type="type"
              @fatherMethodOil="fatherMethodOil"
              @fatherMethodOilLevelRefresh="fatherMethodOilLevelRefresh"
              @fatherMethodOilLevel="fatherMethodOilLevel"
              :deviceObj="deviceObj"
              :oilSituation="oilSituation"
              :washingAdviceOilChange="washingAdviceOilChange"
              :deviceDetail="deviceDetail"
              :washingAdviceOilChangeObj="washingAdviceOilChangeObj"
              v-on:passModulValidate="passModulValidate14"
            />
            <!-- 附录 -->
            <Appendix
              id="id3"
              v-if="hasAppendix"
              ref="appendixRef"
              :type="type"
              :deviceDetail="deviceDetail"
              @fatherMethodOilType="fatherMethodOilType"
              @fatherMethodOilLevel="fatherMethodOilLevel"
              :appendixName="appendixName"
              :oilSituation="oilSituation"
              :appendixObj="appendixObj"
              v-on:passModulValidate="passModulValidate15"
            />
          </div>
          <!-- 设备检查 -->
          <div v-if="deviceDetail.reportType == '12'">
            <!-- 设备&润滑&用油信息 -->
            <DeviceInfo
              id="id0"
              v-if="hasDevice"
              ref="deviceRef"
              :type="type"
              @fatherMethod6="fatherMethod6"
              :deviceName="deviceName"
              :deviceDetail="deviceDetail"
              :deviceObj="deviceObj"
              v-on:passModulValidate="passModulValidate1"
            />
            <!-- 设备检查 -->
            <LubricationSystemInspection
              id="id1"
              v-if="hasLubricationSystemInspection"
              ref="LubricationSystemInspectionRef"
              @fatherMethod6="fatherMethod6"
              @fatherMethod7="fatherMethod7"
              :type="type"
              :defaultNoticeDto="defaultNoticeDto"
              :dynamicItemDto="dynamicItemDto"
              :hydraulicPumpObj="hydraulicPumpObj"
              :chiLunItemDto="chiLunItemDto"
              :addLupPartsObj="addLupPartsObj"
              :deviceObj="deviceObj"
              :operationParametersObj="operationParametersObj"
              :LubricationSystemInspectionName="LubricationSystemInspectionName"
              :lubricationSystemInspectionObj="lubricationSystemInspectionObj"
              :deviceDetail="deviceDetail"
              :addDeveiceSituationObj="addDeveiceSituationObj"
              :addLupSituationObj="addLupSituationObj"
              v-on:passModulValidate="passModulValidate10"
            />
            <!-- 总体状况 -->
            <OverallSituation
              id="id2"
              v-if="hasOverallSituation"
              ref="OverallSituationRef"
              :type="type"
              :overallSituationName="overallSituationName"
              :overallSituationObj="overallSituationObj"
              v-on:passModulValidate="passModulValidate11"
            />
            <!-- 附录 -->
            <deviceCheckAppendix id="id3" v-if="isShowAppendix" ref="appendixRef" :appendixNode="appendixNode" :addAppendixObj="addAppendixObj" />
            <appendixNew
              id="id3"
              v-if="showAppendixNew"
              ref="appendixNewRef"
              :stepList="appendixNewStepList"
              :cardItem="appendixNewStepList[0]"
              :addFieldPoolDtoList="addFieldPoolDtoList"
              :paramReportType="deviceDetail.reportType"
            ></appendixNew>
          </div>
          <!-- 油品储运调研报告 -->
          <div v-if="deviceDetail.reportType == '13'">
            <!-- 调研基本信息 -->
            <ResearchBasicMsg
              id="id0"
              v-if="hasResearchBasicMsg"
              ref="researchBasicMsgRef"
              :dynamicItemDto="dynamicItemDto"
              :researchBasicMsgName="researchBasicMsgName"
              :researchBasicMsgObj="researchBasicMsgObj"
              v-on:passModulValidate="passModulValidate1"
            />
            <!-- 油品储存状况调查 -->
            <OilStorageCondition
              id="id1"
              v-if="hasOilStorageCondition"
              ref="oilStorageConditionRef"
              :dynamicItemDto="dynamicItemDto"
              :oilStorageConditionName="oilStorageConditionName"
              :oilStorageConditionObj="oilStorageConditionObj"
              v-on:passModulValidate="passModulValidate1"
            />
            <!-- 油品领用/转运情况调查 -->
            <OilRecipientsTransshipment
              id="id2"
              v-if="hasOilRecipientsTransshipment"
              ref="oilRecipientsTransshipmentRef"
              :dynamicItemDto="dynamicItemDto"
              :oilRecipientsTransshipmentName="oilRecipientsTransshipmentName"
              :oilRecipientsTransshipmentObj="oilRecipientsTransshipmentObj"
              v-on:passModulValidate="passModulValidate1"
            />
            <!-- 散装油接收调查 -->
            <BulkOilReceive
              id="id3"
              v-if="hasBulkOilReceive"
              ref="bulkOilReceiveRef"
              :type="type"
              :dynamicItemDto="dynamicItemDto"
              :bulkOilReceiveName="bulkOilReceiveName"
              :bulkOilReceiveObj="bulkOilReceiveObj"
              v-on:passModulValidate="passModulValidate1"
            />
            <!-- 总体状况 -->
            <overallAdvice
              id="id4"
              v-if="hasOverallSituation"
              ref="OverallAdviceRef"
              :type="type"
              :dynamicItemDto="dynamicItemDto"
              :overallSituationName="overallSituationName"
              :overallSituationObj="overallSituationObj"
              v-on:passModulValidate="passModulValidate11"
            />
            <!-- 附录 -->
            <oilAppendix id="id5" v-if="isShowAppendix" :dynamicItemDto="dynamicItemDto" ref="appendixRef" :appendixName="appendixName" :appendixNode="appendixNode" :addAppendixObj="addAppendixObj" />
          </div>
          <div class="foot-botton">
            <el-button type="danger" plain :disabled="!disabledPreview" @click="previewReport()" size="small">预览报告</el-button>
            <el-button type="danger" v-if="publishStatus == 0" plain @click="saveInfoDraft()" size="small">保存草稿</el-button>
            <el-button type="danger" @click="saveInfoPublish" size="small">保存并发布</el-button>
            <el-button type="danger" plain @click="cancleEditInfo" size="small">取消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DeviceInfo from "./oilChangeReport/deviceInfo";
import SupplementaryInfo from "./oilChangeReport/supplementaryInfo";
import SupplementaryInfoWind from "./oilChangeReport/supplementaryInfoWind";
import OilData from "./oilChangeReport/oilData";
import OilChangeHistory from "./oilChangeReport/oilChangeHistory";
import Operation from "./oilChangeReport/operation";
import ScenePictures from "./oilChangeReport/scenePictures";
import Suggest from "./oilChangeReport/suggest";
import PersonnelInfo from "./oilChangeReport/personnelInfo";
import CustomerMsg from "./oilChangeReport/CustomerMsg";
import LubricationRecommended from "./oilChangeReport/LubricationRecommended";
import OperationParameters from "./oilChangeReport/operationParameters";
import LubricationSystemInspection from "./oilChangeReport/lubricationSystemInspection";
import OverallSituation from "./oilChangeReport/overallSituation";
import OverallSituation1 from "./oilChangeReport/overallSituation1";
import WashingAdviceOilChange from "./oilChangeReport/washingAdviceOilChange";
import OilChangeBasicMsg from "./oilChangeReport/oilChangeBasicMsg";
import Appendix from "./oilChangeReport/appendix";
import deviceCheckAppendix from "./oilChangeReport/deviceCheckAppendix.vue";
import ResearchBasicMsg from "./oilChangeReport/researchBasicMsg.vue"; // 调研基本信息组件
import OilStorageCondition from "./oilChangeReport/OilStorageCondition.vue"; // 油品储存状况调查 组件
import OilRecipientsTransshipment from "./oilChangeReport/OilRecipientsTransshipment.vue"; // 油品领用/转运情况调查 组件
import BulkOilReceive from "./oilChangeReport/BulkOilReceive.vue"; // 散装油接收调查 组件
import oilAppendix from "./oilChangeReport/oilAppendix.vue"; // 散装油接收调查 组件
import overallAdvice from "./oilChangeReport/overallAdvice.vue"; // 散装油接收调查 组件
import appendixNew from "./oilChangeReport/appendixNew.vue";
import { reportParamSimplify } from "../../components/businessComponents/components/report-param-simplify";
export default {
  components: {
    DeviceInfo,
    SupplementaryInfo,
    OilData,
    OilChangeHistory,
    Operation,
    Suggest,
    ScenePictures,
    PersonnelInfo,
    CustomerMsg,
    LubricationRecommended,
    OperationParameters,
    LubricationSystemInspection,
    OverallSituation,
    OverallSituation1,
    OilChangeBasicMsg,
    WashingAdviceOilChange,
    Appendix,
    deviceCheckAppendix,
    SupplementaryInfoWind,
    ResearchBasicMsg,
    OilStorageCondition,
    OilRecipientsTransshipment,
    BulkOilReceive,
    oilAppendix,
    overallAdvice,
    appendixNew
  },
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 170}px`,
      clintminheight: `height:${document.documentElement.clientHeight - 270}px`,
      activeStep: 1,
      navgator: [],
      navgatorIndex: 0,
      listBoxState: true, // 点击导航栏时，暂时停止监听页面滚动
      currentActive: 1,
      dialogSaveVisible: false,
      stepList: [],
      deviceObj: [],
      deviceRequired: false, // 设备必填校验
      customerRequired: false, // 客户信息必填校验
      suppleMentRequired: false, // 风机参数必填校验
      suppleMentWindRequired: false,
      oilChangeRequired: false, // 换油
      checkOilRequired: false,
      dropdown2: false,
      personnelRequired: false,
      suggestRequired: false,
      operationRequired: false,
      operationParametersObjRequired: false, // 参数必填
      lubricationSystemInspectionRequired: false, // 检查必填
      LubricationRecommendedRequired: false, // 润滑推荐必填
      overallSituationRequired: false, // 总体评价必填
      OverallSituation1Required: false, // 其他信息必填
      oilChangeBasicMsgRequired: false, // 换油基本信息必填
      washingAdviceOilChangeObjRequired: false, // 换油冲洗建议必填
      deviceDetail: {},
      lubricationObj: [],
      customerObj: [],
      defaultNodeDto: {}, // 追加润滑点的数据结构
      addLupPartsObj: {}, // 追加检查的默认结构
      chiLunItemDto: {}, // 齿轮的默认对象
      defaultNoticeDto: {}, // 润滑系统检查 添加提示 默认结构
      dynamicItemDto: {}, // 要添加的结构
      defaultNodeWithDisabledInfoDto: {},
      LubricationRecommendedObj: [], // 润滑推荐
      operationParametersObj: [], // 运行参数
      OperationParametersNodeName: "",
      LubricationSystemInspectionName: "",
      appendixName: "", // 附录
      deviceName: "",
      moduleTitleOne: "",
      moduleTitleTwo: "",
      overallSituationName: "",
      lubricationSystemInspectionObj: [], // 润滑系统检查
      scenePicturesObj: [],
      overallSituationObj: [], // 总体状况
      supplementaryObjOne: [], // 风机参数1
      supplementaryObjTwo: [], // 风机参数2
      oilChangeBasicMsgObj: [], //换油基本信息
      oilChangeBasicMsg: "",
      hasOilChangeBasicMsg: false, // 是否显示换油基本信息组件
      hasWashingAdviceOilChange: false, // 是否显示换油建议组件
      washingAdviceOilChangeObj: [], //换油冲洗建议
      hasWashingAdviceOilChangeNo: null,
      hasOilChangeBasicMsgNo: null,
      washingAdviceOilChange: "",
      oilChangeObj: [], // 换油记录
      personnelInfoObj: [], // 人员信息
      checkOilDataObj: [], // 验油数据
      operationObj: [],
      suggestObj: [],
      appendixObj: [], // 附录
      oilSituation: [], //换油情况
      type: "",
      id: "",
      hasSupplementary: false,
      hasSupplementary1: false,
      hasDevice: false,
      haslubrication: false,
      hasCustomer: false,
      hasParams: false,
      hasPersonnelInfo: false,
      hasCheckOilData: false,
      hasOperation: false,
      hasScenePicturesObj: false,
      hasLubricationSystemInspection: false,
      hasSuggest: false,
      hasLubricationRecommended: false,
      hasOperationParameters: false,
      hasOverallSituation: false,
      hasAppendix: false, // 附录
      hasAppendixNo: null, // 附录
      lubricationRecommendedNo: null,
      deviceNodeNo: null,
      hasOverallSituationNo: null,
      lubricationNo: null,
      oilChangeNo: null,
      paramsNo: null,
      customerNo: null,
      scenePicturesNo: null,
      checkOilDataNo: null,
      operationNo: null,
      personnelInfoNo: null,
      supplementaryNo: null,
      hasLubricationSystemInspectionNo: null,
      hasOperationParametersNo: null,
      suggestNo: null,
      stepListLength: 0,
      saveParams: {},
      disabledPreview: true,
      // 油品储运调研报告   调研基本信息
      researchBasicMsgName: "",
      researchBasicMsgObj: [],
      hasResearchBasicMsg: false,
      hasResearchBasicMsgNo: null,
      // 油品储运调研报告   油品储存状况调查
      oilStorageConditionName: "",
      oilStorageConditionObj: [],
      hasOilStorageCondition: false,
      hasOilStorageConditionNo: null,
      // 油品储运调研报告   油品领用/转运情况调查
      oilRecipientsTransshipmentName: "",
      oilRecipientsTransshipmentObj: [],
      hasOilRecipientsTransshipment: false,
      hasOilRecipientsTransshipmentNo: null,
      // 油品储运调研报告   散装油接收调查
      bulkOilReceiveName: "",
      bulkOilReceiveObj: [],
      hasBulkOilReceive: false,
      hasBulkOilReceiveNo: null,
      validateOverallAdvice: false,
      validateResearchBasicMsg: false,
      validateOilStorageCondition: false,
      validateOilRecipientsTransshipment: false, // 油品领用、转运情况调查
      validateBulkOilReceive: false,
      userInfo: {},
      workshopId: "",
      companyNumber: "",
      companyId: "",
      contactCompanyName: "",
      perfectRate: 0,
      publishStatus: 0,
      hydraulicPumpObj: {}, // 液压泵对象
      // 附录
      appendixNode: [],
      addAppendixObj: {},
      isShowAppendix: false,
      addDeveiceSituationObj: {},
      addLupSituationObj: {},
      showAppendixNew: false,
      addFieldPoolDtoList: [],
      appendixNewStepList: []
    };
  },
  mounted() {
    this.type = this.$route.query.type;
    this.id = this.$route.query.id;
    this.perfectRate = this.$route.query.perfectRate;
    this.publishStatus = this.$route.query.publishStatus;
    this.workshopId = this.$route.query.workshopId;
    this.companyNumber = this.$route.query.companyNumber;
    this.companyId = this.$route.query.companyId;
    this.contactCompanyName = this.$route.query.contactCompanyName;
    this.userInfo = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo")));
    this.getStepList("first");
    this.queryReportStatus("first");
    // *
    // ** 页面滚动
    //
    this.$nextTick(() => {
      let timeId;
      this.xqBox.addEventListener(
        "scroll",
        () => {
          // 页面滚动停止100毫秒后才会执行下面的函数。
          clearTimeout(timeId);
          timeId = setTimeout(() => {
            this.scrollToTop();
          }, 100);
        },
        true
      );
    });
  },
  created() {},
  computed: {
    xqBox() {
      return this.$refs.xqBox;
    }
  },
  methods: {
    // 预览报告
    previewReport() {
      this.queryReportStatus("");
      this.$gio.previewServiceReport_workorder({
        workorderNumber: this.$route.query.workorderNumber,
        serviceType: this.$route.query.serviceType
      });
    },
    // 调取报告详情接口
    queryReportStatus(val) {
      const params = {
        draftId: this.$route.query.draftId
      };
      this.requestMethodPost("/serviceReport/currentStatus", params).then(res => {
        if (res.data.code == 1000) {
          this.$gio.Track("previewServiceReport_workorder", {
            workorderNumber: this.$route.query.workorderNumber,
            serviceType: this.$route.query.serviceType
          });
          if (res.data.data.status == "0") {
            this.disabledPreview = false;
          }
          if (res.data.data.status == "1" && val != "first") {
            window.open(res.data.data.reportFileUrl);
            this.$gio.previewServiceReport_serviceReport({
              entrance: "工单详情页"
            });
          }
          if (res.data.data.status == "2" && val != "first") {
            this.$message({
              message: "报告正在生成中，请稍后",
              type: "warning"
            });
          }
          if (res.data.data.status == 3 && val != "first") {
            this.$message({
              message: "报告生成失败，请重试",
              type: "warning"
            });
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 点击导航菜单，页面滚动到指定位置
    handleLeft(index) {
      this.navgatorIndex = index;
      this.$el.querySelector(`#id${index}`).scrollIntoView({
        behavior: "smooth", // 平滑过渡
        block: "start" // 上边框与视窗顶部平齐。默认值
      });
      this.listBoxState = false;

      let timeId;
      clearTimeout(timeId);
      timeId = setTimeout(() => {
        this.listBoxState = true;
      }, 200);
    },
    // // 监听页面元素滚动，改变导航栏选中
    scrollToTop() {
      // dom滚动位置
      const scrollTop = this.xqBox.scrollTop;
      // 获取可视区高度
      const offsetHeight = this.xqBox.offsetHeight;
      // 获取滚动条总高度
      const scrollHeight = this.xqBox.scrollHeight;
      for (let i = 0; i < this.navgator.length - 1; i++) {
        // offsetTop: 获取当前元素到其定位父级（offsetParent）的顶部距离
        let offset_before = document.getElementById(`id${i}`).offsetTop - 360;
        let offset_after = document.getElementById(`id${i + 1}`).offsetTop - 360;
        // 根据xqItem离顶部距离判断滚动距离落在哪两个item之间
        if (this.deviceDetail.reportType != 3) {
          if (scrollTop >= offset_before && scrollTop < offset_after) {
            // 判断是否滚动到了底部
            if (this.deviceDetail.reportType == "9") {
              if (scrollTop + offsetHeight + 250 >= scrollHeight) {
                // 把距离顶部的距离加上可视区域的高度 等于,或者大于滚动条的总高度就是到达底部
                if (this.navgatorIndex < this.navgator.length - 1) {
                  this.navgatorIndex = this.navgator.length - 1;
                }
              } else {
                this.navgatorIndex = i;
              }
            } else if (this.deviceDetail.reportType == "10") {
              if (scrollTop + offsetHeight + 820 >= scrollHeight) {
                // 把距离顶部的距离加上可视区域的高度 等于,或者大于滚动条的总高度就是到达底部
                if (this.navgatorIndex < this.navgator.length - 1) {
                  console.log(23333, this.navgatorIndex, this.navgator.length);
                  this.navgatorIndex = this.navgator.length - 1;
                }
              } else {
                console.log(i, this.navgatorIndex);
                this.navgatorIndex = i;
              }
            } else {
              if (scrollTop + offsetHeight + 450 >= scrollHeight) {
                // 把距离顶部的距离加上可视区域的高度 等于,或者大于滚动条的总高度就是到达底部
                if (this.navgatorIndex < this.navgator.length - 1) {
                  this.navgatorIndex = this.navgator.length - 1;
                }
              } else {
                this.navgatorIndex = i;
              }
            }

            break;
          }
        } else {
          if (scrollTop + offsetHeight >= scrollHeight) {
            // 把距离顶部的距离加上可视区域的高度 等于,或者大于滚动条的总高度就是到达底部
            if (this.navgatorIndex < this.navgator.length - 1) {
              this.navgatorIndex = this.navgator.length - 1;
            }
          } else {
            this.navgatorIndex = i;
          }
          break;
        }
      }
    },
    fatherMethod() {
      this.$refs.OperationParametersRef.handleGet("change");
      this.$refs.LubricationSystemInspectionRef.handleGet("change7");
    },
    fatherMethod7() {
      // this.$refs.OperationParametersRef.handleGet('change')
      this.$refs.LubricationSystemInspectionRef.handleGet("change7");
    },
    fatherMethod1() {
      this.$refs.LubricationSystemInspectionRef.handleGet("change1");
    },
    fatherMethod2() {
      this.$refs.LubricationSystemInspectionRef.handleGet("change2");
    },
    fatherMethod6() {
      this.$refs.LubricationSystemInspectionRef.handleGet("change6");
    },
    fatherMethodOil() {
      this.$refs.washingAdviceOilChangeRef.handleGet("changeOil");
    },
    // fatherMethodOil2 () {
    //   this.$refs.appendixRef.handleGet('changeOil2')
    // },
    fatherMethodOilLevel2() {
      this.$refs.appendixRef.handleGet("changeOilFushingLevel");
    },
    fatherMethodOilType() {
      this.$refs.appendixRef.handleGet("valueCodeOilFushing");
    },
    // 换油报告   --  当设备信息点击刷新数据按钮   风机参数1的数据也要更新
    fatherMethodWind() {
      this.$refs.supplementaryRef1.handleGet("changeDeviceInfo");
    },
    // 冲洗等级发生改变时，刷新 附录
    fatherMethodOilLevel() {
      this.$refs.appendixRef.handleGet("changeLevel");
    },
    // 刷新润滑点时候，刷新冲洗等级
    fatherMethodOilLevelRefresh() {
      this.$refs.washingAdviceOilChangeRef.handleGet("changeLevelRefresh");
    },
    // 获取步骤条和内容
    getStepList(val) {
      const loading = this.$loading({
        lock: true,
        text: "请稍后，Loading...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.navgator = [];
      this.requestMethodGet("/serviceReport/queryServiceDraftDetail", { draftId: this.$route.query.draftId }).then(res => {
        res = res.data;
        if (res.code == 1000) {
          const data = res.data;
          this.stepList = res.data;
          this.stepListLength = res.data.length;
          this.defaultNodeDto = this.stepList.defaultNodeDto;
          this.defaultNoticeDto = this.stepList.safeTipDto;
          this.dynamicItemDto = this.stepList.dynamicItemDto;
          this.hydraulicPumpObj = this.stepList.yybDto; // 液压泵默认对象
          this.chiLunItemDto = this.stepList.chiLunItemDto; // 齿轮的默认对象
          this.defaultNodeWithDisabledInfoDto = this.stepList.defaultNodeWithDisabledInfoDto;
          this.deviceDetail.reportType = res.data.reportType;
          this.deviceDetail.draftId = res.data.id;
          this.reportType = res.data.reportType;
          console.log(this.dynamicItemDto);
          if (val == "first" && this.deviceDetail.reportType == 3 && this.perfectRate == 0) {
            this.$message({
              message: "已自动帮您导入工单内的润滑点",
              type: "success"
            });
          }
          res.data.draftDetailJsonDtoList.forEach((item, index) => {
            if (item.nodeName == "设备&润滑点信息" || item.nodeName == "设备&润滑&用油信息") {
              this.navgator.push(item.nodeName);
              this.deviceObj = item.nodeValue;
              this.deviceName = item.nodeName;
              this.deviceDetail = {
                draftId: res.data.id,
                nodeName: item.nodeName,
                oilType: res.data.oilType,
                lubricationMethod: res.data.lubricationMethod,
                deviceNumber: res.data.deviceNumber,
                lubricationPointNumber: res.data.lubricationPointNumber,
                reportType: res.data.reportType
              };
              this.hasDevice = true;
              this.deviceNodeNo = item.nodeNo;
            } else if (item.nodeName == "现场图片") {
              this.navgator.push("现场图片");
              this.scenePicturesObj = item.nodeValue;
              this.hasScenePicturesObj = true;
              this.scenePicturesNo = item.nodeNo;
            } else if (item.nodeName == "风机参数1") {
              this.navgator.push("风机参数1");
              this.moduleTitleOne = "风机参数1";
              this.deviceDetail = {
                draftId: res.data.id,
                nodeName: item.nodeName,
                oilType: res.data.oilType,
                lubricationMethod: res.data.lubricationMethod,
                deviceNumber: res.data.deviceNumber,
                lubricationPointNumber: res.data.lubricationPointNumber,
                reportType: res.data.reportType
              };
              this.supplementaryObjOne = item.nodeValue;
              this.hasSupplementary1 = true;
              this.supplementaryNo1 = item.nodeNo;
            } else if (item.nodeName == "风机参数2") {
              this.navgator.push("风机参数2");
              this.moduleTitleTwo = "风机参数2";
              this.supplementaryObjTwo = item.nodeValue;
              this.hasSupplementary = true;
              this.supplementaryNo = item.nodeNo;
            } else if (item.nodeName == "换油记录") {
              this.navgator.push("换油记录");
              this.oilChangeObj = item.nodeValue;
              this.hasParams = true;
              this.oilChangeNo = item.nodeNo;
            } else if (item.nodeName == "自动便携验油箱验油数据") {
              this.navgator.push("自动便携验油箱验油数据");
              this.checkOilDataObj = item.nodeValue;
              this.hasCheckOilData = true;
              this.checkOilDataNo = item.nodeNo;
            } else if (item.nodeName == "验油数据") {
              this.navgator.push("验油数据");
              this.checkOilDataObj = item.nodeValue;
              this.hasCheckOilData = true;
              this.checkOilDataNo = item.nodeNo;
            } else if (item.nodeName == "运行情况") {
              this.navgator.push("运行情况");
              this.operationObj = item.nodeValue;
              this.hasOperation = true;
              this.operationNo = item.nodeNo;
            } else if (item.nodeName == "人员信息") {
              this.navgator.push("人员信息");
              this.personnelInfoObj = item.nodeValue;
              this.hasPersonnelInfo = true;
              this.personnelInfoNo = item.nodeNo;
            } else if (item.nodeName == "总结与建议") {
              this.navgator.push("总结与建议");
              this.suggestObj = item.nodeValue;
              this.hasSuggest = true;
              this.suggestNo = item.nodeNo;
            } else if (item.nodeName == "客户信息") {
              this.navgator.push("客户信息");
              this.customerObj = item.nodeValue;
              this.hasCustomer = true;
              this.customerNo = item.nodeNo;
            } else if (item.nodeName == "润滑推荐") {
              this.navgator.push("润滑推荐");
              this.LubricationRecommendedObj = item.nodeValue;
              this.hasLubricationRecommended = true;
              this.lubricationRecommendedNo = item.nodeNo;
            } else if (
              item.nodeName == "循环系统运行参数" ||
              item.nodeName == "液压系统运行参数" ||
              item.nodeName == "齿轮箱参数" ||
              item.nodeName == "轴承运行参数" ||
              item.nodeName == "现场油品分析结果" ||
              item.nodeName == "开式齿轮运行参数" ||
              item.nodeName == "培训信息"
            ) {
              this.navgator.push(item.nodeName);
              this.OperationParametersNodeName = item.nodeName;
              this.operationParametersObj = item.nodeValue;
              this.hasOperationParameters = true;
              this.hasOperationParametersNo = item.nodeNo;
            } else if (item.nodeName == "润滑系统检查" || item.nodeName == "齿轮检查" || item.nodeName == "轴承检查" || item.nodeName == "开式齿轮检查" || item.nodeName == "设备检查") {
              this.navgator.push(item.nodeName);
              this.LubricationSystemInspectionName = item.nodeName;
              this.hasLubricationSystemInspection = true;
              this.hasLubricationSystemInspectionNo = item.nodeNo;
              if (this.reportType == "12") {
                // 如果是设备检查类型
                this.addDeveiceSituationObj = _.cloneDeep(this.stepList.otherDto.children[0]);
                this.addLupSituationObj = _.cloneDeep(this.stepList.otherDto.children[0]);
                this.addLupPartsObj = _.cloneDeep(this.stepList.deviceCheckDto);
              }
              this.lubricationSystemInspectionObj = item.nodeValue;
              this.deviceDetail = {
                draftId: res.data.id,
                nodeName: item.nodeName,
                deviceNumber: res.data.deviceNumber,
                oilType: res.data.oilType,
                lubricationMethod: res.data.lubricationMethod,
                lubricationPointNumber: res.data.lubricationPointNumber,
                reportType: res.data.reportType
              };
            } else if (item.nodeName == "换油基本信息") {
              this.navgator.push(item.nodeName);
              this.oilChangeBasicMsg = item.nodeName;
              this.oilChangeBasicMsgObj = item.nodeValue;
              this.hasOilChangeBasicMsg = true;
              this.hasOilChangeBasicMsgNo = item.nodeNo;
            } else if (item.nodeName == "换油冲洗建议") {
              this.oilSituation = res.data.oilChangeState ? res.data.oilChangeState.split(",") : [];
              this.navgator.push(item.nodeName);
              this.washingAdviceOilChange = item.nodeName;
              this.washingAdviceOilChangeObj = item.nodeValue;
              this.hasWashingAdviceOilChange = true;
              this.hasWashingAdviceOilChangeNo = item.nodeNo;
            } else if (item.nodeName == "总体状况" || item.nodeName == "润滑改进建议" || item.nodeName == "其它信息" || item.nodeName == "总结和改进建议") {
              this.navgator.push(item.nodeName);
              this.overallSituationName = item.nodeName;
              this.overallSituationObj = item.nodeValue;
              this.hasOverallSituation = true;
              this.hasOverallSituationNo = item.nodeNo;
            } else if (item.nodeName == "附录" && (this.reportType == 11 || this.reportType == 13)) {
              this.navgator.push(item.nodeName);
              if (this.reportType == 11) {
                this.oilSituation = res.data.oilChangeState.split(",");
              }
              this.appendixName = item.nodeName;
              this.appendixObj = item.nodeValue;
              this.hasAppendix = true;
              this.hasAppendixNo = item.nodeNo;
              this.appendixNode = item.nodeValue;
              this.deviceDetail = {
                draftId: res.data.id,
                nodeName: item.nodeName,
                oilType: res.data.oilType,
                lubricationMethod: res.data.lubricationMethod,
                deviceNumber: res.data.deviceNumber,
                lubricationPointNumber: res.data.lubricationPointNumber,
                reportType: res.data.reportType
              };
              if (this.reportType == 12) {
                this.addAppendixObj = _.cloneDeep(this.stepList.attachmentDto.children[0]);
              }
              this.isShowAppendix = true;
            } else if (item.nodeName == "附录" && (this.reportType == 4 || this.reportType == 5 || this.reportType == 6 || this.reportType == 7 || this.reportType == 8 || this.reportType == 12)) {
              this.navgator.push(item.nodeName);
            } else if (item.nodeName == "调研基本信息") {
              this.navgator.push(item.nodeName);
              this.researchBasicMsgName = item.nodeName;
              this.researchBasicMsgObj = item.nodeValue;
              this.hasResearchBasicMsg = true;
              this.hasResearchBasicMsgNo = item.nodeNo;
            } else if (item.nodeName == "油品储存状况调查") {
              this.navgator.push(item.nodeName);
              this.oilStorageConditionName = item.nodeName;
              this.oilStorageConditionObj = item.nodeValue;
              this.hasOilStorageCondition = true;
              this.hasOilStorageConditionNo = item.nodeNo;
            } else if (item.nodeName == "油品领用、转运情况调查") {
              this.navgator.push(item.nodeName);
              this.oilRecipientsTransshipmentName = item.nodeName;
              this.oilRecipientsTransshipmentObj = item.nodeValue;
              this.hasOilRecipientsTransshipment = true;
              this.hasOilRecipientsTransshipmentNo = item.nodeNo;
            } else if (item.nodeName == "散装油接收调查") {
              this.navgator.push(item.nodeName);
              this.bulkOilReceiveName = item.nodeName;
              this.bulkOilReceiveObj = item.nodeValue;
              this.hasBulkOilReceive = true;
              this.hasBulkOilReceiveNo = item.nodeNo;
            }
            if (this.reportType == 4 || this.reportType == 5 || this.reportType == 6 || this.reportType == 7 || this.reportType == 8 || this.reportType == 12) {
              this.addFieldPoolDtoList = res.data.addFieldPoolDtoList;
              this.appendixNewStepList = [res.data.draftDetailJsonDtoList[res.data.draftDetailJsonDtoList.length - 1]];
              this.showAppendixNew = true;
            }

            setTimeout(() => {
              loading.close();
            }, 2000);
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    // 返回列表
    backList() {
      if (this.type == "view") {
        this.$router.go(-1);
        return;
      }
      const params = {
        deviceNumber: this.saveParams.deviceNumber,
        workOrderNumber: this.saveParams.workOrderNumber,
        esCompletedSave: false, // 最终保存为true，中途返回为fasle
        lubricationPointNumber: this.saveParams.lubricationPointNumber,
        taskId: this.saveParams.id,
        userId: this.userInfo.userId,
        valueDtoList: this.stepList
      };
      this.requestMethodPost("/web/service/ps/savePsServiceNodeValue", params).then(res => {
        if (res.data.code == 1000) {
          this.$router.go(-1);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 取消
    cancleEditInfo() {
      this.$confirm("取消后将丢失本次编辑内容", "取消编辑", {
        cancelButtonText: "继续编辑",
        confirmButtonText: "确定",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      })
        .then(() => {
          this.$router.go(-1);
        })
        .catch(() => {});
    },
    // 保存草稿
    saveInfoDraft() {
      const { valueDtoList, lubricationPointNumberList } = reportParamSimplify(JSON.parse(JSON.stringify(this.stepList.draftDetailJsonDtoList)));
      const params = {
        workOrderNumber: this.$route.query.workOrderNumber,
        saveAndPublish: false, // 最终保存为true，中途返回为fasle
        draftId: this.$route.query.draftId,
        deviceNumber: this.stepList.deviceNumber,
        lubricationPointNumber: [...new Set([...lubricationPointNumberList, this.stepList.lubricationPointNumber])].join(","),
        userId: this.userInfo.userId,
        valueDtoList: valueDtoList
      };
      this.requestMethodPost("/serviceReport/saveTemplateDetail", params)
        .then(res => {
          if (res.data.code == 1000) {
            // this.getStepList()
            this.disabledPreview = true;
            this.$message({
              message: "报告草稿已保存",
              type: "success"
            });
            this.$gio.saveDraftOfServiceReport({
              workorderNumber: this.$route.query.workOrderNumber,
              serviceType: this.$route.query.serviceType
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(() => {});
    },
    passModulValidate1(val) {
      if (val == "device") {
        this.deviceRequired = true;
      }
    },
    passModulValidateCustomer(val) {
      console.log(val);
      if (val == "customer") {
        this.customerRequired = true;
      }
    },
    passModulValidate2Wind(val) {
      if (val == "suppleMentWind") {
        this.suppleMentWindRequired = true;
      }
    },
    passModulValidate2(val) {
      if (val == "suppleMent") {
        this.suppleMentRequired = true;
      }
    },
    passModulValidate3(val) {
      if (val == "oilChange") {
        this.oilChangeRequired = true;
      }
    },
    passModulValidate4(val) {
      if (val == "checkOil") {
        this.checkOilRequired = true;
      }
    },
    passModulValidate7(val) {
      if (val == "operation") {
        this.operationRequired = true;
      } else {
        this.operationRequired = false;
      }
    },
    passModulValidate5(val) {
      if (val == "personnel") {
        this.personnelRequired = true;
      } else {
        this.personnelRequired = false;
      }
    },
    passModulValidate6(val) {
      if (val == "suggest") {
        this.suggestRequired = true;
      } else {
        this.suggestRequired = false;
      }
    },
    passModulValidate8(val) {
      if (val == "LubricationRecommended") {
        this.LubricationRecommendedRequired = true;
      } else {
        this.LubricationRecommendedRequired = false;
      }
    },
    passModulValidate9(val) {
      if (val == "OperationParametersObj") {
        this.operationParametersObjRequired = true;
      } else {
        this.operationParametersObjRequired = false;
      }
    },
    passModulValidate10(val) {
      if (val == "lubricationSystemInspectionObj") {
        this.lubricationSystemInspectionRequired = true;
      } else {
        this.lubricationSystemInspectionRequired = false;
      }
    },
    passModulValidate11(val) {
      if (val == "OverallSituation") {
        this.overallSituationRequired = true;
      } else {
        this.overallSituationRequired = false;
      }
    },
    // 校验换油基本信息
    passModulValidate13(val) {
      if (val == "oilChangeBasicMsgObj") {
        this.oilChangeBasicMsgRequired = true;
      } else {
        this.oilChangeBasicMsgRequired = false;
      }
    },
    // 校验换油冲洗建议
    passModulValidate14(val) {
      if (val == "washingAdviceOilChangeObj") {
        this.washingAdviceOilChangeObjRequired = true;
      } else {
        this.washingAdviceOilChangeObjRequired = false;
      }
    },
    // 润滑培训 其他信息必填校验
    passModulValidate12(val) {
      if (val == "OverallSituation1") {
        this.OverallSituation1Required = true;
      } else {
        this.OverallSituation1Required = false;
      }
    },
    pass() {
      const { valueDtoList, lubricationPointNumberList } = reportParamSimplify(JSON.parse(JSON.stringify(this.stepList.draftDetailJsonDtoList)));
      let lubricationPointNumberStr = [...new Set([...lubricationPointNumberList, this.stepList.lubricationPointNumber])].join(",");
      if (this.stepList.publishStatus == 1) {
        this.$confirm("新生成的文件将覆盖当前发布的文件，是否继续操作？", "保存并发布", {
          confirmButtonText: "覆 盖",
          cancelButtonText: "取消"
        })
          .then(() => {
            const params = {
              workOrderNumber: this.$route.query.workOrderNumber,
              saveAndPublish: true, // 最终保存为true，中途返回为fasle
              draftId: this.$route.query.draftId,
              deviceNumber: this.stepList.deviceNumber,
              lubricationPointNumber: lubricationPointNumberStr,
              userId: this.userInfo.userId,
              valueDtoList: valueDtoList
            };
            this.requestMethodPost("/serviceReport/saveTemplateDetail", params).then(res => {
              if (res.data.code == 1000) {
                this.$gio.Track("releaseServiceReport", {
                  workOrderNumber: this.$route.query.workOrderNumber
                });
                this.disabledPreview = true;
                this.$message({
                  message: "服务报告发布成功",
                  type: "success"
                });
                this.$router.go(-1);
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            });
          })
          .catch(() => {});
      } else {
        const params = {
          workOrderNumber: this.$route.query.workOrderNumber,
          saveAndPublish: true, // 最终保存为true，中途返回为fasle
          draftId: this.$route.query.draftId,
          deviceNumber: this.stepList.deviceNumber,
          lubricationPointNumber: lubricationPointNumberStr,
          userId: this.userInfo.userId,
          valueDtoList: valueDtoList
        };
        this.requestMethodPost("/serviceReport/saveTemplateDetail", params).then(res => {
          if (res.data.code == 1000) {
            this.$message({
              message: "服务报告发布成功",
              type: "success"
            });
            this.$router.go(-1);
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
      }
    },
    // 保存并发布
    saveInfoPublish() {
      this.$gio.releaseServiceReport({
        serviceType: this.$route.query.serviceType
      });
      this.deviceRequired = false; // 设备必填校验
      this.suppleMentRequired = false;
      this.oilChangeRequired = false;
      this.checkOilRequired = false;
      this.personnelRequired = false;
      this.suggestRequired = false;
      this.operationRequired = false;
      this.lubricationSystemInspectionRequired = false;
      this.LubricationRecommendedRequired = false; // 润滑推荐的必填校验
      this.validateAppendixresult = false; //设备检查-附录校验
      // 设备润滑点必填
      if (this.deviceDetail.reportType == 1) {
        this.$refs.deviceRef.validateDevice("deviceRef");
        if (this.deviceRequired) {
          // 风机参数必填校验
          this.$refs.supplementaryRef1.validateDevice("supplementaryWindForm");
        }
        if (this.suppleMentWindRequired) {
          // 换油记录必填校验
          this.$refs.supplementaryRef.validateDevice("supplementaryForm");
        }
        if (this.suppleMentRequired) {
          // 换油记录必填校验
          this.$refs.oilChangeRef.validateOilChange("oilChangeRef");
        }
        if (this.oilChangeRequired) {
          // 运行情况必填
          this.$refs.operationRef.validateOperation("operationRef");
        }
        if (this.operationRequired) {
          // 人员信息必填
          this.$refs.personnelInfoRef.validatePersonnelInfo("personnelInfoRef");
        }
      }
      // // 验油数据必填校验
      if (this.deviceDetail.reportType == 2) {
        this.$refs.deviceRef.validateDevice("deviceRef");
        if (this.deviceRequired) {
          this.$refs.checkOilRef.validateOil("checkOilRef");
        }
        if (this.checkOilRequired) {
          this.$refs.suggestRef.validateSuggest("suggestRef");
        }
      }
      // 润滑推荐表单
      if (this.deviceDetail.reportType == 3) {
        this.$refs.CustomerMsgRef.validateCustomer("CustomerMsgRef");
        if (this.customerRequired) {
          this.$refs.LubricationRecommendedRef.validateLubricationRecommended("LubricationRecommendedRef");
        }
      }
      // 循环系统 液压系统 闭式齿轮  表单
      if (this.deviceDetail.reportType == 4 || this.deviceDetail.reportType == 5 || this.deviceDetail.reportType == 6 || this.deviceDetail.reportType == 7 || this.deviceDetail.reportType == 8) {
        this.$refs.deviceRef.validateDevice("deviceRef");
        if (this.deviceRequired) {
          // 校验运行参数节点
          this.$refs.OperationParametersRef.validateOperationParametersObj("OperationParametersRef");
        }
        if (this.operationParametersObjRequired) {
          // 校验检查节点
          this.$refs.LubricationSystemInspectionRef.validatelubricationSystemInspectionObj("LubricationSystemInspectionRef");
        }
        // 校验总体评价
        if (this.lubricationSystemInspectionRequired) {
          this.$refs.OverallSituationRef.validateOverallSituation("OverallSituationRef");
        }
      }
      // 润滑培训 表单
      if (this.deviceDetail.reportType == 10) {
        // 培训信息必填校验
        this.$refs.OperationParametersRef.validateOperationParametersObj("OperationParametersRef");
        if (this.operationParametersObjRequired) {
          this.$refs.OverallSituationRef1.validateOverallSituation1("OverallSituationRef1");
        }
      }
      // 换油建议
      if (this.deviceDetail.reportType == 11) {
        // 设备润滑点信息必填校验
        this.$refs.deviceRef.validateDevice("deviceRef");
        if (this.deviceRequired) {
          // 校验换油基本信息
          this.$refs.oilChangeBasicMsgRef.validateoilChangeBasicMsgObj("oilChangeBasicMsgObj");
        }
        if (this.oilChangeBasicMsgRequired) {
          // 校验换油冲洗建议
          this.$refs.washingAdviceOilChangeRef.validatewashingAdviceOilChangeObj("washingAdviceOilChangeObj");
        }
      }
      // 现场油品分析报告 表单
      if (this.deviceDetail.reportType == 9) {
        this.$refs.deviceRef.validateDevice("deviceRef");
        // 设备必填通过校验
        if (this.deviceRequired) {
          // 现场油品分析结果 节点校验
          this.$refs.OperationParametersRef.validateOperationParametersObj("OperationParametersRef");
        }
        if (this.operationParametersObjRequired) {
          this.$refs.OverallSituationRef.validateOverallSituation("OverallSituationRef");
        }
      }
      // 设备检查
      if (this.deviceDetail.reportType == 12) {
        // 校验设备&润滑点&用油信息
        this.$refs.deviceRef.validateDevice("deviceRef");
        // 校验设备检查
        if (this.deviceRequired) {
          this.$refs.LubricationSystemInspectionRef.validatelubricationSystemInspectionObj("LubricationSystemInspectionRef");
        }
        // 校验总体状况
        if (this.lubricationSystemInspectionRequired) {
          this.$refs.OverallSituationRef.validateOverallSituation("OverallSituationRef");
        }
        // 校验总体状况
        if (this.overallSituationRequired) {
          // 校验附录
          this.validateAppendixresult = this.$refs.appendixRef.validateAppendix();
        }
      }
      // 油品储存
      if (this.deviceDetail.reportType == 13) {
        this.validateResearchBasicMsg = this.$refs.researchBasicMsgRef.validateResearchBasicMsg();
        if (this.validateResearchBasicMsg) {
          // 校验油品储存状况
          this.validateOilStorageCondition = this.$refs.oilStorageConditionRef.validateOilStorageCondition();
        }
        console.log(this.validateOilStorageCondition);
        if (this.validateOilStorageCondition) {
          // 校验油品领用、转运情况调查
          this.validateOilRecipientsTransshipment = this.$refs.oilRecipientsTransshipmentRef.validateOilRecipientsTransshipment();
        }
        if (this.validateOilRecipientsTransshipment) {
          // 校验散装油接受调查
          this.validateBulkOilReceive = this.$refs.bulkOilReceiveRef.validateBulkOilReceive();
        }
        if (this.validateBulkOilReceive) {
          this.validateOverallAdvice = this.$refs.OverallAdviceRef.validateOverallAdvice();
        }
        //
        // // 校验总体状况
        if (this.validateOverallAdvice) {
          this.validateAppendixresult = this.$refs.appendixRef.validateAppendix();
        }
      }
      if (this.deviceDetail.reportType == 1) {
        if (this.operationRequired && this.personnelRequired && this.oilChangeRequired && this.suppleMentRequired && this.deviceRequired && this.suppleMentWindRequired) {
          this.pass();
        }
      } else if (this.deviceDetail.reportType == 2) {
        if (this.suggestRequired && this.checkOilRequired && this.deviceRequired) {
          this.pass();
        }
      } else if (this.deviceDetail.reportType == 3) {
        console.log(12222, this.LubricationRecommendedRequired, this.customerRequired);
        if (this.LubricationRecommendedRequired && this.customerRequired) {
          this.pass();
        }
      } else if (this.deviceDetail.reportType == 9) {
        // 现场油品分析报告
        if (this.operationParametersObjRequired && this.overallSituationRequired && this.deviceRequired) {
          this.pass();
        }
      } else if (this.deviceDetail.reportType == 10) {
        // 润滑培训报告
        if (this.OverallSituation1Required && this.operationParametersObjRequired) {
          this.pass();
        }
      } else if (this.deviceDetail.reportType == 11) {
        // 润滑培训报告
        if (this.washingAdviceOilChangeObjRequired && this.deviceRequired && this.oilChangeBasicMsgRequired) {
          this.pass();
        }
      } else if (this.deviceDetail.reportType == 12) {
        const flag = this.$refs.appendixNewRef.validateAppendixNew();
        // 设备调查报告
        if (this.lubricationSystemInspectionRequired && this.deviceRequired && this.overallSituationRequired && flag) {
          this.pass();
        }
      } else if (this.deviceDetail.reportType == 13) {
        // 油品存储
        if (
          this.validateOverallAdvice &&
          this.validateResearchBasicMsg &&
          this.validateOilStorageCondition &&
          this.validateOilRecipientsTransshipment &&
          this.validateBulkOilReceive &&
          this.validateAppendixresult
        ) {
          this.pass();
        }
      } else if (
        this.deviceDetail.reportType == 4 ||
        this.deviceDetail.reportType == 5 ||
        this.deviceDetail.reportType == 6 ||
        this.deviceDetail.reportType == 7 ||
        this.deviceDetail.reportType == 8
      ) {
        // 设备调查报告
        // reportType 4 循环系统检查报告   7  轴承检查报告
        const flag = this.$refs.appendixNewRef.validateAppendixNew();
        if (this.lubricationSystemInspectionRequired && this.deviceRequired && this.overallSituationRequired && this.operationParametersObjRequired && flag) {
          this.pass();
        }
      } else {
        if (this.deviceRequired && this.operationParametersObjRequired && this.lubricationSystemInspectionRequired && this.overallSituationRequired) {
          this.pass();
        } else {
          this.pass();
        }
      }
    },
    getFullFillPath(val) {
      const params = {
        url: encodeURI(val)
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          window.open(res.data.data);
          this.$gio.previewServiceReport_serviceReport({
            entrance: "工单详情页"
          });
          setTimeout(() => {
            this.$router.go(-1);
          }, 800);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.navgator {
  width: 200px;
  position: fixed;
  top: 148px;
  height: 500px;
  border-right: 2px solid #ededed;
  .navgatorLi {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .isActive {
    color: #dd0000;
    border-right: 2px solid #dd0000;
  }
}

.work-order-component {
  padding: 20px;
  height: 100%;
  overflow: auto;
  &-serach-item {
    label {
      display: inline-block;
      width: 28%;
      text-align: right;
      padding-bottom: 10px;
    }
  }
  .base-publish {
    margin-right: 12px;
    height: 24px;
    line-height: 24px;
    display: inline-block;
    padding: 0 8px;
    border-radius: 4px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
  }
  .unPublish {
    background: rgba(211, 0, 0, 0.08);
    color: #dd0000;
  }
  .published {
    background: rgba(0, 0, 0, 0.05);
    color: #666;
  }
}
.foot-botton {
  width: 100%;
  background-color: #fff;
  height: 50px;
  position: fixed;
  bottom: 0;
}
//设置取消按钮向右浮动，左magin为10px，即与确定按钮间距为10px
.btn-custom-cancel {
  float: right;
  margin-left: 10px;
}
</style>
