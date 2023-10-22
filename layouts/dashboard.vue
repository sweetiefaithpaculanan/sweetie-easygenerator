<template>
    <v-app>
        <v-container fluid>
            <Nuxt/>
        </v-container>
    </v-app>
</template>

<script>
export default {
  name: 'DashboardLayout',
  middleware: ["auth"]
}
</script>