import { useState } from "react";
import { read, utils, writeFile } from 'xlsx';
// iterar, guardar palabras y retornarlas y validar form
const Experimental = () => {

    const [checked, setChecked] = useState(true);
    const handledConverter = (e) => {
        e.preventDefault();
        
        const form = new FormData(e.target);
        const data = Object.fromEntries(form);
        const { xls, words, group, dictionary, description } = data;
        // convert to blob
        const blob = new Blob([xls], { type: 'application/vnd.ms-excel' });
        // convert file to array buffer
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const wb = read(data);
            const json = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);


            const allWords = words.split(',');

            const search = (arreglo, regex) => {
                return arreglo.filter(item => {                    
                    const currentDescription = String(item[description]);
                    return currentDescription.match(regex);
                })
            }
            
            const allWordsResults = []
            allWords.forEach(regexword => {
                const regex = new RegExp(regexword, 'gi');
                const result = search(json, regex);
                if (result.length > 0) {                    
                    const oneDescription = result[0][description];
                    const oneCounter = result.map(item => item[group])
                    const oneCounterResult = oneCounter.reduce((a, b) => a + b, 0);
                    const counter = isNaN(oneCounterResult) ? 0 : oneCounterResult
                    allWordsResults.push({ [description]: oneDescription, [group]: counter });
                } else {
                    allWordsResults.push({ [description]: `No econtré la palabra ${regexword} `, [group]: 0 })
                }

    
            })

            const finalResult = allWordsResults.flat();
            // crear un nuevo archivo
            const wb2 = utils.book_new();
            const ws = utils.json_to_sheet(finalResult);
            utils.book_append_sheet(wb2, ws, "Resumen");
            writeFile(wb2, `RESUMEN_${xls.name}.xlsx`);

        }  

        reader.readAsArrayBuffer(blob);

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
            <input type="file" name="xls" className="m-5 bg-true-gray-50" />
            <strong className="text-center">Recuerda que las palabras deben estar separado por COMAS</strong>
            <textarea name="words" type="" className="experimental_text_area p-2"/>
            <p className="text-center">
                Todas la palabras que vas usando se guardan para analisis posteriores, 
                <br />Tú puedes elegir, no incluir todas la palabras que has guardado
            </p>
            <label className="flex w-full justify-center gap-4">
                Incluir palabras de analisis previos
                <input 
                    onClick={() => setChecked(!checked)} 
                    name="dictionary" 
                    type="radio" 
                    checked={checked}
                />
            </label>
            <label>Nombre de la columna dentro del xml que se desea sumar
                <input 
                type="text" 
                name="group" 
                className="flex w-full justify-center gap-4 h-10 rounded-md bg-light-100 p-2 m-3" 
                placeholder="Ejemplo: Cantidad"
                />
            </label>
            <label>Nombre de la columna donde esta el texto a analizar
                <input 
                type="text" 
                name="description" 
                className="flex w-full justify-center gap-4 h-10 rounded-md bg-light-100 p-2 m-3" 
                placeholder="Ejemplo: Descripción"
                />
            </label>
            <button className="bg-blue-400 h-16 font-bold text-2xl">Comenzar</button>
        </form>
        </div>
    )
}

export default Experimental