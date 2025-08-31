<template>
	<v-container>
		<h2>
			<v-icon icon="mdi-vuetify" />
			Starter Template
		</h2>
		<h5>Nuxt 3 / Vuetify / Graphql / Pinia</h5>
		
		<!-- Navigation to SpaceX Launches -->
		<v-card class="my-6" elevation="2">
			<v-card-title>
				<v-icon icon="mdi-rocket-launch" class="mr-2" />
				SpaceX Mission Explorer
			</v-card-title>
			<v-card-text>
				<p class="mb-4">Explore all SpaceX launches with detailed mission information, launch dates, sites, and rocket details.</p>
				<NuxtLink to="/launches">
					<v-btn
						color="primary"
						size="large"
						prepend-icon="mdi-rocket"
						variant="elevated"
					>
						View All Launches
					</v-btn>
				</NuxtLink>
			</v-card-text>
		</v-card>

		<h3 class="my-5">
			Example Vuetify
			<v-chip color="blue">SimpleTable</v-chip>
			<v-chip color="orange">Data from spaceX graphql</v-chip>
		</h3>
		<p>There are {{ ships?.length || 0 }} ships.</p>
		<v-table>
			<thead>
				<tr>
					<th class="text-left">Name</th>
					<th class="text-left">Active</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="ship in ships" :key="ship.name">
					<td>{{ ship.name }}</td>
					<td>
						<v-chip :color="ship.active ? 'green' : 'red'">{{ ship.active }}</v-chip>
					</td>
				</tr>
			</tbody>
		</v-table>
	</v-container>
</template>
<script lang="ts" setup>
// Remove selection ref since we removed the chip group
// const selection = ref(0)
const query = gql`
	query getShips {
		ships {
			id
			name
			active
		}
	}
`
const { data } = useAsyncQuery<{
	ships: {
		id: string
		name: string
		active: boolean
	}[]
}>(query)
const ships = computed(() => data.value?.ships ?? [])
</script>
