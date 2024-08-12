import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";

const API_KEY="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";


function App() {
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);  // []

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }

    const newMessages = [...messages, newMessage]; // all the old messages, + the new message

    // update our message state
    setMessages(newMessages);
    // set a typing indicatopr (chatgpt is typing)
    setTyping(true);


    //process message to chstGPT (send it over and see the response)
    await processMessageToChatGPT(newMessages);
  }
  async function processMessageToChatGPT (chatMessages) {
    // chatMessages {sender: "user" or "ChatGPT", message: "The message content here"}
    // apiMessages {role: "user" or "assistant", content: "The message content here"}

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if(messageObject.sender === "ChatGPT") {
        role ="assistant";
      } else {
        role ="user";
      }
      return {role: role, content: messageObject.message}

    });

    // role: 'user -> a message from the user, "assitant" -> a response from chatGPT
    // "system" -> generally one initial message defining how we want chatgpt to talk

    const systemMessage ={
      role: "system",
      content: "Explain all concepts like I am 10 years old." // Speak  like a pirate, Explain like i am a 10 years of experience on software engineering
    }
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        ...apiMessages 
      ]
    }

  
   await fetch("https://api.openai.com/v1/chat/completions", {
     method: "POST",
       headers: {
       "Authorization": "Bearer " + "API_KEY",
       "Content-Type" : "application/json" },
       body: JSON.stringify(apiRequestBody)})
      .then((data) => {
       return data.json();})
      .then((data) => {
       console.log(data);
       console.log(data.choices[0].message.content);

      setMessages([
         ...chatMessages, 
        {
        message: data.choices[0].message,
         sender: "ChatGPT"
        }
      ]);
      setTyping(false);
      });
    }


  return (
    <div className="App">
      <div style={{position: "relative", height: "800px", width: "700px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
            scrollBehavior='smooth'
            typingIndicator= {typing ? <TypingIndicator content ="ChatGPT is typing" /> : null}
            >
              {messages.map ((message, i) => {
               return <Message key={i} model={message}/>  
              })}

            </MessageList>
            <MessageInput placeholder='Type message here' onSend={handleSend}/>


          </ChatContainer>
        </MainContainer>

      </div>


    </div>
  )
}


export default App
      
