/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useState } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import loadable from '@loadable/component'
import theme from 'prism-react-renderer/themes/shadesOfPurple'
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
      {/* <span sx={{ ...visuallyHidden }} aria-roledescription="status"> */}
      {/*  {label} */}
      {/* </span> */}
    </button>
  )
}
/// /
type CodeProps = {
  codeString: string
  // language: Language
  language: any
  noLineNumbers?: boolean
  metastring?: string
  [key: string]: any
}

function getParams(className = ``) {
  const [lang = ``, params = ``] = className.split(`:`)

  return [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    lang.split(`language-`).pop().split(`{`).shift(),
  ].concat(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    params.split(`&`).reduce((merged, param) => {
      const [key, value] = param.split(`=`)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      merged[key] = value
      return merged
    }, {}),
  )
}

const RE = /{([\d,-]+)}/

const calculateLinesToHighlight = (meta: string) => {
  if (!RE.test(meta)) {
    return () => false
  }
  const lineNumbers = RE.exec(meta)![1]
    .split(`,`)
    .map((v) => v.split(`-`).map((x) => parseInt(x, 10)))
  return (index: number) => {
    const lineNumber = index + 1
    const inRange = lineNumbers.some(([start, end]) =>
      end ? lineNumber >= start && lineNumber <= end : lineNumber === start,
    )
    return inRange
  }
}

const LazyLiveProvider = loadable(async () => {
  const Module = await import(`react-live`)
  const { LiveProvider, LiveEditor, LiveError, LivePreview } = Module
  return (props: any) => (
    <LiveProvider {...props}>
      {props.showCopyButton && <CodeCopy content={props.code} />}
      <LiveEditor data-name="live-editor" />
      <LiveError />
      <LivePreview data-name="live-preview" />
    </LiveProvider>
  )
})

const Code = ({
  codeString,
  noLineNumbers = false,
  className: blockClassName,
  metastring = ``,
  ...props
}: CodeProps) => {
  const showLineNumbers = true
  const showCopyButton = true

  const [language, { title = `` }] = getParams(blockClassName)
  const shouldHighlightLine = calculateLinesToHighlight(metastring)

  const hasLineNumbers = !noLineNumbers && language !== `noLineNumbers` && showLineNumbers

  if (props[`react-live`]) {
    return (
      <div className="react-live-wrapper">
        <LazyLiveProvider
          code={codeString}
          noInline
          theme={theme}
          showCopyButton={showCopyButton}
        />
      </div>
    )
  }
  return (
    <Highlight {...defaultProps} code={codeString} language={language} theme={theme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <>
          {title && (
            <div className="code-title">
              <div>{title}</div>
            </div>
          )}
          <div className="gatsby-highlight" data-language={language}>
            <pre className={className} style={style} data-linenumber={hasLineNumbers}>
              <CodeCopy content={codeString} fileName={title} />
              <code className={`language-${language}`}>
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line, key: i })

                  if (shouldHighlightLine(i)) {
                    lineProps.className = `${lineProps.className} highlight-line`
                  }

                  return (
                    <div {...lineProps}>
                      {hasLineNumbers && <span className="line-number-style">{i + 1}</span>}
                      {line.map((token, key) => (
                        <span {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  )
                })}
              </code>
            </pre>
          </div>
        </>
      )}
    </Highlight>
  )
}

export default Code
