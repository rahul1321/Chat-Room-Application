import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import Axios from 'axios';


class AddRoom extends Component {
    constructor(props) {
        super(props);
        let room = this.props.room;
        this.state = {
            isEdit: room != null,
            name: room != null ? room.name : '',
            description: room != null ? room.description : '',
            room: room,
            nameError: "",
        }

        this.changeHandler = this.changeHandler.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.saveRoom = this.saveRoom.bind(this);
    }

    changeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    closeModal() {
        this.props.onClose();
    }

    saveRoom(event) {
        event.preventDefault();
        var chatroom = {
            name: this.state.name,
            description: this.state.description
        }
        if(this.state.isEdit){
            Axios.put('/chatrooms/'+ this.state.room.id, chatroom)
            .then(res => {
                console.log('update-->'+res.data.room);
                this.props.editRoom(res.data.room);
                this.closeModal();
            });
        }else{
            Axios.post('/chatrooms', chatroom)
            .then(res => {
                this.props.createRoom(res.data.room);
                this.closeModal();
            });
        }
        
    }

    render() {
        return (
            <>
                <Form onSubmit={this.saveRoom}>
                    <Form.Group>
                        <Form.Control onChange={this.changeHandler} type="text" name='name' value={this.state.name || ''} placeholder="Enter name" />
                        <span className="validation-error">{this.state.nameError}</span>
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows="3" onChange={this.changeHandler} name='description' value={this.state.description || ''} />
                    </Form.Group>

                    <div style={{ width: '100%', textAlign: 'center' }}>
                        <Button className="btn-edit" type="submit">
                            {this.state.isEdit ? "Save" : "Create"}
                        </Button>
                        <Button className="btn-delete" onClick={this.closeModal}>
                            Cancel
                        </Button>
                    </div>

                </Form>
            </>
        );
    }
}

export default AddRoom;