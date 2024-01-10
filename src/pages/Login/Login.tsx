import styles from './Login.module.css'
import './Login.module.css'
import Logo from '../../assets/imgs/logo.svg'
import Envelop from '../../assets/imgs/envelop.svg'
import Lock from '../../assets/imgs/lock.svg'
import { Link, useNavigate } from 'react-router-dom'
import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import axios from 'axios'

const Login = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    email: '',
    password: ''
  })
  const [isError, setIsError] = useState<boolean>(false)

  const verify = async () => {
    axios.get('/api/auth/status')
      .then(resp => {
        const res = resp.data

        if (res.body.userId) navigate('/main')
      })
  }

  const onSubmit = () => {
    if (user.email === '' || user.password === '') {
      setIsError(true)
      setTimeout(() => setIsError(false), 2000)
    }

    axios.post('/api/auth/by-pass', user, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((resp) => {
      if (resp.data.success)
        window.location.href = '/main'
    }).catch(() => {
      setIsError(true)
      setTimeout(() => setIsError(false), 2000)
    })
  }

  useEffect(() => {
    verify()
  }, [])

  return (
    <Fragment>
      <div className={styles.notificationContainer}>
        <div className={isError ? styles.notification : styles.notificationx}>
          <svg className={styles.xmark} fill='#ff5757' xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
          이메일이나 비밀번호를 확인해주세요!
        </div>
      </div>

      <main className={styles.main}>
        <img className={styles.logo} src={Logo} />

        <div className={styles.inputContainer}>
          <img className={styles.icon} src={Envelop} alt="" />
          <input className={styles.text} type="email" placeholder='dyacode@pmh.codes' onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, email: e.target.value })} />
        </div>

        <div className={styles.inputContainer}>
          <img className={styles.icon} src={Lock} alt="" />
          <input className={styles.text} type="password" placeholder='**********' onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, password: e.target.value })} />
        </div>

        <div className={styles.btnContainer}>
          <div className={styles.btn} onClick={onSubmit}>로그인</div>
          <Link className={styles.btn2} to={'/signup'}>계정이 없나요?</Link>
        </div>
      </main>
    </Fragment>
  )
}

export default Login