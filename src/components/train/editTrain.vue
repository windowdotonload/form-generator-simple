<template>
  <div style="position: relative" v-loading.fullscreen.lock="fullscreenLoading">
    <div style="position: absolute; top: -42px; right: 20px">
      <el-button
        size="small"
        type="danger"
        @click="submitForm('ruleForm')"
        :disabled="ruleForm.chapterType == 1 && !ruleForm.videolist.length"
        :style="
          ruleForm.chapterType == 1 && !ruleForm.videolist.length
            ? 'background:#aaa !important;border-color:#aaa !important;'
            : ''
        "
        >{{ step == 4 ? "完成" : "下一步" }}</el-button
      >
      <el-button size="small" @click="resetForm('ruleForm')" v-if="step == 1"
        >取消</el-button
      >
      <el-button
        size="small"
        @click="resetForm('ruleForm')"
        v-if="step <= 4 && step > 1"
        >上一步</el-button
      >
    </div>
    <div class="train-edit-container" :style="mainminheight">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          width: 1020px;
        "
      >
        <div>
          <span class="step-style" style="color: #008888; border-color: #008888"
            ><span>1</span></span
          >配置视频
        </div>
        <div
          style="height: 2px; background: #e9e9e9; flex: 1; margin: 0 5px"
          :class="step >= 2 ? 'green-bg' : ''"
        ></div>
        <div>
          <span
            class="step-style"
            :style="step >= 2 ? 'color:#008888;border-color:#008888' : ''"
            ><span>2</span></span
          ><span :style="step >= 2 ? '' : 'color:#000'">添加题目</span>
        </div>
        <div
          style="height: 2px; background: #e9e9e9; flex: 1; margin: 0 5px"
          :class="step >= 3 ? 'green-bg' : ''"
        ></div>
        <div>
          <span
            class="step-style"
            :style="step >= 3 ? 'color:#008888;border-color:#008888' : ''"
            ><span>3</span></span
          ><span :style="step >= 3 ? '' : 'color:#000'">配置其它</span>
        </div>
        <div
          style="height: 2px; background: #e9e9e9; flex: 1; margin: 0 5px"
          :class="step == 4 ? 'green-bg' : ''"
        ></div>
        <div>
          <span
            class="step-style"
            :style="step == 4 ? 'color:#008888;border-color:#008888' : ''"
            ><span>4</span></span
          ><span :style="step == 4 ? '' : 'color:#000'">对谁可见</span>
        </div>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        :label-width="step == 3 ? '190px' : '140px'"
        :label-position="step == 3 ? 'left' : 'right'"
        class="demo-ruleForm"
        style="height: calc(100%-54px); position: relative"
      >
        <div v-show="step == 1">
          <div style="width: 520px">
            <el-form-item label="章节设置" prop="chapterType">
              <el-radio-group v-model="ruleForm.chapterType">
                <el-radio :label="0">单章节</el-radio>
                <el-radio :label="1">多章节</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="培训名称" prop="trainName">
              <el-input
                v-model="ruleForm.trainName"
                size="small"
                style="width: 100%"
                placeholder="给培训起个名字"
                clearable
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item label="培训类别" prop="trainType">
              <el-select
                v-model="ruleForm.trainType"
                size="small"
                style="width: 100%"
                placeholder="请选择培训类别"
                popper-class="select-hide"
                @visible-change="selectTab(1)"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <div class="select-poup" v-show="isShowSelectType">
                <el-scrollbar>
                  <div
                    v-for="item in typeList"
                    :key="item.id"
                    :class="
                      ruleForm.trainType == item.id
                        ? 'select-item blue-text'
                        : 'select-item'
                    "
                    @click="selectItem(item, 1)"
                  >
                    <div style="flex: 1">{{ item.typeName }}</div>
                    <i
                      class="el-icon-check"
                      style="color: #dd000"
                      v-if="ruleForm.trainType == item.id"
                    ></i>
                  </div>
                </el-scrollbar>
                <div style="text-align: center; padding: 10px">
                  <el-button
                    size="small"
                    type="danger"
                    @click="openVideoType('类型')"
                    >配置培训类型</el-button
                  >
                </div>
                <div class="popper-arrow"></div>
              </div>
            </el-form-item>
            <el-form-item label="培训简介" prop="trainContent">
              <el-input
                type="textarea"
                placeholder="给本章节作简短的描述，100字"
                :autosize="{ minRows: 3, maxRows: 6 }"
                v-model="ruleForm.trainContent"
                maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="视频封面" prop="videoCoverType">
              <el-radio-group v-model="ruleForm.videoCoverType">
                <el-radio label="0">推荐封面</el-radio>
                <el-radio label="1">自定义封面</el-radio>
              </el-radio-group>
              <div v-if="ruleForm.videoCoverType == 0" style="color: #999">
                推荐封面取，已上传视频的第一帧画面
              </div>
            </el-form-item>
            <div v-if="ruleForm.videoCoverType == 1">
              <el-form-item prop="img">
                <el-upload
                  class="avatar-uploader"
                  action="action"
                  :show-file-list="false"
                  accept="image/*"
                  :on-change="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <el-image
                    v-if="imageUrl"
                    :src="imageUrl"
                    fit="cover"
                    class="avatar"
                  ></el-image>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </div>
            <el-form-item
              label="上传视频/音频"
              prop="videoFile"
              v-if="ruleForm.chapterType == 0"
            >
              <input
                id="fileUpload"
                hidden
                type="file"
                accept=".mp4,.mpeg,.rmvb,.ogv,.avi"
                @change="fileChange($event)"
              />
              <el-button size="small" @click="hChooseFile"
                ><i class="el-icon-upload2"></i>选择文件</el-button
              >
              <div
                style="
                  margin: 16px 0 0px;
                  display: inline-block;
                  word-wrap: break-word;
                  width: 100%;
                  line-height: 20px;
                  font-size: 13px;
                "
                v-if="
                  ruleForm.videoFile.length && ruleForm.videoFile[0].fileName
                "
              >
                {{ ruleForm.videoFile[0].fileName }}
                <i
                  class="el-icon-error"
                  style="color: #ccc; margin-left: 10px; cursor: pointer"
                  @click="handleVideoRemove"
                ></i>
              </div>
              <el-link
                @click="authUpload(ruleForm.videoFile[0])"
                style="color: #001450; font-size: 13px"
                :underline="false"
                v-if="
                  ruleForm.videoFile[0].fileName &&
                  ruleForm.videoFile[0].authProgress == 0
                "
                >点击上传</el-link
              >
              <el-progress
                color="rgb(0,136,136)"
                v-if="
                  ruleForm.videoFile.length &&
                  ruleForm.videoFile[0].authProgress &&
                  ruleForm.videoFile[0].authProgress < 100
                "
                :percentage="ruleForm.videoFile[0].authProgress"
              ></el-progress>
              <div
                v-if="
                  ruleForm.videoFile.length &&
                  ruleForm.videoFile[0].authProgress == 100
                "
              >
                <div
                  v-if="
                    ruleForm.videoFile[0].statusText &&
                    ruleForm.videoFile[0].statusText != '上传失败！'
                  "
                  style="color: #666; display: flex; align-items: center"
                >
                  <i
                    class="el-icon-success"
                    v-if="ruleForm.videoFile[0].statusText == '上传成功！'"
                    style="
                      color: rgb(0, 136, 136);
                      font-size: 16px;
                      margin-right: 5px;
                    "
                  ></i>
                  <span v-if="ruleForm.videoFile[0].statusText == '上传成功！'"
                    >上传成功！</span
                  >
                  <span
                    style="color: #001450; cursor: pointer"
                    @click="playVideo(ruleForm.videoFile[0].videoId)"
                  >
                    查看视频</span
                  >
                </div>
                <div
                  v-if="ruleForm.videoFile[0].statusText == '上传失败！'"
                  style="color: #666; display: flex; align-items: center"
                >
                  <span
                    style="color: #001450; margin-left: 10px"
                    @click="hChooseFile"
                  >
                    重新上传</span
                  >
                </div>
              </div>
            </el-form-item>
          </div>
          <div v-if="ruleForm.chapterType == 1" style="width: 520px">
            <div
              style="padding-top: 24px; border-top: 1px solid #e9e9e9"
              v-for="(domain, index) in ruleForm.videolist"
              :key="domain.id"
            >
              <div v-if="!domain.delFlag">
                <div style="font-size: 14px; font-weight: bold">
                  章节{{ index + 1
                  }}<span
                    @click="deleteVideo(index, domain)"
                    style="
                      color: #dd0000;
                      font-weight: 400;
                      margin-left: 24px;
                      cursor: pointer;
                    "
                    >删除</span
                  >
                </div>
                <div style="margin-top: 24px">
                  <div style="width: 520px">
                    <el-form-item
                      label="章节名称"
                      :prop="'videolist.' + index + '.chapterName'"
                      :rules="{
                        required: true,
                        message: '章节名称不能为空',
                        trigger: 'blur',
                      }"
                    >
                      <el-input
                        v-model="domain.chapterName"
                        style="width: 100%"
                        placeholder="给章节起个名字"
                        maxlength="10"
                      ></el-input>
                    </el-form-item>
                  </div>
                  <el-form-item
                    label="上传视频/音频"
                    :prop="'videolist.' + index + '.fileName'"
                    :rules="{
                      required: true,
                      message: '请选择一个文件',
                      trigger: 'change',
                    }"
                  >
                    <input
                      :class="'fileUpload' + index"
                      hidden
                      type="file"
                      accept=".mp4,.mpeg,.rmvb,.ogv,.avi"
                      @change="fileChange($event, domain)"
                    />
                    <el-button
                      size="small"
                      @click="chooseFileRow('.fileUpload' + index)"
                      ><i class="el-icon-upload2"></i>选择文件</el-button
                    >
                    <div
                      style="
                        margin: 16px 0 0px;
                        display: inline-block;
                        word-wrap: break-word;
                        width: 100%;
                        line-height: 20px;
                        font-size: 13px;
                      "
                      v-if="domain.fileName"
                    >
                      {{ domain.fileName }}
                      <i
                        class="el-icon-error"
                        style="color: #ccc; margin-left: 10px; cursor: pointer"
                        @click="videoRemoveIndex(domain, '.fileUpload' + index)"
                      ></i>
                    </div>
                    <el-link
                      @click="startUpload(domain)"
                      style="color: #001450; font-size: 13px"
                      :underline="false"
                      v-if="domain.fileName && domain.authProgress == 0"
                      >点击上传</el-link
                    >
                    <el-progress
                      color="rgb(0,136,136)"
                      v-if="domain.authProgress && domain.authProgress < 100"
                      :percentage="domain.authProgress"
                    ></el-progress>
                    <div v-if="domain.authProgress == 100">
                      <div
                        v-if="
                          domain.statusText && domain.statusText != '上传失败！'
                        "
                        style="color: #666; display: flex; align-items: center"
                      >
                        <i
                          class="el-icon-success"
                          v-if="domain.statusText == '上传成功！'"
                          style="
                            color: rgb(0, 136, 136);
                            font-size: 16px;
                            margin-right: 5px;
                          "
                        ></i>
                        <span v-if="domain.statusText == '上传成功！'"
                          >上传成功！</span
                        >
                        <span
                          style="color: #001450; cursor: pointer"
                          @click="playVideo(domain.videoId)"
                        >
                          查看视频</span
                        >
                      </div>
                      <div
                        v-if="domain.statusText == '上传失败！'"
                        style="color: #666; display: flex; align-items: center"
                      >
                        <i
                          class="el-icon-error"
                          style="
                            color: #dd0000;
                            font-size: 16px;
                            margin-right: 5px;
                          "
                        ></i>
                        {{ domain.statusText }}
                        <span
                          style="color: #001450; margin-left: 10px"
                          @click="hChooseFile"
                        >
                          重新上传</span
                        >
                      </div>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
            <el-link
              icon="el-icon-plus"
              @click="addVideoList"
              style="color: #001450"
              :underline="false"
              >新增章节</el-link
            >
          </div>
        </div>
        <div v-if="step == 2" style="width: 620px; padding-left: 40px">
          <el-form-item label="添加题目：" prop="testFlag">
            <el-radio-group v-model="ruleForm.testFlag">
              <el-radio :label="0">暂不添加</el-radio>
              <el-radio :label="1">添加</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="ruleForm.testFlag == 1">
            <div
              style="
                padding: 20px;
                background: rgba(250, 250, 250, 1);
                border-radius: 4px;
                width: 600px;
                height: 100px;
                font-size: 14px;
                margin-bottom: 20px;
              "
            >
              <div style="margin-bottom: 15px">
                添加题目，需要在第三方网页端进行配置，网页端地址如下：
              </div>
              <a
                href="https://survey.mobil.com.cn/corplogin.aspx"
                target="_blank"
                rel="noopener noreferrer"
                >https://survey.mobil.com.cn/corplogin.aspx</a
              >
            </div>
            <el-form-item label="问卷星试题链接：" prop="testUrl">
              <el-input
                v-model="ruleForm.testUrl"
                size="small"
                style="width: 100%"
                placeholder="将问卷星试题生成好的链接放在此处"
                clearable
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div v-if="step == 3" style="padding-left: 40px; width: 520px">
          <div
            style="
              padding-right: 12px;
              box-sizing: border-box;
              font-size: 14px;
              margin-bottom: 20px;
              color: #000;
            "
          >
            获取证书配置：
          </div>
          <el-form-item
            label="是否需要配置证书："
            prop="certificateFlag"
            required
          >
            <el-radio-group v-model="ruleForm.certificateFlag">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="ruleForm.certificateFlag == 1">
            <el-form-item label="证书名称：" prop="certificateName">
              <el-input
                v-model="ruleForm.certificateName"
                size="small"
                clearable
                style="width: 100%"
                placeholder="给证书起个名字"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item label="获得证书最低分数线：" prop="certificateScore">
              <el-input
                v-model.number="ruleForm.certificateScore"
                autocomplete="off"
                size="small"
                style="width: 100px"
                maxlength="3"
              ></el-input>
              &nbsp;分
            </el-form-item>
          </div>

          <!-- 积分配置 -->
          <div
            style="
              padding-right: 12px;
              box-sizing: border-box;
              font-size: 14px;
              margin-bottom: 20px;
              color: #000;
              margin-top: 80px;
            "
          >
            获取积分配置：
          </div>
          <el-form-item label="是否需要配置积分：" prop="creditFlag" required>
            <el-radio-group v-model="ruleForm.creditFlag">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="ruleForm.creditFlag == 1">
            <el-form-item
              label="观看视频获得积分数："
              prop="videoCredit"
              :rules="rules.certificateScore"
            >
              <el-input
                v-model.number="ruleForm.videoCredit"
                size="small"
                autocomplete="off"
                style="width: 100px"
                maxlength="5"
              ></el-input>
              &nbsp;积分
            </el-form-item>
            <el-form-item
              label="参与测试获得积分数："
              prop="testCredit"
              :rules="rules.certificateScore"
            >
              <el-input
                v-model.number="ruleForm.testCredit"
                size="small"
                autocomplete="off"
                style="width: 100px"
                maxlength="5"
              ></el-input>
              &nbsp;积分
            </el-form-item>
            <el-form-item
              label="得到证书获得积分数："
              prop="certificateCredit"
              :rules="rules.certificateScore"
            >
              <el-input
                v-model.number="ruleForm.certificateCredit"
                size="small"
                autocomplete="off"
                style="width: 100px"
                maxlength="5"
              ></el-input>
              &nbsp;积分
            </el-form-item>
          </div>
          <el-form-item label="关联润滑课程">
            <el-select
              v-model="ruleForm.trainIdList"
              size="small"
              multiple
              collapse-tags
              clearable
              style="width: 100%"
              placeholder="请选择润滑课程"
            >
              <el-option
                v-for="item in trainCourseList"
                :key="item.id"
                :label="item.trainName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联润滑服务">
            <el-cascader
              v-model="ruleForm.serviceNumberList"
              style="width: 100%"
              size="small"
              :show-all-levels="false"
              :options="serviceOptions"
              :props="serviceRelationProps"
              collapse-tags
              clearable
            />
          </el-form-item>
        </div>
        <el-form-item
          label="对谁可见"
          prop="target"
          v-if="step == 4"
          style="margin-top: 40px; margin-left: -60px"
        >
          <el-checkbox-group
            v-model="ruleForm.target"
            @change="typeRadioChange"
          >
            <el-checkbox label="0">对美孚内部</el-checkbox>
            <el-checkbox label="1">对经销商</el-checkbox>
            <el-checkbox label="2" :disabled="disabledType"
              >对直供客户</el-checkbox
            >
            <el-checkbox label="3" :disabled="disabledType"
              >对经销商客户</el-checkbox
            >
            <el-checkbox label="4">对PES客户</el-checkbox>
            <el-checkbox label="5">对游客</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="游客课程播放权限"
          prop="visitorTarget"
          v-if="step == 4&&ruleForm.target.includes('5')"
          style="margin-top: 40px;"
        >
          <el-radio-group
            v-model="ruleForm.visitorTarget"
          >
            <el-radio :label="1">开放</el-radio>
            <el-radio :label="0">不开放</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <!-- 预览 -->
    <el-dialog
      :title="'配置培训' + trainSelectName"
      :visible.sync="priviewDialogFlag"
      class="preview-train-dialog"
      :close-on-click-modal="false"
      width="480px"
      top="50px"
    >
      <div>
        <el-scrollbar>
          <el-form
            :model="typeValidateForm"
            ref="typeValidateForm"
            class="demo-dynamic"
          >
            <div
              v-for="(types, index) in typeValidateForm.typelist"
              :key="index"
            >
              <el-form-item
                :prop="'typelist.' + index + '.typeName'"
                :rules="{
                  required: true,
                  message: '请输入培训' + trainSelectName,
                  trigger: 'blur',
                }"
                v-if="!types.delFlag"
              >
                <div style="display: flex; align-items: center">
                  <el-input
                    v-model="types.typeName"
                    style="width: 350px"
                    :placeholder="'请输入培训' + trainSelectName + ',20个字'"
                    maxlength="20"
                  ></el-input>
                  <i
                    class="el-icon-remove"
                    style="
                      font-size: 28px;
                      color: #dd0000;
                      margin-left: 16px;
                      cursor: pointer;
                    "
                    @click="deleteVideoType(index, types)"
                    v-if="typeDelFlagList.length > 1"
                  ></i>
                </div>
              </el-form-item>
            </div>
          </el-form>
          <div style="margin-bottom: 20px">
            <el-link
              icon="el-icon-plus"
              @click="addVideoType"
              style="color: #001450"
              :underline="false"
              >继续添加</el-link
            >
          </div>
        </el-scrollbar>
        <div style="text-align: right; margin: 20px 0 0px">
          <el-button size="small" @click="priviewDialogFlag = false"
            >取消</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="submitTypeNameForm('typeValidateForm')"
            >保存</el-button
          >
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="videoDialogFlag"
      custom-class="preview-dialog"
      width="800px"
      top="15vh"
    >
      <div style="height: 400px" v-if="videoDialogFlag">
        <video
          :src="videoUrl"
          controls="controls"
          style="width: 100%; height: 100%; border-radius: 5px"
          autoplay
        >
          您的浏览器不支持 video 标签。
        </video>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    var validateImg = (rule, value, callback) => {
      if (!this.imageUrl) {
        return callback(new Error('请上传封面'))
      } else {
        callback()
      }
    }
    var validateType = (rule, value, callback) => {
      if (!this.ruleForm.trainType) {
        return callback(new Error('请选择培训类别'))
      } else {
        callback()
      }
    }
    var validateScore = (rule, value, callback) => {
      if (value === '' || value === null) {
        return callback(new Error('分数不能为空'))
      } else if (value < 0) {
        return callback(new Error('分数不能小于0'))
      } else {
        callback()
      }
    }

    return {
      serviceRelationProps: {
        multiple: true,
        value: 'serviceNumber',
        label: 'serviceName',
        children: 'children'
      },
      serviceOptions: [],
      trainCourseList: [],
      mainminheight: `height:${document.documentElement.clientHeight - 200}px`,
      isShowSelectType: false,
      isShowSelectAttr: false,
      typeList: [],
      attributeList: [],
      typeValidateForm: {
        typelist: [{ typeName: '', id: '', delFlag: false }]
      },
      step: 1,
      videoFileList: [],
      disabledType: false,
      priviewDialogFlag: false,
      trainSelectName: '',
      timeout: '',
      partSize: '',
      parallel: '',
      retryCount: '',
      retryDuration: '',
      region: 'cn-shanghai',
      userId: '1303984639806000',
      file: null,
      authProgress: 0,
      uploadDisabled: true,
      resumeDisabled: true,
      pauseDisabled: true,
      uploader: null,
      statusText: '',
      imageUrl: '',
      fullscreenLoading: false,
      typeDelFlagList: [],
      deleteVideoList: [],
      uploadFileData: {},
      videoDialogFlag: false,
      videoUrl: '',
      preData: {},
      ruleForm: {
        trainName: '',
        chapterType: 0,
        certificateFlag: 0,
        testFlag: 0,
        testUrl: '',
        img: null,
        creditFlag: 0,
        videoCredit: '',
        testCredit: '',
        certificateCredit: '',
        videoCoverType: '0',
        trainAttr: [],
        trainType: '',
        target: [],
        visitorTarget: 1,
        certificateName: '',
        certificateScore: '',
        videoFile: [
          {
            id: '',
            fileName: '',
            authProgress: 0,
            videoId: null,
            statusText: '',
            newvideoFlag: false
          }
        ],
        trainContent: '',
        videolist: [],
        trainIdList: [],
        serviceNumberList: []
      },
      rules: {
        trainName: [
          { required: true, message: '请输入培训名称', trigger: 'blur' }
        ],
        chapterType: [
          { required: true, message: '请选择章节设置', trigger: 'change' }
        ],
        videoCoverType: [
          { required: true, message: '请选择视频封面', trigger: 'change' }
        ],
        trainType: [
          { required: true, validator: validateType, trigger: 'blur' }
        ],
        trainAttr: [
          {
            type: 'array',
            required: true,
            message: '请选择培训属性',
            trigger: 'change'
          }
        ],
        testUrl: [
          { required: true, message: '请选择试题链接', trigger: 'blur' }
        ],
        certificateName: [
          { required: true, message: '请输入证书名称', trigger: 'blur' }
        ],
        certificateScore: [
          { required: true, validator: validateScore, trigger: 'blur' },
          { type: 'number', message: '分数必须为数字值', trigger: 'blur' }
        ],
        img: [{ required: true, validator: validateImg, trigger: 'change' }],
        videoFile: [
          {
            type: 'array',
            required: true,
            message: '请上传文件',
            trigger: 'change'
          }
        ],
        target: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个',
            trigger: 'change'
          }
        ],
        visitorTarget: [
          {
            required: true,
            message: '请选择游客课程播放权限',
            trigger: 'change'
          }
        ],
        trainContent: [
          { required: true, message: '请输入培训简介', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    document.addEventListener('click', this.bodyCloseMenus)
    this.getQueryTrainTypeList() // 获取培训列表
    if (this.$route.query.trainId) {
      this.queryTrainDetail()
    }
    this.getTranList()
    this.$_getServiceList()
  },
  beforeDestroy () {
    document.removeEventListener('click', this.bodyCloseMenus)
  },
  methods: {
    formatData (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          data[i].children = undefined
        } else {
          this.formatData(data[i].children)
        }
      }
      return data
    },
    // 服务类型
    $_getServiceList (val) {
      this.serviceOptions = []
      this.requestMethodGet(
        '/web/config/serviceConfiguration/getServiceConfTree'
      )
        .then((res) => {
          res = res.data
          if (res.code == 1000) {
            this.serviceOptions = res.data
            this.serviceOptions = this.formatData(this.serviceOptions)
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {})
    },
    async getTranList () {
      const res = await this.requestMethodGet(
        '/train/getRecommendTrainDropList',
        {
          id: this.$route.query.trainId,
          current: 1,
          size: 500
        }
      )
      if (res.data.code == 1000) {
        this.trainCourseList = res.data.data.list
      }
    },
    bodyCloseMenus (e) {
      if (this.$refs.main) {
        this.$refs.main.contains(e.target)
          ? (this.isShowSelectAttr = true)
          : (this.isShowSelectAttr = false)
      }
    },
    onResize () {
      this.mainminheight = `height:${
        document.documentElement.clientHeight - 200
      }px`
    },
    reverseServiceLsit (val) {
      if (val.length == 0) return []
      const res = []
      let item = []
      search(val)
      return res

      function search (val) {
        if (Array.isArray(val) && val.length === 0) {
          res.push(item.slice())
          return
        }

        for (let serviceItem of val) {
          item.push(serviceItem.serviceNumber)
          search(serviceItem.children)
          item.pop()
        }
      }
    },
    queryTrainDetail () {
      let params = { trainId: this.$route.query.trainId }
      this.requestMethodGet('/train/queryTrainDetail', params)
        .then((res) => {
          res = res.data
          const { recommendTrainList, trainServiceConfList } = res.data
          const trainList = recommendTrainList.map((item) => item.id)
          const serviceList = this.reverseServiceLsit(trainServiceConfList)

          if (res.code == 1000) {
            this.ruleForm = {
              id: res.data.id,
              trainName: res.data.trainName,
              chapterType: res.data.chapterType,
              img: null,
              videoCoverType: res.data.videoCoverType,
              trainType: res.data.trainType || '',
              trainAttr: res.data.trainAttributeIdList || [],
              certificateName: res.data.certificateName,
              certificateScore: res.data.certificateScore,
              testFlag: res.data.testFlag,
              testUrl: res.data.testUrl,
              creditFlag: res.data.creditFlag,
              certificateCredit: res.data.certificateCredit,
              videoCredit: res.data.videoCredit,
              testCredit: res.data.testCredit,
              certificateFlag: res.data.certificateFlag,
              target: res.data.target.split(','),
              visitorTarget: res.data.visitorTarget,
              trainContent: res.data.trainContent,
              videoFile: [
                {
                  id: '',
                  fileName: '',
                  authProgress: 0,
                  newvideoFlag: false,
                  delFlag: false,
                  videoId: '',
                  statusText: ''
                }
              ],
              videolist: [],
              trainIdList: trainList,
              serviceNumberList: serviceList
            }
            this.preData = { ...res.data }
            if (res.data.target.indexOf('4') > -1) {
              this.disabledType = true
            } else {
              this.disabledType = false
            }
            this.imageUrl = res.data.coverURL || ''
            if (res.data.chapterType == 1) {
              this.ruleForm.videolist = res.data.trainChapterDtoList.map(
                (item) => {
                  return {
                    id: item.id,
                    chapterName: item.chapterName,
                    uploader: null,
                    newvideoFlag: false,
                    delFlag: false,
                    videoId: item.videoId,
                    authProgress: 100,
                    statusText:
                      item.auditStatus == 0
                        ? '审核中...'
                        : item.auditStatus == 1
                          ? '审核成功'
                          : '审核失败！',
                    fileName: item.fileName
                  }
                }
              )
            } else {
              this.ruleForm.videoFile = [
                {
                  id: res.data.trainChapterDtoList[0].id,
                  fileName: res.data.trainChapterDtoList[0].fileName,
                  authProgress: 100,
                  newvideoFlag: false,
                  delFlag: false,
                  videoId: res.data.trainChapterDtoList[0].videoId,
                  statusText:
                    res.data.trainChapterDtoList[0].auditStatus == 0
                      ? '审核中...'
                      : res.data.trainChapterDtoList[0].auditStatus == 1
                        ? '审核成功'
                        : '审核失败！'
                }
              ]
            }
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {
          this.loading = false
        })
    },
    getQueryTrainTypeList () {
      let params = {}
      this.requestMethodGet('/train/queryTrainTypeList', params)
        .then((res) => {
          res = res.data
          if (res.code == 1000) {
            this.typeList = res.data.map((item) => {
              return {
                id: item.id.toString(),
                typeName: item.typeName,
                delFlag: item.delFlag
              }
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {
          this.loading = false
        })
    },
    playVideo (videoId) {
      let params = { videoId: videoId }
      this.requestMethodGet('/train/getPlayInfo', params)
        .then((res) => {
          res = res.data
          if (res.code == 1000) {
            this.videoDialogFlag = true
            this.videoUrl = res.data.playInfoList[0].playURL
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {
          this.loading = false
        })
    },
    openVideoType (val) {
      let list =
        val == '类型'
          ? JSON.parse(JSON.stringify(this.typeList))
          : this.attributeList.map((item) => {
            return {
              id: item.id,
              typeName: item.attributeName,
              delFlag: item.delFlag
            }
          })
      if (!list.length) {
        this.typeValidateForm.typelist = [
          { typeName: '', id: '', delFlag: false }
        ]
      } else {
        this.typeValidateForm.typelist = this.typeDelFlagList = list
      }
      if (val == '属性') {
        setTimeout(() => {
          this.isShowSelectAttr = false
        }, 20)
      }
      this.trainSelectName = val
      this.priviewDialogFlag = true
      if (this.$refs['typeValidateForm']) {
        this.$refs['typeValidateForm'].clearValidate()
      }
    },
    submitTypeNameForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = '/train/operateTrainTypeBatch'
          let params = this.typeValidateForm.typelist
          if (this.trainSelectName == '属性') {
            url = '/train/addOrUpdateTrainAttribute'
            let list = this.typeValidateForm.typelist.map((item) => {
              return {
                attributeName: item.typeName,
                id: item.id,
                delFlag: item.delFlag
              }
            })
            params = {
              trainAttributeList: list
            }
          }
          this.requestMethodPost(url, params).then((res) => {
            if (res.data.code == 1000) {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.priviewDialogFlag = false
              if (this.trainSelectName == '属性') {
                this.ruleForm.trainAttr = []
              } else {
                this.getQueryTrainTypeList()
                this.ruleForm.trainType = ''
              }
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
        }
      })
    },
    handleAvatarSuccess (file) {
      this.$refs['ruleForm'].clearValidate('img')
      let params = new FormData()
      params.append('fileType', 'train_img')
      params.append('multipartFiles', file.raw)
      this.requestMethodPost('/web/file/uploadFilesPublic', params)
        .then((res) => {
          res = res.data
          if (res.code == 1000) {
            this.ruleForm.img = res.data[0]
            this.imageUrl = URL.createObjectURL(file.raw)
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {})
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type.startsWith('image')
      if (!isJPG) {
        this.ImageList = []
        this.$message.error('只能上传图片类型文件')
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.imageList = []
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isJPG && isLt2M
    },
    hChooseFile () {
      document.querySelector('#fileUpload').click()
    },
    chooseFileRow (name) {
      document.querySelector(name).click()
    },
    handleVideoRemove () {
      if (this.uploader) {
        this.uploader.stopUpload()
      }
      document.querySelector('#fileUpload').value = ''
      this.ruleForm.videoFile[0].authProgress = 0
      this.ruleForm.videoFile[0].statusText = ''
      this.ruleForm.videoFile[0].fileName = ''
    },
    videoRemoveIndex (row, name) {
      if (row.uploader) {
        row.uploader.stopUpload()
      }
      document.querySelector(name).value = ''
      row.authProgress = 0
      row.statusText = ''
      row.fileName = ''
    },
    addVideoList () {
      let list = this.ruleForm.videolist.filter((item) => {
        return item.statusText == '上传失败！'
      })
      if (list.length) {
        this.$message({
          type: 'error',
          message: '请先点击上传或重新上传失败文件'
        })
        return
      }
      this.ruleForm.videolist.push({
        id: '',
        chapterName: '',
        uploader: null,
        delFlag: false,
        videoId: null,
        authProgress: 0,
        statusText: '',
        fileName: '',
        newvideoFlag: false
      })
    },
    deleteVideo (index, row) {
      if (row.id) {
        row.delFlag = true
        this.deleteVideoList.push(row)
      }
      this.ruleForm.videolist.splice(index, 1)
    },
    deleteVideoType (index, row) {
      if (row.id) {
        let params = {}
        let url = '/train/judgeTrainTypeHaveTrain'
        if (this.trainSelectName == '属性') {
          params.trainAttributeId = row.id
          url = '/train/checkDeleteTrainAttribute'
        } else {
          params.trainType = row.id
        }
        this.requestMethodGet(url, params)
          .then((res) => {
            if (res.data.code == 1000) {
              if (res.data.data) {
                this.$message({
                  type: 'warning',
                  message:
                    this.trainSelectName == '属性'
                      ? `属性${row.typeName}有培训正在使用，无法删除`
                      : `类型${row.typeName}有培训，无法删除`
                })
              } else {
                row.delFlag = true
              }
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
          .catch(() => {})
      } else {
        this.typeValidateForm.typelist.splice(index, 1)
      }
      this.typeDelFlagList = this.typeValidateForm.typelist.filter((item) => {
        return !item.delFlag
      })
    },
    typeRadioChange (val) {
      if (this.ruleForm.target.indexOf('4') > -1) {
        this.disabledType = true
        this.ruleForm.target = this.ruleForm.target.filter((item) => {
          return item != '3' && item != '2'
        })
      } else {
        this.disabledType = false
      }
    },
    selectTab (val) {
      if (val == 1) {
        this.isShowSelectType = !this.isShowSelectType
        this.isShowSelectAttr = false
      } else {
        this.isShowSelectAttr = !this.isShowSelectAttr
        this.isShowSelectType = false
      }
    },
    selectItem (row, val) {
      if (val == 1) {
        this.ruleForm.trainType = row.id
      } else {
        if (!this.ruleForm.trainAttr.includes(row.id)) {
          this.ruleForm.trainAttr.push(row.id)
        } else {
          let index = this.ruleForm.trainAttr.indexOf(row.id)
          this.ruleForm.trainAttr.splice(index, 1)
        }
        this.$refs.ruleForm.validateField('trainAttr', () => {})
      }
    },
    addVideoType () {
      this.typeValidateForm.typelist.push({
        typeName: '',
        id: '',
        delFlag: false
      })
      this.typeDelFlagList = this.typeValidateForm.typelist.filter((item) => {
        return !item.delFlag
      })
    },
    fileChange (e, row) {
      if (!e.target.files[0]) {
        this.$message.error('请选择视频文件')
        return
      }
      if (!e.target.files[0].type.startsWith('video')) {
        document.querySelector('#fileUpload').value = ''
        this.$message.error('只能上传视频类型文件')
        return
      }
      var userData = `{"Vod":{}}`
      if (this.ruleForm.chapterType == 0) {
        if (this.uploader) {
          this.uploader.stopUpload()
        }
        this.uploader = this.createUploader()
        this.uploader.addFile(e.target.files[0], null, null, null, userData)
        this.$refs['ruleForm'].clearValidate('videoFile')
        this.ruleForm.videoFile[0].fileName = e.target.files[0].name
        this.ruleForm.videoFile[0].authProgress = 0
        this.ruleForm.videoFile[0].videoId = null
        this.ruleForm.videoFile[0].statusText = ''
      } else {
        this.$refs['ruleForm'].clearValidate()
        row.fileName = e.target.files[0].name
        row.authProgress = 0
        row.videoId = null
        row.statusText = ''
        if (row.uploader) {
          row.uploader.stopUpload()
        }
        row.uploader = this.createUploader(row)
        row.uploader.addFile(e.target.files[0], null, null, null, userData)
      }
    },
    authUpload (data) {
      // 然后调用 startUpload 方法, 开始上传
      if (this.uploader !== null) {
        this.uploadFileData = data
        this.uploader.startUpload()
      }
    },
    // 多章节上传
    startUpload (row) {
      // 然后调用 startUpload 方法, 开始上传
      if (row.uploader !== null) {
        this.uploadFileData = row
        row.uploader.startUpload()
      }
    },
    createUploader (val) {
      let self = this
      let uploader = new AliyunUpload.Vod({
        timeout: self.timeout || 60000,
        partSize: self.partSize || 1048576,
        parallel: self.parallel || 5,
        retryCount: self.retryCount || 3,
        retryDuration: self.retryDuration || 2,
        region: self.region,
        userId: self.userId,
        // 添加文件成功
        addFileSuccess: function (uploadInfo) {
          self.uploadDisabled = false
          self.resumeDisabled = false
        },
        // 开始上传
        onUploadstarted: function (uploadInfo) {
          // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
          // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
          // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
          // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
          // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
          // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
          if (!uploadInfo.videoId) {
            let params = {
              fileName: uploadInfo.file.name,
              title: uploadInfo.file.name,
              coverUrl: self.ruleForm.img
            }
            self
              .requestMethodGet('/train/createUploadVideo', params)
              .then((res) => {
                res = res.data
                if (res.code == 1000) {
                  let uploadAuth = res.data.uploadAuth
                  let uploadAddress = res.data.uploadAddress
                  let videoId = res.data.videoId
                  self.uploadFileData.newvideoFlag = true
                  self.uploadFileData.videoId = res.data.videoId
                  uploader.setUploadAuthAndAddress(
                    uploadInfo,
                    uploadAuth,
                    uploadAddress,
                    videoId
                  )
                } else {
                  self.$message({
                    message: res.msg,
                    type: 'warning'
                  })
                }
              })
              .catch((res) => {})
          } else {
            // 如果videoId有值，根据videoId刷新上传凭证
            self
              .requestMethodGet('/train/refreshUploadVideo', {
                videoId: uploadInfo.videoId
              })
              .then((res) => {
                res = res.data
                if (res.code == 1000) {
                  let uploadAuth = res.data.uploadAuth
                  let uploadAddress = res.data.uploadAddress
                  let videoId = res.data.videoId
                  self.uploadFileData.newvideoFlag = true
                  self.uploadFileData.videoId = res.data.videoId
                  uploader.setUploadAuthAndAddress(
                    uploadInfo,
                    uploadAuth,
                    uploadAddress,
                    videoId
                  )
                } else {
                  self.$message({
                    message: res.msg,
                    type: 'warning'
                  })
                }
              })
              .catch((res) => {})
          }
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
          if (val) {
            val.statusText = '上传成功！'
          } else {
            self.uploadFileData.statusText = '上传成功！'
          }
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
          if (val) {
            val.statusText = '上传失败！'
          } else {
            self.uploadFileData.statusText = '上传失败！'
          }
        },
        // 取消文件上传
        onUploadCanceled: function (uploadInfo, code, message) {},
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: function (uploadInfo, totalSize, progress) {
          let progressPercent = Math.ceil(progress * 100)
          if (val) {
            val.authProgress = progressPercent
          } else {
            self.uploadFileData.authProgress = progressPercent
          }
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo) {
          // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
          // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
          // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
          self
            .requestMethodGet('/train/refreshUploadVideo', {
              videoId: uploadInfo.videoId
            })
            .then((res) => {
              res = res.data
              if (res.code == 1000) {
                let uploadAuth = res.data.UploadAuth
                uploader.resumeUploadWithAuth(uploadAuth)
              } else {
                self.$message({
                  message: res.msg,
                  type: 'warning'
                })
              }
            })
            .catch((res) => {})
        },
        // 全部文件上传结束
        onUploadEnd: function (uploadInfo) {}
      })
      return uploader
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let list = []
          if (this.ruleForm.chapterType == 0) {
            list = this.ruleForm.videoFile.filter((item) => {
              return item.statusText == '上传失败！' || !item.statusText
            })
          } else {
            list = this.ruleForm.videolist.filter((item) => {
              return item.statusText == '上传失败！' || !item.statusText
            })
          }
          if (list.length) {
            this.$message({
              type: 'error',
              message: '请先点击上传或重新上传失败文件'
            })
            return
          }
          if (this.step < 4) {
            this.step = this.step + 1
            return
          }
          let params = {
            id: this.ruleForm.id,
            target: this.ruleForm.target.join(),
            chapterType: this.ruleForm.chapterType,
            trainContent: this.ruleForm.trainContent,
            trainType: this.ruleForm.trainType,
            testFlag: this.ruleForm.testFlag,
            testUrl: this.ruleForm.testUrl,
            certificateFlag: this.ruleForm.certificateFlag,
            certificateName: this.ruleForm.certificateName,
            certificateScore: this.ruleForm.certificateScore,
            creditFlag: this.ruleForm.creditFlag,
            videoCredit: this.ruleForm.videoCredit,
            testCredit: this.ruleForm.testCredit,
            certificateCredit: this.ruleForm.certificateCredit,
            trainAttributeIdList: this.ruleForm.trainAttr,
            videoCoverType: this.ruleForm.videoCoverType,
            trainName: this.ruleForm.trainName,
            coverUrl:
              this.ruleForm.videoCoverType == 1 ? this.ruleForm.img : null
          }
          if(this.ruleForm.target.includes('5')){
            params.visitorTarget=this.ruleForm.visitorTarget
          }
          if (this.ruleForm.chapterType == 0) {
            // 单张节
            params.trainChapterList = [
              {
                videoId: this.ruleForm.videoFile[0].newvideoFlag
                  ? this.ruleForm.videoFile[0].videoId
                  : null,
                id: this.ruleForm.videoFile[0].id || '',
                delFlag: false
              }
            ]
            // 编辑时多章节切换成单张节需要把原先多章节数据delFlag变成true
            if (this.preData.chapterType == 1) {
              this.preData.trainChapterDtoList.forEach((item) => {
                item.delFlag = true
                params.trainChapterList.push({
                  id: item.id,
                  chapterName: item.chapterName,
                  delFlag: true,
                  videoId: null
                })
              })
            }
          } else {
            // 多章节
            let list = this.deleteVideoList.concat(this.ruleForm.videolist)
            params.trainChapterList = list.map((item) => {
              return {
                id: item.id,
                chapterName: item.chapterName,
                delFlag: item.delFlag,
                videoId: item.newvideoFlag ? item.videoId : null
              }
            })
            // 编辑时单章节切换成多张节需要把原先单章节数据delFlag变成true
            if (this.preData.chapterType == 0) {
              this.preData.trainChapterDtoList.forEach((item) => {
                item.delFlag = true
                params.trainChapterList.push({
                  id: item.id,
                  delFlag: true,
                  videoId: null
                })
              })
            }
          }
          let url = '/train/insertTrain'
          if (this.ruleForm.id) {
            url = '/train/modifyTrain'
          }
          this.fullscreenLoading = true
          const servicePostList = this.ruleForm.serviceNumberList.map(
            (item) => {
              return item[item.length - 1]
            }
          )
          this.requestMethodPost(url, {
            ...params,
            trainIdList:
              this.ruleForm.trainIdList.length == 0
                ? []
                : this.ruleForm.trainIdList,
            serviceNumberList:
              servicePostList.length == 0 ? [] : servicePostList
          })
            .then(async (res) => {
              this.fullscreenLoading = false
              if (res.data.code == 1000) {
                await this.requestMethodGet('/train/saveTrainTestUrl')
                this.$message({
                  type: 'success',
                  message: this.ruleForm.id ? '修改成功' : '新建成功'
                })
                this.$router.go(-1)
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
            })
            .catch(() => {
              this.fullscreenLoading = false
            })
        } else {
          return false
        }
      })
    },
    resetForm () {
      if (this.step > 1) {
        this.step--
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>
<style lang='less'>
.train-edit-container {
  padding: 32px 20px;
  position: relative;
  overflow: auto;
  .step-style {
    border: 2px solid #e9e9e9;
    width: 30px;
    height: 30px;
    line-height: 30px;
    display: inline-block;
    border-radius: 50%;
    text-align: center;
    font-size: 15px;
    font-weight: bold;
    color: #999;
    margin-top: 5rpx;
    margin-right: 8px;
  }
  .green-bg {
    background: #008888 !important;
    color: #008888;
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
  .select-poup {
    position: absolute;
    z-index: 2210;
    padding: 6px 0;
    width: 100%;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    margin: 12px 0;
    .el-scrollbar__view {
      max-height: 300px;
    }
    .select-item {
      padding: 0 20px;
      height: 34px;
      line-height: 34px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .select-item:hover {
      background-color: #f5f7fa;
    }
  }
  .popper-arrow {
    border-width: 6px;
    filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
    top: -6px;
    left: 35px;
    margin-right: 3px;
    border-top-width: 0;
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-bottom-color: #ebeef5;
    border-style: solid;
  }
  .popper-arrow::after {
    position: absolute;
    content: " ";
    border-width: 6px;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    top: 1px;
    margin-left: -6px;
    border-top-width: 0;
    border-bottom-color: #fff;
  }
  .el-form-item__label {
    color: #000 !important;
  }
}
.preview-train-dialog {
  .el-scrollbar__wrap {
    max-height: 520px;
    overflow-x: hidden;
  }
}

.select-hide {
  display: none;
}
.blue-text {
  color: #dd0000;
}
</style>
