webpackJsonp([15],{"4fvB":function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i("Xxa5"),a=i.n(n),s=i("exGp"),l=i.n(s),r=i("efop"),c={props:{fileList:{type:Array,default:[]},previewAble:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1}},methods:{deleteFileListItem:function(e){this.$emit("deleteFileListItem",e)},previewItem:function(e){var t=this;return l()(a.a.mark(function i(){var n;return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Object(r.a)(e.halfPath);case 2:n=t.sent,window.open(n.data.data,"_blank");case 4:case"end":return t.stop()}},i,t)}))()}}},o=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"file-list-container"},e._l(e.fileList,function(t){return i("div",{key:t._uid,staticClass:"file-list-item"},[i("span",[i("i",{staticClass:"el-icon-document",staticStyle:{"margin-right":"8px"}}),e._v("\n      "+e._s(t.name)+"\n    ")]),e._v(" "),i("span",[e.previewAble?i("i",{staticClass:"el-icon-view",staticStyle:{"margin-right":"10px"},on:{click:function(i){return e.previewItem(t)}}}):e._e(),e._v(" "),i("i",{staticClass:"el-icon-circle-close",on:{click:e.deleteFileListItem}})])])}),0)};o._withStripped=!0;var p={render:o,staticRenderFns:[]},u=p;var d=!1;var f=i("VU/8")(c,u,!1,function(e){d||i("pKsQ")},"data-v-5648c984",null);f.options.__file="src/generalComponents/OSSUpload/UploadFileList.vue";t.default=f.exports},pKsQ:function(e,t){}});