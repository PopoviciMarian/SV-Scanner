"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, AlertTriangle, Moon, Sun } from "lucide-react"
import CodeDiff from "@/components/code-diff"

export default function SecurityCodeChecker() {
  const [code, setCode] = useState("")
  const [fixedCode, setFixedCode] = useState("")
  const [vulnerabilities, setVulnerabilities] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeCode = async () => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze code")
      }

      const result = await response.json()

      setFixedCode(result.fixedCode)
      setVulnerabilities(result.vulnerabilities)
      setHasResult(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      console.error("Error analyzing code:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

 

  return (
    <main className="container mx-auto py-8 px-4">
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Submit Your Code</CardTitle>
          <CardDescription>
            Paste your code below and we'll analyze it for common security vulnerabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="// Paste your code here..."
            className="font-mono h-64 resize-none"
            value={code}
            //onChange={(e) => setCode(e.target.value)}

            onChange={(e) => {
              setCode(e.target.value)
              if (hasResult) {
                setHasResult(false)
                setVulnerabilities([])
                setFixedCode("")
              }
            }}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={analyzeCode} disabled={!code.trim() || isAnalyzing} className="w-full bg-emerald-600 text-white">
            {isAnalyzing ? "Analyzing..." : "Analyze Code"}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {hasResult && (
        <div className="space-y-6" >
          {vulnerabilities.length > 0 && (
            <Alert variant="destructive" className="bg-red-200 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Vulnerabilities Detected</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2">
                  {vulnerabilities.map((vuln, index) => (
                    <li key={index}>{vuln}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {vulnerabilities.length === 0 && (
            <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-300">
              <Shield className="h-4 w-4" />
              <AlertTitle>No Vulnerabilities Detected</AlertTitle>
              <AlertDescription>Your code appears to be secure based on our analysis.</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Code Diff</CardTitle>
              <CardDescription>See the changes made to fix the detected vulnerabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="diff">
              <TabsList className="mb-4 bg-gray-100">
                  <TabsTrigger
                    value="diff"
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    Diff View
                  </TabsTrigger>
                  <TabsTrigger
                    value="fixed"
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    Fixed Code
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="diff">
                  <CodeDiff originalCode={code} newCode={fixedCode} />
                </TabsContent>
                <TabsContent value="fixed">
                  <div className="bg-gray-50 dark:bg-gray-100 p-4 rounded-md overflow-auto">
                    <pre className="font-mono text-sm whitespace-pre-wrap">{fixedCode}</pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
