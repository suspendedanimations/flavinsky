import config from '../config';
import utils from '../utils';
import classes from 'dom-classes';
import query from 'query-dom-components';
import gsap from 'gsap';
import Default from './default';
import Parallax from '../lib/about';

class About extends Default {
	
	constructor(opt) {
		
		super(opt);

		this.slug = 'about';

	}
	
	init(req, done) {
		
		super.init(req, done);

	}

	dataAdded(done) {

		this.ui = query({ el: this.page });
		this.ui.spans = this.ui.header.querySelectorAll('span');

		this.smooth = new Parallax({
			header: this.ui.header,
			section: this.ui.section
		});

		this.smooth.init();

		done();

	}

	animateIn(req, done) {

		classes.add(config.$body, 'is-'+this.slug);

		const tl = new TimelineMax({ paused: true, onComplete: () => {
			classes.remove(config.$body, 'is-white');
			done();
		}});
		
		tl.to(this.page, 0.4, {autoAlpha: 1, ease: Expo.easeOut});
		tl.staggerFrom(this.ui.spans, 1, { cycle: { skewY: [10, -10], skewX: [10, -10], y: ['-10%','10%'], scale: [0.8, 1.2] }, autoAlpha: 0 }, 0.01, 0.1);
		tl.restart();
	}

	animateOut(req, done) {

		classes.remove(config.$body, 'is-'+this.slug);

		const tl = new TimelineMax({ paused: true, onComplete: done });

		tl.to(this.page, 0.6, {autoAlpha: 0, ease: Expo.easeInOut});
		tl.staggerTo(this.ui.spans, 0.6, { autoAlpha: 0, ease: Expo.easeOut }, -0.003, 0);
		tl.restart();
	}

	destroy(req, done) {

		this.smooth.destroy();
		
		this.page.parentNode.removeChild(this.page);
		
		done();

	}

}

export default About