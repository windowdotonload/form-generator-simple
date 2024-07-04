<template>
  <div :style="mainminheight">
    <div style="display: flex;justify-content: flex-end;margin-right: 20px;">
      <span style="font-size:14px;color:#001450;cursor: pointer;" @click="overviewConfigure" v-has="Service-GLXXPZ">概览信息配置</span>
    </div>
    <div class="main-content" :style="{height:contentHeight+'px'}">
      <!-- 左右菜单二三级 -->
      <div class="left-menu">
        <!-- 顶部 -->
        <div class="menu-header">
          <!-- 红竖 -->
          <div class="line"></div>
          服务索引
          <!--  v-has="Service-SZ" -->
          <img style="margin-left: auto;margin-right: 12px;cursor: pointer;" src="../../assets/service_configure_icon.png" alt="" @click="toIndexesConfigure">
        </div>
        <!-- 一二级列表 -->
        <div class="level-content" :style="{height:(contentHeight-210)+'px'}">
          <div class="second-level">
            <div v-for="(item,index) in level1List" :key="index" class="level-item-content" @click="clickLevel1(item)" :style="{backgroundColor:(item.isActive?'rgba(0, 20, 80, 0.05)':'')}">
              <div class="level-point" :style="{backgroundColor:(item.status == 0?'#dd0000':'#008888')}"></div>
              <div class="level-name">{{item.serviceName}}</div>
            </div>
          </div>
          <div class="service-line" :style="{height:(contentHeight+100)+'px'}"></div>
          <div class="third-level">
            <div  v-if="level2List.length>0">
              <div v-for="(item,index) in level2List" :key="index" class="level-item-content" @click="clickLevel2(item)" :style="{backgroundColor:(item.isActive?'rgba(0, 20, 80, 0.05)':'')}">
                <div class="level-point" :style="{backgroundColor:(item.status == 0?'#dd0000':'#008888')}"></div>
                <div class="level-name">{{item.serviceName}}</div>
              </div>
            </div>
            <div v-if="level2List.length==0" style="font-size:14px;font-color:#909399;display: flex;align-items: center;justify-content: center;margin-top: 18px;">暂无数据</div>
          </div>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="right-content" style="flex:1">
        <div class="menu-header">
          <div class="line"></div>
          服务项
        </div>
        <!-- 统计数字与搜索 -->
        <div class="statistic-search">
          <div class="left-statistic">
            <div class="statistic-items">
              <div>全部</div>
              <div style="margin-left:10px">{{totalNumber}}</div>
            </div>
            <div class="statistic-items">
              <div class="level-point" style="background-color:#008888"></div><div style="margin-left:10px">启用中</div><div style="margin-left:10px">{{useNumber}}</div>
            </div>
            <div class="statistic-items">
              <div class="level-point" style="background-color:#dd0000"></div><div style="margin-left:10px">已停用</div><div style="margin-left:10px">{{stopUseNumber}}</div>
            </div>
          </div>
          <div class="right-search">
            <el-input
              placeholder="请输入名称"
              suffix-icon="el-icon-search"
              clearable
              size="small"
              style="margin-right:12px"
              v-model="queryParams.serviceName"
              @keyup.enter.native="queryService"
              @blur="queryService"
              @clear="queryService">
            </el-input>
            <el-button v-has="Service-TJFUX" type="danger" size="small" @click="addServiceItem" :disabled="level2List.length==0">添加服务项</el-button>
          </div>
          
        </div>
        <!-- 服务项表格 -->
        <div class="service-item-table-content" :style="{height:(contentHeight-250)+'px'}">
          <el-table
            ref="serviceOrderTable"
            :key="key"
            row-key="id"
            :data="serviceTable"
            tooltip-effect="dark"
            :header-cell-style="{background:'#f7f7f7'}"
            :style="{paddingBottom:(serviceTable.length>5?'100px':'0px')}"
            stripe
            v-loading="loading"
          >
          <el-table-column prop="sort" label="权重" width="100"></el-table-column>
          <el-table-column prop="serviceName" label="服务名称" show-overflow-tooltip width="150"></el-table-column>
          <el-table-column label="状态" width="150" align="center">
            <template slot-scope="scope">
              <div style="display:flex;align-items: center;justify-content: center;">
                <div class="level-point" :style="{backgroundColor:(scope.row.status == 0?'#dd0000':'#008888')}"></div>
                <div style="margin-left:5px">{{scope.row.status == 0?'已停用':'启用中'}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="市场建议价" width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.marketPrice && scope.row.marketPriceShow">
                ￥{{scope.row.marketPrice}}
              </div>
              <div v-else>
                免费
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="authorityTypeDesc" label="权限范围" width="150"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button style="color:#001450" type="text" @click="edit(scope.row)" v-has="Service-BJ">编辑</el-button>
              <el-button style="color:#001450" type="text"  @click="sortRow(scope.row)" v-has="Service-PX">排序</el-button>
            </template>
          </el-table-column>
          </el-table>
          <div class="pagination-content">
            <el-pagination
              v-if="totalNumber"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="queryParams.current"
              :page-size="queryParams.size"
              :page-sizes="[30,50,100,200]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNumber"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 排序弹框 -->
    <el-dialog
      title="排序"
      :visible.sync="sortDialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form ref="sortFormRef" :model="sortForm" :rules="sortRules" label-width="80px">
        <el-form-item style="margin-left:-80px">
          <span>请修改权重，修改后列表将优先按权重排序，权重相同时按创建时间降序排序</span>
        </el-form-item>
        <el-form-item label="权重值：" prop="sortNumber">
          <el-input-number size="small" v-model="sortForm.sortNumber" controls-position="right" @change="handleChange" step="1" :min="0" :max="100"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" plain @click="cancelSort('sortFormRef')" size="small">取 消</el-button>
        <el-button type="danger" @click="confirmSort('sortFormRef')" size="small">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 概览信息配置弹框 -->
    <el-dialog
      title="概览信息配置"
      :visible.sync="overviewDialogFlag"
      width="827px"
      height="428px"
      :before-close="handleClose">
      <div class="overview-content">
        <div class="overview-content-left">
          <img :src="backgroundImg?backgroundImg:DEFAULT_BG_IMG" alt="" class="left-img" style="width:375px;height:216px">
          <img :src="headImg?headImg:HEAD_IMG" alt="" class="left-mini-img">
          <div class="left-word-content">
            <div class="word-title">{{overviewTitle}}</div>
          </div>
          <div class="word-content">简介：{{overviewShortDesc}}</div>
          <div style="color:#666666;display: flex;justify-content: center;margin-top: 25px;">小程序展示效果</div>
        </div>
        <div class="overview-content-right">
          <el-form ref="overviewForm" :model="overviewForm" :rules="overviewRules" label-width="80px">
            <el-form-item label="背景" prop="backgroundList">
              <el-upload
                accept="image/*" 
                :action="uploadUrl"
                :on-remove="handleBackgroundRemove"
                :before-upload="beforeBackgroundUpload"
                :auto-upload="false"
                :on-change="handleBackgroundChange"
                :limit="1"
                list-type="picture"
                :file-list="overviewForm.backgroundList">
                <!-- v-if="!showBgBtn" -->
                <el-button type="danger" size="small" >上传背景</el-button>
              </el-upload>
              <div style="color:#999999">请上传20M以内的.jpg .png 文件</div>
            </el-form-item>
            <el-form-item label="头像" prop="headerImg">
              <el-upload
                class="upload-demo"
                :action="uploadUrl"
                :on-remove="handleHeaderRemove"
                :before-upload="beforeHeaderUpload"
                :auto-upload="false"
                :on-change="handleHeaderChange"
                :limit="1"
                accept="image/*" 
                list-type="picture"
                :file-list="overviewForm.headerImg">
                <!-- v-if="!showHeadBtn" -->
                <el-button type="danger" size="small" >上传头像</el-button>
              </el-upload>
              <div style="color:#999999">请上传5M以内的.jpg .png 文件</div>
            </el-form-item>
            <el-form-item label="标题" prop="name">
              <el-input clearable v-model="overviewForm.name" size="small" style="width:320px" placeholder="请输入" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="shortDesc">
              <el-input clearable :autosize="shortDescAutosize" style="width:320px" type="textarea" placeholder="请输入" v-model="overviewForm.shortDesc" maxlength="100" show-word-limit></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-divider></el-divider>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" plain @click="cancelOverview('overviewForm')" size="small">取 消</el-button>
        <el-button type="danger" @click="saveOverview('overviewForm')" size="small">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    const validateSort = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入权重值'));
      } else {
        const reg = new RegExp("^([1-9]|[1-9]\\d|100)$");
        if(!reg.test(value)){
          callback(new Error('请输入1-100以内的整数'));
        }
        callback();
      }
    }
    return {
      DEFAULT_BG_IMG:require('../../assets/default_bg.jpg'),
      HEAD_IMG:require('../../assets/default_header.png'),
      mainminheight: `height:${document.documentElement.clientHeight}px`,
      level1List:[],
      level2List:[],
      contentHeight:'',
      loading:false,
      serviceTable:[],
      totalNumber:0,
      useNumber:'',
      stopUseNumber:'',
      queryParams:{
        serviceName:'',
        current:1,
        size:30
      },
      sortDialogVisible:false,
      overviewDialogFlag:false,
      shortDescAutosize:{ minRows: 3, maxRows: 10  },
      overviewForm:{
        backgroundList:[],
        headerImg:[],
        backgroundPath:'',
        headPath:'',
        shortDesc:'',
        name:''
      },
      overviewRules:{
        backgroundList:[{ required: true, message: '请上传背景图', trigger: 'change' }],
        headerImg:[{ required: true, message: '请上传头像', trigger: 'change' }],
        name:[{ required: true, message: '请输入标题', trigger: 'blur' }],
        shortDesc:[{ required: true, message: '请输入简介', trigger: 'blur' }],
      },
      formHeight:'',
      clickLevel1Id:'',
      clickLevel2Id:'',
      uploadUrl:'',
      overviewTitle:'',
      backgroundImg:'',
      headImg:'',
      overviewShortDesc:'',
      showBgBtn:false,
      showHeadBtn:false,
      sortId:'',
      sortForm:{
        sortNumber:''
      },
      sortRules:{
        sortNumber:[{ validator: validateSort, trigger: 'blur' }]
      },
      defaultStatus:''
    }
  },
  mounted() {
    const el = document.getElementById('nav')
    this.contentHeight = document.documentElement.clientHeight
    console.log('el',this.contentHeight)
  },
  created(){
    this.getlevel1Data()
  },
  methods: {
    onResize() {
         this.contentHeight = document.documentElement.clientHeight
    },
    // 获取服务索引一级数据
    getlevel1Data(){
      const params = {
        serviceLevel: 1,
        current:1,
        size:30
      };
      this.requestMethodGet(
        "/web/config/serviceConfiguration/queryServiceConfListByPage",
        params
      ).then((res) => {
        if (res.data.code == 1000) {
          const data = res.data.data.list;
          // 取出第一项分类查询该下的服务
          if (data && data.length > 0) {
            const level1Id = sessionStorage.getItem("clickLevel1Id")
            let idList = []
            let idStr = ''
            data.forEach(item=>{
              idList.push(item.id)
            })
            idStr = idList.toString()
            if(idStr.indexOf(level1Id)>0){//在一级id
              data.forEach(item=>{
                if(item.id == level1Id){
                  item.isActive = true
                }else{
                  item.isActive = false
                }
              })
              this.clickLevel1Id = level1Id
              this.getLevel2Data(level1Id);
            }else{
              data.forEach((item,index)=>{
                if(index == 0){
                  item.isActive = true
                }else{
                  item.isActive = false
                }
              })
              this.clickLevel1Id = data[0].id
              sessionStorage.setItem("clickLevel1Id", data[0].id)
              this.getLevel2Data(data[0].id);
            }
          }
          this.level1List = data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning",
          });
        }
      });
    },
    // 获取分类下的服务列表
    getLevel2Data(val){
      const params = {
        serviceLevel: 2,
        parentId: val,
        current:1,
        size:30
      };
      this.requestMethodGet(
        "/web/config/serviceConfiguration/queryServiceConfListByPage",
        params
      ).then((res) => {
        if (res.data.code == 1000) {
          const data = res.data.data.list
          const level2Id = sessionStorage.getItem("clickLevel2Id")
          let dataStr = ''
          let idList = []
          if (data && data.length > 0) {
            data.forEach(it=>{
              idList.push(it.id)
            })
            dataStr = idList.toString()
            console.log('---------------',level2Id,idList.indexOf(level2Id)>0)
            if(dataStr.indexOf(level2Id)>0){
              let status = ''
              data.forEach(item=>{
                if(item.id == level2Id){
                  item.isActive = true
                  status = item.status
                }else{
                  item.isActive = false
                }
              })
              this.clickLevel2Id = level2Id
              this.defaultStatus = status
              this.getServiceList(level2Id)
            }else{
              data.forEach((item,index)=>{
                if(index == 0){
                  item.isActive = true
                }else{
                  item.isActive = false
                }
              })
              this.clickLevel2Id = data[0].id
              this.defaultStatus = data[0].status
              sessionStorage.setItem("clickLevel2Id", data[0].id)
              this.getServiceList(data[0].id)
            }
          }else{
            this.useNumber = 0
            this.stopUseNumber = 0
            this.serviceTable = []
            this.totalNumber = 0
            this.defaultStatus = 1
          }
           this.level2List = data
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning",
          });
        }
      });
    },
    // 获取服务项列表
    getServiceList(val){
      const param = {
        serviceLevel: 3,
        parentId: val,
      };
      const params = Object.assign(param,this.queryParams)
      this.requestMethodGet("/web/config/serviceConfiguration/queryServiceConfListByPage",params).then((res) => {
        if (res.data.code == 1000) {
          const data = res.data.data.list
          let use = 0
          let stop = 0
          if(data && data.length>0){
            data.forEach(item=>{
              if(item.status == 1){//启用
                ++use
              }else{//停用
                ++stop
              }
              let price = ''
              if(item.marketPrice>0){
                const val = item.marketPrice.toString()
                if(val.indexOf('.')>0){
                  price = String(val.split('.')[0]).replace(/\B(?=(\d{3})+(?!\d))/g, ',')+'.'+val.split('.')[1]
                }else{
                  price = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')+'.'+'00'
                }
              }
              item.marketPrice = price
            })
          }
          this.useNumber = use
          this.stopUseNumber = stop
          this.serviceTable = data
          this.totalNumber = res.data.data.totalCount
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning",
          });
        }
      });
    },
    // 概览信息配置
    overviewConfigure(){
      this.requestMethodGet('/web/config/serviceConfiguration/getServiceOverview',{}).then(res=>{
        if(res.data.code == 1000){
          let bgList = []
          let headList = []
          const data = res.data.data
          this.overviewForm = data
          this.backgroundImg = data.backgroundPathFullUrl
          this.headImg = data.headPathFullUrl
          if(data.backgroundPath){
            bgList.push({
              name:data.backgroundPath.split('/')[data.backgroundPath.split('/').length-1],
              url:data.backgroundPathFullUrl
            })
          }
          if(data.headPath){
            headList.push({
              name:data.headPath.split('/')[data.headPath.split('/').length-1],
              url:data.headPathFullUrl
            })
          }
          this.showBgBtn = bgList.length>0
          this.showHeadBtn = headList.length>0
          this.overviewForm.backgroundList = bgList
          this.overviewForm.headerImg = headList
          this.overviewShortDesc = this.overviewForm.shortDesc
          this.overviewTitle = this.overviewForm.name
          console.log('this.overviewForm',this.overviewForm)
          this.overviewDialogFlag = true
        }else{
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      })
    },
    // 上传背景图
    handleBackgroundChange(file, fileList){
      if (!file.raw.type.startsWith("image")) {
        this.overviewForm.backgroundList = [];
        this.$message.error("只能上传图片类型文件");
        return;
      }
      const size = file.size / 1024 / 1024 < 20;
      if (!size) {
        this.overviewForm.backgroundList = [];
        this.$message.error("上传图片大小不能超过 20MB!");
        return;
      }
      if (fileList.length) {
        let params = new FormData();
        params.append("fileType", "service_conf_img");
        params.append("multipartFiles", file.raw);
        this.requestMethodPost("/web/file/uploadFiles", params)
          .then((res) => {
            res = res.data;
            if (res.code == 1000) {
              const data = res.data[0];//上传完的半路径
              this.overviewForm.backgroundPath = data
              this.getFullCoverImgPath(data,file);
            } else {
              this.$message({
                message: res.msg,
                type: "warning",
              });
            }
          })
          .catch((res) => {});
      }
    },
    // 背景图获取全路径
    getFullCoverImgPath(path,file) {
      const params = {
        url: path,
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then((res) => {
        if (res.data.code == 1000) {
          this.overviewForm.backgroundList.push({
            name:file.name,
            url: res.data.data
          });
          this.showBgBtn = this.overviewForm.backgroundList.length>0
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning",
          });
        }
      });
    },
    // 删除背景图
    handleBackgroundRemove(){
      this.overviewForm.backgroundList = []
      this.overviewForm.backgroundPath = ''
      this.showBgBtn = this.overviewForm.backgroundList.length>0
    },
    // 上传头像 
    handleHeaderChange(file, fileList){
      if (!file.raw.type.startsWith("image")) {
        this.overviewForm.headerImg = [];
        this.$message.error("只能上传图片类型文件");
        return;
      }
      const size = file.size / 1024 / 1024 < 5;
      if (!size) {
        this.overviewForm.headerImg = [];
        this.$message.error("上传图片大小不能超过 5MB!");
        return;
      }
      if (fileList.length) {
        let params = new FormData();
        params.append("fileType", "service_conf_img");
        params.append("multipartFiles", file.raw);
        this.requestMethodPost("/web/file/uploadFiles", params)
          .then((res) => {
            res = res.data;
            if (res.code == 1000) {
              const data = res.data[0];//上传完的半路径
              this.overviewForm.headPath = data
              this.getFullHeadImgPath(data,file);
            } else {
              this.$message({
                message: res.msg,
                type: "warning",
              });
            }
          })
          .catch((res) => {});
      }
    },
    // 头像获取全路径
    getFullHeadImgPath(path,file) {
      const params = {
        url: path,
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then((res) => {
        if (res.data.code == 1000) {
          this.overviewForm.headerImg.push({
            name:file.name,
            url: res.data.data
          });
          this.showHeadBtn = this.overviewForm.headerImg.length>0
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning",
          });
        }
      });
    },
    // 删除头像
    handleHeaderRemove(){
      this.overviewForm.headerImg = []
      this.overviewForm.headPath = ''
      this.showHeadBtn = this.overviewForm.headerImg.length>0
    },
    // 取消概览信息配置
    cancelOverview(formName){
      this.$refs[formName].resetFields();
      this.overviewDialogFlag = false
    },
    // 保存概览信息配置
    saveOverview(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('this.overviewForm',this.overviewForm)
          this.requestMethodPost('/web/config/serviceConfiguration/updateServiceOverview',this.overviewForm).then(res=>{
            if(res.data.code == 1000){
              this.$message({
                type:'success',
                message:'保存成功'
              })
              this.cancelOverview(formName)
            }else{
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 查询
    queryService(){
      this.getServiceList(this.clickLevel2Id)
    },
    // 添加服务项
    addServiceItem(){
      this.$router.push({
        path:'/ServiceConfigure/AddServiceItem',
        query:{
          type:'add',
          parentId:this.clickLevel2Id,
          defaultStatus:this.defaultStatus
        }
      })
    },
    // 点击一级
    clickLevel1(val){
      this.level1List.forEach(item=>{
        if(item.id == val.id){
          item.isActive = true
        }else{
          item.isActive = false
        }
      })
      this.clickLevel1Id = val.id
      sessionStorage.setItem("clickLevel1Id", val.id)
      this.getLevel2Data(val.id);
    },
    // 点击二级
    clickLevel2(val){
      this.level2List.forEach(item=>{
        if(item.id == val.id){
          item.isActive = true
        }else{
          item.isActive = false
        }
      })
      this.clickLevel2Id = val.id
      sessionStorage.setItem("clickLevel2Id", val.id)
      this.defaultStatus = val.status
      this.getServiceList(val.id);
    },
    // 编辑
    edit(row){
      this.$router.push({
        path:'/ServiceConfigure/AddServiceItem',
        query:{
          type:'edit',
          rowId:row.id,
          parentId:row.parentId,
          defaultStatus:this.defaultStatus
        }
      })
    },
    // 排序
    sortRow(row){
      this.sortId = row.id
      this.sortForm.sortNumber = row.sort
      this.sortDialogVisible = true
    },
    // 失去焦点
    handleBlur(){
      
    },
    // 取消排序
    cancelSort(formName){
      this.$refs[formName].resetFields();
      this.sortDialogVisible = false
    },
    // 保存排序
    confirmSort(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id:this.sortId,
            sort:this.sortForm.sortNumber
          }
          this.requestMethodPost('/web/config/serviceConfiguration/updateSetSort',params).then(res=>{
            if(res.data.code == 1000){
              this.cancelSort(formName)
              this.getServiceList(this.clickLevel2Id)
            }else{
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 服务索引配置
    toIndexesConfigure(){
      this.$router.push({
        path:'/ServiceConfigure/ServiceIndexesConfigure'
      })
    },
    // 页数大小改变
    handleSizeChange(e){
      this.queryParams.size = e
      this.queryService()
    },
    // 页数改变
    handleCurrentChange(e){
      this.queryParams.current = e
      this.queryService()
    },
  },
}
</script>
<style lang="less" scoped>
  .main-content{
    display: flex;
    margin-top: 20px;
  }
  .left-menu{
    width: 417px;
    // height: 100%;
    border-top: 1px solid #e9e9e9;
    border-right: 1px solid #e9e9e9;
  }
  .menu-header{
    display: flex;
    align-items: center;
    height: 48px;
    background-color: #f9f9f9;
    padding-left: 20px;
    border-bottom: 1px solid #e9e9e9;
    .line{
      width: 4px;
      height: 14px;
      background: #dd0000;
      margin-right: 10px;
    }
  }
  .level-content{
    display: flex;
    // width: 100%;
    // height: 100%;
    // overflow: auto;
    height: 722px;
    overflow-y: scroll;
  }
  .second-level{
    width: 208px;
    // height: 100%;
    // border-right: 1px solid #e9e9e9;
  }
  .right-border{
    border-right: 1px solid #e9e9e9;
  }
  .service-line{
    display: inline-block;
    width: 1px;
    height: 1em;
    margin: 0;
    vertical-align: middle;
    position: relative;
    background-color:#e9e9e9
  }
  .level-item-content{
    display: flex;
    align-items: center;
    line-height: 56px;
    cursor: pointer;
  }
  .level-item-content:hover{
    background-color: rgba(0, 20, 80, 0.05);
  }
  .level-name{
    margin-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 20px;
  }
  .level-point{
    width:8px;
    height:8px;
    border-radius:50%;
    margin-left: 20px;
  }
  .third-level{
    width: 208px;
    // height: 100%;
  }
  .right-content{
    // width: 100%;
    height: 100%;
    border-top: 1px solid #e9e9e9;
  }
  .service-item{
    height: 48px;
  }
  .statistic-search{
    height: 32px;
    // width: 100%;
    display: flex;
    margin: 20px 0;
  }
  .left-statistic{
    display: flex;
    font-size: 14px;
    font-weight: bold;
    margin-left: 20px;
  }
  .statistic-items{
    display: flex;
    align-items: center;
    line-height: 32px;
  }
  .right-search{
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-right: 20px;
  }
  .service-item-table-content{
    overflow: auto;
    margin-left: 20px;
  }
  .pagination-content{
    width: 100%;
    background-color: #fff;
    height: 70px;
    position: fixed;
    bottom:0;
  }
  /deep/ .el-pagination{
    bottom: 20px;
  }
  .overview-content{
    display: flex;
    width: 100%;
    height: 100%;
  }
  .overview-content-left{
    position: relative;
    width: 485px;
  }
  .left-mini-img{
    position: absolute;
    width: 60px;
    height: 60px;
    z-index: 999;
    left: 20px;
    top: 90px;
    border-radius: 50%;
  }
  .left-word-content{
    position: absolute;
    color: #fff;
    top: 110px;
    left: 95px;
    font-weight: bold;
  }
  .word-content{
    font-size: 16px;
    position: absolute;
    top: 165px;
    margin: 0 20px;
    color: rgba(255,255,255,0.6);
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  /deep/ .el-dialog__body{
    padding: 30px 20px 10px 20px;
  }
  /deep/ .el-divider--horizontal{
    margin: 10px 0;
  }
  .overview-content-right{
    // width: 50%;
    flex: 1;
  }
/deep/ .el-upload-list__item-status-label{
  display: block;
}
 /deep/ .el-upload-list{
   width: 300px;
 } 
</style>
