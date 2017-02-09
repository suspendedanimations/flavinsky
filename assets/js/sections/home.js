import config from '../config';
import utils from '../utils';
import classes from 'dom-classes';
import event from 'dom-events';
import query from 'query-dom-components';
import gsap from 'gsap';
import Default from './default';
import Smooth from '../lib/smooth';

class Home extends Default {
	
	constructor(opt) {
		
		super(opt);

		this.createBounds();

		this.slug = 'home';
		this.ui = null;

	}
	
	init(req, done) {
		
		super.init(req, done);

	}

	createBounds() {

		['mouseIn', 'mouseOut']
		.forEach((fn) => this[fn] = this[fn].bind(this));
	}

	dataAdded(done) {

		this.ui = query({ el: this.page });
		this.ui.numbers = this.ui.index.querySelectorAll('span');

		this.smooth = new Smooth({
			section: this.ui.section
		});
		
		this.smooth.init();

		// this.pixi = new PixiHover({
		// 	container: this.ui.container,
		// 	dom: this.ui.item
		// });

		// this.pixi.init();

		this.addEvents();

		done();
	}

	mouseIn(e) {

		const title = e.currentTarget.getAttribute('data-title');

		this.ui.title.innerHTML = title;
	}

	mouseOut(e) {

		this.ui.title.innerHTML = '';
	}

	addEvents() {

		if(!this.ui) return;

		utils.js.arrayFrom(this.ui.item).forEach((el) => {
			event.on(el, 'mouseenter', this.mouseIn);
			event.on(el, 'mouseleave', this.mouseOut);
		});
	}

	removeEvents() {

		if(!this.ui) return;

		utils.js.arrayFrom(this.ui.item).forEach((el) => {
			event.off(el, 'mouseenter', this.mouseIn);
			event.off(el, 'mouseleave', this.mouseOut);
		});
	}

	animateIn(req, done) {

		classes.add(config.$body, 'is-'+this.slug);

		const tl = new TimelineMax({ paused: true, onComplete: done });
		
		tl.to(this.page, 1.1, { autoAlpha: 1, ease: Expo.easeOut });
		tl.staggerFrom(this.ui.numbers, 1.3, {cycle: {y: [-config.height, config.height]}, ease: Expo.easeOut}, 0.1, 0);
		tl.staggerFrom(this.ui.item, 2, {autoAlpha: 0, cycle: {y: ['-20%', '20%']}, ease: Expo.easeOut}, 0.5, 0);
		tl.restart();
	}

	animateOut(req, done) {

		this.smooth.pos.target = 0;

		if(req.route == '/about') {
			classes.add(config.$body, 'is-white');
		}

		classes.remove(config.$body, 'is-'+this.slug);

		const tl = new TimelineMax({ paused: true, onComplete: done });
		tl.staggerTo(this.ui.numbers, 0.9, {cycle: {y: [-config.height, config.height]}, ease: Expo.easeOut}, 0.1, 0);
		tl.staggerTo(this.ui.item, 0.6, {autoAlpha: 0, cycle: {y: ['20%', '-20%']}, ease: Expo.easeOut}, 0.1, 0);
		if(req.route == '/about') {
			tl.to(this.page, 1.1, {y: '100%', ease: Expo.easeInOut}, 0.86);
		} else {
			tl.to(this.page, 1.1, {autoAlpha: 0, ease: Expo.easeInOut}, 0);
		}
		tl.restart();
	}

	destroy(req, done) {

		this.removeEvents();

		this.smooth.destroy();

		this.ui = null;

		this.page.parentNode.removeChild(this.page);
		
		done();
	}

}

export default Home