<template>
  <el-card class="OperationParametersNode" style="margin-top: 20px; border: 1px solid #ededed; border-radius: 4px">
    <div slot="header" class="title">
      <el-divider direction="vertical"></el-divider>
      <span>{{ OperationParametersNodeName }}</span>
    </div>
    <el-form :model="operationParametersObj" ref="oilChangeRef" label-position="top" label-width="200px" style="padding: 0 20px">
      <el-row>
        <div v-for="(item, index) in operationParametersObj" :key="index">
          <el-col :span=" ( item.nameKey != 'key_customer_name' && item.nameKey != 'key_zcjg_bztp' && item.nameKey != 'key_1248' && item.nameKey != 'key_1244' && item.nameKey != 'key_1246' && item.nameKey != 'key_1245') && item.type!='textarea' && item.type!='img' ? 6 : 24">
            <el-form-item >
              <span slot="label" style="width: 260px;">
                <span
                  v-if="
                    (item.nameKey != 'key_zcjgsyms_pic' && item.nameKey != 'key_zcjgsyms_pic_other') ||
                      (item.nameKey == 'key_zcjgsyms_pic' && bearingType != '10') ||
                      (item.nameKey == 'key_zcjgsyms_pic_other' && bearingType == '10')
                  "
                >
                  <span v-if="item.required" class="star">*</span>
                  <span> {{ item.name }}:</span>
                  <span v-if="item.unit">({{ item.unit }})</span>
                  <span v-if="item.type == 'img'">（最多上传{{ item.length }}张图片）</span>
                  <span class="no-wrap" v-if="item.tip && item.tip.type == 'text'">
                    <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start">
                      <el-button type="text" style="color: #333; font-size: 15px; padding: 0px">
                        <i class="el-icon-warning-outline"></i>
                      </el-button>
                    </el-tooltip>
                  </span>
                  <div class="no-wrap" v-if="item.type == 'string' && item.value" style="margin-left:10px;">
                    <el-tooltip class="item" effect="dark" :content="item.value" placement="top-start">
                      <span>{{ item.value }}{{ item.unit }}</span>
                    </el-tooltip>
                  </div>
                </span>
              </span>
              <!-- 展示图片 -->
              <el-row v-if="item.type == 'img2' && bearingType != '10'">
                <div v-if="bearingType != ''">
                  <div v-for="(pic, index) in item.imgFullDtoUrl" :key="index">
                    <img style="width: 240px" :src="pic.url" />
                  </div>
                </div>
                <div v-else style="color: #666; font-size: 14px">暂无</div>
              </el-row>
                <el-date-picker
                  v-if="item.type == 'datepicker3' && type == 'edit'"
                  v-model="item.value"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width:220px"
                  size="small"
                  placeholder="选择日期"
                >
                </el-date-picker>
              <div>
                <el-upload
                  v-if="item.type == 'img' && type == 'edit' && ((item.nameKey == 'key_zcjgsyms_pic_other' && bearingType == '10') || item.nameKey != 'key_zcjgsyms_pic_other')"
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
                  <i class="el-icon-plus" @click="handlePictureUpload(item)"></i>
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
              </div>
              <!-- 上传图片 结束-->
              <el-select
                v-if="type == 'edit' && item.type == 'dropdown2'"
                size="small"
                clearable
                style="width: 80%"
                @change="
                  val => {
                    dropdown2Change(val, item);
                  }
                "
                v-model="item.valueCode"
                placeholder="--请输入--"
              >
                <el-option v-for="item in item.fieldOption" :key="item.value" :label="item.option" :value="item.value"></el-option>
              </el-select>

              <el-input
                v-if="item.type == 'input1' && type == 'edit'"
                placeholder="请输入"
                :disabled="item.disabled"
                v-model="item.value"
                :maxlength="item.length"
                style="width: 80%"
                size="small"
                clearable
              >
              </el-input>
              <el-input
                v-if="item.type == 'textarea' && type == 'edit'"
                placeholder="请输入"
                :disabled="item.disabled"
                v-model="item.value"
                :maxlength="item.length"
                type="textarea"
                style="width: 100%"
                size="big"
                show-word-limit
                clearable
              >
              </el-input>

              <el-input
                v-if="item.type == 'input2' && type == 'edit'"
                style="width: 80%"
                size="small"
                @keyup.native="proving1(item)"
                :maxlength="item.length"
                v-model="item.value"
                placeholder="请输入"
              ></el-input>
              <!-- 循环系统-特殊字段处理 -->
              <div v-if="item.type == 'dropdown5'">
                <el-col :span="24">
                  <el-select size="small" clearable v-model="item.value" style="width: 40%" placeholder="--请选择--">
                    <el-option v-for="filed in item.fieldOption" :key="filed.value" :label="filed.option" :value="filed.option"></el-option>
                  </el-select>
                  <el-input clearable placeholder="--请输入--" size="small" style="width: 40%" :maxlength="item.children[0].length" v-model="item.children[0].value"></el-input>
                </el-col>
              </div>
              <div v-if="item.type == 'dropdown3'">
                <el-col :span="24">
                  <el-select size="small" clearable v-model="item.valueCode" style="width: 80%" @change="selectDropDown(item)" placeholder="--请选择--">
                    <el-option v-for="filed in item.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                  </el-select>
                </el-col>
              </div>
            </el-form-item>
          </el-col>
          <div v-if="item.type == 'dropdown3'">
            <div v-for="(cylinder, index) in item.children" :key="index">
              <div v-if="cylinder.valueCodeNotDisplay == item.valueCode">
                <el-col :span="6">
                  <el-form-item :label="cylinder.name + '：'" :required="cylinder.required">
                    <span slot="label">
                      {{ cylinder.name }}
                      <span v-if="cylinder.unit">({{ cylinder.unit }})</span> ：
                    </span>
                    <span v-if="type == 'view'">{{ cylinder.value }}</span>
                    <el-input
                      style="width: 80%"
                      v-if="cylinder.type == 'input1' && type == 'edit'"
                      clearable
                      placeholder="--请输入--"
                      size="small"
                      :maxlength="cylinder.length"
                      v-model="cylinder.value"
                    ></el-input>
                    <el-input
                      v-if="cylinder.type == 'input2' && type == 'edit'"
                      style="width: 80%"
                      size="small"
                      @keyup.native="proving1(cylinder)"
                      :maxlength="cylinder.length"
                      v-model="cylinder.value"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </div>
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
      :toolBoxOverflow="false"
      @cutDown="val => cutDown(val, cylinder)"
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
    OperationParametersNodeName: {
      type: String,
      default: () => {
        return "";
      }
    },
    operationParametersObj: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      pruneIndex: null,
      uploadUrl: "",
      imgDialogVisible: false,
      notShowUploadBtn: false,
      cutFlag: false,
      dialogImageUrl: "",
      bearingType: "", // 轴承类型
      tempImagePath: "",
      oilNameKey: 0,
      oilNameList: [],
      editOil: false,
      cutFileList: {},
      handleEditData: [],
      pathArr: [],
      imgPic: "", // 轴承展示图片  半路径
      status: "" // 运行状态
    };
  },
  mounted() {
    this.operationParametersObj.forEach(it => {
      if (it.nameKey == "key_filter_level" && it.valueCode) {
        sessionStorage.removeItem("valueCodeLevel");
        sessionStorage.setItem("valueCodeLevel", it.valueCode);
      }
      if (it.nameKey == "key_clxyxzt" && it.valueCode) {
        this.status = it.valueCode;
      }
      if (it.nameKey == "key_zclx" && it.valueCode) {
        this.bearingType = it.valueCode;
      }
    });
  },
  created() {
    console.log("type", this.type);
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
          if (item.decimalPrecision) {
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
    handleGet(val) {
      if (val == "change") {
        let valueCLLevel = sessionStorage.getItem("valueCLLevel");
        this.operationParametersObj.forEach(it => {
          if (it.nameKey == "key_clxcs_js") {
            it.value = valueCLLevel;
            it.valueCode = valueCLLevel;
          }
        });
      }
    },
    dropdown2Change(selectCont, val) {
      if (!selectCont) {
        val.value = "";
        val.valueCode = "";
        // 轴承类型
        if (val.nameKey == "key_zclx") {
          this.bearingType = val.valueCode;
          if (val.valueCode != 10) {
            let displayPic = this.operationParametersObj.filter(item => item.nameKey == "key_zcjgsyms_pic");
            displayPic[0].imgFullDtoUrl = [];
          }
        }
      } else {
        let obj = val.fieldOption.filter(it => it.value == val.valueCode);
        val.value = obj[0].option;
        if (val.nameKey == "key_clxcs_js") {
          sessionStorage.removeItem("valueCLLevel");
          sessionStorage.setItem("valueCLLevel", val.value);
          this.$parent.fatherMethod();
        }
        // 齿轮箱运行状态
        if (val.nameKey == "key_clxyxzt") {
          // 要清空齿轮箱级数
          this.operationParametersObj.forEach(it => {
            if (it.nameKey == "key_clxcs_js") {
              it.value = 1;
              it.valueCode = 1;
            }
          });
          this.status = val.valueCode;
          sessionStorage.removeItem("CLStatus");
          sessionStorage.setItem("CLStatus", val.valueCode);
          this.$parent.fatherMethod2();
        }
        // 轴承类型
        if (val.nameKey == "key_zclx") {
          this.bearingType = val.valueCode;
          if (val.valueCode != 10) {
            let displayPic = this.operationParametersObj.filter(item => item.nameKey == "key_zcjgsyms_pic");
            this.getFullImgPath(displayPic[0], obj[0].path);
          }
        }
      }
    },
    selectDropDown(val) {
      if (val.nameKey == "key_filter_level") {
        let obj = {};
        obj = val.fieldOption.find(item => {
          return item.value === val.valueCode; // 筛选出匹配数据
        });
        val.value = obj.option;
        sessionStorage.removeItem("valueCodeLevel");
        sessionStorage.setItem("valueCodeLevel", val.valueCode);
        this.$parent.fatherMethod1();
      }
    },
    // 上传
    handlePictureUpload(item) {
      this.cutFileList = item;
      this.cutFlag = false;
      this.$refs.imgCutterModal.handleOpen();
    },
    // 获取全路径赋值imgFullDtoUrl
    getFullImgPath(item, path, flag) {
      if (item.nameKey == "key_zcjgsyms_pic") {
        item.value = "";
      }
      const params = {
        url: path
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          let pathUrl = [];
          if (item.nameKey == "key_zcjgsyms_pic") {
            item.imgFullDtoUrl = [];
          }
          if (flag) {
            item.imgFullDtoUrl[this.pruneIndex].url = res.data.data;
            item.imgFullDtoUrl[this.pruneIndex].urlHalf = path;
            item.value = path;
            console.log('item..........',item)
          } else {
            item.imgFullDtoUrl.push({
              urlHalf: path,
              name: item.nameKey,
              url: res.data.data
            });
            item.imgFullDtoUrl.map(el => {
              pathUrl.push(el.urlHalf);
            });
            console.log('item.....else.....',item)
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
    // 删除
    removeFileChange(file, fileList, item) {
      // item.value = ''
      let pathUrl = [];
      let imgFullDtoUrl = [];
      // item.imgFullDtoUrl=[]
      fileList.forEach(it => {
        imgFullDtoUrl.push({
          url: it.url
        });
        pathUrl.push(it.urlHalf);
      });
      item.imgFullDtoUrl = imgFullDtoUrl;
      item.value = pathUrl.toString();
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
    // 验证
    validateOperationParametersObj() {
      const data = this.operationParametersObj;
      let dropdown5List = [];
      let dropdown5ListChild = [];
      let dropdown3ListChildNotValue = [];
      let emptyChildList = [];
      let datepicker3List = []
      let dropdown3List = []
      let emptyList = data.filter(item => {
        return item.required && !item.value;
      });
      dropdown3List = data.filter(item => {
        return item.type == "dropdown3";
      });
      data.forEach(it3 => {
        if (it3.type == "dropdown3" && it3.children.length) {
          it3.children.forEach(it3Child => {
            if (it3Child.valueCodeNotDisplay == it3.valueCode && it3Child.required && !it3Child.value) {
              dropdown3ListChildNotValue.push(it3Child);
            }
          });
        }
        // 把培训开始日期和培训日期暂存起来
        if(it3.type == "datepicker3" && (it3.nameKey =='key_1249' || it3.nameKey =='key_1250')) {
          datepicker3List.push(it3)
        }
      });
      let it1,it2;
      if (datepicker3List.length) {
        datepicker3List.forEach(it => {
          if (it.nameKey == 'key_1249') {
            it1 = it
          }
          if (it.nameKey == 'key_1250') {
            it2 = it
          }
        })
        console.log(it1,it2)
        if (it1.value && it2.value) {
          if (Date.parse(it1.value.replace(/-/g,'/')) > Date.parse(it2.value.replace(/-/g,'/'))) {
            this.$message({
              message:  it1.name + '不能大于' + it2.name,
              type: 'warning'
            })
            return
          }
        }
      }
      console.log(23333)
      // 找出   input2   类型
      const dataType = data.filter(item => {
        return item.type == "input2";
      });
      let isNotNum = [];
      dataType.forEach(it => {
        if (it.value) {
          let obj = {};
          if (parseFloat(it.value).toString() == "NaN") {
            obj.name = it.name;
            obj.value = it.value;
            isNotNum.push(obj);
          }
        }
      });
      if (isNotNum.length > 0) {
        this.$message({
          message: isNotNum[0].name + "值应为数字",
          type: "warning"
        });
        return;
      }
      // 找出dropdown5类型
      data.forEach(item => {
        if (item.type == "dropdown5") {
          dropdown5List.push(item);
        }
      });
      dropdown5List.forEach(it5 => {
        if (it5.children.length) {
          it5.children.forEach(itChild5 => {
            dropdown5ListChild.push(itChild5);
          });
        }
      });
      let emptyListdropdown5List = dropdown5ListChild.filter(item => {
        return item.required && !item.value;
      });
      emptyChildList = emptyList.concat(emptyListdropdown5List).concat(dropdown3ListChildNotValue);
      console.log(emptyChildList,99899)
      if (emptyChildList.length > 0) {
        this.$message({
          message: emptyChildList[0].name + "必填",
          type: "warning"
        });
        this.$emit("passModulValidate", "111");
      } else {
        this.$emit("passModulValidate", "OperationParametersObj");
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
      // 找出删除的项中的图片value值
      let valueStr = ''
      this.operationParametersObj.forEach(it=>{
        if(it.nameKey == item.nameKey){
          valueStr = it.value
        }
      })
      const imgList = _.isEmpty(valueStr)?[]:valueStr.split(',')
      if(imgList.length){
        imgList.forEach((it,index)=>{
          if(it == file.urlHalf){
            imgList.splice(index,1)
          }
        })
      }
      const newImgStr = imgList.join(',')
      this.operationParametersObj.forEach(img=>{
        if(img.nameKey == item.nameKey){
          img.value = newImgStr
        }
      })
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
    cutDown(fileName, item) {
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

<style lang='less' scoped>
.OperationParametersNode {
  /deep/ .noUploadBtn .el-upload--picture-card {
    display: none;
  }
  .el-divider--vertical {
    width: 3px;
  }
  .el-form--label-top .el-form-item__label {
    float: none;
    text-align: left;
    padding: 0 0 10px;
    display: flex;
}
  .el-divider {
    background-color: #dd0000;
    position: relative;
  }
  .title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    color: #000;
    line-height: 14px;
    font-weight: bold;
    display: flex;
  }
  .star {
    color: #f56c6c;
    font-size: 14px;
    margin-right: 2px;
  }
  .no-wrap {
    margin-left: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 200px;
  }
  .el-upload-list__item {
    transition: none !important;
  }
  .el-upload-list__item-thumbnail {
    width: 148px;
    height: 148px;
    object-fit: cover;
  }
}
</style>
