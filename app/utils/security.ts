export async function analyzeCodeForVulnerabilities(code: string): Promise<{
    fixedCode: string
    vulnerabilities: string[]
  }> {
    const prompt = `You are a senior security engineer specializing in secure coding practices.

    Analyze the following code for actual or potential security vulnerabilities.
    
    Return your response in **valid JSON** format with exactly two keys:
    1. "vulnerabilities": an array of clear, concise descriptions of any identified issues. If there are no issues, return an empty array.
    2. "fixedCode": the same code if no vulnerabilities are found, OR an improved version of the code with security best practices applied if changes are needed. Do NOT add extra code unless it's directly related to fixing a real issue.
    
    Code:
    \`\`\`
    ${code}
    \`\`\``
    
    
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a security expert and code fixer." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      }),
    })
  
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "OpenAI API error")
    }
  
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content?.trim()
  
    // Extract JSON if it's wrapped in a Markdown code block
    const jsonMatch = content?.match(/```json\s*([\s\S]*?)\s*```/) || []
    const jsonString = jsonMatch[1] || content
  
    const parsed = JSON.parse(jsonString)
  
    return {
      fixedCode: parsed.fixedCode || "",
      vulnerabilities: parsed.vulnerabilities || [],
    }
  }
  