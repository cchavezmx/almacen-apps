import { useState } from 'react'
import * as XLSX from 'xlsx'
import { isWithinInterval, compareDesc } from 'date-fns'

const FileUploader = () => {
  const [result, setResult] = useState(null)
  const [filteredData, setFilteredData] = useState([])
  const [statsData, setStatsData] = useState(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(sheet, {
        raw: false,
        dateNF: 'yyyy-mm-dd HH:MM'
      })

      jsonData.forEach((row) => {
        if (typeof row.FECHA === 'number') {
          row.FECHA = XLSX.SSF.format('yyyy-mm-dd HH:MM', row.FECHA)
        }
      })

      setResult(jsonData)
      setStatsData(null)
      setFilteredData([])
    }
    reader.readAsArrayBuffer(file)
  }

  const calculateStats = (data) => {
    if (!data.length) return null

    const voltageFields = [
      'VOLTAJE L-1',
      'VOLTAJE L-2',
      'VOLTAJE L-3',
      'VOLTAJE L1-L2',
      'VOLTAJE L2-L3',
      'VOLTAJE L3-L1'
    ]

    const stats = {}
    voltageFields.forEach((field) => {
      const values = data
        .map((row) => parseFloat(row[field]))
        .filter((val) => !isNaN(val))
      if (values.length > 0) {
        stats[field] = {
          min: Math.min(...values),
          max: Math.max(...values),
          minDate: data.find(
            (row) => parseFloat(row[field]) === Math.min(...values)
          )?.FECHA,
          maxDate: data.find(
            (row) => parseFloat(row[field]) === Math.max(...values)
          )?.FECHA
        }
      }
    })

    return stats
  }

  const processData = (fechaInicio, fechaFin) => {
    if (!result) return

    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)

    const datosFiltrados = result.filter((row) => {
      const fecha = new Date(row.FECHA)
      return isWithinInterval(fecha, { start: inicio, end: fin })
    })

    datosFiltrados.sort((a, b) =>
      compareDesc(new Date(a.FECHA), new Date(b.FECHA))
    )

    setFilteredData(datosFiltrados)
    setStatsData(calculateStats(datosFiltrados))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo Excel
            </label>
            <input
              type="file"
              accept=".xls,.xlsx,.csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <input
              type="datetime-local"
              id="fechaInicio"
              className="block w-full rounded-md border-gray-300 shadow-sm
                focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <input
              type="datetime-local"
              id="fechaFin"
              className="block w-full rounded-md border-gray-300 shadow-sm
                focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <button
            onClick={() => {
              const fechaInicio = document.getElementById('fechaInicio').value
              const fechaFin = document.getElementById('fechaFin').value
              processData(fechaInicio, fechaFin)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Procesar
          </button>
        </div>
      </div>

      {statsData && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Valores Mínimos y Máximos
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medición
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mínimo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Mínimo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Máximo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Máximo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(statsData).map(([field, values]) => (
                  <tr key={field} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {field}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {values.min.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {values.minDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {values.max.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {values.maxDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Datos Filtrados
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VOLTAJE L-1
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VOLTAJE L-2
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VOLTAJE L-3
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VOLTAJE L1-L2
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VOLTAJE L2-L3
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VOLTAJE L3-L1
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.FECHA}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row['VOLTAJE L-1']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row['VOLTAJE L-2']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row['VOLTAJE L-3']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row['VOLTAJE L1-L2']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row['VOLTAJE L2-L3']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row['VOLTAJE L3-L1']}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploader
