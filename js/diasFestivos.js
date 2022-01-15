function getJson(date){
    var fechaInicio = dateFormatoGuion(date);
    var fechaFin = date.getUTCFullYear() + "-12-31";
    var url = 'https://api.workingdays.org/1.2/api.php?key=41007CBB-D9CE-10B9-7009-D590372965F3&country_code=MX&command=analyse' +
        '&start_date=' + fechaInicio + '&end_date='+ fechaFin + '&use_custom_configuration=1';

    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",url,false);
    Httpreq.send(null);
    return Httpreq.responseText;

}