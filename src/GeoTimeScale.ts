import { D3DragEvent, partition, drag, stratify, Selection, select, zoom as d3zoom, BaseType } from 'd3';
import { d3ZoomEvent, GeoTimeScaleOptions, HierarchyNode, IntervalItem, NodeItem, TickNode } from './typing';
import { getTextWidth, trans } from './helpers';

const DefaultOpts: Partial<GeoTimeScaleOptions> = {
  height: 400,
  fontSize: 12,
  fontFamily: 'sans-serif',
  margin: {
    top: 0, right: 0, bottom: 0, left: 0,
  },
  padding: {
    top: 0, right: 0, bottom: 0, left: 0,
  },
  transition: 450,
  intervalSum: d => d.leaf ? d.start - d.end : 0,
  simplify: false,
  neighborWidth: 100,
  tickLength: 15,
  unit: ''
}

export default class GeoTimeLine {
  /** text font */
  readonly font: string;
  /** svg object */
  readonly svg: Selection<SVGSVGElement, unknown, HTMLElement, any>;
  
  /** interval data */
  readonly intervals: IntervalItem[];
  /** hierarchical data generated by intervals */
  readonly hierarchicalData: HierarchyNode<IntervalItem>;
  /** the root hierarchical data */
  readonly root: NodeItem;
  /** user input options */
  readonly options: GeoTimeScaleOptions
  private _onChange: (node: NodeItem) => void;
  private _ready: boolean;
  private _cellGroup: Selection<SVGGElement, unknown, HTMLElement, any>;
  private _cell: Selection<SVGGElement | BaseType, NodeItem, SVGGElement, unknown>;
  private _rect: Selection<SVGRectElement, NodeItem, SVGGElement, unknown>;
  private _text: Selection<SVGTextElement, NodeItem, SVGGElement, unknown>;
  private _handle: Selection<SVGGElement, unknown, HTMLElement, any>;
  /** get or set animation transition time */
  transition: number;
  private _simplify: boolean;
  private _focus: NodeItem;
  private _sequence: NodeItem[];
  private _neighborWidth: number;
  private _tickLength: number;
  private _ticksGroup: Selection<SVGGElement, unknown, HTMLElement, any>;

  /**
   * Create a GeoTimeScale
   * @param {string | BaseType} selector CSS selector string
   * @param {IntervalItem[]} intervals geo time intervals array
   * @param {number} [options.width] svg width, defaults to container's width
   * @param {number} [options.height = 400] svg height, defaults to 400px
   * @param {number} [options.fontSize = 12] font size, defaults to 12px
   * @param {string} [options.fontFamily = 'sans-serif'] font family, defaults to 'sans-serif'
   * @param {Function} [options.onChange] callback when focused node change
   * @param {Object} [options.margin] svg margin, defaults to { top: 0, right: 0, bottom: 0, left: 0 }
   * @param {Object} [options.padding] svg padding, defaults to { top: 0, right: 0, bottom: 0, left: 0 }
   * @param {number} [options.transition = 450] animation time, defaults to 450ms
   * @param {Function} [options.intervalSum] interval transform setting, defaults to d => d.leaf ? d.start - d.end : 0
   * @param {boolean} [options.simplify = true] simplify show 2 levels or not
   * @param {number} [options.neighborWidth = 100] focused node's neighbor node width, defaults to 100px
   * @param {number} [options.tickLength = 15] tick length, defaults to 15px
   * @param {string} [options.unit = ''] tick value unit
   */
  constructor(selector: string | BaseType, intervals: IntervalItem[], options: GeoTimeScaleOptions = {}) {
    const selection = select(selector as BaseType)
    if (!selection.node()) {
      throw Error('Invalid selecor!')
    }
    if (!intervals?.length) {
      throw Error('Empty intervals !')
    }

    const containerWidth = +selection.style('width').split('px')[0]
    const opts: GeoTimeScaleOptions = {
      ...DefaultOpts,
      margin: {
        ...DefaultOpts.margin,
        ...options.margin
      },
      padding: {
        ...DefaultOpts.padding,
        ...options.padding
      },
      width: isNaN(containerWidth) ? 1000 : containerWidth,
      ...options
    }
    const { width, height, intervalSum, onChange, transition, simplify, neighborWidth, tickLength } = opts
    this.transition = transition
    this._onChange = onChange
    this.font = `${opts.fontSize}px ${opts.fontFamily}`
    this.intervals = intervals
    this._simplify = simplify
    this._neighborWidth = neighborWidth
    this._tickLength = tickLength

    this.options = opts
    
    this.hierarchicalData = stratify<IntervalItem>()(intervals)
      .sum(intervalSum)
      .sort((a, b) => b.data.start - a.data.start)

    this.root = partition<IntervalItem>()
      .size([width, (height - opts.margin.bottom - opts.margin.top) * (simplify ? (this.hierarchicalData.height + 1) / 2 : 1)])
      .padding(0)(this.hierarchicalData)
      
    this.root.each(d => {
      d.target = {
        x0: d.x0,
        x1: d.x1
      }
      d.visible = true
    })
    this._sequence = [this.root]

    this.svg = selection
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("font", this.font)

    this._ready = false

    this._init()
  }

  /** get or set focused stage
   * @example
   * geoTimeScale.stage = 'Cambrian'
   */
  get stage(): string {
    return this._focus.data.name
  }

  set stage(val: string) {
    const node = this.root.find(node => node.data.name === val)
    if (node) {
      this._clicked(undefined, node)
    }
  }

  get sequence(): NodeItem[] {
    return this._sequence
  }

  get ready(): boolean {
    return this._ready
  }
  
  private _init() {
    const self = this
    const svg = self.svg

    // draw cells
    self._cellGroup = svg
      .append("g")
      .attr("id", "cells")

    self._cell = self._cellGroup
      .selectAll("g")
      .data(self.root.descendants())
      .join("g")
      .attr("transform", (d) => `translate(0, ${d.y0})`)

    self._rect = self
      ._drawRect(self._cell)
      .on("click", self._clicked)

    self._addTitle(self._cell)

    // draw text
    self._text = self._drawText(self._cell)
    self._ticksGroup = svg
      .append("g")
      .attr("id", "ticks")

    self._handle = self._drawHandle(svg)
    self._handle
      .call(drag()
        .on("drag", dragged)
        .on("end", () => {
          self._handle.attr("cursor", "grab");
        }))

    function dragged(e: D3DragEvent<Element, unknown, unknown>) {
      console.log('dragged');
      // self._changeHandlePos(self._zoomedScale, self._handle, self._zoomedScale(self._scaleVal) + e.dx)
      self._handle.attr("cursor", "grabbing")
    }
    
    // zoom function
    function zoomed(e: d3ZoomEvent) {
      const event = e.sourceEvent

      if (event.type === 'wheel') {
        if ((event as any).wheelDelta < 0) {
          self._clicked(undefined, self._focus)
        } else {
          const { offsetX } = event
          const offsetY = event.offsetY + (self._simplify ? (self._focus?.y0 ?? 0) : 0)
          const node = self.root.find(node => node.target.x0 <= offsetX && node.target.x1 > offsetX && node.target.y0 <= offsetY && node.target.y1 > offsetY)
          if (node) {
            self._focus = null
            self._clicked(undefined, node)
          }
        }
      }
    }

    self._cellGroup
      .call(
        d3zoom()
          .on('zoom', zoomed)
          .on("end", () => {
            self._rect.attr("cursor", "pointer");
          })
      )
    
    self._clicked(undefined, self.root)
    
    svg.on("pointerleave", () => {
      this._cell.attr("fill-opacity", 1);
    });

    this._ready = true
  }

  private _dispatchFunc(func: typeof this._onChange) {
    if (func && this._ready) {
      func(this._focus)
    }
  }

  private _addTitle(cell: typeof this._cell) {
    return cell.append("title").text((d) => {
      const sequence = d
        .ancestors()
        .map((d) => d.data.name)
        .reverse();

      return `${sequence.join(" > ")}`;
    });
  }

  /**
   * draw rect
   */
  private _drawRect(cell: typeof this._cell) {
    return cell
      .append("rect")
      .attr('fill', d => d.data.color)
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)
      .attr("cursor", "pointer")
      .on("pointerenter", (_event, d) => {
        // Get the ancestors of the current segment
        const sequence = d.ancestors().reverse();
        // Highlight the ancestors
        cell.attr("fill-opacity", (d) => (sequence.includes(d) ? 1.0 : 0.5));
      })
  }

  private _drawHandle(svg: Selection<SVGSVGElement, unknown, HTMLElement, any>) {
    const handle = svg
      .append('g')
      .attr("cursor", 'grab')

    let handleShape =
      "M0 0 l 15 20 v 18 q 0 5 -5 5 h -20 q -5 0 -5 -5 v -18 l 15 -20";
    handle
      .append("path")
      .attr("fill", "#ccc")
      .attr("fill-opacity", 0.85)
      .attr("stroke", "#333")
      .attr("stroke-width", "1px")
      .attr("d", handleShape)

    // Add stripes for texture
    function addStripe(x: number) {
      handle
        .append("rect")
        .attr("fill", "#515151")
        .attr("width", 3)
        .attr("height", 16)
        .attr("x", x)
        .attr("y", 21);
    }

    addStripe(-7.5);
    addStripe(-1.5);
    addStripe(4.5);

    return handle
  }

  /** draw text */
  private _drawText(cell: typeof this._cell) {
    const text = cell
      .append("text")
      .style("user-select", "none")
      .attr("pointer-events", "none")
      .attr("fill", (d) => d.data.textColor ?? "black")
      .attr("opacity", 0.8)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
    
    return text
  }

  private _makeTicksData(focus: NodeItem): TickNode[] {
    const ticksData = this.root.descendants()
      .map((d) => {
        let visible = d.visible
        const ifFocusBottom = (!focus.children && d.depth === focus.depth)
        if (visible) {
          if (!ifFocusBottom && d.parent?.visible && d.data.start === d.parent.data.start) {
            visible = false
          } else {
            const text = d.data.start + this.options.unit
            const rectWidth = d.target.x1 - d.target.x0
            const labelWidth = getTextWidth(text, this.font)
  
            visible = rectWidth >= labelWidth * (1 - 0.05 * (d.data.level ?? 0))
          }
        }

        return {
          x: d.x0,
          y: d.y0 - (this._simplify ? (ifFocusBottom ? focus.parent.y0 : focus.y0) : 0),
          depth: d.depth,
          targetX: d?.target?.x0 || 0,
          text: d.data.start + this.options.unit,
          visible
        }
      })

    const now = {
      x: this.root.x1,
      y: 0,
      depth: 0,
      targetX: this.root?.target?.x1 || this.options.width,
      text: '0',
      visible: true
    }

    ticksData.push(now)

    return ticksData
  }

  private _updateTicks<T extends Selection<BaseType, TickNode, BaseType, unknown>>(node: T): T {
    return node
      .attr("opacity", (d) => d.visible ? 1 : 0)
      .attr("display", (d) => d.visible ? 'block' : 'none')
      .attr("transform", (d) => `translate(${d.targetX}, ${d.y})`)
      .attr("dominant-baseline", "hanging")
      .attr("text-anchor", (d) =>
        d.targetX === 0 ? "start" : d.targetX >= this.root.target.x1 ? "end" : "middle"
      )
  }

  private _addTicks(ticks: typeof this._ticksGroup, data: TickNode[]) {
    ticks.selectAll("g")
      .data(data)
      .join(
      // @ts-ignore
        (enter) => {
          const tick = enter.append("g")
          this._updateTicks(tick)

          tick
            .append("line")
            .attr("stroke", "#555")
            .attr("stroke-width", 1)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr(
              "y2",
              this._tickLength
            );

          tick
            .append("text")
            .attr("x", 0)
            .attr(
              "y",
              this._tickLength + this.options.fontSize / 2
            )
            .attr("font-size", (d) => `${1 - 0.05 * d.depth}em`)
            .text((d) => d.text)
            .clone(true)
            .lower()
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 2)
            .attr("stroke", "white");
        },
        (update) => this._updateTicks(trans(update, this.transition))
      );
  }

  /**
   * click rect and zoom
   */
  private _clicked = (event: any, p: NodeItem): boolean => {
    const focus = p === this._focus ? (p?.parent ?? p) : p;
    this._focus = focus;

    const focusAncestors = focus.ancestors().slice(1); // Ignore clicked node itself
    const duration = this._ready ? this.transition : 0 // initial without transition

    // Show a bit of the neighbouring cells on focus of an interval
    const leftNeighbor =
      focus.data.start === this.root.data.start ? 0 : this._neighborWidth;
    const rightNeighbor = focus.data.end === this.root.data.end ? 0 : this._neighborWidth;
    const widthMinusNeighbors = this.options.width - rightNeighbor - leftNeighbor;
    const focusWidth = focus.x1 - focus.x0; // partition width of focused node

    this.root.each(d => {
      d.target = {
        x0:
          leftNeighbor + ((d.x0 - focus.x0) / focusWidth) * widthMinusNeighbors,
        x1:
          leftNeighbor + ((d.x1 - focus.x0) / focusWidth) * widthMinusNeighbors,
        y0: d.y0,
        y1: d.y1,
      }
      if (this._simplify) {
        d.visible = [focus.depth, focus.depth + 1].includes(d.depth) || (!focus.children && d.depth === focus.depth - 1)
      }
    })

    trans(this._rect, duration)
      .attr('x', d => (d.target.x0))
      .attr('width', d => (d.target.x1 - d.target.x0))
      .attr("height", (d) => (d.visible ? (d.y1 - d.y0) : 0))
      .attr("stroke", "white")
      .attr("stroke-width", 1);

    trans(this._text, duration)
      .attr("fill-opacity", (d) =>
        focusAncestors.includes(d) ? 1 : +(d.target.x1 - d.target.x0 > 14)
      )
      .attr("x", (d) => {
        // Position all the ancestors labels in the middle
        if (focusAncestors.includes(d)) {
          return focus.target.x0 + (focus.target.x1 - focus.target.x0) / 2;
        }

        const textX = d.target.x0 + (d.target.x1 - d.target.x0) / 2;
        return Number.isNaN(textX) ? 0 : textX;
      })
      .attr("y", (d) => (d.y1 - d.y0) / 2)
      .attr("opacity", d => d.visible ? 1 : 0)
      .attr("font-size", (d) => d.id === focus.id ? this.options.fontSize + 6 : this.options.fontSize)
      .attr("font-weight", (d) => d.id === focus.id ? 'bold' : 500)
      .text((d) => {
        const rectWidth = Math.abs(d.target.x1 - d.target.x0);
        const labelWidth = getTextWidth(d.data.name, this.font);
        const abbrev = d.data.abbr || d.data.name.charAt(0);

        return rectWidth - 8 < labelWidth ? abbrev : d.data.name;
      })
    
    this._ticksGroup.call((g) => this._addTicks(g, this._makeTicksData(focus)));

    if (this._simplify) {
      trans(this._cell, duration)
        .style('opacity', d => d.visible ? 1 : 0)
  
      trans(this._cellGroup, duration)
        .attr("transform", `translate(0, ${!this._focus.children ? -(this._focus.parent?.y0 ?? 0) : -this._focus.target.y0})`)
    }
    
    const sequence = focus.ancestors().reverse();
    this._sequence = sequence;

    this._dispatchFunc(this._onChange)

    return true
  }

}