<template>
  <v-toolbar dense fixed flat class="white" wrap>
    <v-btn v-if="$route.path !== '/'" icon class="hidden-xs-only" to="/">
      <v-icon>arrow_back</v-icon>
    </v-btn>
    <v-icon v-else>home</v-icon>
    <v-toolbar-title class="mr-5">
      Patch
    </v-toolbar-title>
    <v-btn v-for="route of routes" :key="route.name" :to="route.path" flat>{{ route.name }}</v-btn>
    <v-spacer />
    <v-toolbar-items v-if="!logged">
      <v-btn flat href="/api/login" v-bind:loading="logged === null">
        Login with Discord!
      </v-btn>
    </v-toolbar-items>
    <b-nav-menu v-else />
  </v-toolbar>
</template>

<script>
import NavMenu from '@/components/NavMenu'

export default {
  name: 'Nav-Bar',
  data () {
    return {
      routes: [
        { name: 'News', path: '/news' },
        { name: 'Commands', path: '/commands' },
        { name: 'Events', path: '/events' }
      ]
    }
  },
  computed: {
    logged: function () {
      return this.$store.state.logged
    }
  },
  components: {
    'b-nav-menu': NavMenu
  }
}
</script>

<style>
.guild-icon {
  border-radius: 50%;
}
</style>
