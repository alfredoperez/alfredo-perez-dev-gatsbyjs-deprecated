import React, { useState } from 'react'

const FORM_ID = `2581331` // process.env.CONVERTKIT_SIGNUP_FORM

type ConvertKitResponseType = {
  result: `success` | `error`
  msg: string
}
const userConvertKit = () => {
  const [response, setResponse] = React.useState<ConvertKitResponseType | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const data = new FormData(e.target)
    const email = data.get(`email`)
    const name = data.get(`first_name`)

    try {
      const apiResponse = await fetch(`https://app.convertkit.com/forms/${FORM_ID}/subscriptions`, {
        method: `post`,
        body: JSON.stringify({ email_address: email, first_name: name }, null, 2),
        headers: {
          Accept: `application/json`,
          'Content-Type': `application/json`,
        },
      })
      const responseJson = await apiResponse.json()
      setSubmitting(false)
      setResponse({ result: `success`, msg: responseJson })
    } catch (error) {
      setSubmitting(false)
      setResponse({ result: `error`, msg: `There was an error submitting your email` })
    }
    setResponse(response)
    setSubmitting(false)
  }

  const success = response && response.result === `success`
  const error = response && response.result !== `success`
  const canSubmit = !response || error
  const message = response && response.msg

  return {
    handleSubmit,
    canSubmit,
    submitting,
    message,
    success,
    error,
  }
}

export default userConvertKit
