<template>
  <component :is="$store.state.userHelpState" />
</template>

<script>
import Search from './userHelpDisplaySearch.vue'
import Content from './userHelpDisplayContent.vue'

export default {
  components: {
    Search,
    Content
  }
}
</script>
