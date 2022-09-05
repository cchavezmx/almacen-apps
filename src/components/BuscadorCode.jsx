import { useState, useEffect } from "react"
import { Input } from "../../mui"


export default function BuscadorCode ({ setResultData, search, setSearch }) {
  

  const getResults = async (search) => {
    await fetch(`/api/serachProducts?text=${search}`)
    .then(res => res.json())
    .then(res => {
      console.log("🚀 ~ file: BuscadorCode.jsx ~ line 12 ~ getResults ~ res", res)      
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