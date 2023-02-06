import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const CustomizableModal = (props) => {
    const modalOpenBtn = props.modalOpenBtn;
    const heading = props.heading;
    const btn1Text = props.btn1Text;
    const btn2Text = props.btn2Text;
    const CustomBtn = props.customBtn;

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            {CustomBtn ? (
                CustomBtn
            ) : (
                <Button variant="primary" onClick={handleShow}>
                    {modalOpenBtn}
                </Button>
            )}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{heading}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.body}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {btn1Text}
                    </Button>
                    <Button variant="primary" onClick={props.btn2Func}>
                        {btn2Text}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CustomizableModal;
