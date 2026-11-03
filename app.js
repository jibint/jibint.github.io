(() => {
'use strict';
const systems = {
doh:['DOH integration','Healthcare application integration work across DOH-related workflows.','HEALTHCARE CONNECTIVITY','01'],
dha:['DHA integration','Connecting healthcare applications with DHA-related integration workflows.','HEALTHCARE CONNECTIVITY','02'],
moh:['MOH integration','Healthcare system integration work across MOH-related workflows.','HEALTHCARE CONNECTIVITY','03'],
pacs:['PACS integration','Connecting clinical applications with picture archiving and communication systems for imaging workflows.','IMAGING CONNECTIVITY','04'],
lab:['Laboratory integration','Connecting healthcare applications with laboratory systems and their clinical workflows.','LABORATORY CONNECTIVITY','05']};
const nodes=document.querySelectorAll('[data-system]');
function selectSystem(key){const s=systems[key];if(!s)return;nodes.forEach(n=>{const active=n.dataset.system===key;n.classList.toggle('selected',active);n.setAttribute('aria-pressed',String(active));});document.querySelectorAll('[data-path]').forEach(p=>p.classList.toggle('active',p.dataset.path===key));document.getElementById('system-title').textContent=s[0];document.getElementById('system-description').textContent=s[1];document.querySelector('.detail-kicker').textContent=s[2];document.querySelector('.console-caption>span').textContent=s[3]+' / 05';}
nodes.forEach(n=>n.addEventListener('click',()=>selectSystem(n.dataset.system)));selectSystem('doh');
const panel=document.getElementById('integration-console'),toggle=document.getElementById('view-toggle'),plane=document.getElementById('map-plane'),scene=document.getElementById('scene');let is3D=true;
toggle.addEventListener('click',()=>{is3D=!is3D;panel.classList.toggle('flat',!is3D);toggle.setAttribute('aria-pressed',String(is3D));toggle.textContent=is3D?'3D view ↗':'Flat view ↔';plane.style.transform='';});
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)'),fine=window.matchMedia('(hover: hover) and (pointer: fine)');
scene.addEventListener('pointermove',e=>{if(!is3D||reduced.matches||!fine.matches)return;const r=scene.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;plane.style.transform='rotateX('+(26-y*7)+'deg) rotateY('+x*6+'deg) rotateZ('+(-12+x*3)+'deg)';});scene.addEventListener('pointerleave',()=>{plane.style.transform='';});reduced.addEventListener('change',()=>{plane.style.transform='';});
const filters=document.querySelectorAll('[data-filter]'),projects=document.querySelectorAll('[data-category]');
filters.forEach(b=>b.addEventListener('click',()=>{const filter=b.dataset.filter;filters.forEach(i=>{i.classList.toggle('active',i===b);i.setAttribute('aria-pressed',String(i===b));});let count=0;projects.forEach(p=>{p.hidden=filter!=='all'&&p.dataset.category!==filter;if(!p.hidden)count++;});document.getElementById('filter-status').textContent='Showing '+count+(filter==='all'?'':' '+filter)+' projects.';}));
const links=document.querySelectorAll('.main-nav a');if('IntersectionObserver' in window){const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;links.forEach(a=>{const active=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('current',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});});},{rootMargin:'-15% 0px -55% 0px',threshold:0});['overview','integrations','work','experience'].forEach(id=>obs.observe(document.getElementById(id)));}
})();
