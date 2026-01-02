import Skeleton from './Skeleton'

export default function SkeletonAvatar({
  size = 'md',
  className = '',
  animation = 'pulse'
}) {
  // Size mapping to match common avatar dimensions in the app
  const sizeMap = {
    sm: 40,  // w-10 h-10 (40px)
    md: 80,  // w-20 h-20 (80px)
    lg: 96   // w-24 (96px)
  }

  const dimension = sizeMap[size] || sizeMap.md

  return (
    <Skeleton
      variant="circular"
      width={dimension}
      height={dimension}
      className={className}
      animation={animation}
    />
  )
}
