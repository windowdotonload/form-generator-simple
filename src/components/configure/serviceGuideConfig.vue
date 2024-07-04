<template>
  <div :style="mainminheight" class="classific-service-apply-content">
    <div class="classic-service-content">
      <div class="classic-service-header left">
        <div class="left-title">
          润滑指引
        </div>
        <div class="insert-title" style="cursor: pointer;" @click="addGuideItem()">新增</div>
      </div>
      <div class="classic-service-header">
        <div class="left-title">
          指引内容
        </div>
        <div style="display:flex;justify-content:flex-end;margin:0 20px 20px 0;">
          <el-button type="danger" @click="handleConfirm" size="small" v-show="isShowGuideForm">确 定</el-button>
        </div>
      </div>
    </div>
    <div class="classic-service-table-content">
      <div class="classic-service-table" :style="contentHeight">
        <div v-for="(item, index) in guideList" :key="index" class="item-line" :style="item.id==clickGuideId?'background: rgba(221, 0, 0, 0.05);border-right: 4px solid #dd0000;':''" @click="itemClick(item.id)">
          <div>
            {{item.name}}
          </div>
          <div v-show="item.id==clickGuideId">
            <span class="copy-btn" @click.stop="handleCopyGuide(item)">复制</span>
          </div>
        </div>
        <div v-if="guideList.length==0" class="no-data">暂无数据</div>
      </div>
      <!-- 指引内容 -->
      <div class="classic-service-table table-right" :style="contentHeight">
        <el-form ref="guideFormRef" :model="guideForm" label-width="110px" style="margin:20px 20px 0 0;" v-show="isShowGuideForm">
          <el-form-item label="指引名称：" prop="name" :rules="[{ required: true, message: '请输入指引', trigger: 'blur' }]">
            <el-input placeholder="请输入" v-model="guideForm.name"  type="textarea" maxlength="100" :rows="3" clearable show-word-limit size="small"></el-input>
          </el-form-item> 
          <el-form-item label="关联类型：" prop="type" :rules="[{ required: true, message: '请选择关联类型', trigger: 'change' }]">
            <el-select placeholder="请选择" size="small" v-model="guideForm.type">
              <el-option v-for="item in relateTypeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <div v-if="guideForm.type==1" style="margin-left:25px;"><span style="color:#f56c6c;">*</span><span style="color:#606266;font-size:14px;">上传文档：</span><span style="color:#999;font-size:12px;">（最多上传1份，50M以内pdf格式的文档）</span></div>
          <el-form-item v-if="guideForm.type==1" style="margin-top:10px;">
            <OSSUploadCombine :previewAble="true" accept=".pdf" fileType="lub_point_study_file" uploadType="file" uploadBtnText="上传文档" v-model="guideForm.fileUrl"/>
          </el-form-item>
          <el-form-item label="提示内容：" prop="tipContent" v-if="guideForm.type==2" :rules="[{ required: true, message: '请输入提示内容', trigger: 'blur' }]">
            <el-input placeholder="请输入" type="textarea" maxlength="100" :rows="3" clearable show-word-limit size="small" v-model="guideForm.tipContent"></el-input>
          </el-form-item> 
          <div v-if="guideForm.type==3||guideForm.type==4" style="margin-left:25px;"><span style="color:#f56c6c;">*</span><span style="color:#606266;font-size:14px;">上传图片：</span><span style="color:#999;font-size:12px;">（最多上传1张，10M以内png、jpg、svg、gif格式的图片）</span></div>
          <el-form-item v-if="guideForm.type==3||guideForm.type==4" style="margin-top:10px;">
            <imgUpload :loop-item="popImgItem" />
          </el-form-item>
          <template v-if="guideForm.type==5">
            <div v-for="(item, index) in pageGuide" :key="index" style="margin-left:20px;">
              <el-form ref="form" :model="item" label-width="110px">
                <el-form-item :label="'指引'+(index+1)+'：'" prop="name" :rules="[{ required: true, message: '请输入指引', trigger: 'blur' }]">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <el-input placeholder="请输入" style="width:80%;" v-model="item.name"  type="textarea" maxlength="100" :rows="3" clearable show-word-limit size="small"></el-input>
                    <div style="margin-left:10px;">
                      <el-button type="danger" plain @click="deletePageItem(index)" size="small" v-if="pageGuide.length>1">删 除</el-button>
                    </div>
                  </div>
                </el-form-item> 
                <el-form-item label="关联类型：" prop="type" :rules="[{ required: true, message: '请选择关联类型', trigger: 'change' }]">
                  <el-select placeholder="请选择" size="small" v-model="item.type"  @change="()=>changeGuidePage(index, item)">
                    <el-option v-for="itemType in relateTypePageList" :key="itemType.id" :label="itemType.name" :value="itemType.id"> </el-option>
                  </el-select>
                </el-form-item>
                <div v-if="item.type==1" style="margin-left:25px;"><span style="color:#f56c6c;">*</span><span style="color:#606266;font-size:14px;">上传文档：</span><span style="color:#999;font-size:12px;">（最多上传1份，50M以内pdf格式的文档）</span></div>
                <el-form-item v-if="item.type==1" style="margin-top:10px;">
                  <OSSUploadCombine :previewAble="true" accept=".pdf" fileType="lub_point_study_file" uploadType="file" uploadBtnText="上传文档" v-model="item.fileUrl" />
                </el-form-item>
                <el-form-item label="提示内容：" prop="tipContent" v-if="item.type==2" :rules="[{ required: true, message: '请输入提示内容', trigger: 'blur' }]">
                  <el-input placeholder="请输入" style="width:80%;" type="textarea" maxlength="100" :rows="3" clearable show-word-limit size="small" v-model="item.tipContent"></el-input>
                </el-form-item> 
                <div v-if="item.type==3||item.type==4" style="margin-left:25px;"><span style="color:#f56c6c;">*</span><span style="color:#606266;font-size:14px;">上传图片：</span><span style="color:#999;font-size:12px;">（最多上传1张，10M以内png、jpg、svg、gif格式的图片）</span></div>
                <el-form-item v-if="item.type==3||item.type==4" style="margin-top:10px;">
                  <imgUpload :loop-item="item.popImgItem" />
                </el-form-item>
              </el-form>
            </div>
            <div style="color:#dd0000;margin-left:40px;cursor:pointer;" @click="addPageGuide">+ 添加指引(最大20项)</div>
          </template>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import imgUpload from "@/components/businessComponents/components/img-upload";
export default {
  components: {
    imgUpload
  },
  data() {
    return {
      isCopy: false,
      isShowGuideForm: false,
      clickGuideId:'',
      guideList: [],
      popImgItem: {
        imgFullDtoUrl: [],
        length: 1,
        cutWidth: 300,
        cutHeight: 400,
        styleJsonDto:{
          cutWidth: 300,
          cutHeight: 400
        }
      },
      pageGuide: [{
        id: '',
        name: '',
        type: '',
        tipContent: '',
        fileUrl: [],
        imageUrl: '',
        popImgItem: {
          imgFullDtoUrl: [],
          length: 1,
          cutWidth: 300,
          cutHeight: 400,
          styleJsonDto:{
            cutWidth: 300,
            cutHeight: 400
          }
        }
      }],
      guideForm: {
        id: '',
        name: '',
        type: '',
        tipContent: '',
        fileUrl: [],
        imageUrl: ''
      },
      relateTypeList: [{id: 1,name: '关联文档'},{id: 2,name: '关联文本提示'},{id: 3,name: '关联图片弹框'},{id: 4,name: '关联页面图片'},{id: 5,name: '关联页面'},{id: 6,name: '不关联'}],
      relateTypePageList: [{id: 1,name: '关联文档'},{id: 2,name: '关联文本提示'},{id: 3,name: '关联图片弹框'},{id: 4,name: '关联页面图片'},{id: 6,name: '不关联'}],
      mainminheight: `height:${document.documentElement.clientHeight}px`,
      contentHeight: `height:${document.documentElement.clientHeight - 250}px`,
    };
  },
  mounted() {
    this.getGuideList()
  },
  created() {},
  methods: {
    changeGuidePage(index, item) {
      if(item.type==3){
        this.pageGuide.splice(index,1)
        this.pageGuide.splice(index,0,{
          id: item.id,
          name: item.name,
          type: 3,
          tipContent: item.tipContent,
          fileUrl: [],
          imageUrl: '',
          popImgItem: {
            imgFullDtoUrl: [],
            length: 1,
            cutWidth: 300,
            cutHeight: 400,
            styleJsonDto:{
              cutWidth: 300,
              cutHeight: 400
            }
          }
        })
      }
      if(item.type==4){
        this.pageGuide.splice(index,1)
        this.pageGuide.splice(index,0,{
          id: item.id,
          name: item.name,
          type: 4,
          tipContent: item.tipContent,
          fileUrl: [],
          imageUrl: '',
          popImgItem: {
            imgFullDtoUrl: [],
            length: 1,
            cutWidth: 300,
            cutHeight: 400,
            styleJsonDto:{
              cutWidth: 300,
              cutHeight: 400
            }
          }
        })
      }
    },
    handleCopyGuide() {
      this.isShowGuideForm = true
      this.isCopy = true
      this.guideForm.name=''
    },
    deletePageItem(index) {
      this.pageGuide.splice(index,1)
    },
    addPageGuide() {
      if(this.pageGuide.length==20) {
        return
      }
      this.pageGuide.push({
        id: '',
        name: '',
        type: '',
        tipContent: '',
        fileUrl: [],
        imageUrl: '',
        popImgItem: {
          imgFullDtoUrl: [],
          length: 1,
          cutWidth: 300,
          cutHeight: 400,
          styleJsonDto:{
            cutWidth: 300,
            cutHeight: 400
          }
        }
      })
    },
    addGuideItem() {
      this.isShowGuideForm = true
      this.clickGuideId = ''
      this.guideForm = {
        id: '',
        name: '',
        type: '',
        tipContent: '',
        fileUrl: [],
        imageUrl: ''
      }
      this.popImgItem = {
        imgFullDtoUrl: [],
        length: 1,
        cutWidth: 300,
        cutHeight: 400,
        styleJsonDto:{
          cutWidth: 300,
          cutHeight: 400
        }
      }
      this.pageGuide = [{
        id: '',
        name: '',
        type: '',
        tipContent: '',
        fileUrl: [],
        imageUrl: '',
        popImgItem: {
          imgFullDtoUrl: [],
          length: 1,
          cutWidth: 300,
          cutHeight: 400,
          styleJsonDto:{
            cutWidth: 300,
            cutHeight: 400
          }
        }
      }]
    },
    // 润滑指引列表
    getGuideList() {
      this.guideList = []
      this.requestMethodGet('/lubePoint/study/getGuideList', {}).then((res) => {
        res = res.data;
        if (res.code == 1000) {
          if (res.data && res.data.length > 0) {
            this.guideList = res.data
          }
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
          });
        }
      });
    },
    itemClick(id){
      this.isShowGuideForm = true
      this.isCopy = false
      this.guideForm.id=id
      this.clickGuideId = id
      this.getGuideDetail(id)
    },
    getGuideDetail(id) {
      this.guideForm.type = 6
      this.requestMethodGet('/lubePoint/study/getGuideDetail', {id:id}).then(async (res) => {
        res = res.data;
        if (res.code == 1000) {
          this.guideForm.name = res.data.name
          this.guideForm.type = res.data.type
          if(this.guideForm.type==1){
            this.guideForm.fileUrl = [res.data.url]
          }
          if(this.guideForm.type==2){
            this.guideForm.tipContent = res.data.url
          }
          if(this.guideForm.type==3||this.guideForm.type==4){
            this.popImgItem.imgFullDtoUrl[0]={
              urlHalf: '',
              url: ''
            }
            this.popImgItem.imgFullDtoUrl[0].urlHalf = res.data.url
            const resData = await this.requestMethodGet("/web/file/getFullUrl", {
              url: encodeURI(this.popImgItem.imgFullDtoUrl[0].urlHalf)
            });
            if (resData.data.code == 1000) {
              this.popImgItem.imgFullDtoUrl[0].url = resData.data.data
            } else {
              this.$message({
                type: "warning",
                message: "获取全路径失败，请稍后重试。"
              });
            }
          }
          if(this.guideForm.type==5){
            this.pageGuide = []
            res.data.pageGuideList.forEach(async item=>{
              item.item = 6
              if(item.type==1){
                item.fileUrl = [item.url]
              }
              if(item.type==2){
                item.tipContent = item.url
              }
              if(item.type==3||item.type==4){
                item.popImgItem = {
                  imgFullDtoUrl: [{
                    urlHalf: '',
                    url: ''
                  }],
                  length: 1,
                  cutWidth: 300,
                  cutHeight: 400,
                  styleJsonDto:{
                    cutWidth: 300,
                    cutHeight: 400
                  }
                }
                item.popImgItem.imgFullDtoUrl[0].urlHalf = item.url
                const resData = await this.requestMethodGet("/web/file/getFullUrl", {
                  url: encodeURI(item.popImgItem.imgFullDtoUrl[0].urlHalf)
                });
                if (resData.data.code == 1000) {
                  item.popImgItem.imgFullDtoUrl[0].url = resData.data.data
                } else {
                  this.$message({
                    type: "warning",
                    message: "获取全路径失败，请稍后重试。"
                  });
                }
              }
              this.pageGuide.push(item)
            })
          }
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
          });
        }
      });
    },
    handleConfirm() {
      this.$refs.guideFormRef.validate(async valid => {
        if (valid) {
          let param = {
            name: this.guideForm.name,
            type: this.guideForm.type
          }
          if(this.guideForm.type==1){
            if(this.guideForm.fileUrl.length==0){
              this.$message({
                type: "warning",
                message: "请上传文档"
              });
            return
            }
            param.url = this.guideForm.fileUrl[0].halfPath
            param.pageGuideList = []
          }
          if(this.guideForm.type==2){
            if(this.guideForm.tipContent==''){
              this.$message({
                type: "warning",
                message: "请输入提示内容"
              });
              return
            }
            param.url = this.guideForm.tipContent
            param.pageGuideList = []
          }
          if(this.guideForm.type==3||this.guideForm.type==4){
            if(this.popImgItem.imgFullDtoUrl.length==0){
              this.$message({
                type: "warning",
                message: "请上传图片"
              });
              return
            }
            param.url = this.popImgItem.imgFullDtoUrl[0].urlHalf
            param.pageGuideList = []
          }
          if(this.guideForm.type==5){
            let pageGuideList = []
            let msgFlag = false,msgText = ''
            console.log('this.pageGuide',this.pageGuide)
            this.pageGuide.forEach((item, index)=>{
              let pageObj = {}
              if(!item.name&&!msgFlag){
                msgFlag = true
                msgText = "请输入指引"+(index+1)+"名称"
                return
              }
              if(!item.type&&!msgFlag){
                msgFlag = true
                msgText = "请选择指引"+(index+1)+"关联类型"
                return
              }
              pageObj.name = item.name
              pageObj.type = item.type
              if(item.id){
                pageObj.id = item.id
              }
              if(item.type==1){
                if((item.fileUrl.length==0)&&!msgFlag){
                  msgFlag = true
                  msgText = "请上传指引"+(index+1)+"文档"
                  return
                }
                console.log('item.fileUrl[0]',item.fileUrl[0])
                pageObj.url = item.fileUrl[0].halfPath
              }
              if(item.type==2){
                if(item.tipContent==''&&!msgFlag){
                  msgFlag = true
                  msgText = "请输入指引"+(index+1)+"提示内容"
                  return
                }
                pageObj.url = item.tipContent
              }
              if(item.type==3||item.type==4){
                if(item.popImgItem.imgFullDtoUrl.length==0&&!msgFlag){
                  msgFlag = true
                  msgText = "请上传指引"+(index+1)+"图片"
                  return
                }
                pageObj.url = item.popImgItem.imgFullDtoUrl[0].urlHalf
              }
              pageGuideList.push(pageObj)
            })
            if(msgFlag){
              this.$message({
                type: "warning",
                message: msgText
              });
              return
            }
            param.pageGuideList = pageGuideList
          }
          if(this.guideForm.type==6){
            param.url = ''
            param.pageGuideList = []
          }
          if(this.guideForm.id&&!this.isCopy){
            param.id=this.guideForm.id
          }
          this.requestMethodPost('/lubePoint/study/addOrUpdateGuide', param).then(res => {
            if (res.data.code == 1000) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.clickGuideId = ''
              this.isShowGuideForm = false
              this.guideForm = {
                id: '',
                name: '',
                type: '',
                tipContent: '',
                fileUrl: [],
                imageUrl: ''
              }
              this.popImgItem = {
                imgFullDtoUrl: [],
                length: 1,
                cutWidth: 300,
                cutHeight: 400,
                styleJsonDto:{
                  cutWidth: 300,
                  cutHeight: 400
                }
              }
              this.pageGuide = [{
                id: '',
                name: '',
                type: '',
                tipContent: '',
                fileUrl: [],
                imageUrl: '',
                popImgItem: {
                  imgFullDtoUrl: [],
                  length: 1,
                  cutWidth: 300,
                  cutHeight: 400,
                  styleJsonDto:{
                    cutWidth: 300,
                    cutHeight: 400
                  }
                }
              }]
              this.getGuideList()
            } else {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            }
          });
        }
      })
    }
  }
};
</script>
<style scoped lang="less">
/deep/.el-table .success-row {
  background: #ecf5ff;
}
.classific-service-apply-content {
  margin: 20px 20px 0;
  border: 1px solid #e9e9e9;
  .classic-service-content {
    display: flex;
  }
  .classic-service-header {
    width: 50%;
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    justify-content: space-between;
  }
  .left-title {
    height: 48px;
    display: flex;
    justify-content: left;
    align-items: center;
    font-weight: bolder;
  }
  .insert-title{
    height: 32px;
    border: 1px solid #dd0000;
    color: #dd0000;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 20px 20px 0;
    font-size: 14px;
    background-color:rgba(221, 0, 0, 0.05);
  }
  .left {
    border-right: 1px solid #e9e9e9;
  }
  .classic-service-table-content {
    display: flex;
    height: 100%;
    .item-line{
      padding: 0 20px;
      height: 48px;
      display:flex;
      justify-content:space-between;
      align-items:center;
      cursor: pointer;
      .label-circle{
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 4px;
      }
      .copy-btn{
        color: #001450;
        padding-right: 10px;
        font-size: 14px;
        cursor: pointer;
      }
      .edit-btn{
        color: #dd0000;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
  .classic-service-table {
    width: 50%;
    height: 722px;
    overflow: auto;
  }
  .service-line {
    display: inline-block;
    width: 1px;
    height: 1em;
    margin: 0;
    vertical-align: middle;
    position: relative;
    background-color: #e9e9e9;
  }
  .table-right {
    border-left: 1px solid #e9e9e9;
  }
  .level-point {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .draw-class {
    width: 50%;
  }
  .footer-drawer {
    display: flex;
    align-items: center;
    height: 52px;
    margin-right: 40px;
  }
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 263px;
    height: 32px;
    border-radius: 3px;
    font-size: 12px;
    border: 1px solid;

    cursor: pointer;
  }
  .cancel {
    margin: 0 10px 0 20px;
    border: 1px solid #e9e9e9;
    color: #666666;
  }
  .submit {
    color: #fff;
    background-color: #dd0000;
  }
  /deep/.el-radio__input.is-checked .el-radio__inner {
    border-color: #001450 !important;
    background: #001450 !important;
  }
  /deep/ .el-upload-list__item {
    transition: none !important;
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
  .add-guide-btn{
    color: #dd0000;
    font-size: 14px;
    margin: 5px 20px;
    cursor: pointer;
  }
  .no-data{
    color: #666666;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
