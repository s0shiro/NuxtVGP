<template>
	<v-container>
		<!-- Next Launch Countdown -->
		<v-card class="my-6" elevation="3" v-if="nextLaunch">
			<v-card-title class="bg-primary text-white">
				<v-icon icon="mdi-timer-outline" class="mr-2" />
				Next SpaceX Launch Countdown
			</v-card-title>
			<v-card-text class="pa-4">
				<div class="d-flex flex-column align-center">
					<h3 class="text-h5 font-weight-bold mb-3">{{ nextLaunch.mission_name }}</h3>
					
					<!-- Only show rocket info if available -->
					<p v-if="nextLaunch.rocket?.rocket_name" class="text-subtitle-1 mb-4">
						<v-icon icon="mdi-rocket" class="mr-1" />
						{{ nextLaunch.rocket.rocket_name }}
					</p>
					
					<!-- Launch date -->
					<p class="text-subtitle-2 mb-4">
						<v-icon icon="mdi-calendar" class="mr-1" />
						{{ formatLaunchDate(nextLaunch.launch_date_utc, 'Date TBD') }}
					</p>
					
					<!-- Countdown timer -->
					<v-row class="countdown-timer text-center my-4">
						<v-col v-for="(unit, index) in countdownUnits" :key="index">
							<v-card class="pa-2" elevation="2" min-width="80">
								<div class="text-h4 font-weight-bold">{{ unit.value }}</div>
								<div class="text-caption">{{ unit.label }}</div>
							</v-card>
						</v-col>
					</v-row>
					
					<!-- Mission details (explicitly kept as requested) -->
					<p v-if="nextLaunch.details" class="text-body-2 text-center">
						{{ nextLaunch.details }}
					</p>
					<p v-else class="text-body-2 text-center text-grey">
						Mission details not available yet
					</p>
					
					<!-- Action buttons -->
					<div class="d-flex mt-4">
						<v-btn 
							v-if="nextLaunch.links?.video_link" 
							color="red" 
							class="mx-2"
							:href="nextLaunch.links.video_link"
							target="_blank"
							variant="elevated"
							prepend-icon="mdi-youtube"
						>
							Watch
						</v-btn>
						<v-btn 
							v-if="nextLaunch.links?.article_link" 
							color="blue" 
							class="mx-2"
							:href="nextLaunch.links.article_link"
							target="_blank"
							variant="elevated"
							prepend-icon="mdi-newspaper"
						>
							Read Article
						</v-btn>
					</div>
				</div>
			</v-card-text>
		</v-card>

		<!-- SpaceX Ships Table -->
		<v-card class="my-6" elevation="2">
			<v-card-title>
				<v-icon icon="mdi-ship-wheel" class="mr-2" />
				SpaceX Fleet Overview
				<v-chip color="blue" class="ml-2">Ships</v-chip>
			</v-card-title>
			<v-card-text>
				<p class="mb-4">Discover the impressive fleet of ships that support SpaceX missions.</p>
				<p class="text-caption">Total ships: {{ ships?.length || 0 }}</p>
				<v-table density="comfortable">
					<thead>
						<tr>
							<th class="text-left">Name</th>
							<th class="text-left">Type</th>
							<th class="text-left">Home Port</th>
							<th class="text-left">Year Built</th>
							<th class="text-left">Status</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="ship in ships" :key="ship.id">
							<td>
								<v-icon icon="mdi-ship-side" class="mr-2" />
								{{ ship.name }}
							</td>
							<td>{{ ship.type || 'N/A' }}</td>
							<td>{{ ship.home_port || 'N/A' }}</td>
							<td>{{ ship.year_built || 'N/A' }}</td>
							<td>
								<v-chip 
									:color="ship.active ? 'success' : 'error'" 
									size="small"
									variant="flat"
								>
									<v-icon :icon="ship.active ? 'mdi-check-circle' : 'mdi-close-circle'" size="small" class="mr-1" />
									{{ ship.active ? 'Active' : 'Inactive' }}
								</v-chip>
							</td>
						</tr>
					</tbody>
				</v-table>
			</v-card-text>
		</v-card>
	</v-container>
</template>
<script lang="ts" setup>
// Queries
const shipsQuery = gql`
	query getShips {
		ships {
			id
			name
			active
			home_port
			type
			year_built
		}
	}
`

const nextLaunchQuery = gql`
	query LaunchNext {
		launchesUpcoming(limit: 1) {
			details
			id
			launch_date_local
			launch_date_unix
			launch_date_utc
			launch_year
			links {
				article_link
				video_link
			}
			mission_name
			rocket {
				rocket_name
			}
			upcoming
		}
	}
`

// Fetch ships data
const { data: shipsData } = useAsyncQuery<{
	ships: {
		id: string
		name: string
		active: boolean
		home_port: string | null
		type: string | null
		year_built: number | null
	}[]
}>(shipsQuery)

// Define type for launch data
interface LaunchNextType {
	launchesUpcoming: Array<{
		details: string | null
		id: string
		launch_date_local: string
		launch_date_unix: number
		launch_date_utc: string
		launch_year: string
		links: {
			article_link: string | null
			video_link: string | null
		} | null
		mission_name: string
		rocket: {
			rocket_name: string
		} | null
		upcoming: boolean
	}>
}

// Fetch next launch data
const { data: launchData } = useAsyncQuery<LaunchNextType>(nextLaunchQuery)

// Computed properties
const ships = computed(() => shipsData.value?.ships ?? [])
const nextLaunch = computed(() => launchData.value?.launchesUpcoming?.[0] ?? null)

// Use shared date formatting utility
const { formatLaunchDate } = useDateFormatting()

// Countdown logic
const countdownUnits = ref([
	{ label: 'Days', value: '00' },
	{ label: 'Hours', value: '00' },
	{ label: 'Minutes', value: '00' },
	{ label: 'Seconds', value: '00' }
])

// Update countdown every second
const updateCountdown = () => {
	if (!nextLaunch.value || !nextLaunch.value.launch_date_unix) return
	
	const now = Math.floor(Date.now() / 1000)
	const launchTime = nextLaunch.value.launch_date_unix
	const timeRemaining = launchTime - now
	
	// If launch has already happened
	if (timeRemaining <= 0) {
		countdownUnits.value = [
			{ label: 'Days', value: '00' },
			{ label: 'Hours', value: '00' },
			{ label: 'Minutes', value: '00' },
			{ label: 'Seconds', value: '00' }
		]
		return
	}
	
	// Calculate time units
	const days = Math.floor(timeRemaining / 86400)
	const hours = Math.floor((timeRemaining % 86400) / 3600)
	const minutes = Math.floor((timeRemaining % 3600) / 60)
	const seconds = Math.floor(timeRemaining % 60)
	
	// Update countdown display
	countdownUnits.value = [
		{ label: 'Days', value: days.toString().padStart(2, '0') },
		{ label: 'Hours', value: hours.toString().padStart(2, '0') },
		{ label: 'Minutes', value: minutes.toString().padStart(2, '0') },
		{ label: 'Seconds', value: seconds.toString().padStart(2, '0') }
	]
}

// Start countdown on client-side only
onMounted(() => {
	if (import.meta.client) {
		// Initial update
		updateCountdown()
		
		// Set interval for updates
		const intervalId = setInterval(updateCountdown, 1000)
		
		// Clean up on component unmount
		onUnmounted(() => {
			clearInterval(intervalId)
		})
	}
})
</script>