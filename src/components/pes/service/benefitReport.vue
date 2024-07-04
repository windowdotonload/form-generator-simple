<!--效益报告-->
<template>
  <div style="position: relative" class="benefit-wrap">
    <div class="plan-wrap" :style="mainminheight">
      <div class="right-content" style="margin-top: 20px">
        <div class="line"></div>
        <div class="right-title">基本信息</div>
      </div>
      <!-- 首页 -->
      <div style="padding: 24px 20px;margin:10px 0;">
        <el-row class="service-items-wrap">
          <div style="color:#000000;font-size:14px;line-height:14px;margin-bottom:12px;font-weight:bold;">
            客户名称：<span style="color:#008888;">{{ companyName }}</span>
          </div>
          <div style="color:#999999;font-size:13px;line-height:13px;">日期：{{ curData }}</div>
        </el-row>
        <el-form :model="basicInfoForm" ref="basicInfoForm" label-width="190px" label-position="right">
          <el-form-item prop="pdfName">
            <div slot="label" style="width:180px;margin-right:10px;"><span style="color:red">*</span>报告名称</div>
            <el-input
              :disabled="pageType == 'pop' || pageType == 'rop'"
              placeholder="请输入报告名称"
              type="textarea"
              size="small"
              resize="none"
              maxlength="20"
              :autosize="{ minRows: 2, maxRows: 6 }"
              show-word-limit
              style="width: 640px; margin-right: 20px"
              v-model="basicInfoForm.pdfName"
            ></el-input>
            <div class="notice">自定义报告名称，最终报告名称将显示为：客户公司名称-年份-自定义部分+效益报告，此处只需填写自定义部分</div>
          </el-form-item>
          <el-form-item  class="home-page">
            <div slot="label" style="width:180px;margin-right:10px;"><span style="color:red">*</span>报告首页客户照片</div>
            <el-upload
              :class="{ hide: hideUpload || homePageImgList.length > 0 }"
              :action="uploadUrl"
              list-type="picture-card"
              limit="1"
              :file-list="homePageImgList"
              accept="image/*"
              :auto-upload="false"
              :disabled="true"
            >
            <div style="width:148px;" @click="handlePictureUpload(homePageImgList,'homePage')">
                <i class="el-icon-plus"></i>
                </div>
                <div slot="file" slot-scope="{ file }">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                    <span class="el-upload-list__item-preview">
                    <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file)"></i>
                    </span>
                    <span class="el-upload-list__item-preview">
                    <i class="el-icon-crop" @click.self="handlePicturePrune(file,homePageImgList,'homePage')"></i>
                    </span>
                    <span v-if="!disabled" class="el-upload-list__item-delete">
                    <i class="el-icon-delete" @click.self="handleRemove(file,'homePage')"></i>
                    </span>
                </span>
                </div>
            </el-upload>
            <div class="notice">选取最能展示该效益报告的照片</div>
          </el-form-item>
          <el-form-item prop="backgroundDesc" >
            <div slot="label" style="width:180px;margin-right:10px;"><span style="color:red">*</span>简介</div>
            <wangEditor :inputVal="basicInfoForm.backgroundDesc" maxLength="1000" placeholder="请输入简介" @msgChange="wangEditorMsg('backgroundDesc','index',$event)"/>
            <div class="notice">
              在实施服务前客户的润滑痛点，可以是设备润滑各方面，如运营成本、设备润滑故障、维护管理规程、人员能力、安全隐患、节能环保等。如与设备有关，需包括设备名称、设备制造商、设备型号、在用油品名称、工况等
            </div>
          </el-form-item>
          <el-form-item prop="backgroundLub">
            <div slot="label" style="width:180px;margin-right:10px;"><span style="color:red">*</span>润滑痛点</div>
            <wangEditor :inputVal="basicInfoForm.backgroundLub" maxLength="500" placeholder="请输入润滑痛点" @msgChange="wangEditorMsg('backgroundLub','index',$event)"/>
            <div class="notice">一句话描述</div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 解决方案 -->
      <div class="right-content" style="margin-top: 20px">
        <div class="line"></div>
        <div class="right-title">
          解决方案
          <span class="notice" style="font-weight:400;font-size:13px;">(已上线美孚工程服务任何项目、绿色润滑项目、OCM 等)</span>
        </div>
      </div>
      <!-- 解决方案1 -->
      <div style="padding:24px 20px;">
        <el-form :model="resultForm" :rules="rules" ref="resultForm" label-width="190px" label-position="right">
          <div v-for="(item, index) in resultForm.solutionListJsonDtoList" :key="index">
            <div class="plan-items-title">
              解决方案
              <span style="color:#dd0000;">{{ index + 1 }}</span>
              <el-button style="color:#dd0000;font-weight:400;font-size:13px;margin-left:24px;" v-if="index != 0" type="text" size="small" @click="deleteService(index)">删除</el-button>
            </div>
            <el-form-item label="服务项目" :prop="'solutionListJsonDtoList.' + index + '.serviceNumberList'" :rules="[{ required: true, message: '请选择', trigger: 'blur' }]" style="margin-top:34px;">
              <el-cascader
                :ref="`cascaderAddr${index}`"
                clearable
                :show-all-levels="false"
                v-model="item.serviceNumberList"
                :options="typeList"
                :props="industruPropsSelect"
                filterable
                size="small"
                @change="
                  val => {
                    handleSelectServiceType(val, item, index);
                  }
                "
              ></el-cascader>
            </el-form-item>
            <el-form-item label="描述" :rules="[{ required: true, message: '请输入描述', trigger: 'blur' }]" :prop="'solutionListJsonDtoList.' + index + '.desc'">
            <wangEditor :inputVal="item.desc" maxLength="500" placeholder="请输入内容" @msgChange="wangEditorMsg('desc',index,$event)"/>
            </el-form-item>
          </div>
        </el-form>
        <div>
          <el-button type="text" size="small" @click="addPlanItem" style="color:#001450;font-size:14px;font-weight:400">+ 添加解决方案</el-button>
        </div>
      </div>
      <!-- 结果 -->
      <div class="right-content" style="margin-top: 20px">
        <div class="line"></div>
        <div class="right-title">结果</div>
      </div>
      <!-- 结果1 -->
      <div style="padding:24px 20px;">
        <el-form :model="planForm" :rules="rules" ref="planForm" label-width="190px" label-position="right">
          <div v-for="(item, index) in planForm.resultListJsonDtoList" :key="index">
            <div class="plan-items-title">
              结果
              <span style="color:#dd0000;">{{ index + 1 }}</span>
              <el-button style="color:#dd0000;font-weight:400;font-size:13px;margin-left:24px;" v-if="index != 0" type="text" size="small" @click="deleteResult(index)">删除</el-button>
            </div>
            <el-form-item label="描述" :rules="[{ required: true, message: '请输入描述', trigger: 'blur' }]" :prop="'resultListJsonDtoList.' + index + '.resultDesc'">
              <wangEditor :inputVal="item.resultDesc" maxLength="500" placeholder="请输入内容" @msgChange="wangEditorMsg('resultDesc',index,$event)"/>
              <div class="notice">方案实施后改进/提高的结果，如“节能2%”</div>
            </el-form-item>
            <el-form-item label="方案实施前的状况" :rules="[{ required: true, message: '请输入方案实施前的状况', trigger: 'blur' }]" :prop="'resultListJsonDtoList.' + index + '.resultBeforeInfo'">
              <wangEditor :inputVal="item.resultBeforeInfo" maxLength="500" placeholder="请输入内容" @msgChange="wangEditorMsg('resultBeforeInfo',index,$event)"/>
            </el-form-item>
            <el-form-item label="实施前照片">
              <el-upload
                :class="{ hide: hideUpload || planForm.resultListJsonDtoList[index].resultBeforeImgPathFullUrlList.length > 2 }"
                :action="uploadUrl"
                list-type="picture-card"
                limit="2"
                :file-list="planForm.resultListJsonDtoList[index].resultBeforeImgPathFullUrlList"
                accept="image/*"
                :auto-upload="false"
                :disabled="true"
              >
              <div style="width:148px;height:148px;" @click="handlePictureUpload(planForm.resultListJsonDtoList[index].resultBeforeImgPathFullUrlList,'before',index)">
                <i class="el-icon-plus"></i>
                </div>
                <div slot="file" slot-scope="{ file }">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                    <span class="el-upload-list__item-preview">
                    <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file)"></i>
                    </span>
                    <span class="el-upload-list__item-preview">
                    <i class="el-icon-crop" @click.self="handlePicturePrune(file,planForm.resultListJsonDtoList[index].resultBeforeImgPathFullUrlList,'before',index)"></i>
                    </span>
                    <span v-if="!disabled" class="el-upload-list__item-delete">
                    <i class="el-icon-delete" @click.self="handleRemove(file,'before',index)"></i>
                    </span>
                </span>
                </div>
              </el-upload>
              <div class="notice">最多上传3张</div>
            </el-form-item>
            <el-form-item label="方案实施后的结果" :rules="[{ required: true, message: '请输入方案实施后的结果', trigger: 'blur' }]" :prop="'resultListJsonDtoList.' + index + '.resultAfterInfo'">
              <wangEditor :inputVal="item.resultAfterInfo" maxLength="500" placeholder="请输入内容" @msgChange="wangEditorMsg('resultAfterInfo',index,$event)"/>
            </el-form-item>
            <el-form-item label="实施后照片">
              <el-upload
                :class="{ hide2: hideUpload || planForm.resultListJsonDtoList[index].resultAfterImgPathFullUrlList.length > 2 }"
                :action="uploadUrl"
                list-type="picture-card"
                limit="2"
                :file-list="planForm.resultListJsonDtoList[index].resultAfterImgPathFullUrlList"
                accept="image/*"
                :auto-upload="false"
                :disabled="true"
              >
              <div style="width:148px;height:148px;" @click="handlePictureUpload(planForm.resultListJsonDtoList[index].resultAfterImgPathFullUrlList,'after',index)">
                <i class="el-icon-plus"></i>
                </div>
                <div slot="file" slot-scope="{ file }">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                    <span class="el-upload-list__item-preview">
                    <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file)"></i>
                    </span>
                    <span class="el-upload-list__item-preview">
                    <i class="el-icon-crop" @click.self="handlePicturePrune(file,planForm.resultListJsonDtoList[index].resultAfterImgPathFullUrlList,'after',index)"></i>
                    </span>
                    <span v-if="!disabled" class="el-upload-list__item-delete">
                    <i class="el-icon-delete" @click.self="handleRemove(file,'after',index)"></i>
                    </span>
                </span>
                </div>
              </el-upload>
              <div class="notice">最多上传3张</div>
            </el-form-item>
          </div>
        </el-form>
        <div>
          <el-button type="text" size="small" @click="addResultItem" style="color:#001450;font-size:14px;font-weight:400">+ 添加结果</el-button>
        </div>
        <el-form :model="mlsaObj" ref="mlsaObj" label-width="190px" label-position="right">
          <el-form-item label="有无油品分析服务" prop="hasOilFlag" :rules="[{ required: true, message: '请选择有无油品分析服务', trigger: 'change' }]">
            <el-select v-model="mlsaObj.hasOilFlag" style="width: 380px; margin-right: 20px" size="small" @change="hasOilFlagChange" placeholder="请选择">
              <el-option v-for="item in optionsWith" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="mlsaObj.hasOilFlag" label="主要数据前后对比" :rules="[{ required: true, message: '请输入主要数据前后对比', trigger: 'blur' }]" prop="dataCompare">
          <wangEditor :inputVal="mlsaObj.dataCompare" maxLength="500" placeholder='请输入内容' @msgChange="wangEditorMsg('dataCompare','index',$event)"/>
          </el-form-item>
          <el-form-item v-if="mlsaObj.hasOilFlag" label="数据对比文件">
            <el-upload class="upload-demo" action="" accept=".pdf" ref="upload" :file-list="fileList" :show-file-list="false" :http-request="handleUploadFile" :auto-upload="true">
              <el-button type="danger" plain size="small">上传数据对比文件</el-button>
              <div slot="tip" class="el-upload__tip notice">仅支持PDF文件，其它文件格式请转换为PDF后上传，最多上传1个文件</div>
            </el-upload>
          </el-form-item>
          <el-row v-if="mlsaObj.hasOilFlag" class="service-items-wrap" v-for="(item, index4) in contrastList" :key="index4">
            <el-col :span="18">
              <div style="color:#333;font-size:14px;line-height:14px;margin-bottom:12px;font-weight:bold;">
                {{ item.fileName }}
              </div>
              <div style="color:#999999;font-size:13px;line-height:13px;">
                <span>创建人：{{ item.createUserName }}</span>
                <span style="margin-left:24px;">创建时间：{{ item.createTime }}</span>
              </div>
            </el-col>
            <el-col :span="6" align="right">
              <el-button type="text" @click="previewAttachment(item)" style="color:#001450;font-size:13px;">下载</el-button>
              <el-button type="text" @click="deleteAttachment(item, index4, 'contrast')" style="color:#dd0000;font-size:13px;">删除</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 效益 -->
      <div class="right-content" style="margin-top: 20px">
        <div class="line"></div>
        <div class="right-title">效益</div>
      </div>
      <div style="padding: 24px 20px 0">
        <el-form :model="benefitsFrom" :rules="benefitsFromOther" ref="benefitsFrom" label-width="190px" label-position="right">
          <el-form-item label="安全" prop="effectSafe">
            <el-input
              size="small"
              maxlength="15"
              style="width: 380px; margin-right: 20px"
              placeholder="请输入"
              @keyup.native="proving(index, 'safe')"
              :rules="[
                { required: true, message: '请输入安全字段', trigger: 'blur' },
                ,
                { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
              ]"
              v-model="benefitsFrom.effectSafe"
            ></el-input
            >小时
            <div class="notice">减少设备维护人员与设备的接触时间（小时）</div>
          </el-form-item>
          <el-form-item>
            <div slot="label" style="display:flex;align-items:center;justify-content: flex-end;">
              <div style="color:#F56C6C;margin-right:4px">*</div>
              <div>环保</div>
            </div>
          </el-form-item>
          <el-form-item label="减少废润滑油的产生和处置" prop="effectEnvironment">
            <el-input
              size="small"
              maxlength="15"
              style="width: 380px; margin-right: 20px"
              placeholder="请输入"
              @keyup.native="proving(index, 'environment')"
              :rules="[
                { required: true, message: '请输入减少废润滑油的产生和处置', trigger: 'blur' },
                ,
                { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
              ]"
              v-model="benefitsFrom.effectEnvironment"
            ></el-input
            >升
            <div class="notice">减少废润滑油的产生和处置（升）</div>
          </el-form-item>
          <el-form-item label="减少CO2排放情况" prop="effectEnvironmentCo2Flag">
            <el-radio-group v-model="benefitsFrom.effectEnvironmentCo2Flag">
              <el-radio :label="true">有</el-radio>
              <el-radio :label="false">无</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="减少CO2排放" prop="effectEnvironmentCo2Num" v-if="benefitsFrom.effectEnvironmentCo2Flag">
            <el-input
              size="small"
              maxlength="15"
              style="width: 380px; margin-right: 20px"
              placeholder="请输入减少CO2排放"
              @keyup.native="proving(index, 'co2Num')"
              :rules="[
                { required: true, message: '请输入减少CO2排放', trigger: 'blur' },
                ,
                { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
              ]"
              v-model="benefitsFrom.effectEnvironmentCo2Num"
            ></el-input
            >吨
          </el-form-item>
          <el-form-item label="高效" prop="effectHigh">
            <el-input
              size="small"
              maxlength="15"
              style="width: 380px; margin-right: 20px"
              placeholder="请输入高效"
              @keyup.native="proving(index, 'efficiency')"
              :rules="[
                { required: true, message: '请输入高效字段', trigger: 'blur' },
                { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
              ]"
              v-model="benefitsFrom.effectHigh"
            ></el-input
            >万元
            <div class="notice">降低设备维护成本和非计划停机损失，增加效益</div>
          </el-form-item>
        </el-form>
      </div>

      <!-- 其他信息 -->
      <div class="right-content" style="margin-top: 20px">
        <div class="line"></div>
        <div class="right-title">其它信息</div>
      </div>
      <div style="padding: 24px 20px 0">
        <el-form :model="otherInfoJsonDto" :rules="rulesOther" ref="otherInfoJsonDto" label-width="190px" label-position="right">
          <el-form-item label="客户领导" prop="customerLd" :rules="rulesOther.customerLd">
            <el-input size="small" placeholder="请输入" maxlength="20" style="width: 380px; margin-right: 20px" v-model="otherInfoJsonDto.customerLd"></el-input>
          </el-form-item>
          <el-form-item label="客户工程师" prop="customerGcs" :rules="rulesOther.customerGcs">
            <el-input size="small" placeholder="请输入" maxlength="20" style="width: 380px; margin-right: 20px" v-model="otherInfoJsonDto.customerGcs"></el-input>
          </el-form-item>
          <!-- 创建人为美孚账号，必填 -->
          <el-form-item label="区域销售经理" prop="areaXsjl" v-if="userInfo.userType == '0'">
            <el-input
              size="small"
              maxlength="20"
              style="width: 380px; margin-right: 20px"
              placeholder="请输入"
              :rules="[{ required: true, message: '请输入区域销售经理', trigger: 'blur' }]"
              v-model="otherInfoJsonDto.areaXsjl"
            ></el-input>
          </el-form-item>
          <!-- 创建人为经销商账号，非必填 -->
          <el-form-item label="区域销售经理" v-if="userInfo.userType == '1'">
            <el-input size="small" placeholder="请输入" maxlength="20" style="width: 380px; margin-right: 20px" v-model="otherInfoJsonDto.areaXsjl"></el-input>
          </el-form-item>
          <!-- 创建人为美孚账号，必填 -->
          <el-form-item label="区域技术经理" prop="areaJsjl" v-if="userInfo.userType == '0'">
            <el-input
              size="small"
              placeholder="请输入"
              maxlength="20"
              style="width: 380px; margin-right: 20px"
              :rules="[{ required: true, message: '请输入区域技术经理', trigger: 'blur' }]"
              v-model="otherInfoJsonDto.areaJsjl"
            ></el-input>
          </el-form-item>
          <!-- 创建人为经销商账号，非必填 -->
          <el-form-item label="区域技术经理" v-if="userInfo.userType == '1'">
            <el-input size="small" placeholder="请输入" maxlength="20" style="width: 380px; margin-right: 20px" v-model="otherInfoJsonDto.areaJsjl"></el-input>
          </el-form-item>
          <el-form-item label="经销商公司" prop="distributorCompany" :rules="rulesOther.distributorCompany">
            <el-input size="small" placeholder="请输入" maxlength="20" style="width: 380px; margin-right: 20px" v-model="otherInfoJsonDto.distributorCompany"></el-input>
          </el-form-item>
          <el-form-item label="经销商技术服务工程师" prop="distributorJsfwgcs" :rules="rulesOther.distributorJsfwgcs">
            <el-input size="small" placeholder="请输入" maxlength="20" style="width: 380px; margin-right: 20px" v-model="otherInfoJsonDto.distributorJsfwgcs"></el-input>
          </el-form-item>
          <el-form-item label="经销商销售经理" prop="distributorSxjl" :rules="rulesOther.distributorSxjl">
            <el-input size="small" placeholder="请输入" maxlength="20" style="width: 380px; margin-right: 20px" v-model="otherInfoJsonDto.distributorSxjl"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 附件 -->
      <div class="right-content" style="margin-top: 20px">
        <div class="line"></div>
        <div class="right-title">附件</div>
      </div>

      <ReportTco :cardItem="tcoItem" :paramReportNode="reportList" :addFieldPoolDtoList="addFieldPoolDtoList" v-if="showTco" />
    </div>
    <div class="foot-botton">
      <el-button type="danger" plain :disabled="disabledPreview" @click="previewReport" size="small">预览报告</el-button>
      <el-button type="danger" plain @click="saveInfoPublish('draft')" size="small">保存草稿</el-button>
      <el-button type="danger" @click="saveInfoPublish('publish')" size="small">保存并发布</el-button>
      <el-button type="danger" plain @click="cancleEditInfo" size="small">取消</el-button>
    </div>
    <!-- 首次关联，提示是否关联POP -->
    <el-dialog title="生成POP(业绩证明)" :visible.sync="releasePopDialogFlag" :close-on-click-modal="false" :close-on-press-escape="false" width="30%" :before-close="handleClose">
      <span><span style="color:#dd0000">*</span>是否生成POP(业绩证明)？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="releasePop('Y')">生 成</el-button>
        <el-button size="small" type="danger" @click="releasePop('N')">不生成</el-button>
      </span>
    </el-dialog>
    <img-cutter
        ref="imgCutterModal"
        label="选择本地图片"
        :crossOrigin="true"
        :isModal="true"
        :crossOriginHeader="anonymous"
        :sizeChange="false"
        toolBgc="none"
        :lockScroll="true"
        :boxWidth="800"
        :boxHeight="450"
        :cutWidth="cutWidth"
        :cutHeight="cutHeight"
        :toolBoxOverflow="false"
        @cutDown="val => cutDown(val, item)"
    >
        <div slot="open"></div>
        <div slot="choose"></div>
    </img-cutter>
  </div>
</template>
<script>
import ReportTco from "@/components/businessComponents/components/report-tco";
import validateForm from "@/components/businessComponents/components/validateForm";
import imgCutter from '@/components/imgCutter.vue'
import wangEditor from "../component/wangEditor.vue";
export default {
  components: { ReportTco, imgCutter, wangEditor },
  mixins: [validateForm],
  data() {
    return {
      hideUpload: false,
      disabledPreview: true,
      typeList: [],
      homePageImgList: [],
      homePageImg: "",
      imageList: [],
      applylist: {
        name: "",
        contactMapAddress: ""
      },
      optionsWith: [{ value: true, label: "有" }, { value: false, label: "无" }],
      basicInfoForm: {},
      contrastList: [],
      resultForm: {
        solutionListJsonDtoList: [
          {
            desc: "",
            serviceNumberList: []
          }
        ]
      },
      planForm: {
        resultListJsonDtoList: [
          {
            resultAfterImgPathList: [],
            resultAfterImgPathFullUrlList: [],
            resultAfterInfo: "",
            resultBeforeImgPathList: [],
            resultBeforeImgPathFullUrlList: [],
            resultBeforeInfo: "",
            resultDesc: ""
          }
        ]
      },
      mlsaObj: {
        hasOilFlag: null,
        dataCompare: ""
      },
      otherInfoJsonDto: {}, // 其它信息
      benefitsFrom: {
        effectEnvironmentCo2Flag: true
      },
      detailData: {},
      selectIndex: null, // 记录是哪一条计划目标点击的选择的服务项
      mainminheight: `height:${document.documentElement.clientHeight - 200}px`,
      serviceData: [],
      selectServiceVisiable: false, // 选择服务项弹框
      //   表单验证规则
      benefitsFromOther: {
        effectEnvironment: [
          { required: true, message: "请输入减少废润滑油的产生和处置", trigger: "blur" },
          { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: "数值不能为空,且小数点后最多2位小数", trigger: "blur" }
        ],
        effectEnvironmentCo2Flag: [{ required: true, message: "请选择减少CO2排放情况", trigger: "change" }],
        effectEnvironmentCo2Num: [
          { required: true, message: "请输入减少CO2排放", trigger: "blur" },
          { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: "数值不能为空,且小数点后最多2位小数", trigger: "blur" }
        ],
        effectHigh: [
          { required: true, message: "请输入高效字段", trigger: "blur" },
          { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: "数值不能为空,且小数点后最多2位小数", trigger: "blur" }
        ],
        effectSafe: [
          { required: true, message: "请输入安全字段", trigger: "blur" },
          { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: "数值不能为空,且小数点后最多2位小数", trigger: "blur" }
        ]
      },
      rulesOther: {
        customerLd: [{ required: true, message: "请输入客户领导", trigger: "change" }],
        dqxszjValue: [{ required: true, message: "请输入大区销售总监", trigger: "change" }],
        customerGcs: [{ required: true, message: "请输入客户工程师", trigger: "change" }],
        fwgcsValue: [{ required: true, message: "请输入客户工程师", trigger: "change" }],
        jxsmcValue: [{ required: true, message: "请输入经销商名称", trigger: "change" }],
        areaJsjl: [{ required: true, message: "请输入区域技术经理", trigger: "change" }],
        areaXsjl: [{ required: true, message: "请输入区域销售经理", trigger: "change" }],
        xsjlValue: [{ required: true, message: "请输入销售经理", trigger: "change" }],
        distributorCompany: [{ required: true, message: "请输入经销商公司", trigger: "change" }],
        distributorJsfwgcs: [{ required: true, message: "请输入经销商技术服务工程师", trigger: "change" }],
        distributorSxjl: [{ required: true, message: "请输入经销商技术服务工程师", trigger: "change" }]
      },
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      planData: {},
      newIds: [], // 选择的服务项id
      //  自定义属性
      industruPropsSelect: {
        multiple: true,
        value: "serviceNumber",
        label: "serviceName",
        children: "children"
      },
      curData: "",
      customerId: "",
      id: "",
      companyName: "",
      distributorCompanyType: "",
      distributorCompanyId: "",
      releasePopDialogFlag: false,
      relPopId: "",
      isCreatePopFlag: false,
      pageType: "",
      // TCO
      tcoItem: {},
      addFieldPoolDtoList: [],
      showTco: false,
      reportList: [],
      typeImg:'',
      uploadIndex:null,
      cutWidth:200,
      cutHeight:200
    };
  },
  mounted() {
    this.userInfo = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo")));
  },
  created() {
    var d = new Date(new Date().getTime());
    this.curData = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    this.companyName = this.$route.query.companyName;
    this.pageType = this.$route.query.pageType;
    this.customerId = this.$route.query.customerId;
    this.distributorCompanyType = this.$route.query.distributorCompanyType;
    this.distributorCompanyId = this.$route.query.distributorCompanyId;

    if (this.$route.query.benefitReportId) {
      this.getPlanReport();
    }
    this.$_getServiceList();
    if (!this.$route.query.benefitReportId) {
      this.getTcoData();
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.mainminheight = `height:${document.documentElement.clientHeight - 200}px`;
      })();
    };
  },
  methods: {
    wangEditorMsg(msg,index,val){
      let htmlVal = val.getHtml()
      if(msg=='backgroundDesc'){
        this.basicInfoForm.backgroundDesc = htmlVal
      }else if(msg=='backgroundLub'){
        this.basicInfoForm.backgroundLub = htmlVal
      }else if(msg=='desc'){
        this.resultForm.solutionListJsonDtoList[index].desc = htmlVal
      }else if(msg=='resultDesc'){
        this.planForm.resultListJsonDtoList[index].resultDesc = htmlVal
      }else if(msg=='resultBeforeInfo'){
        this.planForm.resultListJsonDtoList[index].resultBeforeInfo = htmlVal
      }else if(msg=='resultAfterInfo'){
        this.planForm.resultListJsonDtoList[index].resultAfterInfo = htmlVal
      }else if(msg=='dataCompare'){
        this.mlsaObj.dataCompare = htmlVal
      }
    },
    getTcoData() {
      this.requestMethodGet("/service/report/template/queryTcoTemplate", {}).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          this.addFieldPoolDtoList = data.addFieldPoolDtoList;
          this.tcoItem = data.draftDetailJsonDtoList[data.draftDetailJsonDtoList.length - 1];
          this.reportList = data.draftDetailJsonDtoList;
          this.showTco = true;
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    proving(index, val) {
      if (val == "safe") {
        this.benefitsFrom.effectSafe = this.benefitsFrom.effectSafe.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        this.benefitsFrom.effectSafe = this.benefitsFrom.effectSafe.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        this.benefitsFrom.effectSafe = this.benefitsFrom.effectSafe.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        this.benefitsFrom.effectSafe = this.benefitsFrom.effectSafe
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", "."); // 只允许输入一个小数点
        this.benefitsFrom.effectSafe = this.benefitsFrom.effectSafe.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        this.benefitsFrom.effectSafe = this.benefitsFrom.effectSafe.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        this.benefitsFrom.effectSafe = this.benefitsFrom.effectSafe.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        this.benefitsFrom.effectSafe = this.benefitsFrom.effectSafe.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
      if (val == "environment") {
        this.benefitsFrom.effectEnvironment = this.benefitsFrom.effectEnvironment.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        this.benefitsFrom.effectEnvironment = this.benefitsFrom.effectEnvironment.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        this.benefitsFrom.effectEnvironment = this.benefitsFrom.effectEnvironment.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        this.benefitsFrom.effectEnvironment = this.benefitsFrom.effectEnvironment
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", "."); // 只允许输入一个小数点
        this.benefitsFrom.effectEnvironment = this.benefitsFrom.effectEnvironment.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        this.benefitsFrom.effectEnvironment = this.benefitsFrom.effectEnvironment.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        this.benefitsFrom.effectEnvironment = this.benefitsFrom.effectEnvironment.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        this.benefitsFrom.effectEnvironment = this.benefitsFrom.effectEnvironment.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
      if (val == "efficiency") {
        this.benefitsFrom.effectHigh = this.benefitsFrom.effectHigh.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        this.benefitsFrom.effectHigh = this.benefitsFrom.effectHigh.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        this.benefitsFrom.effectHigh = this.benefitsFrom.effectHigh.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        this.benefitsFrom.effectHigh = this.benefitsFrom.effectHigh
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", "."); // 只允许输入一个小数点
        this.benefitsFrom.effectHigh = this.benefitsFrom.effectHigh.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        this.benefitsFrom.effectHigh = this.benefitsFrom.effectHigh.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        this.benefitsFrom.effectHigh = this.benefitsFrom.effectHigh.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        this.benefitsFrom.effectHigh = this.benefitsFrom.effectHigh.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
        if(this.benefitsFrom.effectHigh > 100){
          this.benefitsFrom.effectHigh = 100
        }
      }
      if (val == "co2Num") {
        this.benefitsFrom.effectEnvironmentCo2Num = this.benefitsFrom.effectEnvironmentCo2Num.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        this.benefitsFrom.effectEnvironmentCo2Num = this.benefitsFrom.effectEnvironmentCo2Num.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        this.benefitsFrom.effectEnvironmentCo2Num = this.benefitsFrom.effectEnvironmentCo2Num.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        this.benefitsFrom.effectEnvironmentCo2Num = this.benefitsFrom.effectEnvironmentCo2Num
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", "."); // 只允许输入一个小数点
        this.benefitsFrom.effectEnvironmentCo2Num = this.benefitsFrom.effectEnvironmentCo2Num.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        this.benefitsFrom.effectEnvironmentCo2Num = this.benefitsFrom.effectEnvironmentCo2Num.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        this.benefitsFrom.effectEnvironmentCo2Num = this.benefitsFrom.effectEnvironmentCo2Num.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        this.benefitsFrom.effectEnvironmentCo2Num = this.benefitsFrom.effectEnvironmentCo2Num.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
    },
    hasOilFlagChange(val) {
      this.$set(this.mlsaObj, "hasOilFlag", val);
      this.$forceUpdate();
    },
    // 上传
    handlePictureUpload (item,val,index) {
      if(val=='homePage') {
        this.cutWidth = 700
        this.cutHeight = 394
      } else {
        this.cutWidth =200
        this.cutHeight = 200
      }
      this.typeImg=val
      this.uploadIndex=index
      this.cutFileList = item
      this.cutFlag = false
      this.$refs.imgCutterModal.handleOpen()
    },
// 获取全路径赋值imgFullDtoUrl
    getFullImgPath (item, path, flag) {
      console.log(item,path, flag)
        const params = {
            url: item.tempImagePath
        }
        this.requestMethodGet('/web/file/getFullUrl', params).then(res => {
            if (res.data.code == 1000) {
            let pathUrl = []
            console.log(res.data,flag,this.typeImg,this.uploadIndex,this.pruneIndex)
            if (flag) {
              if(this.typeImg=='homePage') {
                this.homePageImgList=[]
                this.homePageImg=''
                this.homePageImg = item.tempImagePath;
                this.homePageImgList.push({ url: res.data.data });
              }
              if(this.typeImg=='before') {
                this.planForm.resultListJsonDtoList[this.uploadIndex].resultBeforeImgPathFullUrlList[this.pruneIndex].url = res.data.data;

                this.planForm.resultListJsonDtoList[this.uploadIndex].resultBeforeImgPathFullUrlList[this.pruneIndex].urlFull =item.tempImagePath;
              }
              if(this.typeImg=='after') {
                this.planForm.resultListJsonDtoList[this.uploadIndex].resultAfterImgPathFullUrlList[this.pruneIndex].url = res.data.data;

                this.planForm.resultListJsonDtoList[this.uploadIndex].resultAfterImgPathFullUrlList[this.pruneIndex].urlFull =item.tempImagePath;
              }
            } else {
              if(this.typeImg=='homePage') {
                this.homePageImg = item.tempImagePath;
                this.homePageImgList.push({ url: res.data.data });
              }
              if(this.typeImg=='before') {
                this.planForm.resultListJsonDtoList[this.uploadIndex].resultBeforeImgPathFullUrlList.push({ url: res.data.data, urlFull:item.tempImagePath  });
              }
              if(this.typeImg=='after') {
                this.planForm.resultListJsonDtoList[this.uploadIndex].resultAfterImgPathFullUrlList.push({ url: res.data.data, urlFull:item.tempImagePath  });
              }
            }
            } else {
            this.$message({
                message: res.data.msg,
                type: 'warning'
            })
            }
        })
    },
    /**
     * @Description: 图片删除
     * @Author: LiQiuPing
     * @param {*} file
     * @param {*} item
     */
    handleRemove (file, val,index) {
      if(val=='homePage') {
        this.homePageImg=''
        this.homePageImgList=[]
      }
      // 删除实施前的照片
      if(val=='before') {
        this.planForm.resultListJsonDtoList[index].resultBeforeImgPathFullUrlList.forEach((ele,i)=>{
            if (file.uid === ele.uid) {
              this.pruneIndex = i
            }
        })
        this.planForm.resultListJsonDtoList[index].resultBeforeImgPathFullUrlList.splice(this.pruneIndex, 1);
        this.planForm.resultListJsonDtoList[index].resultBeforeImgPathList.splice(this.pruneIndex, 1);
        setTimeout(() => {
          this.hideUpload = this.planForm.resultListJsonDtoList[index].resultBeforeImgPathFullUrlList.length > 2;
        }, 500);
      }
      // 删除实施后的照片
      if(val=='after') {
        this.planForm.resultListJsonDtoList[index].resultAfterImgPathFullUrlList.forEach((ele,i)=>{
            if (file.uid === ele.uid) {
              this.pruneIndex = i
            }
        })
        this.planForm.resultListJsonDtoList[index].resultAfterImgPathFullUrlList.splice(this.pruneIndex, 1);
        this.planForm.resultListJsonDtoList[index].resultAfterImgPathList.splice(this.pruneIndex, 1);
        setTimeout(() => {
          this.hideUpload = this.planForm.resultListJsonDtoList[index].resultAfterImgPathFullUrlList.length > 2;
        }, 500);
      }
    },
    /**
     * @Description: 图片返显
     * @Author: LiQiuPing
     * @param {*} file
     * @param {*} pruneIndex
     * @param {*} callback
     */
    imgBackShow (file, pruneIndex, callback) {
      callback(file[pruneIndex].url)
    },
    /**
     * @Description: 图片裁剪
     * @Author: LiQiuPing
     * @param {*} fileList
     */
    handlePicturePrune (file, fileList,val,index) {
      console.log(file,fileList,val,index)
      this.typeImg=val
      this.cutFlag = true
      this.uploadIndex = index
      // let url = fileList.imgFullDtoUrl[this.pruneIndex].url
      let url;
      if(val=='homePage') {
        url=this.homePageImgList[0].url
        
        this.cutWidth = 700
        this.cutHeight = 394
      } else {
        this.cutFileList = fileList
        fileList.forEach((ele, i) => {
            if (file.uid === ele.uid) {
            this.pruneIndex = i
            }
        })
        url=fileList[this.pruneIndex].url
        this.cutWidth = 200
        this.cutHeight = 200
      }
      this.$refs.imgCutterModal.handleOpen({
        name: 'img',
        src: url,
        width: 400,
        height: 400,
        
        
      })
      
      
    },
    // 调取报告详情接口
   previewReport() {
      const params = {
        id: this.id 
      };
      this.requestMethodGet("/pes/customer/queryXyzjPath", params).then(res => {
        if (res.data.code == 1000) {
          if (res.data.data.status == "2") {
            this.$message({
              message: "报告正在生成中，请稍后",
              type: "warning"
            });
          } else {
            if (res.data.data.path) {
              window.open(res.data.data.path);
            } else {
              this.$message({
                message: "报告生成失败，请重试",
                type: "warning"
              });
            }
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 预览
    handlePictureCardPreview (file) {
      console.log(file.url)
        this.dialogImageUrl = file.url
        this.imgDialogVisible = true
    },
    /**
     * @Description: 裁剪
     * @Author: LiQiuPing
     * @param {*} fileName
     */
    cutDown (fileName) {
      let cutDownData = this.cutFileList
      var imgGs = fileName.dataURL.split(';')[0].split('/')[1]
      var file = this.dataURLtoBlob(fileName.dataURL, '裁剪图片.' + imgGs)
      var formData = new FormData()
      formData.append('fileType', 'lubrication_point')
      formData.append('multipartFiles', file)
      this.requestMethodPost('/web/file/uploadFiles', formData)
        .then(async res => {
        res = res.data
        if (res.code === 1000) {
            cutDownData.tempImagePath = res.data[0]
            this.getFullImgPath(cutDownData, res.data[0], this.cutFlag)
            cutDownData.value = res.data[0]
        } else {
            cutDownData.imgFullDtoUrl = []
            cutDownData.notShowUploadBtn = false
            this.$message({
            message: res.msg,
            type: 'warning'
            })
        }
        })
        .catch(res => {})
    },
    /**
     * @Description: base64转换为file
     * @Author: LiQiuPing
     * @param {*} dataurl
     * @param {*} name
     */
    dataURLtoBlob (dataurl, name) {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], name, { type: mime })
    },

    // 上传改变事件
    handleUploadFile(file) {
      if (!file.file.type.startsWith("application")) {
        fileList.pop();
        this.$message.error("只能上传pdf类型文件");
        return;
      }
      const isLt100M = file.file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        this.$message({
          type: "error",
          message: "请选择100M以内的文件"
        });
        this.$refs.upload.abort();
        return;
      }
      this.AddOssFile(file.file, "contrast");
    },
    AddOssFile(file, val) {
      const loading = this.$loading({
        lock: true,
        text: "正在上传文件中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let params = new FormData();
      params.append("multipartFiles", file);
      this.requestMethodPost("/common/business/attachment/uploadFiles", params).then(res => {
        res = res.data;
        if (res.code == 1000) {
          if (val == "contrast") {
            this.contrastList = [];
            this.contrastList.push(res.data[0]);
          }
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
        loading.close();
      });
    },
    // 预览附件
    previewAttachment(item) {
      this.downLoadFile(item);
    },
    downLoadFile(item) {
      const params = {
        url: encodeURI(item.fileUrl)
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          window.open(res.data.data, "_blank");
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 删除附件/数据对比文件
    deleteAttachment(item, index, val) {
      const params = {
        id: item.id
      };
      this.requestMethodPost("/common/business/attachment/delete", params).then(res => {
        if (res.data.code == 1000) {
          this.contrastList = [];
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 创建工单选择服务类型
    handleSelectServiceType(val, item, index) {
      let newList = [];
      let labelData = [];
      for (let i in val) {
        newList.push(val[i][1]);
      }
      this.$nextTick(() => {
        this.$refs[`cascaderAddr${index}`][0].checkedNodes.forEach(it => {
          labelData.push(it.label);
          item.serviceNames = labelData.toString();
        });
      });
      item.serviceNumberList = val;
    },
    formatData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          data[i].children = undefined;
        } else {
          this.formatData(data[i].children);
        }
      }
      return data;
    },
    // 服务类型
    $_getServiceList(val) {
      this.typeList = [];
      this.loadingInput = true;
      this.requestMethodGet("/web/config/serviceConfiguration/getServiceConfTree", { serviceName: val || "" })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.loadingInput = false;
            this.typeList = res.data;
            this.typeList = this.formatData(this.typeList);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 添加结果
    addResultItem() {
      this.planForm.resultListJsonDtoList.push({
        resultAfterInfo: "",
        resultBeforeInfo: "",
        resultBeforeImgPathFullUrlList: [],
        resultAfterImgPathFullUrlList: [],
        resultBeforeImgPathList: [],
        resultAfterImgPathList: [],
        resultDesc: ""
      });
    },
    // 添加解决方案
    addPlanItem() {
      this.resultForm.solutionListJsonDtoList.push({
        desc: "",
        serviceNumberList: []
      });
    },
    deleteResult(index) {
      this.planForm.resultListJsonDtoList.splice(index, 1);
    },
    deleteService(index) {
      this.resultForm.solutionListJsonDtoList.splice(index, 1);
    },
    // 查询效益总结
    getPlanReport() {
      const loading = this.$loading({
        lock: true,
        text: "数据加载中,请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.requestMethodGet("/pes/customer/info", { id: this.EncryptUserId(this.$route.query.benefitReportId) })
        .then(res => {
          if (res.data.code == 1000) {
            if (res.data.data) {
              this.disabledPreview = false;
              this.id = res.data.data.id;
              this.relPopId = res.data.data.relPopId;
              const data = res.data.data;
              // tco
              if (!_.isEmpty(data.tcoJsonDto)) {
                this.addFieldPoolDtoList = data.tcoJsonDto.addFieldPoolDtoList;
                this.tcoItem = data.tcoJsonDto.draftDetailJsonDtoList[data.tcoJsonDto.draftDetailJsonDtoList.length - 1];
                this.reportList = data.tcoJsonDto.draftDetailJsonDtoList;
                this.showTco = true;
              }
              if (!data.tcoJsonDto) {
                this.getTcoData();
              }
              if (res.data.data.dataCompare) {
                this.mlsaObj = res.data.data;
              } else {
                this.mlsaObj = {};
              }
              if (res.data.data.homePageImgFullUrl) {
                this.homePageImgList.push({ url: res.data.data.homePageImgFullUrl });
                this.homePageImg = res.data.data.homePageImg;
              } else {
                this.homePageImgList = [];
              }
              if (res.data.data.dataCompareFileDto) {
                this.contrastList.push(res.data.data.dataCompareFileDto);
              }
              this.benefitsFrom = res.data.data;
              if (res.data.data.otherInfoJsonDto) {
                this.otherInfoJsonDto = res.data.data.otherInfoJsonDto;
              } else {
                this.otherInfoJsonDto = {};
              }
              if (res.data.data.solutionListJsonDtoList) {
                this.resultForm.solutionListJsonDtoList = res.data.data.solutionListJsonDtoList;
              } else {
                this.resultForm.solutionListJsonDtoList = [];
              }
              if (res.data.data.resultListJsonDtoList) {
                this.planForm.resultListJsonDtoList = res.data.data.resultListJsonDtoList;
                console.log(this.planForm.resultListJsonDtoList);
                this.$nextTick(() => {
                  this.planForm.resultListJsonDtoList.forEach((item, index) => {
                    item.resultAfterImgPathList.forEach((afterUrl, index1) => {
                      this.getFullUrl(afterUrl, index, "after");
                    });
                    item.resultBeforeImgPathList.forEach((beforeUrl, index2) => {
                      this.getFullUrl(beforeUrl, index, "before");
                    });
                  });
                });
              } else {
                this.planForm.resultListJsonDtoList = [];
              }
              if (res.data.data.hasOilFlag != null) {
                this.mlsaObj.hasOilFlag = res.data.data.hasOilFlag;
              }
              if (res.data.data.backgroundDesc != null || res.data.data.backgroundLub != null) {
                this.basicInfoForm = res.data.data;
              } else {
                this.basicInfoForm = {};
              }
              loading.close();
            }
          } else {
            loading.close();
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          loading.close();
        });
    },
    // 获取图片全路径
    getFullUrl(url, index, val) {
      const params = {
        url: url
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          if (val == "before") {
            this.planForm.resultListJsonDtoList[index].resultBeforeImgPathFullUrlList.push({ url: res.data.data, urlFull: url });
          } else {
            this.planForm.resultListJsonDtoList[index].resultAfterImgPathFullUrlList.push({ url: res.data.data, urlFull: url });
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    releasePop(val) {
      // 点击保存的时候，入参：createPopFlag
      // 生成pop：true、不生成pop：false
      this.isCreatePopFlag = val == "Y";
      this.releasePopDialogFlag = false;
      this.saveInfo("publish");
      this.$gio.benefitReportGeneratePOP({
        operation: this.isCreatePopFlag == "Y" ? "弹窗中点击生成" : "弹窗中点击不生成"
      });
    },
    // 保存草稿
    saveInfo(val) {
      let resultListJsonDtoList = [];
      if (this.planForm.resultListJsonDtoList.length) {
        this.planForm.resultListJsonDtoList.forEach((it, index) => {
          let arr = [];
          let arr1 = [];
          if (it.resultAfterImgPathFullUrlList.length) {
            it.resultAfterImgPathFullUrlList.forEach(itChild => {
              if (typeof itChild === "string") {
                arr.push(itChild);
              } else {
                arr.push(itChild.urlFull);
              }
            });
          }
          if (it.resultBeforeImgPathFullUrlList.length) {
            it.resultBeforeImgPathFullUrlList.forEach(itChild => {
              if (typeof itChild === "string") {
                arr1.push(itChild);
              } else {
                arr1.push(itChild.urlFull);
              }
            });
          }
          resultListJsonDtoList.push({
            resultAfterImgPathList: arr,
            resultBeforeImgPathList: arr1,
            resultAfterInfo: it.resultAfterInfo,
            resultBeforeInfo: it.resultBeforeInfo,
            resultDesc: it.resultDesc
          });
        });
      }
      const tcoJsonDtoData = {
        addFieldPoolDtoList: this.addFieldPoolDtoList,
        draftDetailJsonDtoList: [this.tcoItem]
      };
      let params = {
        backgroundDesc: this.basicInfoForm.backgroundDesc || "",
        backgroundLub: this.basicInfoForm.backgroundLub || "",
        customerId: this.customerId || "",
        distributorCompanyType: this.$route.query.distributorCompanyType,
        distributorCompanyId: this.$route.query.distributorCompanyId,
        pdfName: this.basicInfoForm.pdfName,
        dataCompare: this.mlsaObj.dataCompare || "",
        dataCompareFileId: this.contrastList.length > 0 ? this.contrastList[0].id : "",
        effectEnvironment: this.benefitsFrom.effectEnvironment || "", //减少废润滑油的产生和处置
        effectEnvironmentCo2Flag: this.benefitsFrom.effectEnvironmentCo2Flag, //减少CO2排放情况（true有、false无）
        effectEnvironmentCo2Num: this.benefitsFrom.effectEnvironmentCo2Num, //减少CO2排放（单位：吨）
        effectHigh: this.benefitsFrom.effectHigh || "",
        effectSafe: this.benefitsFrom.effectSafe || "",
        hasOilFlag: this.mlsaObj.hasOilFlag,
        homePageImg: this.homePageImg,
        id: this.id || "",
        otherInfoJsonDto: this.otherInfoJsonDto,
        resultListJsonDtoList: resultListJsonDtoList,
        solutionListJsonDtoList: this.resultForm.solutionListJsonDtoList,
        publishFlag: val == "publish",
        createPopFlag: this.isCreatePopFlag,
        tcoJsonDto: tcoJsonDtoData
      };
      this.requestMethodPost("/pes/customer/addOrEdit", params).then(res => {
        if (res.data.code == 1000) {
          this.disabledPreview = false;
          if (res.data.data) {
            this.id = res.data.data;
          }
          if (val == "publish") {
            this.$message({
              message: "发布成功",
              type: "success"
            });
            this.$router.push({
              path: "/CustomerProfile/CustomerProfileDetail",
              query: {
                companyId: this.$route.query.customerId,
                companyNumber: this.$route.query.customerCompanyNumber,
                tabSource: "benefitReport"
              }
            });
          } else {
            this.$message({
              message: "保存成功",
              type: "success"
            });
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    saveInfoPublish(val) {
      if (val == "draft") {
        this.saveInfo(val);
        this.$gio.saveDraftOfBenefitReport();
      } else {
        this.$gio.pulishBenefitReport();
        if (this.homePageImgList.length == 0) {
          this.$message({
            message: "请上传报告首页客户照片",
            type: "error"
          });
          return;
        }
        let flagBasicInfoForm = false;
        let flagPlanForm = false;
        let flagBenefitsFrom = false;
        let flagOtherInfoJsonDto = false;
        let flagResultForm = false;
        let flagMlsaObj = false;
        if(this.basicInfoForm.pdfName==""||this.basicInfoForm.backgroundDesc=="<p><br></p>"||this.basicInfoForm.backgroundLub=="<p><br></p>") {
          flagBasicInfoForm = false;
        }else{
          flagBasicInfoForm = true;
        }
        this.$refs["planForm"].validate(valid => {
          if (valid) {
            flagPlanForm = true;
            this.planForm.resultListJsonDtoList.forEach(item=>{
              if(item.resultAfterInfo=="<p><br></p>"||item.resultBeforeInfo=="<p><br></p>"||item.resultDesc=="<p><br></p>"){
                flagPlanForm = false;
              }
            })
          }
        });
        this.$refs["mlsaObj"].validate(valid => {
          if (valid) {
            flagMlsaObj = true;
          }
        });
        this.$refs["benefitsFrom"].validate(valid => {
          if (valid) {
            flagBenefitsFrom = true;
          }
        });
        this.$refs["otherInfoJsonDto"].validate(valid => {
          if (valid) {
            flagOtherInfoJsonDto = true;
          }
        });
        this.$refs["resultForm"].validate(valid => {
          if (valid) {
            flagResultForm = true;
            this.resultForm.solutionListJsonDtoList.forEach(item=>{
              if(item.desc=="<p><br></p>") {
                flagResultForm = false;
              }
            })
          }
        });
        // tco校验
        const tcoFlag = this.validateFormItem(this.tcoItem.nodeValue,false);
        if (flagBasicInfoForm && flagPlanForm && flagBenefitsFrom && flagOtherInfoJsonDto && flagResultForm && flagMlsaObj) {
          if (!this.relPopId && tcoFlag) {
            this.releasePopDialogFlag = true;
          } else {
            if (tcoFlag) {
              this.saveInfo(val);
            }
          }
        } else {
          this.$message({
            message: "请先填写必填项",
            type: "error"
          });
        }
      }
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
          this.$gio.cancelEditOrCreateBenefitReport();
          this.$router.push({
            path: "/CustomerProfile/CustomerProfileDetail",
            query: {
              companyId: this.$route.query.customerId,
              companyNumber: this.$route.query.customerCompanyNumber,
              tabSource: "benefitReport"
            }
          });
        })
        .catch(() => {
          this.$gio.cancelEditOrCreateBenefitReport();
        });
    }
  }
};
</script>
<style lang="less" scoped>
.benefit-wrap {
  .plan-wrap {
    padding: 20px;
    height: 100%;
    position: relative;
    overflow: auto;
  }
  /deep/ .home-page .el-upload-list--picture-card .el-upload-list__item {
    width: 148px;
    height: auto !important;
  }
  .right-content {
    display: flex;
    align-items: center;
    background: #ededed;
    font-size: 14px;
    margin-top: 40px;
    line-height: 50px;
    height: 50px;
    font-weight: 400;
    font-size: 14px;
    padding: 0 20px;
  }
  .line {
    width: 4px;
    height: 14px;
    background-color: #dd0000;
  }
  .notice {
    font-size: 12px;
    line-height: 12px;
    color: #999;
    margin-top: 4px;
  }
  .line-grey {
    width: 1px;
    height: 14px;
    display: inline-block;
    margin: 0 24px;
    background-color: #e9e9e9;
  }
  .right-title {
    line-height: 25px;
    color: #000;
    margin-left: 8px;
    font-weight: bold;
  }
  .service-items-wrap {
    background: rgba(204, 221, 255, 0.2);
    font-weight: 400;
    color: #999;
    border: 1px solid #ccddff;
    border-radius: 6px;
    font-size: 13px;
    padding: 16px 20px;
    margin-bottom: 12px;
  }
  .no-wrap {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .plan-items-title {
    font-weight: 700;
    font-size: 14px;
    line-height: 14px;
    color: #000;
    margin-bottom: 20px;
  }
  // 设置显示两行，超出省略
  /deep/ .el-table th > .cell {
    word-break: keep-all !important;
    white-space: nowrap !important;
  }
  .foot-botton {
    width: 100%;
    background-color: #fff;
    height: 50px;
    padding: 0 20px;
    position: fixed;
    bottom: 0;
  }
  /deep/ .hide .el-upload--picture-card {
    display: none !important;
  }
  /deep/ .hide2 .el-upload--picture-card {
    display: none !important;
  }
}
</style>
