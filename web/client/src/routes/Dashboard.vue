<template>
  <v-content>
    <v-container mt-5>
        <div v-if="$route.params.id && activeGuild()">
            Yeee... EEM?
        </div>
        <div v-else>
            Key
        </div>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: "Dasboard",
  beforeMount () {
    if (this.$store.state.logged === false) {
      this.$router.replace("/")
    } else if (this.$store.state.logged === true) {
      const length = this.$store.state.guilds.filter(g => g.common).length
      if (length === 1)
        this.router.replace(`/dashboard/${this.$store.state.guilds[0].id}`)
    }
  },
  methods: {
    activeGuild () {
      return (
        this.$store.state.guilds.find(g => g.id === this.$route.params.id) ||
        null
      )
    }
  }
}
</script>
