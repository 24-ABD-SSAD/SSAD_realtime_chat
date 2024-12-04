<template>
  <el-config-provider :locale="en" namespace="ep">
    <Header/>
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
// import en from 'element-plus/lib/locale/lang/en'
import en from 'element-plus/es/locale/lang/en'
</script>

<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}

.element-plus-logo {
  width: 50%;
}
</style>
