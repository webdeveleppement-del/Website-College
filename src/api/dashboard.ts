import { api } from './client'

export interface DashboardOverview {
  students: number
  teachers: number
  classes: number
  users: number
  news: {
    total: number
    published: number
  }
  admissions: {
    pending: number
  }
  messages: {
    new: number
  }
  attendance: {
    total: number
    present: number
    absent: number
    late: number
    excused: number
  }
  grades: {
    average: number
  }
}

interface DashboardOverviewResponse {
  success: boolean
  data: DashboardOverview
  message?: string
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const response = await api.get<DashboardOverviewResponse>('/dashboard/overview/')

  if (!response.data.success) {
    throw new Error(response.data.message || 'Impossible de charger le tableau de bord.')
  }

  return response.data.data
}
