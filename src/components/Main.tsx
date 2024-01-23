
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import React, { useEffect, useState } from "react";
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

export const Main = () => {
  const [messageInputValue, setMessageInputValue] = useState("");
  const user = JSON.parse(localStorage.getItem('user') || '');
  const [users, setUsers] = useState<User[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const publishMsg = ()=>{
    console.log(client);
    console.log(messageInputValue);
    client.publish({
      destination:`/publication/chat/${user.uiNum}`,
      body:JSON.stringify({
        cmiSenderUiNum : user.uiNum,
        cmiMessage : messageInputValue
      })
    });
    setMessageInputValue('');
  }
  const client = new Client({
    brokerURL: 'ws://localhost:8081/chat',
    onConnect: () => {
      client.subscribe(`/topic/enter-chat`, (data) => {
        const tmpUsers = JSON.parse(data.body);
        setUsers(tmpUsers);
      });

      client.subscribe(`/queue/chat/${user.uiNum}`, (data) => {
        const tmpUsers = JSON.parse(data.body);
        setUsers(tmpUsers);
      });
    },
    onDisconnect: () => {

    },
    connectHeaders: {
      Authorization: `Bearer ${user.token}`,
      uiNum: user.uiNum
    }
  }); 
  useEffect(() => {
    client.activate();
  })
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
                userName="Zoe"
                info="Active 10 mins ago"
              />
              <ConversationHeader.Actions>
                <VoiceCallButton />
                <VideoCallButton />
                <InfoButton />
              </ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList
              typingIndicator={<TypingIndicator content="Zoe is typing" />}
            >
              <MessageSeparator content="Saturday, 30 November 2019" />
              
              <Message
                model={{
                  message: "Hello my friend",
                  sentTime: "15 mins ago",
                  sender: "Patrik",
                  direction: "outgoing",
                  position: "last"
                }}
              />
              <Message
                model={{
                  message: "Hello my friend",
                  sentTime: "15 mins ago",
                  sender: "Zoe",
                  direction: "incoming",
                  position: "last"
                }}
              >
                <Avatar src={require("./images/ram.png")} name="Zoe" />
              </Message>
            </MessageList>
            <MessageInput
              placeholder="Type message here"
              value={messageInputValue}
              onChange={(val) => setMessageInputValue(val)}
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
