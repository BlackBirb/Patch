<template>
  <v-content>
    <NavBarDashboard />
    <v-container mt-5>
        <div v-if="$route.params.id && activeGuild()">
            Yeee... EEM?
        </div>
        <div v-else>
            Pick a guild first ^
        </div>
    </v-container>
  </v-content>
</template>

<script>
import NavBarDashboard from '@/components/NavBarDashboard'
import Footer from '@/components/Footer'

export default {
  name: "Dasboard",
  beforeMount: function() {
    console.log("Mounted fired")
    console.dir(this.$store)
    if (this.$store.state.logged === false) {
      this.$router.replace("/")
    } else if (this.$store.state.logged === true) {
      const length = this.$store.state.guilds.filter(g => g.common).length
      if (length === 1)
        this.router.replace(`/dashboard/${this.$store.state.guilds[0].id}`)
    }
  },
  components: {
    NavBarDashboard,
    Footer
  },
  methods: {
    activeGuild() {
      return (
        this.$store.state.guilds.find(g => g.id === this.$route.params.id) ||
        null
      )
    }
  }
}
</script>
