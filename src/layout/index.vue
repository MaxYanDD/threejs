<template>
  <el-container class="app-container">
    <el-aside :width="sideBarWidth">
      <side-bar></side-bar>
    </el-aside>
    <el-container>
      <el-header>
        header
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import SideBar from './Sidebar/index'
import styleVariable from '@/styles/variables.scss'
export default {
  components: {
    SideBar
  },
  computed: {
    sideBarWidth() {
      return styleVariable.sideBarWidth
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
}
</style>
