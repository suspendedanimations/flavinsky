import config from '../../config';
import utils from '../../utils';
import PIXI from 'pixi.js';
import $ from 'jquery';

class PixiJS {
    
    constructor(opt = {}) {

        this.createBound();

        this.container = opt.container;
        
        this.renderer = new PIXI.autoDetectRenderer(config.width, config.height, { transparent: true });
        this.stage = new PIXI.Container();
        this.sprite = {};
        this.fx = {};

        this.rAF = undefined;
    }
    
    createBound() {
        
        ['animate']
        .forEach((fn) => this[fn] = this[fn].bind(this));
    }
    
    init() {

        // 
    }

    assetsLoaded() {


    }
    
    animate() {


    }

    destroy() {

        this.container.removeChild(this.renderer.view);
    }
}

export default PixiJS