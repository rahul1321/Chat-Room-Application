import React, { Component } from 'react';

class ChatMessage extends Component {
   
    render() {
        const chat = this.props.chat;
        if (chat.user_id == this.props.loggedInUser.id)
            return (
                <div key={chat.id} className="outgoing_msg">
                    <div className="sent_msg">
                        <p>{chat.message}</p>
                        <span className="time_date">{new Date(chat.created_at).toLocaleString()}</span> </div>
                </div>
            )
        else
            return (
                <div key={chat.id} className="incoming_msg">
                    <div className="incoming_msg_img"> 
                    {
                        chat.user.image == null
                        ?
                        <img className="pro-img" src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> 
                        :
                        <img className="pro-img" src={'/storage/'+ chat.user.image} alt="sunil" /> 
                    }
                        
                    </div>
                    <div className="received_msg">
                        <div className="received_withd_msg">
                            <span className="chat-user-name">{chat.user.name}</span>
                            <p>{chat.message}</p>
                            <span className="time_date"> {new Date(chat.created_at).toLocaleString()}</span></div>
                    </div>
                </div>
            )
    }
}

export default ChatMessage;