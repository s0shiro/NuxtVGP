// Shared TypeScript interfaces for SpaceX data

export interface LaunchSite {
  site_id: string
  site_name: string
  site_name_long: string
}

export interface LaunchRocket {
  rocket_name: string
  rocket: {
    id: string
  } | null
}

export interface Launch {
  id: string
  mission_name: string
  launch_date_local: string
  launch_date_unix: string
  launch_date_utc: string
  launch_site: LaunchSite | null
  rocket: LaunchRocket | null
  details: string | null
  launch_year?: string
}

// Rocket detail interfaces
export interface Distance {
  feet: number | null
  meters: number | null
}

export interface Mass {
  kg: number | null
  lb: number | null
}

export interface Rocket {
  id: string
  name: string
  description: string | null
  first_flight: string | null
  height: Distance | null
  diameter: Distance | null
  mass: Mass | null
  stages: number | null
  active: boolean
  company: string | null
  country: string | null
  cost_per_launch: number | null
  success_rate_pct: number | null
  wikipedia: string | null
}

// Sort order type
export type SortOrder = 'asc' | 'desc'
