import Skeleton from './Skeleton'

export default function SkeletonText({
  lines = 3,
  lineHeight,
  spacing = 'gap-2',
  lastLineWidth = '60%',
  className = '',
  animation = 'pulse'
}) {
  // Generate array of line indices
  const lineArray = Array.from({ length: lines }, (_, i) => i)

  return (
    <div className={`flex flex-col ${spacing} ${className}`}>
      {lineArray.map((index) => {
        const isLastLine = index === lines - 1
        const width = isLastLine ? lastLineWidth : '100%'

        return (
          <Skeleton
            key={index}
            variant="text"
            width={width}
            height={lineHeight}
            animation={animation}
          />
        )
      })}
    </div>
  )
}
