<template>
  <v-toolbar dense fixed flat class="white" wrap>
    <v-btn icon class="hidden-xs-only" to="/">
      <v-icon>arrow_back</v-icon>
    </v-btn>
    <v-toolbar-title class="mr-5">
        Patch
    </v-toolbar-title>

    <v-toolbar-items>
      <v-tabs v-if="commonGuilds.length <= 1">
        <v-tab flat v-for="guild of commonGuilds" :key="guild.id" :to="'/dashboard/'+guild.id">
            <img v-bind:src="guild.iconUrl" alt="icon" height="36" class="guild-icon mr-1">
            <v-card-text v-if="$route.params.id === guild.id">{{ guild.name }}</v-card-text>
        </v-tab>
      </v-tabs>
      <v-menu v-else offset-y max-height="calc(100% - 100px)">
        <v-btn flat slot="activator">
          <img v-if="findGuild($route.params.id).iconUrl" v-bind:src="findGuild($route.params.id).iconUrl" alt="icon" height="36" class="guild-icon mr-1">
          {{ findGuild($route.params.id).name  || "Select a Guild" }}
        </v-btn>
        <v-list dense>
          <v-list-tile v-for="guild in commonGuilds" :key="guild.id" :to="'/dashboard/'+guild.id">
            <img v-bind:src="guild.iconUrl" alt="icon" height="36" class="guild-icon mr-1">
            <v-list-tile-title>{{ guild.name }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-menu offset-y max-height="calc(100% - 100px)">
        <v-btn flat dense class="hidden-xs-only" slot="activator">
          <v-icon>add</v-icon>
        </v-btn>
        <v-list dense id="addGuilds">
            <v-list-tile v-for="guild in invitableGuilds" :key="guild.id" id="addGuilds" :href="inviteTo(guild.id)">
              <img v-bind:src="guild.iconUrl" alt="icon" height="36" class="guild-icon mr-1">
              <v-list-tile-title>{{ guild.name }}</v-list-tile-title>
            </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>

    <v-spacer />

    <v-toolbar-items>
        <v-btn flat to="/dashboard">Dashboard</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>

export default {
  name: 'Nav-Bar-Dashboard',
  computed: {
    guilds: function () {
      return this.$store.state.logged ? this.$store.state.guilds : []
    },
    commonGuilds: function() {
      return this.guilds.filter(guild => guild.common)
    },
    invitableGuilds: function() {
      return this.guilds.filter(guild => !guild.common && guild.canInvite)
    },
    logged: function () {
      return this.$store.state.logged
    }
  },
  methods: {
    findGuild: function (id) {
      return this.guilds.find(e => e.id === id) || { name: false }
    },
    addGuild: function () {
      console.log("Later")
    },
    inviteTo: function (id) { // finish
      return `https://discordapp.com/oauth2/authorize?client_id=207051061213528064&scope=bot&permissions=104188992&guild_id=${id}`
    }
  }
}
</script>

<style>
.guild-icon {
  border-radius: 50%;
}
</style>
