import config from '../config';
import utils from '../utils';
import create from 'dom-create-element';
import vs from 'virtual-scroll';
import _ from 'underscore';
import prefix from 'prefix';
import classes from 'dom-classes';
import $ from 'jquery';

class Smooth {
    
    constructor(opt = {}) {
        
        this.createBound();
        this.isMobile = config.isMobile;
        
        this.direction = opt.direction || 'vertical';
        
        this.vs = new vs({
            limitInertia: false,
            mouseMultiplier: 0.25,
            touchMultiplier: 1.8,
            firefoxMultiplier: 30,
            preventTouch: opt.preventTouch || true
        });
        
        this.pos = {
            current: 0,
            lastCurrent: 0,
            target: 0,
            height: config.height
        };
          
        this.dom = {
            listener: opt.listener || config.$body,
            section: opt.section
        };

        this.scrollbar = {
            el: create({ selector: 'div', styles: 'vs-scrollbar vs-'+this.direction }),
            drag: {
                el: create({ selector: 'div', styles: 'vs-scrolldrag' }),
                delta: 0,
                height: 50
            }
        };

        this.draggable = {
            clicked: false,
            x: 0
        };
        
        this.bounding = 0;
        this.ease = opt.ease || 0.075;
        this.prefix = prefix('transform');
    }
    
    createBound() {
        
        ['calc', 'resize', 'mouseUp', 'mouseDown', 'mouseMove', 'calcScroll']
        .forEach((fn) => this[fn] = this[fn].bind(this));
    }
    
    /* -----
    init
    ----- */
    init() { 

        this.resize();
        
        this.addEvents();

        this.addFakeScrollBar();
    }
    
    /* -----
    calc, used by vs
    ----- */
    calc(e) {
        
        const delta = this.direction == 'horizontal' ? e.deltaX : e.deltaY;
        
        this.pos.target += delta * -1;
        
        this.pos.target = utils.js.clamp(0, this.pos.target, this.bounding);
    }

    /* -----
    loop function (rAF)
    ----- */
    run() {
        
        this.pos.current += (this.pos.target - this.pos.current) * this.ease;
        this.pos.current < .1 && (this.pos.current = 0);
        
        window.delta = this.pos.current * 0.1;

        this.dom.section.style[this.prefix] = this.getTransform(-Math.abs(this.pos.current.toFixed(2)));
        
        const size = this.scrollbar.drag.height;
        const bounds = (this.direction == 'vertical') ? config.height : config.width;
        const value = (Math.abs(this.pos.current) / (this.bounding / (bounds - size))) + (size / .5) - size;
        const clamp = utils.js.clamp(0, value-size, value+size);
        
        this.scrollbar.drag.el.style[this.prefix] = this.getTransform(clamp.toFixed(2));
    
    }
    
    /* -----
    get cross browser transform
    from value
    ----- */
    getTransform(value) {
        
        return (this.direction === 'vertical') ? 'translate3d(0,' + value + 'px,0)' : 'translate3d(' + -value + 'px,0,0)';
    }

    /* -----
    on
    ----- */
    on() {
        
        this.vs.on(this.calc);

        TweenLite.ticker.addEventListener('tick', this.run, this, false, 1);
    }

    /* -----
    off
    ----- */
    off() {

        this.vs.off(this.calc);

        TweenLite.ticker.removeEventListener('tick', this.run);
    }
    
    /* -----
    add global events
    scroll, resize and rAF
    ----- */
    addEvents() {
        
        $(window).on('resize', this.resize);
        
        this.on();
    }
    
    /* -----
    remove global events
    scroll, resize and rAF
    ----- */
    removeEvents() {
                
        $(window).off('resize', this.resize);
        
        this.off();
    }

    /* -----
    add the scrollbar if asked for
    ----- */
    addFakeScrollBar() {

        let prop = this.direction == 'vertical' ? 'height' : 'width';
        
        this.scrollbar.drag.height = this.pos.height * (this.pos.height / (this.bounding + this.pos.height));
        
        $(this.scrollbar.drag.el).css(prop, this.scrollbar.drag.height);

        this.dom.listener.appendChild(this.scrollbar.el);
        this.scrollbar.el.appendChild(this.scrollbar.drag.el);
        
        $(this.scrollbar.el).on('click', this.calcScroll);
        $(this.scrollbar.el).on('mousedown', this.mouseDown);
        
        $(document).on('mousemove', this.mouseMove);
        $(document).on('mouseup', this.mouseUp);
    }
    
    /* -----
    remove the scrollbar
    ----- */
    removeFakeScrollBar() {
        
        $(this.scrollbar.el).off('click', this.calcScroll);
        $(this.scrollbar.el).off('mousedown', this.mouseDown);

        $(document).off('mousemove', this.mouseMove);
        $(document).off('mouseup', this.mouseUp);

        $(this.scrollbar.el).css('display', 'none');

        this.dom.listener.removeChild(this.scrollbar.el);
    }

    /* -----
    mouseDown
    ----- */
    mouseDown(e) {
        
        e.which == 1 && (this.draggable.clicked = true);
    }

    /* -----
    mouseUp
    ----- */
    mouseUp(e) {

        this.draggable.clicked = false;

        classes.remove(config.$body, 'is-dragging');
    }

    /* -----
    mouseMove
    ----- */
    mouseMove(e) {

        this.draggable.clicked && this.calcScroll(e);
    }

    /* -----
    calc scrolling
    ----- */
    calcScroll(e) {

        let client = this.direction == 'vertical' ? e.clientY : e.clientX;
        let bounds = this.direction == 'vertical' ? config.height : config.width;
        let delta = client * (this.bounding / bounds);
        
        classes.add(config.$body, 'is-dragging');

        this.pos.target = delta;
        this.pos.target = utils.js.clamp(0, this.pos.target, this.bounding);

        this.scrollbar && (this.scrollbar.drag.delta = this.pos.target);
    }

    /* -----
    resize
    ----- */
    resize() {

        this.pos.height = config.height;
        
        this.bounding = this.dom.section.getBoundingClientRect().height - config.height;
    }

    /* -----
    destroy
    ----- */
    destroy() {
        
        this.removeFakeScrollBar();

        this.removeEvents();

        this.vs.destroy();
    }
}

export default Smooth