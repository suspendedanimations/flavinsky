import config from '../config';
import utils from '../utils';
import Default from './smooth';

class Parallax extends Default {

    constructor(opt) {

        super(opt);

        this.dom.header = opt.header;
    }

    init() {

        super.init();
    }

    run() {

        super.run();
        
        const delta = (this.pos.current / (config.height / 8));
        const unit = delta * 0.02;
        const translate = Math.abs(this.pos.current*0.01);
        const transform = `skewX(${delta*0.7.toFixed(3)}deg) skewY(${unit.toFixed(3)}deg) rotateX(${delta.toFixed(3)}deg) translate3d(0,-${translate.toFixed(3)}px,0)`;
        
        this.dom.header.style[this.prefix] = transform;
    }
}

export default Parallax