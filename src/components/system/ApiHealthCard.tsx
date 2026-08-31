import {
  useEffect,
  useState
} from "react"

import {
  Activity,
  CircleAlert,
  LoaderCircle
} from "lucide-react"

import {
  getHealthStatus
} from "@/api/healthApi"

import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert"

import {
  Badge
} from "@/components/ui/badge"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

type HealthState =
  | "CHECKING"
  | "UP"
  | "DOWN"

export function ApiHealthCard() {

  const [
    status,
    setStatus
  ] = useState<HealthState>(
    "CHECKING"
  )

  const [
    error,
    setError
  ] = useState<string | null>(
    null
  )

  useEffect(() => {

    const loadHealth =
      async () => {

        try {

          const health =
            await getHealthStatus()

          setStatus(
            health.status === "UP"
              ? "UP"
              : "DOWN"
          )

        } catch (exception) {

          setStatus(
            "DOWN"
          )

          setError(
            exception instanceof Error
              ? exception.message
              : "API 상태를 확인할 수 없습니다."
          )
        }
      }

    loadHealth()

  }, [])

  return (
    <Card
      className="
        w-full
        max-w-md
      "
    >

      <CardHeader>

        <CardTitle
          className="
            flex
            items-center
            gap-2
          "
        >

          <Activity
            className="
              h-5
              w-5
            "
          />

          GomsBook AI

        </CardTitle>

        <CardDescription>
          GomsBook-AI-API 연결 상태
        </CardDescription>

      </CardHeader>

      <CardContent
        className="
          space-y-4
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <span>
            API 상태
          </span>

          {status === "CHECKING" && (

            <Badge
              variant="secondary"
              className="
                flex
                gap-1
              "
            >

              <LoaderCircle
                className="
                  h-3
                  w-3
                  animate-spin
                "
              />

              CHECKING

            </Badge>
          )}

          {status === "UP" && (

            <Badge>
              UP
            </Badge>
          )}

          {status === "DOWN" && (

            <Badge
              variant="destructive"
            >
              DOWN
            </Badge>
          )}

        </div>

        {error && (

          <Alert
            variant="destructive"
          >

            <CircleAlert
              className="
                h-4
                w-4
              "
            />

            <AlertTitle>
              API 연결 오류
            </AlertTitle>

            <AlertDescription>
              {error}
            </AlertDescription>

          </Alert>
        )}

      </CardContent>

    </Card>
  )
}