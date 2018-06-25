<template>
  <v-footer height="auto">
    <v-layout flat row wrap class="text-xs-center">
      <v-flex>
        <v-card class="disable-select" color="teal lighten-3" @click.native="color = (color + 1) % colors.length">
          <v-card-text>
            <v-btn>
              Discord
            </v-btn>
            <v-btn href="https://github.com/BlackWolfff/Patch" target="_blank">
              Github
            </v-btn>
          </v-card-text>
          <v-card-text class="pt-0">
            <v-flex xs12>
              Patch as a haracter belongs to Magic3W, you can find her blog at
              <a href="http://ask.patch.cat/" target="_blank" class="patchUrl black--text"><strong>ask.patch.cat</strong></a>.
              <br>
              All art from this site can be found on her blog and belongs to it's owners. I do not claim any art as mine on this site.
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
  name: "Footer"
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
