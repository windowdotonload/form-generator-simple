export default {
  data () {
    return {
      addNewCustomerData: {
        visible: false
      }
    }
  },
  methods: {
    handleAddnewCustomer () {
      this.addNewCustomerData.visible = true
    },
    handleAddnewCustomerDrawerClose () {
      this.addNewCustomerData.visible = false
    }
  }
}
