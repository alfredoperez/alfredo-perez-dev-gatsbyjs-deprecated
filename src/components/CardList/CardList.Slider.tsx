import React, { PropsWithChildren } from 'react'
import { css, IconButton, useThemeUI } from 'theme-ui'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import 'slick-carousel/slick/slick.css'
import './CardList.Slider.css'
import loadable from '@loadable/component'
import styles from './CardList.Slider.Styles'

const Slider = loadable(
  () => import(/* webpackChunkName: 'react-slick' */ /* webpackPrefetch: true */ `react-slick`),
)
interface CardListSliderProps extends PropsWithChildren<any> {
  fade: boolean
  dots: boolean
  arrows: boolean
  centerMode: boolean
  centerPadding: string
  autoPlay: boolean
  autoplaySpeed: number
  smoothAutoScroll: boolean
  columns: Array<number>
  slidesToScroll: Array<number>
  rows: number
  controlPosition: 'bottom' | 'over' | 'sides' | 'center'
}

const CardListSlider = React.forwardRef(
  (
    {
      slidesToScroll = [1],
      smoothAutoScroll = false,
      autoPlay = false,
      autoplaySpeed = 3000,
      fade = false,
      dots = true,
      arrows = true,
      centerMode = false,
      centerPadding = `50px`,
      controlPosition = `sides`,
      rows = 1,
      columns,
      beforeChange,
      children,
    }: CardListSliderProps,
    ref,
  ) => {
    const context = useThemeUI()

    const animationSettings = {
      slidesToScroll: 1,
      autoplay: true,
      cssEase: `linear`,
    }

    const mobileSettings = {
      centerMode: !fade,
      centerPadding: `40px`,
      swipeToSlide: true,
      arrows: false,
      dots: dots && fade,
    }

    const responsiveSettings = context.theme.breakpoints.map((breakpoint, index) => {
      const rSlidesToShow = columns[index >= columns.length ? columns.length - 1 : index]
      const rSlidesToScroll =
        slidesToScroll[index >= slidesToScroll.length ? slidesToScroll.length - 1 : index]
      return {
        breakpoint: parseInt(breakpoint),
        settings: {
          slidesToShow: rSlidesToShow,
          slidesToScroll: rSlidesToScroll,
          ...(index === 0 ? mobileSettings : {}),
        },
      }
    })
    let settings = {
      ref,
      beforeChange,
      slidesToShow: columns[columns.length - 1],
      slidesToScroll: slidesToScroll[slidesToScroll.length - 1],
      speed: 800,
      dots,
      arrows,
      centerMode,
      centerPadding,
      infinite: true,
      cssEase: fade ? `ease-out` : `cubic-bezier(0.23, 1, 0.32, 1)`,
      fade,
      responsive: responsiveSettings,
      css: css({
        ...(fade ? styles.fade : styles.slide),
        ...(controlPosition === `bottom` && styles.controlBottom),
        ...(controlPosition === `center` && styles.controlCenter),
        ...(controlPosition === `over` && styles.controlOver),
      }),
      prevArrow: (
        <IconButton>
          <FaChevronLeft />
        </IconButton>
      ),
      nextArrow: (
        <IconButton>
          <FaChevronRight />
        </IconButton>
      ),
    }

    if (smoothAutoScroll) {
      settings = {
        ...settings,
        ...animationSettings,
        speed: 10000,
        autoplaySpeed: 0,
        arrows: false,
        dots: false,
      }
    }

    if (!smoothAutoScroll && autoPlay) {
      settings = {
        ...settings,
        ...animationSettings,
        speed: 300,
        autoplaySpeed,
      }
    }

    const loadableFallback = children.slice(0, columns[columns.length - 1])

    return (
      <Slider {...settings} fallback={loadableFallback}>
        {children}
      </Slider>
    )
  },
)

export default CardListSlider

CardListSlider.propTypes = {}
