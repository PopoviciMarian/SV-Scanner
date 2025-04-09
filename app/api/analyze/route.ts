import { type NextRequest, NextResponse } from "next/server"
import { analyzeCodeForVulnerabilities } from "@/app/utils/security"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Invalid request. Code must be provided as a string." }, { status: 400 })
    }

    // Simulate server processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Analyze the code for security vulnerabilities
    const result = await analyzeCodeForVulnerabilities(code)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error analyzing code:", error)
    return NextResponse.json({ error: "Failed to analyze code. Please try again." }, { status: 500 })
  }
}

