import{select as t,stratify as i,partition as e,scaleLinear as a,drag as s,zoom as r,pointer as o}from"d3";function n(){return n=Object.assign?Object.assign.bind():function(t){for(var i=1;i<arguments.length;i++){var e=arguments[i];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a])}return t},n.apply(this,arguments)}function h(t,i){const e=(h.canvas||(h.canvas=document.createElement("canvas"))).getContext("2d");return e.font=i,e.measureText(t).width}function d(t,i){return i?t.transition().duration(i):t}const l={height:70,fontSize:16,fontFamily:"sans-serif",margin:{top:0,right:0,bottom:0,left:0},padding:{top:0,right:0,bottom:0,left:0},time:0,transition:450,intervalSum:t=>t.leaf?1:0,maxZoom:10,showTick:!0};class c{constructor(a,s,r={}){var o;this.font=void 0,this.maxLevel=void 0,this.svg=void 0,this.intervals=void 0,this.hierarchicalData=void 0,this.root=void 0,this.options=void 0,this._width=void 0,this._height=void 0,this._time=void 0,this._timeLength=void 0,this._scaleRadio=void 0,this._scaleVal=void 0,this._level=void 0,this._startTime=void 0,this._endTime=void 0,this._handle=void 0,this._zoomedScale=void 0,this._onChange=void 0,this._onAfterChange=void 0,this._ready=void 0,this._xAxis=void 0,this._cellGroup=void 0,this._heightScale=void 0,this._zoomWidth=void 0,this._minZoom=void 0,this._maxZoom=void 0,this._zoomHeight=void 0,this._zoom=void 0,this._interval=void 0,this._cell=void 0,this._rect=void 0,this._text=void 0,this._ticks=void 0,this._margin=void 0,this._padding=void 0,this._showTick=void 0,this._limitHandle=void 0,this.transition=void 0,this._forceTrans=void 0;const h=t(a);if(!h.node())throw Error("Invalid selecor!");if(null==s||!s.length)throw Error("Empty intervals!");const d=+h.style("width").split("px")[0],c=n({},l,{margin:n({},l.margin,r.margin),padding:n({},l.padding,r.padding),width:isNaN(d)?1e3:d},r),{width:_,height:g,margin:m,padding:p,intervalSum:x,onChange:v,onAfterChange:u,time:f,transition:y,showTick:w,limitHandle:k}=c;this._width=_,this._height=g,this._margin=m,this._padding=p,this._heightScale=g/l.height,this._zoomWidth=_-m.left-m.right,this._zoomHeight=g-m.top-m.bottom,this.transition=y,this._onChange=v,this._onAfterChange=u,this._time=f,this.font=`${c.fontSize}px ${c.fontFamily}`,this._minZoom=c.minZoom=null!=(o=c.minZoom)?o:this._zoomWidth/(this._zoomWidth+p.right+p.left),this._maxZoom=c.maxZoom,this._showTick=w,this._limitHandle=k,this.intervals=s,this.options=c,this.hierarchicalData=i()(s).sum(x).sort((t,i)=>i.data.start-t.data.start),this.maxLevel=this.hierarchicalData.height,this.root=e().size([_,(g-c.margin.bottom)*this.maxLevel]).padding(0)(this.hierarchicalData),this.root.each(t=>{t.target={x0:t.x0,x1:t.x1},t.visible=1===t.data.level}),this._startTime=this.root.data.start,this._endTime=this.root.data.end,this._timeLength=Math.abs(this._startTime-this._endTime),this._scaleRadio=this._width/(this.root.x1-this.root.x0),this._scaleVal=this._getScaleXByTime(f),this.svg=h.append("svg").attr("viewBox",[0,0,_,g]).style("font",this.font).style("overflow","hidden"),this._ready=!1,this._init()}get time(){return this._time}set time(t){this._setTime(t)&&(this._time=+t)}get level(){return this._level}set level(t){let i=+t;t<this._minZoom&&(i=this._minZoom),t>this._maxZoom&&(i=this._maxZoom),this._zoom.scaleTo(this.svg,i,[this._zoomedScale(this._scaleVal),0])}get ready(){return this._ready}_init(){const t=this,{width:i,height:e,margin:n,padding:h}=t.options,d=t.svg;t._cellGroup=d.append("g").attr("id","cells").attr("transform",`translate(0, ${n.top})`),t._cell=t._cellGroup.selectAll("g").data(t.root.descendants()).join("g"),t._rect=t._drawRect(t._cell),t._xAxis=a().domain([t._endTime,t._startTime]).range([n.left-h.left,i-n.right+h.right]),t._zoomedScale=t._xAxis.copy(),t._text=t._drawText(t._cell),t._showTick&&(t._ticks=t._addTicks(t._cell)),t._handle=t._drawHandle(d),t._handle.call(s().on("drag",function(i){t._changeHandlePos(t._zoomedScale,t._handle,t._zoomedScale(t._scaleVal)+i.dx),t._handle.attr("cursor","grabbing")}).on("end",()=>{t._handle.attr("cursor","grab"),clearInterval(t._interval),t._dispatchFunc(t._onAfterChange)}));const l=[[n.left,n.top],[i-n.right,e-n.top]],c=[t._minZoom,t._maxZoom],_=[[t.root.x0,0],[t.root.x1,0]];t._zoom=r().extent(l).scaleExtent(c).translateExtent(_).on("zoom",function(i){const e=i.transform;e.k===t._level&&t._cellGroup.attr("cursor","grabbing"),t._transform(e)}).on("end",()=>{t._cellGroup.attr("cursor","default")}),d.call(t._zoom),d.call(t._zoom.scaleBy,t._scaleRadio).on("click",function(i){const e=o(i)[0];t._changeHandlePos(t._zoomedScale,t._handle,e),t._dispatchFunc(t._onAfterChange)}),this._ready=!0}_dispatchFunc(t){t&&this._ready&&t(this._time,this._level)}_drawHandle(t){const i=t.append("g").attr("cursor","grab");function e(t){i.append("rect").attr("fill","#515151").attr("width",3).attr("height",16).attr("x",t).attr("y",21)}return i.append("path").attr("fill","#ccc").attr("fill-opacity",.85).attr("stroke","#333").attr("stroke-width","1px").attr("d","M0 0 l 15 20 v 18 q 0 5 -5 5 h -20 q -5 0 -5 -5 v -18 l 15 -20"),e(-7.5),e(-1.5),e(4.5),i}_drawRect(t){return t.append("rect").attr("height",this._zoomHeight).attr("fill",t=>t.data.color)}_drawText(t){return t.append("text").style("user-select","none").attr("pointer-events","none").attr("y",this._zoomHeight/2).attr("fill",t=>{var i;return null!=(i=t.data.textColor)?i:"black"}).attr("opacity",.8).attr("text-anchor","middle").attr("dominant-baseline","middle")}_addTicks(t){const i=t.append("g").attr("id","tick"),e=.8*(this._zoomHeight-this.options.fontSize);return i.append("line").attr("stroke","#555").attr("stroke-width",1).attr("x1",0).attr("y1",0).attr("x2",0).attr("y2",e),i.append("text").attr("x",0).attr("y",e+this.options.fontSize).attr("font-size",t=>1-.05*t.data.level+"em").text(t=>t.data.start+"ma").attr("text-anchor",t=>t.data.start===this._startTime?"start":"middle").clone(!0).lower().attr("stroke-linejoin","round").attr("stroke-width",1).attr("stroke","white"),i}_transform(t){const{x:i}=t,e=+t.k.toFixed(6),a=this._ready&&(this._level!==e&&e>this._minZoom&&e<this._maxZoom||this._forceTrans)?this.transition:0;if(this._level!==e){const t=e*this._scaleRadio;this.root.each(i=>{var a,s;i.target={x0:i.x0*t,x1:i.x1*t};const r=null!=(a=i.data.level)?a:0;i.visible=r===~~e||0===(null!=(s=i.children)?s:[]).length&&r<e}),d(this._rect,a).attr("width",t=>t.target.x1-t.target.x0).attr("x",t=>t.target.x0),d(this._text,a).attr("fill-opacity",t=>t.target.x1-t.target.x0>14?1:0).attr("x",t=>{const i=t.target.x0+(t.target.x1-t.target.x0)/2;return Number.isNaN(i)?0:i}).text(t=>{const i=Math.abs(t.target.x1-t.target.x0),e=h(t.data.name,this.font),a=t.data.abbr||t.data.name.charAt(0);return i-10<e?a:t.data.name}),this._showTick&&d(this._ticks,a).attr("transform",t=>`translate(${t.target.x0}, 0)`).attr("opacity",t=>{const i=t.data.start+"ma";return Math.abs(t.target.x1-t.target.x0)<h(i,this.font)*(1-.05*t.data.level)?0:1}),d(this._cell,a).style("opacity",t=>t.visible?1:0),this._level=e,this._dispatchFunc(this._onChange),this._dispatchFunc(this._onAfterChange)}return d(this._cellGroup,a).attr("transform",`translate(${i}, ${this._margin.top})`),this._zoomedScale=t.rescaleX(this._xAxis),this._changeHandlePos(this._zoomedScale,this._handle,this._zoomedScale(this._scaleVal),a),!0}_getScaleXByTime(t){const i=this.root.find(i=>i.visible&&i.data.start>=t&&i.data.end<=t);return(i.target.x0+(i.target.x1-i.target.x0)*(i.data.start-t)/(i.data.start-i.data.end))/(this.root.target.x1-this.root.target.x0)*this._timeLength}_setTime(t){const i=Math.min(this._endTime,this._startTime),e=Math.max(this._endTime,this._startTime);if(t<i||t>e)throw Error(`Time value out of range: [${i}, ${e}]`);const a=this._getScaleXByTime(t),s=this._zoomedScale(a),r=this._changeHandlePos(this._zoomedScale,this._handle,s,this.transition);return this._forceTrans=!0,this._zoom.translateTo(this.svg,a/this._timeLength*this._width,0),this._forceTrans=!1,r}_changeHandlePos(t,i,e,a){let s=t.invert(e);s<0&&(s=0),s>this._timeLength&&(s=this._timeLength),e<15&&(e=15),e>this._width-15&&(e=this._width-15),d(i,a).attr("transform",`translate(${e}, ${this._margin.top}), scale(${this._heightScale})`),this._scaleVal=s;const r=s*this._width/this._timeLength,o=this.root.find(t=>t.visible&&t.x0<=r&&t.x1>=r),n=+(o.data.start-(o.data.start-o.data.end)*(r-o.x0)/(o.x1-o.x0)).toFixed(6);return n!==this._time&&(this._time=n,this._dispatchFunc(this._onChange)),!0}}const _={height:400,fontSize:12,fontFamily:"sans-serif",margin:{top:0,right:0,bottom:0,left:0},padding:{top:0,right:0,bottom:0,left:0},transition:450,intervalSum:t=>t.leaf?t.start-t.end:0,simplify:!1,neighborWidth:100,tickLength:15,unit:""};class g{constructor(a,s,r={}){this.font=void 0,this.svg=void 0,this.height=void 0,this.width=void 0,this._handleX=void 0,this.intervals=void 0,this.hierarchicalData=void 0,this.root=void 0,this.options=void 0,this._onChange=void 0,this._onDrag=void 0,this._ready=void 0,this._cellGroup=void 0,this._cell=void 0,this._rect=void 0,this._text=void 0,this._handle=void 0,this.transition=void 0,this._simplify=void 0,this._focus=void 0,this._sequence=void 0,this._neighborWidth=void 0,this._tickLength=void 0,this._ticksGroup=void 0,this._clicked=(t,i,e=!1)=>{var a;const s=i===this._focus&&null!=(a=null==i?void 0:i.parent)?a:i;this._focus=s;const r=s.ancestors().slice(1),o=this._ready?this.transition:0,n=s.data.start===this.root.data.start?0:this._neighborWidth,l=this.options.width-(s.data.end===this.root.data.end?0:this._neighborWidth)-n,c=s.x1-s.x0;var _,g;this.root.each(t=>{t.target={x0:n+(t.x0-s.x0)/c*l,x1:n+(t.x1-s.x0)/c*l,y0:t.y0,y1:t.y1},this._simplify&&(t.visible=[s.depth,s.depth+1].includes(t.depth)||!s.children&&t.depth===s.depth-1)}),d(this._rect,o).attr("x",t=>t.target.x0).attr("width",t=>t.target.x1-t.target.x0).attr("height",t=>t.visible?t.y1-t.y0:0).attr("stroke","white").attr("stroke-width",1),d(this._text,o).attr("fill-opacity",t=>r.includes(t)?1:+(t.target.x1-t.target.x0>14)).attr("x",t=>{if(r.includes(t))return s.target.x0+(s.target.x1-s.target.x0)/2;const i=t.target.x0+(t.target.x1-t.target.x0)/2;return Number.isNaN(i)?0:i}).attr("y",t=>(t.y1-t.y0)/2).attr("opacity",t=>t.visible?1:0).attr("font-size",t=>t.id===s.id?this.options.fontSize+6:this.options.fontSize).attr("font-weight",t=>t.id===s.id?"bold":500).text(t=>{const i=Math.abs(t.target.x1-t.target.x0),e=h(t.data.name,this.font),a=t.data.abbr||t.data.name.charAt(0);return i-8<e?a:t.data.name}),this._ticksGroup.call(t=>this._addTicks(t,this._makeTicksData(s))),this._simplify&&(d(this._cell,o).style("opacity",t=>t.visible?1:0),d(this._cellGroup,o).attr("transform",`translate(0, ${this._focus.children?-this._focus.target.y0:-(null!=(_=null==(g=this._focus.parent)?void 0:g.y0)?_:0)})`));const m=s.ancestors().reverse();return this._sequence=m,e||(this._changeHandlePos(this._handle,s.target.x0,this.height,o),this._dispatchFunc(this._onChange)),!0};const o=t(a);if(!o.node())throw Error("Invalid selecor!");if(null==s||!s.length)throw Error("Empty intervals !");const l=+o.style("width").split("px")[0],c=n({},_,{margin:n({},_.margin,r.margin),padding:n({},_.padding,r.padding),width:isNaN(l)?1e3:l},r),{width:g,height:m,intervalSum:p,onChange:x,onDrag:v,transition:u,simplify:f,neighborWidth:y,tickLength:w}=c;this.transition=u,this._onChange=x,this._onDrag=v,this.font=`${c.fontSize}px ${c.fontFamily}`,this.intervals=s,this._simplify=f,this._neighborWidth=y,this._tickLength=w,this.options=c,this.hierarchicalData=i()(s).sum(p).sort((t,i)=>i.data.start-t.data.start),this.root=e().size([g,(m-c.margin.bottom-c.margin.top)*(f?(this.hierarchicalData.height+1)/2:1)]).padding(0)(this.hierarchicalData),this.root.each(t=>{t.target={x0:t.x0,x1:t.x1},t.visible=!0}),this._sequence=[this.root],this.svg=o.append("svg").attr("viewBox",[0,0,g,m]).style("font",this.font),this.height=m,this.width=g,this._handleX=0,this._ready=!1,this._init()}get stage(){return this._focus.data.name}set stage(t){const i=this.root.find(i=>i.data.name===t);i&&this._clicked(void 0,i,!0)}set time(t){let i;console.log("set time",t);let e=0;if(this.root.each(a=>{a.data.start>=t&&a.data.end<t&&(!i||a.depth>e)&&(i=a.parent,e=a.depth)}),i){const e=this.getXByTime(t,i);this._changeHandlePos(this._handle,e,this.height),e>this.width&&this._clicked(void 0,i.parent,!0)}}get sequence(){return this._sequence}get ready(){return this._ready}_init(){const t=this,i=t.svg;t._cellGroup=i.append("g").attr("id","cells"),t._cell=t._cellGroup.selectAll("g").data(t.root.descendants()).join("g").attr("transform",t=>`translate(0, ${t.y0})`),t._rect=t._drawRect(t._cell).on("click",t._clicked),t._addTitle(t._cell),t._text=t._drawText(t._cell),t._ticksGroup=i.append("g").attr("id","ticks"),t._handle=t._drawHandle(i,t.height),t._handle.call(s().on("drag",function(i){t._handleX=i.x,t._changeHandlePos(t._handle,i.x,t.height),t._handle.attr("cursor","grabbing")}).on("end",()=>{const i=this.getTimeByX(t._handleX,t.height);t._handle.attr("cursor","grab"),console.log("time",i),t._onDrag&&t._onDrag(i)})),t._cellGroup.call(r().on("zoom",function(i){const e=i.sourceEvent;if("wheel"===e.type)if(e.wheelDelta<0)t._clicked(void 0,t._focus);else{var a,s;const{offsetX:i}=e,r=e.offsetY+(t._simplify&&null!=(a=null==(s=t._focus)?void 0:s.y0)?a:0),o=t.root.find(t=>t.target.x0<=i&&t.target.x1>i&&t.target.y0<=r&&t.target.y1>r);o&&(t._focus=null,t._clicked(void 0,o))}}).on("end",()=>{t._rect.attr("cursor","pointer")})),t._clicked(void 0,t.root),i.on("pointerleave",()=>{this._cell.attr("fill-opacity",1)}),this._ready=!0}_dispatchFunc(t){t&&this._ready&&t(this._focus)}_addTitle(t){return t.append("title").text(t=>`${t.ancestors().map(t=>t.data.name).reverse().join(" > ")}`)}_drawRect(t){return t.append("rect").attr("fill",t=>t.data.color).attr("stroke","white").attr("stroke-width",.5).attr("cursor","pointer").on("pointerenter",(i,e)=>{const a=e.ancestors().reverse();t.attr("fill-opacity",t=>a.includes(t)?1:.5)})}_drawHandle(t,i){const e=t.append("g").attr("cursor","grab").attr("id","handle"),a=i;return e.append("rect").attr("x",0).attr("y",a-20-1).attr("width",1).attr("height",20).attr("fill","black").attr("id","handleCursor"),e.append("text").attr("x",0).attr("y",a-20-3).attr("text-anchor","middle").text("4000ma").clone(!0).lower().attr("stroke-linejoin","round").attr("stroke-width",2).attr("stroke","white").attr("id","handleText"),e}_drawText(t){return t.append("text").style("user-select","none").attr("pointer-events","none").attr("fill",t=>{var i;return null!=(i=t.data.textColor)?i:"black"}).attr("opacity",.8).attr("text-anchor","middle").attr("dominant-baseline","middle")}_makeTicksData(t){var i,e;const a=this.root.descendants().map(i=>{var e;let a=i.visible;const s=!t.children&&i.depth===t.depth;var r;if(a)if(!s&&null!=(r=i.parent)&&r.visible&&i.data.start===i.parent.data.start)a=!1;else{var o;a=i.target.x1-i.target.x0>=h(i.data.start+this.options.unit,this.font)*(1-.05*(null!=(o=i.data.level)?o:0))}return{x:i.x0,y:i.y0-(this._simplify?s?t.parent.y0:t.y0:0),depth:i.depth,targetX:(null==i||null==(e=i.target)?void 0:e.x0)||0,text:i.data.start+this.options.unit,visible:a}}),s={x:this.root.x1,y:0,depth:0,targetX:(null==(i=this.root)||null==(e=i.target)?void 0:e.x1)||this.options.width,text:"0",visible:!0};return a.push(s),a}_updateTicks(t){return t.attr("opacity",t=>t.visible?1:0).attr("display",t=>t.visible?"block":"none").attr("transform",t=>`translate(${t.targetX}, ${t.y})`).attr("dominant-baseline","hanging").attr("text-anchor",t=>0===t.targetX?"start":t.targetX>=this.root.target.x1?"end":"middle")}_addTicks(t,i){t.selectAll("g").data(i).join(t=>{const i=t.append("g");this._updateTicks(i),i.append("line").attr("stroke","#555").attr("stroke-width",1).attr("x1",0).attr("y1",0).attr("x2",0).attr("y2",this._tickLength),i.append("text").attr("x",0).attr("y",this._tickLength+this.options.fontSize/2).attr("font-size",t=>1-.05*t.depth+"em").text(t=>t.text).clone(!0).lower().attr("stroke-linejoin","round").attr("stroke-width",2).attr("stroke","white")},t=>this._updateTicks(d(t,this.transition)))}_changeHandlePos(t,i,e,a){d(t,a).attr("transform",`translate(${i}, 0), scale(1)`);const s=this.getTimeByX(i,e);return s>0&&t.selectAll("text").text(`${s}ma`),!0}getTimeByX(t,i){const e=i-10,a=this.root.find(i=>i.target.x0<=t&&i.target.x1>t&&i.target.y0<=e&&i.target.y1>e);if(!a)return 0;const{start:s,end:r}=a.data;return Math.ceil(s-(s-r)/(a.target.x1-a.target.x0)*(t-a.target.x0))}getXByTime(t,i){if(!i)return 0;const{start:e,end:a}=i.data;return i.target.x0+(e-t)/(e-a)*(i.target.x1-i.target.x0)}}export{c as GeoTimeLine,g as GeoTimeScale};
//# sourceMappingURL=index.modern.js.map
