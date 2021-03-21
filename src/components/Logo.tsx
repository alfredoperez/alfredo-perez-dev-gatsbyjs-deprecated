import React from 'react'
// @ts-expect-error
import logo from '../../static/logo.png'

const Logo = () => {
  return <img src={logo} alt="Logo" height={75} width={115} />
}

export default Logo
