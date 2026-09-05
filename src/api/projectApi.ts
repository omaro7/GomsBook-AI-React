export interface ProjectItem {
  projectName: string
  projectPath: string
  current: boolean
}

export interface ProjectListResponse {
  projectRoot: string
  projects: ProjectItem[]
}

export interface CurrentProjectResponse {
  projectName: string
  projectPath: string
}

export async function getProjects(): Promise<ProjectListResponse> {
  const response = await fetch("/api/projects")

  if (!response.ok) {
    throw new Error(`프로젝트 목록 조회 실패: ${response.status}`)
  }

  return response.json()
}

export async function switchCurrentProject(projectName: string): Promise<CurrentProjectResponse> {
  const response = await fetch("/api/projects/current", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectName }),
  })

  if (!response.ok) {
    throw new Error(`프로젝트 변경 실패: ${response.status}`)
  }

  return response.json()
}