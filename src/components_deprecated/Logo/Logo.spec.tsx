import React from 'react'
import { render, screen } from '@testing-library/react'
import Logo from './Logo'

describe(`Logo`, () => {
  it(`should render`, () => {
    render(<Logo />)
    const logo = screen.getByRole(`img`)
    // expect(logo).toHaveAttribute(`src`, `../../../static/logo.png`)
    expect(logo).toHaveAttribute(`alt`, `Logo`)
  })
})
