<template>
  <div class="settings-view">
    <SettingsPanel />
  </div>
</template>

<script>
import SettingsPanel from '../components/SettingsPanel.vue';

export default {
  name: 'SettingsView',
  components: {
    SettingsPanel
  }
}
</script>

<style scoped>
.settings-view {
  min-height: 80vh;
  padding: 1rem;
}
</style>
