import config from '../../config';
import utils from '../../utils';
import PIXI from 'pixi.js';
import PixiJS from './default';

class Cover extends PixiJS {

    constructor(opt) {

        super(opt);

        this.image = this.container.getAttribute('data-image');
    }

    init() {
        
        super.init();
        
        window.delta = 0;

        PIXI.loader.reset();
        
        const source = PIXI.loader.add('el', this.image);
        
        this.container.appendChild(this.renderer.view);

        source.load((loader, resources) => {
            
            this.el = new PIXI.Sprite(resources.el.texture);
            
            this.resize(config.width, config.height);
            
            this.sprite.displacement = PIXI.Sprite.fromImage('assets/images/displacement.jpg');
            
            this.fx.blur = new PIXI.filters.BlurFilter();
            this.fx.twist = new PIXI.filters.TwistFilter();
            
            this.fx.blur.blur = 0.01;
            
            this.fx.twist.radius = 0.1;
            this.fx.twist.angle = 0.1;
            this.fx.twist.offset.x = 0.1;
            this.fx.twist.offset.y = 0.1;

            this.fx.displacement = new PIXI.filters.DisplacementFilter(this.sprite.displacement);
            this.fx.displacement.scale.x = 0;
            this.fx.displacement.scale.y = 0;

            this.stage.addChild(this.el);
            this.stage.addChild(this.sprite.displacement);

            this.el.filters = [
                this.fx.blur,
                this.fx.twist,
                this.fx.displacement,
            ];

            this.animate();
        });
    }

    animate() {

        super.animate();

        this.rAF = requestAnimationFrame(this.animate);

        const delta = window.delta * 0.1;
        
        if(delta < 10) {
            this.fx.twist.radius = delta * 0.1;
            this.fx.twist.angle = delta * 0.1;

            this.fx.blur.blur = delta * 0.96;

            this.fx.displacement.scale.x = delta * 15;
            this.fx.displacement.scale.y = delta * 6;
        }
        
        this.renderer.render(this.stage);
    }

    resize(width, height) {

        this.renderer.view.style.width = width + 'px';
        this.renderer.view.style.height = height + 'px';

        if(this.el) {

            var unit = this.getRatio(this.el.width, this.el.height, width, height);
            var max = height - 185;
            
            if(unit.height < max) {
                
                var newWidth = this.el.width * (max / this.el.height);

                this.el.width = newWidth;
                this.el.height = max;
                
            } else if(unit.width < width) {

                var newHeight = this.el.height * (width / this.el.width);

                this.el.width = width;
                this.el.height = newHeight;

            } else {

                this.el.width = unit.width;
                this.el.height = unit.height;
            }

            this.el.position.x = (width - this.el.width) / 2; 
        }

        this.renderer.resize(width, height);
    }
    
    getRatio(srcWidth, srcHeight, maxWidth, maxHeight) {

        var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

        return { width: srcWidth*ratio, height: srcHeight*ratio };
    }

    destroy() {

        super.destroy();

        cancelAnimationFrame(this.rAF);

        this.fx.blur.blur = 0;
        
        this.fx.twist.radius = 0;
        this.fx.twist.angle = 0;
        this.fx.twist.offset.x = 0;
        this.fx.twist.offset.y = 0;

        this.fx.displacement.scale.x = 0;
        this.fx.displacement.scale.y = 0;

        PIXI.loader.reset();

        this.stage.removeChild(this.el);
        this.stage.removeChild(this.sprite.displacement);
    }
}

export default Cover