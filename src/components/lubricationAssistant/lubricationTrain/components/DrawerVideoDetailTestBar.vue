<template>
  <div>
    <div :class="totalValue ? 'drawer-video-classtest-bar-answerd' : 'drawer-video-classtest-bar'">
      <div style="display:flex;align-items:center;width:70%">
        <img src="@/assets/classtestIcon.png" alt="" style="margin-right:16px" />
        <div style="display:flex;align-items:center;width:100%;flex-wrap:wrap">
          <div class="test-tip-weight">随堂测试</div>
          <div class="test-tip" style="width:100%;margin-top:6px">
            <span v-if="!totalValue">快来答题，巩固一下本次培训的内容吧！</span>
            <span v-else>
              已完成答题，总分
              <span class="score-emphasize"> {{ fullScore }} </span>分， 已得 <span class="score-emphasize">{{ totalValue }} </span>分！
            </span>
          </div>
        </div>
      </div>
      <div style="display:flex;align-items:center">
        <el-button size="mini" type="danger" @click="startTest">{{ totalValue ? "重新测验" : "开始测验" }}</el-button>
        <el-button size="mini" type="info" v-if="totalValue" plain @click="viewAnswer">查看答案</el-button>
      </div>
    </div>
    <TrainWJXQA ref="trainQA" />
    <TrainWJXQAAnswer ref="trainQAAnswer" />
  </div>
</template>

<script>
import { executeCbAfterReq, getTestURL, getTrainTestAnswerURL } from "../../api/index";

export default {
  inject: ["state", "actions"],
  components: {
    TrainWJXQA: () => import("./DrawerVideoDetailQu.vue"),
    TrainWJXQAAnswer: () => import("./DrawerVideoDetailQuAnswer.vue")
  },
  data() {
    return {};
  },
  computed: {
    fullScore() {
      return this.state.drawerComponentParams.fullScore;
    },
    totalValue() {
      return this.state.drawerComponentParams.totalValue;
    }
  },
  methods: {
    getStartTestUrlActions(res) {
      this.$refs.trainQA.openQuestion(res);
    },
    getStartTestUrl() {
      const params = {
        url: this.state.drawerComponentParams.testUrl,
        trainId: this.state.drawerComponentParams.id
      };
      executeCbAfterReq(getTestURL, params, this.getStartTestUrlActions);
    },
    startTest() {
      this.getStartTestUrl();
      this.$gio.clickTestTrain({
        trainName: this.state.drawerComponentParams.trainName,
        operation: this.totalValue ? "重新测验" : "开始测验"
      });
      this.$gio.toTestPage(
        {
        trainName: this.state.drawerComponentParams.trainName
        }
      );
    },
    getTrainTestAnswerURLActions(res) {
      this.$refs.trainQAAnswer.openQuestion(res);
    },
    getTrainTestAnswerURL() {
      const params = {
        url: this.state.drawerComponentParams.testUrl,
        trainId: this.state.drawerComponentParams.id
      };
      executeCbAfterReq(getTrainTestAnswerURL, params, this.getTrainTestAnswerURLActions);
    },
    viewAnswer() {
      this.getTrainTestAnswerURL();
      this.$gio.viewAnswer();
    }
  }
};
</script>

<style lang="less" scoped>
.drawer-video-classtest-bar {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  padding: 12px 20px;
  background: rgba(204, 221, 255, 0.2);
  border: 1px solid rgba(204, 221, 255, 0.4);
  border-radius: 6px;

  .test-tip {
    font-size: 13px;
  }
  .test-tip-weight {
    font-weight: 700;
    font-size: 15px;
  }
}
.drawer-video-classtest-bar-answerd {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  padding: 12px 20px;
  background: rgba(0, 136, 136, 0.05);
  border: 1px solid rgba(0, 136, 136, 0.1);
  border-radius: 6px;

  .test-tip {
    font-size: 13px;
  }
  .test-tip-weight {
    font-weight: 700;
    font-size: 15px;
  }
}
.score-emphasize {
  color: #d10000;
  font-weight: bold;
}
</style>
