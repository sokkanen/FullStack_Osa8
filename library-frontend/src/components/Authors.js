import React, {useState} from 'react'

const Authors = ({data, show, changeBorn}) => {

  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  if (!show) {
    return null
  } else if (data.loading){
    return <div>loading...</div>
  }

  console.log('HÖHÖ')

  const authors = data.data.allAuthors

  const changeBirthYear = async (e) => {
    e.preventDefault()
    const brn = Number(born)
    await changeBorn({ variables: {name, brn}})
    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={changeBirthYear}>
      <div>
        name: <input 
          type="text"
          value={name}
          onChange={({ target }) => setName(target.value)}>
        </input>
      </div>
      <div>
        birthyear: <input 
          type="number"
          value={born}
          onChange={({target}) => setBorn(target.value)}>
        </input>
      </div>
      <div>
        <button type="submit">set</button>
      </div>
      </form>
    </div>
  )
}

export default Authors