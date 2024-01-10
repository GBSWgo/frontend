import { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './MainPage.module.css'
import Logo from '../../assets/imgs/logo.svg'
import Default from '../../assets/imgs/default.jpg'
import Arrow from '../../assets/imgs/arrow.svg'
import Help from '../../assets/imgs/help.svg'
import HedgehogCard from '../../assets/imgs/hedgehogCard.svg'
import PenguinCard from '../../assets/imgs/penguinCard.svg'
import CatCard from '../../assets/imgs/catCard.svg'
import Lock from '../../assets/imgs/lockWhite.svg'

const MainPage = () => {
  const navigate = useNavigate()
  const [isWindow, setIsWindow] = useState(false)
  const [user, setUser] = useState({
    login: '',
    chat: 0,
    edit: 0,
    eye: 0
  })

  const getUser = async (id: number) => {
    axios.get(`/api/users/${id}`)
      .then((resp) => {
        const res = resp.data

        setUser({
          login: res.body.login,
          chat: res.body.chat,
          edit: res.body.edit,
          eye: res.body.eye
        })

        if (sessionStorage.getItem('chat')) {
          axios.patch(`/api/users/${id}`, {
            chat: res.body.chat + 1
          }).then(() => sessionStorage.removeItem('chat'))
        }
      })
  }

  const verify = async () => {
    axios.get('/api/auth/status')
      .then(resp => {
        const res = resp.data
        getUser(res.body.userId)
      })
      .catch(() => {
        navigate('/')
      })
  }

  const setCharacter = (type: number) => {
    if (type === 1) {
      navigate('/chat', { state: type })   
      return
    }

    if (type === 2 && user.chat > 5) {
      navigate('/chat', { state: type })
      return
    }

    if (type === 3 && user.chat > 10) {
      navigate('/chat', { state: type })
      return
    }
  }

  useEffect(() => {
    verify()
  }, [])

  return (
    <Fragment>
      {isWindow ?
        <div className={styles.windowContainer}>
          <div className={styles.window}>
            <div className={styles.windowTitle}>
              캐릭터 선택
              <img className={styles.help} src={Help} alt="" />
            </div>

            <div className={styles.cardContainer2}>
              <div className={styles.cardLock}>
                <img className={styles.characterCard} src={HedgehogCard} alt="" onClick={() => setCharacter(1)} />
              </div>

              <div className={styles.cardLock}>
                <img className={user.chat > 5 ? styles.lockx : styles.lock} src={Lock} alt="" />
                <img className={user.chat > 5 ? styles.characterCard : styles.characterCardx} src={PenguinCard} alt="" onClick={() => setCharacter(2)} />
              </div>

              <div className={styles.cardLock}>
                <img className={user.chat > 10 ? styles.lockx : styles.lock} src={Lock} alt="" />
                <img className={user.chat > 10 ? styles.characterCard : styles.characterCardx} src={CatCard} alt="" onClick={() => setCharacter(3)} />
              </div>
            </div>
          </div>
        </div>
      : null }

      <main className={styles.main}>
        <img className={styles.logo} src={Logo} alt="" />

        <img className={styles.profile} src={Default} alt="" />
        <div className={styles.name}>{user.login}</div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <b className={styles.n}>{user.chat}</b>
            <div className={styles.tag}>진행한 대화</div>
          </div>

          {/* <div className={styles.hr} />

        <div className={styles.stat}>
          <b className={styles.n}>0</b>
          <div className={styles.tag}>수정해나가기</div>
        </div> */}

          <div className={styles.hr} />

          <div className={styles.stat}>
            <b className={styles.n}>{user.eye}</b>
            <div className={styles.tag}>눈 맞춤</div>
          </div>
        </div>

        <div className={styles.start}>
          시작하기
          <img className={styles.arrow} src={Arrow} alt="" />
        </div>

        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>상황에 맞춰 대화하기</div>
            <div className={styles.rewards}>진행한 대화 +1</div>
            <div className={styles.go} onClick={() => setIsWindow(true)}>하러가기!</div>
          </div>

          {/* <div className={stydivles.card}>
          <div className={styles.cardTitle}>대화 수정해 보기</div>
          <div className={styles.rewards}>수정해나가기 +1</div>
          <Link className={styles.go} to={'/edit'}>하러가기!</Link>
        </div> */}

          <div className={styles.card}>
            <div className={styles.cardTitle}>눈 맞추며 대화하기</div>
            <div className={styles.rewards}>눈 맞춤 +1</div>
            <Link className={styles.go} to={'/edit'}>하러가기!</Link>
          </div>
        </div>
      </main>
    </Fragment>
  )
}

export default MainPage