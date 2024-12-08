import { useChatStore } from "../store/useChatStore"
import { useEffect } from "react";


import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
    const {messages, getMessages, isMessagesLoading,selectedUser} = useChatStore()
      const { authUser } = useAuthStore();
    

    useEffect(() => {
        getMessages(selectedUser._id)

    }, [selectedUser._id, getMessages ])

    if(isMessagesLoading) { 
        return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <MessageSkeleton />
            <MessageInput  />

        </div>
    );

}
    


    
  return (
    <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">


         
      </div>

        <MessageInput />
      
    </div>
  )
}

export default ChatContainer;
