<template>
    <v-container mt-5>
        <div v-if="$route.params.id">
            Ur mom super gay
        </div>
        <div v-else>
            Pick a guild first ^
        </div>
    </v-container>
</template>

<script>
export default {
  name: 'Dasboard'
}
</script>
