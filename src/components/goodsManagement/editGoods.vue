<!--
* @author vvx
* @date 2020/04/14 16:57:26
* @version V1.0.0
!-->
<template>
<div style="position:relative">
  <div class="return-btn" style="position:absolute;right:20px;height:55px;line-height:55px;top:-55px;color:red;cursor:pointer" >
      <el-button type="danger" plain size="small" @click="handleResetFrom('ruleForm')"><img src="../../assets/back.png" style  ="vertical-align: middle;margin-right:5px;margin-top:-2px;height:10px;height:10px">返回</el-button>
  </div>
  <div class="edit-goods-profile" :style="mainminheight">
    <p class="edit-goods-profile-title">基本信息</p>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="add-dealer-profile-ruleForm"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="商品名称：" prop="productName">
            <el-input
              size="small"
              placeholder="请输入商品名称"
              clearable
              v-model="ruleForm.productName"
              maxlength="25"
              style="width:100%;"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align:center">
            <span style="color:#999;font-size:14px">状态：</span>{{ruleForm.stateDesc}}
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="商品描述：" prop="productDesc">
                <el-input type="textarea" 
                size="small"
                resize="none"
                :autosize="{ minRows: 3, maxRows: 5}"
                v-model="ruleForm.productDesc" 
                placeholder="请输入商品描述" 
                style="width:100%;"></el-input>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="价格：" prop="productPrice">
            <!-- <el-input
              size="small"
              placeholder="请输入商品价格"
              clearable
              v-model="ruleForm.productPrice"
              maxlength="25"
              style="width:100%;"
            ></el-input> -->
            <span>{{ruleForm.productPrice == '0.00'?'':ruleForm.unit}}{{ruleForm.productPrice == '0.00'?'暂无':ruleForm.productPrice}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="限购数量：" prop="maxNum">
            <span>{{ruleForm.maxNum}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="限购数量单位：" prop="maxNumUnit">
              <el-input
              size="small"
              placeholder="请输入限购数量单位"
              clearable
              v-model="ruleForm.maxNumUnit"
              maxlength="2"
              style="width:100%;"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="ERPCODE：" prop="erpCode">
            <!-- <el-input
              size="small"
              placeholder="请输入ERPCODE"
              clearable
              v-model="ruleForm.erpCode"
              maxlength="25"
              style="width:100%;"
            ></el-input> -->
            <span>{{ruleForm.erpCode}}</span>
          </el-form-item>
        </el-col>
            <el-col :span="8">
          <el-form-item label="" prop="telephone">
              <div style="color:#999">
                <i class="el-icon-info"></i> MSLA系统的商品识别码，用于商品订单信息校验
              </div>
          </el-form-item>
        </el-col>
      </el-row>
       <p class="edit-goods-profile-title">
        商品图
        </p>
         
      <el-row :gutter="20" style="margin-bottom: 30px">
        <el-col :span="24" style="display:flex;align-items:center">
            <label style="width:120px;text-align:right">封面图：</label>
            <el-upload
            :class="{hide:hideUpload || imageList.length > 0}"
            :action="uploadUrl"
            list-type="picture-card"
            limit="1"
            :file-list="imageList"
            accept="image/*"
            :auto-upload="false"
            :on-change="handleAddFile"
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview"
            >
            <i class="el-icon-plus"></i>
            </el-upload>
            <span style="margin-left:20px;color:#999;font-size:14px;"><i class="el-icon-info"></i> 建议上传比例400*300的图片</span>
        </el-col>
      </el-row>
       <el-row :gutter="20" style="margin-bottom: 30px">
        <el-col :span="24" style="display:flex;align-items:center">
            <label style="width:120px;text-align:right">商品详情图：</label>
            <el-upload
            :class="{hide:detaiImglList.length >= 3}"
            :action="uploadUrl"
            list-type="picture-card"
            :file-list="detaiImglList"
            accept="image/*"
            :auto-upload="false"
            :on-change="handleDetaiImgFile"
            :on-remove="handleRemoveDetaiImg"
            :on-preview="handlePictureCardPreview"
            >
            <i class="el-icon-plus" ></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible"><img width="100%" :src="dialogImageUrl" alt=""></el-dialog>

            <span style="margin-left:20px;color:#999;font-size:14px;"><i class="el-icon-info"></i> 建议上传比例400*300的图片</span>
        </el-col>
      </el-row>
    <p class="edit-goods-profile-title">详情</p>
    <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="商品编号：" prop="productNumber">
            <span>{{ruleForm.productNumber}}</span>
          </el-form-item>
        </el-col>
      </el-row>
         <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="规格参数：" prop="productStandards">
              <el-input
              size="small"
              placeholder="请输入规格参数"
              clearable
              v-model="ruleForm.productStandards"
              maxlength="25"
              style="width:100%;"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
         <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="产地：" prop="productPlace">
              <el-input
              size="small"
              placeholder="请输入产地"
              clearable
              v-model="ruleForm.productPlace"
              maxlength="25"
              style="width:100%;"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
        <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="商品说明：" prop="name">
              <div>1、订购：美孚优释达平台的商品来自于美孚油样化验服务中心，选购后自动提交订购申请，由美孚油样化验服务中心确认后发货，请放心选购。</div>
              <div>2、单次限购：由于商品属性，为保证突发情况导致的商品损失，做了购买数量限制。</div>
              <div>3、结算：您购买后的商品信息将根据您的ERP ID同步至您的账号中心进行统一结算。</div>
              <div>4、限时取消：美孚油样化验服务中心确认您的订单后，您有30分钟可选择取消，超过规定时限，将不能取消。</div>
              <div>5、异常问题：订单的取消以美孚油样化验服务中心最终数据为准，由于跨国系统数据交互延时，存在订单取消失败的可能性，请在规定时限内尽早取消</div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>




    <div slot="footer">
      <el-button type="danger" @click="handleSubmitForm('ruleForm')" size="small" v-if="this.ruleForm.state == 1">提交</el-button>
      <el-button type="danger" @click="handleSubmitForm('ruleForm')" size="small" v-else>保存</el-button>
    </div>
     <!-- - 上架 弹框 -->
                <el-dialog
                    :visible.sync="dialogEditVisible"
                    width="385px"
                    custom-class="editInfoDialog"
                    style="padding:10px 20px"
                    :close-on-click-modal="false" 
                    >
                    <div slot="title">
                        提示
                    </div>
                    <div style="text-align:center"><i class="el-icon-warning-outline" style="font-size:20px;color:red;margin-right:5px;margin-top:-2px;vertical-align:middle"></i>
商品信息更新成功，您可以选择</div>
                    <div slot="footer" class="dialog-footer" style="text-align:right;">
                        <el-button type="danger" plain @click="dialogEditVisible = false" size="small">继续编辑</el-button>
                        <el-button type="danger" plain @click="handleReturnList()" size="small">返回列表</el-button>
                        <el-button type="danger" @click="updateGoodsStatus()" size="small" style="">上架商品</el-button>
                    </div>
                </el-dialog>
  </div>
</div> 
</template>

<script>
import {
  provinceAndCityData,
  regionData,
  provinceAndCityDataPlus,
  regionDataPlus,
  CodeToText,
  TextToCode
} from "element-china-area-data";
export default {
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 140}px`,
      imageList: [], //图片
      detaiImglList:[],//详情页图片
      deleteImgIds:[],
      dialogEditVisible:false,
      uploadUrl: "", //
        dialogImageUrl: '',
        dialogVisible: false,
      areaList: provinceAndCityData, //区域数据源
      typeProps: {
        value: "code",
        label: "name"
      },
      show:false,
      changeForm:{
        remarks:''
      },
      // 表单验证
      ruleForm: {},
      //   表单验证规则
      rules: {
        productName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        productDesc: [
          { required: true, message: "请输入商品描述", trigger: "blur" }
        ],
        // productPrice: [{ required: true,message: "请输入商品价格", trigger: "blur" }, { pattern:/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '只能输入整数或最多两位小数', trigger:"blur" }],
        productPrice: [{ required: true,message: "请输入商品价格", trigger: "blur" }],
        productStandards:[{ required: true,message: "请输入商品规格", trigger: "blur" }],
        maxNum: [{ required: true}]
      },
      hideUpload: false //是否隐藏添加图片按钮
    };
  },

  components: {},

  computed: {},
  created() {
  },
  mounted() {
          // 回显
      let params = {
        id: this.$route.query.id
      };
      this.requestMethodGet("/msla/kit/queryProductById", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.ruleForm = res.data; //回显数据
            if(res.data.coverImgUrl) {
                this.imageList = [{
                    name:res.data.coverImgUrl.split('/')[res.data.coverImgUrl.split('/').length-1],
                    url:res.data.coverImgUrl
                }]
            }

            this.detaiImglList = res.data.detaiImglList.map(item => {
                return {
                    id:item.id,
                    name:item.imgUrl.split('/')[item.imgUrl.split('/').length-1],
                    url:item.imgUrl
                }
            })
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
  },

  methods: {
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },

    //  添加文件
    handleAddFile(file, fileList) {
      if (!file.raw.type.startsWith("image")) {
        this.ImageList = [];
        this.$message.error("只能上传图片类型文件");
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.imageList = [];
        this.$message.error("上传图片大小不能超过 10MB!");
        return;
      }
      this.hideUpload = fileList.length >= 1;
      this.imageList.push({ url: file.url });
      this.ruleForm.headerImgFile = file.raw;
    },

    //  添加详情图片
    handleDetaiImgFile(file, fileList) {
      if (!file.raw.type.startsWith("image")) {
        fileList.pop()
        this.detaiImglList = fileList;
        this.$message.error("只能上传图片类型文件");
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        fileList.pop()
        this.detaiImglList = fileList;
        this.$message.error("上传图片大小不能超过 10MB!");
        return;
      }
      this.detaiImglList = fileList
    //   this.ruleForm.detailImgFiles = fileList;
    },
    handleRemoveDetaiImg(file,fileList){
        if(!file.raw && file.id) {
            this.deleteImgIds.push(file.id)
        }
         setTimeout(()=> {
            this.detaiImglList = fileList
        },500)
    },
    // 删除图片
    handleRemove(fileList) {
      this.ruleForm.headerImgFile = "";
      this.ruleForm.isDelCoverImg = true;
      this.imageList = [];
      setTimeout(() => {
        this.hideUpload = fileList.length >= 1;
      }, 500);
    },
        // 上下架商品
    updateGoodsStatus(){
        let params = {
            id:this.ruleForm.id
        }
        let url = "/msla/kit/updateProductOnShelf"
        this.requestMethodPost(url,params,true).then(res => {
            if(res.data.code == 1000) {
                this.$message({
                    message: '上架成功',
                    type: "success"
                });
                this.$router.push({
                    name: "GoodsManagement",
                    params: { isSaveQuery: true,activeName:'second'}
                });
            }else {
                this.$message({
                    message: res.data.msg,
                    type: "warning"
                });
            }
        }).catch(res => {
        });
    },
    handleReturnList(){
        this.$router.push({
            name: "GoodsManagement",
            params: { isSaveQuery: true }
        });
    },
    updateGoodsInfo(){
        let params = new FormData();
        params.append("id", this.ruleForm.id);
        params.append("productName", this.ruleForm.productName);
        params.append("productDesc", this.ruleForm.productDesc);
        params.append("unit", this.ruleForm.unit || '');
        params.append("productPrice", this.ruleForm.productPrice || '');
        params.append("maxNum",this.ruleForm.maxNum);
        params.append("maxNumUnit",this.ruleForm.maxNumUnit || '套');
        params.append("erpCode", this.ruleForm.erpCode || '');
        params.append("productStandards", this.ruleForm.productStandards || '');
        params.append("productPlace", this.ruleForm.productPlace || '');
        params.append("headerImgFile", this.ruleForm.headerImgFile || '');
        params.append("ids", this.deleteImgIds.join(',') || '');
        params.append("isDelCoverImg", this.ruleForm.isDelCoverImg?true:false);
        this.detaiImglList.forEach(item => {
            if(item.raw) {
                params.append("detailImgFiles", item.raw);
            }
        })
        this.requestMethodPost("/msla/kit/updateProductById", params)
        .then(res => {
            res = res.data;
            if (res.code == 1000) {
                if(this.ruleForm.state != 1) {
                    this.$message({
                        message: "保存成功",
                        type: "success"
                    });
                    this.dialogEditVisible = true
                } else {
                    this.$message({
                        message: "修改成功",
                        type: "success"
                    });
                    this.$router.push({
                        name: "GoodsManagement",
                        params: { isSaveQuery: true }
                    });
                }
            } else {
            this.$message({
                message: res.msg,
                type: "warning"
            });
            }
        })
        .catch(res => {
        });
    },
    //提交
    handleSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            if(this.ruleForm.state == 1) {
                this.$confirm("确定更新商品信息吗？", "提交", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    customClass:'deletBtn',
                    closeOnClickModal:false,
                    type: "warning"
                }).then(() => {
                    this.updateGoodsInfo()
                }).catch(() => {});
            } else {
                this.updateGoodsInfo()
            }

        } else {
          return false;
        }
      });
    },
    // 返回
    handleResetFrom(formName) {
        history.back();
    //  this.$router.push({
    //       name: "GoodsManagement",
    //       params: { isSaveQuery: true }
    //     });
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight -
        150}px`;
    }
  }
};
</script>
<style lang='less' scoped>
.edit-goods-profile {
  padding: 0 20px 20px;
  height: calc(100% - 60px);
  overflow: auto;
  position: relative;
  &-title {
    font-weight: bold;
    font-size: 16px;
    span {
      color: #999999;
      font-size: 14px;
      font-weight: normal;
    }
  }
}
</style>
<style>
.edit-goods-profile .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.edit-goods-profile .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.edit-goods-profile .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.edit-goods-profile .avatar {
  width: 128px;
  height: 128px;
  display: block;
}

.edit-goods-profile .el-form-item__label {
  color: #999999;
  padding: 0;
}
.hide .el-upload--picture-card {
  display: none;
}
.deletBtn .el-button--primary {
    background-color:#fe000c !important;
    border-color:#fe000c !important;
}   
.deletBtn .el-message-box__container {
    position: relative;
}
.deletBtn .el-icon-warning {
  color: #fe000c !important;
  top: 15px !important;
}
.editInfoDialog .el-dialog__body{
    padding: 15px !important;
}
.editInfoDialog .el-dialog__header {
    padding: 15px !important;
}
.editInfoDialog .el-dialog__footer {
    padding: 15px !important;

}
</style>