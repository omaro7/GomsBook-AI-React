import { create } from "zustand"

import {
  getCurrentProject,
  getProjects,
  switchCurrentProject,
  type ProjectItem
} from "@/services/projectService"

interface ProjectState {
  projectRoot: string
  projects: ProjectItem[]
  currentProjectName: string
  currentProjectPath: string
  loading: boolean
  loaded: boolean
  error: string | null

  loadProjects: () => Promise<void>
  selectProject: (projectName: string) => Promise<void>
  reset: () => void
}

const initialState = {
  projectRoot: "",
  projects: [],
  currentProjectName: "",
  currentProjectPath: "",
  loading: false,
  loaded: false,
  error: null
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  ...initialState,

  loadProjects: async () => {
    if (get().loading) {
      return
    }

    set({
      loading: true,
      error: null
    })

    try {
      const [projectList, currentProject] = await Promise.all([
        getProjects(),
        getCurrentProject()
      ])

      const currentProjectName =
        currentProject.projectName ?? ""

      const currentProjectPath =
        currentProject.projectPath ?? ""

      const projects = projectList.projects.map(project => ({
        ...project,
        current:
          project.projectName ===
          currentProjectName
      }))

      set({
        projectRoot: projectList.projectRoot,
        projects,
        currentProjectName,
        currentProjectPath,
        loading: false,
        loaded: true,
        error: null
      })
    } catch (error) {
      set({
        loading: false,
        loaded: false,
        error: toErrorMessage(error)
      })
    }
  },

  selectProject: async (
    projectName: string
  ) => {
    if (
      get().loading ||
      projectName.trim().length === 0
    ) {
      return
    }

    if (
      projectName ===
      get().currentProjectName
    ) {
      return
    }

    set({
      loading: true,
      error: null
    })

    try {
      const currentProject =
        await switchCurrentProject(
          projectName
        )

      const currentProjectName =
        currentProject.projectName ?? ""

      const currentProjectPath =
        currentProject.projectPath ?? ""

      const projects =
        get().projects.map(project => ({
          ...project,
          current:
            project.projectName ===
            currentProjectName
        }))

      set({
        projects,
        currentProjectName,
        currentProjectPath,
        loading: false,
        loaded: true,
        error: null
      })
    } catch (error) {
      set({
        loading: false,
        error: toErrorMessage(error)
      })
    }
  },

  reset: () => {
    set(initialState)
  }
}))

function toErrorMessage(
  error: unknown
): string {
  if (error instanceof Error) {
    return error.message
  }

  return "프로젝트 처리 중 오류가 발생했습니다."
}