webpackJsonp([12],{QL8z:function(e,t){},eNGU:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=i("Xxa5"),n=i.n(l),a=i("exGp"),r=i.n(a),s=i("efop"),o={model:{prop:"propFileList",event:"changeFileList"},props:{accept:{type:String,default:".jpg,.png,.jpeg"},propFileList:{type:Array,default:[]},multiple:{type:Boolean,default:!1},fileType:{type:String,default:""},width:{type:[String,Number],default:100},height:{type:[String,Number],default:100},limit:{type:Number,default:3},fileSizeLimit:{type:Number,default:10},amplify:{type:Boolean,default:!0},readOnly:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},downloadable:{type:Boolean,default:!1}},watch:{propFileList:{handler:function(){this.initPropFileList(!1)}}},created:function(){var e=this;return r()(n.a.mark(function t(){return n.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e.initPropFileList();case 1:case"end":return t.stop()}},t,e)}))()},beforeDestroy:function(){this.clearAsset()},data:function(){return{loadingAssets:!1,fileList:[],previewSrcList:[]}},methods:{initPropFileList:function(){var e=this,t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];return r()(n.a.mark(function i(){var l;return n.a.wrap(function(i){for(;;)switch(i.prev=i.next){case 0:if(e.propFileList&&0!=e.propFileList.length){i.next=2;break}return i.abrupt("return",e.clearAsset());case 2:return i.prev=2,e.loadingAssets=!0,i.next=6,Object(s.b)(e.propFileList);case 6:l=i.sent,e.fileList=l,e.previewSrcList=e.fileList.map(function(e){return e.url}),t&&e.$emit("changeFileList",e.fileList);case 10:return i.prev=10,e.loadingAssets=!1,i.finish(10);case 13:case"end":return i.stop()}},i,e,[[2,,10,13]])}))()},downloadImg:function(e){var t=document.createElement("a");t.href=e.url,t.download=e.name,t.click(),setTimeout(function(){t=null},800)},ossUpload:function(e){var t=this;return r()(n.a.mark(function i(){var l,a,r,o;return n.a.wrap(function(i){for(;;)switch(i.prev=i.next){case 0:if(l=e.file.name.split(".")[e.file.name.split(".").length-1].toLowerCase(),t.accept.split(",").some(function(e){return e.includes(l)})){i.next=4;break}return i.abrupt("return",t.$message({type:"warning",message:"请选择 "+t.accept+" 格式的文件"}));case 4:if(e.file.size/1024/1024<t.fileSizeLimit){i.next=9;break}return t.$message({type:"error",message:"请选择"+t.fileSizeLimit+"M以内的文件"}),t.$refs.uploadImg.abort(),i.abrupt("return");case 9:return i.prev=9,a=window.URL.createObjectURL(e.file),r={name:e.file.name,url:a,halfPath:"",_uid:(new Date).getTime(),__fileraw:e},t.fileList.push(r),t.previewSrcList=t.fileList.map(function(e){return e.url}),i.next=16,Object(s.c)(e.file,e.file.name,t.fileType);case 16:o=i.sent,r.halfPath=o.name,t.$emit("changeFileList",t.fileList),i.next=24;break;case 21:i.prev=21,i.t0=i.catch(9),console.log("ERR",i.t0);case 24:case"end":return i.stop()}},i,t,[[9,21]])}))()},amplifyImg:function(){document.querySelector(".el-image__inner").click()},deleteItemImg:function(e){var t=this.fileList.findIndex(function(t){return t._uid==e._uid});this.fileList.splice(t,1),this.previewSrcList=this.fileList.map(function(e){return e.url}),this.$emit("changeFileList",this.fileList)},clearAsset:function(){this.fileList=[],this.previewSrcList=[]}}},c=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loadingAssets,expression:"loadingAssets"}],staticClass:"uploadImg-contaienr"},[e._l(e.fileList,function(t){return i("div",{key:t.url,staticClass:"uploadImg-file-list"},[i("div",{staticClass:"uploadImg-file-list-item",style:{width:e.width+"px",height:e.height+"px"}},[i("el-image",{ref:"elImg",refInFor:!0,staticStyle:{"border-radius":"8px"},style:{width:e.width+"px",height:e.height+"px"},attrs:{src:t.url,"preview-src-list":e.previewSrcList}}),e._v(" "),i("div",{staticClass:"uploadImg-file-list-item-mask"},[e.amplify?i("i",{staticClass:"el-icon-zoom-in img-icon",on:{click:e.amplifyImg}}):e._e(),e._v(" "),e.downloadable?i("i",{staticClass:"el-icon-download img-icon",staticStyle:{"margin-left":"10px"},on:{click:function(i){return e.downloadImg(t)}}}):e._e(),e._v(" "),e.readOnly?e._e():i("i",{staticClass:"el-icon-delete img-icon",staticStyle:{"margin-left":"20%"},on:{click:function(i){return e.deleteItemImg(t)}}})])],1)])}),e._v(" "),e.readOnly?e._e():i("el-upload",{ref:"uploadImg",attrs:{accept:e.accept,multiple:e.multiple,"file-list":e.fileList,action:"",limit:e.limit,"http-request":e.ossUpload,"show-file-list":!1,disabled:e.disabled},scopedSlots:e._u([{key:"trigger",fn:function(){return[i("div",{directives:[{name:"show",rawName:"v-show",value:e.fileList.length<e.limit,expression:"fileList.length < limit"}],staticClass:"el-upload el-upload--picture-card custome-upload-box",style:{cursor:e.disabled?"not-allowed":"pointer"}},[i("i",{staticClass:"el-icon-plus"})])]},proxy:!0}],null,!1,824235513)})],2)};c._withStripped=!0;var u={render:c,staticRenderFns:[]},p=u;var f=!1;var d=i("VU/8")(o,p,!1,function(e){f||i("QL8z")},"data-v-48823209",null);d.options.__file="src/generalComponents/OSSUpload/uploadImg.vue";t.default=d.exports}});