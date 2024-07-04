export default {
  data() {
    return {
      customeConfigDataList: [],
    };
  },
  created() {},
  methods: {
    async getRecord(param) {
      const res = await this.requestMethodGetTip("/wo/form/getRecord", param);
      const list = res.data.data.list;
      if (!list.length) return;
      this.customeConfigDataList = list;
    },
    customeReportFormEdit(editItem) {
      console.log("this is editItem", editItem);
      const { woFormId, woRecordId, deviceNumber, lubricationPointNumber, path } = editItem;
      this.$router.push({
        name: "ReportFormFillReport",
        query: {
          woFormId,
          woRecordId,
          deviceNumber,
          lubricationPointNumber,
        },
      });
    },
  },
};
