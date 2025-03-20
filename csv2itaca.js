/**
 * Nombre del programa: csv2itaca
 * Versión: 2.0.0
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

function textSim(a, b) {
  const text1=a
  const text2=b
const matrix = [];
for (let i = 0; i <= b.length; i++) {
  matrix[i] = [i];
}
for (let j = 1; j <= a.length; j++) {
  matrix[0][j] = j;
}
for (let i = 1; i <= b.length; i++) {
  for (let j = 1; j <= a.length; j++) {
    const indicator = a[j - 1] === b[i - 1] ? 0 : 1;
    matrix[i][j] = Math.min(
      matrix[i - 1][j] + 1, // deletion
      matrix[i][j - 1] + 1, // insertion
      matrix[i - 1][j - 1] + indicator // substitution
    );
  }
}

return (1 - (matrix[b.length][a.length] / Math.max(text1.length, text2.length)))*100
}


function unidecode(t) {
  const unicodeToAscii = {"á":"a","é":"e","í":"i","ó":"o","ú":"u","ý":"y","à":"a","è":"e","ì":"i","ò":"o","ù":"u","â":"a","ê":"e","î":"i","ô":"o","û":"u","ã":"a","õ":"o","ñ":"n","ä":"a","ë":"e","ï":"i","ö":"o","ü":"u","ÿ":"y","å":"a","æ":"ae","œ":"oe","ç":"c","ð":"d","ø":"o","ł":"l","š":"s","ž":"z","č":"c","ć":"c","đ":"d","ř":"r","ť":"t","ň":"n","ď":"d","ľ":"l","ş":"s","ğ":"g","ą":"a","ę":"e","ė":"e","į":"i","ų":"u","ǎ":"a","ě":"e","ǐ":"i","ǒ":"o","ǔ":"u","ǖ":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǹ":"n","ǻ":"a","ǽ":"ae","ǿ":"o","ȁ":"a","ȅ":"e","ȉ":"i","ȍ":"o","ȕ":"u","ȧ":"a","ȩ":"e","ȫ":"o","ȭ":"o","ȯ":"o","ȱ":"o","ȳ":"y","ḃ":"b","ḋ":"d","ḟ":"f","ṁ":"m","ṗ":"p","ṡ":"s","ṫ":"t","ẁ":"w","ẃ":"w","ẅ":"w","ẇ":"w","ẋ":"x","ẍ":"x","ẏ":"y","ẑ":"z","ẓ":"z","ạ":"a","ả":"a","ấ":"a","ầ":"a","ẩ":"a","ẫ":"a","ậ":"a","ắ":"a","ằ":"a","ẳ":"a","ẵ":"a","ặ":"a","ẹ":"e","ẻ":"e","ẽ":"e","ế":"e","ề":"e","ể":"e","ễ":"e","ệ":"e","ỉ":"i","ị":"i","ọ":"o","ỏ":"o","ố":"o","ồ":"o","ổ":"o","ỗ":"o","ộ":"o","ớ":"o","ờ":"o","ở":"o","ỡ":"o","ợ":"o","ụ":"u","ủ":"u","ứ":"u","ừ":"u","ử":"u","ữ":"u","ự":"u","ỳ":"y","ỵ":"y","ỷ":"y","ỹ":"y"};
  return String(t).split('').map(char => unicodeToAscii[char] || char).join('')}

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
    let nTmp;
    let oTmp;
    let nomTmp;

    const text = e.target.result.replaceAll("\r", "")
    const data = text.split('\n').map(row => row.split(';'));
    document.getElementById('csvFileInput').value=null;
    
    /* Capturamos los botones*/
    const notasArr = document.querySelectorAll("input.imc-f-qu-camp");
    const obsArr = document.querySelectorAll("a.imc-bt-observacions");
    const nombArr=document.querySelectorAll("div.imc-nom");
    /*Volcamos los datos */
    for (i = 0; i < data.length && i<obsArr.length; i++) {
      nTmp=null;
      oTmp=null;
      /*Leemos los datos*/
      if (!typeof (data[i])=="object" || data[i].length<=1){
        if (!isNaN(data[i])){
          nTmp = data[i];
        } else{
          oTmp = String(data[i]);
        }
      } else {
        nTmp = data[i][0];
        oTmp = String(data[i][1]);
        /*Comprobamos los nombres*/
        if (data[i].length>=3){
          
          nom1=unidecode(String(data[i][2]).toLowerCase())  
          nomNode=nombArr[i].querySelector("p");
          nom2=String(nomNode.textContent).split(" (")[0];
          nom2=nom2.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(' , ',", ").toLowerCase()
          nom2=unidecode(nom2)
          nomNode.textContent = nom2+  " (" + parseInt(textSim(nom1,nom2)) + "%)"
        }
      }

      if (!(nTmp===null)) notasArr[i].value = nTmp;
      if (!(oTmp===null) && oTmp.length && oTmp.length>0){
        obsArr[i].click()
        document.querySelector("textarea.imc-f-observacions-avanzada").value = oTmp.replace(/\\n/g, '\n');
        document.querySelectorAll("a.imc-bt-finalitza")[2].click();
      }
      
    }
    
  };
  reader.readAsText(file);
});