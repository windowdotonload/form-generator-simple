<!--PES档案详情-->
<template>
  <div style="position: relative;">
    <div class="detail-wrap" :style="mainminheight">
        <div class="right-content" style="margin-top:20px">
            <div class="line"></div>
            <div class="right-title">目标及结果</div>
        </div>
        <!-- 计划目标1 -->
        <div style="padding:24px 20px;">
            <el-form :model="YearReportQueryDto" :rules="rules" ref="YearReportQueryDto" label-width="220px" label-position="right">
              <div v-for="(item, index) in YearReportQueryDto.list" :key="index">
                <div class="plan-item">
                    <span class="plan-items-title">{{item.type== '1' ? '计划目标' : '新增目标'}}
                      <span v-if="item.type== '1'" style="color:#dd0000;">{{index+1}}</span>
                      <span v-if="item.type== '2'" style="color:#dd0000;">{{index-planNum+1}}</span>
                      ：</span>
                    <span style="color:#666;">{{item.content}}</span>
                </div>
                <el-form-item label="状态" prop="status" style="margin-top:34px;" v-if="item.status =='1'">
                    <span>已完成</span>
                </el-form-item>
                <el-form-item label="状态" :prop="'list.' + index + '.status'"
                :rules="[
                  { required: true, message: '请选择状态', trigger: 'blur' },
                  ,{pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
                ]"
                style="margin-top:34px;" v-if="item.status !='1'">
                    <el-select   size="small" style="width:220px;margin-right:20px;" v-model="item.status"
                    @change="(value) => changeStatus(item, value)"
                    placeholder="请选择">
                        <el-option
                        v-for="item1 in options"
                        :key="item1.value"
                        :label="item1.label"
                        :value="item1.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="item.status !='1'"
                :label="item.status =='2' ? '完成进度说明' : item.status =='3' ?'取消原因说明' :'完成进度说明'"
                :rules="[
                    { required: true, message: '请输入说明', trigger: 'blur' }
                  ]"
                  :prop="'list.' + index + '.yearProgressDesc'"  style="margin-top:34px;">
                    <el-input
                    type="textarea"
                    style="width:640px;margin-right:20px;"
                    placeholder="请输入内容"
                    maxlength="500"
                    :autosize="{ minRows: 2, maxRows: 6}"
                    show-word-limit
                    v-model="item.yearProgressDesc">
                    </el-input>
                </el-form-item>
                <div v-if="item.status !='3'">
                  <div class="right-title"  style="font-size:14px;">产生效益</div>
                    <el-form-item label="安全" :prop="'list.' + index + '.yearSafe'"
                    :rules="[
                      { required: true, message: '请输入安全字段', trigger: 'blur' },
                      ,{pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
                    ]"
                    style="margin-top:34px;">
                        <el-input size="small"
                        @keyup.native="proving(index,'safe',item)"
                        style="width:380px;margin-right:20px;" maxlength="15" v-model="item.yearSafe"></el-input>小时
                        <div class="notice">减少设备维护人员与设备的接触时间（小时）</div>
                    </el-form-item>
                    <el-form-item>
                      <div slot="label" style="display:flex;align-items:center;justify-content: flex-end;">
                        <div style="color:#F56C6C;margin-right:4px">*</div>
                        <div>环保</div>
                      </div>
                    </el-form-item>


                    <el-form-item label="减少废润滑油的产生和处置" :prop="'list.' + index + '.yearEnvironment'"
                    :rules="[
                      { required: true, message: '请输入减少废润滑油的产生和处置', trigger: 'blur' },
                      ,{pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
                    ]"
                    style="margin-top:34px;">
                        <el-input size="small"
                        @keyup.native="proving(index,'environment',item)"
                        style="width:380px;margin-right:20px;" maxlength="15" v-model="item.yearEnvironment"></el-input>升
                        <div class="notice">减少废润滑油的产生和处置（升）</div>
                    </el-form-item>


                    <el-form-item label="减少CO2排放情况" :prop="'list.' + index + '.effectEnvironmentCo2Flag'"
                    :rules="[{ required: true, message: '请选择减少CO2排放情况', trigger: 'change' }]" >
                      <el-radio-group v-model="item.effectEnvironmentCo2Flag">
                        <el-radio :label="true">有</el-radio>
                        <el-radio :label="false">无</el-radio>
                      </el-radio-group>
                    </el-form-item>


                    <el-form-item label="减少CO2排放" :prop="'list.' + index + '.effectEnvironmentCo2Num'"
                    :rules="[
                      { required: true, message: '请输入减少CO2排放', trigger: 'blur' },
                      ,
                      { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
                    ]"
                    v-if="item.effectEnvironmentCo2Flag"
                    style="margin-top:34px;">
                      <el-input
                        size="small"
                        maxlength="15"
                        style="width: 380px; margin-right: 20px"
                        placeholder="请输入减少CO2排放"
                        @keyup.native="proving(index, 'co2Num',item)"
                        v-model="item.effectEnvironmentCo2Num"
                      ></el-input
                      >吨
                    </el-form-item>


                    <el-form-item label="高效"
                    :rules="[
                      { required: true, message: '请输入高效字段', trigger: 'blur' },
                      ,{pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
                    ]"
                    :prop="'list.' + index + '.yearEfficiency'"  style="margin-top:34px;">
                        <el-input size="small" maxlength="15"
                        @keyup.native="proving(index,'efficiency',item)"
                        style="width:380px;margin-right:20px;" v-model="item.yearEfficiency"></el-input>万元
                        <div class="notice">降低设备维护成本和非计划停机损失，增加效益</div>
                    </el-form-item>
                  </div>
                </div>

            </el-form>
            <div>
            </div>
        </div>
        <!-- 其他信息 -->
        <div class="right-content" style="margin-top:20px">
            <div class="line"></div>
            <div class="right-title">其它信息</div>
        </div>
        <div style="padding:24px 20px">
            <el-form :model="planReportOtherInfoDto" :rules="rules" ref="planReportOtherInfoDto" label-width="120px" label-position="right">
                <el-form-item label="客户领导" prop="name">
                    <span style="margin-left:20px;">{{planReportOtherInfoDto.customerLeader}}</span>
                </el-form-item>
                <el-form-item label="客户工程师" prop="name">
                    <span style="margin-left:20px;">{{planReportOtherInfoDto.customerEngineer}}</span>
                </el-form-item>
                <el-form-item label="大区销售总监" prop="name" v-if="serviceCompanyType=='0'">
                    <span style="margin-left:20px;">{{planReportOtherInfoDto.dqxszjValue}}</span>
                </el-form-item>
                <el-form-item label="区域销售经理" prop="name" v-if="serviceCompanyType=='0'">
                    <span style="margin-left:20px;">{{planReportOtherInfoDto.qyxsjlValue}}</span>
                </el-form-item>
                <el-form-item label="区域技术经理" prop="name" v-if="serviceCompanyType=='0'">
                    <span style="margin-left:20px;">{{planReportOtherInfoDto.qyjsjlValue}}</span>
                </el-form-item>
                <el-form-item label="经销商名称" prop="name" v-if="serviceCompanyType=='1'">
                    <span style="margin-left:20px;">{{planReportOtherInfoDto.jxsmcValue}}</span>
                </el-form-item>
                <el-form-item label="销售经理" prop="name" v-if="serviceCompanyType=='1'">
                    <span style="margin-left:20px;">{{planReportOtherInfoDto.xsjlValue}}</span>
                </el-form-item>
                <el-form-item label="服务工程师" prop="name" v-if="serviceCompanyType=='1'">
                    <span style="margin-left:20px;">{{planReportOtherInfoDto.fwgcsValue}}</span>
                </el-form-item>
            </el-form>
        </div>
        </div>
        <div class="foot-botton">
            <el-button type="danger" plain :disabled="disabledPreview" @click="previewReport" size="small">预览报告</el-button>
            <el-button type="danger"   plain @click="saveInfoPublish('draft')" size="small">保存草稿</el-button>
            <el-button type="danger" v-if="summaryStatus !='4'" @click="saveInfoPublish('publish')" size="small">保存并发布</el-button>
            <el-button type="danger"  plain @click="cancleEditInfo" size="small">取消</el-button>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 200}px`,
      summaryStatus: '',
      planNum: 0,
      disabledPreview: true,  // 预览按钮是否可以点击
      YearReportQueryDto: {
        list: [
          {
            status: '',
            type: '1',
            yearEfficiency: '', // 高效
            yearEnvironment: '', // 环保
            effectEnvironmentCo2Flag:true,
            effectEnvironmentCo2Num:'',
            yearProgressDesc: '', // 完成进度说明
            yearSafe: '' // 安全
          }
        ]
      },
      planReportOtherInfoDto: {},
      pesId: '',
      options: [
        {label: '未开始', value: 0},
        {label: '进行中', value:2},
        {label: '取消', value: 3}
      ],
      serviceCompanyType: '',
      serviceData: [],
      planServicedData: [],
      textarea: '',
      reportId: ''
    }
  },
  created () {
    this.pesId = this.$route.query.pesId
    this.serviceCompanyType = this.$route.query.serviceCompanyType
    this.summaryStatus = this.$route.query.summaryStatus
    this.distributorCompanyType = this.$route.query.distributorCompanyType
  },
  mounted () {
    this.getPlanReport()
    window.onresize = () => {
      return (() => {
        this.mainminheight = `height:${document.documentElement.clientHeight - 200}px`
      })()
    }
  },
  methods: {
    proving (index, val, item) {
      if (val == 'safe') {
        item.yearSafe = item.yearSafe.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
        item.yearSafe = item.yearSafe.replace(/^\./g, '') // 验证第一个字符是数字而不是.
        item.yearSafe = item.yearSafe.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的.
        item.yearSafe = item.yearSafe.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.') // 只允许输入一个小数点
        item.yearSafe = item.yearSafe.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入3个小数
        item.yearSafe = item.yearSafe.replace(/(\d+|\.)-/g, '$1') // 数字和.后面不能接-,不能出现类似11-, 12.-
        item.yearSafe = item.yearSafe.replace(/(-)0+(\d+)/g, '$1$2') // 不能出现-01,-02类似
        item.yearSafe = item.yearSafe.replace(/^0+(\d)/, '$1') // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
      if (val == 'efficiency') {
        item.yearEfficiency = item.yearEfficiency.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
        item.yearEfficiency = item.yearEfficiency.replace(/^\./g, '') // 验证第一个字符是数字而不是.
        item.yearEfficiency = item.yearEfficiency.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的.
        item.yearEfficiency = item.yearEfficiency.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.') // 只允许输入一个小数点
        item.yearEfficiency = item.yearEfficiency.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入3个小数
        item.yearEfficiency = item.yearEfficiency.replace(/(\d+|\.)-/g, '$1') // 数字和.后面不能接-,不能出现类似11-, 12.-
        item.yearEfficiency = item.yearEfficiency.replace(/(-)0+(\d+)/g, '$1$2') // 不能出现-01,-02类似
        item.yearEfficiency = item.yearEfficiency.replace(/^0+(\d)/, '$1') // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
        if(item.yearEfficiency > 100) {
          item.yearEfficiency = 100
        }
      }
      if (val == 'environment') {
        item.yearEnvironment = item.yearEnvironment.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
        item.yearEnvironment = item.yearEnvironment.replace(/^\./g, '') // 验证第一个字符是数字而不是.
        item.yearEnvironment = item.yearEnvironment.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的.
        item.yearEnvironment = item.yearEnvironment.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.') // 只允许输入一个小数点
        item.yearEnvironment = item.yearEnvironment.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入3个小数
        item.yearEnvironment = item.yearEnvironment.replace(/(\d+|\.)-/g, '$1') // 数字和.后面不能接-,不能出现类似11-, 12.-
        item.yearEnvironment = item.yearEnvironment.replace(/(-)0+(\d+)/g, '$1$2') // 不能出现-01,-02类似
        item.yearEnvironment = item.yearEnvironment.replace(/^0+(\d)/, '$1') // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
      if (val == "co2Num") {
        item.effectEnvironmentCo2Num = item.effectEnvironmentCo2Num.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        item.effectEnvironmentCo2Num = item.effectEnvironmentCo2Num.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        item.effectEnvironmentCo2Num = item.effectEnvironmentCo2Num.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        item.effectEnvironmentCo2Num = item.effectEnvironmentCo2Num
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", "."); // 只允许输入一个小数点
        item.effectEnvironmentCo2Num = item.effectEnvironmentCo2Num.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        item.effectEnvironmentCo2Num = item.effectEnvironmentCo2Num.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        item.effectEnvironmentCo2Num = item.effectEnvironmentCo2Num.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        item.effectEnvironmentCo2Num = item.effectEnvironmentCo2Num.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
    },
    rowKey (row) {
      return row.id
    },
    handleResetSelect () {
      this.selectServiceVisiable = false
    },
    changeStatus (item, val) {
      if (val) {
        item.yearProgressDesc = ''
      }
    },
    // 点击预览报告按钮
    previewReport() {
      const params = {
        pesInfoId: this.pesId
      };
      this.requestMethodGet("/pes/report/queryYearReportPath", params).then(res => {
        if (res.data.code == 1000) {
          if (res.data.data.status == "2" ) {
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
    // 保存草稿
    saveInfoDraft (val) {
      let parmas = {
        list: this.YearReportQueryDto.list,
        pesInfoId: this.pesId,
        publishFlag: val == 'publish',
        reportId: this.reportId
      }
      this.requestMethodPost('/pes/report/saveYearReport', parmas).then((res) => {
        if (res.data.code == 1000) {
          if(res.data.data.status!=null) {
            this.disabledPreview = false;
          }
          if (res.data.data) {
            this.reportId = res.data.data
          }
          this.getPlanReport()
          if (val == 'publish') {
            this.$message({
              message: '发布成功',
              type: 'success'
            })
            this.$router.push({
              path: '/CustomerProfile/CustomerPesIndex',
              query: {
                companyNumber: this.$route.query.companyNumber,
                companyId: this.$route.query.companyId,
                resource: 'plan',
                pesId: this.pesId
              }
            })
          } else {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    saveInfoPublish (val) {
      if (val == 'draft') {
        this.saveInfoDraft(val)
        this.$gio.saveDraftOfArchiveReport({reportType: '年度总结',customer:this.$route.query.companyNumber})
      } else {
        this.$refs['YearReportQueryDto'].validate((valid) => {
          if (valid) {
            this.saveInfoDraft(val)
          }
        })
        this.$gio.publishArchiveReport({reportType: '年度总结',customer:this.$route.query.companyNumber})
      }
    },
    // 查询年度总结
    getPlanReport () {
      this.requestMethodGet('/pes/report/queryYearReport', { pesInfoId: this.pesId}).then((res) => {
        if (res.data.code == 1000) {
          this.disabledPreview = false;
          this.reportId = res.data.data.reportId
          this.YearReportQueryDto.list = res.data.data.list
          this.YearReportQueryDto.list.forEach(it=>{
            console.log(it.effectEnvironmentCo2Flag)
            if((it.effectEnvironmentCo2Flag==null || it.effectEnvironmentCo2Flag=='' || it.effectEnvironmentCo2Flag==undefined) && it.effectEnvironmentCo2Flag!=false) {
              console.log(12222)
              it.effectEnvironmentCo2Flag = true
            }
          })
          let index = this.YearReportQueryDto.list.findIndex((value) => value.type == '2')
          if (index != -1) {
            this.planNum = index
          }
          this.planReportOtherInfoDto = res.data.data.planReportOtherInfoDto
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    // 取消
    cancleEditInfo () {
      this.$confirm('取消后将丢失本次编辑内容', '取消编辑', {
        cancelButtonText: '继续编辑',
        confirmButtonText: '确定',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(() => {
          this.$router.push({
            path: '/CustomerProfile/CustomerPesIndex',
            query: {
              companyNumber: this.$route.query.companyNumber,
              companyId: this.$route.query.companyId,
              resource: 'plan',
              pesId: this.pesId
            }
          })
        this.$gio.cancelCreateArchiveReport({operation: '弹窗中点击确定', reportType: '年度总结',customer:this.$route.query.companyNumber})
        })
        .catch(() => {
        this.$gio.cancelCreateArchiveReport({operation: '弹窗中点击继续编辑', reportType: '年度总结',customer:this.$route.query.companyNumber})
        })
        this.$gio.cancelCreateArchiveReport({operation: '点击取消按钮', reportType: '年度总结',customer:this.$route.query.companyNumber})
    }
  }
}
</script>
<style lang='less' scoped>
.detail-wrap {
    padding: 20px;
    height: 100%;
    position: relative;
    overflow: auto;
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
  padding:0 20px;
}
.line {
  width: 4px;
  height: 14px;
  background-color: #dd0000;
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
.notice {
    font-size: 12px;
    line-height: 12px;
    color: #999;
    margin-top: 4px;
  }
.plan-item{
    padding:12px 20px;
    background:rgba(204,221,255,0.2);
    border:1px solid #ccddff;
    border-radius:4px;
    font-size:13px;
    margin-bottom:20px;
}
.plan-items-title {
  font-weight: 700;
  font-size: 14px;
  line-height: 14px;
  color: #dd0000;
  margin-bottom: 20px;
}
.foot-botton {
    width: 100%;
    background-color: #fff;
    height: 50px;
    padding: 0 20px;
    position: fixed;
    bottom:0;
}
</style>
