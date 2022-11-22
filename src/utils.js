const baseURL = process.env.NEXT_PUBLIC_GRAPHQL_URL

export const experimental = {
  getWords: async () => {
    const query = `
        query Query {
            getAllExperimentalFromArray
            }
        `

    const response = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        return res.data.getAllExperimentalFromArray
      })

    return response
  },
  saveWords: async (words) => {
    const query = `
    mutation SaveExpermientalList($busqueda: String) {
        saveExpermientalList(busqueda: $busqueda)
      }
    `

    await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, variables: { busqueda: words } })
    }).then(res => res.json())
      .then(res => {
        console.log(res)
      }
      )
  }
}
