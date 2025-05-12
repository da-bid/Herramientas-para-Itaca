// ==UserScript==
// @name         Herramientas para itaca
// @namespace    https://github.com/da-bid/csv2itaca
// @downloadURL  https://github.com/da-bid/csv2itaca/raw/refs/heads/main/HerramientasItaca.user.js
// @updateURL    https://github.com/da-bid/csv2itaca/raw/refs/heads/main/HerramientasItaca.user.js
// @version      3.2
// @description  Añade funcionalidades para marcar mensajes como leídos y cargar notas desde CSV
// @author       David Palazón
// @match        https://docent.edu.gva.es/md-front/www/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function querySelectorByXPath(xpath) {
        let result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue;
    }

    function textSim(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 1; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                const indicator = a[j - 1] === b[i - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + indicator
                );
            }
        }
        return (1 - (matrix[b.length][a.length] / Math.max(a.length, b.length))) * 100;
    }

    function _camelCase(t) {
        return t.split(" ").map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(" ");
    }

    function unidecode(t) {
        const unicodeToAscii = { "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ñ": "n", "ü": "u", "ç": "c" };
        return String(t).split('').map(char => unicodeToAscii[char] || char).filter(char => char.charCodeAt(0) < 128).join('');
    }

    function _getAlumnos() {
        let newList = document.getElementById("listadoalumnos");
        if (newList === null) {
            let nombArr = Array.from(document.querySelectorAll("div.imc-nom"));
            nombArr = nombArr.map(e => e.querySelector("p").textContent.split(" (")[0]);
            nombArr = nombArr.map(e => _camelCase(e));
            const placeList = document.querySelector("section.imc-seccio-avaluacio").querySelector("div.imc-seccio-contenidor");
            newList = document.createElement("div");
            newList.id = "listadoalumnos";
            newList.style = "background: hsla(195, 79.9%, 48.8%);";
            placeList.prepend(newList);
            newList.innerHTML = "<ol><li>" + nombArr.join("</li><li>") + "</li></ol>";
        } else {
            newList.remove();
        }
    }

    function volcarNotas(ev){
        if (ev.target && ev.target.id === "csvFileInput") {
            const file = ev.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                const text = e.target.result.replaceAll("\r", "");
                const data = text.split('\n').map(row => row.split(';'));
                document.getElementById('csvFileInput').value = null;

                const notasArr = document.querySelectorAll("input.imc-f-qu-camp");
                const obsArr = document.querySelectorAll("a.imc-bt-observacions");
                const nombArr = document.querySelectorAll("div.imc-nom");

                for (let i = 0; i < data.length && i < obsArr.length; i++) {
                    let nTmp = null;
                    let oTmp = null;

                    if (!Array.isArray(data[i]) || data[i].length <= 1) {
                        if (!isNaN(data[i])) {
                            nTmp = data[i];
                        } else {
                            oTmp = String(data[i]);
                        }
                    } else {
                        nTmp = data[i][0];
                        oTmp = String(data[i][1]);

                        if (data[i].length >= 3) {
                            const nom1 = unidecode(String(data[i][2]).toLowerCase());
                            const nomNode = nombArr[i].querySelector("p");
                            let nom2 = nomNode.textContent.split(" (")[0].trim().replace(' , ', ", ").toLowerCase();
                            nom2 = unidecode(nom2);
                            nomNode.textContent = nom2 + " (" + parseInt(textSim(nom1, nom2)) + "%)";
                        }
                    }

                    if (nTmp !== null) notasArr[i].value = nTmp;
                    if (oTmp !== null && oTmp.length > 0) {
                        obsArr[i].click();
                        document.querySelector("textarea.imc-f-observacions-avanzada").value = oTmp.replace(/\\n/g, '\n');
                        document.querySelectorAll("a.imc-bt-finalitza")[2].click();
                    }
                }
            };
            reader.readAsText(file);
        }
    };

    function agregarBotonNOTAS(menuNOTAS) {
        if (!document.getElementById('menunotas')) {
            let container = document.createElement("div");
            container.style = "background: hsla(195, 79.9%, 48.8%);";
            container.id = "menunotas";
            container.innerHTML = `<p><button id="btimportcsv">Importar CSV</button><input type="file" id="csvFileInput" accept=".csv" hidden=""> <button id="getalumnosbutton">Listado de alumnos</button></p>`;
            //const menuNOTAS = querySelectorByXPath('//section[@id="imc-seccio-avaluacio"]/div/div[@class="imc-contingut-carregat"]');
            if (menuNOTAS) {
                const header = menuNOTAS.querySelector("header");
                if (header) header.appendChild(container);
            }
        }
    }

    function agregarBotonJUS(secc) {
        let divNode = secc.querySelector("div")?.querySelector("div");
        if (!divNode) return;

        let boton = document.createElement("button");
        boton.id = "marcarLeidosBtn";
        boton.innerText = "Marcar todos como leídos";
        boton.style.display = "block";
        boton.addEventListener("click", marcarTodosLeidos);
        divNode.insertBefore(boton, null);
    }

    function marcarTodosLeidos() {
        let mensList = document.querySelector("ul.imc-co-missatges");
        if (!mensList) return;
        let mensajes = mensList.querySelectorAll("li");
        Array.from(mensajes).forEach(e => _marcarLeido(e.getAttribute("data-id")));
        let anterior = location.href;
        location.href = "#centre";
        location.href = anterior;
    }

    function _marcarLeido(id) {
        fetch("https://docent.edu.gva.es/md-front/comunica/putLeida", {
            headers: {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "token": window.localStorage.token.toString()
            },
            referrer: "https://docent.edu.gva.es/md-front/www/",
            body: "codcentro="+CENTRE_ID+"&comId=" + id,
            method: "POST",
            credentials: "include"
        });
    }

    function observarURL() {
        let urlActual = location.href;
        setInterval(() => {
            if (location.href !== urlActual) {
                urlActual = location.href;
                setTimeout(() => {
                    agregarBotonJUS();
                    agregarBotonNOTAS();
                }, 1000);
            }
        }, 1000);
    }

    function esperarElementoAsync(selector, tipo = "css", intervalo = 1000) {
        return new Promise((resolve) => {
            const timer = setInterval(() => {
                let elemento;
                if (tipo === "css") {
                    elemento = document.querySelector(selector);
                } else if (tipo === "xpath") {
                    const resultado = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    elemento = resultado.singleNodeValue;
                }

                if (elemento) {
                    clearInterval(timer);
                    resolve(elemento);
                }
            }, intervalo);
        });
    }

    window.addEventListener("load", async () => {
        const menuJUS = await esperarElementoAsync("#imc-seccio-comunicacions-safata", "css");
        agregarBotonJUS(menuJUS);

        const menuNOTAS = await esperarElementoAsync('//section[@id="imc-seccio-avaluacio"]/div/div[@class="imc-contingut-carregat"]', "xpath");
        agregarBotonNOTAS(menuNOTAS);

        observarURL();
    });

    // Listeners del menú CSV (en cuanto se cree)
    document.addEventListener("change", event => volcarNotas(event));

    document.addEventListener("click", function (event) {
        if (event.target && event.target.id === "getalumnosbutton") {
            _getAlumnos();
        }
        if (event.target && event.target.id === "btimportcsv"){
            document.getElementById("csvFileInput").click();
        }
    });
})();
