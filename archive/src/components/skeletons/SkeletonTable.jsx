import Skeleton from './Skeleton';

export default function SkeletonTable({
  rows = 5,
  columns = 4,
  columnWidths = [],
  showHeader = true,
  className = '',
  animation = 'pulse'
}) {
  // Generate arrays for rows and columns
  const headerColumns = Array.from({ length: columns }, (_, i) => i);
  const bodyRows = Array.from({ length: rows }, (_, i) => i);

  // Get width for a specific column
  const getColumnWidth = (index) => {
    if (columnWidths[index]) {
      return columnWidths[index];
    }
    // Default widths for natural table appearance
    return '100%';
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="table-modern">
        {/* Table Header */}
        {showHeader && (
          <thead>
            <tr>
              {headerColumns.map((colIndex) => (
                <th key={colIndex}>
                  <Skeleton
                    variant="rectangular"
                    width={getColumnWidth(colIndex)}
                    height={16}
                    animation={animation}
                  />
                </th>
              ))}
            </tr>
          </thead>
        )}

        {/* Table Body */}
        <tbody>
          {bodyRows.map((rowIndex) => (
            <tr key={rowIndex}>
              {headerColumns.map((colIndex) => (
                <td key={colIndex}>
                  <Skeleton
                    variant="rectangular"
                    width={getColumnWidth(colIndex)}
                    height={16}
                    animation={animation}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
