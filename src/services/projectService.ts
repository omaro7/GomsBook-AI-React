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
  projectName: string | null
  projectPath: string | null
}

export interface SwitchCurrentProjectRequest {
  projectName: string
}

async function parseError(response: Response): Promise<string> {
  const text = await response.text()

  if (text.trim().length > 0) {
    return text
  }

  return `${response.status} ${response.statusText}`
}

export async function getProjects(): Promise<ProjectListResponse> {
  const response = await fetch("/api/projects", {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  })

  if (!response.ok) {
    throw new Error(`프로젝트 목록 조회 실패: ${await parseError(response)}`)
  }

  return response.json()
}

export async function getCurrentProject(): Promise<CurrentProjectResponse> {
  const response = await fetch("/api/projects/current", {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  })

  if (!response.ok) {
    throw new Error(`현재 프로젝트 조회 실패: ${await parseError(response)}`)
  }

  return response.json()
}

export async function switchCurrentProject(
  projectName: string
): Promise<CurrentProjectResponse> {
  const request: SwitchCurrentProjectRequest = {
    projectName
  }

  const response = await fetch("/api/projects/current", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    throw new Error(`현재 프로젝트 변경 실패: ${await parseError(response)}`)
  }

  return response.json()
}