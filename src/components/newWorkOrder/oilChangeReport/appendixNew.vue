<template>
  <reportCardItem
      :stepList="stepList"
      :card-item="cardItem"
      :paramReportNode="stepList"
      :addFieldPoolDtoList="addFieldPoolDtoList"
      :paramReportType="paramReportType"
    />
  </template>
  <script>
  import reportCardItem from '../../parameterReport/reportCommon/components/report-card-item.vue';
  import validateForm from "@/components/businessComponents/components/validateForm";
  export default {
    mixins: [validateForm],
    components:{ reportCardItem },
    props:{
      stepList:{
        type:Array,
        default:[]
      },
      cardItem:{
        type:Object,
        default:{}
      },
      addFieldPoolDtoList:{
        type:Array,
        default:[]
      },
      paramReportType:{
        type:Number,
        default:null
      }
    },
    data() {
      return {

      }
    },
    methods: {
      validateAppendixNew(){
        let validateArr = [];
        this.stepList.forEach(it => {
          validateArr.push(...it.nodeValue)
        });
        const flag = this.validateFormItem(validateArr)
        return flag
      },
    }
  };
  </script>
  <style lang='less' scoped>
  </style>
  
  