<template>
  <v-content>
    <v-jumbotron height="700px" class="white curved-edge" :src="randomBg">
      <v-container fill-height fluid text-xs-center>
        <v-layout pt-3 class="background" row wrap>
          <v-flex>
            <h3 class="display-3">{{ name }}</h3>
            <div class="title mb-3 grey--text text--darken-3">{{ welcome }}</div>
            <div>
              <v-btn large class="blue lighten-1" dark href="https://discordapp.com/oauth2/authorize?client_id=207051061213528064&scope=bot&permissions=104188992" target="_blank">Add me to your Discord!</v-btn>
              <v-btn large class="light-blue darken-4" dark @click="$vuetify.goTo(scrollTarget, scrollOptions)">I like reading</v-btn>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
    <v-container fluid>
      <v-layout id="info" column>
        <v-flex xs12 my-4 text-xs-center>
          <h1 class="display-1">Make your discord server 100x better!</h1>
          <span class="body-1 grey--text text--darken-1">Ok maybe I'm not that good, but you can be sure you won't regret inviting me!</span>
          <hr class="xs">
        </v-flex>
        
        <v-layout row wrap>
          <v-flex md4 mt-5 offset-md1 text-xs-right>
            <h1 class="headline mb-1">I'm really fast!</h1>
            <hr class="xs align-right">
            <p class="grey--text text--darken-2">
              I'm all about fast, easy and intuitive usage.<br />
              
            </p>
          </v-flex>
          <v-flex md4 offset-md2>
            <img class="fix-image" src="@/assets/img/p-speed.png" style="max-height: 440px;" alt="Patch Speed">
          </v-flex>
        </v-layout>
        
        <v-layout mb-4 row wrap>
          <v-flex xs12 sm6 md5 offset-md1>
            <img class="fix-image" src="@/assets/img/p-deprecated.png" alt="Patch Deprecated">
            </v-flex>
          <v-flex xs12 sm6 md4 mt-5>
            <h1 class="headline black--text mb-1">Full time support!</h1>
            <hr class="xs align-left">
            <p>
              Someone is constantly watching me, making sure everything works, cleaning my fur and... don't let me sleep.<br />
              But at least I'm getting new features and my uptime is over 99% of the time!<br />
              That also means there's always someone ready to help you in case anything happens.<br />
              They really don't want me to get old...
            </p>
          </v-flex>
        </v-layout>

        <v-layout mb-4 row wrap>
          <v-flex xs12 sm6 md4 mt-5 offset-md1 text-xs-right>
            <h1 class="headline mb-1">Music!</h1>
            <hr class="xs align-right">
            <p class="grey--text text--darken-2">
              You like listening music with your friends but don't want to spend money?<br />
              Then you're lucky, I can do just that for free and with really good quality!<br />
              At least good for discord bot standards...
            </p>
          </v-flex>
          <v-flex xs12 sm6 md5>
            <img class="fix-image" src="@/assets/img/p-music.gif" alt="Patch Music">
          </v-flex>
        </v-layout>

        <v-layout mb-4 row wrap>
          <v-flex xs12 sm6 md5 offset-md1>
            <img src="@/assets/img/p-opensource.png" alt="Patch Open Source" class="fix-image">
          </v-flex>
          <v-flex xs12 sm6 md5 mt-5>
            <h1 class="headline mb-1">Open Source!</h1>
            <hr class="xs align-left">
            <p class="grey--text text--darken-2">
              You like looking into someone else code?<br />
              Well that's rude but now you can, I'm fully open source!<br />
              You can find me <a href="https://github.com/BlackWolfff/Patch" target="_blank">here</a> but please don't do anything weird...
            </p>
          </v-flex>
        </v-layout>

        <v-flex xs12 my-5 text-xs-center>
          <h1 class="display-2">You don't believe me?</h1>
          <v-btn large class="blue lighten-1" dark href="https://discordapp.com/oauth2/authorize?client_id=207051061213528064&scope=bot&permissions=104188992" target="_blank">Try out yourself!</v-btn>
        </v-flex>

      </v-layout>
    </v-container>
    <Footer />
  </v-content>
</template>

<script>
import Footer from '@/components/Footer'

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
        'What to write here? It\'s just avesome bot!',
        'Cookies! Now!'
      ]
    }
  },
  components: {
    Footer
  },
  computed: {
    welcome: function () {
      return this.messages[Math.floor(Math.random() * this.messages.length)]
    },
    name: function () {
      return Math.random() > 0.95 ? 'Squeak!' : 'Patch'
    },
    scrollTarget: function () {
      return "#info" // this.$refs.info
    },
    scrollOptions: function () {
      return {
        duration: 500,
        offset: -50,
        easing: "easeInOutQuad"
      }
    },
    randomBg: function () {
      return require(`@/assets/WelcomeBG/bgv${Math.floor(Math.random() * 14) + 1}.png`)
    }
  }
}
</script>

<style>
.curved-edge::after {
  position: absolute;
  content: " ";
  display: block;
  left: 0;
  transform: translateY(-20px);
  width: 100%;
  border-style: solid;
  border-width: 0px 100vw 20px 0;
  border-color: transparent transparent #fafafa transparent;
}
</style>
