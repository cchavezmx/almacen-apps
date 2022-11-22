/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { Input } from '../../mui'

export default function BuscadorCode ({ setResultData, search, setSearch }) {
  const getResults = async (search) => {
    await fetch(`/api/searchProducts?text=${search}`)
      .then(res => res.json())
      .then(res => {
        setResultData(res?.data)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    if (search.length > 2) {
      getResults(search)
    }
  }, [search])

  return (
    <>
      <Input
        placeholder="Buscar codigo"
        onChange={(e) => setSearch(e.target.value)}
      />
    </>
  )
}
