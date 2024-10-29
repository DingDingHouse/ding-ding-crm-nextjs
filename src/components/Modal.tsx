import React from 'react'
import ReactDOM from "react-dom";

const Modal = ({ closeModal, modaltype, children }: any) => {
    const handleClose = () => {
        closeModal(false);
    };
    const modalElement = document.getElementById("modal");
    if (!modalElement) {
        return null;
    }
    return ReactDOM.createPortal(
        <>
            <div
                onClick={handleClose}
                data-modal-backdrop="static"
                aria-hidden="true"
                className="fixed top-0 left-0 z-50 w-full h-screen  bg-black bg-opacity-30"
            >
                <div className='relative w-full  h-screen'>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="fixed bg-white dark:bg-gray-700 rounded-xl overflow-y-auto p-4 w-full top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-2xl max-h-[90vh]"
                    >
                        {children}
                    </div>
                </div>
            </div>

        </>,
        modalElement
    )
};

export default Modal;
