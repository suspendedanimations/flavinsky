import config from '../config';
import classes from 'dom-classes';
import create from 'dom-create-element';
import gsap from 'gsap';

TweenLite.defaultEase = Expo.easeOut;

class Preloader {
	
	constructor(onComplete) {
		
		this.date = new Date();
		this.preloaded = onComplete;
		this.view = config.$view;
		this.el = null;

		

		this.isMobile = config.isMobile = config.width <= 1024 ? true : false;

	}
	
	init(req, done) {

		classes.add(config.$body, 'is-loading');
        	
		this.createDOM();

		done();

	}
	
	createDOM() {

		const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		if(isSafari) classes.add(config.$body, 'is-safari');
		
		const page = this.view.firstChild;
		const hm = this.date.getHours() + (this.date.getMinutes() / 100);
		const bonquoi = hm > 19.00 && hm < 23.59 ? 'Bonsoir.' : 'Bonjour.';

		this.el = create({
			selector: 'div',
			styles: 'preloader',
			html: `<div class="vertical-center"><div class="vertical-el"><p>${bonquoi}</p></div></div>`
		});

		this.view.insertBefore(this.el, page);

	}

	resize(width, height) {

		config.width = width;
		config.height = height;

	}

	animateIn(req, done) {

		let tl = new TimelineMax({ paused: true, onComplete: () => {
			done();
			// call this.preloaded to bring the first route
			this.preloaded();
		}});
		tl.to(this.el, 1, {autoAlpha: 1});
		tl.restart();

	}
	
	animateOut(req, done) {

		let tl = new TimelineMax({ paused: true, onComplete: done });
		tl.to(this.el, 0.8, {autoAlpha: 0});
		tl.restart();

	}

	destroy(req, done) {

		classes.add(config.$body, 'is-loaded');
		classes.remove(config.$body, 'is-loading');

		this.view.removeChild(this.el);

		done();

	}

}

export default Preloader