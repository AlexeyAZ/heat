require('babel-polyfill');
const scrollMonitor = require('scrollMonitor');
const MobileDetect = require('mobile-detect');

const app = {

	load: () => {
		app.bindEvents();
	},

	bindEvents: () => {

		const md = new MobileDetect(window.navigator.userAgent);

		function getCoords(elem) {
			const box = elem.getBoundingClientRect();

			return {
				top: box.top + pageYOffset,
				left: box.left + pageXOffset
			};
		}

		function randomVal(min, max) {
			let rand = min - 0.5 + Math.random() * (max - min + 1);
			rand = Math.round(rand);
			return rand;
		}

		function chaoticMove() {
			const pEl = document.querySelectorAll('[data-parallaxify-range-x]');

			function move(el) {
				const elX = getCoords(el).left;
				const elY = getCoords(el).top;

				const container = {
					topY: document.querySelector('.sec_2').getBoundingClientRect().top,
					bottomY: document.querySelector('.sec_2').getBoundingClientRect().top + document.querySelector('.sec_2').clientHeight,
					rightX: document.documentElement.clientWidth,
					height: document.querySelector('.sec_2').clientHeight + 100,
					width: document.documentElement.clientWidth + 200
				};

				const offTop = el.offsetTop;
				const offLeft = el.offsetLeft;

				let randomX;
				let randomY;
				let rotate;
				let rotateVal;
				let randomRotate;

				if (elX < 0) {
					randomX = randomVal(offLeft + 200, container.height - elX);
				}else {
					randomX = randomVal(-offLeft - 200, container.height - elX);
				}

				if (elY < 0) {
					randomY = randomVal(offTop + 100, container.width - elY);
				}else {
					randomY = randomVal(-offTop - 100, container.width - elY);
				}

				rotateVal = randomVal(-360, 360);
				randomRotate = Math.abs(randomVal(0, 1));
				rotate = randomRotate === 1 ? ' rotate(' + rotateVal + 'deg)' : '';

				el.style.transition = randomVal(5, 10) + 's ease';
				el.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)' + rotate;
			}

			function start() {

				[...pEl].forEach(function (el) {

					move(el);
					el.addEventListener('transitionend', move.bind(null, el), false);
				});
			}

			function stop() {
				[...pEl].forEach(function (el) {
					el.removeEventListener('transitionend', move);
					el.style.transition = '';
				});
			}

			return {
				start,
				stop
			};
		}

		function startChaos() {

			let timer;

			document.addEventListener('mousemove', function () {
				chaoticMove().stop();
				clearTimeout(timer);
				timer = setTimeout(chaoticMove().start, 3000);
			});
		}

		function scrollPage(options) {
			const sections = document.querySelectorAll(options.sectionClass);
			const watchers = [...sections].map(element => {
				const watcher = scrollMonitor.create(element);
				watcher.lock();

				watcher.stateChange(function () {

					if (this.isAboveViewport) {

						element.classList.contains('fixed') ? false : element.classList.add('fixed');
					}else {
						element.classList.remove('fixed');
					}
				});
				return watcher;
			});
		}

		if (md.mobile()) {

			document.documentElement.classList.add('mobile');
		}else {

			startChaos();

			ParallaxScroll.init();

			scrollPage({
				sectionClass: '.sec'
			});
		}

		function setMainTheme(activeItem) {
			document.body.className = '';
			document.body.classList.add('slide_' + activeItem);
		}

		function createOptionsObj(options) {
			const totalSlider = document.querySelector('.agallery_1 .swiper-slide').length;
			const pagination = options.pagination === false ? '' : options.pagination;
			const autoplay = options.autoplay === undefined ? '' : 3000;
			const coverflow = options.coverflow;

			return {
				loop: true,
				pagination,
				paginationClickable: true,
				effect: options.coverflow === undefined ? 'slide' : 'coverflow',
				loopedSlides: totalSlider,
				autoplay,
				autoplayDisableOnInteraction: false,
				coverflow: {
					rotate: 100,
					stretch: 20,
					depth: 150,
					modifier: 1,
					slideShadows: false
				},
				// initialSlide: 2,
				parallax: options.coverflow === undefined ? false : true,
				speed: 1000,
				runCallbacksOnInit: false,
				onInit: swiper => {
					setMainTheme(swiper.realIndex + 1);
					

					$.parallaxify({
						positionProperty: 'transform',
						responsive: true
					});
				},
				onSlideNextStart: swiper => {
					setMainTheme(swiper.realIndex + 1);

					setTimeout(function () {
						mySwiper2.slideNext();
					}, 500);
				},
				onSlidePrevStart: swiper => {
					setMainTheme(swiper.realIndex + 1);

					setTimeout(function () {
						mySwiper2.slidePrev();
					}, 500);
				},
				onProgress: swiper => {

					$.parallaxify({
						positionProperty: 'transform',
						responsive: true
					});
				}
			};
		}

		const mySwiper1 = new Swiper('.agallery_1', createOptionsObj({coverflow: true, autoplay: true, pagination: '.agallery__pagination_1'}));
		const mySwiper2 = new Swiper('.agallery_2', createOptionsObj({coverflow: true, pagination: false}));
		const mySwiper3 = new Swiper('.agallery_3', createOptionsObj({coverflow: true, pagination: '.agallery__pagination_3'}));

		mySwiper1.params.control = mySwiper3;
		// mySwiper3.params.control = mySwiper2;

		const galleryes = document.querySelectorAll('.agallery');
		[...galleryes].forEach(function (gallery) {
			gallery.addEventListener('click', function (e) {

				const windowWidth = document.documentElement.clientWidth / 2;
				const clickXCoord = e.clientX;

				if (clickXCoord > windowWidth) {
					mySwiper1.slideNext();
				}else {
					mySwiper1.slidePrev();
				}
			});
		});
	}
};
window.onload = app.load;



