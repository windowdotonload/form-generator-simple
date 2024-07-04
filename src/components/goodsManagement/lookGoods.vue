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
  <div class="look-goods-profile" :style="mainminheight">
        <p class="look-goods-profile-title">基本信息</p>
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
              <span>{{ruleForm.productName}}</span>
 
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align:center">
            <span style="color:#999;font-size:14px">状态：</span>{{ruleForm.stateDesc}}
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="商品描述：" prop="productDesc">
              <span>{{ruleForm.productDesc}}</span>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="价格：" prop="productPrice">
            <span>{{ruleForm.productPrice == '0.00'?'':ruleForm.unit}}{{ruleForm.productPrice == '0.00'?'暂无':ruleForm.productPrice}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="单次限购数量：" prop="maxNum">
            <span>{{ruleForm.maxNum}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="ERPCODE：" prop="erpCode">
              <span>{{ruleForm.erpCode}}</span>
<!-- 
            <el-input
              size="small"
              placeholder="请输入ERPCODE"
              clearable
              v-model="ruleForm.erpCode"
              maxlength="25"
              style="width:100%;"
            ></el-input> -->
          </el-form-item>
        </el-col>
            <!-- <el-col :span="8">
            <el-form-item label="" prop="telephone">
                <div style="color:#999">
                    <i class="el-icon-info"></i> MSLA系统的商品识别码，用于商品订单信息校验
                </div>
            </el-form-item>
            </el-col> -->
      </el-row>
        <el-row :gutter="20">
            <el-col :span="8">
            <el-form-item label="创建日期：" prop="createTime">
                <span>{{ruleForm.createTime}}</span>
            </el-form-item>
            </el-col>
        </el-row>
       <p class="look-goods-profile-title">
        商品图
        </p>
         
      <el-row :gutter="20" style="margin-bottom: 30px">
        <el-col :span="24" style="display:flex;align-items:center">
            <label style="width:120px;text-align:right">封面图：</label>
              <el-image 
                style="width: 200px; height: 150px"
                fit="contain"
                v-if="ruleForm.coverImgUrl"
                :src="ruleForm.coverImgUrl" 
                :preview-src-list="imageList">
            </el-image>
        </el-col>
      </el-row>
       <el-row :gutter="20" style="margin-bottom: 30px">
        <el-col :span="24" style="display:flex;align-items:center">
            <label style="width:120px;text-align:right">商品详情图：</label>
              <el-image 
                v-for="item in detaiImglList"
                :key="item"
                style="width: 200px; height: 150px;margin-right:20px;"
                fit="contain"
                :src="item" 
                :preview-src-list="detaiImglList">
            </el-image>
        </el-col>
      </el-row>
    <p class="look-goods-profile-title">详情</p>
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
                <span>{{ruleForm.productStandards}}</span>
          </el-form-item>
        </el-col>
      </el-row>
         <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="产地：" prop="productPlace">
                <span>{{ruleForm.productPlace}}</span>
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
      <el-button type="danger" @click="handleSubmitForm('ruleForm')" size="small">编辑</el-button>
    </div>
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
      ruleForm: {
        coverImgUrl:''
      },
      //   表单验证规则
      rules: {},
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
            this.ruleForm.coverImgUrl = res.data.coverImgUrl
            this.ruleForm = res.data; //回显数据
            this.imageList = [res.data.coverImgUrl]
            this.detaiImglList = res.data.detaiImglList.map(item => {
                return item.imgUrl
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
        this.detaiImglList = [];
        this.$message.error("只能上传图片类型文件");
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.detaiImglList = [];
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
    },
    // 删除图片
    handleRemove(fileList) {
      this.ruleForm.file = "";
      this.ruleForm.picDeleteFlag = 1;
      this.imageList = [];
      setTimeout(() => {
        this.hideUpload = fileList.length >= 1;
      }, 500);
    },

    //编辑
    handleSubmitForm(formName) {
        this.$router.push({
            path: "/GoodsManagement/EditGoods",
            query: {
                id: this.$route.query.id,
            }
        });
        
    },
    // 返回
    handleResetFrom(formName) {
        history.back();

        // this.$router.push({
        //   name: "GoodsManagement",
        //   params: { isSaveQuery: true }
        // });
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight -
        150}px`;
    }
  }
};
</script>
<style lang='less' scoped>
.look-goods-profile {
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
.look-goods-profile .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.look-goods-profile .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.look-goods-profile .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.look-goods-profile .avatar {
  width: 128px;
  height: 128px;
  display: block;
}

.look-goods-profile .el-form-item__label {
  color: #999999;
  padding: 0;
}
.hide .el-upload--picture-card {
  display: none;
}
</style>