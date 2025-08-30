<template>
	<v-app>
		<!-- App Bar for navigation -->
		<v-app-bar elevation="2" color="primary">
			<v-app-bar-title>
				<NuxtLink to="/" class="text-decoration-none text-white">
					<v-icon icon="mdi-rocket-launch" class="mr-2" />
					SpaceX Explorer
				</NuxtLink>
			</v-app-bar-title>
			
			<v-spacer />
			
			<!-- Navigation Links -->
			<v-btn
				variant="text"
				:to="'/'"
				exact
				class="text-white"
			>
				<v-icon icon="mdi-home" class="mr-1" />
				Home
			</v-btn>
			
			<v-btn
				variant="text"
				:to="'/launches'"
				class="text-white"
			>
				<v-icon icon="mdi-rocket" class="mr-1" />
				Launches
			</v-btn>
		</v-app-bar>

		<!-- Global filter status -->
		<LaunchFilterStatus />

		<v-main>
			<slot />
		</v-main>
	</v-app>
</template>
<script>
export default {
	name: 'DefaultLayout',
}
</script>

<style scoped>
.text-decoration-none {
	text-decoration: none;
}
</style>
