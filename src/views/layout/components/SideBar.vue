<template>
  <div class="side-bar">
    <div class="tree" ref="tree">
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: [{
          label: '1.0 锁生命周期管理',
          children: [{
            label: '1.1生命驾驶舱',
          }, {
            label: '1.2实时告警',
          }, {
            label: '1.3设备维修'
          }, {
            label: '1.4设备运维（待）'
          }]
        },{
          label: '2.0 网关生命周期管理',
          children: [{
            label: '2.1生命驾驶舱',
          }, {
            label: '2.2实时告警'
          }, {
            label: '2.3设备维修'
          }, {
            label: '2.4设备运维（待）'
          }]
        }, {
          label: '3.0 电表生命周期管理',
          children: [{
            label: '3.1生命驾驶舱',
          }, {
            label: '3.2实时告警',
          }, {
            label: '3.3设备维修'
          }, {
            label: '3.4设备运维（待）'
          }]
        }, {
          label: '4.0 统一基础信息管理',
          children: [{
            label: '4.1生命驾驶舱',
          }, {
            label: '4.2实时告警',
          }, {
            label: '4.3设备维修'
          }, {
            label: '4.4设备运维（待）'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    methods: {
      handleNodeClick(data) {
        
      },
      close() {
        this.$refs.tree.classList.add('close')
      }
    },
  };
</script>

<style scoped lang="stylus">
  @import '~styles/variable.styl'
  .close
    width 0
    transform translate all 1s
  .side-bar
    width 267px
    height 100%
    margin-top 4px
    display flex
    flex-direction column
    font-size $font-small
    .tree
      height 100%
      padding 4px
      flex 1
      background #1B405B
</style>

