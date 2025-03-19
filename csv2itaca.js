/**
 * Nombre del programa: csv2itaca
 * Versión: 1.2.3
 * Autor: David Palazón.
 * Repositorio: https://github.com/da-bid/csv2itaca
 * 
 * Este software se proporciona "tal cual", sin garantías de ningún tipo. Para más detalles,
 * consulta la licencia GPLv3 en https://www.gnu.org/licenses/gpl-3.0.html.
 */

function querySelectorByXPath(xpath) {
  let result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  return result.singleNodeValue;
}

/*Si no hay menú lo creamos.*/
if (!document.getElementById("csvFileInput")){
  /*Buscamos el header*/
  element = querySelectorByXPath('//section[@id="imc-seccio-avaluacio"]/div/div[@class="imc-contingut-carregat"]');
  header = element.querySelector("header");

  /* Agregar botón de cargar CSV */
  container = document.createElement("div");
  container.style="background: hsla(195, 79.9%, 48.8%);"
  container.id="csvnotasloader"
  container.innerHTML = `<p>Sube un archivo CSV con las notas: <input type="file" id="csvFileInput" accept=".csv"></p>`;
  header.appendChild(container);
}

/*Leemos el CSV*/
document.getElementById('csvFileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result.replaceAll("\r", "")
    const data = text.split('\n').map(row => row.split(';'));
    document.getElementById('csvFileInput').value=null;
    
    /* Capturamos los botones*/
    const notasArr = document.querySelectorAll("input.imc-f-qu-camp");
    const obsArr = document.querySelectorAll("a.imc-bt-observacions");
    let final;
    let comm;
    /*Volcamos los datos */
    for (i = 0; i < data.length && i<obsArr.length; i++) {
      //Escribimos la nota */
      if (!(typeof (data[i])=="object" && data[i].length>1)){
        notasArr[i].value = data[i];
      } else {
        notasArr[i].value = data[i][0];
        obsArr[i].click()
        comm = String(data[i][1])
        if (comm.length && comm.length>0){
          document.querySelector("textarea.imc-f-observacions-avanzada").value = comm.replace(/\\n/g, '\n');
          final = document.querySelectorAll("a.imc-bt-finalitza")
          final[2].click();
        }
      }
    }
    
  };
  reader.readAsText(file);
});