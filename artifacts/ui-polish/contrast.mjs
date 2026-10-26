// Lab contrast checks for opaque design tokens, not a full rendered-page audit.
const linear=v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4};
const luminance=hex=>{const c=hex.replace('#','').match(/../g).map(v=>linear(parseInt(v,16)));return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const pairs=[['Body','#16344b','#eaf2f7',4.5],['Secondary copy','#405c70','#eaf2f7',4.5],['Heading italic (large)','#54758e','#eaf2f7',3],['Family label','#4c667a','#f5f8fa',4.5],['Event label','#58728a','#f7fafc',4.5],['Countdown label','#b5ccde','#173c59',4.5],['Footer','#b7ccde','#06162b',4.5],['Action','#eff7fc','#102f47',4.5]];
const results=pairs.map(([label,fg,bg,min])=>{const a=luminance(fg),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);return {label,fg,bg,ratio:+ratio.toFixed(2),minimum:min,pass:ratio>=min}});console.log(JSON.stringify(results,null,2));

