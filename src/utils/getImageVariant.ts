export const getImageVariant = (image: any, variant: any) =>
  // eslint-disable-next-line no-underscore-dangle,no-nested-ternary
  image ? (image.__typename ? image[`${image.__typename}_${variant}`] : image[variant]) : null
