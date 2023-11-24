import{scaleLinear as t,drag as i,zoom as e,pointer as a,select as r,stratify as n,partition as o}from"d3";function s(t,i){for(var e=0;e<i.length;e++){var a=i[e];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}function h(t,i,e){return i&&s(t.prototype,i),e&&s(t,e),Object.defineProperty(t,"prototype",{writable:!1}),t}function d(){return d=Object.assign?Object.assign.bind():function(t){for(var i=1;i<arguments.length;i++){var e=arguments[i];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a])}return t},d.apply(this,arguments)}function l(t,i){var e=(l.canvas||(l.canvas=document.createElement("canvas"))).getContext("2d");return e.font=i,e.measureText(t).width}function c(t,i){return i?t.transition().duration(i):t}var u={height:70,fontSize:16,fontFamily:"sans-serif",margin:{top:0,right:0,bottom:0,left:0},padding:{top:0,right:0,bottom:0,left:0},time:0,transition:450,intervalSum:function(t){return t.leaf?1:0},maxZoom:10,showTick:!0},_=/*#__PURE__*/function(){function s(t,i,e){var a;void 0===e&&(e={}),this.font=void 0,this.maxLevel=void 0,this.svg=void 0,this.intervals=void 0,this.hierarchicalData=void 0,this.root=void 0,this.options=void 0,this._width=void 0,this._height=void 0,this._time=void 0,this._timeLength=void 0,this._scaleRadio=void 0,this._scaleVal=void 0,this._level=void 0,this._startTime=void 0,this._endTime=void 0,this._handle=void 0,this._zoomedScale=void 0,this._onChange=void 0,this._onAfterChange=void 0,this._ready=void 0,this._xAxis=void 0,this._cellGroup=void 0,this._heightScale=void 0,this._zoomWidth=void 0,this._minZoom=void 0,this._maxZoom=void 0,this._zoomHeight=void 0,this._zoom=void 0,this._interval=void 0,this._cell=void 0,this._rect=void 0,this._text=void 0,this._ticks=void 0,this._margin=void 0,this._padding=void 0,this._showTick=void 0,this.transition=void 0,this._forceTrans=void 0;var s=r(t);if(!s.node())throw Error("Invalid selecor!");if(null==i||!i.length)throw Error("Empty intervals!");var h=+s.style("width").split("px")[0],l=d({},u,{margin:d({},u.margin,e.margin),padding:d({},u.padding,e.padding),width:isNaN(h)?1e3:h},e),c=l.width,_=l.height,g=l.margin,f=l.padding,v=l.intervalSum,m=l.onChange,p=l.onAfterChange,x=l.time,y=l.transition,k=l.showTick;this._width=c,this._height=_,this._margin=g,this._padding=f,this._heightScale=_/u.height,this._zoomWidth=c-g.left-g.right,this._zoomHeight=_-g.top-g.bottom,this.transition=y,this._onChange=m,this._onAfterChange=p,this._time=x,this.font=l.fontSize+"px "+l.fontFamily,this._minZoom=l.minZoom=null!=(a=l.minZoom)?a:this._zoomWidth/(this._zoomWidth+f.right+f.left),this._maxZoom=l.maxZoom,this._showTick=k,this.intervals=i,this.options=l,this.hierarchicalData=n()(i).sum(v).sort(function(t,i){return i.data.start-t.data.start}),this.maxLevel=this.hierarchicalData.height,this.root=o().size([c,(_-l.margin.bottom)*this.maxLevel]).padding(0)(this.hierarchicalData),this.root.each(function(t){t.target={x0:t.x0,x1:t.x1},t.visible=1===t.data.level}),this._startTime=this.root.data.start,this._endTime=this.root.data.end,this._timeLength=Math.abs(this._startTime-this._endTime),this._scaleRadio=this._width/(this.root.x1-this.root.x0),this._scaleVal=this._getScaleXByTime(x),this.svg=s.append("svg").attr("viewBox",[0,0,c,_]).style("font",this.font).style("overflow","hidden"),this._ready=!1,this._init()}var _=s.prototype;return _._init=function(){var r=this,n=r.options,o=n.width,s=n.height,h=n.margin,d=n.padding,l=r.svg;r._cellGroup=l.append("g").attr("id","cells").attr("transform","translate(0, "+h.top+")"),r._cell=r._cellGroup.selectAll("g").data(r.root.descendants()).join("g"),r._rect=r._drawRect(r._cell),r._xAxis=t().domain([r._endTime,r._startTime]).range([h.left-d.left,o-h.right+d.right]),r._zoomedScale=r._xAxis.copy(),r._showTick&&(r._text=r._drawText(r._cell),r._ticks=r._addTicks(r._cell)),r._handle=r._drawHandle(l),r._handle.call(i().on("drag",function(t){r._changeHandlePos(r._zoomedScale,r._handle,r._zoomedScale(r._scaleVal)+t.dx),r._handle.attr("cursor","grabbing")}).on("end",function(){r._handle.attr("cursor","grab"),clearInterval(r._interval),r._dispatchFunc(r._onAfterChange)}));var c=[[h.left,h.top],[o-h.right,s-h.top]],u=[r._minZoom,r._maxZoom],_=[[r.root.x0,0],[r.root.x1,0]];r._zoom=e().extent(c).scaleExtent(u).translateExtent(_).on("zoom",function(t){var i=t.transform;i.k===r._level&&r._cellGroup.attr("cursor","grabbing"),r._transform(i)}).on("end",function(){r._cellGroup.attr("cursor","default")}),l.call(r._zoom),l.call(r._zoom.scaleBy,r._scaleRadio).on("click",function(t){var i=a(t)[0];r._changeHandlePos(r._zoomedScale,r._handle,i),r._dispatchFunc(r._onAfterChange)}),this._ready=!0},_._dispatchFunc=function(t){t&&this._ready&&t(this._time,this._level)},_._drawHandle=function(t){var i=t.append("g").attr("cursor","grab");function e(t){i.append("rect").attr("fill","#515151").attr("width",3).attr("height",16).attr("x",t).attr("y",21)}return i.append("path").attr("fill","#ccc").attr("fill-opacity",.85).attr("stroke","#333").attr("stroke-width","1px").attr("d","M0 0 l 15 20 v 18 q 0 5 -5 5 h -20 q -5 0 -5 -5 v -18 l 15 -20"),e(-7.5),e(-1.5),e(4.5),i},_._drawRect=function(t){return t.append("rect").attr("height",this._zoomHeight).attr("fill",function(t){return t.data.color})},_._drawText=function(t){return t.append("text").style("user-select","none").attr("pointer-events","none").attr("y",this._zoomHeight/2).attr("fill",function(t){var i;return null!=(i=t.data.textColor)?i:"black"}).attr("opacity",.8).attr("text-anchor","middle").attr("dominant-baseline","middle")},_._addTicks=function(t){var i=this,e=t.append("g").attr("id","tick"),a=.8*(this._zoomHeight-this.options.fontSize);return e.append("line").attr("stroke","#555").attr("stroke-width",1).attr("x1",0).attr("y1",0).attr("x2",0).attr("y2",a),e.append("text").attr("x",0).attr("y",a+this.options.fontSize).attr("font-size",function(t){return 1-.05*t.data.level+"em"}).text(function(t){return t.data.start+"ma"}).attr("text-anchor",function(t){return t.data.start===i._startTime?"start":"middle"}).clone(!0).lower().attr("stroke-linejoin","round").attr("stroke-width",1).attr("stroke","white"),e},_._transform=function(t){var i=this,e=t.x,a=+t.k.toFixed(6),r=this._ready&&(this._level!==a&&a>this._minZoom&&a<this._maxZoom||this._forceTrans)?this.transition:0;if(this._level!==a){var n=a*this._scaleRadio;this.root.each(function(t){var i,e;t.target={x0:t.x0*n,x1:t.x1*n};var r=null!=(i=t.data.level)?i:0;t.visible=r===~~a||0===(null!=(e=t.children)?e:[]).length&&r<a}),c(this._rect,r).attr("width",function(t){return t.target.x1-t.target.x0}).attr("x",function(t){return t.target.x0}),this._showTick&&(c(this._text,r).attr("fill-opacity",function(t){return t.target.x1-t.target.x0>14?1:0}).attr("x",function(t){var i=t.target.x0+(t.target.x1-t.target.x0)/2;return Number.isNaN(i)?0:i}).text(function(t){var e=Math.abs(t.target.x1-t.target.x0),a=l(t.data.name,i.font),r=t.data.abbr||t.data.name.charAt(0);return e-10<a?r:t.data.name}),c(this._ticks,r).attr("transform",function(t){return"translate("+t.target.x0+", 0)"}).attr("opacity",function(t){var e=t.data.start+"ma";return Math.abs(t.target.x1-t.target.x0)<l(e,i.font)*(1-.05*t.data.level)?0:1})),c(this._cell,r).style("opacity",function(t){return t.visible?1:0}),this._level=a,this._dispatchFunc(this._onChange),this._dispatchFunc(this._onAfterChange)}return c(this._cellGroup,r).attr("transform","translate("+e+", "+this._margin.top+")"),this._zoomedScale=t.rescaleX(this._xAxis),this._changeHandlePos(this._zoomedScale,this._handle,this._zoomedScale(this._scaleVal),r),!0},_._getScaleXByTime=function(t){var i=this.root.find(function(i){return i.visible&&i.data.start>=t&&i.data.end<=t});return(i.target.x0+(i.target.x1-i.target.x0)*(i.data.start-t)/(i.data.start-i.data.end))/(this.root.target.x1-this.root.target.x0)*this._timeLength},_._setTime=function(t){var i=Math.min(this._endTime,this._startTime),e=Math.max(this._endTime,this._startTime);if(t<i||t>e)throw Error("Time value out of range: ["+i+", "+e+"]");var a=this._getScaleXByTime(t),r=this._zoomedScale(a),n=this._changeHandlePos(this._zoomedScale,this._handle,r,this.transition);return this._forceTrans=!0,this._zoom.translateTo(this.svg,a/this._timeLength*this._width,0),this._forceTrans=!1,n},_._changeHandlePos=function(t,i,e,a){var r=t.invert(e);r<0&&(r=0),r>this._timeLength&&(r=this._timeLength),c(i,a).attr("transform","translate("+e+", "+this._margin.top+"), scale("+this._heightScale+")"),this._scaleVal=r;var n=r*this._width/this._timeLength,o=this.root.find(function(t){return t.visible&&t.x0<=n&&t.x1>=n}),s=+(o.data.start-(o.data.start-o.data.end)*(n-o.x0)/(o.x1-o.x0)).toFixed(6);return s!==this._time&&(this._time=s,this._dispatchFunc(this._onChange)),!0},h(s,[{key:"time",get:function(){return this._time},set:function(t){this._setTime(t)&&(this._time=+t)}},{key:"level",get:function(){return this._level},set:function(t){var i=+t;t<this._minZoom&&(i=this._minZoom),t>this._maxZoom&&(i=this._maxZoom),this._zoom.scaleTo(this.svg,i,[this._zoomedScale(this._scaleVal),0])}},{key:"ready",get:function(){return this._ready}}]),s}(),g={height:400,fontSize:12,fontFamily:"sans-serif",margin:{top:0,right:0,bottom:0,left:0},padding:{top:0,right:0,bottom:0,left:0},transition:450,intervalSum:function(t){return t.leaf?t.start-t.end:0},simplify:!1,neighborWidth:100,tickLength:15,unit:""},f=/*#__PURE__*/function(){function t(t,i,e){var a=this;void 0===e&&(e={}),this.font=void 0,this.svg=void 0,this.height=void 0,this.width=void 0,this._handleX=void 0,this.intervals=void 0,this.hierarchicalData=void 0,this.root=void 0,this.options=void 0,this._onChange=void 0,this._onDrag=void 0,this._ready=void 0,this._cellGroup=void 0,this._cell=void 0,this._rect=void 0,this._text=void 0,this._handle=void 0,this.transition=void 0,this._simplify=void 0,this._focus=void 0,this._sequence=void 0,this._neighborWidth=void 0,this._tickLength=void 0,this._ticksGroup=void 0,this._clicked=function(t,i,e){var r;void 0===e&&(e=!1);var n=i===a._focus&&null!=(r=null==i?void 0:i.parent)?r:i;a._focus=n;var o,s,h=n.ancestors().slice(1),d=a._ready?a.transition:0,u=n.data.start===a.root.data.start?0:a._neighborWidth,_=a.options.width-(n.data.end===a.root.data.end?0:a._neighborWidth)-u,g=n.x1-n.x0;a.root.each(function(t){t.target={x0:u+(t.x0-n.x0)/g*_,x1:u+(t.x1-n.x0)/g*_,y0:t.y0,y1:t.y1},a._simplify&&(t.visible=[n.depth,n.depth+1].includes(t.depth)||!n.children&&t.depth===n.depth-1)}),c(a._rect,d).attr("x",function(t){return t.target.x0}).attr("width",function(t){return t.target.x1-t.target.x0}).attr("height",function(t){return t.visible?t.y1-t.y0:0}).attr("stroke","white").attr("stroke-width",1),c(a._text,d).attr("fill-opacity",function(t){return h.includes(t)?1:+(t.target.x1-t.target.x0>14)}).attr("x",function(t){if(h.includes(t))return n.target.x0+(n.target.x1-n.target.x0)/2;var i=t.target.x0+(t.target.x1-t.target.x0)/2;return Number.isNaN(i)?0:i}).attr("y",function(t){return(t.y1-t.y0)/2}).attr("opacity",function(t){return t.visible?1:0}).attr("font-size",function(t){return t.id===n.id?a.options.fontSize+6:a.options.fontSize}).attr("font-weight",function(t){return t.id===n.id?"bold":500}).text(function(t){var i=Math.abs(t.target.x1-t.target.x0),e=l(t.data.name,a.font),r=t.data.abbr||t.data.name.charAt(0);return i-8<e?r:t.data.name}),a._ticksGroup.call(function(t){return a._addTicks(t,a._makeTicksData(n))}),a._simplify&&(c(a._cell,d).style("opacity",function(t){return t.visible?1:0}),c(a._cellGroup,d).attr("transform","translate(0, "+(a._focus.children?-a._focus.target.y0:-(null!=(o=null==(s=a._focus.parent)?void 0:s.y0)?o:0))+")"));var f=n.ancestors().reverse();return a._sequence=f,e||(a._changeHandlePos(a._handle,n.target.x0,a.height,d),a._dispatchFunc(a._onChange)),!0};var s=r(t);if(!s.node())throw Error("Invalid selecor!");if(null==i||!i.length)throw Error("Empty intervals !");var h=+s.style("width").split("px")[0],u=d({},g,{margin:d({},g.margin,e.margin),padding:d({},g.padding,e.padding),width:isNaN(h)?1e3:h},e),_=u.width,f=u.height,v=u.intervalSum,m=u.onChange,p=u.onDrag,x=u.simplify,y=u.neighborWidth,k=u.tickLength;this.transition=u.transition,this._onChange=m,this._onDrag=p,this.font=u.fontSize+"px "+u.fontFamily,this.intervals=i,this._simplify=x,this._neighborWidth=y,this._tickLength=k,this.options=u,this.hierarchicalData=n()(i).sum(v).sort(function(t,i){return i.data.start-t.data.start}),this.root=o().size([_,(f-u.margin.bottom-u.margin.top)*(x?(this.hierarchicalData.height+1)/2:1)]).padding(0)(this.hierarchicalData),this.root.each(function(t){t.target={x0:t.x0,x1:t.x1},t.visible=!0}),this._sequence=[this.root],this.svg=s.append("svg").attr("viewBox",[0,0,_,f]).style("font",this.font),this.height=f,this.width=_,this._handleX=0,this._ready=!1,this._init()}var a=t.prototype;return a._init=function(){var t=this,a=this,r=a.svg;a._cellGroup=r.append("g").attr("id","cells"),a._cell=a._cellGroup.selectAll("g").data(a.root.descendants()).join("g").attr("transform",function(t){return"translate(0, "+t.y0+")"}),a._rect=a._drawRect(a._cell).on("click",a._clicked),a._addTitle(a._cell),a._text=a._drawText(a._cell),a._ticksGroup=r.append("g").attr("id","ticks"),a._handle=a._drawHandle(r,a.height),a._handle.call(i().on("drag",function(t){a._handleX=t.x,a._changeHandlePos(a._handle,t.x,a.height),a._handle.attr("cursor","grabbing")}).on("end",function(){var i=t.getTimeByX(a._handleX,a.height);a._handle.attr("cursor","grab"),console.log("time",i),a._onDrag&&a._onDrag(i)})),a._cellGroup.call(e().on("zoom",function(t){var i=t.sourceEvent;if("wheel"===i.type)if(i.wheelDelta<0)a._clicked(void 0,a._focus);else{var e,r,n=i.offsetX,o=i.offsetY+(a._simplify&&null!=(e=null==(r=a._focus)?void 0:r.y0)?e:0),s=a.root.find(function(t){return t.target.x0<=n&&t.target.x1>n&&t.target.y0<=o&&t.target.y1>o});s&&(a._focus=null,a._clicked(void 0,s))}}).on("end",function(){a._rect.attr("cursor","pointer")})),a._clicked(void 0,a.root),r.on("pointerleave",function(){t._cell.attr("fill-opacity",1)}),this._ready=!0},a._dispatchFunc=function(t){t&&this._ready&&t(this._focus)},a._addTitle=function(t){return t.append("title").text(function(t){return""+t.ancestors().map(function(t){return t.data.name}).reverse().join(" > ")})},a._drawRect=function(t){return t.append("rect").attr("fill",function(t){return t.data.color}).attr("stroke","white").attr("stroke-width",.5).attr("cursor","pointer").on("pointerenter",function(i,e){var a=e.ancestors().reverse();t.attr("fill-opacity",function(t){return a.includes(t)?1:.5})})},a._drawHandle=function(t,i){var e=t.append("g").attr("cursor","grab").attr("id","handle"),a=i;return e.append("rect").attr("x",0).attr("y",a-20-1).attr("width",1).attr("height",20).attr("fill","black").attr("id","handleCursor"),e.append("text").attr("x",0).attr("y",a-20-3).attr("text-anchor","middle").text("4000ma").clone(!0).lower().attr("stroke-linejoin","round").attr("stroke-width",2).attr("stroke","white").attr("id","handleText"),e},a._drawText=function(t){return t.append("text").style("user-select","none").attr("pointer-events","none").attr("fill",function(t){var i;return null!=(i=t.data.textColor)?i:"black"}).attr("opacity",.8).attr("text-anchor","middle").attr("dominant-baseline","middle")},a._makeTicksData=function(t){var i,e,a=this,r=this.root.descendants().map(function(i){var e,r,n,o=i.visible,s=!t.children&&i.depth===t.depth;return o&&(o=!(!s&&null!=(r=i.parent)&&r.visible&&i.data.start===i.parent.data.start)&&i.target.x1-i.target.x0>=l(i.data.start+a.options.unit,a.font)*(1-.05*(null!=(n=i.data.level)?n:0))),{x:i.x0,y:i.y0-(a._simplify?s?t.parent.y0:t.y0:0),depth:i.depth,targetX:(null==i||null==(e=i.target)?void 0:e.x0)||0,text:i.data.start+a.options.unit,visible:o}}),n={x:this.root.x1,y:0,depth:0,targetX:(null==(i=this.root)||null==(e=i.target)?void 0:e.x1)||this.options.width,text:"0",visible:!0};return r.push(n),r},a._updateTicks=function(t){var i=this;return t.attr("opacity",function(t){return t.visible?1:0}).attr("display",function(t){return t.visible?"block":"none"}).attr("transform",function(t){return"translate("+t.targetX+", "+t.y+")"}).attr("dominant-baseline","hanging").attr("text-anchor",function(t){return 0===t.targetX?"start":t.targetX>=i.root.target.x1?"end":"middle"})},a._addTicks=function(t,i){var e=this;t.selectAll("g").data(i).join(function(t){var i=t.append("g");e._updateTicks(i),i.append("line").attr("stroke","#555").attr("stroke-width",1).attr("x1",0).attr("y1",0).attr("x2",0).attr("y2",e._tickLength),i.append("text").attr("x",0).attr("y",e._tickLength+e.options.fontSize/2).attr("font-size",function(t){return 1-.05*t.depth+"em"}).text(function(t){return t.text}).clone(!0).lower().attr("stroke-linejoin","round").attr("stroke-width",2).attr("stroke","white")},function(t){return e._updateTicks(c(t,e.transition))})},a._changeHandlePos=function(t,i,e,a){c(t,a).attr("transform","translate("+i+", 0), scale(1)");var r=this.getTimeByX(i,e);return r>0&&t.selectAll("text").text(r+"ma"),!0},a.getTimeByX=function(t,i){var e=i-10,a=this.root.find(function(i){return i.target.x0<=t&&i.target.x1>t&&i.target.y0<=e&&i.target.y1>e});if(!a)return 0;var r=a.data,n=r.start;return Math.ceil(n-(n-r.end)/(a.target.x1-a.target.x0)*(t-a.target.x0))},a.getXByTime=function(t,i){if(!i)return 0;var e=i.data,a=e.start;return i.target.x0+(a-t)/(a-e.end)*(i.target.x1-i.target.x0)},h(t,[{key:"stage",get:function(){return this._focus.data.name},set:function(t){var i=this.root.find(function(i){return i.data.name===t});i&&this._clicked(void 0,i,!0)}},{key:"time",set:function(t){var i;console.log("set time",t);var e=0;if(this.root.each(function(a){a.data.start>=t&&a.data.end<t&&(!i||a.depth>e)&&(i=a.parent,e=a.depth)}),i){var a=this.getXByTime(t,i);this._changeHandlePos(this._handle,a,this.height),a>this.width&&this._clicked(void 0,i.parent,!0)}}},{key:"sequence",get:function(){return this._sequence}},{key:"ready",get:function(){return this._ready}}]),t}();export{_ as GeoTimeLine,f as GeoTimeScale};
//# sourceMappingURL=index.module.js.map
