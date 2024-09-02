import { Fragment } from "react";
import Modal from "../Modal";
import { useState } from "react";

const Export = ({ showModal, setShowModal}) => {
    
    const handleClose = (e) => {
        if( e.target.id === 'wrapper' ) onClose();
    }

    return (
        <Fragment>
            <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
                <div>
                        <div className="flex items-center">
                            <div>
                                <span className="font-anton text-2xl mr-5">Exportar datos</span>
                            </div>
                            <div className="ml-auto flex gap-6">
                                <FormControl className="w-60" disabled={!selectAnho}>
                                    <InputLabel id="label-contrato">Contrato</InputLabel>
                                    <Select
                                        labelId="label-contrato"
                                        id="inp-contrato"
                                        value={selectContrato}
                                        label="Contrato"
                                        onChange={handleChangeContrato}
                                    >
                                        {contratos && contratos.map((contrato, index) => (
                                            <MenuItem key={index} value={contrato.nic}>({contrato.nic}) {contrato.direccion}</MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>
                                

                                <FormControl className="w-40">
                                    <InputLabel id="label-anho">Año</InputLabel>
                                    <Select
                                        labelId="label-anho"
                                        id="inp-anho"
                                        value={selectAnho}
                                        label="Año"
                                        onChange={handleChangeAge}
                                    >

                                        {anhos.map((anho, index) => (
                                            <MenuItem key={index} value={anho}>{anho}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <hr className="mt-6"/>
                        <span>test</span>
                    </div>

            </Modal>
        </Fragment>
    )

}


export default Export;