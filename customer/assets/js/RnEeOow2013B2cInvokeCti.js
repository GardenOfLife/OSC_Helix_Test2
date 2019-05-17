var contactId = "1544";
urlPop="http://localhost:8080/screenpop?t=editor&recordType=5&id=" + contactId; 
ifrm=document.createElement("IFRAME");
ifrm.setAttribute("src", urlPop);
ifrm.setAttribute("name", "rnowWS");
ifrm.style.width="0px";
ifrm.style.height="0px";
document.body.appendChild(ifrm);