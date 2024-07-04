import { getAddItem } from "@/components/businessComponents/components/addItem";
export default {
  data() {
    return {
      regList: [],
      displayItem: {},
      addToItem: {},
      chartData: [],
      chartParentNodeId: "",
      chartParentNodeData: [],
      chartId: "",
      multipleRegList: [],
      effectItem: {}
    };
  },
  methods: {
    async handleAddReportItem(item, nodeItem, isDisabledFlag, selectedCodeList) {
      // 绑定的ID
      let bindingId;
      if (item.styleJsonDto.bindingId.indexOf("-") > 0) {
        bindingId = item.styleJsonDto.bindingIdOrigin;
      } else {
        bindingId = item.styleJsonDto.bindingId;
      }
      let parentId = item.styleJsonDto.bindingId;
      // 可添加，可删除的最大，最小值
      const { rangeMax, rangeMin } = item;
      // 现在要添加的数组的长度
      let nowLength = 0;
      this.addToItem = {};
      this.findChidLength(nodeItem.nodeValue, item.styleJsonDto.bindingId);
      if (!_.isEmpty(this.addToItem)) {
        nowLength = this.addToItem.children.length;
      }
      let addItem = {};
      if (nowLength < Number(rangeMax)) {
        //可添加
        this.addFieldPoolDtoList.forEach(item => {
          if (item.addToId == bindingId) {
            addItem = item.currentFieldDto;
            addItem.parentId = parentId;
          }
        });
        if (!_.isEmpty(addItem)) {
          const data = await getAddItem(addItem);
          // 添加下拉框字段不可选择
          if (isDisabledFlag) {
            data.children.forEach(it => {
              if (it.type == "dropdown2") {
                let str = selectedCodeList.join(",");
                it.fieldOption.forEach(f => {
                  f.disabled = false;
                  if (str.includes(f.value) && f.value != "0") {
                    f.disabled = true;
                  }
                });
              }
            });
          }
          if (this.paramReportType == 19 && (addItem.nameKey == "key_2770" || addItem.nameKey == "key_2775")) {
            //内窥镜，火花塞或者喷油嘴添加图片和描述
            data.children.forEach(it => {
              it.display = true;
            });
          }
          if (this.paramReportType == 3) {
            data.isSystemLup = false;
            data.children.forEach(it => {
              it.isSystemLup = false;
              if (it.nameKey == "lup_name") {
                item.customerNameValue = "";
                item.isLupNameFlag = false;
                item.nameListData = [];
                item.customerSelectNameValue = "";
              }
              this.handleHiddenOrShow(it);
            });
          }
          if (this.paramReportType == 8) {
            // 新增---解决开式齿轮检查报告，点击添加位置的时候不显示
            if (!data.children.length && data.nameKey == "position_key") {
              data.display = true;
            }
            // data.children.forEach(it=>{
            //   this.handleHiddenOrShow(it)
            //   if(it.children.length){
            //     it.children.forEach(item=>{
            //       this.handleHiddenOrShow(item)
            //       if(item.children.length){
            //         item.children.forEach(ch=>{
            //           this.handleHiddenOrShow(ch)
            //         })
            //       }
            //     })
            //   }
            // })
          }
          // 新增--油品储运调研报告，油品储存状况调查点击添加图片和描述时显示项目
          if (this.paramReportType == 13 && addItem.nameKey == "key_1451") {
            data.children.forEach(it => {
              it.display = true;
            });
          }
          await this.addReportItem(nodeItem.nodeValue, item.styleJsonDto.bindingId, data, item);
          // 新增---解决开式齿轮检查报告，点击添加小齿轮的时候不显示
          if (this.paramReportType == 8 && data.nameKey === "key_kscl_cljc_chilun_small_parent") {
            nodeItem.nodeValue.forEach(it => {
              this.handleHiddenOrShow(it);
              if (it.children.length) {
                it.children.forEach(item => {
                  this.handleHiddenOrShow(item);
                  if (item.children.length) {
                    item.children.forEach(ch => {
                      this.handleHiddenOrShow(ch);
                    });
                  }
                });
              }
            });
          }
          this.handleRegItem();
        } else {
          console.log("未找到");
        }
      } else {
        this.$message({
          type: "warning",
          message: `最多添加${rangeMax}条数据`
        });
      }
    },
    findChidLength(arr, bindingId) {
      arr.forEach(it => {
        if (it.id == bindingId) {
          this.addToItem = it;
          return;
        } else {
          if (it.children && it.children.length) {
            this.findChidLength(it.children, bindingId);
          }
        }
      });
    },
    async addReportItem(arr, bindingId, data, item) {
      arr.forEach(it => {
        if (it.id == bindingId) {
          it.children.push(data);
          return;
        } else {
          if (it.children.length) {
            this.addReportItem(it.children, bindingId, data, item);
          }
        }
      });
    },
    // 删除
    handleDeleteItem(arr, bindingId, index) {
      arr.forEach(it => {
        if (it.id == bindingId) {
          it.children.splice(index, 1);
          return;
        } else {
          if (it.children.length) {
            this.handleDeleteItem(it.children, bindingId, index);
          }
        }
      });
    },
    // 显隐控制
    handleRegItem() {
      this.regList = [];
      // 找到产生影响的字段
      // 找到styleJsonDto中display有值的，并且包装当前对象的id属性，
      // 返回的是数组，然后处理数组绑定的id值，改变需要隐藏的字段的display属性
      let nodeList = [];
      this.paramReportNode.forEach(it => {
        nodeList.push(...it.nodeValue);
      });
      this.findRegItem(nodeList);
    },
    findRegItem(arr) {
      arr.forEach(it => {
        if (!_.isEmpty(it.styleJsonDto) && it.styleJsonDto.display) {
          let obj = {};
          obj.id = it.id;
          obj.name = it.name;
          obj.nameKey = it.nameKey;
          obj.displayList = it.styleJsonDto.display.split("&&");
          if (!(this.paramReportType == 33 && it.nodeName != "总结与建议" && (it.type == "title" || it.type == "tip-text" || it.nameKey == "oil_err_img"))) {
            this.regList.push(obj);
          }
          if (it.children && it.children.length) {
            this.findRegItem(it.children);
          }
        } else {
          if (it.children && it.children.length) {
            this.findRegItem(it.children);
          }
        }
      });
    },
    find_report_item(arr, id, flag) {
      arr.forEach(it => {
        if (it.id == id) {
          it.display = flag;
          if (it.children.length) {
            this.find_report_item(it.children, id, flag);
          }
          return;
        } else {
          if (it.children.length) {
            this.find_report_item(it.children, id, flag);
          }
        }
      });
    },
    handleMultipleReg(nodeList, regIt) {
      let regArray = [];
      regIt.displayList.forEach(rg => {
        let flag;
        const regItem = rg.split(",");
        const effectId = regItem[0];
        const attributeName = regItem[1];
        const expression = regItem[2];
        const attributeVal = regItem[regItem.length - 1];
        this.effectItem = {};
        this.findEffectIdItem(nodeList, effectId);
        if (attributeVal.indexOf("|") > 0) {
          let arr = attributeVal.split("|");
          if (arr.includes(this.effectItem[attributeName])) {
            flag = true;
          } else {
            flag = false;
          }
        }
        if (expression == "<>") {
          flag = this.effectItem[attributeName].includes(attributeVal);
        }
        if (attributeVal.indexOf("|") == -1 && expression != "<>") {
          if (this.effectItem[attributeName].toString().indexOf("_") == -1 && attributeVal.indexOf("_") == -1 && this.effectItem[attributeName] && attributeVal) {
            let newAttributeVal = this.effectItem[attributeName];
            if (this.effectItem[attributeName] && this.effectItem[attributeName].toString().indexOf("-") > 0) {
              newAttributeVal = this.effectItem[attributeName].replace(/-/g, "");
            }
            let regStr = newAttributeVal + expression + attributeVal;
            flag = eval(regStr);
          } else {
            if (expression == "==") {
              flag = this.effectItem[attributeName] == attributeVal;
            } else if (expression == "!=") {
              flag = this.effectItem[attributeName] != attributeVal;
            }
          }
        }
        regArray.push(flag);
      });
      const resultFlag = eval(regArray.join("&&"));
      this.find_report_item(nodeList, regIt.id, resultFlag);
    },
    findEffectIdItem(arr, id) {
      arr.forEach(it => {
        if (it.id == id) {
          this.effectItem = it;
          if (it.children.length) {
            this.findEffectIdItem(it.children, id);
          }
          return;
        } else {
          if (it.children.length) {
            this.findEffectIdItem(it.children, id);
          }
        }
      });
    },
    // 组件触发事件，控制显隐模块
    handleHiddenOrShow(item) {
      let nodeList = [];
      this.paramReportNode.forEach(it => {
        nodeList.push(...it.nodeValue);
      });
      // lup_method: 解决轴承检查报告-设备&润滑&用油信息-润滑方式修改时影响轴承检查-润滑情况检查-检查项中项目的显隐
      // key_clxyxzt: 解决闭式齿轮检查报告-齿轮箱参数-齿轮运行状态修改时影响齿轮箱检查-箱体检查-检查项中项目的显隐
      // key_kscl_yxzt: 解决开式齿轮报告-开始齿轮检查-运行状态与箱体检查中的检查项联动
      if (item.nameKey == "lup_method" || item.nameKey == "key_clxyxzt" || item.nameKey == "key_kscl_yxzt") {
        this.handleNodeList(nodeList, item);
      }
      // 润滑脂加脂周期优化报告---总结建议中的在用油品名称更新
      if (this.paramReportType == 16 && item.nameKey == "lup_current_oil") {
        this.changeOtherNodeItem(nodeList, item);
      }
      this.displayItem = {};
      this.multipleRegList = [];
      this.regList.forEach(it => {
        // 表达式多于一个时，要全部先判断出表达式结果，&&后在判断
        // 单个表达式可用现在逻辑
        if (it.displayList.length > 1) {
          this.handleMultipleReg(nodeList, it);
        } else {
          const regAttributeList = it.displayList[0].split(",");
          const effectId = regAttributeList[0];
          const attributeName = regAttributeList[1];
          const expression = regAttributeList[2];
          const attributeVal = regAttributeList[regAttributeList.length - 1];
          this.handleRegToElement(effectId, attributeName, expression, attributeVal, _.cloneDeep(item), it, nodeList);
        }
      });
    },
    changeOtherNodeItem(list, item) {
      list.forEach(element => {
        if (element.nodeNo != item.nodeNo && element.nameKey == item.nameKey) {
          element.value = item.value;
        }
      });
    },
    handleNodeList(list, item) {
      list.forEach(element => {
        if (element.type == "checkbox") {
          if (element.fieldOption && element.fieldOption.length) {
            let __fieldOption = [];
            element.fieldOption.forEach(it => {
              if (it.display) {
                let displayList = it.display.split(",");
                if (displayList.length) {
                  if (displayList[3].indexOf("|") > 0) {
                    if (displayList[3].split("|").includes(item[displayList[1]])) {
                      __fieldOption.push(it);
                    }
                  } else {
                    if (item[displayList[1]] == displayList[3]) {
                      __fieldOption.push(it);
                    }
                  }
                }
              } else {
                __fieldOption.push(it);
              }
            });
            this.$set(element, "__fieldOption", __fieldOption);
          }
        } else {
          if (element.children && element.children.length) {
            this.handleNodeList(element.children, item);
          }
        }
      });
    },
    handleRegToElement(effectId, attributeName, expression, attributeVal, item, regItem, nodeList) {
      if (effectId == item.id) {
        if (attributeVal.indexOf("|") > 0) {
          let arr = attributeVal.split("|");
          if (arr.includes(item[attributeName])) {
            this.find_report_item(nodeList, regItem.id, true);
          } else {
            this.find_report_item(nodeList, regItem.id, false);
          }
        }
        if (expression == "<>") {
          let includeFlag = item[attributeName].includes(attributeVal);
          this.find_report_item(nodeList, regItem.id, includeFlag);
        }
        if (attributeVal.indexOf("|") == -1 && expression != "<>") {
          let flag;
          if (item[attributeName].toString().indexOf("_") == -1 && attributeVal.indexOf("_") == -1 && item[attributeName] && attributeVal) {
            let newAttributeVal = item[attributeName];
            if (item[attributeName] && item[attributeName].toString().indexOf("-") > 0) {
              newAttributeVal = item[attributeName].replace(/-/g, "");
            }
            let regStr = newAttributeVal + expression + attributeVal;
            flag = eval(regStr);
            this.find_report_item(nodeList, regItem.id, flag);
          } else {
            if (expression == "==") {
              flag = eval(item[attributeName] == attributeVal);
            } else if (expression == "!=") {
              flag = eval(item[attributeName] != attributeVal);
            }
            this.find_report_item(nodeList, regItem.id, flag);
          }
        }
      }
    },
    // 上传附件，找出当前id下的附件list
    findFileDtoItem(arr, bindingId) {
      arr.forEach(it => {
        if (it.id == bindingId) {
          this.fileDtoItem = it.serviceReportFileDtoList;
          return;
        } else {
          if (it.children.length) {
            this.findFileDtoItem(it.children, bindingId);
          }
        }
      });
    },
    // echarts图
    handleInputNumberBlur(item) {
      if (this.reportId == 8 && this.activeTab == "key_kscl_cljc" && item.nameKey == "position_key") {
        this.handleChartsCommon(item);
      }
    },
    handleChartsCommon(item) {
      const parentId = item.parentId;
      const data = this.paramReportNodeList.filter(it => {
        return it.nodeNo == 3 && it.nodeName == "开式齿轮检查";
      })[0].nodeValue;
      const tabData = data.filter(it => {
        return it.type == "tab" && it.nameKey == "key_kscl_cljc";
      })[0].children;
      this.chartData = [];
      this.chartParentNodeId = "";
      this.chartParentNodeData = [];
      this.positionList = [];
      this.findChartData(tabData, parentId);
      this.findParentNode(tabData, this.chartParentNodeId);
      this.findChartId(this.chartParentNodeData, "key_kscl_cljc_chilun_cmwd_line_small");
      this.initChart(this.chartId, item);
    },
    findChartId(arr, key) {
      arr.forEach(it => {
        if (it.nameKey == key) {
          this.chartId = it.id;
        } else {
          if (it.children.length) {
            this.findChartId(it.children, key);
          }
        }
      });
    },
    findChartData(arr, id) {
      arr.forEach(it => {
        if (it.id == id) {
          this.chartData = it.children;
          this.chartParentNodeId = it.parentId;
        } else {
          if (it.children.length) {
            this.findChartData(it.children, id);
          }
        }
      });
    },
    findParentNode(arr, parentNodeId) {
      arr.forEach(it => {
        if (it.id == parentNodeId) {
          this.chartParentNodeData = it.children;
        } else {
          if (it.children.length) {
            this.findParentNode(it.children, parentNodeId);
          }
        }
      });
    },
    initChart(chartId, item) {
      let positionData = [];
      let aAxis = [];
      if (item.nameKey == "position_key") {
        this.chartData.forEach((it, index) => {
          positionData.push(it.value);
          aAxis.push(index + 1);
        });
      } else {
        this.chartData.forEach(it => {
          it.children.forEach((c, index) => {
            positionData.push(c.value);
            aAxis.push(index + 1);
          });
        });
      }
      this.$nextTick(() => {
        const chart = `chart_${chartId}`;
        const myEchart = this.$echarts.init(document.getElementById(chart));
        let option = {
          xAxis: {
            name: "位置",
            type: "category",
            data: aAxis
          },
          yAxis: {
            name: "温度",
            type: "value"
          },
          series: [
            {
              data: positionData,
              type: "line",
              label: {
                show: true,
                position: "top",
                textStyle: {
                  fontSize: 16,
                  color: "#000"
                }
              }
            }
          ]
        };
        myEchart.clear();
        myEchart.setOption(option);
        this.$nextTick(() => {
          window.addEventListener("resize", () => {
            myEchart.resize();
          });
        });
        setTimeout(() => {
          var img = new Image();
          img.src = myEchart.getDataURL({
            pixelRatio: 2,
            backgroundColor: "#fff"
          });
          this.getHarfUrl(img.src);
        }, 1000);
      });
    },
    // 上传base64图片获取半路径
    getHarfUrl(src) {
      const params = {
        fileType: "oil_err_img",
        base64StringList: [src]
      };
      this.requestMethodPost("/weChat/common/uploadFilesByBase64", params).then(res => {
        if (res.data.code == 1000) {
          this.chartParentNodeData.forEach(it => {
            if (it.nameKey == "key_kscl_cljc_chilun_cmwd_line_small") {
              it.value = res.data.data[0];
            }
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 开式齿轮检查 bug:49025
    handleOpenGearDeviceAndOilInfo(arr) {
      //找出润滑方式,定期或按质1：定期，2：按质
      // lubrication_method_0002	飞溅/油浴
      // lubrication_method_0003	喷射
      // lubrication_method_0005	手刷
      let lupMethod = "";
      let regularOrQuality = "";
      let changeOilDate = ""; //换油周期
      let lastChangeOilDate = ""; //上次换油日期
      let addOilDate = ""; //加油周期
      let lastAddOilDate = ""; //上次加油日期
      let addFatDate = ""; //加脂周期
      let lastAddFatDate = ""; //上次加脂周期
      let isNextAddOilPlan = ""; //是否自动生成下次加油计划
      let isNextChnageOilPlan = ""; //是否自动生成下次换油计划
      let isNextAddFatPlan = ""; //是否自动生成下次加脂计划
      let addOilUnit = ""; //加油周期单位
      let changeOilUnit = ""; //换油周期单位
      let addFatUnit = ""; //加脂周期单位
      arr.forEach(it => {
        if (it.nameKey == "lup_method") {
          lupMethod = it.valueCode;
        }
        if (it.nameKey == "key_dq_az") {
          regularOrQuality = it.valueCode;
        }
        if (it.nameKey == "key_149_oil_change") {
          changeOilDate = it.value;
          changeOilUnit = it.unit;
        }
        if (it.nameKey == "lup_last_oil_change_date") {
          lastChangeOilDate = it.value;
        }
        if (it.nameKey == "key_add_oil_period" && it.id == "821") {
          addOilDate = it.value;
          addOilUnit = it.unit;
        }
        if (it.nameKey == "key_last_add_oil_date" && it.id == "822") {
          lastAddOilDate = it.value;
        }
        if (it.nameKey == "key_add_oil_period" && it.id == "793") {
          addFatDate = it.value;
          addFatUnit = it.unit;
        }
        if (it.nameKey == "key_last_add_oil_date" && it.id == "796") {
          lastAddFatDate = it.value;
        }
        if (it.nameKey == "sf_zdsc_xc_jyjh" && it.id == "826") {
          isNextAddOilPlan = it.value;
        }
        if (it.nameKey == "sf_zdsc_xc_hyjh" && it.id == "1195") {
          isNextChnageOilPlan = it.value;
        }
        if (it.nameKey == "sf_zdsc_xc_jyjh" && it.id == "1207") {
          isNextAddFatPlan = it.value;
        }
      });
      this.handlePlanItemShowOrHidden(
        arr,
        lupMethod,
        regularOrQuality,
        addOilDate,
        lastAddOilDate,
        isNextAddOilPlan,
        addOilUnit,
        changeOilDate,
        lastChangeOilDate,
        isNextChnageOilPlan,
        changeOilUnit,
        addFatDate,
        lastAddFatDate,
        isNextAddFatPlan,
        addFatUnit
      );
    },
    handlePlanItemShowOrHidden(
      arr,
      lupMethod,
      regularOrQuality,
      addOilDate,
      lastAddOilDate,
      isNextAddOilPlan,
      addOilUnit,
      changeOilDate,
      lastChangeOilDate,
      isNextChnageOilPlan,
      changeOilUnit,
      addFatDate,
      lastAddFatDate,
      isNextAddFatPlan,
      addFatUnit
    ) {
      arr.forEach(it => {
        if (it.nameKey == "key_schysjzl") {
          //上次换油时加注量
          it.display = lupMethod == "lubrication_method_0002" && lastChangeOilDate != "" && lupMethod != "lubrication_method_0005";
        }
        if (it.nameKey == "sf_zdsc_xc_jyjh" && it.id == "826") {
          //是否自动生成下次加油计划
          it.display = addOilDate != "" && lastAddOilDate != "" && addOilUnit != "公里" && (lupMethod == "lubrication_method_0002" || lupMethod == "lubrication_method_0003");
        }
        if (it.nameKey == "yj_xc_jyjh" && it.id == "825") {
          //预计下次加油日期
          it.display =
            addOilDate != "" && lastAddOilDate != "" && addOilUnit != "公里" && isNextAddOilPlan == "是" && (lupMethod == "lubrication_method_0002" || lupMethod == "lubrication_method_0003");
        }
        if (it.nameKey == "sf_zdsc_xc_hyjh") {
          //是否自动生成下次换油计划
          it.display = changeOilDate != "" && lastChangeOilDate != "" && changeOilUnit != "公里" && lupMethod == "lubrication_method_0002" && regularOrQuality == 1;
        }
        if (it.nameKey == "lup_next_scheduled_oil_change_date") {
          //预计下次换油日期
          it.display = changeOilDate != "" && lastChangeOilDate != "" && changeOilUnit != "公里" && isNextChnageOilPlan == "是" && lupMethod == "lubrication_method_0002" && regularOrQuality == 1;
        }
        if (it.nameKey == "sf_zdsc_xc_jyjh" && it.id == "1207") {
          //是否自动生成下次加脂计划
          it.display = addFatDate != "" && lastAddFatDate != "" && addFatUnit != "公里" && lupMethod == "lubrication_method_0005";
        }
        if (it.nameKey == "yj_xc_jyjh" && it.id == "797") {
          //预计下次加脂日期
          it.display = addFatDate != "" && lastAddFatDate != "" && addFatUnit != "公里" && isNextAddFatPlan == "是" && lupMethod == "lubrication_method_0005";
        }
      });
      this.$forceUpdate();
    },
    // 轴承检查
    handleBearingDeviceAndOilInfo(arr) {
      // bug:49298
      // 普通油类（飞溅/油浴、其他油润滑）：
      // ①上次换油时加注量：“上次换油日期”有值时，展示
      // 特殊油类（油雾）：
      // ①加油周期单位为“公里”：是否自动生成下次加油计划，预计下次加油日期，不展示
      // 脂类（手刷、滑脂枪、集中供脂、其他脂润滑）：
      // 无特殊字段展示逻辑
      // lubrication_method_0002	飞溅/油浴 lubrication_method_0008	其它油润滑
      // lubrication_method_0004	油雾
      let lupMethod = ""; //润滑方式
      let lastChangeOilDate = ""; //上次换油日期
      let addOilUnit = ""; //加油周期单位
      let nextAddOilPlan = ""; //是否自动生成下次加油计划
      arr.forEach(it => {
        if (it.nameKey == "lup_method") {
          lupMethod = it.valueCode;
        }
        if (it.nameKey == "lup_last_oil_change_date") {
          lastChangeOilDate = it.value;
        }
        if (it.nameKey == "key_add_oil_period") {
          addOilUnit = it.unit;
        }
        if (it.nameKey == "sf_zdsc_xc_jyjh") {
          nextAddOilPlan = it.value;
        }
      });
      arr.forEach(it => {
        if (it.nameKey == "key_schysjzl") {
          it.display = (lupMethod == "lubrication_method_0002" || lupMethod == "lubrication_method_0008") && lastChangeOilDate != "";
        }
        if (it.nameKey == "sf_zdsc_xc_jyjh") {
          it.display = lupMethod == "lubrication_method_0004" && addOilUnit != "公里";
        }
        if (it.nameKey == "yj_xc_jyjh") {
          it.display = lupMethod == "lubrication_method_0004" && addOilUnit != "公里" && nextAddOilPlan == "是";
        }
      });
    },
    // 设备润滑调查
    handlePlanStudyLupInfo(arr) {
      //找出润滑方式,定期或按质1：定期，2：按质
      // lubrication_method_0002	飞溅/油浴
      // lubrication_method_0003	喷射
      // lubrication_method_0005	手刷
      let lupMethod = "";
      let regularOrQuality = "";
      let changeOilDate = ""; //换油周期
      let lastChangeOilDate = ""; //上次换油日期
      let addOilDate = ""; //加油周期
      let lastAddOilDate = ""; //上次加油日期
      let addFatDate = ""; //加脂周期
      let lastAddFatDate = ""; //上次加脂周期
      let isNextAddOilPlan = ""; //是否自动生成下次加油计划
      let isNextChnageOilPlan = ""; //是否自动生成下次换油计划
      let isNextAddFatPlan = ""; //是否自动生成下次加脂计划
      let addOilUnit = ""; //加油周期单位
      let changeOilUnit = ""; //换油周期单位
      let addFatUnit = ""; //加脂周期单位
      let lupType = ""; //润滑点设备类型
      arr.forEach(it => {
        if (it.nameKey == "lup_type") {
          lupType = it.valueCode;
        }
        if (it.nameKey == "lup_method") {
          lupMethod = it.valueCode;
        }
        if (it.nameKey == "key_dq_az") {
          regularOrQuality = it.valueCode;
        }
        if (it.nameKey == "key_149_oil_change") {
          changeOilDate = it.value;
          changeOilUnit = it.unit;
        }
        if (it.nameKey == "lup_last_oil_change_date") {
          lastChangeOilDate = it.value;
        }
        if (it.nameKey == "key_add_oil_period" && it.id == "4816") {
          addOilDate = it.value;
          addOilUnit = it.unit;
        }
        if (it.nameKey == "key_last_add_oil_date" && it.id == "4818") {
          lastAddOilDate = it.value;
        }
        if (it.nameKey == "key_add_oil_period" && it.id == "4822") {
          addFatDate = it.value;
          addFatUnit = it.unit;
        }
        if (it.nameKey == "key_last_add_oil_date" && it.id == "4824") {
          lastAddFatDate = it.value;
        }
        if (it.nameKey == "sf_zdsc_xc_jyjh" && it.id == "4819") {
          isNextAddOilPlan = it.value;
        }
        if (it.nameKey == "sf_zdsc_xc_hyjh" && it.id == "4814") {
          isNextChnageOilPlan = it.value;
        }
        if (it.nameKey == "sf_zdsc_xc_jyjh" && it.id == "4825") {
          isNextAddFatPlan = it.value;
        }
      });
      arr.forEach(it => {
        if (it.nameKey == "key_dq_az") {
          //定期或按质换油
          it.display =
            lupMethod == "lubrication_method_0001" ||
            lupMethod == "lubrication_method_0002" ||
            (lupMethod == "lubrication_method_0003" && lupType != "lubrication_point_type_0011") ||
            lupMethod == "lubrication_method_0008";
        }
        if (it.nameKey == "lup_last_oil_change_date" || it.nameKey == "key_149_oil_change") {
          //上次换油日期,换油周期
          it.display = !(
            (lupMethod == "lubrication_method_0003" && lupType == "lubrication_point_type_0011") ||
            lupMethod == "lubrication_method_0004" ||
            lupMethod == "lubrication_method_0005" ||
            lupMethod == "lubrication_method_0006" ||
            lupMethod == "lubrication_method_0007" ||
            lupMethod == "lubrication_method_0009"
          );
        }
        if (
          (it.nameKey == "key_add_oil_period" && it.id == "4816") ||
          (it.nameKey == "key_every_time_add_num" && it.id == "4817") ||
          (it.nameKey == "key_last_add_oil_date" && it.id == "4818") ||
          (it.nameKey == "key_every_month_add_num" && it.id == "4821")
        ) {
          //加油周期,每次加油量,上次加油日期,每月润滑剂添加量
          it.display = lupMethod != "lubrication_method_0005" && lupMethod != "lubrication_method_0006" && lupMethod != "lubrication_method_0007" && lupMethod != "lubrication_method_0009";
        }
        if (it.nameKey == "key_schysjzl") {
          //上次换油时加注量
          it.display =
            lastChangeOilDate != "" &&
            lupMethod != "lubrication_method_0005" &&
            lupMethod != "lubrication_method_0006" &&
            lupMethod != "lubrication_method_0007" &&
            lupMethod != "lubrication_method_0009";
        }
        if (
          (it.nameKey == "key_add_oil_period" && it.id == "4822") ||
          (it.nameKey == "key_every_time_add_num" && it.id == "4823") ||
          (it.nameKey == "key_last_add_oil_date" && it.id == "4824") ||
          (it.nameKey == "key_every_month_add_num" && it.id == "4827")
        ) {
          //加脂周期,每次加脂量,上次加脂日期,每月滑脂添加量
          it.display = lupMethod == "lubrication_method_0005" || lupMethod == "lubrication_method_0006" || lupMethod == "lubrication_method_0007" || lupMethod == "lubrication_method_0009";
        }
        if (it.nameKey == "sf_zdsc_xc_jyjh" && it.id == "4819") {
          //是否自动生成下次加油计划
          it.display =
            addOilDate != "" &&
            lastAddOilDate != "" &&
            addOilUnit != "公里" &&
            (lupMethod != "lubrication_method_0005" && lupMethod != "lubrication_method_0006" && lupMethod != "lubrication_method_0007" && lupMethod != "lubrication_method_0009");
        }
        if (it.nameKey == "yj_xc_jyjh" && it.id == "4820") {
          //预计下次加油日期
          it.display =
            addOilDate != "" &&
            lastAddOilDate != "" &&
            addOilUnit != "公里" &&
            isNextAddOilPlan == "是" &&
            (lupMethod != "lubrication_method_0005" && lupMethod != "lubrication_method_0006" && lupMethod != "lubrication_method_0007" && lupMethod != "lubrication_method_0009");
        }
        if (it.nameKey == "sf_zdsc_xc_hyjh") {
          //是否自动生成下次换油计划
          it.display =
            changeOilDate != "" &&
            lastChangeOilDate != "" &&
            changeOilUnit != "公里" &&
            regularOrQuality == 1 &&
            (lupMethod != "lubrication_method_0005" && lupMethod != "lubrication_method_0006" && lupMethod != "lubrication_method_0007" && lupMethod != "lubrication_method_0009");
        }
        if (it.nameKey == "lup_next_scheduled_oil_change_date") {
          //预计下次换油日期
          it.display =
            changeOilDate != "" &&
            lastChangeOilDate != "" &&
            changeOilUnit != "公里" &&
            isNextChnageOilPlan == "是" &&
            regularOrQuality == 1 &&
            (lupMethod != "lubrication_method_0005" && lupMethod != "lubrication_method_0006" && lupMethod != "lubrication_method_0007" && lupMethod != "lubrication_method_0009");
        }
        if (it.nameKey == "sf_zdsc_xc_jyjh" && it.id == "4825") {
          //是否自动生成下次加脂计划
          it.display =
            addFatDate != "" &&
            lastAddFatDate != "" &&
            addFatUnit != "公里" &&
            (lupMethod == "lubrication_method_0005" || lupMethod == "lubrication_method_0006" || lupMethod == "lubrication_method_0007" || lupMethod == "lubrication_method_0009");
        }
        if (it.nameKey == "yj_xc_jyjh" && it.id == "4826") {
          //预计下次加脂日期
          it.display =
            addFatDate != "" &&
            lastAddFatDate != "" &&
            addFatUnit != "公里" &&
            isNextAddFatPlan == "是" &&
            (lupMethod == "lubrication_method_0005" || lupMethod == "lubrication_method_0006" || lupMethod == "lubrication_method_0007" || lupMethod == "lubrication_method_0009");
        }
      });
      this.$forceUpdate();
    }
  }
};
