import styles from './ChatPage.module.css'
import { Fragment, useEffect, useState } from 'react'

import Logo from '../../assets/imgs/logo.svg'
import Bg from '../../assets/imgs/bg.svg'
import Microphone from '../../assets/imgs/microphone.svg'
import Hedgehog from '../../assets/imgs/hedgehog.svg'
import Penguin from '../../assets/imgs/penguin.svg'
import Cat from '../../assets/imgs/cat.svg'

import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'

const ChatPage = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [recognition, setRecognition] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [user, setUser] = useState({
    login: '',
    chat: 0,
    edit: 0,
    eye: 0
  })
  const [chat, setChat] = useState([])
  console.log(user, chat, transcript)

  const getUser = async (id) => {
    axios.get(`/api/users/${id}`)
      .then(resp => {
        const res = resp.data
        setUser({
          login: res.body.login,
          chat: res.body.chat,
          edit: res.body.edit,
          eye: res.body.eye
        })
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

  const startListening = () => {
    if (recognition) {
      recognition.start()
      setIsListening(true)
    }
  }

  const stopListening = async () => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)

      setTranscript('')
    }
  }

  const changeListen = () => {
    if (isListening) {
      stopListening()
      return
    }
    startListening()
  }

  const sendToAI = async (text) => {
    console.log(chat[chat.length-1])
    if (chat[chat.length - 1] == '잘가') {
      sessionStorage.setItem('chat', 1)
      window.location.href = '/main'
    }

    axios.post('/ai/gen', { text: text + '0' }, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420'
      }
    }).then(resp => {
      console.log(resp)
      const res = resp.data

      const snd = new Audio("data:audio/wav;base64," + res.audio)
      snd.play()

      const blob = new Blob([res.text], { type: 'text/plain; charset=UTF-8' });
      const reader = new FileReader()

      reader.onload = async function (event) {
        setChat(prev => [...prev, '!' + event.target.result.split('친한 친구의 일상적인 말')[0]])
        console.log(event.target.result.split('친한 친구의 일상적인 말')[0])
      }

      // Blob을 읽어 텍스트로 변환합니다.
      reader.readAsText(blob, 'UTF-8')  
    }).catch(e => {
      console.log(e)
    })
  }

  useEffect(() => {
    verify()
    getUser()
    window.scroll({
      top: 0
    })

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true; // 연속적으로 음성 인식
      recognitionInstance.interimResults = true; // 중간 결과도 반환

      recognitionInstance.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setTranscript(transcript => transcript + event.results[i][0].transcript + ' ');

            chat.push(event.results[i][0].transcript)

            sendToAI(event.results[i][0].transcript)
          }
        }
      }

      setRecognition(recognitionInstance)
    }
  }, [])

  return (
    <Fragment>
      <main className={styles.main}>
        <img className={styles.logo} src={Logo} alt="" />

        <div className={styles.title}>상황에 맞춰 대화하기</div>

        <div className={styles.characterContainer}>
          <img className={state === 1 ? styles.character : ( state === 2 ? styles.penguin : styles.cat )} src={state === 1 ? Hedgehog : ( state === 2 ? Penguin : Cat )} alt="" />
        </div>

        <div className={styles.btnContainer}>
          <img className={isListening ? styles.microphone2 : styles.microphone} src={Microphone} onClick={changeListen} alt="" />
        </div>

        <div className={styles.chatContainer}>
          {chat.map((el, idx) => {
            return <div className={el[0] === '!' ? styles.urchat : styles.mychat} key={idx}>{el[0] === '!' ? el.split('!')[1] : el}</div>
          })}
        </div>

        <img className={styles.bg} src={Bg} alt="" />
      </main>
    </Fragment>
  )
}

export default ChatPage