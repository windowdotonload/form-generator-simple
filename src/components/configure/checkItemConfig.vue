<template>
  <div :style="mainminheight" class="classific-service-apply-content">
    <div class="classic-service-content">
      <div class="classic-service-header left">
        <div class="left-title">
          润滑检查项目
        </div>
        <div class="insert-title" style="cursor: pointer;" @click="handleCheckAndGuide('新增检查项目')">新增</div>
      </div>
      <div class="classic-service-header">
        <div class="left-title">
          润滑指引
        </div>
        <div class="insert-title" :style="!isAddGuide?'color:#999;border: 1px solid #ccc;background-color:rgba(245, 245, 245, 0.5);':'cursor: pointer;'" @click="isAddGuide?handleCheckAndGuide('新增润滑指引'):''">新增</div>
      </div>
    </div>
    <div class="classic-service-table-content">
      <!-- 检查项目 -->
      <div class="classic-service-table" :style="contentHeight">
        <div v-for="(item, index) in checkItemList" :key="index" class="item-line" :style="item.id==clickCheckItemId?'background: rgba(221, 0, 0, 0.05);border-right: 4px solid #dd0000;':''" @click="itemClick(item.id, 'lubri')">
          <div>
            <span class="label-circle" :style="item.status==1?'background:#008888;':'background:#dd0000;'"></span>
            {{item.itemName}}
          </div>
          <div v-show="item.id==clickCheckItemId">
            <span class="copy-btn" @click.stop="handleCheckAndGuide('复制检查项目', item)">复制</span>
            <span class="edit-btn" @click.stop="handleCheckAndGuide('编辑检查项目', item)">编辑</span>
          </div>
        </div>
        <div v-if="checkItemList.length==0" class="no-data">暂无数据</div>
      </div>
      <!-- 润滑指引 -->
      <div class="classic-service-table table-right" :style="contentHeight">
        <div v-for="(item, index) in guideList" :key="index" class="item-line" :style="item.id==clickGuideId?'background: rgba(221, 0, 0, 0.05);border-right: 4px solid #dd0000;':''" @click="itemClick(item.id, 'check')">
          <div>
            <span class="label-circle" :style="item.relStatus==1?'background:#008888;':'background:#dd0000;'"></span>
            {{item.name}}
          </div>
          <div v-show="item.id==clickGuideId">
            <el-link
              type="danger"
              :underline="false"
              @click="handleChangeMove('up', item, index)"
              :disabled="index==0? true : false"
              :style="index==0?'margin-right: 10px;color: #aaa;':'margin-right: 10px; color: #001450;'"
              >上移</el-link
            >
            <el-link
              type="danger"
              :underline="false"
              @click="handleChangeMove('down', item, index)"
              :disabled="index+1==guideList.length ? true : false"
              :style="index+1==guideList.length ?'margin-right: 10px;color: #aaa;':'margin-right: 10px; color: #001450;'"
              >下移</el-link
            >
            <span class="edit-btn" @click="handleCheckAndGuide('编辑润滑指引', item)">编辑</span>
          </div>
        </div>
        <div v-if="guideList.length==0" class="no-data">暂无数据</div>
      </div>
    </div>

    <el-dialog :title="checkItemHandle=='复制检查项目'?'新增检查项目':checkItemHandle" :visible.sync="checkItemDialog" width="40%" :close-on-click-modal="false" :before-close="handleClosecheckItem">
      <div style="display: flex; align-items: center" v-show="dialogType=='checkItem'">
        <el-form ref="lubriForm" :model="checkItemRuleForm" label-width="110px" label-position="left">
          <el-form-item label="检查项目：" prop="itemName" :rules="[{ required: true, message: '请输入检查项目', trigger: 'blur' }]">
            <el-input style="width:400px;" placeholder="请输入" maxlength="20" clearable show-word-limit size="small" v-model="checkItemRuleForm.itemName"></el-input>
          </el-form-item>
          <el-form-item label="启用/禁用：" prop="status" :rules="[{ required: true, message: '请选择启用/禁用', trigger: 'change' }]">
            <el-switch 
              v-model="checkItemRuleForm.status"
              active-color="#001450"
              :active-text="checkItemRuleForm.status?'启用':'禁用'">
            </el-switch>
          </el-form-item>
          <el-form-item label="问题描述/原因分析：" prop="adviceFlag" :rules="[{ required: true, message: '请选择启用/禁用', trigger: 'change' }]">
            <el-switch 
              v-model="checkItemRuleForm.adviceFlag"
              active-color="#001450"
              :active-text="checkItemRuleForm.adviceFlag?'启用':'禁用'">
            </el-switch>
          </el-form-item>
          <el-form-item label="异常图片：" prop="imageFlag" :rules="[{ required: true, message: '请选择启用/禁用', trigger: 'change' }]">
            <el-switch 
              v-model="checkItemRuleForm.imageFlag"
              active-color="#001450"
              :active-text="checkItemRuleForm.imageFlag?'启用':'禁用'">
            </el-switch>
          </el-form-item>
          <el-form-item label="异常说明：" prop="exceptionDesc" :rules="[{ required: true, message: '请输入异常说明', trigger: 'blur' }]">
            <el-input placeholder="请输入" type="textarea" maxlength="100" :rows="5" clearable show-word-limit size="small" v-model="checkItemRuleForm.exceptionDesc"></el-input>
          </el-form-item>
          <el-form-item label="NOTE：" prop="note">
            <el-input placeholder="请输入" type="textarea" maxlength="50" :rows="3" clearable show-word-limit size="small" v-model="checkItemRuleForm.note"></el-input>
          </el-form-item>
          <div v-show="checkItemHandle=='复制检查项目'" style="color:#dd0000;">您将复制{{checkItemSelect}}的润滑指引配置！</div>
        </el-form>
      </div>
      <div style="display: flex; align-items: center" v-show="dialogType=='guide'">
        <el-form ref="checkItemForm" :model="guideForm" label-width="110px" label-position="left">
          <el-form-item label="润滑指引：" prop="guideId" :rules="[{ required: true, message: '请选择润滑指引', trigger: 'change' }]">
            <el-select v-model="guideForm.guideId" clearable placeholder="请选择" size="small" :disabled="checkItemHandle=='编辑润滑指引'">
              <el-option v-for="item in selecGuideOptions" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启用/禁用：" prop="relStatus" :rules="[{ required: true, message: '请选择启用/禁用', trigger: 'change' }]">
            <el-switch 
              v-model="guideForm.relStatus"
              active-color="#001450"
              :active-text="guideForm.relStatus?'启用':'禁用'">
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClosecheckItem" size="small">取 消</el-button>
        <el-button type="danger" @click="handleConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checkItemSelect:'',
      isAddGuide: false,
      checkItemRuleForm: {
        id: '',
        itemName: '',
        exceptionDesc: '',
        note: '',
        adviceFlag: true,
        imageFlag: true,
        status: true
      },
      guideForm: {
        guideId: '',
        relStatus: true
      },
      selecGuideOptions: [],
      checkItemDialog: false,
      checkDialog: false,
      clickCheckItemId: '',
      clickGuideId: '',
      checkItemHandle: '',
      dialogType: '',
      checkItemList: [],
      guideList: [],
      mainminheight: `height:${document.documentElement.clientHeight}px`,
      contentHeight: `height:${document.documentElement.clientHeight - 250}px`,
    };
  },
  mounted() {
    this.getCheckItemList()
    this.getGuideList()
  },
  created() {},
  methods: {
    handleChangeMove(type, item, index){
      let param = {
        studyItemId: this.clickCheckItemId,
        guideId: item.id,
        sort: item.sort,
        sortType: type
      }
      this.requestMethodPost('lubePoint/study/updateGuideSort', param).then(res => {
          if (res.data.code == 1000) {
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.getGuideList(this.clickCheckItemId)
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
        });
    },
    // 润滑指引列表
    getGuideList(id) {
      this.guideList = []
      let param = {}
      if(id) param = {itemId: id}
      this.requestMethodGet('/lubePoint/study/getGuideList', param).then((res) => {
        res = res.data;
        if (res.code == 1000) {
          if (res.data && res.data.length > 0) {
            if(id) {
              this.guideList = res.data
            }else{
              this.selecGuideOptions = res.data
            }
          }
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
          });
        }
      });
    },
    // 检查项目列表
    getCheckItemList() {
      this.guideList = []
      this.requestMethodGet('/lubePoint/study/getItemList', {}).then((res) => {
        res = res.data;
        if (res.code == 1000) {
          if (res.data && res.data.length > 0) {
            this.checkItemList = res.data
          }
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
          });
        }
      });
    },
    itemClick(id, type){
      if(type=='lubri'){
        this.clickCheckItemId = id
        this.getGuideList(id)
        this.checkItemRuleForm.id=id
        this.isAddGuide = true
      }else{
        this.clickGuideId = id
      }
    },
    handleClosecheckItem() {
      this.checkItemDialog = false
      if(this.dialogType=='checkItem'){
        this.checkItemRuleForm = {
          id: '',
          itemName: '',
          exceptionDesc: '',
          note: '',
          adviceFlag: true,
          imageFlag: true,
          status: true
        }
      }else{
        this.guideForm = {
          guideId: '',
          relStatus: true
        }
      }
    },
    handleConfirm() {
      if(this.dialogType=='checkItem'){
        this.$refs.lubriForm.validate(async valid => {
          if (valid) {
            let url='/lubePoint/study/addOrUpdateItem', param={}
            param.itemName = this.checkItemRuleForm.itemName
            param.status = this.checkItemRuleForm.status?1:0
            param.adviceFlag = this.checkItemRuleForm.adviceFlag?1:0
            param.imageFlag = this.checkItemRuleForm.imageFlag?1:0
            param.exceptionDesc = this.checkItemRuleForm.exceptionDesc
            param.note = this.checkItemRuleForm.note
            if(this.checkItemHandle=='编辑检查项目'){
              param.id=this.checkItemRuleForm.id
            }
            if(this.checkItemHandle=='复制检查项目'){
              url='/lubePoint/study/copyItem'
              param.copyItemId=this.checkItemRuleForm.id
            }
            this.requestMethodPost(url, param).then(res => {
              if (res.data.code == 1000) {
                this.$message({
                  type: "success",
                  message: "操作成功"
                });
                this.checkItemDialog = false
                this.getCheckItemList()
                if(this.checkItemRuleForm.id){
                  this.getGuideList(this.checkItemRuleForm.id)
                }
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg
                });
              }
            });
          }
        });
      }else{
        this.$refs.checkItemForm.validate(async valid => {
          if (valid) {
            let param={}
            param.relStatus = this.guideForm.relStatus?1:0
            param.id=this.checkItemRuleForm.id||''
            param.guideId=this.guideForm.guideId
            param.addFlag=1
            if(this.guideForm.sort){
              param.addFlag=0
              param.sort=this.guideForm.sort
            }
            this.requestMethodPost('/lubePoint/study/addOrUpdateItemGuideRel', param).then(res => {
              if (res.data.code == 1000) {
                this.$message({
                  type: "success",
                  message: "操作成功"
                });
                this.getGuideList(this.checkItemRuleForm.id)
                this.checkItemDialog = false
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg
                });
              }
            });
          }
        });
      }
    },
    handleCloseCheck() {
      this.checkDialog = false
    },
    async handleCheckAndGuide(type, row) {
      this.checkItemHandle = type
      if(type.substring(2,4)=='检查'){
        this.dialogType='checkItem'
        if(type.substring(0,2)=='新增'){
          this.checkItemRuleForm = {
            id: '',
            itemName: '',
            exceptionDesc: '',
            note: '',
            adviceFlag: true,
            imageFlag: true,
            status: true
          }
          this.isAddGuide = false
        }else if(type.substring(0,2)=='复制'||type.substring(0,2)=='编辑'){
          const res = await this.requestMethodGet("/lubePoint/study/getItemDetail", {id: row.id});
          if(res.data.code == 1000){
            Object.assign(this.checkItemRuleForm, res.data.data)
            this.checkItemRuleForm.status=this.checkItemRuleForm.status==1?true:false
            this.checkItemRuleForm.adviceFlag=this.checkItemRuleForm.adviceFlag==1?true:false
            this.checkItemRuleForm.imageFlag=this.checkItemRuleForm.imageFlag==1?true:false
          }
          if(type.substring(0,2)=='复制'){
            this.checkItemSelect = this.checkItemRuleForm.itemName
            this.checkItemRuleForm.itemName=''
          }
        }
      }else{
        this.dialogType='guide'
        if(type.substring(0,2)=='新增'){
          if(this.guideList.length>0){
            let guideArr = this.guideList.map(item=>{
              return item.id
            })
            this.selecGuideOptions.forEach(item=>{
              if(guideArr.includes(item.id)){
                item.disabled = true
              }else{
                item.disabled = false
              }
            })
          }else{
            this.selecGuideOptions.forEach(item=>{
              item.disabled = false
            })
          }
          this.guideForm = {
            guideId: '',
            relStatus: true
          }
        }else if(type.substring(0,2)=='编辑'){
          this.guideForm.guideId = row.id
          this.guideForm.sort = row.sort
          this.guideForm.relStatus = row.relStatus==1?true:false
        }
      }
      this.checkItemDialog = true
    },
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
