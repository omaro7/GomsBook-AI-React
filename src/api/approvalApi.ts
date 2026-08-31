export async function approveAgentApproval(
  runId: string,
  approvalId: string
): Promise<void> {

  await sendApprovalRequest(
    runId,
    approvalId,
    "approve"
  )
}

export async function rejectAgentApproval(
  runId: string,
  approvalId: string
): Promise<void> {

  await sendApprovalRequest(
    runId,
    approvalId,
    "reject"
  )
}

async function sendApprovalRequest(
  runId: string,
  approvalId: string,
  action: "approve" | "reject"
): Promise<void> {

  if (!runId.trim()) {
    throw new Error(
      "승인 요청에 runId가 없습니다."
    )
  }

  if (!approvalId.trim()) {
    throw new Error(
      "승인 요청에 approvalId가 없습니다."
    )
  }

  const response =
    await fetch(
      `/api/agent/runs/${encodeURIComponent(runId)}/approvals/${encodeURIComponent(approvalId)}/${action}`,
      {
        method: "POST"
      }
    )

  if (!response.ok) {
    throw new Error(
      `승인 처리에 실패했습니다. HTTP ${response.status}`
    )
  }
}