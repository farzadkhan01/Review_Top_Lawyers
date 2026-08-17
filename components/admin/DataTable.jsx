/** @format */

export default function DataTable({ columns, rows, getRowKey, renderMobileCard, emptyState }) {
  if (!rows.length) {
    return emptyState ?? null;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-cream-200 bg-white">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-cream-200 bg-cream-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="px-4 py-3 font-semibold text-muted-600">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {rows.map((row) => (
              <tr key={getRowKey(row)} className="hover:bg-cream-50/60">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 align-middle text-navy-900">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-cream-200 md:hidden">
        {rows.map((row) => (
          <li key={getRowKey(row)} className="p-4">
            {renderMobileCard(row)}
          </li>
        ))}
      </ul>
    </div>
  );
}
