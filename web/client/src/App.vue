<template>
  <div id="app">
    <v-app>
      <router-view v-if="$store.state.logged !== null"/>
      <v-content v-else>
        <v-container fill-height>
          <v-layout column justify-center align-center>
            <h1 class="display-4">{{ randLoading }}</h1>
            <p>Please wait</p>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      messages: [
        "Loading",
        "Logging in",
        "Hacking",
        "Debugging",
        "Trying",
        "Something"
      ]
    }
  },
  computed: {
    randLoading: function() {
      return this.messages[Math.floor(Math.random() * this.messages.length)] + "..."
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
</style>
