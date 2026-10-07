(function(){
const pages=[["index.html","🏠","首頁"],["ntpu.html","🏫","北大"],["nycu.html","🎯","交大"],["research.html","🔬","研究"],["english.html","🎙️","英文"],["more.html","▦","更多"]];
function go(){const old=document.querySelector(".nav,.bottom-nav");const nav=document.createElement("nav");nav.className="bottom-nav";const name=location.pathname.split("/").pop()||"index.html";nav.innerHTML=pages.map(([u,ic,t])=>'<a href="'+u+'" class="'+(u===name?"active":"")+'"><span class="nav-ico">'+ic+'</span>'+t+'</a>').join("");if(old)old.replaceWith(nav);else document.body.append(nav);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go();
})();