/*
funcion para darle formato 'YYYY-MM-DD' a una fecha dada
 */
function dateFormatoGuion(fecha) {
    return fecha.toLocaleString("en-CA").split(",")[0];
}
