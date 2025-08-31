<template>
	<v-app>
		<!-- App Bar for navigation -->
		<v-app-bar elevation="2" color="primary" class="px-4">
			<v-app-bar-title>
				<NuxtLink to="/" class="text-decoration-none text-white">
					<v-icon icon="mdi-rocket-launch" class="mr-2" />
					SpaceX Explorer
				</NuxtLink>
			</v-app-bar-title>
			
			<v-spacer />
			
			<!-- Navigation Component -->
			<AppNavigation />
		</v-app-bar>

		<!-- Global filter status -->
		<LaunchFilterStatus />

		<v-main>
			<slot />
		</v-main>

		<!-- Footer Component -->
		<AppFooter />
	</v-app>
</template>
<script lang="ts" setup>
// Set default layout meta
useHead({
	titleTemplate: '%s | SpaceX Explorer',
	meta: [
		{
			name: 'description',
			content: 'SpaceX Explorer - Browse launches, rockets, and mission data from SpaceX'
		},
		{
			property: 'og:site_name',
			content: 'SpaceX Explorer'
		},
		{
			name: 'theme-color',
			content: '#1976D2'
		}
	]
})
</script>

<style scoped>
.text-decoration-none {
	text-decoration: none;
}

/* Ensure footer stays at bottom */
.v-application {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

.v-main {
	flex: 1;
}
</style>
