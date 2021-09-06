import React, { PropsWithChildren } from 'react'
import { Box } from 'theme-ui'
import Section from '@components/Section'
import { reduceArray } from '@utils/reduceArray'
import { hashCode } from '@utils/hashCode'
import { buildResponsiveVariant } from '@utils/buildResponsiveVariant'
import { LoadingProp, VariantProp } from '@models/props'
import { Note } from '@models/note'
import Card from '@components/Card'
import CardListSlider from './CardList.Slider'

const SLIDER_VARIANT_GROUP = `lists.cards.slider`
const FIXED_VARIANT_GROUP = `lists.cards.fixed`

type CartListProps = PropsWithChildren<{
  nodes?: Array<any>
  variant?: Array<VariantProp> | VariantProp
  loading?: LoadingProp
  columns?: Array<any>
  title?: string
  withTitleLink?: boolean
  limit?: number
  skip?: number
  distinct?: boolean
  slider?: any
  aside?: boolean
  asNavFor?: any
  fade?: boolean
  omitMedia?: boolean
}>

const CardList = React.forwardRef(
  (
    {
      aside = false,
      // columns = [1],
      variant = `vertical`,
      title,
      withTitleLink,
      limit,
      skip,
      fade,
      distinct,
      slider,
      asNavFor,
      loading,
      nodes,
      ...rest
    }: CartListProps,
    ref,
  ) => {
    const reducedNodes = reduceArray(nodes as Array<any>, { distinct, limit, skip })
    if (!reducedNodes || !reducedNodes.length) return null

    // Section title link for viewing more posts from same category
    const titleLink = withTitleLink ? reducedNodes[0].category?.slug : ``

    // Unique key for section
    const sectionKey = title && `${hashCode(reducedNodes.map((node: any) => node.id).join())}`

    // Build responsive variant for card list
    const cardListVariant = buildResponsiveVariant(
      slider ? SLIDER_VARIANT_GROUP : FIXED_VARIANT_GROUP,
      variant,
    )

    const changeSlide = (index: number) => {
      if (asNavFor?.current) {
        asNavFor.current.slickPause()
        asNavFor.current.slickGoTo(index)
      }
    }

    // Array of cards
    const cards = reducedNodes.map((note: Note, index: number) => (
      <Card
        key={note.id}
        variant={variant}
        onMouseOver={() => changeSlide(index)}
        onFocus={() => changeSlide(index)}
        // In sliders with fade effect apply loading to the first card only
        loading={fade ? (index === 0 ? loading : undefined) : loading}
        {...note}
        {...rest}
      />
    ))

    // Cards List (Fixed or Slider)
    const CardListComponent = () => (
      <Box sx={{ variant: cardListVariant[0] }}>
        {slider ? (
          <CardListSlider
            ref={ref}
            // beforeChange={index => changeSlide(index)}
            {...rest}
          >
            {cards}
          </CardListSlider>
        ) : (
          cards
        )}
      </Box>
    )

    return title ? (
      <Section title={title} titleLink={titleLink} key={sectionKey} aside={aside}>
        <CardListComponent />
      </Section>
    ) : (
      <CardListComponent />
    )
  },
)

export default CardList
