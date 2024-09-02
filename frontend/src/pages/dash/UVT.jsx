import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"

import ContratoContext from "../../context/ContratoContext"

import formatCurrency from "../../utils/formatCurrency";

import Layout from "../../utils/Layout";

export default function UVT() {

    const { Contrato, Users } = useContext(ContratoContext);

    
    return (
        <Layout>
            <h1>Prueba</h1>
        </Layout>
    )

}