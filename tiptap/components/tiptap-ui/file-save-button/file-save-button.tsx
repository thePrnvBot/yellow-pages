"use client"

import * as React from "react"
import TurndownService from "turndown"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "../../../hooks/use-tiptap-editor"

// --- Icons ---
import { ImagePlusIcon } from "../../tiptap-icons/image-plus-icon"

// --- UI Primitives ---
import type { ButtonProps } from "../../tiptap-ui-primitive/button"
import { Button } from "../../tiptap-ui-primitive/button"

// --- Types ---
export interface FileSaveButtonProps extends ButtonProps {
  editor?: Editor | null
  text?: string
  extensionName?: string
}

// --- Functions ---
async function saveFile(editor: Editor | null): Promise<boolean> {
  if (!editor) return false

  const content = editor.getHTML()
  const turndownService = new TurndownService()
  const markdownContent = turndownService.turndown(content)

  const fileName = prompt("Enter a filename (without .md):", "new-page")
  if (!fileName) return false

  try {
    const response = await fetch('http://localhost:4000/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        markdownContent,
        fileName
      })
    })

    const result = await response.json()

    if (response.ok) {
      console.log("✅ File saved:", result.filePath)
      return true
    } else {
      console.error("❌ Error saving file:", result.error)
      return false
    }
  } catch (err) {
    console.error("❌ Network error:", err)
    return false
  }
}

// --- Component ---
export const FileSaveButton = React.forwardRef<
  HTMLButtonElement,
  FileSaveButtonProps
>(
  (
    {
      editor: providedEditor,
      extensionName = "saveFile",
      text,
      className = "",
      disabled,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const editor = useTiptapEditor(providedEditor)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      saveFile(editor)
    }

    if (!editor || !editor.isEditable) return null

    return (
      <Button
        ref={ref}
        type="button"
        className={className.trim()}
        data-style="ghost"
        data-active-state="on"
        role="button"
        tabIndex={-1}
        aria-label="Save File"
        aria-pressed={false}
        tooltip="Save File"
        onClick={handleClick}
        {...buttonProps}
      >
        {children || (
          <>
            <ImagePlusIcon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
          </>
        )}
      </Button>
    )
  }
)

FileSaveButton.displayName = "FileSaveButton"

export default FileSaveButton
