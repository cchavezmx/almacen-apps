// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function getProductos (req, res) {
  const url = process.env.NEXT_PUBLIC_API
  const { skip } = req.query
  try {
    const data = await fetch(`${url}/mcbetty/ultimos?skip=${skip}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => data.message)
    .catch(err => console.log(err))
    return res.status(200).json({ data })
  } catch (error) {    
    return res.status(500).json({ error: error.message })
  }
}
