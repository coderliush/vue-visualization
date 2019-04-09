<template>
  <div class="side-bar" ref="wrapper">
    <div class="tree" :class="hideSideBar ? 'hideSideBar' : null">
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        hideSideBar: false,
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    async mounted() {
      this.$bus.$on('close', ()=> {
        this.hideSideBar = !this.hideSideBar
      })
      const res = await this.$http.getuser();
      const menus = res.apps[0].menus;
      const codes = menus.map(m=>m.menuCode);
      let allcodes = [{
          label: '1.0 锁生命周期管理',
          code : 'dmp_01',
          children: [{
            label: '1.1生命驾驶舱',code : 'dmp_01_01'
          }, {
            label: '1.2实时告警',code : 'dmp_01_02'
          }, {
            label: '1.3设备维修',code : 'dmp_01_03'
          }, {
            label: '1.4设备运维（待）',code : 'dmp_01_03'
          }]
        },
        // {
        //   label: '2.0 网关生命周期管理',
        //   children: [{
        //     label: '2.1生命驾驶舱',
        //   }, {
        //     label: '2.2实时告警'
        //   }, {
        //     label: '2.3设备维修'
        //   }, {
        //     label: '2.4设备运维（待）'
        //   }]
        // }, {
        //   label: '3.0 电表生命周期管理',
        //   children: [{
        //     label: '3.1生命驾驶舱',
        //   }, {
        //     label: '3.2实时告警',
        //   }, {
        //     label: '3.3设备维修'
        //   }, {
        //     label: '3.4设备运维（待）'
        //   }]
        // }, {
        //   label: '4.0 统一基础信息管理',
        //   children: [{
        //     label: '4.1生命驾驶舱',
        //   }, {
        //     label: '4.2实时告警',
        //   }, {
        //     label: '4.3设备维修'
        //   }, {
        //     label: '4.4设备运维（待）'
        //   }]
        // }
        ];
        // allcodes = allcodes.filter(m1=>m1.code&&codes.indexOf(m1.code)!=-1);
        // allcodes.forEach(m1=>{
        //   m1.children=m1.children.filter(m2=>m2.code&&codes.indexOf(m2.code)!=-1);
        // })
        this.data.push(...allcodes);
    },
    methods: {
      handleNodeClick(data) {
        
      },
    },
  };
</script>

<style scoped lang="stylus">
  @import '~styles/variable.styl'
  .hideSideBar
    width 0!important
    overflow hidden
    margin-right 0!important
    
  .side-bar
    margin-top 4px 
    display flex
    flex-direction column
    font-size $font-small
    .tree
      width 268px
      margin-right 10px
      height 100%
      flex 1
      background #1B405B
      transition all 0.3s linear
</style>

