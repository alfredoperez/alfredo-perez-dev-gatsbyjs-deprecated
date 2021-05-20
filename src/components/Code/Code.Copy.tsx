/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState } from 'react'
import { copyToClipboard } from '@utils/copyToClipboard'
import { visuallyHidden } from '@utils/visuallyHidden'

const delay = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration))

type CodeCopyProps = {
  content: string
  duration?: number
  fileName?: string
  trim?: boolean
}

const CodeCopy = ({ content, duration = 5000, fileName = ``, trim = false }: CodeCopyProps) => {
  const [copied, setCopied] = useState(false)

  const label = copied
    ? `${fileName ? `${fileName} ` : ``}copied to clipboard`
    : `${fileName ? `${fileName}: ` : ``}copy code to clipboard`

  return (
    <button
      type="button"
      name={label}
      disabled={copied}
      className="code-copy-button"
      sx={{
        variant: `copyButton`,
      }}
      onClick={async () => {
        await copyToClipboard(trim ? content.trim() : content)
        setCopied(true)
        await delay(duration)
        setCopied(false)
      }}
    >
      {copied ? `Copied` : `Copy`}
      <span sx={{ ...visuallyHidden }} aria-roledescription="status">
        {label}
      </span>
    </button>
  )
}

export default CodeCopy
