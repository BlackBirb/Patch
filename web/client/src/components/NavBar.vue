<template>
  <v-toolbar dense fixed flat class="white" wrap>
    <v-btn v-if="$route.path !== '/'" icon class="hidden-xs-only" to="/">
      <v-icon>arrow_back</v-icon>
    </v-btn>
    <v-icon v-else>home</v-icon>
    <v-toolbar-title class="mr-5">
        Patch
    </v-toolbar-title>
    <v-toolbar-items v-if="$route.path.startsWith('/dashboard')">
      <v-tabs v-if="guilds.length > 12">
        <v-tab flat v-for="guild of guilds" :key="guild.id" :to="'/dashboard/'+guild.id">
            <img v-bind:src="guild.iconUrl" v-bind:alt="guild.name" height="36" class="guild-icon mr-1">
            <v-card-text v-if="$route.params.id === guild.id">{{ guild.name }}</v-card-text>
        </v-tab>
      </v-tabs>
      <v-menu offset-y>
        <v-btn flat slot="activator">{{ findGuild($route.params.id).name  || "Select a Guild" }}</v-btn>
        <v-list>
          <v-list-tile v-for="guild in guilds" :key="guild.id" :to="'/dashboard/'+guild.id">
            <img v-bind:src="guild.iconUrl" v-bind:alt="guild.name" height="36" class="guild-icon mr-1">
            <v-list-tile-title>{{ guild.name }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
    <v-spacer />
    <v-toolbar-items>
        <v-btn v-if="!logged" flat href="/api/login" target="_blank" v-bind:loading="logged === null">
          Login with Discord!
        </v-btn>
        <v-btn v-else flat :to="'/dashboard'+(favGuild ? `/${favGuild}` : '') ">Dashboard</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>

export default {
  name: 'Nav-Bar',
  data () {
    return {
      guilds: [
        {
          id: '123123',
          iconUrl: 'https://cdn.discordapp.com/icons/264436678586925067/907bb93af780855db1ffab589a2fd853.webp',
          name: 'Some Dragon Serwer'
        }, {
          id: '321321',
          iconUrl: 'https://cdn.discordapp.com/icons/352404452029890570/a072fbebb6dc4be51b19c72cc952ea39.webp',
          name: 'CloudsdaleFM.net'
        }
      ]
    }
  },
  computed: {
    logged: function () {
      return this.$store.state.logged
    },
    favGuild: function () {
      return null // '123123'
    }
  },
  methods: {
    findGuild: function (id) {
      return this.guilds.find(e => e.id === id) || {name: false}
    }
  }
}
</script>

<style>
.guild-icon {
  border-radius: 50%;
}
</style>
