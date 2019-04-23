import React, {useState} from 'react'

const Loginform = (props) => {

if (!props.show){
    return <div></div>
}

const [username, setUsername] = useState('')
const [password, setPassword] = useState('')

const login = props.login
const setToken = props.setToken
const handleError = props.handleError
const handleMessage = props.handleMessage
const setPage = props.setPage

const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const result = await login({
        variables: { username, password }
      })

      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('user-token', token)
      setPage('authors')
      const msg = `${username} logged in`
      handleMessage(msg)
    } catch(error){
      handleError(error)
    }
    setUsername('')
    setPassword('')
}

    return (
        <div>
            <form onSubmit={handleLogin}>
                <div>
                    username:
                    <input value={username} onChange={({target}) => setUsername(target.value)}></input>
                </div>
                <div>
                    password:
                    <input value={password} type='password' onChange={({target}) => setPassword(target.value)}></input>
                </div>
                <div>
                    <button type='submit'>LOGIN</button>
                </div>
            </form>
        </div>
    )
}

export default Loginform