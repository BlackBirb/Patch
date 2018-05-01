<template>
  <v-toolbar dense fixed flat class="white" wrap>
    <v-btn v-if="$route.path !== '/'" icon class="hidden-xs-only" to="/">
      <v-icon>arrow_back</v-icon>
    </v-btn>
    <v-icon v-else>home</v-icon>
    <v-toolbar-title class="mr-5">
        Patch
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items>
        <v-btn v-if="!logged" flat href="/api/login" v-bind:loading="logged === null">
          Login with Discord!
        </v-btn>
        <v-btn v-else flat to="/dashboard">Dashboard</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>

export default {
  name: 'Nav-Bar',
  computed: {
    logged: function () {
      return this.$store.state.logged
    }
  }
}
</script>

<style>
.guild-icon {
  border-radius: 50%;
}
</style>
