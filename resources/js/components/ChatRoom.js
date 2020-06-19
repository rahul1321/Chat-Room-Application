import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import UserListItem from './UserListItem';
import Pusher from 'pusher-js';
import ChatMessage from './ChatMessage';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CustomModal from '../utils/CustomModal';
import AddRoom from './AddRoom';
import ChatIcon from '@material-ui/icons/Chat';
import EditIcon from '@material-ui/icons/Create';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

class ChatRoom extends Component {

    constructor() {
        super();
        this.state = {
            chatRooms: [],
            name: '',
            message: '',
            chats: [],
            selectedRoomId: {},
            loggedInUser: {},
            chatRoomUsers: [],
            open: false,
            onlineList: [],
            chatRoomFormShow: false,
            title: '',
            content: '',
            filterRoomText: '',
        }

        this.changeHandler = this.changeHandler.bind(this);
        this.showChatRoomData = this.showChatRoomData.bind(this);
        this.addUserToRoom = this.addUserToRoom.bind(this);
        this.removeUserFromRoom = this.removeUserFromRoom.bind(this);
        this.searchRoom = this.searchRoom.bind(this);

    }

    componentDidMount() {
        Axios.get('/userchatrooms')
            .then(res => {
                this.setState({ chatRooms: res.data.rooms, loggedInUser: res.data.loggedinuser });
                this.showChatRoomData(res.data.rooms[0].id);
            });

        this.OnlineStatusBroadCasting();
    }

    componentDidUpdate(prevProps, prevState) {
        //console.log('chatroom componentDidUpdate' + this.state.selectedRoomId + " " + prevState.selectedRoomId)
        if (this.state.selectedRoomId != prevState.selectedRoomId) {
            console.log('call componentDidUpdate')
            this.chatBroadCasting();
        }
    }

    chatBroadCasting() {
        //Pusher.logToConsole = true;
        var pusher = new Pusher('cef12fbebf4b2df96eff', {
            cluster: 'ap2',
            auth: {
                headers: {
                    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
                }
            },
            authEndpoint: '/broadcasting/auth'
        });
        var channel = pusher.subscribe('private-chat.broadcast.' + this.state.selectedRoomId);
        channel.bind('App\\Events\\ChatEvent', data => {
            var chat = data.chat;
            console.log(chat);
            if (chat.user_id != this.state.loggedInUser.id && chat.room_id == this.state.selectedRoomId) {
                var chats = [...this.state.chats, chat];
                this.setState({ chats: chats });
            }
        });
    }

    OnlineStatusBroadCasting() {
        //Pusher.logToConsole = true;
        var pusher = new Pusher('cef12fbebf4b2df96eff', {
            cluster: 'ap2',
            auth: {
                headers: {
                    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
                }
            },
            authEndpoint: '/broadcasting/auth'
        });

        var channel = pusher.subscribe('presence-online');

        channel.bind('pusher:subscription_succeeded', members => {
            console.log('subscription_succeeded');
            members.each(member => {
                var onlineList = [...this.state.onlineList, member.info];
                this.setState({ onlineList: onlineList });
            });
        });

        channel.bind('pusher:member_added', member => {
            console.log('member_added' + member.id);
            var onlineList = [...this.state.onlineList, member.info];
            this.setState({ onlineList: onlineList });
            console.log(onlineList.length);

        });

        channel.bind('pusher:member_removed', member => {
            console.log('member_removed' + member.id);
            var onlineList = this.state.onlineList.filter(user => user.id != member.id);
            this.setState({ onlineList: onlineList });
            console.log(onlineList.length);
        });
    }

    changeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    showChatRoomData(roomId) {
        this.setState({ selectedRoomId: roomId });
        Axios.get('/chatrooms/' + roomId)
            .then(res => {
                this.setState({ chats: res.data.room.chats, chatRoomUsers: res.data.room.users });
            })
    }

    sendMessage() {
        var chatData = {
            room_id: this.state.selectedRoomId,
            message: this.state.message,
        }
        Axios.post('/chats', chatData)
            .then(res => {
                console.log(res);
                var chats = [...this.state.chats, res.data.chat];
                this.setState({ chats: chats });
            })
    }

    createRoom(room) {
        var chatRooms = [...this.state.chatRooms, room];
        this.setState({ chatRooms: chatRooms });
        this.showChatRoomData(room.id);
    }

    editRoom(room) {
        var chatRooms = [...this.state.chatRooms];
        var index = chatRooms.findIndex(obj => obj.id == room.id);
        chatRooms[index] = room;
        this.setState({ chatRooms: chatRooms });
    }

    addUserToRoom(user) {
        var chatRoomUsers = [...this.state.chatRoomUsers, user];
        this.setState({ chatRoomUsers: chatRoomUsers });
    }

    removeUserFromRoom(user) {
        var chatRoomUsers = this.state.chatRoomUsers.filter(item => item.id != user.id);
        this.setState({ chatRoomUsers: chatRoomUsers });
    }

    openUserlist() {
        this.setState({ open: !this.state.open });
    }

    showChatRoomForm(room) {
        if (room == null) //new room
            this.setState({ chatRoomFormShow: true, title: "Add Room", content: <AddRoom room={room} createRoom={this.createRoom.bind(this)} onClose={() => this.setState({ chatRoomFormShow: false })} /> });
        else
            this.setState({ chatRoomFormShow: true, title: "Edit Room", content: <AddRoom room={room} editRoom={this.editRoom.bind(this)} onClose={() => this.setState({ chatRoomFormShow: false })} /> });
    }

    searchRoom(e) {
        this.setState({ filterRoomText: e.target.value });
    }

    render() {
        return (
            <div className="container">
                <div className="messaging">
                    <div className="inbox_msg">
                        <div className="inbox_people">
                            <div className="headind_srch">
                                <div className="recent_heading row">
                                    <h4>Rooms</h4>
                                    <AddCircleOutlineIcon style={{ color: '#05728f' }} onClick={this.showChatRoomForm.bind(this, null)} />
                                </div>
                                <div className="srch_bar">
                                    <div className="stylish-input-group">
                                        <input type="text" name="searchName" onChange={this.searchRoom} className="search-bar" placeholder="Search" />
                                        <span className="input-group-addon">
                                            <button type="button"> <i className="fa fa-search" aria-hidden="true"></i>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="inbox_chat">
                                {
                                    this.state.chatRooms
                                        .filter(room => {
                                            return room.name.toLowerCase().indexOf(this.state.filterRoomText.toLowerCase()) >= 0
                                        })
                                        .map(room => {
                                            return (
                                                <div key={room.id} className={"chat_list " + (room.id == this.state.selectedRoomId ? "active-room" : "")} onClick={() => this.showChatRoomData(room.id)}>
                                                    <div className="chat_people">
                                                        <div className="chat_img"><ChatIcon style={{ color: "#15596b" }} /> </div>
                                                        <div className="chat_ib">
                                                            <div className="room-name-wrapper">
                                                                <h5>{room.name} <EditIcon className="room-edit-icon" onClick={this.showChatRoomForm.bind(this, room)} /> <span className="chat_date">{room.created_at.split('T')[0]}</span></h5>
                                                                <p>{room.description}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                }
                            </div>

                        </div>
                        <div className="mesgs">
                            <div className="chat-room-user row">
                                <div style={{ width: "95%", float: "left", padding: "5px" }}>
                                    Users:
                                    {
                                        this.state.chatRoomUsers.map(user => {
                                            return (
                                                <span style={{ color: this.state.onlineList.some(item => item.id == user.id) ? "#5dd891" : "#a9a6a6" }} key={user.id}> {user.name} </span>
                                            )
                                        })
                                    }
                                </div>
                                <div>
                                    <GroupAddIcon style={{ color: "#05728f" }} onClick={this.openUserlist.bind(this)} />
                                    <UserListItem
                                        open={this.state.open}
                                        chatRoomUsers={this.state.chatRoomUsers}
                                        selectedRoomId={this.state.selectedRoomId}
                                        addUserToRoom={this.addUserToRoom}
                                        removeUserFromRoom={this.removeUserFromRoom} />
                                </div>
                            </div>

                            <div style={{ padding: "30px 15px 0 25px" }}>
                                <div className="msg_history">
                                    {
                                        this.state.chats.length != 0 ? (
                                            this.state.chats.map(chat => {
                                                return <ChatMessage key={chat.id} chat={chat} loggedInUser={this.state.loggedInUser} />
                                            })
                                        ) : (
                                                <div className="no-msg-found">No message found</div>
                                            )
                                    }
                                </div>
                                <div className="type_msg">
                                    <div className="input_msg_write">
                                        <input type="text" className="write_msg" name="message" onChange={this.changeHandler} placeholder="Type a message" />
                                        <button className="msg_send_btn" type="submit" onClick={this.sendMessage.bind(this)}><i className="fa fa-paper-plane-o" aria-hidden="true"></i></button>
                                    </div>
                                </div>

                                <CustomModal
                                    open={this.state.chatRoomFormShow}
                                    onClose={() => this.setState({ chatRoomFormShow: false })}
                                    title={this.state.title}
                                    content={this.state.content}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatRoom;

if (document.getElementById('chatRoomComponent')) {
    ReactDOM.render(<ChatRoom />, document.getElementById('chatRoomComponent'));
}
