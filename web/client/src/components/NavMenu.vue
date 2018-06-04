<template>
  <v-toolbar-items>
    <v-btn
      flat
      ref="activator"
      :ripple="false"
      :class="activatorClass"
      @mouseover="show('btn')"
      @mouseout="hide('btn')"
    >
      <img v-if="$store.state.avatarUrl" :src="$store.state.avatarUrl+'?size=64'" alt="avatar" class="nav-menu-user-avatar mr-1">
      {{ $store.state.username }}#{{ $store.state.discriminator }}
      <v-icon>keyboard_arrow_down</v-icon>
    </v-btn>
    <v-card
      :class="[ 'nav-menu-items', active ? 'active' : null ]"
      :style="contentStyle"
      @mouseover="show('c')"
      @mouseout="hide('c')"
    >
      <v-list>
        <v-list-tile @click="moveTo('dashboard')">
          <v-list-tile-title>Dashboard</v-list-tile-title>
        </v-list-tile>
      </v-list>
      <v-card-actions class="align-center justify-center">
        <v-btn to="/api/logout" flat class="nav-menu-btn" color="error">Logout</v-btn>
      </v-card-actions>
    </v-card>
  </v-toolbar-items>
</template>

<script>
export default {
  name: 'b-nav-menu',
  data () {
    return {
      btnActive: false,
      cActive: false,
      width: 0
    }
  },
  methods: {
    moveTo (route) {
      this.btnActive = false
      this.cActive = false
      if (this.$route.name !== 'Dashboard')
        this.$router.push(route)
    },
    show (target) {
      this[target + 'Active'] = true
    },
    hide (target) {
      this[target + 'Active'] = false
    }
  },
  mounted () {
    this.width = this.$refs.activator.$el.clientWidth
  },
  computed: {
    active () {
      return this.btnActive || this.cActive
    },
    activatorClass () {
      let classes = [
        'btn__no-uppercase',
        'nav-menu-activator',
        'px-4'
      ]
      if (this.active) return classes.concat([ 'blue', 'lighten-3' ])
      return classes
    },
    contentStyle () {
      return {
        width: this.width + 'px !important'
      }
    }
  }
}
</script>

<style>
.nav-menu-activator:hover > .btn__content::before {
  background-color: transparent !important;
}

.nav-menu-items.active {
  opacity: 1;
  transform: translateY(0px);
  pointer-events: auto;
}

.nav-menu-user-avatar {
  border-radius: 100%;
  object-fit: contain;
  max-width: 100%;
  max-height: 80%;
}

.nav-menu-items {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-5px);
  transition-duration: .1s;
  transition-property: opacity, transform;
  position: absolute;
  min-width: 50px;
  top: 48px;
}

.nav-menu-btn {
  height: 32px !important;
}
</style>
