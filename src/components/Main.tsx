
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import React, { useEffect, useRef, useState } from "react";
import {
  MainContainer,
  Sidebar,
  Search,
  ConversationList,
  Conversation,
  Avatar,
  ChatContainer,
  ConversationHeader,
  VoiceCallButton,
  Message,
  MessageInput,
  VideoCallButton,
  InfoButton,
  MessageSeparator,
  TypingIndicator,
  MessageList
} from "@chatscope/chat-ui-kit-react";
import { Client } from "@stomp/stompjs";
import { User } from "../types/User.type";
import { Msg } from "../types/Msg.type";
import axios from "axios";

export const Main = () => {
  const [messageInputValue, setMessageInputValue] = useState("");
  const user = JSON.parse(localStorage.getItem('user') || '');
  const [users, setUsers] = useState<User[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [opUser, setOpUser] = useState<User>(user); 
  const [typing, setTyping] = useState<boolean>(false);
  const client = useRef<any>({});
  const init = () => {
    client.current = new Client({
      brokerURL: `${process.env.REACT_APP_WS_PROTOCOL}://${process.env.REACT_APP_HOST}/chat`,
      onConnect: () => {
        client.current.subscribe(`/topic/enter-chat`, (data: any) => {
          const tmpUsers = JSON.parse(data.body);
          setUsers(tmpUsers);
        });

        client.current.subscribe(`/queue/chat/${user.uiNum}`, (data: any) => {
          const msg = JSON.parse(data.body);
          setMsgs(msgs => [...msgs, msg]);
        });
      },
      onDisconnect: () => {

      },
      connectHeaders: {
        Authorization: `Bearer ${user.token}`,
        uiNum: user.uiNum
      }
    });
    client.current.activate();
  }

  const getMessageInfos = async (opUiNum:number|undefined)=>{
    const getMessageParam = {
      cmiSenderUiNum: user.uiNum,
      cmiReceiveUiNum: opUiNum
    }
    await axios.post(`${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_HOST}/chat/message-infos`,
    getMessageParam,{
      headers: {
        'Content-Type' : 'application/json;charset=UTF-8'
      }}
    ).then(res=>{
      res.data.map((message:any)=>{
        setMsgs(msgs => [...msgs, message]);
      })
    });
  }

  const publishMsg = () => {
    client.current.publish({
      destination: `/publication/chat/${opUser.uiNum}`,
      body: JSON.stringify({
        cmiSenderUiNum: user.uiNum,
        cmiMessage: messageInputValue,
        cmiReceiveUiNum: opUser.uiNum
      })
    });
    setMessageInputValue('');
  }
  useEffect(()=>{
    init();
  },[]);
  
  return (
    <div className="auth-wrapper">
      <div
        style={{
          height: "600px",
          position: "relative"
        }}
      >
        <MainContainer responsive>
          <Sidebar position="left" scrollable={false}>
            <Search placeholder="Search..." />
            <ConversationList>
              {users.map((user, idx) => (
                <Conversation key={idx}
                  name={user.uiName}
                  lastSenderName={user.uiName}
                  info="Hello !"
                  style={{ justifyContent: "start" }}
                  onClick={()=>{
                    client.current.subscribe(`/queue/chat/${user.uiNum}`, (data: any) => {
                      const msg = JSON.parse(data.body);
                      setMsgs(msgs => [...msgs, msg]);
                    });
                    setMsgs([]);
                    setOpUser(user);
                    getMessageInfos(user.uiNum);
                  }}
                >

                  <Avatar
                    src={require("./images/ram.png")}
                    name="Zone"
                    status={user.login ? 'available' : 'dnd'}
                  />
                </Conversation>
              ))}
            </ConversationList>
          </Sidebar>

          <ChatContainer>
            <ConversationHeader>
              <ConversationHeader.Back />
              <Avatar src={require("./images/ram.png")} name="Zoe" />
              <ConversationHeader.Content
                userName={opUser.uiName}
                info={opUser.loginDate}
              />
              <ConversationHeader.Actions>
                <VoiceCallButton />
                <VideoCallButton />
                <InfoButton />
              </ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList
              typingIndicator={typing?<TypingIndicator content="Zoe is typing" />:''}
            >
              {msgs.map((msg, idx) => (
                <Message key={idx}
                  model={{
                    message: msg.cmiMessage,
                    sentTime: msg.cmiSentTime,
                    sender: msg.cmiSender,
                    direction: user.uiNum === msg.cmiSenderUiNum ? "outgoing" : "incoming",
                    position: "normal"
                  }}
                  avatarSpacer={user.uiNum === msg.cmiSenderUiNum}
                >
                  {user.uiNum === msg.cmiSenderUiNum ? '' : <Avatar src={require("./images/ram.png")} name="Zoe" />}
                </Message>
              ))}

              <MessageSeparator content="Saturday, 30 November 2019" />
            </MessageList>
            <MessageInput
              placeholder="Type message here"
              value={messageInputValue}
              onChange={(val) => {
                setMessageInputValue(val);
                setTyping(val.length>0);
              }}
              onSend={publishMsg}
            />
          </ChatContainer>

          {/* <Sidebar position="right">
          <ExpansionPanel open title="INFO">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
          </ExpansionPanel>
          <ExpansionPanel title="LOCALIZATION">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
          </ExpansionPanel>
          <ExpansionPanel title="MEDIA">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
          </ExpansionPanel>
          <ExpansionPanel title="SURVEY">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
          </ExpansionPanel>
          <ExpansionPanel title="OPTIONS">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
          </ExpansionPanel>
        </Sidebar> */}
        </MainContainer>
      </div>
    </div>
  );
}
