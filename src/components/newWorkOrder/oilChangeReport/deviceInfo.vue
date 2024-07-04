<template>
  <el-card class="deviceInfo" style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header" class="title" style="display:flex;align-items:center;justify-content: space-between;">
      <div>
        <el-divider direction="vertical"></el-divider>
        <span>{{ deviceName }}</span>
        <el-tooltip class="item" effect="dark" content="设备及润滑点信息请点击【前往补充】按钮，前往设备编辑页" placement="top-start">
          <el-button type="text" style="color:#333;font-size:15px;padding:0px;">
            <i class="el-icon-warning-outline"></i>
          </el-button>
        </el-tooltip>
      </div>
      <div style="display:flex;align-items:center;justify-content: space-between;">
        <div @click="handleRefresh" style="color:#001450;font-weight:normal;font-size:13px;margin-right:20px;cursor: pointer;">
          <i class="el-icon-refresh-right" style="margin-right:4px;"></i>刷新数据
        </div>
        <div @click="handleEdit" style="color:#001450;font-weight:normal;font-size:13px;cursor: pointer;"><i class="el-icon-edit" style="margin-right:4px;"></i> 前往补充</div>
      </div>
    </div>
    <el-form :model="deviceForm" ref="deviceRef" label-position="left" style="padding:0 20px;">
      <el-row>
        <div v-for="(item, index) in deviceForm" :key="index">
          <el-col
            :span="(item.nameKey == 'key_last_add_oil_date' && deviceDetailObj.reportType == '9') || item.nameKey == 'key_1321' ? '24' : '6'"
            v-if="
              item.display && item.type == 'string' && item.nameKey != 'key_desc' && (item.nameKey != 'lup_method_zhi_lei' && item.nameKey != 'pen_she_you_wu_method' && item.nameKey != 'key_dq_az')
            "
          >
            <el-form-item :label="item.name">
              <span slot="label">
                <div>
                  <span v-if="item.required" class="star">*</span>
                  <span v-else class="star" style="opacity: 0;">*</span>
                  <span>{{ item.name }}</span>
                </div>
              </span>
              <div class="no-wrap" v-if="item.type == 'string' && item.value" style="margin-left:10px;">
                <el-tooltip class="item" effect="dark" :content="item.value" placement="top-start">
                  <span>{{ item.value }}{{ item.unit }}</span>
                </el-tooltip>
              </div>
              <span v-if="item.type == 'string' && !item.value && item.required" style="color:#dd0000;font-family:MicrosoftYaHei;margin-left:10px;">暂无，请补充</span>
              <span v-if="item.type == 'string' && !item.value && !item.required && item.nameKey != 'key_1321'" style="color:#666;font-family:MicrosoftYaHei;margin-left:10px;">暂无</span>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="item.type == 'string' && item.nameKey == 'key_dq_az' && lubricationMethodType == 1">
            <el-form-item :label="item.name">
              <span slot="label">
                <div>
                  <span v-if="item.required" class="star">*</span>
                  <span>{{ item.name }}</span>
                  <span v-if="item.unit">({{ item.unit }})</span>
                </div>
              </span>
              <div class="no-wrap" v-if="item.type == 'string' && item.value" style="margin-left:10px;">
                <el-tooltip class="item" effect="dark" :content="item.value" placement="top-start">
                  <span>{{ item.value }}{{ item.unit }}</span>
                </el-tooltip>
              </div>
              <span v-if="item.type == 'string' && !item.value && item.required" style="color:#dd0000;font-family:MicrosoftYaHei;margin-left:10px;">暂无，请补充</span>
              <span v-if="item.type == 'string' && !item.value && !item.required" style="color:#666;font-family:MicrosoftYaHei;margin-left:10px;">暂无</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="item.type == 'string' && item.nameKey == 'key_desc'">
            <el-form-item :label="item.name" :required="item.required">
              <span slot="label">
                <div>
                  <span v-if="item.required" class="star">*</span>
                  <span>{{ item.name }}</span>
                  <span v-if="item.unit">({{ item.unit }})</span>
                </div>
              </span>
              <div v-if="item.type == 'string' && item.value" style="margin-left:60px;">
                <span>{{ item.value }}{{ item.unit }}</span>
              </div>
              <span v-if="item.type == 'string' && !item.value && item.required" style="color:#dd0000;font-family:MicrosoftYaHei;margin-left:10px;">暂无，请补充</span>
              <span v-if="item.type == 'string' && !item.value && !item.required" style="color:#666;font-family:MicrosoftYaHei;margin-left:10px;">暂无</span>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="item.type == 'input2' && !item.children.length">
            <el-form-item :label="item.name" :required="item.required">
              <el-input
                v-if="item.type == 'input2' && type == 'edit'"
                style="width:100px;"
                size="small"
                @keyup.native="proving1(item)"
                :maxlength="item.length"
                v-model="item.value"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="item.type == 'input2' && item.children.length">
            <el-form-item :label="item.name" :required="item.required">
              <el-input
                v-if="item.type == 'input2' && type == 'edit'"
                style="width:100px;"
                size="small"
                @keyup.native="proving1(item)"
                :maxlength="item.length"
                v-model="item.value"
                placeholder="请输入"
              ></el-input>
              <el-select size="small" clearable style="width:220px" v-model="item.children[0].value" placeholder="--请选择--">
                <el-option v-for="unit in item.children[0].fieldOption" :key="unit.value" :label="unit.option" :value="unit.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="item.type == 'img'">
            <div style="font-size:14px;color:#606266;margin-bottom:10px;">
              <span v-if="item.required" class="star" style="margin-right:5px;">*</span><span>{{ item.name }}（最多上传{{ item.length }}张图片）</span>
            </div>
            <el-form-item :required="item.required">
              <!-- 上传图片 -->
              <el-row>
                <el-upload
                  v-if="item.type == 'img'"
                  :class="{ noUploadBtn: item.imgFullDtoUrl.length >= item.length || notShowUploadBtn }"
                  :action="uploadUrl"
                  accept="image/*"
                  list-type="picture-card"
                  :limit="item.length"
                  :auto-upload="false"
                  :disabled="true"
                  :file-list="item.imgFullDtoUrl"
                  :before-upload="beforeAvatarUpload"
                >
                  <div style="width:148px;height:148px;" @click="handlePictureUpload(item)">
                    <i class="el-icon-plus"></i>
                  </div>
                  <div slot="file" slot-scope="{ file }">
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                    <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                      <span class="el-upload-list__item-preview">
                        <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, item)"></i>
                      </span>
                      <span class="el-upload-list__item-preview">
                        <i class="el-icon-crop" @click.self="handlePicturePrune(file, item)"></i>
                      </span>
                      <span v-if="!disabled" class="el-upload-list__item-delete">
                        <i class="el-icon-delete" @click.self="handleRemove(file, item)"></i>
                      </span>
                    </span>
                  </div>
                </el-upload>
                <el-dialog :visible.sync="imgDialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="" />
                </el-dialog>
              </el-row>
              <!-- 上传图片 -->
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="item.type == 'img2'">
            <div style="font-size:14px;color:#606266;margin-bottom:10px;">
              <span v-if="item.required" class="star" style="margin-right:5px;">*</span><span v-else class="star" style="opacity: 0;margin-right:5px;">*</span>{{ item.name }}
              <span style="margin-left:20px;" v-if="item.imgFullUrl.length == 0">暂无</span>
            </div>
            <el-form-item :required="item.required">
              <el-row v-if="item.imgFullUrl.length">
                <div v-for="(pic, index) in item.imgFullUrl" :key="index">
                  <img style="width:120px" :src="pic" />
                </div>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="20" v-if="item.type == 'textarea'">
            <div style="font-size:14px;color:#606266;margin-bottom:10px;"><span v-if="item.required" class="star">*</span>{{ item.name }}</div>

            <el-form-item :required="item.required">
              <el-input type="textarea" placeholder="请输入" v-model="item.value" style="width:100%" :maxlength="item.length" show-word-limit :autosize="autosize" clearable />
            </el-form-item>
          </el-col>

          <!-- 取样部分 -->
          <el-col v-if="item.nameKey == 'key_1237' || item.nameKey == 'key_1238'" class="star" style="width: 30%;"
            ><span v-if="item.required" class="star">*</span><span style="color: #606266;margin-bottom:6px;display:inline-block;">{{ item.name }}</span>
            <br />
            <el-input
              v-if="item.name == '取样部位'"
              style="width: 80%;"
              placeholder="请输入"
              v-model="item.value"
              :maxlength="item.length"
              show-word-limit
              :autosize="autosize"
              size="small"
              clearable
            />
            <el-date-picker v-if="item.name == '取样日期'" v-model="item.value" type="date" value-format="yyyy-MM-dd" style="width:80%" size="small" placeholder="选择日期"> </el-date-picker>
          </el-col>
          <!-- 定期或者按质 -->
          <div
            v-if="
              item.nameKey == 'key_dq_az' &&
                ((deviceDetailObj.reportType != '7' && deviceDetailObj.reportType != '8') || ((deviceDetailObj.reportType == '7' || deviceDetailObj.reportType == '8') && lubricationMethodType == '1'))
            "
          >
            <div v-for="(cylinder, index) in item.children" :key="index">
              <el-col :span="6" v-if="cylinder.display && cylinder.valueCodeNotDisplay == item.valueCode && cylinder.type == 'string'">
                <el-form-item :label="cylinder.name + '：'" :required="cylinder.required">
                  <span v-if="cylinder.type == 'string' && cylinder.value" style="margin-left:10px;"
                    >{{ cylinder.value }}
                    <span v-if="cylinder.nameKey == 'key_add_oil_period' || cylinder.nameKey == 'key_149_oil_change'">{{
                      cylinder.unit == "M" ? "月" : cylinder.unit == "Y" ? "年" : cylinder.unit == "D" ? "天" : cylinder.unit == "H" ? "小时" : cylinder.unit
                    }}</span>
                    <span v-else>{{ cylinder.unit }}</span>
                  </span>
                  <span v-if="cylinder.type == 'string' && !cylinder.value && cylinder.required" style="color:#dd0000;font-family:MicrosoftYaHei;margin-left:10px;">暂无，请补充</span>
                  <span v-if="cylinder.type == 'string' && !cylinder.value && !cylinder.required" style="color:#666;font-family:MicrosoftYaHei;margin-left:10px;">暂无</span>
                </el-form-item>
              </el-col>
              <el-col
                :span="6"
                v-if="cylinder.display && cylinder.valueCodeNotDisplay == item.valueCode && cylinder.nameKey == 'key_has_done_oil_sysjc' && cylinder.valueCode == '1'"
                v-for="(cylinder2, index2) in cylinder.children"
                :key="index2"
              >
                <el-form-item :label="cylinder2.name + '：'" :required="cylinder2.required">
                  <span v-if="cylinder2.type == 'string' && cylinder2.value" style="margin-left:10px;">{{ cylinder2.value }}{{ cylinder2.unit }}</span>
                  <span v-if="cylinder2.type == 'string' && !cylinder2.value && cylinder2.required" style="color:#dd0000;font-family:MicrosoftYaHei;margin-left:10px;">暂无，请补充</span>
                  <span v-if="cylinder2.type == 'string' && !cylinder2.value && !cylinder2.required" style="color:#666;font-family:MicrosoftYaHei;margin-left:10px;">暂无</span>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="cylinder.display && cylinder.valueCodeNotDisplay == item.valueCode && cylinder.type == 'input2'">
                <el-form-item :label="cylinder.name" :required="cylinder.required">
                  <el-input
                    v-if="cylinder.type == 'input2' && type == 'edit'"
                    style="width:100px;"
                    size="small"
                    @keyup.native="proving1(cylinder)"
                    :maxlength="cylinder.length"
                    v-model="cylinder.value"
                    placeholder="请输入"
                  ></el-input>
                  {{ cylinder.unit }}
                </el-form-item>
              </el-col>
              <el-col
                :span="6"
                v-if="
                  cylinder.display &&
                    (cylinder.nameKey == 'sf_zdsc_xc_jyjh' || cylinder.nameKey == 'sf_zdsc_xc_hyjh') &&
                    cylinder.valueCodeNotDisplay == item.valueCode &&
                    cylinder.type == 'string' &&
                    cylinder.valueCode == '1'
                "
                v-for="(cylinder2, index) in cylinder.children"
                :key="index"
              >
                <div>
                  <el-form-item :label="cylinder2.name + '：'" :required="cylinder.required">
                    <span v-if="cylinder2.type == 'string' && cylinder2.value" style="margin-left:10px;">{{ cylinder2.value }}{{ cylinder2.unit }}</span>
                    <span v-if="cylinder2.type == 'string' && !cylinder2.value && cylinder2.required" style="color:#dd0000;margin-left:10px;">暂无，请补充</span>
                    <span v-if="cylinder2.type == 'string' && !cylinder2.value && !cylinder2.required" style="color:#666;margin-left:10px;">暂无</span>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6" v-if="cylinder.diaplay && cylinder.valueCode == 0 && cylinder.type == 'string' && cylinder.value == '是'" v-for="(cylinder2, index) in cylinder.children" :key="index">
                <div>
                  <el-form-item :label="cylinder2.name + '：'" :required="cylinder.required">
                    <span v-if="cylinder2.type == 'string' && cylinder2.value" style="margin-left:10px;">{{ cylinder2.value }}{{ cylinder2.unit }}</span>
                    <span v-if="cylinder2.type == 'string' && !cylinder2.value && cylinder2.required" style="color:#dd0000;margin-left:10px;">暂无，请补充</span>
                    <span v-if="cylinder2.type == 'string' && !cylinder2.value && !cylinder2.required" style="color:#666;margin-left:10px;">暂无</span>
                  </el-form-item>
                </div>
              </el-col>
            </div>
          </div>
          <!-- 油雾的定期或者按质 -->
          <div
            v-if="
              item.nameKey == 'pen_she_you_wu_method' && ((deviceDetailObj.reportType == '7' && lubricationMethodType == '2') || (deviceDetailObj.reportType == '8' && lubricationMethodType == '3'))
            "
          >
            <div v-for="(cylinder, index) in item.children" :key="index">
              <el-col :span="6" v-if="cylinder.display && cylinder.type == 'string'">
                <el-form-item :label="cylinder.name + '：'" :required="cylinder.required">
                  <span v-if="cylinder.type == 'string' && cylinder.value" style="margin-left:10px;"
                    >{{ cylinder.value }}
                    <span v-if="cylinder.nameKey == 'key_add_oil_period' || cylinder.nameKey == 'key_149_oil_change'">{{
                      cylinder.unit == "M" ? "月" : cylinder.unit == "Y" ? "年" : cylinder.unit == "D" ? "天" : cylinder.unit == "H" ? "小时" : cylinder.unit
                    }}</span>
                    <span v-else>{{ cylinder.unit }}</span>
                  </span>
                  <span v-if="cylinder.type == 'string' && !cylinder.value && cylinder.required" style="color:#dd0000;font-family:MicrosoftYaHei;margin-left:10px;">暂无，请补充</span>
                  <span v-if="cylinder.type == 'string' && !cylinder.value && !cylinder.required" style="color:#666;font-family:MicrosoftYaHei;margin-left:10px;">暂无</span>
                </el-form-item>
              </el-col>
              <el-col
                :span="6"
                v-if="cylinder.display && cylinder.type == 'string' && cylinder.valueCode == '1' && cylinder.nameKey == 'sf_zdsc_xc_jyjh'"
                v-for="(cylinder2, index) in cylinder.children"
                :key="index"
              >
                <div>
                  <el-form-item :label="cylinder2.name + '：'" :required="cylinder.required">
                    <span v-if="cylinder2.type == 'string' && cylinder2.value" style="margin-left:10px;">{{ cylinder2.value }}{{ cylinder2.unit }}</span>
                    <span v-if="cylinder2.type == 'string' && !cylinder2.value && cylinder2.required" style="color:#dd0000;margin-left:10px;">暂无，请补充</span>
                    <span v-if="cylinder2.type == 'string' && !cylinder2.value && !cylinder2.required" style="color:#666;margin-left:10px;">暂无</span>
                  </el-form-item>
                </div>
              </el-col>
            </div>
          </div>
          <!-- 脂类的 -->
          <div v-if="item.nameKey == 'lup_method_zhi_lei' && (deviceDetailObj.reportType == '7' || deviceDetailObj.reportType == '8') && lubricationMethodType == '4'">
            <div v-for="(cylinder, index) in item.children" :key="index">
              <el-col :span="6" v-if="cylinder.display && cylinder.valueCodeNotDisplay == item.valueCode && cylinder.type == 'string'">
                <el-form-item :label="cylinder.name + '：'" :required="cylinder.required">
                  <span v-if="cylinder.type == 'string' && cylinder.value" style="margin-left:10px;"
                    >{{ cylinder.value }}
                    <span v-if="cylinder.nameKey == 'key_add_oil_period' || cylinder.nameKey == 'key_149_oil_change'">{{
                      cylinder.unit == "M" ? "月" : cylinder.unit == "Y" ? "年" : cylinder.unit == "D" ? "天" : cylinder.unit == "H" ? "小时" : cylinder.unit
                    }}</span>
                    <span v-else>{{ cylinder.unit }}</span>
                  </span>
                  <span v-if="cylinder.type == 'string' && !cylinder.value && cylinder.required" style="color:#dd0000;font-family:MicrosoftYaHei;margin-left:10px;">暂无，请补充</span>
                  <span v-if="cylinder.type == 'string' && !cylinder.value && !cylinder.required" style="color:#666;font-family:MicrosoftYaHei;margin-left:10px;">暂无</span>
                </el-form-item>
              </el-col>
              <el-col
                :span="6"
                v-if="cylinder.display && cylinder.valueCodeNotDisplay == item.valueCode && cylinder.nameKey == 'key_has_done_oil_sysjc' && cylinder.valueCode == '1'"
                v-for="(cylinder2, index2) in cylinder.children"
                :key="index2"
              >
                <el-form-item :label="cylinder2.name + '：'" :required="cylinder2.required">
                  <span v-if="cylinder2.type == 'string' && cylinder2.value" style="margin-left:10px;">{{ cylinder2.value }}{{ cylinder2.unit }}</span>
                  <span v-if="cylinder2.type == 'string' && !cylinder2.value && cylinder2.required" style="color:#dd0000;font-family:MicrosoftYaHei;margin-left:10px;">暂无，请补充</span>
                  <span v-if="cylinder2.type == 'string' && !cylinder2.value && !cylinder2.required" style="color:#666;font-family:MicrosoftYaHei;margin-left:10px;">暂无</span>
                </el-form-item>
              </el-col>
              <el-col
                :span="6"
                v-if="cylinder.display && cylinder.type == 'string' && cylinder.valueCode == '1' && (cylinder.nameKey == 'sf_zdsc_xc_jyjh' || cylinder.nameKey == 'sf_zdsc_xc_hyjh')"
                v-for="(cylinder2, index) in cylinder.children"
                :key="index"
              >
                <div>
                  <el-form-item :label="cylinder2.name + '：'" :required="cylinder.required">
                    <span v-if="cylinder2.type == 'string' && cylinder2.value" style="margin-left:10px;">{{ cylinder2.value }}{{ cylinder2.unit }}</span>
                    <span v-if="cylinder2.type == 'string' && !cylinder2.value && cylinder2.required" style="color:#dd0000;margin-left:10px;">暂无，请补充</span>
                    <span v-if="cylinder2.type == 'string' && !cylinder2.value && !cylinder2.required" style="color:#666;margin-left:10px;">暂无</span>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6" v-if="cylinder.display && cylinder.valueCodeNotDisplay == item.valueCode && cylinder.type == 'input2'">
                <el-form-item :label="cylinder.name" :required="cylinder.required">
                  <el-input
                    v-if="cylinder.type == 'input2' && type == 'edit'"
                    style="width:100px;"
                    size="small"
                    @keyup.native="proving1(cylinder)"
                    :maxlength="cylinder.length"
                    v-model="cylinder.value"
                    placeholder="请输入"
                  ></el-input>
                  {{ cylinder.unit }}
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="cylinder.display && cylinder.valueCode == 0 && cylinder.type == 'string' && cylinder.value == '是'" v-for="(cylinder2, index) in cylinder.children" :key="index">
                <div>
                  <el-form-item :label="cylinder2.name + '：'" :required="cylinder.required">
                    <span v-if="cylinder2.type == 'string' && cylinder2.value" style="margin-left:10px;">{{ cylinder2.value }}{{ cylinder2.unit }}</span>
                    <span v-if="cylinder2.type == 'string' && !cylinder2.value && cylinder2.required" style="color:#dd0000;margin-left:10px;">暂无，请补充</span>
                    <span v-if="cylinder2.type == 'string' && !cylinder2.value && !cylinder2.required" style="color:#666;margin-left:10px;">暂无</span>
                  </el-form-item>
                </div>
              </el-col>
            </div>
          </div>
        </div>
      </el-row>
    </el-form>
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
  </el-card>
</template>

<script>
import imgCutter from "@/components/imgCutter.vue";
export default {
  components: { imgCutter },
  props: {
    type: {
      type: String,
      default: () => {
        return "";
      }
    },
    deviceName: {
      type: String,
      default: () => {
        return "";
      }
    },
    deviceDetail: {
      type: Object,
      default: () => {
        return "";
      }
    },
    deviceObj: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      pruneIndex: null,
      input: "",
      uploadUrl: "",
      deviceDetailObj: this.deviceDetail,
      lubricationMethodType: "", // 润滑方式类型  1普通油类  2.油雾   3.喷射  4  脂类
      deviceForm: this.deviceObj,
      imgDialogVisible: false,
      cutFlag: false,
      notShowUploadBtn: false,
      dialogImageUrl: "",
      tempImagePath: "",
      cutFileList: {},
      deviceValidate: {
        device_manufacturer: [{ required: true, message: "请输入设备制造商", trigger: "blur" }],
        device_model: [{ required: true, message: "请输入设备型号", trigger: "blur" }]
      },
      cutWidth:200,
      cutHeight:200
    };
  },
  mounted() {},
  created() {
    this.deviceForm = this.deviceObj;
    this.deviceDetailObj = this.deviceDetail;
    // 如果是特殊油类  油雾
    if (this.deviceDetailObj.oilType == 1) {
      if (this.deviceDetailObj.lubricationMethod == "lubrication_method_0004" && this.deviceDetailObj.reportType == "7") {
        this.lubricationMethodType = 2;
      } else if (this.deviceDetailObj.lubricationMethod == "lubrication_method_0003" && this.deviceDetailObj.reportType == "8") {
        // 如果是特殊油类  喷射
        this.lubricationMethodType = 3;
      } else {
        this.lubricationMethodType = 1;
      }
    } else {
      // 如果是脂类
      this.lubricationMethodType = 4;
    }
  },
  methods: {
    proving1(item) {
      if (item.rangeMin >= 0) {
        item.value = item.value.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        item.value = item.value.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        item.value = item.value.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        item.value = item.value
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", "."); // 只允许输入一个小数点
        item.value = item.value.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        item.value = item.value.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        item.value = item.value.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        item.value = item.value.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      } else {
        item.value = item.value.replace(/[^\-\d.]/g, ""); // 清除"数字"和"."以外的字符
        item.value = item.value.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        item.value = item.value.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        item.value = item.value
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", "."); // 只允许输入一个小数点
        item.value = item.value
          .replace("-", "$#$")
          .replace(/\-/g, "")
          .replace("$#$", "-"); // 只允许输入一个负号
        item.value = item.value.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        item.value = item.value.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        item.value = item.value.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        item.value = item.value.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
    },
    numberChange(val, maxNum, item) {
      if (val == "") {
        item.value = null;
      }
      if (val == 0 && val != "") {
        item.value = 0;
      }
      if (item.value) {
        // 转换数字类型
        item.value = Number(val);
      }
      // 重新渲染
      this.$nextTick(() => {
        if (item.value) {
          // 比较输入的值和最大值，返回小的
          let num = Math.min(Number(val), maxNum);
          // 输入负值的情况下， = 0（可根据实际需求更该）
          if (num < item.rangeMin) {
            item.value = item.rangeMin;
          } else {
            // 反之
            item.value = num;
          }
          if (item.decimalPrecision != null) {
            let val1 = item.value.toString();
            if (val1.indexOf(".") > -1 && val1.split(".")[1].length > item.decimalPrecision && item.decimalPrecision) {
              if (item.decimalPrecision == 1) {
                item.value = val1.substr(0, val1.indexOf(".") + 2);
              } else if (item.decimalPrecision == 2) {
                item.value = val1.substr(0, val1.indexOf(".") + 3);
              } else if (item.decimalPrecision == 3) {
                item.value = val1.substr(0, val1.indexOf(".") + 4);
              }
            }
          } else {
            let val1 = item.value.toString();
            if (val1.indexOf(".") > -1) {
              item.value = val1.substr(0, val1.indexOf("."));
            }
          }
        }
      });
    },
    // 查询设备档案详情
    $_queryEPInfo() {
      let params = {
        deviceNumber: this.deviceDetailObj.deviceNumber
      };
      this.requestMethodGet("/web/device/queryDevice", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.deviceForm.filter(item => {
              if (item.nameKey == "device_name") {
                item.value = res.data.deviceName;
              }
              if (item.nameKey == "device_type") {
                item.value = res.data.deviceTypeName;
              }
              if (item.nameKey == "device_manufacturer") {
                item.value = res.data.manufacturer;
              }
              if (item.nameKey == "key_device_code") {
                item.value = res.data.deviceCode;
              }
              if (item.nameKey == "key_device_position") {
                item.value = res.data.devicePosition;
              }
              if (item.nameKey == "key_device_module") {
                // 设备型号
                item.value = res.data.deviceModel;
              }
              if (item.nameKey == "key_work_shop_name") {
                // 所属车间
                item.value = res.data.workshopName;
              }
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 查看润滑点详情
    $_getLubricationPointDetail() {
      let params = {
        lubricationPointNumber: this.deviceDetailObj.lubricationPointNumber
      };
      this.requestMethodGet("/web/device/queryLubricationPointDetail", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (
              this.deviceDetailObj.reportType == "1" ||
              this.deviceDetailObj.reportType == "2" ||
              this.deviceDetailObj.reportType == "3" ||
              this.deviceDetailObj.reportType == "9" ||
              this.deviceDetailObj.reportType == "11" ||
              this.deviceDetailObj.reportType == "12"
            ) {
              this.deviceForm.map(item => {
                if (item.nameKey == "lup_last_oil_change_date" && this.deviceDetailObj.reportType == "9") {
                  if (res.data.oilType == 2) {
                    item.value = "--";
                  } else {
                    item.value = res.data.lastOilChangeDate;
                  }
                }
                if (item.nameKey == "lup_last_oil_change_date" && this.deviceDetailObj.reportType != "9") {
                  if (res.data.oilType == 2) {
                    item.value = "";
                  } else {
                    item.value = res.data.lastOilChangeDate;
                  }
                }

                // 加油周期
                if (item.nameKey == "key_add_oil_period") {
                  // 加油周期
                  item.value = res.data.oilAddPeriod;
                  item.unit = res.data.oilAddPeriodUnit == "M" ? "月" : res.data.oilAddPeriodUnit == "Y" ? "年" : res.data.oilAddPeriodUnit == "D" ? "天" : "小时";
                }
                if (item.nameKey == "key_every_time_add_num") {
                  // 每次加油量
                  item.value = res.data.everyTimeOilAddQuantity;
                  item.unit = res.data.everyTimeOilAddQuantityUnit;
                }
                // 润滑点设备制造商名称
                if (item.nameKey == "lup_device_manufacturer") {
                  item.value = res.data.lubricationPointManufacturer;
                }
                // 上次加油日期
                if (item.nameKey == "key_last_add_oil_date") {
                  item.value = res.data.lastOilAddDate;
                }
                if (item.nameKey == "key_149_oil_change") {
                  if (res.data.oilType == 2) {
                    item.value = "";
                    item.unit = "";
                  } else {
                    item.value = res.data.oilChangePeriod;
                    item.unit = res.data.oilChangePeriodUnitDesc;
                  }
                }
                if (item.nameKey == "lup_name") {
                  item.value = res.data.lubricationPointName;
                }
                if (item.nameKey == "key_desc") {
                  item.value = res.data.lubricationPointDesc;
                }
                if (item.nameKey == "oil_box_quantity") {
                  item.value = res.data.oilBoxQuantity;
                }
                if (item.nameKey == "key_lup_manufacturer") {
                  // 润滑点设备制造商名称
                  item.value = res.data.lubricationPointManufacturer;
                }
                if (item.nameKey == "lup_recommend_oil") {
                  // 设备制造商推荐油品
                  item.value = res.data.recommendOilName;
                }
                if (item.nameKey == "lup_img") {
                  // 润滑点图片
                  if (res.data.lubricationPointPicPath) {
                    let urlPic = res.data.lubricationPointPicPath;
                    item.imgFullUrl = [];
                    item.imgFullUrl.push(urlPic);
                    item.value = res.data.lubricationPointPicRelativePath;
                  } else {
                    item.imgFullUrl = [];
                    item.value = "";
                  }
                }
                if (item.nameKey == "lup_type") {
                  item.value = res.data.lubricationPointType;
                }
                if (item.nameKey == "lup_method") {
                  item.value = res.data.lubricationMethodName;
                  item.valueCode = res.data.lubricationMethod;
                }
                if (item.nameKey == "lup_oil_box_capacity") {
                  item.value = res.data.oilBoxCapacity;
                  item.unit = res.data.oilBoxCapacityUnit;
                  item.required = res.data.oilType == 1;
                }
                if (item.nameKey == "lup_last_oil_change_date") {
                  item.value = res.data.lastOilChangeDate;
                }
                if (item.nameKey == "lup_oil_brand") {
                  // 在用油品品牌
                  item.value = res.data.oilBrandName;
                }
                if (item.nameKey == "lup_last_test_date") {
                  item.value = res.data.lastTestDate;
                }
                if (item.nameKey == "lup_current_oil") {
                  item.value = res.data.currentOilName;
                }
                if (item.nameKey == "key_dq_az") {
                  // 定期或按质换油？
                  item.value = res.data.oilChangeMethod == "2" ? "按质" : res.data.oilChangeMethod == "1" ? "定期" : "暂无";
                  item.valueCode = res.data.oilChangeMethod;
                  item.children.forEach(child => {
                    if (child.nameKey == "key_has_done_oil_sysjc") {
                      child.value = res.data.hasDoneTest ? "是" : "否";
                      if (child.value) {
                        child.children[0].value = res.data.lastTestDate;
                      }
                    }
                    if (item.valueCode == child.valueCodeNotDisplay) {
                      if (child.nameKey == "key_149_oil_change" && child.valueCodeNotDisplay == "1") {
                        // 换油周期
                        child.value = res.data.oilChangePeriod;
                        child.unit = res.data.oilChangePeriodUnitDesc;
                      }
                      if (res.data.autoCreateOilAddPlan && child.nameKey == "sf_zdsc_xc_jyjh") {
                        // 是否自动生成下次加油计划
                        child.valueCode = "1";
                        child.children[0].value = res.data.nextScheduledOilAddDate;
                      }
                      if (res.data.autoCreateOilChangePlan && child.nameKey == "sf_zdsc_xc_hyjh") {
                        // 是否自动生成下次换油计划
                        child.valueCode = "1";
                        child.children[0].value = res.data.nextScheduledOilChangeDate;
                      }
                      if (child.nameKey == "lup_last_oil_change_date") {
                        child.value = res.data.lastOilChangeDate;
                      }
                      if (child.nameKey == "key_add_oil_period") {
                        // 加油周期
                        child.value = res.data.oilAddPeriod;
                        child.unit = res.data.oilAddPeriodUnit == "M" ? "月" : res.data.oilAddPeriodUnit == "Y" ? "年" : res.data.oilAddPeriodUnit == "D" ? "天" : "小时";
                      }
                      if (child.nameKey == "key_last_add_oil_date") {
                        child.value = res.data.lastOilAddDate;
                      }
                      if (child.nameKey == "key_every_time_add_num") {
                        // 每次加油量
                        child.value = res.data.everyTimeOilAddQuantity;
                        child.unit = res.data.everyTimeOilAddQuantityUnit;
                      }
                      if (child.nameKey == "key_every_month_add_num") {
                        // 每月油品添加量
                        child.value = res.data.preMonthOilAddQuantity;
                        child.unit = res.data.preMonthOilAddQuantityUnit;
                      }
                      if (child.nameKey == "key_schysjzl" && child.valueCodeNotDisplay == "1") {
                        child.value = res.data.fillingQuantity;
                        child.unit = res.data.fillingQuantityUnit;
                      }
                    }
                  });
                }
              });
            }
            if (this.deviceDetailObj.reportType != "1" && this.deviceDetailObj.reportType != "2" && this.deviceDetailObj.reportType != "3") {
              if (
                this.deviceDetailObj.reportType == "9" ||
                this.deviceDetailObj.reportType == "10" ||
                this.deviceDetailObj.reportType == "11" ||
                (this.deviceDetailObj.reportType == "8" && res.data.lubricationPointTypeCode == "lubrication_point_type_0011") ||
                (this.deviceDetailObj.reportType == "7" && res.data.lubricationPointTypeCode == "lubrication_point_type_0007") ||
                (this.deviceDetailObj.reportType == "4" &&
                  (res.data.lubricationPointTypeCode == "lubrication_point_type_0012" ||
                    res.data.lubricationPointTypeCode == "lubrication_point_type_0013" ||
                    res.data.lubricationPointTypeCode == "lubrication_point_type_0014" ||
                    res.data.lubricationPointTypeCode == "lubrication_point_type_0015")) ||
                (this.deviceDetailObj.reportType == "5" && res.data.lubricationPointTypeCode == "lubrication_point_type_0003") ||
                (this.deviceDetailObj.reportType == "6" &&
                  (res.data.lubricationPointTypeCode == "lubrication_point_type_0008" ||
                    res.data.lubricationPointTypeCode == "lubrication_point_type_0006" ||
                    res.data.lubricationPointTypeCode == "lubrication_point_type_0005"))
              ) {
                this.$_queryEPInfo();
                this.deviceDetailObj.oilType = res.data.oilType;
                this.deviceDetailObj.lubricationMethod = res.data.lubricationMethod;
                if (res.data.oilType == 1) {
                  if (res.data.lubricationMethod == "lubrication_method_0004" && this.deviceDetailObj.reportType == "7") {
                    this.lubricationMethodType = 2;
                  } else if (res.data.lubricationMethod == "lubrication_method_0003" && this.deviceDetailObj.reportType == "8") {
                    // 如果是特殊油类  喷射
                    this.lubricationMethodType = 3;
                  } else {
                    this.lubricationMethodType = 1;
                  }
                } else {
                  // 如果是脂类
                  this.lubricationMethodType = 4;
                }
                this.deviceForm.map(item => {
                  if (item.nameKey == "lup_name") {
                    item.value = res.data.lubricationPointName;
                  }
                  if (item.nameKey == "key_desc") {
                    item.value = res.data.lubricationPointDesc;
                  }
                  if (item.nameKey == "oil_box_quantity") {
                    // 油箱数量
                    item.value = res.data.oilBoxQuantity;
                    item.display = res.data.oilType == 1;
                  }
                  if (item.nameKey == "key_lup_manufacturer") {
                    // 润滑点设备制造商名称
                    item.value = res.data.lubricationPointManufacturer;
                  }
                  if (item.nameKey == "lup_recommend_oil") {
                    // 设备制造商推荐油品
                    item.value = res.data.recommendOilName;
                  }
                  if (item.nameKey == "lup_img") {
                    // 润滑点图片
                    if (res.data.lubricationPointPicPath) {
                      let urlPic = res.data.lubricationPointPicPath;
                      item.imgFullUrl = [];
                      item.imgFullUrl.push(urlPic);
                      item.value = res.data.lubricationPointPicRelativePath;
                    } else {
                      item.imgFullUrl = [];
                      item.value = "";
                    }
                  }
                  if (item.nameKey == "lup_type") {
                    item.value = res.data.lubricationPointType;
                  }
                  if (item.nameKey == "lup_method") {
                    item.value = res.data.lubricationMethodName;
                    item.valueCode = res.data.lubricationMethod;
                  }
                  if (item.nameKey == "lup_oil_box_capacity" && (this.deviceDetailObj.reportType == "4" || this.deviceDetailObj.reportType == "5" || this.deviceDetailObj.reportType == "6")) {
                    item.value = res.data.oilBoxCapacity;
                    item.unit = res.data.oilBoxCapacityUnit;
                  }
                  if (
                    item.nameKey == "lup_oil_box_capacity" &&
                    (this.deviceDetailObj.reportType == "1" ||
                      this.deviceDetailObj.reportType == "2" ||
                      this.deviceDetailObj.reportType == "3" ||
                      this.deviceDetailObj.reportType == "7" ||
                      this.deviceDetailObj.reportType == "8")
                  ) {
                    item.value = res.data.oilBoxCapacity;
                    item.unit = res.data.oilBoxCapacityUnit;
                    item.required = res.data.oilType == 1;
                  }
                  if (item.nameKey == "lup_last_oil_change_date") {
                    item.value = res.data.lastOilChangeDate;
                  }
                  if (item.nameKey == "lup_oil_brand") {
                    // 在用油品品牌
                    item.value = res.data.oilBrandName;
                  }
                  if (item.nameKey == "lup_last_test_date") {
                    item.value = res.data.lastTestDate;
                  }
                  if (item.nameKey == "lup_current_oil") {
                    item.value = res.data.currentOilName;
                  }
                  // 定期或按质换油？    普通油类
                  if (item.nameKey == "key_dq_az" && this.lubricationMethodType == "1") {
                    item.value = res.data.oilChangeMethod == "2" ? "按质" : res.data.oilChangeMethod == "1" ? "定期" : "暂无";
                    item.valueCode = res.data.oilChangeMethod;
                    item.children.forEach(child => {
                      if (child.nameKey == "key_has_done_oil_sysjc") {
                        child.value = res.data.hasDoneTest ? "是" : "否";
                        child.valueCode = res.data.hasDoneTest ? "1" : "0";
                        if (child.value) {
                          child.children[0].value = res.data.lastTestDate;
                        }
                      }
                      if (item.valueCode == child.valueCodeNotDisplay) {
                        if (child.nameKey == "key_149_oil_change") {
                          // 换油周期
                          child.value = res.data.oilChangePeriod;
                          child.unit = res.data.oilChangePeriodUnitDesc;
                        }
                        if (child.nameKey == "sf_zdsc_xc_jyjh") {
                          // 是否自动生成下次加油计划
                          child.valueCode = res.data.autoCreateOilAddPlan ? "1" : "0";
                          child.value = res.data.autoCreateOilAddPlan ? "是" : "否";
                          child.children[0].value = res.data.nextScheduledOilAddDate;
                          if (res.data.oilAddPeriod != "" && res.data.oilAddPeriod != null && res.data.lastOilAddDate != "" && res.data.lastOilAddDate != null) {
                            child.display = true;
                          } else {
                            child.display = false;
                          }
                        }
                        if (child.nameKey == "sf_zdsc_xc_hyjh") {
                          // 是否自动生成下次换油计划
                          child.valueCode = res.data.autoCreateOilChangePlan ? "1" : "0";
                          child.value = res.data.autoCreateOilChangePlan ? "是" : "否";
                          child.children[0].value = res.data.nextScheduledOilChangeDate;
                          if (res.data.oilChangePeriod != "" && res.data.oilChangePeriod != null && res.data.lastOilChangeDate != "" && res.data.lastOilChangeDate != null) {
                            child.display = true;
                          } else {
                            child.display = false;
                          }
                        }
                        if (child.nameKey == "lup_last_oil_change_date") {
                          // 上次换油日期
                          child.value = res.data.lastOilChangeDate;
                        }

                        if (child.nameKey == "key_add_oil_period") {
                          // 加油周期
                          child.value = res.data.oilAddPeriod;
                          child.unit = res.data.oilAddPeriodUnit == "M" ? "月" : res.data.oilAddPeriodUnit == "Y" ? "年" : res.data.oilAddPeriodUnit == "D" ? "天" : "小时";
                        }
                        if (child.nameKey == "key_last_add_oil_date") {
                          child.value = res.data.lastOilAddDate;
                        }
                        if (child.nameKey == "key_every_time_add_num") {
                          // 每次加油量
                          child.value = res.data.everyTimeOilAddQuantity;
                          child.unit = res.data.everyTimeOilAddQuantityUnit;
                        }
                        if (child.nameKey == "key_every_month_add_num") {
                          // 每月油品添加量
                          child.value = res.data.preMonthOilAddQuantity;
                          child.unit = res.data.preMonthOilAddQuantityUnit;
                        }
                        if (child.nameKey == "key_schysjzl") {
                          // 上次换油时加注量
                          child.value = res.data.fillingQuantity;
                          child.unit = res.data.fillingQuantityUnit;
                          if (res.data.lastOilChangeDate != null && res.data.lastOilChangeDate != "") {
                            child.display = true;
                          } else {
                            child.display = false;
                          }
                        }
                      }
                    });
                  }
                  // 油雾
                  if (item.nameKey == "pen_she_you_wu_method" && (this.lubricationMethodType == "2" || this.lubricationMethodType == "3")) {
                    item.value = res.data.oilChangeMethod == "2" ? "按质" : res.data.oilChangeMethod == "1" ? "定期" : "暂无";
                    item.valueCode = res.data.oilChangeMethod;
                    item.children.forEach(child => {
                      if (child.nameKey == "sf_zdsc_xc_jyjh") {
                        // 是否自动生成下次加油计划
                        child.valueCode = res.data.autoCreateOilAddPlan ? "1" : "0";
                        child.value = res.data.autoCreateOilAddPlan ? "是" : "否";
                        child.children[0].value = res.data.nextScheduledOilAddDate;
                        if (res.data.oilAddPeriod != "" && res.data.oilAddPeriod != null && res.data.lastOilAddDate != "" && res.data.lastOilAddDate != null) {
                          child.display = true;
                        } else {
                          child.display = false;
                        }
                      }
                      if (child.nameKey == "key_add_oil_period") {
                        // 加油周期
                        child.value = res.data.oilAddPeriod;
                        child.unit = res.data.oilAddPeriodUnit == "M" ? "月" : res.data.oilAddPeriodUnit == "Y" ? "年" : res.data.oilAddPeriodUnit == "D" ? "天" : "小时";
                      }
                      if (child.nameKey == "key_last_add_oil_date") {
                        // 上次加油日期
                        child.value = res.data.lastOilAddDate;
                      }
                      if (child.nameKey == "key_every_time_add_num") {
                        // 每次加油量
                        child.value = res.data.everyTimeOilAddQuantity;
                        child.unit = res.data.everyTimeOilAddQuantityUnit;
                      }
                      if (child.nameKey == "key_every_month_add_num") {
                        // 每月油品添加量
                        child.value = res.data.preMonthOilAddQuantity;
                        child.unit = res.data.preMonthOilAddQuantityUnit;
                      }
                    });
                  }
                  // 脂类
                  if (item.nameKey == "lup_method_zhi_lei" && this.lubricationMethodType == "4") {
                    item.children.forEach(child => {
                      if (child.nameKey == "key_has_done_oil_sysjc") {
                        // 是否做过油品实验室检测
                        child.value = res.data.hasDoneTest ? "是" : "否";
                        child.valueCode = res.data.hasDoneTest ? "1" : "0";
                        if (child.value) {
                          child.children[0].value = res.data.lastTestDate;
                        }
                      }
                      if (child.nameKey == "sf_zdsc_xc_jyjh") {
                        // 是否自动生成下次加脂计划
                        child.valueCode = res.data.autoCreateOilAddPlan ? "1" : "0";
                        child.value = res.data.autoCreateOilAddPlan ? "是" : "否";
                        child.children[0].value = res.data.nextScheduledOilAddDate;
                        if (res.data.oilAddPeriod != "" && res.data.oilAddPeriod != null && res.data.lastOilAddDate != "" && res.data.lastOilAddDate != null) {
                          child.display = true;
                        } else {
                          child.display = false;
                        }
                      }
                      if (child.nameKey == "key_add_oil_period") {
                        // 加脂周期
                        child.value = res.data.oilAddPeriod;
                        child.unit = res.data.oilAddPeriodUnit;
                      }
                      if (child.nameKey == "key_every_time_add_num") {
                        // 每次加脂量
                        child.value = res.data.everyTimeOilAddQuantity;
                        child.unit = res.data.everyTimeOilAddQuantityUnit;
                      }
                      if (child.nameKey == "key_every_month_add_num") {
                        // 每月润滑剂添加量"
                        child.value = res.data.preMonthOilAddQuantity;
                        child.unit = res.data.preMonthOilAddQuantityUnit;
                      }
                      if (child.nameKey == "key_last_add_oil_date") {
                        // 上次加脂⽇期
                        child.value = res.data.lastOilAddDate;
                      }
                    });
                  }
                });
              } else {
                if (this.deviceDetailObj.reportType == "4") {
                  this.$message({
                    message: "刷新失败，设备信息中润滑点设备类型为" + res.data.lubricationPointType + "，该工单服务支持的润滑点设备类型包括循环系统、燃气轮机、蒸汽轮机、造纸机",
                    type: "warning"
                  });
                } else if (this.deviceDetailObj.reportType == "5") {
                  this.$message({
                    message: "刷新失败，设备信息中润滑点设备类型为" + res.data.lubricationPointType + "，该工单服务支持的润滑点设备类型为液压系统",
                    type: "warning"
                  });
                } else if (this.deviceDetailObj.reportType == "6") {
                  this.$message({
                    message: "刷新失败，设备信息中润滑点设备类型为" + res.data.lubricationPointType + "，该工单服务支持的润滑点设备类型包括闭式齿轮、差速器、终传动",
                    type: "warning"
                  });
                } else if (this.deviceDetailObj.reportType == "7") {
                  this.$message({
                    message: "刷新失败，设备信息中润滑点设备类型为" + res.data.lubricationPointType + "，该工单服务支持的润滑点设备类型为滚动轴承",
                    type: "warning"
                  });
                } else if (this.deviceDetailObj.reportType == "8") {
                  this.$message({
                    message: "刷新失败，设备信息中润滑点设备类型为" + res.data.lubricationPointType + "，该工单服务支持的润滑点设备类型为开式齿轮",
                    type: "warning"
                  });
                }
              }
            }
            // reportType为9、10、11不执行this.$parent.fatherMethod6()方法
            if (this.deviceDetailObj.reportType != "9" && this.deviceDetailObj.reportType != "10" && this.deviceDetailObj.reportType != "11") {
              this.$parent.fatherMethod6();
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

    // 刷新数据
    handleRefresh() {
      if (this.deviceDetailObj.reportType == "1" || this.deviceDetailObj.reportType == "2" || this.deviceDetailObj.reportType == "3") {
        this.$_queryEPInfo();
      }
      this.$_getLubricationPointDetail();
      if (this.deviceDetailObj.reportType == "1") {
        // 调取父组件   再传给风机参数1的子组件
        this.$parent.fatherMethodWind();
      }
      // 换油建议的参数化  要刷新 冲洗等级
      if (this.deviceDetailObj.reportType == "11") {
        this.$parent.fatherMethodOilLevelRefresh();
      }
    },
    // 前往编辑
    handleEdit() {
      let routeUrl = this.$router.resolve({
        path: "/EquipmentProfile/EditEquipmentProfile",
        query: { deviceNumber: this.deviceDetailObj.deviceNumber, resource: "report", lubricationPointNumber: this.deviceDetailObj.lubricationPointNumber }
      });
      window.open(routeUrl.href, "_blank");
    },
    // 上传前置
    beforeAvatarUpload(file) {
      // console.log('file',file)
    },
    // 上传
    handlePictureUpload(item) {
      this.cutWidth = item.nameKey=="key_device_pic"?700:200
      this.cutHeight = item.nameKey=="key_device_pic"?394:200
      this.cutFileList = item;
      this.cutFlag = false;
      this.$refs.imgCutterModal.handleOpen();
      this.oneImg = false;
    },
    // 获取全路径赋值imgFullDtoUrl
    getFullImgPath(item, path, flag) {
      const params = {
        url: path
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          let pathUrl = [];
          if (flag) {
            item.imgFullDtoUrl[this.pruneIndex].url = res.data.data;
            item.imgFullDtoUrl[this.pruneIndex].urlHalf = path;
            item.value = path;
          } else {
            item.imgFullDtoUrl.push({
              urlHalf: path,
              name: item.nameKey,
              url: res.data.data
            });
            item.imgFullDtoUrl.map(el => {
              pathUrl.push(el.urlHalf);
            });
            item.value = pathUrl.toString();
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
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
    // 验证
    validateDevice(deviceRef) {
      const data = this.deviceForm;
      let notValueArr = [];
      let itemChildNotValue = [];
      if (this.deviceDetailObj.reportType == "4" || this.deviceDetailObj.reportType == "5" || this.deviceDetailObj.reportType == "6") {
        const valueArr = data.filter(item => {
          return item.nameKey == "key_dq_az";
        });
        data.forEach(it => {
          if (it.children.length && it.nameKey != "key_dq_az") {
            it.children.forEach(it2 => {
              if (!it2.value && it2.required) {
                itemChildNotValue.push(it2);
              }
            });
          }
        });
        valueArr[0].children.forEach(it => {
          if ((it.valueCodeNotDisplay == "0" || it.valueCodeNotDisplay == valueArr[0].valueCode) && !it.value && it.required) {
            notValueArr.push(it);
          }
          if (it.nameKey == "key_has_done_oil_sysjc" && it.value == "是" && !it.children[0].value && it.children[0].required) {
            notValueArr.push(it.children[0]);
          }
        });
      }
      const emptyList = data.filter(item => {
        // 当润滑方式 为油雾/喷射时候，校验 油雾/喷射下边的字段
        if (item.nameKey == "pen_she_you_wu_method" && (this.lubricationMethodType == "3" || this.lubricationMethodType == "2")) {
          item.children.forEach(it2 => {
            if (!it2.value && it2.required) {
              itemChildNotValue.push(it2);
            }
          });
        }
        // 当润滑方式 为普通油类时候，校验 油类下边的字段
        if (item.nameKey == "key_dq_az" && this.lubricationMethodType == "1") {
          item.children.forEach(it2 => {
            if (it2.valueCodeNotDisplay == item.valueCode) {
              if (!it2.value && it2.required) {
                itemChildNotValue.push(it2);
              }
            }
          });
        }
        // 当润滑方式 为脂类时候，校验 脂类下边的字段
        if (item.nameKey == "lup_method_zhi_lei" && this.lubricationMethodType == "4") {
          item.children.forEach(it2 => {
            if (!it2.value && it2.required) {
              itemChildNotValue.push(it2);
            }
          });
        }
        if (!item.value && item.required) {
          itemChildNotValue.push(item);
        }
      });
      let emptyListChild = emptyList.concat(itemChildNotValue);
      if (emptyListChild.length > 0) {
        this.$message({
          message: emptyListChild[0].name + "必填",
          type: "warning"
        });
      } else if (notValueArr.length) {
        this.$message({
          message: notValueArr[0].name + "必填",
          type: "warning"
        });
        this.$emit("passModulValidate", "111");
      } else {
        this.$emit("passModulValidate", "device");
      }
    },
    /**
     * @Description: 图片删除
     * @Author: LiQiuPing
     * @param {*} file
     * @param {*} item
     */
    handleRemove(file, item) {
      item.imgFullDtoUrl.forEach((ele, i) => {
        if (file.uid === ele.uid) {
          this.pruneIndex = i;
        }
      });
      item.imgFullDtoUrl.splice(this.pruneIndex, 1);
    },
    /**
     * @Description: 图片返显
     * @Author: LiQiuPing
     * @param {*} file
     * @param {*} pruneIndex
     * @param {*} callback
     */
    imgBackShow(file, pruneIndex, callback) {
      callback(file[pruneIndex].url);
    },
    /**
     * @Description: 图片裁剪
     * @Author: LiQiuPing
     * @param {*} fileList
     */
    handlePicturePrune(file, fileList) {
      this.cutFlag = true;
      this.cutFileList = fileList;
      fileList.imgFullDtoUrl.forEach((ele, i) => {
        if (file.uid === ele.uid) {
          this.pruneIndex = i;
        }
      });
      let url = fileList.imgFullDtoUrl[this.pruneIndex].url;
      this.$refs.imgCutterModal.handleOpen({
        name: "img",
        src: url,
        width: 400,
        height: 400
      });
    },
    /**
     * @Description: 裁剪
     * @Author: LiQiuPing
     * @param {*} fileName
     */
    cutDown(fileName) {
      let cutDownData = this.cutFileList;
      var imgGs = fileName.dataURL.split(";")[0].split("/")[1];
      var file = this.dataURLtoBlob(fileName.dataURL, "裁剪图片." + imgGs);
      var formData = new FormData();
      formData.append("fileType", "lubrication_point");
      formData.append("multipartFiles", file);
      this.requestMethodPost("/web/file/uploadFiles", formData)
        .then(async res => {
          res = res.data;
          if (res.code === 1000) {
            cutDownData.tempImagePath = res.data[0];
            this.getFullImgPath(cutDownData, res.data[0], this.cutFlag);
            cutDownData.value = res.data[0];
          } else {
            cutDownData.imgFullDtoUrl = [];
            cutDownData.notShowUploadBtn = false;
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    /**
     * @Description: base64转换为file
     * @Author: LiQiuPing
     * @param {*} dataurl
     * @param {*} name
     */
    dataURLtoBlob(dataurl, name) {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], name, { type: mime });
    }
  }
};
</script>

<style lang="less">
.deviceInfo {
  .el-form-item {
    display: flex;
    align-items: center;
  }
  .title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    color: #000;
    line-height: 14px;
    font-weight: bold;
    display: flex;
  }
  .el-form-item__content {
    line-height: 27px !important;
    max-width: 60%;
  }
  .star {
    color: #f56c6c;
    font-size: 14px;
    margin-right: 2px;
  }
  .el-card__header {
    background: #f9f9f9;
  }
  .el-divider--vertical {
    width: 3px;
  }
  .el-divider {
    background-color: #dd0000;
    position: relative;
  }
  .noUploadBtn .el-upload--picture-card {
    display: none;
  }

  .el-upload-list__item {
    transition: none !important;
  }
}
</style>
<style lang="less" scoped>
.el-upload-list--picture-card .el-upload-list__item-actions {
  opacity: 1 !important;
  background-color: rgba(0, 0, 0, 0.2);
}
.uploadMask {
  opacity: 0;
}
.uploadMask:hover {
  opacity: 1;
}
.deviceInfo .el-upload-list__item-thumbnail {
  width: 148px;
  height: 148px;
  object-fit: cover;
}
</style>
