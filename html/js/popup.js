// Universal mini-framework for working with pop-up windows

function showPop(){
	let popup = document.getElementById("example");
	let container = popup.querySelector(".pop-container");
	container.innerHTML=document.querySelector('#divStructurs').outerHTML;            
}


function iniPop(pack) {
	let id, title, inHTML, buttons, width, height;
	let popup = document.getElementById("pop_"+pack.typ);
	if (!popup) popup = document.getElementById("popup_tmpl").cloneNode(true);
	document.body.appendChild(popup);
	popup.style.display = "";
	popup.style.zIndex = 10;
	popup.id = "pop_"+pack.typ;
	let p_title = popup.querySelector(".popup-header").querySelector("span");
	let p_container = popup.querySelector(".pop-container");
	let p_footer = popup.querySelector(".pop-footer");
	p_footer.innerHTML="";

	p_title.innerText = pack.title;
	if (pack.thead) createInPopTable(p_container, pack.thead, pack.tbody);
	if (pack.inHTML) p_container.innerHTML = pack.inHTML;
	pack.buttons.split(";").forEach(function(itm){
		let button = 
		document.createElement("button");
	  	button.innerText=itm;
	  	p_footer.appendChild(button);
	  	button.classList.add("pop-button");
	  	button.setAttribute("typ_pop", pack.typ);
	})

	popup.querySelector(".close-pop").classList.add("pop-button");	
	popup.style.width = pack.w + "px";
	popup.style.height = pack.h + "px";
	popup.style.zIndex = 20;
	popOnTop(popup);
	initDragPopUp(popup);
	initResizePopUp(popup);
	startPosPopUp(popup, -100, -100);
	let first_inp = popup.querySelector("input");
	if (first_inp) setTimeout(function(){first_inp.focus()}, 10);
	return popup;
}

function createInPopTable(p_container, in_head, in_body) {
	p_container.innerHTML = document.querySelector('#inPopTable').querySelector('.tlb-container').outerHTML;
	p_container.querySelector("thead").innerHTML = in_head;
	p_container.querySelector("tbody").innerHTML = in_body;
}

function popOnTop(popup) {
	document.querySelectorAll(".popup").forEach(function(pop){
		if (pop.id != popup.id) {
			if (pop.style.zIndex && parseInt(pop.style.zIndex) >= parseInt(popup.style.zIndex)) popup.style.zIndex = parseInt(pop.style.zIndex);
		}
	})
}

function initDragAndResizePopUps() {
	let popups = document.getElementsByClassName("popup");
	for (let i = 0; i < popups.length; i++) {
		let popup = popups[i];
		initDragPopUp(popup);
		initResizePopUp(popup);
	}
}
  
function initDragPopUp(popup) {
	let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	let elmnt = null;
	//let currentZIndex = 100; //TODO reset z index when a threshold is passed
	let header = getHeader(popup);
	//popup.onmousedown = function() {
	//	this.style.zIndex = "" + ++currentZIndex
	//};  
	popOnTop(popup);
	if (header) {
		header.parentPopup = popup;
		header.onmousedown = dragMouseDown;
	}
  	function dragMouseDown(e) {
		elmnt = this.parentPopup;
		popOnTop(elmnt);
		//elmnt.style.zIndex = "" + ++currentZIndex;
		e = e || window.event;
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}
  	function elementDrag(e) {
		if (!elmnt) return;
	  	e = e || window.event;
	  	// calculate the new cursor position:
	  	pos1 = pos3 - e.clientX;
	  	pos2 = pos4 - e.clientY;
	  	pos3 = e.clientX;
	  	pos4 = e.clientY;
	  	// set the element's new position:
	  	elmnt.style.top = elmnt.offsetTop - pos2 + "px";
	  	elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
	}  
	function closeDragElement() {
		/* stop moving when mouse button is released:*/
		document.onmouseup = null;
		document.onmousemove = null;
	}  
	function getHeader(element) {
		let headerItems = element.getElementsByClassName("popup-header");
		if (headerItems.length === 1) return headerItems[0];
	  	return null;
	}
}
  
function initResizePopUp(popup) {
	let element = null;
	let startX, startY, startWidth, startHeight;
	let right = document.createElement("div");
	right.className = "resizer-right";
	popup.appendChild(right);
	right.addEventListener("mousedown", initDrag, false);
	right.parentPopup = popup;  
	let bottom = document.createElement("div");
	bottom.className = "resizer-bottom";
	popup.appendChild(bottom);
	bottom.addEventListener("mousedown", initDrag, false);
	bottom.parentPopup = popup;
	let both = document.createElement("div");
	both.className = "resizer-both";
	popup.appendChild(both);
	both.addEventListener("mousedown", initDrag, false);
	both.parentPopup = popup;
	function initDrag(e) {
		element = this.parentPopup;
		startX = e.clientX;
		startY = e.clientY;
	  	startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
	  	startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
	  document.documentElement.addEventListener("mousemove", doDrag, false);
	  document.documentElement.addEventListener("mouseup", stopDrag, false);
	}
  
	function doDrag(e) {
	  element.style.width = startWidth + e.clientX - startX + "px";
	  element.style.height = startHeight + e.clientY - startY + "px";
	}
  
	function stopDrag() {
	  document.documentElement.removeEventListener("mousemove", doDrag, false);
	  document.documentElement.removeEventListener("mouseup", stopDrag, false);
	}
}

function startPosPopUp(popup, posX, posY) {
	if (posY == -100) posY = window.innerWidth / 2 - parseInt(popup.style.width)/2;
	if (posX == -100) posX = window.innerHeight / 2 - parseInt(popup.style.height)/2;
	if (posX < 0) posX = 1;
	if (posY < 0) posY = 1;
	popup.style.top = posX + "px";
	popup.style.left = posY + "px";
}

function clickInPopUpTable(target) {
	//let TD = (target.tagName == "TD")?target:getParentByTagName("TD");
	let TD = target.getParentByTagName("!TD");
	if (!TD) return;
	let TR = TD.parentElement;
	let TLB = TD.getParentByTagName("TABLE");
	TLB.querySelectorAll(".tlb-sel-row").forEach(function(row) {
		row.classList.remove("tlb-sel-row");		
	})
	TR.classList.add("tlb-sel-row");
}

function close_pops() {
	let pops = document.querySelectorAll('.popup');
	pops.forEach(function(pop){pop.style.display = 'none'});
}

  