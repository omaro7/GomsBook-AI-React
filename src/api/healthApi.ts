import type {
  HealthStatus
} from "@/models/HealthStatus"

export async function getHealthStatus():
  Promise<HealthStatus> {

  const response =
    await fetch(
      "/actuator/health"
    )

  if (!response.ok) {

    throw new Error(
      `Health API 요청 실패: ${response.status}`
    )
  }

  return response.json()
}