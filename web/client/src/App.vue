<template>
  <div id="app">
    <v-app>
      <Nav-Bar />
      <router-view v-if="isLogged"/>
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
import NavBar from '@/components/NavBar'

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
  components: {
    NavBar
  },
  computed: {
    randLoading() {
      return this.messages[Math.floor(Math.random() * this.messages.length)] + "..."
    },
    isLogged() {
      return this.$store.state.logged !== null
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
.btn__no-uppercase {
  text-transform: none !important;
}

#app {
  margin-top: 48px;
}

.fix-image {
  object-fit: contain;
  max-width: 100%;
}

hr {
  margin: 1em auto;
}

hr.xs {
  width: 20%;
}

hr.align-right {
  margin: 1em 4px 1em auto;
}

hr.align-left {
  margin: 1em auto 1em 4px;
}

a {
  text-decoration: none;
}

</style>
