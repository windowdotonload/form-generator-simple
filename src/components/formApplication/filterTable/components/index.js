import { getOilCascadeMenu } from "../../api/index.js";

const iconConfig = {
  1: "el-icon-search",
  2: "el-icon-sort",
  3: "el-icon-sort",
  4: "el-icon-sort",
  5: "el-icon-sort",
  6: "el-icon-sort",
  7: "el-icon-sort",
  8: "el-icon-sort",
  9: "el-icon-sort",
  10: "el-icon-sort",
  11: "el-icon-sort"
};

const generateFilterComponent = generateInfo => {
  const componentType = generateInfo.colInfo.columnType;
  return Vue.extend({
    inject: ["recordTableFilterParams"],
    data() {
      return {
        oilList: [],
        searchOptions: [],
        searchValue: ""
      };
    },
    mounted() {
      this.getSelectOilSelectOptions();
      this.revertSearchValue();
    },
    methods: {
      async getSelectOilSelectOptions() {
        if (componentType != 9) return;
        const res = await getOilCascadeMenu();
        this.oilList = res;
      },
      revertSearchValue() {
        const revertSoucre = this.recordTableFilterParams.get(generateInfo.colInfo.columnUuid);
        if (!revertSoucre) return;
        const value = revertSoucre;
        if (value.valueStr) this.searchValue = value.valueStr;
        if (componentType == 5) {
          const curDate = Vue.prototype.moment(new Date().getTime()).format("YYYY-MM-DD");
          const startTime = new Date(`${curDate} ${value.startTime}`).getTime();
          const endTime = new Date(`${curDate} ${value.endTime}`).getTime();
          this.searchOptions = [startTime, endTime];
        }
        if (componentType == 6) {
          this.searchOptions = [new Date(value.startTime), new Date(value.endTime)];
        }
        if (componentType == 2 || componentType == 3 || componentType == 4 || componentType == 7 || componentType == 8 || componentType == 9) {
          this.searchOptions = value.valueStr ? value.valueStr.split(",") : [];
        }
      },
      changeValue(val) {
        if (Array.isArray(val)) return (this.searchOptions = val);
        this.searchValue = val;
      },
      filter() {
        this.$parent.$parent.confirmFilter(
          {
            searchValue: this.searchValue,
            searchOptions: this.searchOptions
          },
          generateInfo
        );
      },
      clearFilter() {
        this.searchOptions = "";
        this.searchValue = "";
        if (componentType == 5 || componentType == 6 || componentType == 2 || componentType == 3 || componentType == 4 || componentType == 7 || componentType == 8 || componentType == 9) {
          this.searchOptions = [];
        }
        this.$parent.$parent.clearFilter(generateInfo);
      }
    },
    render() {
      switch (componentType) {
        case 1:
          return (
            <div>
              <el-input size="mini" placeholder="请输入" onInput={this.changeValue} value={this.searchValue} />
              <div style="margin-top:10px;float:right">
                <el-button size="mini" type="text" onClick={this.clearFilter} style="color:#000">
                  清空
                </el-button>
                <el-button size="mini" type="danger" onClick={this.filter}>
                  确定
                </el-button>
              </div>
            </div>
          );
        case 2:
        case 3:
        case 4:
          const options = JSON.parse(generateInfo.colInfo.options);
          return (
            <div>
              <el-checkbox-group value={this.searchOptions} style="display:flex;flex-wrap:wrap" onInput={this.changeValue}>
                {options.map(item => {
                  return (
                    <el-checkbox label={item.value} key={item.value} style="width:100%">
                      {item.value}
                    </el-checkbox>
                  );
                })}
              </el-checkbox-group>
              <div style="margin-top:10px;float:right">
                <el-button size="mini" type="text" onClick={this.clearFilter} style="color:#000">
                  清空
                </el-button>
                <el-button size="mini" type="danger" onClick={this.filter}>
                  确定
                </el-button>
              </div>
            </div>
          );
        case 5:
          return (
            <div style="position:relative;">
              <el-time-picker
                style="width:100%"
                size="mini"
                is-range
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                clearable={false}
                value={this.searchOptions}
                on-focus={() => (this.searchOptions = [new Date(), new Date()])}
                onInput={e => {
                  this.searchOptions = [new Date(e[0]), new Date(e[1])];
                }}
              />
              <div style="margin-top:10px;float:right">
                <el-button size="mini" type="text" onClick={this.clearFilter} style="color:#000">
                  清空
                </el-button>
                <el-button size="mini" type="danger" onClick={this.filter}>
                  确定
                </el-button>
              </div>
            </div>
          );
        case 6:
          return (
            <div style="position:relative;">
              <el-date-picker
                style="width:100%"
                size="mini"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value={this.searchOptions}
                onInput={this.changeValue}
              />
              <div style="margin-top:10px;float:right">
                <el-button size="mini" type="text" onClick={this.clearFilter} style="color:#000">
                  清空
                </el-button>
                <el-button size="mini" type="danger" onClick={this.filter}>
                  确定
                </el-button>
              </div>
            </div>
          );
        case 7:
        case 8:
          const fileStatusOptions = [{ value: "1", label: "已上传" }, { value: "0", label: "未上传" }];
          return (
            <div>
              <el-checkbox-group value={this.searchOptions} style="display:flex;flex-wrap:wrap" onInput={this.changeValue}>
                {fileStatusOptions.map(item => {
                  return (
                    <el-checkbox label={item.value} key={item.value} style="width:100%">
                      {item.label}
                    </el-checkbox>
                  );
                })}
              </el-checkbox-group>
              <div style="margin-top:10px;float:right">
                <el-button size="mini" type="text" onClick={this.clearFilter} style="color:#000">
                  清空
                </el-button>
                <el-button size="mini" type="danger" onClick={this.filter}>
                  确定
                </el-button>
              </div>
            </div>
          );
        case 9:
          return (
            <div>
              <el-select 
               size="small"
               multiple 
               placeholder="请选择" 
               clearable 
               collapse-tags 
               filterable 
               remote
               onRemote={this.getOilCascadeMenu}
               options={this.oilList.value}
               value={this.searchOptions} 
               onChange={this.changeValue}
               style="width:100%">
                {this.oilList.value&&this.oilList.value
                .map(item => {
                  return <el-option key={item.code} label={item.oilAlias || item.name} value={item.code} />;
                })}
              </el-select>
              <div style="margin-top:10px;float:right">
                <el-button size="mini" type="text" onClick={this.clearFilter} style="color:#000">
                  清空
                </el-button>
                <el-button size="mini" type="danger" onClick={this.filter}>
                  确定
                </el-button>
              </div>
            </div>
          );
      }
    }
  });
};

export const createFilterIcon = item => {
  return Vue.extend({
    methods: {
      confirmFilter(searchInfo, filterCol) {
        if (searchInfo.searchValue === "" && searchInfo.searchOptions && searchInfo.searchOptions.length === 0) return;
        const colInfo = filterCol.colInfo;
        let parent = this.$parent;
        while (!parent.filterMethod && parent.$parent && parent) {
          parent = parent.$parent;
        }
        parent.filterMethod && parent.filterMethod(searchInfo, filterCol);
      },
      clearFilter(filterCol) {
        let parent = this.$parent;
        while (!parent.clearFilterMethod && parent.$parent && parent) {
          parent = parent.$parent;
        }
        parent.clearFilterMethod && parent.clearFilterMethod(filterCol);
      },
      popoverShow() {
        this.$refs[item.colInfo.columnUuid].revertSearchValue();
      }
    },
    render() {
      const FilterComponent = generateFilterComponent(item);
      return (
        <el-popover placement="bottom" width="200" trigger="click" ref="filterPopover" on-show={this.popoverShow}>
          <div class="form-filter-header-filter-icon" slot="reference">
            <i class={iconConfig[item.colInfo.columnType]} />
          </div>
          <div>
            <FilterComponent ref={item.colInfo.columnUuid} />
          </div>
        </el-popover>
      );
    }
  });
};
