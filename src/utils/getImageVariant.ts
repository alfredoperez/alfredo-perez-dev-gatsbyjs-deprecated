export const getImageVariant = (image: any, variant: any) => {
  return image ? (image.__typename ? image[`${image.__typename}_${variant}`] : image[variant]) : null
}
