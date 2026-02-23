import { select } from 'd3-selection'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import type { DepthChartPlayerAssignment } from '@/lib/depth-charts-api'
import { FIELD_POSITION_CODES } from '@/lib/depth-chart-constants'

type AssignedPlayerWithPosition = DepthChartPlayerAssignment & {
  position_code?: string
}

const getAssignmentPlayer = (
  assignment: AssignedPlayerWithPosition
): AssignedPlayerWithPosition['Player'] | null =>
  assignment?.Player ?? null

const getAssignmentPlayerName = (assignment: AssignedPlayerWithPosition): string => {
  const p = getAssignmentPlayer(assignment)
  if (!p) return ''
  return `${(p as { first_name?: string }).first_name ?? ''} ${(p as { last_name?: string }).last_name ?? ''}`.trim()
}

const getAssignmentJerseyNumber = (
  assignment: AssignedPlayerWithPosition
): string | undefined => {
  const p = getAssignmentPlayer(assignment)
  return p ? (p as { jersey_number?: string }).jersey_number : undefined
}

type PositionCoords = Record<
  string,
  { x: number; y: number; label: string; color: string }
>

type EnhancedBaseballFieldViewProps = {
  positions: Array<{
    position_code: string
    position_name?: string
    color?: string
  }>
  assignedPlayers: AssignedPlayerWithPosition[]
  onPositionClick?: (positionCode: string) => void
  selectedPosition?: string
}

export function EnhancedBaseballFieldView({
  positions,
  assignedPlayers,
  onPositionClick,
  selectedPosition,
}: EnhancedBaseballFieldViewProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1000, height: 750 })

  const getPositionCoords = useCallback((width: number, height: number): PositionCoords => {
    const margin = 55
    const centerX = width / 2
    const bottomY = height - margin
    const R = Math.min(width, height) * 0.82
    const homeX = centerX
    const homeY = bottomY - 8

    const polar = (radius: number, theta: number) => ({
      x: homeX + radius * Math.cos(theta),
      y: homeY + radius * Math.sin(theta),
    })
    const angle = (45 * Math.PI) / 180
    const thetaHomeTo2B = -Math.PI / 2
    const rPitcher = R * 0.26
    const rOutfield = R * 0.78
    const thetaLeft = (-Math.PI + angle + thetaHomeTo2B) / 2 - 0.08
    const thetaRight = (thetaHomeTo2B - angle) / 2 + 0.08

    const diamondDist = R * 0.35
    const secondDist = diamondDist * 1.4
    const p1B = {
      x: homeX + diamondDist * Math.SQRT1_2,
      y: homeY - diamondDist * Math.SQRT1_2,
    }
    const p2B = { x: homeX, y: homeY - secondDist }
    const p3B = {
      x: homeX - diamondDist * Math.SQRT1_2,
      y: homeY - diamondDist * Math.SQRT1_2,
    }
    const baseBubbleYOffset = 30

    return {
      C: {
        x: homeX,
        y: homeY - 22,
        label: 'Catcher',
        color: '#3B82F6',
      },
      P: {
        ...polar(rPitcher, thetaHomeTo2B),
        label: 'Pitcher',
        color: '#EF4444',
      },
      '1B': {
        x: p1B.x,
        y: p1B.y - baseBubbleYOffset,
        label: 'First Base',
        color: '#10B981',
      },
      '2B': {
        x: p2B.x,
        y: p2B.y - baseBubbleYOffset,
        label: 'Second Base',
        color: '#F59E0B',
      },
      SS: {
        x: p3B.x + (p2B.x - p3B.x) * 0.59,
        y: p3B.y + (p2B.y - p3B.y) * 0.59 - baseBubbleYOffset,
        label: 'Shortstop',
        color: '#6366F1',
      },
      '3B': {
        x: p3B.x,
        y: p3B.y - baseBubbleYOffset,
        label: 'Third Base',
        color: '#8B5CF6',
      },
      LF: {
        ...polar(rOutfield, thetaLeft),
        label: 'Left Field',
        color: '#EC4899',
      },
      CF: {
        ...polar(rOutfield, thetaHomeTo2B),
        label: 'Center Field',
        color: '#14B8A6',
      },
      RF: {
        ...polar(rOutfield, thetaRight),
        label: 'Right Field',
        color: '#F97316',
      },
      DH: {
        x: polar(R * 0.82, -angle).x + 8,
        y: polar(R * 0.82, -angle).y,
        label: 'Designated Hitter',
        color: '#06B6D4',
      },
    }
  }, [])

  const getAssignedPlayers = useCallback(
    (positionCode: string) =>
      assignedPlayers
        .filter((a) => a.position_code === positionCode)
        .sort((a, b) => (a.depth_order ?? 0) - (b.depth_order ?? 0)),
    [assignedPlayers]
  )

  useEffect(() => {
    const handleResize = () => {
      const container = svgRef.current?.parentElement
      if (container) {
        const rect = container.getBoundingClientRect()
        setDimensions({
          width: Math.min(rect.width, 1200),
          height: Math.min(rect.width * 0.8, 850),
        })
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!svgRef.current) return
    const svg = select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height } = dimensions
    const positionCoords = getPositionCoords(width, height)
    const margin = 55
    const centerX = width / 2
    const bottomY = height - margin
    const fieldRadius = Math.min(width, height) * 0.82
    const homeX = centerX
    const homeY = bottomY - 12
    const angle = (45 * Math.PI) / 180
    const leftPoint = [
      homeX + fieldRadius * Math.cos(-Math.PI + angle),
      homeY + fieldRadius * Math.sin(-Math.PI + angle),
    ]
    const rightPoint = [
      homeX + fieldRadius * Math.cos(-angle),
      homeY + fieldRadius * Math.sin(-angle),
    ]

    const defs = svg.append('defs')
    defs
      .append('radialGradient')
      .attr('id', 'outfieldGrad')
      .attr('cx', '50%')
      .attr('cy', '80%')
      .attr('r', '60%')
      .selectAll('stop')
      .data([
        { offset: '0%', color: '#4ADE80', opacity: 1 },
        { offset: '100%', color: '#15803D', opacity: 1 },
      ])
      .join('stop')
      .attr('offset', (d: { offset: string }) => d.offset)
      .attr('stop-color', (d: { color: string }) => d.color)
      .attr('stop-opacity', (d: { opacity: number }) => d.opacity)

    const R = fieldRadius
    const pathD = `M ${leftPoint[0]} ${leftPoint[1]} A ${R} ${R} 0 0 1 ${rightPoint[0]} ${rightPoint[1]} L ${homeX} ${homeY} Z`
    svg
      .append('path')
      .attr('d', pathD)
      .attr('fill', 'none')
      .attr('stroke', '#2E2E2E')
      .attr('stroke-width', 6)

    const diamondDist = R * 0.35
    const first = [
      homeX + diamondDist * Math.SQRT1_2,
      homeY - diamondDist * Math.SQRT1_2,
    ]
    const second = [homeX, homeY - diamondDist * 1.4]
    const third = [
      homeX - diamondDist * Math.SQRT1_2,
      homeY - diamondDist * Math.SQRT1_2,
    ]
    const diamondPath = `M ${homeX} ${homeY} L ${first[0]} ${first[1]} L ${second[0]} ${second[1]} L ${third[0]} ${third[1]} Z`
    svg
      .append('path')
      .attr('d', diamondPath)
      .attr('fill', 'none')
      .attr('stroke', '#2E2E2E')
      .attr('stroke-width', 4)

    const baseSize = 10
    ;[first, second, third].forEach(([x, y]) => {
      svg
        .append('rect')
        .attr('x', x - baseSize / 2)
        .attr('y', y - baseSize / 2)
        .attr('width', baseSize)
        .attr('height', baseSize)
        .attr('fill', 'white')
        .attr('stroke', '#2E2E2E')
        .attr('stroke-width', 4)
        .attr('transform', `rotate(45 ${x} ${y})`)
    })

    const moundX = (homeX + second[0]) / 2
    const moundY = (homeY + second[1]) / 2
    svg
      .append('circle')
      .attr('cx', moundX)
      .attr('cy', moundY)
      .attr('r', 10)
      .attr('fill', 'none')
      .attr('stroke', '#2E2E2E')
      .attr('stroke-width', 4)

    svg
      .append('circle')
      .attr('cx', homeX)
      .attr('cy', Math.min(homeY + 12, height - 18))
      .attr('r', 16)
      .attr('fill', 'none')
      .attr('stroke', '#2E2E2E')
      .attr('stroke-width', 4)

    const plateSize = 9
    svg
      .append('polygon')
      .attr(
        'points',
        `${homeX - plateSize},${homeY - plateSize} ${homeX + plateSize},${homeY - plateSize} ${homeX + plateSize},${homeY} ${homeX},${homeY + plateSize / 1.2} ${homeX - plateSize},${homeY}`
      )
      .attr('fill', 'white')
      .attr('stroke', '#2E2E2E')
      .attr('stroke-width', 4)

    Object.entries(positionCoords).forEach(([positionCode, coords]) => {
      const players = getAssignedPlayers(positionCode)
      const playerX = coords.x
      const playerY = coords.y

      const positionGroup = svg
        .append('g')
        .attr('class', 'position-group')
        .style('cursor', 'pointer')
        .on('click', () => onPositionClick?.(positionCode))

      if (players.length > 0) {
        const primaryPlayer = players[0]
        const playerName = getAssignmentPlayerName(primaryPlayer)

        positionGroup
          .append('circle')
          .attr('cx', playerX)
          .attr('cy', playerY)
          .attr('r', 28)
          .attr('fill', 'rgba(255, 255, 255, 0.95)')
          .attr('stroke', coords.color)
          .attr('stroke-width', 2)

        positionGroup
          .append('text')
          .attr('x', playerX)
          .attr('y', playerY + 14)
          .attr('text-anchor', 'middle')
          .attr('font-size', '11px')
          .attr('font-weight', 'bold')
          .attr('fill', '#1F2937')
          .text(playerName || '—')

        if (players.length > 1) {
          positionGroup
            .append('circle')
            .attr('cx', playerX + 25)
            .attr('cy', playerY + 16)
            .attr('r', 7)
            .attr('fill', '#EF4444')
            .attr('stroke', 'white')
            .attr('stroke-width', 1)
          positionGroup
            .append('text')
            .attr('x', playerX + 25)
            .attr('y', playerY + 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '8px')
            .attr('font-weight', 'bold')
            .attr('fill', 'white')
            .text(String(players.length))
        }
      } else {
        positionGroup
          .append('circle')
          .attr('cx', playerX)
          .attr('cy', playerY)
          .attr('r', 22)
          .attr('fill', 'rgba(255, 255, 255, 0.8)')
          .attr('stroke', '#9CA3AF')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '5,5')
        positionGroup
          .append('text')
          .attr('x', playerX)
          .attr('y', playerY - 5)
          .attr('text-anchor', 'middle')
          .attr('font-size', '14px')
          .attr('font-weight', 'bold')
          .attr('fill', '#6B7280')
          .text(positionCode)
        positionGroup
          .append('text')
          .attr('x', playerX)
          .attr('y', playerY + 8)
          .attr('text-anchor', 'middle')
          .attr('font-size', '9px')
          .attr('fill', '#9CA3AF')
          .text('OPEN')
      }

      if (selectedPosition === positionCode) {
        positionGroup
          .append('circle')
          .attr('cx', playerX)
          .attr('cy', playerY)
          .attr('r', 45)
          .attr('fill', 'none')
          .attr('stroke', '#3B82F6')
          .attr('stroke-width', 3)
          .attr('stroke-dasharray', '8,4')
          .style('pointer-events', 'none')
      }
    })
  }, [
    dimensions,
    getPositionCoords,
    getAssignedPlayers,
    selectedPosition,
    onPositionClick,
  ])

  const posCoords = getPositionCoords(dimensions.width, dimensions.height)
  const fieldPositions = useMemo(
    () => positions.filter((p) => FIELD_POSITION_CODES.includes(p.position_code as (typeof FIELD_POSITION_CODES)[number])),
    [positions]
  )
  const sections = useMemo(
    () => positions.filter((p) => !FIELD_POSITION_CODES.includes(p.position_code as (typeof FIELD_POSITION_CODES)[number])),
    [positions]
  )
  const posEntries = Object.entries(posCoords).filter(([code]) =>
    fieldPositions.some((p) => p.position_code === code)
  )

  return (
    <div className='w-full pb-8' data-testid='enhanced-baseball-field'>
      <div className='rounded-lg border bg-card p-6 pb-10 shadow-sm'>
        <h3 className='mb-6 text-center text-xl font-bold'>
          Baseball Field View
        </h3>
        <div className='flex justify-center px-4'>
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className='rounded-lg border-2 border-border'
            style={{
              background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
            }}
            data-testid='enhanced-field-svg'
          />
        </div>
        <div className='mt-8 grid grid-cols-2 gap-4 md:grid-cols-5'>
          {posEntries.map(([code, coords]) => {
            const players = getAssignedPlayers(code)
            return (
              <button
                key={code}
                type='button'
                onClick={() => onPositionClick?.(code)}
                className={`rounded-lg border-2 p-3 text-left transition-all duration-200 ${
                  selectedPosition === code
                    ? 'border-primary bg-primary/10 shadow-lg'
                    : 'border-border hover:border-muted-foreground/30 hover:shadow-md'
                }`}
              >
                <div className='mb-2 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div
                      className='size-3 rounded-full'
                      style={{ backgroundColor: coords.color }}
                    />
                    <span className='text-sm font-bold'>{code}</span>
                  </div>
                  {players.length > 0 && (
                    <Badge variant='secondary' className='text-xs'>
                      {players.length}
                    </Badge>
                  )}
                </div>
                <div className='mb-2 text-xs text-muted-foreground'>
                  {coords.label}
                </div>
                {players.length > 0 ? (
                  <div className='text-xs font-medium text-primary'>
                    {getAssignmentPlayerName(players[0])}
                    {getAssignmentJerseyNumber(players[0]) &&
                      ` #${getAssignmentJerseyNumber(players[0])}`}
                  </div>
                ) : (
                  <div className='text-xs text-muted-foreground'>
                    Open position
                  </div>
                )}
              </button>
            )
          })}
        </div>
        {sections.length > 0 && (
          <div className='mt-8 border-t pt-6'>
            <h4 className='mb-4 text-sm font-semibold text-muted-foreground'>
              Sections
            </h4>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {sections.map((section) => {
                const players = getAssignedPlayers(section.position_code)
                return (
                  <button
                    key={section.position_code}
                    type='button'
                    onClick={() => onPositionClick?.(section.position_code)}
                    className={`rounded-lg border-2 p-4 text-left transition-all duration-200 ${
                      selectedPosition === section.position_code
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-border hover:border-muted-foreground/30 hover:shadow-md'
                    }`}
                  >
                    <div className='mb-2 flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <div
                          className='size-3 rounded-full'
                          style={{
                            backgroundColor: section.color ?? '#6B7280',
                          }}
                        />
                        <span className='font-semibold'>
                          {section.position_name ?? section.position_code}
                        </span>
                      </div>
                      {players.length > 0 && (
                        <Badge variant='secondary' className='text-xs'>
                          {players.length}
                        </Badge>
                      )}
                    </div>
                    {players.length > 0 ? (
                      <div className='space-y-1 text-xs'>
                        {players.map((a) => (
                          <div
                            key={a.id}
                            className='font-medium text-foreground'
                          >
                            {getAssignmentPlayerName(a)}
                            {getAssignmentJerseyNumber(a) &&
                              ` #${getAssignmentJerseyNumber(a)}`}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='text-xs text-muted-foreground'>
                        No players assigned
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
