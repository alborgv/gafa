
export default function formatMes(mes) {
    let mesFinal = ""
    
    if (mes === "1") {
        mesFinal = "Enero"
    } else if (mes === "2") {
        mesFinal = "Febrero"
    } else if (mes === "3") {
        mesFinal = "Marzo"
    } else if (mes === "4") {
        mesFinal = "Abril"
    } else if (mes === "5") {
        mesFinal = "Mayo"
    } else if (mes === "6") {
        mesFinal = "Junio"
    } else if (mes === "7") {
        mesFinal = "Julio"
    } else if (mes === "8") {
        mesFinal = "Agosto"
    } else if (mes === "9") {
        mesFinal = "Septiembre"
    } else if (mes === "10") {
        mesFinal = "Octubre"
    } else if (mes === "11") {
        mesFinal = "Noviembre"
    } else if (mes === "12") {
        mesFinal = "Diciembre"
    }

    return mesFinal;
};
