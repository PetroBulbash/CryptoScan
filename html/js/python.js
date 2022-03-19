// ###########################################################################################################
// ############### ***    Connecting with Python    *** ####################################################
// ###########################################################################################################

// ========================= * Декларации взаимодействия * ==================================================
let backend = null;
let isPython = false;
new QWebChannel(qt.webChannelTransport, function (channel) {
    backend = channel.objects.backend;
	isPython = true;
});

// ========================= * Передача данных в Python * ==================================================
function toPython(el_name, el_value) {
	//if (!isPython) return;
    let obj=new Object();
    obj.name = el_name;
    obj.val = (el_value) ? el_value : "";
    backend.value = JSON.stringify(obj);
}

// ===================================== *** Получение актуальных данных из Python *** =======================================================================
function toPythonSets(name_sets, value_sets) {
	// ----------------------------------------------------------------------------------------------------------------------------------------
	switch (name_sets) {
		case('setsJS'):
			toPython("setsJS", value_sets)
			break;
	}
}

// ===================================== *** Получение актуальных данных из Python *** =======================================================================
function fromPythonSets(name_sets, from_python) {
	// ----------------------------------------------------------------------------------------------------------------------------------------
	//alert(name_sets);
	switch (name_sets) {
		case('projects'):
			projects = from_python;
			break;
		case('pro'):
			_pro = from_python;
			break;
		case('levels'):
			_pro.stat.levels = from_python;
			fillStatProTable();
			break;
		case('setsJS'):
			_s = from_python;
			splitter_start();
			break;
		case ('_un'):
			_un = from_python;
	}
}
