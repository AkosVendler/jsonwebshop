

function fizetendo() {
    var yato_lee_fázisceruza = 760
    var yato_digitális_Voltmérő = 1100
    var yato_szigetelt_rugószorító = 3220
    var yato_szigetelt_oldalcsípő_fogó = 3300
    var yato_szigetelt_vízpumpa_fogó = 3890
    i=0

    var ossz = 0;
    var menny = 0;
    var key = "";
    key = localStorage.key(i);
    menny = Number(localStorage.getItem(key));
    var x = localStorage.getItem(key);
    let vegosszeg= parseInt(sessionStorage.getItem("osszesen"));
    document.getElementById("total").innerHTML = (vegosszeg + "Ft");
    document.getElementById("osszes").innerHTML = (vegosszeg + 1500 + "Ft");
}

function allStorage() {

    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        values.push( localStorage.getItem(keys[i]) );
    }

    return values;
}