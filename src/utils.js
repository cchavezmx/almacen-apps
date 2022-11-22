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
  saveWords: async (words, user) => {
    const query = `
    mutation SaveExpermientalList($busqueda: String, $user: String) {
      saveExpermientalList(busqueda: $busqueda, user: $user)
    }
    `

    await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, variables: { busqueda: words, user } })
    }).then(res => res.json())
      .then(res => {
        console.log(res)
      }
      )
  }
}
