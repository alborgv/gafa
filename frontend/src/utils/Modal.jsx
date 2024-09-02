const Modal = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null;

    const handleClose = (e) => {
        if( e.target.id === 'wrapper' ) onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50" id="wrapper" onClick={handleClose}>
            <div className="w-[800px] flex flex-col">
                <button className="text-white text-xl place-self-end" onClick={() => onClose()}>X</button>
                <div className="bg-white p-8 rounded">{children}</div>
            </div>
        </div>
    )

}


export default Modal;