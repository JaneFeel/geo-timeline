var t=require("d3");function i(t,i){for(var e=0;e<i.length;e++){var a=i[e];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}function e(t,e,a){return e&&i(t.prototype,e),a&&i(t,a),Object.defineProperty(t,"prototype",{writable:!1}),t}function a(){return a=Object.assign?Object.assign.bind():function(t){for(var i=1;i<arguments.length;i++){var e=arguments[i];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a])}return t},a.apply(this,arguments)}function r(t,i){var e=(r.canvas||(r.canvas=document.createElement("canvas"))).getContext("2d");return e.font=i,e.measureText(t).width}function n(t,i){return i?t.transition().duration(i):t}var o={height:70,fontSize:16,fontFamily:"sans-serif",margin:{top:0,right:0,bottom:0,left:0},padding:{top:0,right:0,bottom:0,left:0},time:0,transition:450,intervalSum:function(t){return t.leaf?1:0},maxZoom:10},s=/*#__PURE__*/function(){function i(i,e,r){var n;void 0===r&&(r={}),this.font=void 0,this.maxLevel=void 0,this.svg=void 0,this.intervals=void 0,this.hierarchicalData=void 0,this.root=void 0,this.options=void 0,this._width=void 0,this._height=void 0,this._time=void 0,this._timeLength=void 0,this._scaleRadio=void 0,this._scaleVal=void 0,this._level=void 0,this._startTime=void 0,this._endTime=void 0,this._handle=void 0,this._zoomedScale=void 0,this._onChange=void 0,this._onAfterChange=void 0,this._ready=void 0,this._xAxis=void 0,this._cellGroup=void 0,this._heightScale=void 0,this._zoomWidth=void 0,this._minZoom=void 0,this._maxZoom=void 0,this._zoomHeight=void 0,this._zoom=void 0,this._interval=void 0,this._cell=void 0,this._rect=void 0,this._text=void 0,this._ticks=void 0,this._margin=void 0,this._padding=void 0,this.transition=void 0,this._forceTrans=void 0;var s=t.select(i);if(!s.node())throw Error("Invalid selecor!");if(null==e||!e.length)throw Error("Empty intervals!");var h=+s.style("width").split("px")[0],d=a({},o,{margin:a({},o.margin,r.margin),padding:a({},o.padding,r.padding),width:isNaN(h)?1e3:h},r),l=d.width,c=d.height,u=d.margin,_=d.padding,g=d.intervalSum,f=d.onChange,v=d.onAfterChange,m=d.time,p=d.transition;this._width=l,this._height=c,this._margin=u,this._padding=_,this._heightScale=c/o.height,this._zoomWidth=l-u.left-u.right,this._zoomHeight=c-u.top-u.bottom,this.transition=p,this._onChange=f,this._onAfterChange=v,this._time=m,this.font=d.fontSize+"px "+d.fontFamily,this._minZoom=d.minZoom=null!=(n=d.minZoom)?n:this._zoomWidth/(this._zoomWidth+_.right+_.left),this._maxZoom=d.maxZoom,this.intervals=e,this.options=d,this.hierarchicalData=t.stratify()(e).sum(g).sort(function(t,i){return i.data.start-t.data.start}),this.maxLevel=this.hierarchicalData.height,this.root=t.partition().size([l,(c-d.margin.bottom)*this.maxLevel]).padding(0)(this.hierarchicalData),this.root.each(function(t){t.target={x0:t.x0,x1:t.x1},t.visible=1===t.data.level}),this._startTime=this.root.data.start,this._endTime=this.root.data.end,this._timeLength=Math.abs(this._startTime-this._endTime),this._scaleRadio=this._width/(this.root.x1-this.root.x0),this._scaleVal=this._getScaleXByTime(m),this.svg=s.append("svg").attr("viewBox",[0,0,l,c]).style("font",this.font).style("overflow","hidden"),this._ready=!1,this._init()}var s=i.prototype;return s._init=function(){var i=this,e=i.options,a=e.width,r=e.height,n=e.margin,o=e.padding,s=i.svg;i._cellGroup=s.append("g").attr("id","cells").attr("transform","translate(0, "+n.top+")"),i._cell=i._cellGroup.selectAll("g").data(i.root.descendants()).join("g"),i._rect=i._drawRect(i._cell),i._xAxis=t.scaleLinear().domain([i._endTime,i._startTime]).range([n.left-o.left,a-n.right+o.right]),i._zoomedScale=i._xAxis.copy(),i._text=i._drawText(i._cell),i._ticks=i._addTicks(i._cell),i._handle=i._drawHandle(s),i._handle.call(t.drag().on("drag",function(t){i._changeHandlePos(i._zoomedScale,i._handle,i._zoomedScale(i._scaleVal)+t.dx),i._handle.attr("cursor","grabbing")}).on("end",function(){i._handle.attr("cursor","grab"),clearInterval(i._interval),i._dispatchFunc(i._onAfterChange)}));var h=[[n.left,n.top],[a-n.right,r-n.top]],d=[i._minZoom,i._maxZoom],l=[[i.root.x0,0],[i.root.x1,0]];i._zoom=t.zoom().extent(h).scaleExtent(d).translateExtent(l).on("zoom",function(t){var e=t.transform;e.k===i._level&&i._cellGroup.attr("cursor","grabbing"),i._transform(e)}).on("end",function(){i._cellGroup.attr("cursor","default")}),s.call(i._zoom),s.call(i._zoom.scaleBy,i._scaleRadio).on("click",function(e){var a=t.pointer(e)[0];i._changeHandlePos(i._zoomedScale,i._handle,a),i._dispatchFunc(i._onAfterChange)}),this._ready=!0},s._dispatchFunc=function(t){t&&this._ready&&t(this._time,this._level)},s._drawHandle=function(t){var i=t.append("g").attr("cursor","grab");function e(t){i.append("rect").attr("fill","#515151").attr("width",3).attr("height",16).attr("x",t).attr("y",21)}return i.append("path").attr("fill","#ccc").attr("fill-opacity",.85).attr("stroke","#333").attr("stroke-width","1px").attr("d","M0 0 l 15 20 v 18 q 0 5 -5 5 h -20 q -5 0 -5 -5 v -18 l 15 -20"),e(-7.5),e(-1.5),e(4.5),i},s._drawRect=function(t){return t.append("rect").attr("height",this._zoomHeight).attr("fill",function(t){return t.data.color})},s._drawText=function(t){return t.append("text").style("user-select","none").attr("pointer-events","none").attr("y",this._zoomHeight/2).attr("fill",function(t){var i;return null!=(i=t.data.textColor)?i:"black"}).attr("opacity",.8).attr("text-anchor","middle").attr("dominant-baseline","middle")},s._addTicks=function(t){var i=this,e=t.append("g").attr("id","tick"),a=.8*(this._zoomHeight-this.options.fontSize);return e.append("line").attr("stroke","#555").attr("stroke-width",1).attr("x1",0).attr("y1",0).attr("x2",0).attr("y2",a),e.append("text").attr("x",0).attr("y",a+this.options.fontSize).attr("font-size",function(t){return 1-.05*t.data.level+"em"}).text(function(t){return t.data.start+"ma"}).attr("text-anchor",function(t){return t.data.start===i._startTime?"start":"middle"}).clone(!0).lower().attr("stroke-linejoin","round").attr("stroke-width",1).attr("stroke","white"),e},s._transform=function(t){var i=this,e=t.x,a=+t.k.toFixed(6),o=this._ready&&(this._level!==a&&a>this._minZoom&&a<this._maxZoom||this._forceTrans)?this.transition:0;if(this._level!==a){var s=a*this._scaleRadio;this.root.each(function(t){var i,e;t.target={x0:t.x0*s,x1:t.x1*s};var r=null!=(i=t.data.level)?i:0;t.visible=r===~~a||0===(null!=(e=t.children)?e:[]).length&&r<a}),n(this._rect,o).attr("width",function(t){return t.target.x1-t.target.x0}).attr("x",function(t){return t.target.x0}),n(this._text,o).attr("fill-opacity",function(t){return t.target.x1-t.target.x0>14?1:0}).attr("x",function(t){var i=t.target.x0+(t.target.x1-t.target.x0)/2;return Number.isNaN(i)?0:i}).text(function(t){var e=Math.abs(t.target.x1-t.target.x0),a=r(t.data.name,i.font),n=t.data.abbr||t.data.name.charAt(0);return e-10<a?n:t.data.name}),n(this._ticks,o).attr("transform",function(t){return"translate("+t.target.x0+", 0)"}).attr("opacity",function(t){var e=t.data.start+"ma";return Math.abs(t.target.x1-t.target.x0)<r(e,i.font)*(1-.05*t.data.level)?0:1}),n(this._cell,o).style("opacity",function(t){return t.visible?1:0}),this._level=a,this._dispatchFunc(this._onChange),this._dispatchFunc(this._onAfterChange)}return n(this._cellGroup,o).attr("transform","translate("+e+", "+this._margin.top+")"),this._zoomedScale=t.rescaleX(this._xAxis),this._changeHandlePos(this._zoomedScale,this._handle,this._zoomedScale(this._scaleVal),o),!0},s._getScaleXByTime=function(t){var i=this.root.find(function(i){return i.visible&&i.data.start>=t&&i.data.end<=t});return(i.target.x0+(i.target.x1-i.target.x0)*(i.data.start-t)/(i.data.start-i.data.end))/(this.root.target.x1-this.root.target.x0)*this._timeLength},s._setTime=function(t){var i=Math.min(this._endTime,this._startTime),e=Math.max(this._endTime,this._startTime);if(t<i||t>e)throw Error("Time value out of range: ["+i+", "+e+"]");var a=this._getScaleXByTime(t),r=this._zoomedScale(a),n=this._changeHandlePos(this._zoomedScale,this._handle,r,this.transition);return this._forceTrans=!0,this._zoom.translateTo(this.svg,a/this._timeLength*this._width,0),this._forceTrans=!1,n},s._changeHandlePos=function(t,i,e,a){var r=t.invert(e);r<0&&(r=0),r>this._timeLength&&(r=this._timeLength),n(i,a).attr("transform","translate("+e+", "+this._margin.top+"), scale("+this._heightScale+")"),this._scaleVal=r;var o=r*this._width/this._timeLength,s=this.root.find(function(t){return t.visible&&t.x0<=o&&t.x1>=o}),h=+(s.data.start-(s.data.start-s.data.end)*(o-s.x0)/(s.x1-s.x0)).toFixed(6);return h!==this._time&&(this._time=h,this._dispatchFunc(this._onChange)),!0},e(i,[{key:"time",get:function(){return this._time},set:function(t){this._setTime(t)&&(this._time=+t)}},{key:"level",get:function(){return this._level},set:function(t){var i=+t;t<this._minZoom&&(i=this._minZoom),t>this._maxZoom&&(i=this._maxZoom),this._zoom.scaleTo(this.svg,i,[this._zoomedScale(this._scaleVal),0])}},{key:"ready",get:function(){return this._ready}}]),i}(),h={height:400,fontSize:12,fontFamily:"sans-serif",margin:{top:0,right:0,bottom:0,left:0},padding:{top:0,right:0,bottom:0,left:0},transition:450,intervalSum:function(t){return t.leaf?t.start-t.end:0},simplify:!1,neighborWidth:100,tickLength:15,unit:""},d=/*#__PURE__*/function(){function i(i,e,o){var s=this;void 0===o&&(o={}),this.font=void 0,this.svg=void 0,this.height=void 0,this._handleX=void 0,this.intervals=void 0,this.hierarchicalData=void 0,this.root=void 0,this.options=void 0,this._onChange=void 0,this._onDrag=void 0,this._ready=void 0,this._cellGroup=void 0,this._cell=void 0,this._rect=void 0,this._text=void 0,this._handle=void 0,this.transition=void 0,this._simplify=void 0,this._focus=void 0,this._sequence=void 0,this._neighborWidth=void 0,this._tickLength=void 0,this._ticksGroup=void 0,this._clicked=function(t,i,e){var a;void 0===e&&(e=!1);var o=i===s._focus&&null!=(a=null==i?void 0:i.parent)?a:i;s._focus=o;var h,d,l=o.ancestors().slice(1),c=s._ready?s.transition:0,u=o.data.start===s.root.data.start?0:s._neighborWidth,_=s.options.width-(o.data.end===s.root.data.end?0:s._neighborWidth)-u,g=o.x1-o.x0;s.root.each(function(t){t.target={x0:u+(t.x0-o.x0)/g*_,x1:u+(t.x1-o.x0)/g*_,y0:t.y0,y1:t.y1},s._simplify&&(t.visible=[o.depth,o.depth+1].includes(t.depth)||!o.children&&t.depth===o.depth-1)}),n(s._rect,c).attr("x",function(t){return t.target.x0}).attr("width",function(t){return t.target.x1-t.target.x0}).attr("height",function(t){return t.visible?t.y1-t.y0:0}).attr("stroke","white").attr("stroke-width",1),n(s._text,c).attr("fill-opacity",function(t){return l.includes(t)?1:+(t.target.x1-t.target.x0>14)}).attr("x",function(t){if(l.includes(t))return o.target.x0+(o.target.x1-o.target.x0)/2;var i=t.target.x0+(t.target.x1-t.target.x0)/2;return Number.isNaN(i)?0:i}).attr("y",function(t){return(t.y1-t.y0)/2}).attr("opacity",function(t){return t.visible?1:0}).attr("font-size",function(t){return t.id===o.id?s.options.fontSize+6:s.options.fontSize}).attr("font-weight",function(t){return t.id===o.id?"bold":500}).text(function(t){var i=Math.abs(t.target.x1-t.target.x0),e=r(t.data.name,s.font),a=t.data.abbr||t.data.name.charAt(0);return i-8<e?a:t.data.name}),s._ticksGroup.call(function(t){return s._addTicks(t,s._makeTicksData(o))}),s._simplify&&(n(s._cell,c).style("opacity",function(t){return t.visible?1:0}),n(s._cellGroup,c).attr("transform","translate(0, "+(s._focus.children?-s._focus.target.y0:-(null!=(h=null==(d=s._focus.parent)?void 0:d.y0)?h:0))+")"));var f=o.ancestors().reverse();return s._sequence=f,e||(s._changeHandlePos(s._handle,o.target.x0,s.height,c),s._dispatchFunc(s._onChange)),!0};var d=t.select(i);if(!d.node())throw Error("Invalid selecor!");if(null==e||!e.length)throw Error("Empty intervals !");var l=+d.style("width").split("px")[0],c=a({},h,{margin:a({},h.margin,o.margin),padding:a({},h.padding,o.padding),width:isNaN(l)?1e3:l},o),u=c.width,_=c.height,g=c.intervalSum,f=c.onChange,v=c.onDrag,m=c.simplify,p=c.neighborWidth,x=c.tickLength;this.transition=c.transition,this._onChange=f,this._onDrag=v,this.font=c.fontSize+"px "+c.fontFamily,this.intervals=e,this._simplify=m,this._neighborWidth=p,this._tickLength=x,this.options=c,this.hierarchicalData=t.stratify()(e).sum(g).sort(function(t,i){return i.data.start-t.data.start}),this.root=t.partition().size([u,(_-c.margin.bottom-c.margin.top)*(m?(this.hierarchicalData.height+1)/2:1)]).padding(0)(this.hierarchicalData),this.root.each(function(t){t.target={x0:t.x0,x1:t.x1},t.visible=!0}),this._sequence=[this.root],this.svg=d.append("svg").attr("viewBox",[0,0,u,_]).style("font",this.font),this.height=_,this._handleX=0,this._ready=!1,this._init()}var o=i.prototype;return o._init=function(){var i=this,e=this,a=e.svg;e._cellGroup=a.append("g").attr("id","cells"),e._cell=e._cellGroup.selectAll("g").data(e.root.descendants()).join("g").attr("transform",function(t){return"translate(0, "+t.y0+")"}),e._rect=e._drawRect(e._cell).on("click",e._clicked),e._addTitle(e._cell),e._text=e._drawText(e._cell),e._ticksGroup=a.append("g").attr("id","ticks"),e._handle=e._drawHandle(a,e.height),e._handle.call(t.drag().on("drag",function(t){e._handleX=t.x,e._changeHandlePos(e._handle,t.x,e.height),e._handle.attr("cursor","grabbing")}).on("end",function(){var t=i.getTimeByX(e._handleX,e.height);e._handle.attr("cursor","grab"),console.log("time",t),e._onDrag&&e._onDrag(t)})),e._cellGroup.call(t.zoom().on("zoom",function(t){var i=t.sourceEvent;if("wheel"===i.type)if(i.wheelDelta<0)e._clicked(void 0,e._focus);else{var a,r,n=i.offsetX,o=i.offsetY+(e._simplify&&null!=(a=null==(r=e._focus)?void 0:r.y0)?a:0),s=e.root.find(function(t){return t.target.x0<=n&&t.target.x1>n&&t.target.y0<=o&&t.target.y1>o});s&&(e._focus=null,e._clicked(void 0,s))}}).on("end",function(){e._rect.attr("cursor","pointer")})),e._clicked(void 0,e.root),a.on("pointerleave",function(){i._cell.attr("fill-opacity",1)}),this._ready=!0},o._dispatchFunc=function(t){t&&this._ready&&t(this._focus)},o._addTitle=function(t){return t.append("title").text(function(t){return""+t.ancestors().map(function(t){return t.data.name}).reverse().join(" > ")})},o._drawRect=function(t){return t.append("rect").attr("fill",function(t){return t.data.color}).attr("stroke","white").attr("stroke-width",.5).attr("cursor","pointer").on("pointerenter",function(i,e){var a=e.ancestors().reverse();t.attr("fill-opacity",function(t){return a.includes(t)?1:.5})})},o._drawHandle=function(t,i){var e=t.append("g").attr("cursor","grab").attr("id","handle"),a=i;return e.append("rect").attr("x",0).attr("y",a-20-1).attr("width",1).attr("height",20).attr("fill","black").attr("id","handleCursor"),e.append("text").attr("x",0).attr("y",a-20-3).attr("text-anchor","middle").text("4000ma").clone(!0).lower().attr("stroke-linejoin","round").attr("stroke-width",2).attr("stroke","white").attr("id","handleText"),e},o._drawText=function(t){return t.append("text").style("user-select","none").attr("pointer-events","none").attr("fill",function(t){var i;return null!=(i=t.data.textColor)?i:"black"}).attr("opacity",.8).attr("text-anchor","middle").attr("dominant-baseline","middle")},o._makeTicksData=function(t){var i,e,a=this,n=this.root.descendants().map(function(i){var e,n,o,s=i.visible,h=!t.children&&i.depth===t.depth;return s&&(s=!(!h&&null!=(n=i.parent)&&n.visible&&i.data.start===i.parent.data.start)&&i.target.x1-i.target.x0>=r(i.data.start+a.options.unit,a.font)*(1-.05*(null!=(o=i.data.level)?o:0))),{x:i.x0,y:i.y0-(a._simplify?h?t.parent.y0:t.y0:0),depth:i.depth,targetX:(null==i||null==(e=i.target)?void 0:e.x0)||0,text:i.data.start+a.options.unit,visible:s}}),o={x:this.root.x1,y:0,depth:0,targetX:(null==(i=this.root)||null==(e=i.target)?void 0:e.x1)||this.options.width,text:"0",visible:!0};return n.push(o),n},o._updateTicks=function(t){var i=this;return t.attr("opacity",function(t){return t.visible?1:0}).attr("display",function(t){return t.visible?"block":"none"}).attr("transform",function(t){return"translate("+t.targetX+", "+t.y+")"}).attr("dominant-baseline","hanging").attr("text-anchor",function(t){return 0===t.targetX?"start":t.targetX>=i.root.target.x1?"end":"middle"})},o._addTicks=function(t,i){var e=this;t.selectAll("g").data(i).join(function(t){var i=t.append("g");e._updateTicks(i),i.append("line").attr("stroke","#555").attr("stroke-width",1).attr("x1",0).attr("y1",0).attr("x2",0).attr("y2",e._tickLength),i.append("text").attr("x",0).attr("y",e._tickLength+e.options.fontSize/2).attr("font-size",function(t){return 1-.05*t.depth+"em"}).text(function(t){return t.text}).clone(!0).lower().attr("stroke-linejoin","round").attr("stroke-width",2).attr("stroke","white")},function(t){return e._updateTicks(n(t,e.transition))})},o._changeHandlePos=function(t,i,e,a){n(t,a).attr("transform","translate("+i+", 0), scale(1)");var r=this.getTimeByX(i,e);return r>0&&t.selectAll("text").text(r+"ma"),!0},o.getTimeByX=function(t,i){var e=i-10,a=this.root.find(function(i){return i.target.x0<=t&&i.target.x1>t&&i.target.y0<=e&&i.target.y1>e});if(!a)return 0;var r=a.data,n=r.start;return Math.floor(n-(n-r.end)/(a.target.x1-a.target.x0)*(t-a.target.x0))},o.getXByTime=function(t,i){if(!i)return 0;var e=i.data,a=e.start;return i.target.x0+(a-t)/(a-e.end)*(i.target.x1-i.target.x0)},e(i,[{key:"stage",get:function(){return this._focus.data.name},set:function(t){var i=this.root.find(function(i){return i.data.name===t});i&&this._clicked(void 0,i)}},{key:"time",set:function(t){var i;console.log("set time",t);var e=0;if(this.root.each(function(a){a.data.start>=t&&a.data.end<t&&(!i||a.depth>e)&&(i=a.parent,e=a.depth)}),i){i.visible||this._clicked(void 0,i.parent,!0);var a=this.getXByTime(t,i);this._changeHandlePos(this._handle,a,this.height)}}},{key:"sequence",get:function(){return this._sequence}},{key:"ready",get:function(){return this._ready}}]),i}();exports.GeoTimeLine=s,exports.GeoTimeScale=d;
//# sourceMappingURL=index.cjs.map
