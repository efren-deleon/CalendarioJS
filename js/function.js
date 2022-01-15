var month = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];
var weekday = [
    "Domingo",
    "Lunes",
    "Martes",
    "Mi\u00E9rcoles",
    "Jueves",
    "Viernes",
    "S\u00E1bado"
];
var weekdayShort = [
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat"
];
var monthDirection = 0;

//Recuperar el json
var respuesta = undefined;

function getNextMonth() {
    monthDirection++;
    var current;
    var now = new Date();
    if (now.getMonth() === 11) {
        current = new Date(now.getFullYear() + monthDirection, 0, 1);
    } else {
        current = new Date(now.getFullYear(), now.getMonth() + monthDirection, 1);
    }
    initCalender(getMonth(current));
}

function getPrevMonth() {
    monthDirection--;
    var current;
    var now = new Date();
    if (now.getMonth() === 11) {
        current = new Date(now.getFullYear() + monthDirection, 0, 1);
    } else {
        current = new Date(now.getFullYear(), now.getMonth() + monthDirection, 1);
    }
    initCalender(getMonth(current));
}

Date.prototype.isSameDateAs = function (pDate) {
    return (
        this.getFullYear() === pDate.getFullYear() &&
        this.getMonth() === pDate.getMonth() &&
        this.getDate() === pDate.getDate()
    );
};

function getMonth(currentDay) {
    var now = new Date();
    var currentMonth = month[currentDay.getMonth()];
    var monthArr = [];
    for (i = 1 - currentDay.getDate(); i < 31; i++) {
        var tomorrow = new Date(currentDay);
        tomorrow.setDate(currentDay.getDate() + i);
        if (currentMonth !== month[tomorrow.getMonth()]) {
            break;
        } else {
            monthArr.push({
                date: {
                    weekday: weekday[tomorrow.getDay()],
                    weekday_short: weekdayShort[tomorrow.getDay()],
                    day: tomorrow.getDate(),
                    month: month[tomorrow.getMonth()],
                    year: tomorrow.getFullYear(),
                    current_day: now.isSameDateAs(tomorrow),
                    date_info: tomorrow
                }
            });
        }
    }
    return monthArr;
}

function clearCalender() {
    //Si la variable respuesta es nulo obtenemos resultados;
    if (respuesta === undefined)
        respuesta = JSON.parse(getJson(new Date()));

    $("table tbody tr").each(function () {
        $(this).find("td").removeClass("active selectable currentDay sunday").html("");
    });
    $("td").each(function () {
        $(this).unbind('mouseenter').unbind('mouseleave');
    });
    $("td").each(function () {
        $(this).unbind('click');
    });
    clickCounter = 0;
}

function initCalender(monthData) {
    var row = 0;
    var classToAdd = "";
    var classWeekDay = "";
    var currentDay = "";
    var colorDay = "";
    var today = new Date();

    clearCalender();
    $.each(monthData,
        function (i, value) {
            var weekday = value.date.weekday_short;
            var day = value.date.day;
            var column = 0;

            $(".sideb .header .month").html(value.date.month);
            $(".sideb .header .year").html(value.date.year);
            if (value.date.current_day) {
                //Este por defecto solo pinta en rojo los dias domingos
                classWeekDay = weekday === "sun" ? "diaDomingo" : "diaSemana";
                //Este busca si es dia festivo o dia domingo para pintarlo de rojo
                colorDay = weekday === "sun" || isDiaFestivo(value.date.date_info) ? "diaInhabil" : "diaNormal";
                currentDay = "currentDay";

                $(".right-wrapper .header span").addClass(classWeekDay).html(value.date.weekday);
                $(".right-wrapper .day span").addClass(colorDay).html(value.date.day);
                $(".right-wrapper .month").html(value.date.month);

                if (isDiaFestivo(value.date.date_info)) {
                    classToAdd = "selectable sunday";
                    $(".right-wrapper .day i").addClass("efemeride").html(buscarDiaFestivo(value.date.date_info));
                } else {
                    classToAdd = "selectable";
                    $(".right-wrapper .day i").addClass("normalito").html("-");
                }
            }
            if (today.getTime() < value.date.date_info.getTime()) {
                //classToAdd = "selectable";
				if (weekday === "sun" || isDiaFestivo(value.date.date_info)) {
					classToAdd = "selectable sunday";
				} else {
					classToAdd = "selectable";
				}
            }
            $("tr.weedays th").each(function () {
                var row = $(this);
                if (row.data("weekday") === weekday) {
                    column = row.data("column");
                    return;
                }
            });
            $($($($("tr.days").get(row)).find("td").get(column)).addClass(classToAdd + " " + currentDay).html(day));
            currentDay = "";
            if (column === 6) {
                row++;
            }
        });
}

$(".fa-angle-left").click(function () {
    getPrevMonth();
    $(".main").addClass("is-rotated-left");
    setTimeout(function () {
        $(".main").removeClass("is-rotated-left");
    }, 195);
});

$(".fa-angle-right").click(function () {
    getNextMonth();
    $(".main").addClass("is-rotated-right");
    setTimeout(function () {
        $(".main").removeClass("is-rotated-right");
    }, 195);
});

$(".right-wrapper .day").click( function () {
    if (monthDirection !== 0) {
        //Le indicamos al calendario que se regrese al mes actual.
        initCalender(getMonth(new Date()));
        //Reseteamos el monthDirection a 0
        monthDirection = 0;
    }
});

function isDiaFestivo(fecha) {
    return buscarDiaFestivo(fecha) !== undefined;
}

function buscarDiaFestivo(fecha) {
    var formato = dateFormatoGuion(fecha);
    var diasFestivos = respuesta.result.public_holidays;

    for (var key in diasFestivos) {
        if (key === formato)
            return diasFestivos[key];
    }

    return undefined;
}

//inicia el calendario
initCalender(getMonth(new Date()));

//Es para que refresque la pagina a una cierta hora
refrescar(0, 0, 15);

if (respuesta !== undefined) {
    $(".main .sideb .contador").html(respuesta.result.days.total);
}
