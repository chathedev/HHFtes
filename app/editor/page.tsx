"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Save, Monitor, Tablet, Smartphone, Loader2, X, Check, RefreshCw } from "lucide-react"

const PAGES = [
  { name: "home", displayName: "Hem", path: "/" },
  { name: "kontakt", displayName: "Kontakt", path: "/kontakt" },
  { name: "lag", displayName: "Lag", path: "/lag" },
  { name: "matcher", displayName: "Matcher", path: "/matcher" },
  { name: "nyheter", displayName: "Nyheter", path: "/nyheter" },
  { name: "partners", displayName: "Partners", path: "/partners" },
]

const VIEWPORTS = {
  desktop: { width: "100%", height: "100%", icon: Monitor },
  tablet: { width: "768px", height: "1024px", icon: Tablet },
  mobile: { width: "375px", height: "667px", icon: Smartphone },
}

export default function EditorPage() {
  const [currentPage, setCurrentPage] = useState(PAGES[0])
  const [viewport, setViewport] = useState<keyof typeof VIEWPORTS>("desktop")
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [content, setContent] = useState<any>({})
  const [originalContent, setOriginalContent] = useState<any>({})
  const [iframeSrc, setIframeSrc] = useState("")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIframeSrc(`${window.location.origin}${currentPage.path}?editor=true`)
    }
  }, [currentPage])

  useEffect(() => {
    loadContent()
  }, [currentPage])

  const loadContent = async () => {
    try {
      const response = await fetch(`/content/${currentPage.name}.json`)
      if (response.ok) {
        const data = await response.json()
        setContent({ ...content, [currentPage.name]: data })
        setOriginalContent({ ...originalContent, [currentPage.name]: data })
      }
    } catch (error) {
      console.error("Failed to load content:", error)
    }
  }

  const saveContent = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/github-commit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: `public/content/${currentPage.name}.json`,
          content: JSON.stringify(content[currentPage.name], null, 2),
          message: `Update ${currentPage.displayName} content via editor`,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to save ${currentPage.name}`)
      }

      setOriginalContent({ ...originalContent, [currentPage.name]: content[currentPage.name] })

      toast({
        title: "✅ Changes Committed to GitHub",
        description: `${currentPage.displayName} updated and pushed to repository`,
        className: "bg-green-500 text-white",
      })

      refreshPreview()
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "❌ GitHub Commit Failed",
        description: "Failed to commit changes to repository",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const refreshPreview = () => {
    setIsRefreshing(true)
    if (iframeRef.current && typeof window !== "undefined") {
      const newSrc = `${window.location.origin}${currentPage.path}?editor=true&t=${Date.now()}`
      setIframeSrc(newSrc)
      setTimeout(() => setIsRefreshing(false), 1000)
    }
  }

  const handleEdit = (fieldPath: string, currentValue: string) => {
    setEditingField(fieldPath)
    setEditingValue(currentValue)
  }

  const handleImageEdit = (fieldPath: string) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          updateContentField(fieldPath, imageUrl)

          toast({
            title: "Image Updated",
            description: "Click Save Changes to commit to GitHub",
            className: "bg-blue-500 text-white",
          })
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const updateContentField = (fieldPath: string, value: string) => {
    const keys = fieldPath.split(".")
    const pageKey = keys[0]
    const fieldKeys = keys.slice(1)

    const obj = content[pageKey] || {}
    let current = obj

    for (let i = 0; i < fieldKeys.length - 1; i++) {
      if (!current[fieldKeys[i]]) current[fieldKeys[i]] = {}
      current = current[fieldKeys[i]]
    }

    current[fieldKeys[fieldKeys.length - 1]] = value
    setContent({ ...content, [pageKey]: obj })
  }

  const saveField = () => {
    if (!editingField) return

    updateContentField(editingField, editingValue)
    setEditingField(null)
    setEditingValue("")

    toast({
      title: "Field Updated",
      description: "Click Save Changes to commit to GitHub",
      className: "bg-blue-500 text-white",
    })
  }

  const cancelEdit = () => {
    setEditingField(null)
    setEditingValue("")
  }

  const injectEditorScript = () => {
    if (!iframeRef.current?.contentWindow) {
      console.log("No iframe contentWindow available, retrying...")
      setTimeout(injectEditorScript, 500)
      return
    }

    try {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document

      if (!iframeDoc) {
        console.log("No iframe document available, retrying...")
        setTimeout(injectEditorScript, 500)
        return
      }

      // Wait for the page to be fully loaded
      if (iframeDoc.readyState !== "complete") {
        console.log("Iframe document not ready, waiting...")
        setTimeout(injectEditorScript, 500)
        return
      }

      // Remove existing editor script if present
      const existingScript = iframeDoc.getElementById("editor-script")
      if (existingScript) {
        existingScript.remove()
      }

      // Remove existing styles
      const existingStyle = iframeDoc.getElementById("editor-styles")
      if (existingStyle) {
        existingStyle.remove()
      }

      console.log("🚀 Injecting enhanced editor script...")

      // Create and inject the enhanced editor script
      const script = iframeDoc.createElement("script")
      script.id = "editor-script"
      script.textContent = `
        (function() {
          console.log('🎯 Enhanced Editor script starting injection...');
          
          // Remove existing event listeners
          if (window.editorClickHandler) {
            document.removeEventListener('click', window.editorClickHandler, true);
            document.removeEventListener('mousedown', window.editorClickHandler, true);
            console.log('Removed existing handlers');
          }
          
          // Enhanced click handler with multiple event types
          window.editorClickHandler = function(e) {
            console.log('🖱️ Event detected:', e.type, 'on:', e.target);
            
            const target = e.target.closest('[data-editable]');
            if (target) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              
              const fieldPath = target.dataset.fieldPath;
              const currentValue = target.textContent || target.value || target.src || target.alt || target.innerText || '';
              
              console.log('✅ Editable element found!');
              console.log('Field path:', fieldPath);
              console.log('Current value:', currentValue);
              console.log('Element type:', target.tagName);
              console.log('Element classes:', target.className);
              
              // Enhanced visual feedback
              const originalBg = target.style.backgroundColor;
              const originalColor = target.style.color;
              const originalBorder = target.style.border;
              
              target.style.backgroundColor = '#3b82f6';
              target.style.color = 'white';
              target.style.border = '2px solid #1d4ed8';
              target.style.transform = 'scale(1.02)';
              target.style.transition = 'all 0.2s ease';
              
              setTimeout(() => {
                target.style.backgroundColor = originalBg;
                target.style.color = originalColor;
                target.style.border = originalBorder;
                target.style.transform = '';
              }, 300);
              
              if (target.tagName === 'IMG') {
                console.log('📸 Image edit request for:', fieldPath);
                parent.postMessage({
                  type: 'IMAGE_EDIT_REQUEST',
                  fieldPath: fieldPath
                }, '*');
              } else {
                console.log('📝 Text edit request for:', fieldPath);
                parent.postMessage({
                  type: 'EDIT_REQUEST',
                  fieldPath: fieldPath,
                  currentValue: currentValue
                }, '*');
              }
              
              return false;
            } else {
              console.log('❌ No editable element found for:', e.type);
            }
          };
          
          // Add multiple event listeners for better coverage
          document.addEventListener('click', window.editorClickHandler, true);
          document.addEventListener('mousedown', window.editorClickHandler, true);
          console.log('✅ Enhanced click handlers attached');
          
          // Enhanced styles for editable elements
          const style = document.createElement('style');
          style.id = 'editor-styles';
          style.textContent = \`
            [data-editable] {
              cursor: pointer !important;
              transition: all 0.3s ease !important;
              position: relative !important;
              border: 2px solid transparent !important;
              outline: none !important;
              user-select: none !important;
            }
            [data-editable]:hover {
              background-color: rgba(59, 130, 246, 0.15) !important;
              border: 2px dashed #3b82f6 !important;
              border-radius: 6px !important;
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2) !important;
              transform: scale(1.01) !important;
            }
            [data-editable]:hover::before {
              content: "✏️ Click to edit" !important;
              position: absolute !important;
              top: -40px !important;
              left: 50% !important;
              transform: translateX(-50%) !important;
              background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
              color: white !important;
              padding: 8px 16px !important;
              border-radius: 8px !important;
              font-size: 13px !important;
              white-space: nowrap !important;
              z-index: 10000 !important;
              font-family: system-ui, -apple-system, sans-serif !important;
              font-weight: 600 !important;
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
              animation: fadeInScale 0.2s ease-out !important;
            }
            [data-editable]:hover::after {
              content: "" !important;
              position: absolute !important;
              top: -12px !important;
              left: 50% !important;
              transform: translateX(-50%) !important;
              width: 0 !important;
              height: 0 !important;
              border-left: 8px solid transparent !important;
              border-right: 8px solid transparent !important;
              border-top: 8px solid #3b82f6 !important;
              z-index: 10000 !important;
            }
            @keyframes fadeInScale {
              from {
                opacity: 0;
                transform: translateX(-50%) scale(0.8);
              }
              to {
                opacity: 1;
                transform: translateX(-50%) scale(1);
              }
            }
            [data-editable]:active {
              transform: scale(0.98) !important;
            }
          \`;
          document.head.appendChild(style);
          console.log('✅ Enhanced editor styles added');
          
          // Enhanced element detection and logging
          const editableElements = document.querySelectorAll('[data-editable]');
          console.log(\`🎯 Found \${editableElements.length} editable elements:\`);
          
          if (editableElements.length === 0) {
            console.warn('⚠️ NO EDITABLE ELEMENTS FOUND!');
            console.warn('Make sure the page has ?editor=true parameter');
            console.warn('Check if data-editable attributes are being added to elements');
          } else {
            editableElements.forEach((el, i) => {
              const fieldPath = el.dataset.fieldPath;
              const content = (el.textContent || el.alt || el.src || '').substring(0, 50);
              console.log(\`  \${i + 1}. \${el.tagName}[\${el.className}] - \${fieldPath} - "\${content}..."\`);
              
              // Add a pulsing indicator for 3 seconds
              el.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
              el.style.animation = 'pulse 2s infinite';
              
              setTimeout(() => {
                el.style.boxShadow = '';
                el.style.animation = '';
              }, 3000);
            });
            
            console.log('✅ Enhanced editor script injection complete!');
            console.log('👆 Click on any highlighted element to edit it');
            console.log('🔍 Elements will pulse for 3 seconds to show they are editable');
          }
          
          // Add pulse animation
          const pulseStyle = document.createElement('style');
          pulseStyle.textContent = \`
            @keyframes pulse {
              0%, 100% { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }
              50% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.8); }
            }
          \`;
          document.head.appendChild(pulseStyle);
          
          // Test message to parent
          parent.postMessage({
            type: 'EDITOR_READY',
            editableCount: editableElements.length
          }, '*');
          
        })();
      `

      iframeDoc.head.appendChild(script)
      console.log("✅ Enhanced editor script injected successfully")

      // Verification with detailed logging
      setTimeout(() => {
        const injectedScript = iframeDoc.getElementById("editor-script")
        if (injectedScript) {
          console.log("✅ Script injection verified - editor is ready!")
        } else {
          console.error("❌ Script injection failed - retrying...")
          setTimeout(injectEditorScript, 1000)
        }
      }, 200)
    } catch (error) {
      console.error("❌ Failed to inject editor script:", error)
      setTimeout(() => {
        console.log("🔄 Retrying enhanced script injection...")
        injectEditorScript()
      }, 1000)
    }
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("📨 Message received:", event.data)

      if (event.data.type === "EDIT_REQUEST") {
        const { fieldPath, currentValue } = event.data
        console.log("✏️ Edit request received:", fieldPath, currentValue)
        handleEdit(fieldPath, currentValue)
      } else if (event.data.type === "IMAGE_EDIT_REQUEST") {
        const { fieldPath } = event.data
        console.log("🖼️ Image edit request received:", fieldPath)
        handleImageEdit(fieldPath)
      } else if (event.data.type === "EDITOR_READY") {
        const { editableCount } = event.data
        console.log(`🎉 Editor ready with ${editableCount} editable elements`)

        toast({
          title: "🎯 Editor Ready",
          description: `Found ${editableCount} editable elements. Click on highlighted content to edit.`,
          className: "bg-green-500 text-white",
        })
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("message", handleMessage)
      return () => window.removeEventListener("message", handleMessage)
    }
  }, [])

  const hasChanges = JSON.stringify(content[currentPage.name]) !== JSON.stringify(originalContent[currentPage.name])

  if (!iframeSrc) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading editor...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center gap-4">
          <Select
            value={currentPage.name}
            onValueChange={(value) => {
              const page = PAGES.find((p) => p.name === value)
              if (page) setCurrentPage(page)
            }}
          >
            <SelectTrigger className="w-48 bg-white border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              {PAGES.map((page) => (
                <SelectItem key={page.name} value={page.name} className="bg-white hover:bg-gray-100">
                  {page.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-1">
            {Object.entries(VIEWPORTS).map(([size, config]) => {
              const IconComponent = config.icon
              return (
                <Button
                  key={size}
                  size="sm"
                  variant={viewport === size ? "default" : "outline"}
                  onClick={() => setViewport(size as keyof typeof VIEWPORTS)}
                >
                  <IconComponent className="w-4 h-4" />
                </Button>
              )
            })}
          </div>

          <Button onClick={refreshPreview} disabled={isRefreshing} size="sm" variant="outline">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <Button
          onClick={saveContent}
          disabled={isSaving || !hasChanges}
          className={hasChanges ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaving ? "Saving..." : hasChanges ? "Save Changes" : "No Changes"}
        </Button>
      </div>

      <div className="flex-1 p-4 flex items-center justify-center overflow-hidden">
        <div
          className="bg-white rounded-lg shadow-xl overflow-hidden relative"
          style={{
            width: VIEWPORTS[viewport].width,
            height: VIEWPORTS[viewport].height,
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          {isRefreshing && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Refreshing preview...</span>
              </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={iframeSrc}
            className="w-full h-full border-0"
            title={`Preview of ${currentPage.displayName}`}
            onLoad={() => {
              setIsRefreshing(false)
              setTimeout(() => {
                injectEditorScript()
              }, 100)
            }}
          />
        </div>
      </div>

      {editingField && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="font-semibold mb-4 text-black">Edit: {editingField.split(".").pop()}</h3>

            {editingValue.length > 100 ? (
              <Textarea
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                rows={4}
                className="mb-4 text-black bg-white border border-gray-300"
                placeholder="Enter your text here..."
              />
            ) : (
              <Input
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                className="mb-4 text-black bg-white border border-gray-300"
                placeholder="Enter your text here..."
              />
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={cancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={saveField} className="bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4 mr-2" />
                Update
              </Button>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  )
}
