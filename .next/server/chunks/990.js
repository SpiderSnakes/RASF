"use strict";exports.id=990,exports.ids=[990],exports.modules={2864:(a,b,c)=>{c.d(b,{Ex:()=>g,NH:()=>h,Wh:()=>i});var d=c(48249),e=c(67484);let f={default:"bg-gray-100 text-gray-800",success:"bg-green-100 text-green-800",warning:"bg-amber-100 text-amber-800",danger:"bg-red-100 text-red-800",info:"bg-blue-100 text-blue-800",surplace:"bg-blue-100 text-blue-800",emporter:"bg-amber-100 text-amber-800"},g=(0,e.forwardRef)(({variant:a="default",className:b="",children:c,...e},g)=>(0,d.jsx)("span",{ref:g,className:`
          inline-flex items-center px-2.5 py-0.5 rounded-full 
          text-xs font-medium
          ${f[a]}
          ${b}
        `,...e,children:c}));function h({mode:a}){return"SUR_PLACE"===a?(0,d.jsxs)(g,{variant:"surplace",children:[(0,d.jsx)("svg",{className:"w-3 h-3 mr-1",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,d.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"})}),"Sur place"]}):(0,d.jsxs)(g,{variant:"emporter",children:[(0,d.jsx)("svg",{className:"w-3 h-3 mr-1",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,d.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"})}),"\xc0 emporter"]})}function i({status:a}){let{variant:b,label:c}={BOOKED:{variant:"success",label:"R\xe9serv\xe9"},SERVED:{variant:"info",label:"Servi"},NO_SHOW:{variant:"danger",label:"Non venu"}}[a];return(0,d.jsx)(g,{variant:b,children:c})}g.displayName="Badge"},77385:(a,b,c)=>{let d,e;c.d(b,{N:()=>Q});var f,g=c(48249),h=c(67484),i=c(25297);let j={data:""},k=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,m=/\n+/g,n=(a,b)=>{let c="",d="",e="";for(let f in a){let g=a[f];"@"==f[0]?"i"==f[1]?c=f+" "+g+";":d+="f"==f[1]?n(g,f):f+"{"+n(g,"k"==f[1]?"":b)+"}":"object"==typeof g?d+=n(g,b?b.replace(/([^,])+/g,a=>f.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,b=>/&/.test(b)?b.replace(/&/g,a):a?a+" "+b:b)):f):null!=g&&(f=/^--/.test(f)?f:f.replace(/[A-Z]/g,"-$&").toLowerCase(),e+=n.p?n.p(f,g):f+":"+g+";")}return c+(b&&e?b+"{"+e+"}":e)+d},o={},p=a=>{if("object"==typeof a){let b="";for(let c in a)b+=c+p(a[c]);return b}return a};function q(a){let b,c,d=this||{},e=a.call?a(d.p):a;return((a,b,c,d,e)=>{var f;let g=p(a),h=o[g]||(o[g]=(a=>{let b=0,c=11;for(;b<a.length;)c=101*c+a.charCodeAt(b++)>>>0;return"go"+c})(g));if(!o[h]){let b=g!==a?a:(a=>{let b,c,d=[{}];for(;b=k.exec(a.replace(l,""));)b[4]?d.shift():b[3]?(c=b[3].replace(m," ").trim(),d.unshift(d[0][c]=d[0][c]||{})):d[0][b[1]]=b[2].replace(m," ").trim();return d[0]})(a);o[h]=n(e?{["@keyframes "+h]:b}:b,c?"":"."+h)}let i=c&&o.g?o.g:null;return c&&(o.g=o[h]),f=o[h],i?b.data=b.data.replace(i,f):-1===b.data.indexOf(f)&&(b.data=d?f+b.data:b.data+f),h})(e.unshift?e.raw?(b=[].slice.call(arguments,1),c=d.p,e.reduce((a,d,e)=>{let f=b[e];if(f&&f.call){let a=f(c),b=a&&a.props&&a.props.className||/^go/.test(a)&&a;f=b?"."+b:a&&"object"==typeof a?a.props?"":n(a,""):!1===a?"":a}return a+d+(null==f?"":f)},"")):e.reduce((a,b)=>Object.assign(a,b&&b.call?b(d.p):b),{}):e,(a=>{if("object"==typeof window){let b=(a?a.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return b.nonce=window.__nonce__,b.parentNode||(a||document.head).appendChild(b),b.firstChild}return a||j})(d.target),d.g,d.o,d.k)}q.bind({g:1});let r,s,t,u=q.bind({k:1});function v(a,b){let c=this||{};return function(){let d=arguments;function e(f,g){let h=Object.assign({},f),i=h.className||e.className;c.p=Object.assign({theme:s&&s()},h),c.o=/ *go\d+/.test(i),h.className=q.apply(c,d)+(i?" "+i:""),b&&(h.ref=g);let j=a;return a[0]&&(j=h.as||a,delete h.as),t&&j[0]&&t(h),r(j,h)}return b?b(e):e}}var w=(a,b)=>"function"==typeof a?a(b):a,y=(d=0,()=>(++d).toString()),z="default",A=(a,b)=>{let{toastLimit:c}=a.settings;switch(b.type){case 0:return{...a,toasts:[b.toast,...a.toasts].slice(0,c)};case 1:return{...a,toasts:a.toasts.map(a=>a.id===b.toast.id?{...a,...b.toast}:a)};case 2:let{toast:d}=b;return A(a,{type:+!!a.toasts.find(a=>a.id===d.id),toast:d});case 3:let{toastId:e}=b;return{...a,toasts:a.toasts.map(a=>a.id===e||void 0===e?{...a,dismissed:!0,visible:!1}:a)};case 4:return void 0===b.toastId?{...a,toasts:[]}:{...a,toasts:a.toasts.filter(a=>a.id!==b.toastId)};case 5:return{...a,pausedAt:b.time};case 6:let f=b.time-(a.pausedAt||0);return{...a,pausedAt:void 0,toasts:a.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+f}))}}},B=[],C={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},D={},E=(a,b=z)=>{D[b]=A(D[b]||C,a),B.forEach(([a,c])=>{a===b&&c(D[b])})},F=a=>Object.keys(D).forEach(b=>E(a,b)),G=(a=z)=>b=>{E(b,a)},H=a=>(b,c)=>{let d,e=((a,b="blank",c)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:b,ariaProps:{role:"status","aria-live":"polite"},message:a,pauseDuration:0,...c,id:(null==c?void 0:c.id)||y()}))(b,a,c);return G(e.toasterId||(d=e.id,Object.keys(D).find(a=>D[a].toasts.some(a=>a.id===d))))({type:2,toast:e}),e.id},I=(a,b)=>H("blank")(a,b);I.error=H("error"),I.success=H("success"),I.loading=H("loading"),I.custom=H("custom"),I.dismiss=(a,b)=>{let c={type:3,toastId:a};b?G(b)(c):F(c)},I.dismissAll=a=>I.dismiss(void 0,a),I.remove=(a,b)=>{let c={type:4,toastId:a};b?G(b)(c):F(c)},I.removeAll=a=>I.remove(void 0,a),I.promise=(a,b,c)=>{let d=I.loading(b.loading,{...c,...null==c?void 0:c.loading});return"function"==typeof a&&(a=a()),a.then(a=>{let e=b.success?w(b.success,a):void 0;return e?I.success(e,{id:d,...c,...null==c?void 0:c.success}):I.dismiss(d),a}).catch(a=>{let e=b.error?w(b.error,a):void 0;e?I.error(e,{id:d,...c,...null==c?void 0:c.error}):I.dismiss(d)}),a};var J=u`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,K=u`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,L=u`
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
  background: ${a=>a.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${J} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${K} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${a=>a.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${L} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`;var M=u`
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
  border-color: ${a=>a.secondary||"#e0e0e0"};
  border-right-color: ${a=>a.primary||"#616161"};
  animation: ${M} 1s linear infinite;
`;var N=u`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,O=u`
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
  background: ${a=>a.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${N} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${O} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${a=>a.secondary||"#fff"};
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
`;var P=u`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`;function Q({options:a,label:b="Exporter",variant:c="outline"}){let[d,e]=(0,h.useState)(!1),[f,j]=(0,h.useState)(!1),k=(0,h.useRef)(null),l=async a=>{j(!0),e(!1);try{let b=await fetch(a);if(!b.ok){let a=await b.json();throw Error(a.error||"Erreur lors de l'export")}let c=b.headers.get("Content-Disposition"),d=c?.match(/filename="(.+)"/),e=d?.[1]||"export.csv",f=await b.blob(),g=window.URL.createObjectURL(f),h=document.createElement("a");h.href=g,h.download=e,document.body.appendChild(h),h.click(),h.remove(),window.URL.revokeObjectURL(g),I.success("Export termine")}catch(a){I.error(a instanceof Error?a.message:"Erreur lors de l'export")}finally{j(!1)}};return 1===a.length?(0,g.jsx)(i.$,{variant:c,size:"sm",onClick:()=>l(a[0].url),disabled:f,children:f?(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("span",{className:"w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"}),"Export..."]}):(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("svg",{className:"w-4 h-4 mr-2",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,g.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),b]})}):(0,g.jsxs)("div",{className:"relative",ref:k,children:[(0,g.jsx)(i.$,{variant:c,size:"sm",onClick:()=>e(!d),disabled:f,children:f?(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("span",{className:"w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"}),"Export..."]}):(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("svg",{className:"w-4 h-4 mr-2",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,g.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),b,(0,g.jsx)("svg",{className:"w-4 h-4 ml-1",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,g.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})]})}),d&&(0,g.jsx)("div",{className:"absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50",children:(0,g.jsx)("div",{className:"py-1",children:a.map((a,b)=>(0,g.jsx)("button",{className:"w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors",onClick:()=>l(a.url),children:a.label},b))})})]})}v("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${P} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
`,f=h.createElement,n.p=void 0,r=f,s=void 0,t=void 0,q`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`},88877:(a,b,c)=>{c.d(b,{p:()=>e});var d=c(48249);let e=(0,c(67484).forwardRef)(({label:a,error:b,helperText:c,className:e="",id:f,...g},h)=>{let i=f||a?.toLowerCase().replace(/\s/g,"-");return(0,d.jsxs)("div",{className:"w-full",children:[a&&(0,d.jsx)("label",{htmlFor:i,className:"block text-sm font-medium text-gray-700 mb-1",children:a}),(0,d.jsx)("input",{ref:h,id:i,className:`
            block w-full px-3 py-2 
            bg-white text-gray-900
            border rounded-lg shadow-sm
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-rasf-500 focus:border-rasf-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${b?"border-red-500":"border-gray-300"}
            ${e}
          `,suppressHydrationWarning:!0,...g}),b&&(0,d.jsx)("p",{className:"mt-1 text-sm text-red-600",children:b}),c&&!b&&(0,d.jsx)("p",{className:"mt-1 text-sm text-gray-500",children:c})]})});e.displayName="Input"}};