let inpLoadFiles;
let _s = new Object();

// ###########################################################################################################
// ############### ***    УПРАВЛЕНИЕ DOM     *** #############################################################
// ###########################################################################################################

// ========================= * Получение ближайшего родителя с заданным тегом * ==============================
Object.prototype.getParentByTagName = function (tag_name) {
    let el = this;
    if (el.tagName.toUpperCase()=="BODY") return false;
    if (tag_name.substring(0,1)=="!") {
        tag_name = tag_name.substring(1,10000);
        if (el.tagName.toUpperCase()==tag_name.toUpperCase()) return el;
    }
    do {
        el=el.parentElement;
        if (el.tagName.toUpperCase()==tag_name.toUpperCase()) return el;
        if (el.tagName.toUpperCase()=="BODY") return false;
    } while (1==1);
}

// ========================= * Получение родителя с заданным классом * ==========================================
Object.prototype.getParentByClass = function (class_name) {
    let el = this;
	if  (el.tagName.toUpperCase()=="BODY") return false;``
    if(class_name.substring(0,1)=="!") {
        class_name = class_name.substring(1,10000);
        if (el.classList.contains(class_name)) return el;
    }
    do {
        el=el.parentElement;
        if (el.classList.contains(class_name)) return el;
        if (el.tagName.toUpperCase()=="BODY") return false;
    } while (1==1);
}

// ========================= * Является ли дочкой родителя с заданным ID * ==========================================
Object.prototype.isParentByID = function (id) {
    let el = this;
	if(el.tagName.toUpperCase()=="BODY") return false;
    if(id.substring(0,1)=="!") {
        id = id.substring(1,10000);
        if (el.id == id) return true;
    }
    do {
        el=el.parentElement;
        if (el.id == id) return true;
        if (el.tagName.toUpperCase()=="BODY") return false;
    } while (1==1);
}


// ========================= * Получение родителя, имеющего ID * ==========================================
Object.prototype.getFirstIdEl = function () {
    let el = this;
    do {
		if (el.id) return el;
		el = el.parentElement;
	}
	while(el != null && el.tagName != "BODY");	
}

// ========================= * Удаление элемента * ==============================================================
Object.prototype.delEl = function () {
	this.parentNode.removeChild(this);
}


// ======================== *  Проверка не число ли * ====================================================
Object.prototype.isNumeric = function () {
    if (typeof this != "string") return false // we only process strings!  
    return !isNaN(this) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(this)) // ...and ensure strings of whitespace fail
}




// ======================== * Объект в массиве по значению * ====================================================
Object.prototype.fromListByVal = function (key, val) {
    let li = this;
    for (i=0; i<li.length; i++) {
        if (li[i][key] == val) return li[i];
    }
}


// ======================== * Объект в массиве по значению * ====================================================
Object.prototype.fromListByVals = function (key, val) {
    let li = this;
    let vals=[]
    for (i=0; i<li.length; i++) {
        if (li[i][key] == val) vals.push(li[i]);
    }
    return vals;
}


// ======================== * Номер объекта в массиве * ==========================================================
Object.prototype.fromListByObj_i = function (obj) {
    let li = this;
    for (i=0; i<li.length; i++) {
        if (li[i] == obj) return i;
    }
}

// ======================== * Номер объекта в массиве по значению * ====================================================
Object.prototype.fromListByVal_i = function (key, val) {
    let li = this;
    for (i=0; i<li.length; i++) {
        if (li[i][key] == val) return i;
    }
}

// ======================== * Номер объекта в массиве по значению * ====================================================
function fromStructByVal (li, key, val) {
    for (i=0; i<li.length; i++) {
        if (li[i][key] == val) return i;
    }
}

// ======================== *  Преобразование текстового массива в даты * ====================================================
function parseArrToDate(arr, keyName) {
    let arr1 = [];
    arr.forEach(itm => arr1.push(new Date(itm[keyName])));
    return arr1;
}
  
// ======================== *  Уникальные значения в массиве * ====================================================
function getUnicInArr(arr) {
    return arr.filter(onlyUnique)
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
}

  
// ======================== *  Создание глубокой копии (не ссылки) на объект * ====================================================
function copyObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}
  
// DELETE ======================== *  Построение дерева дат * ====================================================
function dateArrToTree(arr) {
    if (arr.length == 0) return;    
    let obj = {'lev': 0};
    let lev = 0;
    let lev_vals = [];

    for (i=0; i<arr.length-1; i++) {
        

    }
    return arr.filter(onlyUnique)
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

}

  
// ======================== *  Из объета по значению свойства * ====================================================
function fromObjByPropVal(theObject, prop_name, prop_value) {
    var result = null;
    if(theObject instanceof Array) {
        for(var i = 0; i < theObject.length; i++) {
            result = fromObjByPropVal(theObject[i], prop_name, prop_value);
            if (result) {
                break;
            }   
        }
    } else {
        for(var prop in theObject) {
            if(prop == prop_name) {
                if(theObject[prop] == prop_value) {
                    return theObject;
                }
            }
            if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                result = fromObjByPropVal(theObject[prop], prop_name, prop_value);
                if (result) {
                    break;
                }
            } 
        }
    }
    return result;
}


// ======================== *  Округление без нулей * ====================================================
function trueFixed(numb, cntFix) {
    numb = "" + numb.toFixed(cntFix);
    if (numb.indexOf('.')<0) return numb;
    do {
        if (numb.substring(numb.length-1) == '.') {
            return numb.substring(0, numb.length-1);
        } else if (numb.substring(numb.length-1) == '0') {
            numb = numb.substring(0, numb.length-1);
        } else {
            return numb;
        }        
    } while (1==1)
}

// ======================== *  Вставка ячейки * ====================================================
function addEl(tag, parEl, innerHTML, id) {
    let el = document.createElement(tag);
    parEl.appendChild(el);
    if (innerHTML) el.innerHTML = innerHTML;
    if (id) el.id = id;
    return el;
}

// ======================== *  Вставка ячейки * ====================================================
function insCell(TR, innerHTML, class_name, id, idd) {
    let TD = TR.insertCell();
    TD.innerHTML = innerHTML;
    if (class_name) {
        class_name.split(" ").forEach(function(cl){TD.classList.add(cl)});
    }
    if (id) TD.id = id;
    if (idd) TD.setAttribute("idd", idd);
    return TD;
}


// ======================== *** Вывод в бокс выбранных значений даты *** ==========================================
Date.prototype.easyStrDate1 = function() {
    // ---------------------------------------------------------------------------------------------------------------
      var format = 'yyyy-mm-dd hh:ii:ss';
      var yyyy = this.getFullYear().toString();
      format = format.replace(/yyyy/g, yyyy)
      var mm = (this.getMonth()+1).toString(); 
      format = format.replace(/mm/g, (mm[1]?mm:"0"+mm[0]));
      var dd  = this.getDate().toString();
      format = format.replace(/dd/g, (dd[1]?dd:"0"+dd[0]));
      var hh = this.getHours().toString();
      format = format.replace(/hh/g, (hh[1]?hh:"0"+hh[0]));
      var ii = this.getMinutes().toString();
      format = format.replace(/ii/g, (ii[1]?ii:"0"+ii[0]));
      var ss  = this.getSeconds().toString();
      format = format.replace(/ss/g, (ss[1]?ss:"0"+ss[0]));
      return format;
}

// ======================== *** Вывод в бокс выбранных значений даты *** ==========================================
Date.prototype.easyStrDate = function() {
    // ---------------------------------------------------------------------------------------------------------------
    let arr = this.dateToArrNumb();
    for (let i=0; i<arr.length; i++) {
        if (i==1) arr[i] +=1;
        if (arr[i]<10) arr[i] = '0' + arr[i];
    }
    return arr[0] + "-" +  arr[1] + "-" +  arr[2] + " " +  arr[3] + ":" +  arr[4] + ":" +  arr[5];        
}


// ======================== *** Последний день в месяце *** ======================================================
  function getLastDayOfMonth(year, month) {
// ---------------------------------------------------------------------------------------------------------------
      var d = new Date(year, parseInt(month)+1, 0);
      return d.getDate();
}

// ======================== *** Разбивка даты в массив чисел *** ==========================================
Date.prototype.dateToArrNumb = function() {
    // ---------------------------------------------------------------------------------------------------------------
    return [
        this.getFullYear(),
        this.getMonth(),
        this.getDate(),
        this.getHours(),
        this.getMinutes(),
        this.getSeconds()
    ]
}



// ======================== *** Упрощение периода дат *** ==========================================
Object.prototype.easyPaarDate = function () {
    // ---------------------------------------------------------------------------------------------------------------
    let paar = this;
    let dat_bnd=[
        [1900, 2900, '-'],
        [0, 11, '-'],
        [1, -1, ' '],
        [0, 23, ':'],
        [0, 59, ':'],
        [0, 59, ""]
    ]
    let dats = [paar[0].dateToArrNumb(), paar[1].dateToArrNumb()];
    dat_bnd[2][1] = getLastDayOfMonth(dats[1][0], dats[1][1]);
    let first_paar = 6;
    let last_eq = -1;
    for (let i=dats[0].length-1; i>-1; i--) {    
        if (first_paar == (i+1) && dats[0][i] == dat_bnd[i][0] && dats[1][i] == dat_bnd[i][1]) {
            first_paar = i;
        }
    }
    for (let i=0; i<dats[0].length; i++) {
        if (dats[0][i] != dats[1][i]) break;
        last_eq = i
    }
    if (last_eq == (first_paar-1)) {
        let rez = '';
        for (let i=0; i<=last_eq; i++) {
            let val0 = (i != 1) ? dats[0][i] : dats[0][i] + 1;
            let itm = (val0 < 10) ?  "0" + val0 : val0;
            if (i>0) rez += dat_bnd[i-1][2];
            rez += itm;
        }
        return rez 
    } else {
        return paar[0].easyStrDate() + ' <=> '+ paar[0].easyStrDate();
    }
}

