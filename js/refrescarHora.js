function refrescar(hora, minuto, segundo) {

    //Variables para determinar el tiempo restante para actualizar
    let now = new Date();
    let then = new Date();

    if(now.getHours() > hora ||
        (now.getHours() === hora && now.getMinutes() > minuto) ||
        (now.getHours() === hora && now.getMinutes() === minuto && now.getSeconds() >= segundo)) {
        then.setDate(now.getDate() + 1);
    }
    then.setHours(hora);
    then.setMinutes(minuto);
    then.setSeconds(segundo);

    let timeout = (then.getTime() - now.getTime());

    setTimeout(function() {
        window.location.reload();
    }, timeout);

}
