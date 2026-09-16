import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom"

import {
  ChatLayout
} from "@/components/chat/ChatLayout"

import {
  RagEvaluationDashboardPage
} from "@/pages/lab/rag/RagEvaluationDashboardPage"

import {
  RagEvaluationLayout
} from "@/pages/lab/rag/RagEvaluationLayout"

import {
  RagGoldenDatasetPage
} from "@/pages/lab/rag/RagGoldenDatasetPage"

import {
  RagVectorExperimentPage
} from "@/pages/lab/rag/RagVectorExperimentPage"

import {
  RagGraphExperimentPage
} from "@/pages/lab/rag/RagGraphExperimentPage"

import {
  RagHybridExperimentPage
} from "@/pages/lab/rag/RagHybridExperimentPage"

import {
  RagEvaluationResultPage
} from "@/pages/lab/rag/RagEvaluationResultPage"

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <ChatLayout />
          }
        />


        <Route
          path="/lab/rag"
          element={
            <RagEvaluationLayout />
          }
        >
          <Route
            index
            element={
              <RagEvaluationDashboardPage />
            }
          />

          <Route
            path="golden"
            element={
              <RagGoldenDatasetPage />
            }
          />

          <Route
            path="vector"
            element={
              <RagVectorExperimentPage />
            }
          />

          <Route
            path="graph"
            element={
              <RagGraphExperimentPage />
            }
          />

          <Route
            path="hybrid"
            element={
              <RagHybridExperimentPage />
            }
          />

          <Route
            path="result"
            element={
              <RagEvaluationResultPage />
            }
          />

        </Route>



        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  )
}


export default App