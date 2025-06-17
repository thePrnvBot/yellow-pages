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
function saveFile(editor: Editor | null): string | boolean {
  if (!editor) return false
  const content = editor.getHTML()
  const turndownService = new TurndownService()
  const markdownContent = turndownService.turndown(content)
  console.log("Saved content:", markdownContent)
  return markdownContent
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
