export default function Table ({ data, columns = [] }) {
  return (
  <div className="flex flex-col h-[80vh]">
    <div className="flex-grow overflow-auto">
      <table className="relative w-full">
          <thead className="text-xs uppercase bg-gray-700 text-gray-400 stitcky-head">
              <tr>
                  {
                    columns.map((column) => (
                      <th key={column.id} scope="col" className="sticky bg-gray-700 text-gray-400 top-0 py-3 px-6">
                        { column.label }
                      </th>
                    ))
                  }
              </tr>
          </thead>
          <tbody>
              {
                data.map((column) => (
                <tr key={column._id} className="border-b bg-gray-800 border-gray-700">
                   <th scope="row" className="py-4 px-6 font-medium whitespace-nowrap text-white">
                       { column.AUTOR }
                    </th>
                    <td className="py-4 px-6">
                        { column.CODIGO }
                    </td>
                    <td className="py-4 px-6">
                        { column.DESCRIPCION }
                    </td>
                    <td className="py-4 px-6">
                        { column.ALTERNO || 'N/A' }
                    </td>
                    <td className="py-4 px-6">
                        { column.UMED || 'N/A' }
                    </td>
                  </tr>
                ))
              }
          </tbody>
      </table>
    </div>
  </div>
  )
}
