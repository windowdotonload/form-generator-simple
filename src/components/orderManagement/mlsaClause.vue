<!--
* @description 账号管理
* @fileName accountManagement.vue
* @author vvx
* @date 2020/05/15 15:30:23
* @version V1.0.0
!-->
<template>
  <div class="main-box" :style="mainminheight">
    <div class="editor">
      <quill-editor class="editor" ref="myTextEditor" v-model="content" :options="editorOption" @focus="onEditorFocus($event)"> </quill-editor>
      <div class="mask" v-show="isReadyOnly"></div>
    </div>

    <el-button type="danger" plain @click="handleEdit" size="small" v-has="mlsaClauseEditBtn" style="margin-top:30px" v-if="isReadyOnly">编辑</el-button>
    <div style="margin-top:30px" v-else>
      <el-button type="danger" @click="handleSubmit" size="small" v-has="mlsaClauseEditBtn" :loading="loading">提交</el-button>
      <el-button type="danger" plain @click="isReadyOnly = true" size="small">取消</el-button>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'
export default {
  data () {
    return {
      content: '',
      clauseNumber: null,
      loading: false,
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
            ['blockquote', 'code-block'], // 引用  代码块
            [{ header: 1 }, { header: 2 }], // 1、2 级标题
            [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
            [{ script: 'sub' }, { script: 'super' }], // 上标/下标
            [{ indent: '-1' }, { indent: '+1' }], // 缩进
            [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
            [{ font: [] }], // 字体种类
            [{ align: [] }], // 对齐方式
            ['clean'], // 清除文本格式
            ['link', 'image', 'video'] // 链接、图片、视频
          ] // 工具菜单栏配置
        },
        placeholder: '请在这里添加产品描述', // 提示
        readyOnly: false, // 是否只读
        theme: 'snow', // 主题 snow/bubble
        syntax: true // 语法检测
      },
      isReadyOnly: true,
      mainminheight: `max-height:${document.documentElement.clientHeight - 160}px`
    }
  },

  created () {
    let param = {}
    if (this.$route.path == '/MslaB2BClause') {
      param.clauseCode = 'device_lubes_clause'
    } else {
      param = {}
    }
    this.requestMethodGet('/web/clause/getClause', param)
      .then(res => {
        res = res.data
        if (res.code == 1000) {
          this.content = res.data.content
          this.clauseNumber = res.data.clauseNumber
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
      .catch(res => {
        this.loading = false
      })
  },

  methods: {
    onResize () {
      this.mainminheight = `max-height:${document.documentElement.clientHeight - 160}px`
    },
    handleEdit () {
      this.isReadyOnly = false
    },
    // 值发生变化
    onEditorFocus (event) {
      if (this.isReadyOnly) {
        event.enable(false)
      } else {
        event.enable(true)
      }
    },
    handleSubmit () {
      let param = {
        clauseNumber: this.clauseNumber,
        content: this.content
      }
      this.loading = true
      this.requestMethodPost('/web/clause/upadteClause', param)
        .then(res => {
          res = res.data
          this.loading = false
          if (res.code == 1000) {
            this.isReadyOnly = true
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch(res => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="less">
.main-box {
  height: 100%;
  margin: 30px;
  overflow: auto;
  .editor {
    position: relative;
  }
  .ql-container.ql-snow {
    height: 600px;
  }
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    height: 642px;
    box-sizing: border-box;
    width: 100%;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
