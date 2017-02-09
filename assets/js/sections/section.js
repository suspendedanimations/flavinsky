import config from '../config';
import utils from '../utils';
import gsap from 'gsap';
import classes from 'dom-classes';
import query from 'query-dom-components';
import Default from './default';
import Smooth from '../lib/smooth';
import PixiCover from '../lib/pixi/cover';
import _ from 'underscore';

class Section extends Default {
	
	constructor(opt) {
		
		super(opt);

		this.slug = 'section';
	}
	
	init(req, done) {

		super.init(req, done);

	}
	
	dataAdded(done) {
		
		this.ui = query({ el: this.page });

		window.delta = 0;

		this.smooth = new Smooth({
			section: this.ui.section
		});

		this.pixi = new PixiCover({
			container: this.ui.container
		});

		this.pixi.init();
		
		done();

	}

	animateIn(req, done) {

		classes.add(config.$body, 'is-'+this.slug);

		const tl = new TimelineMax({ paused: true, onComplete: () => {
			this.smooth.init();
			done();
		}});
		
		tl.to(this.page, 1, { autoAlpha: 1, ease: Expo.easeInOut, clearProps: 'transform' });
		tl.to(this.ui.layer, 1.3, {y: '100%', ease: Expo.easeInOut});
		tl.from(this.ui.bar, 0.9, {y: '100%', ease: Expo.easeInOut});
		tl.restart();
	}

	animateOut(req, done) {

		if(this.smooth.pos.target < config.height) {
			this.smooth.pos.target = 0;
		}

		classes.remove(config.$body, 'is-'+this.slug);

		TweenLite.to(this.page, 0.7, {
			autoAlpha: 0,
			ease: Expo.easeInOut,
			clearProps: 'all',
			onComplete: done
		});
		
	}

	resize(width, height) {
        
        super.resize(width, height);
        
        this.pixi.resize(width, height);
        
        // _.debounce(() => {
        // }, 200);
    }
	
	destroy(req, done) {
		
		window.delta = 0;
		
		this.pixi && this.pixi.destroy();
		this.smooth && this.smooth.destroy();
		
		this.page.parentNode.removeChild(this.page);
		
		done();

	}

}

export default Section