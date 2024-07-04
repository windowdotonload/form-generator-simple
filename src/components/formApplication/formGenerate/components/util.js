import { resetOilCascadeMenu } from "@/components/formApplication/api/index.js";
const generateUUID = () => {
  let d = new Date().getTime();
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    d += performance.now();
  }
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });

  return uuid;
};

const usedUUIDs = new Set();

export const generateUniqueUUID = () => {
  let uuid;
  do {
    uuid = generateUUID();
  } while (usedUUIDs.has(uuid));
  usedUUIDs.add(uuid);
  return uuid;
};

export const createDialog = (props = {}) => {
  let DIALOG, DIALOGINSTANCE, EL;
  DIALOG = Vue.extend({
    provide() {
      return {
        ...props.componentProps
      };
    },
    created() {
      this.title = props.title ? props.title : this.title;
      this.width = props.width ? props.width : this.width;
      this.ContentComponent = props.ContentComponent;
    },
    data() {
      return {
        title: "",
        width: "30%",
        ContentComponent: null,
        dialogBoxVis: true
      };
    },
    methods: {
      closeDialog() {
        this.dialogBoxVis = false;
        Vue.nextTick(() => {
          if (document.body.contains(EL)) document.body.removeChild(EL);
          DIALOG = null;
          DIALOGINSTANCE = null;
          this.$destroy();
        });
      },
      addOilSuccess() {
        ELEMENT.Message({
          message: "添加油品成功",
          type: "success"
        });
        resetOilCascadeMenu();
        this.closeDialog();
      }
    },
    render() {
      const ContentComponent = this.ContentComponent || null;
      return (
        <el-dialog
          class={props.noStyle ? "form-generator-dialog-normal" : "form-generator-dialog"}
          width={this.width}
          visible={this.dialogBoxVis}
          close-on-click-modal={false}
          v-if={this.dialogBoxVis}
          show-close={false}
          destroy-on-close={true}
          onClose={this.closeDialog}
        >
          <div style={{ width: "100%", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", height: "30px", width: "100%", alignItems: "center" }}>
              <span style={{ fontWeight: "bold", fontSize: "16px" }}>{this.title || "提示"}</span>
              <i class="el-icon-close" style={{ fontSize: "15px", cursor: "pointer" }} onClick={this.closeDialog} />
            </div>
            <div style={{ boxSizing: "border-box", width: "100%", paddingTop: "15px" }}>
              <ContentComponent onAddOilSuccess={this.addOilSuccess} />
            </div>
          </div>
        </el-dialog>
      );
    }
  });
  DIALOGINSTANCE = new DIALOG();
  EL = DIALOGINSTANCE.$mount().$el;
  document.body.appendChild(EL);
  return DIALOGINSTANCE;
};
