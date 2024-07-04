<template>
  <div>
    <el-dialog title="配置服务的行业" :visible.sync="visible" width="650px" :before-close="beforeClose" v-loading="dialogLoading">
      <div>
        <el-form ref="serviceIndustryForm" :model="serviceIndustryForm">
          <div class="IndustryFormBox" ref="IndustryFormBox">
            <el-form-item v-for="(domain, index) in serviceIndustryForm.siList" :key="domain.key" :prop="'siList.' + index + '.industryName'" :rules="{ validator: writeIndustry, trigger: 'blur' }">
              <el-input v-model="domain.industryName" placeholder="请输入" size="small" :maxlength="10" style="max-width: 60%;" clearable></el-input>
              <el-button type="text" @click.prevent="relatedCustomers(domain)" :disabled="domain.industryName == ''">关联客户行业</el-button>
              <el-button :disabled="index == 0" type="text" @click.prevent="moveUp(index)">上移</el-button>
              <el-button :disabled="index == serviceIndustryForm.siList.length - 1" type="text" @click.prevent="moveDown(index)">下移</el-button>
              <el-button v-if="serviceIndustryForm.siList.length > 1" type="text" @click.prevent="removeDomain(domain)">删除</el-button>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="text" icon="el-icon-plus" @click.prevent="addIndustryItem">继续添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClose" size="mini">取 消</el-button>
        <el-button type="danger" @click="handlerSave" size="mini">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="关联客户行业" :visible="customersVisible" width="822px" :before-close="customersBeforeClose">
      <div>
        <p style="font-size: 16px;margin: 0 0 20px;">
          当前服务的行业：<span style="color:#dd0000 ;">{{ customData.industryName }}</span>
        </p>
        <el-transfer
          ref="customTransfer"
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入客户行业"
          :titles="['所有客户行业', '已关联客户行业']"
          v-model="customData.children"
          :data="transferData"
          :props="{ key: 'code', label: 'label', disabled: 'dis' }"
        ></el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="customersBeforeClose" size="mini">取 消</el-button>
        <el-button type="danger" @click="handlerCustomerSave" size="mini">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCusIndustryList, saveServiceIndustry, deleteIndustryCheck } from '@/api/serviceConfigure/index'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    siData: Array
  },
  data () {
    const filterMethod = function (query, item) {
      return item.label.indexOf(query) > -1
    }
    const generateKey = function (keyLength = 12) {
      let rlt = ''
      for (let i = 0; i < keyLength; i++) {
        if (Math.round(Math.random())) {
          rlt += Math.ceil(Math.random() * 9)
        } else {
          const ranNum = Math.ceil(Math.random() * 23)
          if (Math.round(Math.random())) {
            rlt += String.fromCharCode(65 + ranNum)
          } else {
            rlt += String.fromCharCode(97 + ranNum)
          }
        }
      }
      return rlt
    }
    return {
      generateKey,
      serviceIndustryForm: {
        siList: [{ idx: generateKey(), industryName: '', children: [] }]
      },
      customersVisible: false,
      customData: {},
      filterMethod,
      transferData: [],
      deleteIds: [],
      dialogLoading: false
    }
  },
  computed: {
    writeIndustry () {
      let that = this
      return function (rule, value, callback) {
        if (value === '') {
          callback(new Error('请输入'))
        } else if (that.serviceIndustryForm.siList.filter(i => i.industryName === value).length > 1) {
          callback(new Error('名称已存在，请重新填写'))
        } else {
          callback()
        }
      }
    }
  },
  watch: {
    siData: {
      handler (val) {
        this.initServiceIndustry()
      },
      deep: true
    }
  },
  created () {
    this.getCusIndustryListMet()
  },
  mounted () {
    this.initServiceIndustry()
  },
  methods: {
    // 加载配置服务行业列表
    initServiceIndustry () {
      this.$nextTick(() => {
        if (this.siData.length > 0) {
          this.serviceIndustryForm.siList = []
          this.siData.map(item => {
            let obj = {
              idx: item.id,
              industryName: item.name,
              children: item.cusIndustryCodes ? item.cusIndustryCodes : []
            }
            this.serviceIndustryForm.siList.push(obj)
          })
        } else {
          this.serviceIndustryForm.siList = [{ idx: this.generateKey(), industryName: '', children: [] }]
        }
      })
    },
    // 获取客户行业列表
    getCusIndustryListMet () {
      getCusIndustryList().then((res) => {
        if (res.data.code === 1000) {
          res.data.data.map(item => {
            let obj = {
              code: item.code,
              label: item.parentName + '/' + item.name,
              dis: false
            }
            this.transferData.push(obj)
          })
        }
      }).catch((err) => { console.log(err) })
    },
    // 取消
    beforeClose () {
      this.initServiceIndustry()
      this.deleteIds = []
      this.$emit('close')
    },
    // 删除
    removeDomain (val) {
      this.$confirm('是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogLoading = true
        deleteIndustryCheck({id: val.idx}).then((res) => {
          if (res.data.code === 1000) {
            if (res.data.data.isPassed) {
              this.serviceIndustryForm.siList.map((item, i) => {
                if (val.idx === item.idx) {
                  this.serviceIndustryForm.siList.splice(i, 1)
                  // this.$refs.serviceIndustryForm.validate()
                }
              })
            } else {
              this.$message.error('该服务的行业已有服务项关联，无法删除')
            }
          } else {
            this.$message.warning('删除失败！')
          }
          this.dialogLoading = false
        }).catch((err) => { console.log(err); this.dialogLoading = false })
      }).catch(() => {})
    },
    // 上移
    moveUp (index) {
      if (this.serviceIndustryForm.siList.length > 1 && index !== 0) {
        let newArr = this.swapItems(this.serviceIndustryForm.siList, index, index - 1)
        this.serviceIndustryForm.siList = newArr
      }
    },
    // 下移
    moveDown (index) {
      if (this.serviceIndustryForm.siList.length > 1 && index !== this.serviceIndustryForm.siList.length - 1) {
        let newArr = this.swapItems(this.serviceIndustryForm.siList, index, index + 1)
        this.serviceIndustryForm.siList = newArr
      }
    },
    swapItems (arr, index1, index2) {
    　　arr[index1] = arr.splice(index2,1,arr[index1])[0]
    　　return arr
    },
    // 继续添加
    addIndustryItem () {
      this.serviceIndustryForm.siList.push({ idx: this.generateKey(), industryName: '', children: [] })
      this.$nextTick(() => {
        this.$refs.IndustryFormBox.scrollTop = this.$refs.IndustryFormBox.scrollHeight
      })
    },
    // 保存
    handlerSave () {
      this.$refs.serviceIndustryForm.validate(valid => {
        if (valid) {
          let list = []
          this.serviceIndustryForm.siList.map((item, i) => {
            list.push({
              cusIndustryCodes: item.children,
              id: item.idx,
              name: item.industryName,
              sort:i
            })
          })
          this.siData.map((item) => {
            if (list.filter(i => i.id === item.id).length === 0 && this.deleteIds.indexOf(item.id) === -1) {
              this.deleteIds.push(item.id)
            }
          })
          let data = {
            serviceIndustryList: list,
            deleteIds: this.deleteIds
          }
          saveServiceIndustry(data).then((res) => {
            if (res.data.code === 1000) {
              this.$message.success('保存成功')
              this.$parent.$parent.getServiceIndustryMet()
              this.beforeClose()
            } else {
              this.$message.error('保存失败')
            }
          }).catch((err) => { console.log(err) })
        }
      })
    },
    // 关联客户行业
    relatedCustomers (val) {
      this.$nextTick(() => {
        this.customData = val
        this.customersVisible = true
      })
    },
    // 关联客户行业保存
    handlerCustomerSave () {
      this.serviceIndustryForm.siList.map(item => {
        if (item.idx === this.customData.idx) {
          item.children = this.customData.children
        }
      })
      this.customersBeforeClose()
    },
    // 关闭关联客户行业弹窗
    customersBeforeClose () {
      const tr = this.$refs.customTransfer
      if (tr) {
        tr.$children[0].query = ''
        tr.$children[0].checked = []
        tr.$children[3].query = ''
        tr.$children[3].checked = []
      }
      this.customersVisible = false
    }
  }
}
</script>
<style>
.IndustryFormBox {
  max-height: 45vh;
  overflow-y: auto;
}
</style>
