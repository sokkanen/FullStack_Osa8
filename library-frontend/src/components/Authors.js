import React, {useState} from 'react'
import Select from 'react-select'

const Authors = ({data, show, changeBorn}) => {
  if (!show) {
    return null
  } else if (data.loading){
    return <div>loading...</div>
  }

  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [authors, setAuthors] = useState(data.data.allAuthors)
  const changeBirthYear = async (e) => {
    e.preventDefault()
    const brn = Number(born)
    await changeBorn({ variables: {name, brn}})
    let modifiedAuthor = authors.find(a => a.name === name)
    const mod = {...modifiedAuthor, born: brn}
    setAuthors(authors.map(a => a.name === mod.name ? mod: a))
    setName('')
    setBorn('')
  }

  const options = []
  authors.forEach(a => {
    const auth = {value: a.name, label: a.name}
    options.push(auth)
  })

  if (localStorage.getItem('user-token') === null){
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
    </div>
    )
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
        <Select
            value={name.value}
            onChange={( name ) => setName(name.value)}
            options={options}
        />
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