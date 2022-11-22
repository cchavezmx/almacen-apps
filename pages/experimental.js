import { useState } from 'react'
import { read, utils, writeFile } from 'xlsx'
import { experimental } from '../src/utils.js'
import { z } from 'zod'
import { useUser } from '@auth0/nextjs-auth0'
// iterar, guardar palabras y retornarlas y validar form
const Experimental = () => {
  const [checked, setChecked] = useState(true)
  const [errors, setErrors] = useState([])
  const emptyErrors = () => setErrors([])
  const { user } = useUser()

  const handledConverter = (e) => {
    e.preventDefault()

    const form = new FormData(e.target)
    const data = Object.fromEntries(form)
    const { xls, words, group, description } = data
    const validFile = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
    if (!validFile.includes(xls.type)) {
      setErrors((prev) => ({ ...prev, xml: 'Solo se admiten archivos csv o de Excel' }))
      return
    }

    const schema = z.object({
      words: z.string().min(1, 'Debe ingresar palabras para comenzar el análisis'),
      group: z.string().min(1, 'Debe ingresar la columna que se debe analizar'),
      description: z.string().min(1, 'Debe la fila que deseas sumar, para comenzar el análisis')
    })

    const isValid = schema.safeParse(data)
    if (!isValid.success) {
      Object.entries(isValid.error.issues).forEach(([val, key]) => {
        const message = key.message
        const errorName = key.path[0]
        setErrors((prev) => ({ ...prev, [errorName]: message }))
      })
      return
    }

    // convert to blob
    const blob = new Blob([xls], { type: 'application/vnd.ms-excel' })
    // convert file to array buffer
    const reader = new FileReader()
    reader.onload = async (e) => {
      const data = e.target.result
      const wb = read(data)
      const json = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])

      //   const allWords = dictionary ? [...savePrevWords, ...words.split(',')] : words.split(',')
      const allWords = words.trim().split(',')

      const search = (arreglo, regex) => {
        return arreglo.filter(item => {
          const currentDescription = String(item[description]).toLowerCase()
          return currentDescription.match(regex)
        })
      }

      const allWordsResults = []
      allWords.filter(item => item !== '').forEach(regexword => {
        const regex = new RegExp(regexword.trim().toLowerCase(), 'gi')
        const result = search(json, regex)
        if (result.length > 0) {
          const reducer = Object.entries(result).sort(([keyA, valueA], [keyB, valueB]) => {
            return Object.values(valueA).length - Object.values(valueB).length
          })
          const lastResult = reducer.pop()
          const [, oneDescription] = lastResult
          // filtramos el objeto solo con resultados que tengan la group
          const populateResult = result.filter(item => item[group] !== undefined)
          // creamos un arreglo para sumar
          const oneCounter = populateResult.map(item => item[group] && item[group])
          const oneCounterResult = oneCounter.reduce((a, b) => a + b, 0)
          const counter = isNaN(oneCounterResult) ? 0 : oneCounterResult
          allWordsResults.push({ ...oneDescription, [description]: oneDescription[description], [group]: counter })
        } else {
          allWordsResults.push({ [description]: `No econtré la palabra ${regexword} `, [group]: 0 })
        }
      })

      await experimental.saveWords(words.trim(), user?.name)
      const finalResult = allWordsResults.flat()
      // crear un nuevo archivo
      const wb2 = utils.book_new()
      const ws = utils.json_to_sheet(finalResult)
      utils.book_append_sheet(wb2, ws, 'Resumen')
      writeFile(wb2, `RESUMEN_${xls.name}.xlsx`)
    }

    reader.readAsArrayBuffer(blob)
  }

  return (
        <div className="mt-5 grid place-content-center min-h-[70vh] items-center gap-6 overflow-hidden mb-10">
            <h1 className="text-3xl text-6xl">Experimental</h1>
            <p>
                Esta página es experimental: por lo que puede que no funcione correctamente.
                <br />
                Pero todo puede ser prefectible con el tiempo.
            </p>
            <p>
                En el campo de texto coloca la palabras con las que quieres comenzar el analisis
                del archivo.
            </p>
            <p>
                En el campo de <strong>Elergir un archivo</strong> añade tu archivo xls, xml o csv.
            </p>
            <p>
                Presiona el botón <strong>Analizar</strong> para comenzar.
            </p>
        <form className="flex flex-col gap-5" onSubmit={handledConverter}>
            <input
                onFocus={emptyErrors}
                type="file"
                name="xls"
                className="m-5 bg-true-gray-50"
                />
            {errors.xml && <p className="text-red-500">{errors.xml}</p>}
            <strong className="text-center">Recuerda que las palabras deben estar separado por COMAS</strong>
            <textarea
                onFocus={emptyErrors}
                name="words"
                type="text"
                className="experimental_text_area p-2"
            />
            {errors.words && <p className="text-red-500">{errors.words}</p>}
            <div className='flex w-full justify-center'>
            <p className="text-center mr-3">
                Todas la palabras que vas usando se guardan para analisis posteriores,
                <br />Tú puedes elegir, no incluir todas la palabras que has guardado
            </p>
                <button
                    disabled={true}
                    className="bg-indigo-800 text-white rounded-md p-2 w-[240px] disabled:opacity-30">
                    Ver palabras guardadas
                </button>
            </div>
            <div className="flex flex-col gap-5 divide-current" />
            <label className="flex w-full justify-center gap-4 bg-yellow-500 rounded-md p-3 border-l">
                Incluir a la busqueda, palabras de analisis previos
                <input
                    onClick={() => setChecked(!checked)}
                    name="dictionary"
                    type="radio"
                    checked={checked}
                    disabled={true}
                    className="disabled:opacity-30"
                />
            </label>
            <label>Nombre de la columna dentro del xml que se desea sumar
                <input
                    onFocus={emptyErrors}
                    type="text"
                    name="group"
                    className="flex w-full justify-center gap-4 h-10 rounded-md bg-light-100 p-2 m-3"
                    placeholder="Ejemplo: Cantidad"
                />
                {errors.group && <p className="text-red-500">{errors.group}</p>}
            </label>
            <label>Nombre de la columna donde esta el texto a analizar
                <input
                    onFocus={emptyErrors}
                    type="text"
                    name="description"
                    className="flex w-full justify-center gap-4 h-10 rounded-md bg-light-100 p-2 m-3"
                    placeholder="Ejemplo: Descripción"
                />
                {errors.description && <p className="text-red-500">{errors.description}</p>}
            </label>
            <button className="bg-blue-400 h-16 font-bold text-2xl">Comenzar</button>
        </form>
        </div>
  )
}

export default Experimental
