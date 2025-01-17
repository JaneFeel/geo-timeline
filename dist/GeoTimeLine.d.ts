import { Selection, BaseType } from 'd3';
import { GeoTimeLineOptions, HierarchyNode, IntervalItem, NodeItem } from './typing';
export default class GeoTimeLine {
    /** text font */
    readonly font: string;
    /** interval data's max level */
    readonly maxLevel: number;
    /** svg object */
    readonly svg: Selection<SVGSVGElement, unknown, HTMLElement, any>;
    /** interval data */
    readonly intervals: IntervalItem[];
    /** hierarchical data generated by intervals */
    readonly hierarchicalData: HierarchyNode<IntervalItem>;
    /** the root hierarchical data */
    readonly root: NodeItem;
    /** user input options */
    readonly options: GeoTimeLineOptions;
    private _width;
    private _height;
    private _time;
    private _timeLength;
    private _scaleRadio;
    private _scaleVal;
    private _level;
    private _startTime;
    private _endTime;
    private _handle;
    private _zoomedScale;
    private _onChange;
    private _onAfterChange;
    private _ready;
    private _xAxis;
    private _cellGroup;
    private _heightScale;
    private _zoomWidth;
    private _minZoom;
    private _maxZoom;
    private _zoomHeight;
    private _zoom;
    private _interval;
    private _cell;
    private _rect;
    private _text;
    private _ticks;
    private _margin;
    private _padding;
    private _showTick;
    private _limitHandle;
    /** get or set animation transition time */
    transition: number;
    private _forceTrans;
    /**
     * Create a GeoTimeLine
     * @param {string | BaseType} selector CSS selector string
     * @param {IntervalItem[]} intervals geo time intervals array
     * @param {number} [options.width] svg width, defaults to container's width
     * @param {number} [options.height = 70] svg height, defaults to 70px
     * @param {number} [options.fontSize = 16] font size, defaults to 16px
     * @param {string} [options.fontFamily = 'sans-serif'] font family, defaults to 'sans-serif'
     * @param {Function} [options.onChange] callback when handle's position or scale level changed
     * @param {Object} [options.margin] svg margin, defaults to { top: 0, right: 0, bottom: 0, left: 0 }
     * @param {Object} [options.padding] svg padding, defaults to { top: 0, right: 0, bottom: 0, left: 0 }
     * @param {number} [options.time = 0] initial time, defaults to 0
     * @param {number} [options.transition = 450] animation time, defaults to 450ms
     * @param {Function} [options.intervalSum] interval transform setting, defaults to (d) => d.leaf ? 1 : 0
     * @param {number} [options.minZoom] min zoom level
     * @param {number} [options.maxZoom = 10] min zoom level, defaults to 10
     * @param {boolean} [options.showTick = true] show or hide tick, defaults to true
     * @param {boolean} [options.limitHandle = true] limit handle position
     */
    constructor(selector: string | BaseType, intervals: IntervalItem[], options?: GeoTimeLineOptions);
    /** get or set time */
    get time(): number;
    set time(val: number);
    /** get or set level */
    get level(): number;
    set level(val: number);
    get ready(): boolean;
    private _init;
    private _dispatchFunc;
    /**
     * draw handle
     * @param svg
     * @returns
     */
    private _drawHandle;
    /**
     * draw rect
     */
    private _drawRect;
    /** draw text */
    private _drawText;
    private _addTicks;
    /**
     * reset svg by transform
     */
    private _transform;
    private _getScaleXByTime;
    /**
     * set time and update handle's position
     * @param {boolean} time
     * @return {boolean} success or not
     */
    private _setTime;
    /**
     * change handle's position and update time
     * @param zoomedScale
     * @param handle
     * @param x mouse x position offset svg
     * @returns update success or not
     */
    private _changeHandlePos;
}
