import React, { useState , useEffect , useRef } from 'react';
import './chat.css';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


const UserMessage = ({ text }) => {
  const content = Object.values(text).map((value, index) => (
    <div className='tt' key={index}><p>{value}</p></div>
  ));
  return <div className="user">{content}</div>
};

const BotMessage = ({ text }) => {
  const content = Object.values(text).map((value, index) => (
    <div className='tt' key={index}><li><p>{value}</p></li></div>
  ));
  return <div className="bot">{content}</div>
};

const Chat = () => {
  const [input, setInput] = useState('');
  const [chatMessages, setChatMessages] = useState([{type:'bot',text:["Hello and welcome! I'm here and ready to help. What brings you to our conversation?"]}]);
  const [mic, setMic]= useState(false);
  const messagesEndRef = useRef();
  const inputRef = useRef();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const sendMsg = () => {
    const cInput = mic ? transcript : input;

    if (cInput.trim() !== '') {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: 'user', text: [cInput] },
      ]);


      axios.post('http://127.0.0.1:5000/chat',{"query" : cInput.replace(/\./g, ' ').trim()})
      .then(response =>{
        console.log(response.data.data[0]);
        setChatMessages((prevMessages) => [
          ...prevMessages,{type: 'bot', text: response.data.data[0].res }
        ]);
      })
      .catch(err =>{
        console.log(err);
        setChatMessages((prevMessages) => [
          ...prevMessages,{type: 'bot', text: ["Oops! Something went wrong. Please try again in a moment."] }
        ]);
      })
      
      setInput('');
      resetTranscript();
      if (!mic){
        inputRef.current.focus();
      }
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  return (
    <div className='main'>
      <div className='chat'>
        <div className='dis'>
            {chatMessages.map((message, index) => (
              message.type === 'user' ? (
                <UserMessage key={index} text={message.text} />
              ) : (
                <BotMessage key={index} text={message.text} />
              )
            ))}
            <div ref={messagesEndRef} />
        </div>
        <div className='msg'>
          { mic ? (
            <>
            <div className="text-container">
              {transcript}
            </div>
            <div className="mic-container">
              {listening ? (
                <svg className='i' onClick={(e)=>SpeechRecognition.stopListening()} xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
                  <path fill="#F40009" d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192zm0 224a128 128 0 1 0 0-256 128 128 0 1 0 0 256zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
                </svg>
              ):(
                <svg className='i' onClick={(e)=>SpeechRecognition.startListening()} xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 384 512"><path d="M96 96V256c0 53 43 96 96 96s96-43 96-96H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h80V192H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h80V128H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h80c0-53-43-96-96-96S96 43 96 96zM320 240v16c0 70.7-57.3 128-128 128s-128-57.3-128-128V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v24z"/>
                </svg>
              )}
              <svg className='i' onClick={(e)=>{resetTranscript()}} xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 448 512">
                <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
              </svg>
              <svg className='i' onClick={sendMsg} xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
                <path fill="#ffffff" d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3.3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
              </svg>
            </div>
            <svg className='i' onClick={(e)=>setMic(false)} xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 576 512">
            <path d="M64 112c-8.8 0-16 7.2-16 16V384c0 8.8 7.2 16 16 16H512c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H64zM0 128C0 92.7 28.7 64 64 64H512c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM176 320H400c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V336c0-8.8 7.2-16 16-16zm-72-72c0-8.8 7.2-16 16-16h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H120c-8.8 0-16-7.2-16-16V248zm16-96h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H120c-8.8 0-16-7.2-16-16V168c0-8.8 7.2-16 16-16zm64 96c0-8.8 7.2-16 16-16h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H200c-8.8 0-16-7.2-16-16V248zm16-96h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H200c-8.8 0-16-7.2-16-16V168c0-8.8 7.2-16 16-16zm64 96c0-8.8 7.2-16 16-16h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H280c-8.8 0-16-7.2-16-16V248zm16-96h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H280c-8.8 0-16-7.2-16-16V168c0-8.8 7.2-16 16-16zm64 96c0-8.8 7.2-16 16-16h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H360c-8.8 0-16-7.2-16-16V248zm16-96h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H360c-8.8 0-16-7.2-16-16V168c0-8.8 7.2-16 16-16zm64 96c0-8.8 7.2-16 16-16h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H440c-8.8 0-16-7.2-16-16V248zm16-96h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H440c-8.8 0-16-7.2-16-16V168c0-8.8 7.2-16 16-16z"/>
            </svg>
            </>
          ) : (
            <>
            <input
            ref={inputRef}
            className='input'
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={ (e) =>{
              if (e.key === 'Enter') sendMsg();
            }}
            placeholder='Type your message...' />
            <svg className='i' onClick={sendMsg} xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
              <path fill="#ffffff" d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3.3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
            </svg>
            <svg className='i' onClick={(e)=>setMic(true)} xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 384 512">
              <path fill="#ffffff" d="M96 96V256c0 53 43 96 96 96s96-43 96-96H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h80V192H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h80V128H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h80c0-53-43-96-96-96S96 43 96 96zM320 240v16c0 70.7-57.3 128-128 128s-128-57.3-128-128V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v24z" />
            </svg></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
