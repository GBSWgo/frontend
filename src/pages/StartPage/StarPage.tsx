import { Link, useNavigate } from 'react-router-dom'
import styles from './StartPage.module.css'
import Logo from '../../assets/imgs/logo.svg'
import { useEffect } from 'react'
import axios from 'axios'

const StartPage = () => {
  const navigate = useNavigate()
  
  const verify = async () => {
    axios.get('/api/auth/status')
    .then(resp => {
      const res = resp.data

      if (res.body.userId) navigate('/main')
    })
  }

  useEffect(() => {
    verify()
  }, [])

  return (
    <main className={styles.main}>
      <img className={styles.logo} src={Logo} />

      <div className={styles.text}>언어를 배우다,</div>
      <div className={styles.text}>세계를 배우다.</div>

      <div className={styles.btnContainer}>
        <Link className={styles.btn} to={'/login'}>로그인</Link>
        <Link className={styles.btn} to={'/signup'}>회원가입</Link>
      </div>
    </main>
  )
}

export default StartPage