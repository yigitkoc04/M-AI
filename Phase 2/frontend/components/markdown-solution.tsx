"use client"

import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeHighlight from "rehype-highlight"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Copy, Lightbulb, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface MarkdownSolutionProps {
    content: string
    title?: string
}

export function MarkdownSolution({ content, title = "Solution" }: MarkdownSolutionProps) {
    const [copied, setCopied] = useState<string | null>(null)
    const [expanded, setExpanded] = useState(true)
    const [sections, setSections] = useState<{ level: number; title: string; content: string }[]>([])
    const contentRef = useRef<HTMLDivElement>(null)

    // Parse the markdown content into sections based on headings
    useEffect(() => {
        const lines = content.split("\n")
        const parsedSections: { level: number; title: string; content: string }[] = []

        let currentSection: { level: number; title: string; content: string } | null = null

        lines.forEach((line) => {
            // Check if line is a heading
            const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)

            if (headingMatch) {
                // If we already have a current section, push it to our sections array
                if (currentSection) {
                    parsedSections.push(currentSection)
                }

                // Start a new section
                const level = headingMatch[1].length
                const title = headingMatch[2].trim()
                currentSection = { level, title, content: line + "\n" }
            } else if (currentSection) {
                // Add this line to the current section
                currentSection.content += line + "\n"
            } else {
                // If there's content before any heading, create an "intro" section
                currentSection = { level: 0, title: "Introduction", content: line + "\n" }
            }
        })

        // Don't forget to add the last section
        if (currentSection) {
            parsedSections.push(currentSection)
        }

        setSections(parsedSections)
    }, [content])

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    // Get gradient colors based on heading level and content
    const getGradientColors = (level: number, title: string) => {
        const text = title.toLowerCase()

        if (level === 1) return "from-blue-500 to-indigo-500"

        if (text.includes("formula") || text.includes("equation")) {
            return "from-green-500 to-teal-500"
        } else if (text.includes("example") || text.includes("problem")) {
            return "from-amber-500 to-orange-500"
        } else if (text.includes("verification") || text.includes("verify")) {
            return "from-emerald-500 to-green-500"
        }

        // Check if this is a step heading
        const stepMatch = text.match(/step\s*(\d+)/i)
        if (stepMatch) {
            const stepColors = [
                "from-blue-500 to-indigo-500",
                "from-purple-500 to-pink-500",
                "from-amber-500 to-orange-500",
                "from-emerald-500 to-green-500",
                "from-rose-500 to-red-500",
            ]
            const colorIndex = (Number.parseInt(stepMatch[1]) - 1) % stepColors.length
            return stepColors[colorIndex]
        }

        return "from-purple-500 to-pink-500"
    }

    // Render the heading based on level
    const renderHeading = (level: number, title: string) => {
        const gradientColors = getGradientColors(level, title)
        const stepMatch = title.match(/step\s*(\d+)/i)

        return (
            <div className="flex items-center gap-2 mb-4">
                {stepMatch && level === 3 ? (
                    <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r ${gradientColors} flex items-center justify-center text-white font-bold`}
                    >
                        {stepMatch[1]}
                    </div>
                ) : (
                    <div className={`bg-gradient-to-r ${gradientColors} p-1.5 rounded-full`}>
                        <Lightbulb className="h-4 w-4 text-white" />
                    </div>
                )}
                <h3
                    className={`font-medium text-foreground m-0 ${level === 1 ? "text-2xl font-bold" : level === 2 ? "text-xl font-semibold" : "text-lg"}`}
                >
                    {title}
                </h3>
            </div>
        )
    }

    return (
        <Card className="shadow-lg overflow-hidden border-primary/10">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-gradient-to-r from-primary to-accent p-1.5">
                        <Lightbulb className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">{title}</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="h-8 w-8 p-0">
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
            </CardHeader>

            <CardContent
                className={cn("p-0 transition-all duration-300 ease-in-out overflow-hidden", !expanded && "max-h-0")}
                ref={contentRef}
            >
                <div className="p-4 md:p-6 space-y-4">
                    {sections.map((section, index) => {
                        // Skip empty sections or intro section with no content
                        if (!section.content.trim() || (section.level === 0 && section.content.trim() === "")) {
                            return null
                        }

                        const gradientColors = getGradientColors(section.level, section.title)

                        return (
                            <div
                                key={index}
                                className={`rounded-lg overflow-hidden border border-transparent bg-gradient-to-r ${gradientColors} p-[1px] shadow-md`}
                            >
                                <div className="bg-background rounded-[7px] p-4">
                                    {section.level > 0 && renderHeading(section.level, section.title)}

                                    <div className="prose dark:prose-invert max-w-none prose-headings:mb-3 prose-p:leading-relaxed prose-p:my-3 prose-li:my-1">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkMath]}
                                            rehypePlugins={[rehypeKatex, rehypeHighlight]}
                                            components={{
                                                // Skip rendering headings since we're handling them separately
                                                h1: () => null,
                                                h2: () => null,
                                                h3: () => null,
                                                h4: () => null,
                                                h5: () => null,
                                                h6: () => null,
                                                p: ({ children }) => <p className="text-muted-foreground leading-relaxed my-3">{children}</p>,
                                                ul: ({ children }) => (
                                                    <ul className="list-disc ml-6 space-y-2 my-4 text-muted-foreground">{children}</ul>
                                                ),
                                                ol: ({ children }) => (
                                                    <ol className="list-decimal ml-6 space-y-2 my-4 text-muted-foreground">{children}</ol>
                                                ),
                                                li: ({ children }) => <li className="text-muted-foreground leading-normal">{children}</li>,
                                                blockquote: ({ children }) => (
                                                    <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4">
                                                        {children}
                                                    </blockquote>
                                                ),
                                                a: ({ href, children }) => (
                                                    <a href={href} className="text-primary hover:underline underline-offset-4 transition-colors">
                                                        {children}
                                                    </a>
                                                ),
                                                table: ({ children }) => (
                                                    <div className="overflow-x-auto my-6">
                                                        <table className="w-full border-collapse text-sm">{children}</table>
                                                    </div>
                                                ),
                                                thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
                                                tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
                                                tr: ({ children }) => <tr className="hover:bg-muted/30 transition-colors">{children}</tr>,
                                                th: ({ children }) => (
                                                    <th className="px-4 py-3 text-left font-medium text-foreground">{children}</th>
                                                ),
                                                td: ({ children }) => <td className="px-4 py-3 text-muted-foreground">{children}</td>,
                                                hr: () => <hr className="my-6 border-border" />,
                                                img: ({ src, alt }) => (
                                                    <img
                                                        src={src || "/placeholder.svg"}
                                                        alt={alt || ""}
                                                        className="rounded-md max-w-full h-auto my-4 border border-border shadow-md"
                                                    />
                                                ),
                                                code: ({ inline, className, children }) => {
                                                    const match = /language-(\w+)/.exec(className || "")
                                                    const id = Math.random().toString(36).substr(2, 9)
                                                    const code = String(children).replace(/\n$/, "")

                                                    if (inline) {
                                                        return (
                                                            <code className="bg-blue-500/10 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-[13px] font-mono">
                                                                {children}
                                                            </code>
                                                        )
                                                    }

                                                    return (
                                                        <div className="relative group my-6">
                                                            <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                                                                    onClick={() => copyToClipboard(code, id)}
                                                                >
                                                                    {copied === id ? (
                                                                        <Check className="h-4 w-4 text-green-500" />
                                                                    ) : (
                                                                        <Copy className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                            {match ? (
                                                                <div className="absolute left-2 top-2 z-10 text-xs font-mono text-white bg-blue-600 px-2 py-1 rounded">
                                                                    {match[1]}
                                                                </div>
                                                            ) : null}
                                                            <div className="rounded-md overflow-hidden border border-transparent bg-gradient-to-r from-blue-500 to-indigo-500 p-[1px] shadow-md">
                                                                <pre className="bg-slate-50 dark:bg-slate-900 rounded-[5px] p-4 pt-10 overflow-x-auto text-[13px] font-mono">
                                                                    <code className={className}>{children}</code>
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    )
                                                },
                                                // Special styling for math formulas
                                            }}
                                        >
                                            {section.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

