import React from 'react';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';


function getModalStyle() {
  const top = 45;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-50%, -50%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    minWidth: 300,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: '10px'
  },
}));

export default function CustomModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  return (
    <>
      <Modal
        open={props.open || false}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <IconButton style={{ position: 'absolute', right: '0', top: '0' }} onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
          <div className='custom-modal-header'>
            <h4 id="simple-modal-title">{props.title}</h4>
          </div>
          <div className='custom-modal-body'>
            {props.content}
          </div>
        </div>

      </Modal>
    </>
  );
}