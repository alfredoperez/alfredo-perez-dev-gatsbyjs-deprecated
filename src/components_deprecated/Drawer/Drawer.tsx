import React, { useEffect, useState } from 'react'
import { Box, IconButton } from 'theme-ui'
import { FaBars, FaTimes } from 'react-icons/fa'
import loadable from '@loadable/component'
import './Drawer.css'

const DrawerMenu = loadable(
  () => import(/* webpackChunkName: 'rc-drawer' */ /* webpackPrefetch: true */ `rc-drawer`),
)

const styles = {
  handler: {
    display: [``, ``, `none`], // to avoid ssr rehydration issue
    transition: `left 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86)`,
    left: -4,
  },
  handlerOpen: {
    position: `fixed`,
    zIndex: 99999,
    left: 4,
    top: 4,
  },
  content: {
    bg: `contentBg`,
    height: `full`,
    fontSize: 3,
    p: 4,
  },
}
type DrawerProps = {
  width: number | string
  container: any
  locationState: any
}

const Drawer = ({ container = null, width = 300, locationState }: DrawerProps) => {
  const [open, setOpen] = useState(false)

  const handleSwitch = () => {
    setOpen(!open)
  }

  const handlerStyle = open
    ? {
        ...styles.handler,
        ...styles.handlerOpen,
      }
    : styles.handler

  const handler = (
    <IconButton onClick={handleSwitch} sx={handlerStyle} aria-label="Menu" {...props}>
      {open ? <FaTimes /> : <FaBars />}
    </IconButton>
  )

  useEffect(() => {
    open && locationState && handleSwitch()
  }, [locationState]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* {open && <ScrollDisabler />} */}
      {handler}
      <DrawerMenu
        width={width}
        open={open}
        getContainer={container}
        onHandleClick={handleSwitch}
        placement="right"
      >
        <Box sx={styles.content}>{props.children}</Box>
      </DrawerMenu>
    </>
  )
}

export default Drawer
