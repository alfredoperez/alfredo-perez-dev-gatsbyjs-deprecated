export const getImageVariant = (image: any, variant: any) =>
  image ? (image.__typename ? image[`${image.__typename}_${variant}`] : image[variant]) : null
