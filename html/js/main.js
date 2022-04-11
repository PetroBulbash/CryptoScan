let mouse_button;           // Number of mouse button. witch clicked last
let lang;					// Variable of current language
let dct 					// Object of languages dictionary

// ##########################################################################################################################################
// =========================== *** INITIALIZATION *** ==============================================================================
// ##########################################################################################################################################

// ===================================== *** When page loaded *** =======================================================================
function iniDoc() {
	// ---------------------------------------------------------------------------------------------------------------------------------------
	initDragAndResizePopUps(); 
	iniEvents();
	change_status("begin");
	document.oncontextmenu = document.body.oncontextmenu = function() {return false;};
//	test_fill_coins();
}

// ===================================== *** Get dictionary contains languages *** =======================================================================
function get_languages(pack) {
	// -----------------------------------------------------------------------------------------------------------------------------------------
	t = pack.replace(/#quot#/g, "");
	dct = JSON.parse(t);
}

// ===================================== *** When clicked language select menu *** =======================================================================
function change_language(new_lang) {
	// -----------------------------------------------------------------------------------------------------------------------------------------
	let sel_punkt = document.getElementById("cur_lang");
	if (new_lang == lang) return;
	lang = new_lang;
	sel_punkt.innerText = lang;
	toPython("change_language", lang);
	cur_lang = dct[lang];
	Object.keys(cur_lang).forEach(function(id) {
		let itm = document.getElementById(id);
		if (itm) itm.innerText = cur_lang[id];
	})
}


// ===================================== *** Set text to element by current language *** =======================================================================
function change_info(pack) {
	// -----------------------------------------------------------------------------------------------------------------------------------------
	let cur_file_name = (pack["cur_file_name"] == "<->") ? cur_lang['non_printable_file_name'] : pack["cur_file_name"];
	let cur_folder_name = (pack["cur_folder_name"] == "<->") ? cur_lang['non_printable_folder_name'] : pack["cur_folder_name"];
   	let info_main = cur_lang["scanning_process"] 
        .format(pack["folders_examined"], pack["files_examined"], pack["count_hits"]);
    let info_current = cur_lang["scanning_current"]
        .format(cur_file_name, cur_folder_name);
    document.getElementById('process_info_main').innerText = info_main
	document.getElementById('process_info_current').innerText = info_current
}


// ===================================== *** Change current status of page *** =======================================================================
function change_status(status){
	// ---------------------------------------------------------------------------------------------------------------------------------------
	switch (status){
		case "begin":
			clear_tlb();
			document.getElementById("div_lev2").style.display = "none";
			document.getElementById("div_lev3").style.display = "none";
			document.getElementById("go_search").style.display = "";
			document.getElementById("stop_process").style.display = "none";
			document.getElementById("tlb_result").style.display = "none";
			document.getElementById("button_xls").style.display = "none";
			document.getElementById("button_clear").style.display = "none";
			document.getElementById('loader').style.display='';
			break;
		case "run":
			document.getElementById("div_lev2").style.display = "";
			document.getElementById("div_lev3").style.display = "";
			document.getElementById("go_search").style.display = "none";
			document.getElementById("stop_process").style.display = "";
			document.getElementById("tlb_result").style.display = "none";
			document.getElementById("div_not_found").style.display = "";
			document.getElementById("button_xls").style.display = "none";
			document.getElementById("button_clear").style.display = "none";
			document.getElementById('loader').style.display='';
			document.getElementById('process_info_main').innerText = cur_lang["scanned_files_0"]
			document.getElementById('process_info_current').innerText = cur_lang["scanning_started"]
			document.getElementById("button_clear").style.display = "none";
			break;		
		case "found":
			document.getElementById("tlb_result").style.display = "";
			document.getElementById("div_not_found").style.display = "none";
			break;
		case "stop": case "end":
			document.getElementById("div_lev2").style.display = "";
			document.getElementById("div_lev3").style.display = "";
			document.getElementById("go_search").style.display = "";
			document.getElementById("stop_process").style.display = "none";
			document.getElementById("button_xls").style.display = document.getElementById("tlb_result").style.display;
			document.getElementById("button_clear").style.display = "";
			document.getElementById('loader').style.display='none';
			document.getElementById('process_info_current').innerText = (status=="stop") ? cur_lang["scanning_stopped"] : cur_lang["scanning_completed"]  ;
			break;
	}
}

// ===================================== *** Ini events of page *** =======================================================================
function  iniEvents() {
	// ---------------------------------------------------------------------------------------------------------------------------------------
	document.body.onmousedown = function (e) {
		mouse="L";
		e = e || window.event;
		if ("which" in e) {if (e.which == 3) mouse="R";} else if ("button" in e) {if (e.button == 2) mouse="R";}
		mouse_button = mouse;
		let target = e.target;
		events_handler(null, target);
		downEl=target;
	}
}


// ===================================== *** Events handler *** =======================================================================
function events_handler(from, target){
	// ---------------------------------------------------------------------------------------------------------------------------------------
	let pop;
    if (target.getParentByClass("popup")) {// if event from popup
		if (target.classList.contains("pop-button")) { 
			if (target.innerText == "✖" || target.id == "pop_cancel") {
				target.getParentByClass("popup").style.display = "none";
				return;
			}
			let from = target.getAttribute("typ_pop");
			switch (from) {
				case ("go_before_result"):
					switch (target.id) {
						case ("pop_continue"): go_search(false); close_pops(); break;
						case ("pop_clear"): change_status("begin"); go_search(true); close_pops(); break;
					}
					break;                  
			}	            
        }			
	} else if (target.parentElement.parentElement.id == "lang_menu") {
		change_language(target.innerText);
	} else { // if event not from popup (from main window)
		let targetWidthID = target.getFirstIdEl();
		if (!targetWidthID) return;
		switch (targetWidthID.id) {
			case ("but_help"):
				//  cur_lang["txt_help"] = 
				pop = iniPop({'typ': 'help', 'title': cur_lang["titl_help"], 
				'inHTML': cur_lang["txt_help"], 
				'buttons': "clear;continue;cancel", 
				'w': 500, 'h': 400});	
				break;
			case ("but_license"):
				pop = iniPop({'typ': 'license', 'title': cur_lang["titl_license"], 
				'inHTML': cur_lang["txt_license"], 
				'buttons': "clear;continue;cancel", 
				'w': 500, 'h': 400});	
				break;
            case ("go_search"):
                go_search(true); break;
			case "button_xls":
				xls(); break;
			case "button_clear":
				change_status("begin"); break;
			case "select_all": case "unselect_all":
				select_all_coins(targetWidthID.id); break;						
							
			default: toPython(targetWidthID.id); break; 
		}
	}
	globalCloseActiveForms(target); 
}


// ===================================== *** Fill list of coins in main page for check *** =======================================================================
function fill_coins(pack) {
	// ----------------------------------------------------------------------------------------------------------------------------------------	
	let list = pack.split(";");
	let chs = document.querySelectorAll(".coin_check");	
	for (i=chs.length-1; i>0; i--) {
		chs[i].delEl();
	}
	for (i=0; i<list.length; i++) {
		let new_ch = chs[0].cloneNode(true);
		new_ch.querySelector("INPUT").id = "cur" + i;
		new_ch.querySelector("SPAN").innerText = " - " + list[i];
		chs[0].parentElement.appendChild(new_ch);
	}
	chs[0].delEl();
}

// ===================================== *** Select/unselect all coins checkboxes *** =======================================================================
function select_all_coins(id) {
	// ------------------------------------------------------+----------------------------------------------------------------------------------
	let chs = document.querySelectorAll(".coin_check");
	for (i=0; i<chs.length; i++) {
		chs[i].querySelector("INPUT").checked = (id == "select_all") ? true : false;
	}
}

// ===================================== *** Run a search process *** =======================================================================
function go_search(is_first_start) {
	// ----------------------------------------------------------------------------------------------------------------------------------------
    let pro = {}; // create object of new project settings
	pro['is_first_start'] = is_first_start;
    pro['path'] = document.getElementById("search_source").innerText;
    pro['mode_unicode'] = document.getElementById("mode_unicode").checked;
    pro['mode_nonunicode'] = document.getElementById("mode_nonunicode").checked;
    pro['mode_pack'] = document.getElementById("mode_pack").checked;
    pro['mode_excel'] = document.getElementById("mode_excel").checked;
    pro['mode_docx'] = document.getElementById("mode_docx").checked;
	pro["folders_examined"] = 0;
	pro["files_examined"] = 0;
	pro["total_files_size"] = 0;
	pro["count_hits"] = 0;
	pro["cur_file"] = "";
	pro["cur_folder"] = "";
	let coin_ch = document.querySelectorAll(".coin_check");
	pro["coins"] = [];
	for (i=0; i<coin_ch.length; i++) {
		let inp = coin_ch[i].querySelector("INPUT");
		if (inp.checked) pro["coins"].push(parseInt(inp.id.substring(3)));		
	}
	if (pro['path'] == 'Not Selected') {
        let pop = iniPop({'typ': '', 'title': "Error", 
    		'inHTML': cur_lang["err_not_folder"], 
    		'buttons': "cancel", 
    		'w': 350, 'h': 30});
	} else if (pro["coins"].length == 0) {
        let pop = iniPop({'typ': '', 'title': "Error", 
    		'inHTML': cur_lang["err_not_crypto"], 
    		'buttons': "cancel", 
    		'w': 350, 'h': 30});
	} else if (is_first_start && !document.getElementById("tlb_result").style.display) {
        let pop = iniPop({'typ': 'go_before_result', 'title': "Caution", 
    		'inHTML': cur_lang["err_clear_previous"], 
    		'buttons': "clear;continue;cancel", 
    		'w': 350, 'h': 30});	
	} else {
		toPython("go_search", pro);	
	}
}

// ===================================== *** Stop a search process *** =======================================================================
function stop_process() {
	// ----------------------------------------------------------------------------------------------------------------------------------------
	toPython("stop_process");
}

// ===================================== *** Close popup if click in main form *** =======================================================================
function globalCloseActiveForms(target) {
	// ----------------------------------------------------------------------------------------------------------------------------------------
	let puzzle_select = document.querySelector(".puzzle_select:not([none])");
	if (puzzle_select) {
		if(!(target.getParentByClass('puzzle_select') || puzzle_select.parentElement == target.parentElement || puzzle_select.parentElement == target.parentElement.parentElement)) {
			puzzle_select.style.display = "none";
		}
	}
	if (document.getElementById("box_filter") && document.getElementById("box_filter").style.display && !target.getParentByClass('box_filter')) {
		document.getElementById("box_filter").style.display="none";						
	}
}

// ===================================== *** Add info about new hit in result-table *** =======================================================================
function add_item_in_tlb(pack) {
	// ----------------------------------------------------------------------------------------------------------------------------------------
	let tlb = document.getElementById("tlb_result");
	let THH = tlb.querySelectorAll("TH");
	let TR = tlb.insertRow();
	for (i=0; i<THH.length; i++) {
		let TD = TR.insertCell();
		TD.innerText = pack[THH[i].id];
	}
}

// ===================================== *** Clear result-table *** =======================================================================
function clear_tlb() {
	// ----------------------------------------------------------------------------------------------------------------------------------------
	let tlb = document.getElementById("tlb_result");
	let TRR = tlb.querySelector("TBody").querySelectorAll("TR");
	for (i=TRR.length-1; i>0; i--) {
		let TR = TRR[i];
		TR.parentElement.removeChild(TR);
	}
}

// ===================================== *** List of all file extensions that can be unpacked *** =======================================================================
function show_pack_formats() {
	// ----------------------------------------------------------------------------------------------------------------------------------------
	iniPop({'typ': '', 'title': "Archive formats", 
    		'inHTML': ".7z, .ace, .alz, .a, .arc, .arj, .bz2, .cab, .Z, .cpio, .deb, .dms, .gz, .lrz, .lha, .lzh., lz, .lzma, .lzo, .rpm, .rar, .rz, .tar, .xz, .zip, .jar, .zoo", 
    		'buttons': "cancel", 
    		'w': 350, 'h': 20});
}



