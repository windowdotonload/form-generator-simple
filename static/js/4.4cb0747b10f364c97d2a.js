webpackJsonp([4,1],{"/UC7":function(e,t){},"1qSz":function(e,t){},"2uvC":function(e,t){},"32Xp":function(e,t){},"AX/5":function(e,t){},BSY7:function(e,t){},M93x:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={name:"App",components:{FormCreate:n("dgLM").default}},o=function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("FormCreate")],1)};o._withStripped=!0;var i={render:o,staticRenderFns:[]},a=i;var c=!1;var s=n("VU/8")(r,a,!1,function(e){c||n("1qSz")},null,null);s.options.__file="src/App.vue";t.default=s.exports},OpHK:function(e,t){},ZXzy:function(e,t){},ahI2:function(e,t){},cwkp:function(e,t){},dgLM:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n("d7EF"),o=n.n(r),i=n("W3Iv"),a=n.n(i),c=n("mvHQ"),s=n.n(c),u=n("Xxa5"),l=n.n(u),d=n("Dd8w"),p=n.n(d),m=n("exGp"),f=n.n(m),v=n("7o8y"),y=n("afMx"),M={inject:["editFormData"],created:function(){},data:function(){return{managerUserOptions:[],managerUserOptionsFromUserList:[],workShopList:[],woFormTypeDisabled:!1,form:{woFormType:this.$route.query.woFormType||"",remark:this.$route.query.remark||"",status:"status"in this.$route.query?this.$route.query.status:1},reportFormTypeList:[]}},methods:{revertFormInfo:function(){this.form={woFormType:this.$route.query.woFormType||"",remark:this.$route.query.remark||"",status:"status"in this.$route.query?parseInt(this.$route.query.status):1}},getWoFormType:function(){var e=this;return f()(l.a.mark(function t(){var n,r;return l.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.initWoFormTypeDisabled(),n={current:1,size:30},t.next=4,Object(v.l)(n);case 4:1e3==(r=t.sent).data.code&&(e.reportFormTypeList=r.data.data.list),e.initWoFormType();case 7:case"end":return t.stop()}},t,e)}))()},initWoFormTypeDisabled:function(){this.$route.query.woFormType&&(this.woFormTypeDisabled=!0)},initWoFormType:function(){this.$route.query.woFormType&&(this.form.woFormType=this.$route.query.woFormType)},getFormMOdel:function(){return this.form.woFormType?this.form:(this.$message.warning("请选择报告类型"),null)}}},g=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-form",{ref:"baseInfoForm",staticClass:"form-property-container",attrs:{model:e.form,"label-position":"top"}},[n("div",{staticClass:"form-property-box"},[n("div",{staticClass:"form-property-box-header"},[e._v("基本信息")]),e._v(" "),n("div",{staticClass:"form-property-box-content"},[n("el-form-item",{attrs:{label:"报告类型",size:"mini",prop:"formName",rules:[{required:!0,message:"请选择报告类型",trigger:"blur"}]}},[n("el-select",{staticStyle:{width:"100%"},attrs:{disabled:e.woFormTypeDisabled,placeholder:"请选择报告类型"},model:{value:e.form.woFormType,callback:function(t){e.$set(e.form,"woFormType",t)},expression:"form.woFormType"}},e._l(e.reportFormTypeList,function(e){return n("el-option",{key:e.code,attrs:{label:e.name,value:e.code}})}),1)],1),e._v(" "),n("el-form-item",{attrs:{label:"描述",size:"mini"}},[n("el-input",{attrs:{maxlength:"30",placeholder:"请输入报告描述"},model:{value:e.form.remark,callback:function(t){e.$set(e.form,"remark",t)},expression:"form.remark"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"状态",size:"mini",prop:"status",rules:[{required:!0,message:"请输入表单名称",trigger:"blur"}]}},[n("el-radio-group",{model:{value:e.form.status,callback:function(t){e.$set(e.form,"status",t)},expression:"form.status"}},[n("el-radio",{attrs:{label:1}},[e._v("启用")]),e._v(" "),n("el-radio",{attrs:{label:0}},[e._v("禁用")])],1)],1)],1)])])};g._withStripped=!0;var h={render:g,staticRenderFns:[]},I=h;var N=!1;var T=n("VU/8")(M,I,!1,function(e){N||n("ZXzy")},"data-v-dc9f82c4",null);T.options.__file="src/components/ReportForm/formApplication/formCreate/formProperty.vue";var F=T.exports,x=n("RxjI"),j=n("nPYt"),C={props:{iconItem:{type:Object,default:function(){return{}}}}},L=function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"icon-menu"},[t("img",{staticClass:"menu-icon-logo",attrs:{src:this.iconItem.icon}}),this._v("\n  "+this._s(this.iconItem.name)+"\n")])};L._withStripped=!0;var D={render:L,staticRenderFns:[]},w=D;var b=!1;var O=n("VU/8")(C,w,!1,function(e){b||n("/UC7")},"data-v-73d994b6",null);O.options.__file="src/components/ReportForm/formApplication/formGenerate/components/iconMenu/iconItem.vue";var _=O.exports,z=VueCompositionAPI.inject,E={components:{IconItem:_},props:{renderDone:{type:Boolean,default:!0}},data:function(){return{menuData:j.a}},methods:{clickComponentIcon:function(e){this.renderDone&&this.createFormField(e)}},setup:function(){return{createFormField:z("createFormField")}}},A=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"icon-menu-container"},e._l(e.menuData,function(t){return n("div",{key:t.componentType,staticClass:"icon-type"},[n("header",{staticClass:"icon-title"},[e._v(e._s(t.componentType))]),e._v(" "),n("section",{staticClass:"icon-item-list"},e._l(t.subMenuData,function(t){return n("IconItem",{key:t.name,attrs:{iconItem:t},nativeOn:{click:function(n){return function(){return e.clickComponentIcon(t)}.apply(null,arguments)}}})}),1)])}),0)};A._withStripped=!0;var U={render:A,staticRenderFns:[]},S=U;var k=!1;var P=n("VU/8")(E,S,!1,function(e){k||n("vZGS")},"data-v-a1b9f290",null);P.options.__file="src/components/ReportForm/formApplication/formGenerate/components/iconMenu/index.vue";var Q=P.exports,R=function(e,t){var n=t._c;return n("div",{staticClass:"skeleton-screen"},t._l(60,function(e){return n("div",{key:e,staticClass:"skeleton-content"})}),0)};R._withStripped=!0;var $={render:R,staticRenderFns:[]},V=$;var Y=!1;var G=n("VU/8")(null,V,!0,function(e){Y||n("32Xp")},"data-v-64331bf1",null);G.options.__file="src/components/ReportForm/formApplication/formGenerate/components/systemComp/skeleton.vue";var H=G.exports,W={components:{Skeleton:H},props:{formContentList:{type:Array,default:function(){return[]}},renderDone:{type:Boolean,default:!0}},render:function(){var e=arguments[0];return e("div",{class:"form-content-container"},[e("div",{class:"form-property-box"},[e("div",{class:"form-property-box-header"},["表单内容"]),e("div",{class:"form-property-box-content"},[this.renderDone?e("transition-group",{attrs:{name:"form-property-box-content-list"}},[this.formContentList.map(function(t){return e(t.Cotr,{attrs:{_uFieldInfo:t._uFieldInfo},key:t.__uuid})})]):e(H)])])])}},q=!1;var B=n("VU/8")(W,null,!1,function(e){q||(n("OpHK"),n("2uvC"))},"data-v-a6bfecaa",null);B.options.__file="src/components/ReportForm/formApplication/formGenerate/components/formContent/index.vue";var J=B.exports,Z=n("woOf"),X=n.n(Z),K=n("vWI7");Vue.extendWithMixin=function(e){var t={_COMPONENTTYPE:"PROPERTY",mixins:[{methods:{changeFieldConfig:function(e,t){x.EVENTBUS.$emit(""+this.activeField.__uuid,{configProperty:e,value:t})}}}],props:{activeField:{type:Object,default:function(){return{}}}}},n=X()({},t,e);return Vue.extend(n)};var ee=j.a[0].subMenuData.map(function(e){return{value:e.componentType,label:e.fieldName}});Vue.extendWithMixin({data:function(){return{multiLine:!1,options:[{value:"",key:Object(y.b)()}]}},created:function(){var e=this.activeField._configField;e.children&&e.children.length&&(this.options=e.children)},methods:{changeTextStyle:function(e){1==e?this.multiLine=!1:2==e&&(this.multiLine=!0),this.$refs.textContent.resetInputValue("文字"),this.changeFieldConfig("textStyle",e),this.changeFieldConfig("textContent","文字")},getComList:function(e){console.log("eee",e),this.changeFieldConfig("children",e.selectOptions)}},render:function(){var e=this,t=arguments[0];return t("div",[t(K.a.Input,{attrs:{fieldName:"模块名称",maxlength:15,defaultValue:"模块名称",fieldRules:[{required:!0,message:"请输入字段名称",trigger:"blur"}],reverPropertyPanelValueKey:""},on:{changeValue:function(t){return e.changeFieldConfig("textContent",t)}}}),t(K.a.RadioH,{attrs:{fieldName:"PDF展示方式",defaultValue:"1",radioOptions:[{value:"1",label:"按顺序平铺"},{value:"2",label:"表格左右分布"}],reverPropertyPanelValueKey:"limit"},on:{changeValue:function(t){return e.changeFieldConfig("limit",t)}}}),t(K.a.Input,{attrs:{fieldName:"Dollar符",maxlength:15,defaultValue:"模块名称",reverPropertyPanelValueKey:""},on:{changeValue:function(t){return e.changeFieldConfig("textContent",t)}}}),t(K.a.SelectOptions,{attrs:{fieldName:"模块子字段",optionsType:2,options:this.options,optionsList:ee},on:{getOptions:this.getComList}})])}});Vue.extendWithMixin=function(e){var t={_COMPONENTTYPE:"PROPERTY",mixins:[{methods:{changeFieldConfig:function(e,t){x.EVENTBUS.$emit(""+this.activeField.__uuid,{configProperty:e,value:t})}}}],props:{activeField:{type:Object,default:function(){return{}}}}},n=X()({},t,e);return Vue.extend(n)};Vue.extendWithMixin({data:function(){return{multiLine:!1,options:[{value:"tab1",label:"tab1",key:Object(y.b)()}]}},created:function(){var e=this.activeField._configField;e.children&&e.children.length&&(this.options=e.children)},methods:{getTabList:function(e){this.changeFieldConfig("children",e)}},render:function(){var e=arguments[0];return e("div",[e(K.a.SelectOptions,{attrs:{options:this.options},on:{getOptions:this.getTabList}})])}});var te={},ne=n("JHj1");ne.keys().forEach(function(e){var t=e.substring(e.lastIndexOf("/")+1,e.lastIndexOf(".")),n=j.a[0].subMenuData.find(function(e){return e.componentName==t}),r=n?n.propertyPanelComponent:"";r&&(te[r]=ne(e)[r])});var re=te,oe={props:{activeField:{type:Object,default:function(){return{}}}},render:function(){var e=arguments[0],t=this.activeField&&this.activeField.propertyPanelComponent?re[this.activeField.propertyPanelComponent]:null;return e("div",{class:"property-panel"},[e("div",{class:"property-panel-header"},[e("div",{style:"width:100%;font-weight: bolder;"},["属性&参数"]),this.activeField&&this.activeField.propertyPanelComponent?e("div",{style:"width:100%;margin-top:10px;color:#999"},["自定义组件：",e("span",{style:"color:#d10000"},[this.activeField.name])]):null]),e("div",{class:"property-panel-content"},[this.activeField&&this.activeField.propertyPanelComponent&&t?e(t,{key:this.activeField.__uuid,attrs:{activeField:this.activeField}}):null])])}},ie=!1;var ae=n("VU/8")(oe,null,!1,function(e){ie||n("BSY7")},"data-v-d935a6f6",null);ae.options.__file="src/components/ReportForm/formApplication/formGenerate/components/propertyPanel/index.vue";var ce=ae.exports,se=VueCompositionAPI,ue=se.ref,le=(se.reactive,se.onMounted,se.provide),de=(se.watch,{components:{IconMenu:Q,FormContent:J,PropertyPanel:ce},data:function(){return{renderDone:!0}},beforeMount:function(){var e=this;return f()(l.a.mark(function t(){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}},t,e)}))()},methods:{findBaseCompInfo:function(e){var t=j.a[0].subMenuData.find(function(t){return t.componentType===e});return t?JSON.parse(s()(t)):null},handeBackendData:function(e){var t=this;if(e&&e.length)return e.map(function(e){var n=t.findBaseCompInfo(e.woComponentType),r=n||JSON.parse(s()(e));return r.fieldName=e.woComponentName,r.configField=e,r.configField.options=e.options?JSON.parse(e.options):r.options,r.configField.componentType=e.woComponentType,r.configField.fieldName=e.woComponentName,r.configField.children=t.handeBackendData(e.children),r})},revertFormComponentList:function(){var e=this;return f()(l.a.mark(function t(){var n,r;return l.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(!e.$route.query.woFormId){t.next=9;break}return e.renderDone=!1,t.next=4,e.getFormComponentInfo(e.$route.query.woFormId);case 4:n=t.sent,(r=e.handeBackendData(n))&&r.length>0&&r.forEach(function(t){e.createFormField(t)}),console.log("this is handleWoFormCompList",r),e.renderDone=!0;case 9:case"end":return t.stop()}},t,e)}))()}},setup:function(){var e=this,t=x.useFormCreate().createFormField,n=x.useActiveFieldProperty(),r=n.activeField,o=n.setActiveFieldProperty,i=ue(null);le("createFormField",t),le("formContentList",x.formOperationState.formContentList);var a,c=(a=f()(l.a.mark(function t(n){var r;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(n){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,Object(v.f)({woFormId:n});case 4:if(1e3!==(r=e.sent).data.code){e.next=7;break}return e.abrupt("return",r.data.data);case 7:case"end":return e.stop()}},t,e)})),function(e){return a.apply(this,arguments)});return{FORM:x,formGenerateIcon:i,activeField:r,getFormComponentInfo:c,createFormField:t,setActiveFieldProperty:o,getfFormContentList:function(){return x.formOperationState.formContentList}}}}),pe=function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"container"},[t("div",{staticClass:"main"},[t("FormContent",{attrs:{formContentList:this.FORM.formOperationState.formContentList,renderDone:this.renderDone}})],1),this._v(" "),t("div",{staticClass:"left"},[t("IconMenu",{ref:"formGenerateIcon",attrs:{renderDone:this.renderDone}})],1),this._v(" "),t("div",{staticClass:"right"},[t("PropertyPanel",{attrs:{activeField:this.activeField.value}})],1)])};pe._withStripped=!0;var me={render:pe,staticRenderFns:[]},fe=me;var ve=!1;var ye=n("VU/8")(de,fe,!1,function(e){ve||(n("ahI2"),n("cwkp"))},"data-v-dd0cce14",null);ye.options.__file="src/components/ReportForm/formApplication/formGenerate/index.vue";var Me=ye.exports,ge=VueCompositionAPI,he=ge.ref,Ie=(ge.reactive,ge.onMounted,ge.onUnmounted),Ne=(ge.provide,{components:{FormProperty:F,FormGenerate:Me},data:function(){return{woFormId:""}},created:function(){this.initWoFormId()},methods:{openGithub:function(){window.open("https://github.com/windowdotonload/form-generator-simple","_blank")},initWoFormId:function(){var e=this;this.$route.query.woFormId&&(this.woFormId=this.$route.query.woFormId.toString(),this.$nextTick(function(){e.changePanel(2)}))},changePanel:function(e){e&&(this.formActivePanel=e)},cancelCreate:function(){},prevForm:function(){Object(y.a)({title:"预览",width:"50%",ContentComponent:x.PreviewComponent})},saveForm:function(){var e=this;return f()(l.a.mark(function t(){var n,r,o,i;return l.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(n=e.$refs.FormProperty.getFormMOdel()){t.next=3;break}return t.abrupt("return");case 3:if(r=p()({},n),o=void 0,!e.$route.query.woFormId){t.next=12;break}return r.woFormId=e.$route.query.woFormId,t.next=9,Object(v.o)(r);case 9:o=t.sent,t.next=15;break;case 12:return t.next=14,Object(v.a)(r);case 14:o=t.sent;case 15:e.$route.query.woFormId?e.woFormId||e.$route.query.woFormId:o&&1e3==o.data.code&&(i=o.data.data,e.woFormId=i);case 16:case"end":return t.stop()}},t,e)}))()},addFormComponent:function(){var e=this;return f()(l.a.mark(function t(){var n,r,i,c;return l.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(e.woFormId){t.next=2;break}return t.abrupt("return");case 2:return n=function t(n){var r={};return(r=n._uFieldInfo&&n._uFieldInfo._configField?JSON.parse(s()(n._uFieldInfo._configField)):JSON.parse(s()(n))).options&&(r.options=s()(r.options)),r.children&&r.children.length&&(r.children=r.children.map(function(e){return t(10==r.componentType?e.tabComponentModule:e)})),a()(r).forEach(function(e){var t=o()(e,2),n=t[0];t[1];0==n.indexOf("__")&&delete r[n]}),p()({},r,{woFormId:e.woFormId,woComponentType:r.componentType,woComponentName:r.fieldName,woComponentUuid:n.__uuid})},r=x.formOperationState.formContentList,i=r.map(function(e){return n(e)}),console.log("componentListParams",i),t.next=8,Object(v.b)(i);case 8:if(!(c=t.sent)||1e3!=c.data.code){t.next=11;break}return t.abrupt("return",c.data.data);case 11:case"end":return t.stop()}},t,e)}))()},save:function(){var e=this;return f()(l.a.mark(function t(){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return");case 2:case"end":return e.stop()}},t,e)}))()},saveFormExec:function(){var e=this;return f()(l.a.mark(function t(){return l.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("refreshFormGenerate",e.$route),t.next=3,e.saveForm();case 3:return t.next=5,e.addFormComponent();case 5:e.refreshFormGenerate();case 6:case"end":return t.stop()}},t,e)}))()},refreshFormGenerate:function(){var e=this;return f()(l.a.mark(function t(){var n,r;return l.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(Object(x.clearFormGenerateData)(),"ReportFormCreate"!=e.$route.name){t.next=9;break}n=e.$refs.FormProperty.getFormMOdel(),r={},n&&(r=p()({},n)),e.$router.push({name:"ReportFormEdit",query:p()({},r,{woFormId:e.woFormId})}),window.location.reload(),t.next=12;break;case 9:return t.next=11,e.$nextTick();case 11:e.$refs.FormGenerate.revertFormComponentList();case 12:case"end":return t.stop()}},t,e)}))()}},setup:function(){var e=he("100%"),t=he(2);return Ie(function(){Object(x.clearFormGenerateData)()}),{containerHeight:e,formActivePanel:t,getActiveStyle:function(e){return 1==e?1==t.value?"border: 1px solid #d10000;border-top-left-radius: 4px;border-bottom-left-radius: 4px;box-sizing: border-box;":"":2==e?2==t.value?"border: 1px solid #d10000;border-top-right-radius: 4px;border-bottom-right-radius: 4px;padding-left:1px;box-sizing: border-box;":"":void 0}}}}),Te=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"form-create-container",style:{height:e.containerHeight}},[r("div",{staticClass:"form-crate-header"},[r("div"),e._v(" "),r("div",{staticStyle:{"margin-left":"6%"}},[r("el-radio-group",{attrs:{size:"mini",fill:"#fff",border:"","text-color":"#d10000"},model:{value:e.formActivePanel,callback:function(t){e.formActivePanel=t},expression:"formActivePanel"}},[r("el-radio-button",{style:e.getActiveStyle(1),attrs:{label:1}},[e._v("表单属性管理")]),e._v(" "),r("el-radio-button",{style:e.getActiveStyle(2),attrs:{label:2}},[e._v("表单编辑器")])],1)],1),e._v(" "),r("div",{staticStyle:{display:"flex","align-items":"center"}},[r("el-button",{attrs:{type:"danger",size:"mini"},on:{click:e.save}},[e._v("发送至邮箱")]),e._v(" "),r("el-button",{attrs:{size:"mini"},on:{click:e.cancelCreate}},[e._v("预览")]),e._v(" "),r("img",{staticStyle:{width:"23px",height:"23px","margin-left":"10px",cursor:"pointer"},attrs:{src:n("ieC6")},on:{click:e.openGithub}})],1)]),e._v(" "),r("div",{staticClass:"form-crate-content"},[r("FormProperty",{directives:[{name:"show",rawName:"v-show",value:1==e.formActivePanel,expression:"formActivePanel == 1"}],ref:"FormProperty"}),e._v(" "),r("FormGenerate",{directives:[{name:"show",rawName:"v-show",value:2==e.formActivePanel,expression:"formActivePanel == 2"}],ref:"FormGenerate"})],1)])};Te._withStripped=!0;var Fe={render:Te,staticRenderFns:[]},xe=Fe;var je=!1;var Ce=n("VU/8")(Ne,xe,!1,function(e){je||n("AX/5")},"data-v-1853cd86",null);Ce.options.__file="src/components/ReportForm/formApplication/formCreate/index.vue";var Le={components:{FormCreate:Ce.exports},created:function(){},beforeDestroy:function(){Object(v.d)()}},De=function(){var e=this.$createElement;return(this._self._c||e)("FormCreate")};De._withStripped=!0;var we={render:De,staticRenderFns:[]},be=we;var Oe=n("VU/8")(Le,be,!1,null,null,null);Oe.options.__file="src/components/ReportForm/formApplication/formCreate/page.vue";t.default=Oe.exports},ieC6:function(e,t){e.exports="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBmaWxsPScjNjY2JyB0PSIxNzIwNzkzMzU3MjgwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQyMzUiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTUxMS45NjggNzMuMTUycTExOS40MjQgMCAyMjAuMjg4IDU4Ljg0OHQxNTkuNzEyIDE1OS43MTIgNTguODQ4IDIyMC4yODhxMCAxNDMuNDI0LTgzLjcxMiAyNTguMDE2dC0yMTYuMjg4IDE1OC41NnEtMTUuNDI0IDIuODQ4LTIyLjg0OC00dC03LjQyNC0xNy4xNTJxMC0xLjcyOCAwLjI4OC00My43MTJ0MC4yODgtNzYuODY0cTAtNTUuNDI0LTI5LjcyOC04MS4xNTIgMzIuNTc2LTMuNDI0IDU4LjU2LTEwLjI3MnQ1My43MjgtMjIuMjcyIDQ2LjI3Mi0zOC4wMTYgMzAuMjcyLTYwIDExLjcxMi04Ni4wMTZxMC02OC00NS4xNTItMTE3LjcyOCAyMS4xNTItNTItNC41NzYtMTE2LjU3Ni0xNi01LjE1Mi00Ni4yNzIgNi4yNzJ0LTUyLjU3NiAyNS4xNTJsLTIxLjcyOCAxMy43MjhxLTUzLjE1Mi0xNC44NDgtMTA5LjcyOC0xNC44NDh0LTEwOS43MjggMTQuODQ4cS05LjE1Mi02LjI3Mi0yNC4yODgtMTUuNDI0dC00Ny43MTItMjIuMDE2LTQ4LjU3Ni03LjcxMnEtMjUuNzI4IDY0LjU3Ni00LjU3NiAxMTYuNTc2LTQ1LjE1MiA0OS43MjgtNDUuMTUyIDExNy43MjggMCA0OC41NzYgMTEuNzEyIDg1LjcyOHQzMC4wMTYgNjAgNDYuMDE2IDM4LjI3MiA1My43MjggMjIuMjcyIDU4LjU2IDEwLjI3MnEtMjIuMjcyIDIwLjU3Ni0yOCA1OC44NDgtMTIgNS43MjgtMjUuNzI4IDguNTc2dC0zMi41NzYgMi44NDgtMzcuNDQtMTIuMjg4LTMxLjcxMi0zNS43MTJxLTEwLjg0OC0xOC4yNzItMjcuNzEyLTI5LjcyOHQtMjguMjg4LTEzLjcyOGwtMTEuNDI0LTEuNzI4cS0xMiAwLTE2LjU3NiAyLjU2dC0yLjg0OCA2LjU2IDUuMTUyIDggNy40MjQgNi44NDhsNCAyLjg0OHExMi41NzYgNS43MjggMjQuODY0IDIxLjcyOHQxOC4wMTYgMjkuMTUybDUuNzI4IDEzLjE1MnE3LjQyNCAyMS43MjggMjUuMTUyIDM1LjEzNnQzOC4yNzIgMTcuMTUyIDM5LjcxMiA0IDMxLjcxMi0yLjAxNmwxMy4xNTItMi4yNzJxMCAyMS43MjggMC4yODggNTAuNTZ0MC4yODggMzEuMTM2cTAgMTAuMjcyLTcuNDI0IDE3LjE1MnQtMjIuODQ4IDRxLTEzMi41NzYtNDQtMjE2LjI4OC0xNTguNTZ0LTgzLjcxMi0yNTguMDE2cTAtMTE5LjQyNCA1OC44NDgtMjIwLjI4OHQxNTkuNzEyLTE1OS43MTIgMjIwLjI4OC01OC44NDh6TTIzOS4zOTIgNzAzLjQyNHExLjcyOC00LTQtNi44NDgtNS43MjgtMS43MjgtNy40MjQgMS4xNTItMS43MjggNCA0IDYuODQ4IDUuMTUyIDMuNDI0IDcuNDI0LTEuMTUyek0yNTcuMTIgNzIyLjg0OHE0LTIuODQ4LTEuMTUyLTkuMTUyLTUuNzI4LTUuMTUyLTkuMTUyLTEuNzI4LTQgMi44NDggMS4xNTIgOS4xNTIgNS43MjggNS43MjggOS4xNTIgMS43Mjh6TTI3NC4yNzIgNzQ4LjU3NnE1LjE1Mi00IDAtMTAuODQ4LTQuNTc2LTcuNDI0LTkuNzI4LTMuNDI0LTUuMTUyIDIuODQ4IDAgMTAuMjcydDkuNzI4IDR6TTI5OC4yNzIgNzcyLjU3NnE0LjU3Ni00LjU3Ni0yLjI3Mi0xMC44NDgtNi44NDgtNi44NDgtMTEuNDI0LTEuNzI4LTUuMTUyIDQuNTc2IDIuMjcyIDEwLjg0OCA2Ljg0OCA2Ljg0OCAxMS40MjQgMS43Mjh6TTMzMC44NDggNzg2Ljg0OHExLjcyOC02LjI3Mi03LjQyNC05LjE1Mi04LjU3Ni0yLjI3Mi0xMC44NDggNHQ3LjQyNCA4LjU3NnE4LjU3NiAzLjQyNCAxMC44NDgtMy40MjR6TTM2Ni44NDggNzg5LjcyOHEwLTcuNDI0LTkuNzI4LTYuMjcyLTkuMTUyIDAtOS4xNTIgNi4yNzIgMCA3LjQyNCA5LjcyOCA2LjI3MiA5LjE1MiAwIDkuMTUyLTYuMjcyek0zOTkuOTY4IDc4NHEtMS4xNTItNi4yNzItMTAuMjcyLTUuMTUyLTkuMTUyIDEuNzI4LTggOC41NzZ0MTAuMjcyIDQuNTc2IDgtOHoiIHAtaWQ9IjQyMzYiPjwvcGF0aD48L3N2Zz4="},vZGS:function(e,t){}});