(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5143],{833:(e,t,r)=>{Promise.resolve().then(r.bind(r,2686))},2686:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>h});var a=r(5155),s=r(2115),i=r(8784),l=r(1477),n=r(9239),o=r(529),c=r(5160),d=r(5283),m=r(9991);function u({isOpen:e,onClose:t,onSuccess:r}){let[i,l]=(0,s.useState)({email:"",firstName:"",lastName:"",canteenAccountNumber:"",role:"AGENT"}),[c,u]=(0,s.useState)(!1),[p,f]=(0,s.useState)(null),h=async e=>{e.preventDefault(),u(!0),f(null);try{let e=await fetch("/api/users",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}),t=await e.json();if(!e.ok)throw Error(t.error||"Erreur lors de la cr\xe9ation");r()}catch(e){f(e instanceof Error?e.message:"Une erreur est survenue")}finally{u(!1)}};return e?(0,a.jsxs)("div",{className:"fixed inset-0 z-50 overflow-y-auto",children:[(0,a.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50",onClick:t}),(0,a.jsx)("div",{className:"flex min-h-full items-center justify-center p-4",children:(0,a.jsxs)("div",{className:"relative bg-white rounded-xl shadow-xl max-w-md w-full p-6",children:[(0,a.jsxs)("div",{className:"flex items-center justify-between mb-6",children:[(0,a.jsx)("h2",{className:"text-xl font-semibold text-gray-900",children:"Nouvel utilisateur"}),(0,a.jsx)("button",{onClick:t,className:"text-gray-400 hover:text-gray-500",children:(0,a.jsx)("svg",{className:"w-6 h-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),p&&(0,a.jsx)(d.F,{variant:"error",className:"mb-4",children:p}),(0,a.jsxs)("form",{onSubmit:h,className:"space-y-4",children:[(0,a.jsx)(o.p,{label:"Email *",type:"email",value:i.email,onChange:e=>l({...i,email:e.target.value}),placeholder:"agent@exemple.fr",required:!0}),(0,a.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,a.jsx)(o.p,{label:"Pr\xe9nom *",value:i.firstName,onChange:e=>l({...i,firstName:e.target.value}),placeholder:"Jean",required:!0}),(0,a.jsx)(o.p,{label:"Nom *",value:i.lastName,onChange:e=>l({...i,lastName:e.target.value}),placeholder:"Dupont",required:!0})]}),(0,a.jsx)(o.p,{label:"N\xb0 Compte Cantine *",value:i.canteenAccountNumber,onChange:e=>l({...i,canteenAccountNumber:e.target.value}),placeholder:"AGT001",required:!0}),(0,a.jsx)(m.l,{label:"R\xf4le",value:i.role,onChange:e=>l({...i,role:e.target.value}),options:[{value:"AGENT",label:"Agent"},{value:"GESTIONNAIRE",label:"Gestionnaire RASF"},{value:"ADMIN",label:"Administrateur"}]}),(0,a.jsx)("div",{className:"bg-blue-50 p-3 rounded-lg text-sm text-blue-800",children:"Un email d'activation sera envoy\xe9 \xe0 l'utilisateur pour qu'il d\xe9finisse son mot de passe."}),(0,a.jsxs)("div",{className:"flex gap-3 pt-4",children:[(0,a.jsx)(n.$,{type:"button",variant:"secondary",onClick:t,className:"flex-1",children:"Annuler"}),(0,a.jsx)(n.$,{type:"submit",isLoading:c,className:"flex-1",children:"Cr\xe9er"})]})]})]})})]}):null}function p({isOpen:e,onClose:t,onSuccess:r}){let i=(0,s.useRef)(null),[l,o]=(0,s.useState)(null),[c,m]=(0,s.useState)(!1),[u,p]=(0,s.useState)(null),[f,h]=(0,s.useState)(null),g=async e=>{if(e.preventDefault(),!l)return void p("Veuillez s\xe9lectionner un fichier");m(!0),p(null);try{let e=await l.text(),t=(e=>{let t=e.trim().split("\n");if(t.length<2)return[];let r=t[0].split(";").map(e=>e.trim().toLowerCase()),a={email:"email","e-mail":"email",prénom:"firstName",prenom:"firstName",firstname:"firstName",nom:"lastName",lastname:"lastName","num\xe9ro compte":"canteenAccountNumber","numero compte":"canteenAccountNumber","n\xb0 compte":"canteenAccountNumber","compte cantine":"canteenAccountNumber",canteenaccountnumber:"canteenAccountNumber",rôle:"role",role:"role"},s=r.map(e=>a[e]||e);return t.slice(1).map(e=>{let t=e.split(";").map(e=>e.trim()),r={};return s.forEach((e,a)=>{t[a]&&(r[e]=t[a])}),r})})(e);if(0===t.length)throw Error("Le fichier est vide ou mal format\xe9");let a=await fetch("/api/users/import",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({users:t,skipExisting:!0})}),s=await a.json();if(!a.ok)throw Error(s.error||"Erreur lors de l'import");h(s.data),s.data.created>0&&r()}catch(e){p(e instanceof Error?e.message:"Une erreur est survenue")}finally{m(!1)}},b=()=>{o(null),p(null),h(null),i.current&&(i.current.value=""),t()};return e?(0,a.jsxs)("div",{className:"fixed inset-0 z-50 overflow-y-auto",children:[(0,a.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50",onClick:b}),(0,a.jsx)("div",{className:"flex min-h-full items-center justify-center p-4",children:(0,a.jsxs)("div",{className:"relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6",children:[(0,a.jsxs)("div",{className:"flex items-center justify-between mb-6",children:[(0,a.jsx)("h2",{className:"text-xl font-semibold text-gray-900",children:"Import en masse"}),(0,a.jsx)("button",{onClick:b,className:"text-gray-400 hover:text-gray-500",children:(0,a.jsx)("svg",{className:"w-6 h-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),(0,a.jsxs)("div",{className:"mb-6 p-4 bg-gray-50 rounded-lg",children:[(0,a.jsx)("h3",{className:"font-medium text-gray-900 mb-2",children:"Format du fichier CSV"}),(0,a.jsx)("p",{className:"text-sm text-gray-600 mb-2",children:"Le fichier doit contenir les colonnes suivantes (s\xe9parateur : point-virgule) :"}),(0,a.jsxs)("ul",{className:"text-sm text-gray-600 list-disc list-inside space-y-1",children:[(0,a.jsxs)("li",{children:[(0,a.jsx)("strong",{children:"Email"})," - Adresse email de l'agent"]}),(0,a.jsxs)("li",{children:[(0,a.jsx)("strong",{children:"Pr\xe9nom"})," - Pr\xe9nom de l'agent"]}),(0,a.jsxs)("li",{children:[(0,a.jsx)("strong",{children:"Nom"})," - Nom de famille"]}),(0,a.jsxs)("li",{children:[(0,a.jsx)("strong",{children:"Num\xe9ro compte"})," - Num\xe9ro de compte cantine"]}),(0,a.jsxs)("li",{children:[(0,a.jsx)("strong",{children:"R\xf4le"})," (optionnel) - AGENT, GESTIONNAIRE ou ADMIN"]})]}),(0,a.jsx)("p",{className:"text-xs text-gray-500 mt-2",children:"Exemple : Email;Pr\xe9nom;Nom;Num\xe9ro compte;R\xf4le"})]}),u&&(0,a.jsx)(d.F,{variant:"error",className:"mb-4",children:u}),f&&(0,a.jsxs)("div",{className:"mb-4 space-y-2",children:[(0,a.jsxs)(d.F,{variant:f.errors.length>0?"warning":"success",children:[f.created," utilisateur(s) cr\xe9\xe9(s), ",f.skipped," ignor\xe9(s)",f.errors.length>0&&`, ${f.errors.length} erreur(s)`]}),f.errors.length>0&&(0,a.jsx)("div",{className:"max-h-32 overflow-y-auto p-2 bg-red-50 rounded text-sm",children:f.errors.map((e,t)=>(0,a.jsxs)("div",{className:"text-red-700",children:["Ligne ",e.row," (",e.email,"): ",e.error]},t))})]}),(0,a.jsxs)("form",{onSubmit:g,className:"space-y-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Fichier CSV"}),(0,a.jsx)("input",{ref:i,type:"file",accept:".csv",onChange:e=>{let t=e.target.files?.[0];if(t){if(!t.name.endsWith(".csv"))return void p("Veuillez s\xe9lectionner un fichier CSV");o(t),p(null),h(null)}},className:"block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-rasf-50 file:text-rasf-700 hover:file:bg-rasf-100"}),l&&(0,a.jsxs)("p",{className:"mt-1 text-sm text-gray-500",children:["Fichier s\xe9lectionn\xe9 : ",l.name]})]}),(0,a.jsxs)("div",{className:"flex gap-3 pt-4",children:[(0,a.jsx)(n.$,{type:"button",variant:"secondary",onClick:b,className:"flex-1",children:"Fermer"}),(0,a.jsx)(n.$,{type:"submit",isLoading:c,className:"flex-1",disabled:!l,children:"Importer"})]})]})]})})]}):null}var f=r(2702);function h(){let[e,t]=(0,s.useState)([]),[r,m]=(0,s.useState)(!0),[h,g]=(0,s.useState)(null),[b,y]=(0,s.useState)(""),[v,N]=(0,s.useState)(!1),[j,w]=(0,s.useState)(!1),E=(0,s.useCallback)(async()=>{m(!0),g(null);try{let e=await fetch(`/api/users${b?`?search=${b}`:""}`),r=await e.json();if(!e.ok)throw Error(r.error);t(r.data||[])}catch(e){g("Erreur lors du chargement des utilisateurs")}finally{m(!1)}},[b]);(0,s.useEffect)(()=>{let e=setTimeout(E,300);return()=>clearTimeout(e)},[E]);let C=async e=>{if(confirm("\xcates-vous s\xfbr de vouloir d\xe9sactiver cet utilisateur ?"))try{let t=await fetch(`/api/users/${e}`,{method:"DELETE"});if(!t.ok){let e=await t.json();throw Error(e.error)}E()}catch(e){g("Erreur lors de la d\xe9sactivation")}};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(i.z,{title:"Gestion des utilisateurs",description:"Cr\xe9ez et g\xe9rez les comptes des agents",actions:(0,a.jsxs)("div",{className:"flex gap-2",children:[(0,a.jsx)(f.N,{options:[{label:"Exporter tous les utilisateurs",url:"/api/export/users"}],label:"Export CSV"}),(0,a.jsx)(n.$,{variant:"outline",onClick:()=>w(!0),children:"Import CSV"}),(0,a.jsx)(n.$,{onClick:()=>N(!0),children:"+ Nouvel utilisateur"})]})}),(0,a.jsx)("div",{className:"mb-6",children:(0,a.jsx)(o.p,{placeholder:"Rechercher par nom, email...",value:b,onChange:e=>y(e.target.value),className:"max-w-md"})}),h&&(0,a.jsx)(d.F,{variant:"error",className:"mb-6",children:h}),(0,a.jsx)(l.Zp,{children:(0,a.jsx)(l.Wu,{className:"p-0",children:r?(0,a.jsx)("div",{className:"text-center py-12 text-gray-500",children:"Chargement..."}):0===e.length?(0,a.jsx)("div",{className:"text-center py-12 text-gray-500",children:"Aucun utilisateur trouv\xe9"}):(0,a.jsx)("div",{className:"overflow-x-auto",children:(0,a.jsxs)("table",{className:"w-full",children:[(0,a.jsx)("thead",{className:"bg-gray-50",children:(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{className:"text-left py-3 px-4 text-sm font-medium text-gray-500",children:"Nom"}),(0,a.jsx)("th",{className:"text-left py-3 px-4 text-sm font-medium text-gray-500",children:"Email"}),(0,a.jsx)("th",{className:"text-left py-3 px-4 text-sm font-medium text-gray-500",children:"N\xb0 Compte"}),(0,a.jsx)("th",{className:"text-center py-3 px-4 text-sm font-medium text-gray-500",children:"R\xf4le"}),(0,a.jsx)("th",{className:"text-center py-3 px-4 text-sm font-medium text-gray-500",children:"Statut"}),(0,a.jsx)("th",{className:"text-center py-3 px-4 text-sm font-medium text-gray-500",children:"Actions"})]})}),(0,a.jsx)("tbody",{children:e.map(e=>(0,a.jsxs)("tr",{className:"border-t border-gray-100 hover:bg-gray-50",children:[(0,a.jsx)("td",{className:"py-3 px-4",children:(0,a.jsxs)("div",{className:"font-medium text-gray-900",children:[e.lastName.toUpperCase()," ",e.firstName]})}),(0,a.jsx)("td",{className:"py-3 px-4 text-sm text-gray-600",children:e.email}),(0,a.jsx)("td",{className:"py-3 px-4 text-sm text-gray-600",children:e.canteenAccountNumber||"-"}),(0,a.jsx)("td",{className:"py-3 px-4 text-center",children:(e=>{let{variant:t,label:r}={ADMIN:{variant:"danger",label:"Admin"},GESTIONNAIRE:{variant:"warning",label:"Gestionnaire"},AGENT:{variant:"info",label:"Agent"}}[e]||{variant:"info",label:e};return(0,a.jsx)(c.Ex,{variant:t,children:r})})(e.role)}),(0,a.jsx)("td",{className:"py-3 px-4 text-center",children:(e=>{let{variant:t,label:r}={ACTIVE:{variant:"success",label:"Actif"},PENDING:{variant:"warning",label:"En attente"},DISABLED:{variant:"default",label:"D\xe9sactiv\xe9"}}[e]||{variant:"default",label:e};return(0,a.jsx)(c.Ex,{variant:t,children:r})})(e.status)}),(0,a.jsx)("td",{className:"py-3 px-4 text-center",children:"DISABLED"!==e.status&&(0,a.jsx)(n.$,{variant:"ghost",size:"sm",onClick:()=>C(e.id),children:"D\xe9sactiver"})})]},e.id))})]})})})}),v&&(0,a.jsx)(u,{isOpen:v,onClose:()=>N(!1),onSuccess:()=>{N(!1),E()}}),j&&(0,a.jsx)(p,{isOpen:j,onClose:()=>w(!1),onSuccess:()=>{w(!1),E()}})]})}},8434:(e,t,r)=>{"use strict";let a,s;r.d(t,{Ay:()=>M});var i,l=r(2115);let n={data:""},o=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,c=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,m=(e,t)=>{let r="",a="",s="";for(let i in e){let l=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+l+";":a+="f"==i[1]?m(l,i):i+"{"+m(l,"k"==i[1]?"":t)+"}":"object"==typeof l?a+=m(l,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=l&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=m.p?m.p(i,l):i+":"+l+";")}return r+(t&&s?t+"{"+s+"}":s)+a},u={},p=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+p(e[r]);return t}return e};function f(e){let t,r,a=this||{},s=e.call?e(a.p):e;return((e,t,r,a,s)=>{var i;let l=p(e),n=u[l]||(u[l]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(l));if(!u[n]){let t=l!==e?e:(e=>{let t,r,a=[{}];for(;t=o.exec(e.replace(c,""));)t[4]?a.shift():t[3]?(r=t[3].replace(d," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(d," ").trim();return a[0]})(e);u[n]=m(s?{["@keyframes "+n]:t}:t,r?"":"."+n)}let f=r&&u.g?u.g:null;return r&&(u.g=u[n]),i=u[n],f?t.data=t.data.replace(f,i):-1===t.data.indexOf(i)&&(t.data=a?i+t.data:t.data+i),n})(s.unshift?s.raw?(t=[].slice.call(arguments,1),r=a.p,s.reduce((e,a,s)=>{let i=t[s];if(i&&i.call){let e=i(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":m(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(a.target),a.g,a.o,a.k)}f.bind({g:1});let h,g,b,y=f.bind({k:1});function v(e,t){let r=this||{};return function(){let a=arguments;function s(i,l){let n=Object.assign({},i),o=n.className||s.className;r.p=Object.assign({theme:g&&g()},n),r.o=/ *go\d+/.test(o),n.className=f.apply(r,a)+(o?" "+o:""),t&&(n.ref=l);let c=e;return e[0]&&(c=n.as||e,delete n.as),b&&c[0]&&b(n),h(c,n)}return t?t(s):s}}var N=(e,t)=>"function"==typeof e?e(t):e,j=(a=0,()=>(++a).toString()),w="default",E=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return E(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},C=[],k={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},A={},S=(e,t=w)=>{A[t]=E(A[t]||k,e),C.forEach(([e,r])=>{e===t&&r(A[t])})},$=e=>Object.keys(A).forEach(t=>S(e,t)),I=(e=w)=>t=>{S(t,e)},L=e=>(t,r)=>{let a,s=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||j()}))(t,e,r);return I(s.toasterId||(a=s.id,Object.keys(A).find(e=>A[e].toasts.some(e=>e.id===a))))({type:2,toast:s}),s.id},D=(e,t)=>L("blank")(e,t);D.error=L("error"),D.success=L("success"),D.loading=L("loading"),D.custom=L("custom"),D.dismiss=(e,t)=>{let r={type:3,toastId:e};t?I(t)(r):$(r)},D.dismissAll=e=>D.dismiss(void 0,e),D.remove=(e,t)=>{let r={type:4,toastId:e};t?I(t)(r):$(r)},D.removeAll=e=>D.remove(void 0,e),D.promise=(e,t,r)=>{let a=D.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?N(t.success,e):void 0;return s?D.success(s,{id:a,...r,...null==r?void 0:r.success}):D.dismiss(a),e}).catch(e=>{let s=t.error?N(t.error,e):void 0;s?D.error(s,{id:a,...r,...null==r?void 0:r.error}):D.dismiss(a)}),e};var O=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,T=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,z=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`;v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${O} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${T} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${z} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`;var F=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;v("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${F} 1s linear infinite;
`;var _=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,G=y`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`;v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${_} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${G} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,v("div")`
  position: absolute;
`,v("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`;var R=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`;v("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${R} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,v("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,v("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,i=l.createElement,m.p=void 0,h=i,g=void 0,b=void 0,f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;var M=D},9991:(e,t,r)=>{"use strict";r.d(t,{l:()=>s});var a=r(5155);let s=(0,r(2115).forwardRef)(({label:e,error:t,options:r,placeholder:s,className:i="",id:l,...n},o)=>{let c=l||e?.toLowerCase().replace(/\s/g,"-");return(0,a.jsxs)("div",{className:"w-full",children:[e&&(0,a.jsx)("label",{htmlFor:c,className:"block text-sm font-medium text-gray-700 mb-1",children:e}),(0,a.jsxs)("select",{ref:o,id:c,className:`
            block w-full px-3 py-2 
            border rounded-lg shadow-sm
            bg-white text-gray-900
            focus:outline-none focus:ring-2 focus:ring-rasf-500 focus:border-rasf-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${t?"border-red-500":"border-gray-300"}
            ${i}
          `,...n,children:[s&&(0,a.jsx)("option",{value:"",disabled:!0,children:s}),r.map(e=>(0,a.jsx)("option",{value:e.value,disabled:e.disabled,children:e.label},e.value))]}),t&&(0,a.jsx)("p",{className:"mt-1 text-sm text-red-600",children:t})]})});s.displayName="Select"}},e=>{e.O(0,[4408,8441,6511,7358],()=>e(e.s=833)),_N_E=e.O()}]);