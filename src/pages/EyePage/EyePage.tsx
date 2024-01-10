import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './EyePage.module.css'

const EyePage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    login: '',
    chat: 0,
    edit: 0,
    eye: 0
  })
  console.log(user)

  const verify = async () => {
    axios.get('/api/auth/status')
    .catch(() => {
      navigate('/')
    })
  }

  const getUser = async () => {
    axios.get('/api/users/@me')
      .then(resp => {
        const res = resp.data
        console.log(res)
        
        setUser({
          login: res.login,
          chat: res.chat,
          edit: res.edit,
          eye: res.eye
        })
      })
  }

  useEffect(() => {
    verify()
    getUser()
  }, [])
  
  return (
    <main className={styles.main}>

    </main>
  )
}

export default EyePage