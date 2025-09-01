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

export interface Thrust {
  kN: number | null
  lbf: number | null
}

export interface Engines {
  engine_loss_max: number | null
  layout: string | null
  number: number | null
  propellant_1: string | null
  propellant_2: string | null
  thrust_sea_level: Thrust | null
  thrust_to_weight: number | null
  thrust_vacuum: Thrust | null
  type: string | null
  version: string | null
}

export interface LandingLegs {
  material: string | null
  number: number | null
}

export interface PayloadWeight {
  id: string
  kg: number | null
  lb: number | null
  name: string
}

export interface CompositeFairing {
  diameter: Distance | null
}

export interface Payloads {
  composite_fairing: CompositeFairing | null
}

export interface SecondStage {
  burn_time_sec: number | null
  engines: number | null
  fuel_amount_tons: number | null
  payloads: Payloads | null
  thrust: Thrust | null
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
  boosters: number | null
  engines: Engines | null
  landing_legs: LandingLegs | null
  payload_weights: PayloadWeight[] | null
  second_stage: SecondStage | null
  type: string | null
}

// Sort order type
export type SortOrder = 'asc' | 'desc'

// Pagination interfaces
export interface PaginationState {
  currentPage: number
  pageSize: number
  totalItems: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  isLoading: boolean
  error: string | null
}

export interface PaginationResult {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  startItem: number
  endItem: number
}
