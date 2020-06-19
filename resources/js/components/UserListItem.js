import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Axios from 'axios';

class UserListItem extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            chatRoomUsers: this.props.chatRoomUsers,
            allUsers : [],
            selectedRoomId: this.props.selectedRoomId,
        }

        this.addUserToRoom = this.addUserToRoom.bind(this);
        this.removeUserFromRoom = this.removeUserFromRoom.bind(this);
    }


    componentDidMount(){
        Axios.get('/users')
        .then(res=>{
            this.setState({allUsers: res.data.users})
        });
    }

    componentDidUpdate(prevProps){
        if(this.props.chatRoomUsers != prevProps.chatRoomUsers) {
           // console.log('call componentDidUpdate');
            this.setState({chatRoomUsers: this.props.chatRoomUsers, selectedRoomId: this.props.selectedRoomId})
        }
    }

    addUserToRoom(user){
        Axios.put('/addusertoroom/'+this.state.selectedRoomId,{user_id : user.id})
        .then(res=>{
            this.props.addUserToRoom(user);
        })
    }

    removeUserFromRoom(user){
        Axios.put('/removeuserfromroom/'+this.state.selectedRoomId,{user_id : user.id})
        .then(res=>{
            this.props.removeUserFromRoom(user);
        })
    }


    render() {
        const that = this;
        return (
            <>
            <div className="user-add-list" style={{display: this.props.open?" block": " none"}}>
            <List component="nav" aria-label="main mailbox folders">
                {
                    this.state.allUsers.map(function(user){
                        return(
                            <ListItem key={user.id}>
                                {
                                    user.image == null
                                    ?
                                    <img style={{marginRight: '8px'}} className="pro-img" src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> 
                                    :
                                    <img style={{marginRight: '8px'}} className="pro-img" src={'/storage/'+ user.image} alt="sunil" /> 
                                }
                                <ListItemText>{user.name}</ListItemText>
                                
                                {
                                that.state.chatRoomUsers.some(item => item.id == user.id) 
                                ?
                                <HighlightOffIcon style={{ color: "#dc1c1c" }} onClick={()=>that.removeUserFromRoom(user)}/>
                                :
                                <AddCircleOutlineIcon style={{ color: 'green' }} onClick={()=>that.addUserToRoom(user)}/>
                                }

                            </ListItem>
                        ) 
                    })
                }
                
            </List>
            </div>  
            </>
        );
    }
}

export default UserListItem;