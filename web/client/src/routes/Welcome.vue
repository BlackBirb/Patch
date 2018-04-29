<template>
  <v-jumbotron height="100%" class="white">
    <v-container fill-height fluid text-xs-center>
      <v-layout pt-5 class="background" row wrap>
        <v-flex>
          <h3 class="display-3">{{ name }}</h3>
          <div class="title mb-3">{{ welcome }}</div>
          <div>
            <v-btn large class="blue lighten-1" dark href="https://discordapp.com/oauth2/authorize?client_id=207051061213528064&scope=bot&permissions=104188992" target="_blank">Add me to your Discord!</v-btn>
            <v-btn large class="light-blue darken-4" dark>I like reading</v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-jumbotron>
</template>

<script>
export default {
  name: 'Welcome-Page',
  data () {
    return {
      messages: [
        'is trying her best!',
        'just another Discord bot',
        'Everything for you!',
        'has stopped working',
        'is so avesome',
        'is not amused',
        'What to write here? It\'s just avesome bot!'
      ]
    }
  },
  computed: {
    welcome: function () {
      return this.messages[Math.floor(Math.random() * this.messages.length)]
    },
    name: function () {
      return Math.random() > 0.95 ? 'Squeak!' : 'Patch'
    }
  }
}
</script>

<style>
.jumbotron__background {
  background-image: url("../assets/bgv2.png");
  background-size: cover;
}
</style>
