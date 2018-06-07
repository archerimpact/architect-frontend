import React from 'react';
import './style.css'

// TODO import transitions and styling from antd (see them for inspiration). this includes bulk upload.

const Modal = ({ handleClose, show }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
        <div className={showHideClassname}>
            <section className="modal-main">
                {/* putting everything here */}
                <button onClick={handleClose}>close</button>
            </section>
        </div>
    );
};