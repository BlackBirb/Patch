<template>
  <v-footer height="auto">
    <v-layout flat row wrap class="text-xs-center">
      <v-flex>
        <v-card class="disable-select" ripple :color="colors[color]" @click.native="color = (color + 1) % colors.length">
          <v-card-text>
            <v-btn :ripple="false">
              Discord
            </v-btn>
            <v-btn :ripple="false" href="https://github.com/BlackWolfff/Patch" target="_blank">
              Github
            </v-btn>
          </v-card-text>
          <v-card-text class="pt-0">
            <v-flex xs12>
              Patch as a haracter belongs to Magic3W, you can find her blog at
              <a href="http://ask.patch.cat/" target="_blank" class="patchUrl black--text"><strong>ask.patch.cat</strong></a>.
              <br>
              All art from this site can be found on her blog and belongs to it's owners. I do not own any art that is on this site... Please don't sue me.
            </v-flex>
            <v-flex>
              &copy;2018 — <strong>BlackBird</strong>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      color: 0,
      colors: [
        'teal lighten-3',
        'teal lighten-2'
      ]
    }
  }
}

</script>

<style>
.patchUrl {
  text-decoration: none;
  padding: 1px;
}
.patchUrl:hover {
  text-decoration: underline;
}
.disable-select {
  user-select: none;
}
</style>
