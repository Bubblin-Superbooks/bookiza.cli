((n, w, d) => {
	/*************************************
	*
	* @exposed methods ala, Public API :-)
	*
	***********************************/
	class Book {
		constructor() {
			this.node = d.getElementById('book')
			this.delegator = d.getElementById('plotter')
			this.state = {
				direction: 'forward',
				isInitialized: false,
				isTurning: false,
				// 'isPeelable': false,
				// 'isZoomed': false,
				// 'isPeeled': false,
				// 'toTurnOrNotToTurn': false,
				// 'eventsCache': [],
				mode: _viewer.getMatch('(orientation: landscape)') ? 'landscape' : 'portrait'
			}

			/******************************************************
			*  @plotter.origin is set at the center of the viewport,
			*  thus splitting the screen into four quadrants instead
			*  of the default IV-quadrant referencing used in basic
			*  scroll animation mechanics of the browser.
			*******************************************************/
			this.plotter = {
				origin: {
					x: `${parseInt(d.getElementsByTagName('body')[0].getBoundingClientRect().width) / 2}`,
					y: `${parseInt(d.getElementsByTagName('body')[0].getBoundingClientRect().height) / 2}`
				}
			}
			this.plotter.bounds = _setGeometricalPremise(this.node)
			this.elements = [...this.node.children] // Source via http request. Or construct via React/JSX like template transformation.
			this.buttons = this.elements.splice(0, 2)
			/******************************************************
			* @frame is a page element with wrappers
			* and shadow elements and/or pseudos (before: :after)
			* that is printable into the DOM.
			*******************************************************/

			this.frames = this.elements.map((page, index) => _addPageWrappersAndBaseClasses(page, index))

			/******************************************************
			*  @range is set of printable frames for the viewport: 			// this.range = [] 	*
			*  TODO: Use [ p, q, r, s, t, u, v ] standard snapshots								*
			*******************************************************/
			this.tick = 0 /* Count the number of pages ticked before book goes to isTurning: false state again */

			/* Turn events */
			this.turned = new Event('turned')
			this.turning = new Event('turning')
		}
		// PROPERTIES
		dimensions() {
			return { width: `${_book.plotter.bounds.width}`, height: `${_book.plotter.bounds.height}` }
		}

		view() {
			return _setViewIndices(_getCurrentPage(_book.currentPage), _book.state.mode).map((i) => i + 1) // Array of page numbers in the [View].
		}

		page() {
			return _book.currentPage
		}

		getLength() {
			return _book.frames.length
		}

		getMode() {
			return _book.state.mode
		}

		hasPage(args) {
			let index = parseInt(args[0]) - 1
			return !!index.between(0, _book.frames.length)
		}

		addEvents(eventName, callback) {
			_book.node.addEventListener(eventName, callback, false)
		}

	}

	/************************************
		 ******** Geometry listeners ********
		 ************************************/

	const _setGeometricalPremise = (node) => node.getBoundingClientRect()

	const _resetGeometricalPremise = () => { _book.plotter.bounds = _setGeometricalPremise(_book.node) }

	w.addEventListener('resize', _resetGeometricalPremise) // Recalibrate geometrical premise.

	const _setGeometricalOrigin = () => ({
		x: `${parseInt(d.getElementsByTagName('body')[0].getBoundingClientRect().width) / 2}`,
		y: `${parseInt(d.getElementsByTagName('body')[0].getBoundingClientRect().height) / 2}`
	})

	const _resetGeometricalOrigin = () => { _book.plotter.origin = _setGeometricalOrigin() }

	w.addEventListener('resize', _resetGeometricalOrigin) // Re-calibrate geometrical origin.

	/****************************************
	* One time @superbook initialization.
	* The minimum length of a book is 4 pages. (options.length)
	* Pages could be provided to Bookiza via DOM or be synthesized
	* using length value passed as an object property for initialization.
	* Force the book length to always be an even number: https://bubblin.io/docs/concept
	************************************/

	const _initializeSuperBook = ({ options = { duration: 300, peel: true, zoom: true, startPage: 1, length: 4 } }) => {
		_removeChildren(_book.node)

		delete _book.elements /* Clear object property from { _book } after a mandatory DOM lookup. */

		_book.options = options /* Save options to the book */

		let size = _book.frames.length === 0 ? Number.isInteger(options.length) ? options.length >= 4 ? _isOdd(options.length) ? options.length + 1 : options.length : 4 : 4 : _isOdd(_book.frames.length) ? _book.frames.length + 1 : _book.frames.length

		if (_book.frames.length === 0) _book.frames = _reifyPages(size)

		if (_isOdd(_book.frames.length)) _book.frames.push(_createFrame(_book.frames.length))

		_applyEventListenersOnBook(_setCurrentPage(options.startPage)) // Event delegation via #plotter node.


		_printElementsToDOM('buttons', _book.buttons)

		_printElementsToDOM('view', _setViewIndices(_getCurrentPage(_book.currentPage), _book.state.mode).map((index) => _book.frames[`${index}`]), _book.tick)

		_book.state.isInitialized = true


		// console.log('Second') // To prove that the book is printed before DOMContentLoaded event is fired.

	}

	const handler = (event) => {
		if (!event.target) return

		event.stopPropagation()
		event.preventDefault()

		switch (event.type) {
			case 'mouseover':
				_handleMouseOver(event)
				break
			case 'mouseout':
				_handleMouseOut(event)
				break
			case 'mousemove':
				_handleMouseMove(event)
				break
			case 'mousedown':
				_handleMouseDown(event)
				break
			case 'mouseup':
				_handleMouseUp(event)
				break
			case 'click':
				_handleMouseClicks(event)
				break
			case 'dblclick':
				_handleMouseDoubleClick(event)
				break
			case 'wheel':
				_handleWheelEvent(event)
				break
			case 'keydown':
				_handleKeyDownEvent(event)
				break
			case 'keypress':
				_handleKeyPressEvent(event)
				break
			case 'keyup':
				_handleKeyUpEvent(event)
				break
			case 'touchstart':
				_handleTouchStart(event)
				break
			case 'touchmove':
				_handleTouchMove(event)
				break
			case 'touchend':
				_handleTouchEnd(event)
				break
			default:
				console.log(event) // Ignore all other events.
				break
		}
	}

	const mouseEvents = ['mousemove', 'mouseover', 'mousedown', 'mouseup', 'mouseout', 'click', 'dblclick', 'wheel']

	const touchEvents = ['touchstart', 'touchend', 'touchmove']

	const keyEvents = ['keypress', 'keyup', 'keydown']

	const _applyEventListenersOnBook = (callback) => {
		keyEvents.forEach((event) => {
			w.addEventListener(event, handler)
		})

		const _applyBookEvents = () => {
			mouseEvents.map((event) => {
				_book.delegator.addEventListener(event, handler)
			})
		}

		const _removeBookEvents = () => {
			mouseEvents.map((event) => {
				_book.delegator.removeEventListener(event, handler)
			})
		}

		w.addEventListener('mouseover', _applyBookEvents)
		w.addEventListener('mouseout', _removeBookEvents)

		/*  Listen to @touch events only when capable of Touch.
		*   Some Windows/Chrome will return true even when the
		*   screen isn't touch capable. Do not use this to !listen
		*   keyboard/mouse events. Plain and simple. */

		if (_isTouch()) {
			touchEvents.map((event) => {
				_book.delegator.addEventListener(event, handler)
			})
		}

		const mutationConfiguration = { attributes: false, childList: true, subtree: false }

		const mutator = mutations => {

			mutations.map((mutation, index) => {
				// console.log(Array.from(mutation.addedNodes).includes('a#next.arrow-controls.next-page.flex'), index)
				// Array.from(mutation.addedNodes).map(each => { console.log(each)})
			})

			// for (const mutation of mutations) {

			// 	console.log(mutation.addedNodes)

			// 	// console.log(mutation.addedNodes)

			if (mutations.length !== 1) return

			if (_book.state.isInitialized) {
				// _raiseAnimatablePages(_book.targetPage, _book.tick)
				// _animateLeaf(_book.targetPage)
			}


			// }
		}

		const observer = new MutationObserver(mutator)

		observer.observe(_book.node, mutationConfiguration)

		// observer.disconnect() // TODO: If we decide on close to cover functionality.

		if (callback && typeof callback === 'function') callback()
	}

	/****************************************/
	/** *********** Event handlers ***********/
	/****************************************/

	const _handleMouseOver = (event) => {
		switch (event.target.nodeName) {
			case 'A':
				// console.log('Anchor over', event.target.id)
				break
			case 'DIV':
				break
			default:
		}
	}

	const _handleMouseOut = (event) => {
		// TODO: This is where we calculate range pages according to QI-QIV.
		switch (event.target.nodeName) {
			case 'A':
				// console.log('Anchor out', event.target.id)
				break
			case 'DIV':
				break
			default:
		}
	}

	const _handleMouseMove = (event) => {
		_updateGeometricalPlotValues(event)
	}

	const _handleMouseDown = (event) => {
		_book.plotter.side === 'right'
			? _book.state.direction = 'forward'
			: _book.state.direction = 'backward'

		switch (event.target.nodeName) {
			case 'A':
				// console.log('Execute half turn')
				break
			case 'DIV':
				// console.log('Page picked, execute curl')
				// console.log('down', event.pageX)
				break
			default:
		}
	}

	const _handleMouseUp = (event) => {
		switch (event.target.nodeName) {
			case 'A':
				// console.log('Complete the flip')
				break
			case 'DIV':
				// console.log('up', event.pageX) // Calculate x-shift, y-shift.
				break
			default:
		}
	}

	const _handleMouseClicks = (event) => {
		switch (event.target.nodeName) {
			case 'A':
				_book.state.direction = event.target.id === 'next' ? 'forward' : 'backward'

				_book.state.isTurning ? _book.tick += 1 : _book.tick = 1

				_book.state.direction === 'forward'
					? _printElementsToDOM('rightPages', _getRangeIndices(_getCurrentPage(_book.targetPage), _book.state.mode).rightPageIndices.map((index) => _book.frames[`${index}`]), _book.tick)
					: _printElementsToDOM('leftPages', _getRangeIndices(_getCurrentPage(_book.targetPage), _book.state.mode).leftPageIndices.map((index) => _book.frames[`${index}`]), _book.tick)


				_raiseAnimatablePages(_book.targetPage, _book.tick)
				_animateLeaf(_book.targetPage)

				_book.targetPage = _target(_book.state.direction)

				break
			case 'DIV':
				break
			default:
		}
	}

	const _handleMouseDoubleClick = (event) => {
		switch (event.target.nodeName) {
			case 'A':
				break
			case 'DIV':
				break
			default:
		}
	}

	const _handleWheelEvent = (event) => {
		switch (event.target.nodeName) {
			case 'A':
				_book.state.direction = event.deltaY < 0 ? 'backward' : 'forward'

				// _book.state.isTurning ? _book.tick += 1 : _book.tick = 1

				// _book.state.direction === 'forward'
				// 	? _printElementsToDOM('rightPages', _getRangeIndices(_getCurrentPage(_book.targetPage), _book.state.mode).rightPageIndices.map((index) => _book.frames[`${index}`]), _book.tick)
				// 	: _printElementsToDOM('leftPages', _getRangeIndices(_getCurrentPage(_book.targetPage), _book.state.mode).leftPageIndices.map((index) => _book.frames[`${index}`]), _book.tick)

				// _raiseAnimatablePages(_book.targetPage, _book.tick)

				// _animateLeaf(_book.targetPage)

				// _book.targetPage = _target(_book.state.direction)

				break
			case 'DIV':
				break
			default:
		}
	}

	const _handleKeyPressEvent = (event) => {
		// console.log('pressed', event.keyCode)
	}

	const _handleKeyDownEvent = (event) => {
		// console.log('down', event.keyCode)
	}

	const _handleKeyUpEvent = (event) => {
		// console.log('up', event.keyCode)
	}

	const _handleTouchStart = (event) => {
		if (event.touches.length === 2) {
		}
		console.log(event.touches.length)
	}

	const _handleTouchMove = (event) => {
		_updateGeometricalPlotValues(event)
	}

	const _handleTouchEnd = (event) => {
		console.log('Touch stopped')
	}

	/**********************************/
	/** ****** Animation methods *******/
	/**********************************/

	const _kf1 = () => [
		{ transform: 'rotateY(0deg)', transformOrigin: 'left center 0' },
		{ transform: 'rotateY(-180deg)', transformOrigin: 'left center 0' }
	]

	const _kf2 = () => [
		{ transform: 'rotateY(180deg)', transformOrigin: 'right center 0' },
		{ transform: 'rotateY(0deg)', transformOrigin: 'right center 0' }
	]

	const _kf3 = () => [
		{ transform: 'rotateY(0deg)', transformOrigin: 'right center 0' },
		{ transform: 'rotateY(180deg)', transformOrigin: 'right center 0' }
	]

	const _kf4 = () => [
		{ transform: 'rotateY(-180deg)', transformOrigin: 'left center 0' },
		{ transform: 'rotateY(0deg)', transformOrigin: 'left center 0' }
	]


	const _options = ({ duration = _book.options.duration, bezierCurvature = 'ease-in' }) => ({
		currentTime: 0,
		duration: duration,
		easing: bezierCurvature,
		fill: 'forwards',
		iterations: 1,
		direction: 'normal'
	})

	const _raiseAnimatablePages = (pageNo, tick) => {
		switch (_book.state.direction) {
			case 'forward':
				switch (_book.state.mode) {
					case 'portrait':
						break
					case 'landscape':
						if (!_book.state.isTurning) _book.frames[_setViewIndices(_getCurrentPage(pageNo), _book.state.mode)[0]].style.zIndex = tick - _book.frames.length
						_book.frames[_setViewIndices(_getCurrentPage(pageNo), _book.state.mode)[1]].style.zIndex = - tick
						break
					default:
						break
				}
				break
			case 'backward':
				switch (_book.state.mode) {
					case 'portrait':
						break
					case 'landscape':
						if (!_book.state.isTurning) _book.frames[_setViewIndices(_getCurrentPage(pageNo), _book.state.mode)[1]].style.zIndex = tick - _book.frames.length
						_book.frames[_setViewIndices(_getCurrentPage(pageNo), _book.state.mode)[0]].style.zIndex = - tick
						break
					default:
						break
				}
				break
		}
	}



	const _animateLeaf = (pageNo) => {
		_book.state.isTurning = true

		_book.turning.page = _getCurrentPage(pageNo)
		_book.turning.view = _setViewIndices(_getCurrentPage(pageNo), _book.state.mode).map((i) => i + 1) // Array of page numbers in the [View].

		_book.node.dispatchEvent(_book.turning)


		switch (_book.state.mode) {
			case 'portrait':
				break
			case 'landscape':
				switch (_book.state.direction) {
					case 'forward':
						let animation1 = _book.frames[_setViewIndices(_getCurrentPage(pageNo), _book.state.mode)[1]].childNodes[0].animate(_kf1(), _options({}))

						let animation2 = _book.frames[_getRangeIndices(_getCurrentPage(pageNo), _book.state.mode).rightPageIndices[0]].childNodes[0].animate(_kf2(), _options({}))

						animation1.onfinish = (event) => {
							animation1.cancel()
							_setViewIndices(_getCurrentPage(pageNo), _book.state.mode).map((index) => { _removeElementFromDOMById(index + 1) })

						}

						animation2.onfinish = (event) => {
							_book.state.isTurning = false
							_setCurrentPage(_book.targetPage)

							_book.turned.page = _getCurrentPage(pageNo)
							_book.turned.view = _setViewIndices(_getCurrentPage(pageNo), _book.state.mode).map((i) => i + 1) // Array of page numbers in the [View].
							_book.node.dispatchEvent(_book.turned)

						}
						break
					case 'backward':

						let animation3 = _book.frames[_setViewIndices(_getCurrentPage(pageNo), _book.state.mode)[0]].childNodes[0].animate(_kf3(), _options({}))

						let animation4 = _book.frames[_getRangeIndices(_getCurrentPage(pageNo), _book.state.mode).leftPageIndices[1]].childNodes[0].animate(_kf4(), _options({}))

						animation3.onfinish = (event) => {
							animation3.cancel()
							_setViewIndices(_getCurrentPage(pageNo), _book.state.mode).map((index) => { _removeElementFromDOMById(index + 1) })
						}

						animation4.onfinish = (event) => {
							_book.state.isTurning = false
							_setCurrentPage(_book.targetPage)

							_book.turned.page = _getCurrentPage(pageNo)
							_book.turned.view = _setViewIndices(_getCurrentPage(pageNo), _book.state.mode).map((i) => i + 1) // Array of page numbers in the [View].
							_book.node.dispatchEvent(_book.turned)


						}
						break
				}


				break
		}
	}


	/**********************************
	********** @Helper methods ********
	***********************************/

	const _isTouch = () => 'ontouchstart' in w || n.MaxTouchPoints > 0 || n.msMaxTouchPoints > 0

	const _isEven = (number) => (number === parseFloat(number) ? !(number % 2) : void 0)

	const _isOdd = (number) => Math.abs(number % 2) === 1

	//   const _sign = (x) => (typeof x === 'number' ? (x ? (x < 0 ? -1 : 1) : x === x ? 1 : NaN) : NaN)

	const _leftCircularIndex = (currentIndex, index) =>
		parseInt(currentIndex) - parseInt(index) < 0
			? parseInt(_book.frames.length) + (parseInt(currentIndex) - parseInt(index))
			: parseInt(currentIndex) - parseInt(index)

	const _rightCircularIndex = (currentIndex, index) =>
		parseInt(currentIndex) + parseInt(index) >= parseInt(_book.frames.length)
			? parseInt(currentIndex) + parseInt(index) - parseInt(_book.frames.length)
			: parseInt(currentIndex) + parseInt(index)

	const _stepper = (mode) => (mode === 'portrait' ? 1 : 2)

	const π = Math.PI

	const _radians = (degrees) => degrees / 180 * π

	const _degrees = (radians) => radians / π * 180

	const Δ = (displacement) => { } // Displacement on mousedown + mousemove/touchstart + touchmove

	const λ = (angle) => { } // Cone angle

	// const _setFlippingDirection = () => (_book.plotter.side === 'right') ? 'forward' : 'backward'

	// w.requestAnimationFrame = (() => w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.mozRequestAnimationFrame || w.oRequestAnimationFrame || w.msRequestAnimationFrame || function (callback) { w.setTimeout(callback, 1E3 / 60) })()

	const _step = () =>
		_book.state.direction === 'forward'
			? _isEven(_book.targetPage) ? _stepper(_book.state.mode) : 1
			: _isOdd(_book.targetPage) ? _stepper(_book.state.mode) : 1

	const _target = (direction) =>
		direction === 'forward'
			? _getCurrentPage(_book.targetPage + _step())
			: _getCurrentPage(_book.targetPage - _step())

	const _setCurrentPage = (pageNo) => {
		_book.targetPage = _book.currentPage = _getCurrentPage(pageNo)
	}

	const _getCurrentPage = (pageNo) =>
		pageNo === undefined
			? 1
			: parseInt(pageNo) > 0 && parseInt(pageNo) < parseInt(_book.frames.length)
				? parseInt(pageNo) % parseInt(_book.frames.length)
				: parseInt(pageNo) % parseInt(_book.frames.length) === 0
					? parseInt(_book.frames.length)
					: parseInt(pageNo) < 0
						? parseInt(_book.frames.length) + 1 + parseInt(pageNo) % parseInt(_book.frames.length)
						: parseInt(pageNo) % parseInt(_book.frames.length) // Process current page cyclically.

	const _setViewIndices = (currentPage = 1, mode) => {
		let currentIndex = parseInt(currentPage) - 1

		switch (mode) {
			case 'portrait':
				return [currentIndex]
				break
			case 'landscape':
				if (_isEven(parseInt(currentPage))) {
					/***************************************
					* @range = _book.pages.slice(P , Q) where:
					* P & Q are integers
					* P & Q may or may not lie in the range 0 < VALUES < 2N (_book.length)
					****************************************/
					let q =
						parseInt(currentPage) + 1 > parseInt(_book.frames.length)
							? 1
							: (parseInt(currentPage) + 1) % parseInt(_book.frames.length)
					return [currentIndex, q - 1]
				} else {
					let p =
						parseInt(currentPage) - 1 < 1
							? _book.frames.length
							: (parseInt(currentPage) - 1) % parseInt(_book.frames.length)
					return [p - 1, currentIndex]
				}
				break
		}
	}

	const _getRangeIndices = (currentPage = 1, mode) => {
		let currentIndex = parseInt(currentPage) - 1

		/*****************************************
		* @range = _book.pages.slice(P , Q) where:
		* P, Q, R, S are integers
		* P, Q, R, S may or may not lie in the range 0 < VALUE < 2N (_book.length)
		******************************************/

		let [p, q, r, s] = [0]

		switch (mode) {
			case 'portrait':
				// let p = (currentIndex - 2 < 0) ? parseInt(_book.frames.length) + (currentIndex - 2) : (currentIndex - 2)
				// let q = (currentIndex - 1 < 0) ? parseInt(_book.frames.length) + (currentIndex - 1) : (currentIndex - 1)
				// let r = (currentIndex + 1 >= parseInt(_book.frames.length)) ? (currentIndex + 1) - parseInt(_book.frames.length) : (currentIndex + 1)
				// let s = (currentIndex + 2 >= parseInt(_book.frames.length)) ? (currentIndex + 2) - parseInt(_book.frames.length) : (currentIndex + 2)
				p = _leftCircularIndex(currentIndex, 2)
				q = _leftCircularIndex(currentIndex, 1)
				r = _rightCircularIndex(currentIndex, 1)
				s = _rightCircularIndex(currentIndex, 2)
				break
			case 'landscape':
				if (_isEven(parseInt(currentPage))) {
					// let p = (currentIndex - 2 < 0) ? parseInt(_book.frames.length) + (currentIndex - 2) : (currentIndex - 2)
					// let q = (currentIndex - 1 < 0) ? parseInt(_book.frames.length) + (currentIndex - 1) : (currentIndex - 1)
					// let r = (currentIndex + 2 >= parseInt(_book.frames.length)) ? (currentIndex + 2) - parseInt(_book.frames.length) : (currentIndex + 2)
					// let s = (currentIndex + 3 >= parseInt(_book.frames.length)) ? (currentIndex + 3) - parseInt(_book.frames.length) : (currentIndex + 3)
					p = _leftCircularIndex(currentIndex, 2)
					q = _leftCircularIndex(currentIndex, 1)
					r = _rightCircularIndex(currentIndex, 2)
					s = _rightCircularIndex(currentIndex, 3)
				} else {
					// let p = (currentIndex - 3 < 0) ? parseInt(_book.frames.length) + (currentIndex - 3) : (currentIndex - 3)
					// let q = (currentIndex - 2 < 0) ? parseInt(_book.frames.length) + (currentIndex - 2) : (currentIndex - 2)
					// let r = (currentIndex + 1 >= parseInt(_book.frames.length)) ? currentIndex + 1 - parseInt(_book.frames.length) + 1 : (currentIndex + 1)
					// let s = (currentIndex + 2 >= parseInt(_book.frames.length)) ? currentIndex + 1 - parseInt(_book.frames.length) + 1 : (currentIndex + 2)
					p = _leftCircularIndex(currentIndex, 3)
					q = _leftCircularIndex(currentIndex, 2)
					r = _rightCircularIndex(currentIndex, 1)
					s = _rightCircularIndex(currentIndex, 2)
				}
				break
		}
		return { leftPageIndices: [p, q], rightPageIndices: [r, s] }
	}

	const _removeChildren = (node) => { node.innerHTML = '' }

	// const _removeElementsFromDOMByClassName = (className) => { node.getElementsByClassName(className).remove() }

	const _removeElementFromDOMById = (id) => { if (d.getElementById(id) !== null) d.getElementById(id).remove() }

	const _reifyPages = size => [...d.createRange()
		.createContextualFragment(new String(new Array(size)
			.fill()
			.map((v, i) => `<div class="page"><iframe src="./renders/page-${i + 1}.html"></iframe></div>`)))
		.querySelectorAll('div')
	].map((page, index) => _addPageWrappersAndBaseClasses(page, index))

	const _createFrame = (index, html) =>
		html === undefined
			? _addPageWrappersAndBaseClasses(d.createRange().createContextualFragment(`<div class="page"><iframe src="./renders/page-${index}.html"></iframe></div>`).firstChild, index)
			: _addPageWrappersAndBaseClasses(html, index)



	const _printElementsToDOM = (type, elements, tick = _book.frames.length) => {
		const docfrag = d.createDocumentFragment()
		switch (type) {
			case 'buttons':
				elements.forEach((elem) => {
					docfrag.appendChild(elem)
				})
				break
			case 'view':
				let pageList = elements.map((page, currentIndex) => {
					return _applyStyles(page, currentIndex, type, tick)
				})
				pageList.forEach((page) => {
					docfrag.appendChild(page)
				})
				break
			case 'rightPages':
				let rightPages = elements.map((page, currentIndex) => {
					return _applyStyles(page, currentIndex, type, tick)
				})
				rightPages.forEach((page) => {
					docfrag.appendChild(page)
				})
				break
			case 'leftPages':
				let leftPages = elements.map((page, currentIndex) => {
					return _applyStyles(page, currentIndex, type, tick)
				})
				leftPages.forEach((page) => {
					docfrag.appendChild(page)
				})
				break
		}
		_book.node.appendChild(docfrag)
	}

	const _applyStyles = (pageObj, currentIndex, type, tick) => {
		let cssString = ''
		switch (_book.state.mode) {
			case 'portrait':
				switch (type) {
					case 'view':
						// inner
						cssString =
							'transform: translate3d(0, 0, 0) rotateY(0deg) skewY(0deg); transform-origin: 0 center 0;'
						pageObj.childNodes[0].style = cssString
						// wrapper
						cssString = 'z-index: 2; float: left; left: 0;'
						pageObj.style.cssText = cssString
						break
					case 'rightPages':
						// inner
						cssString =
							'transform: translate3d(0, 0, 0) rotateY(0deg) skewY(0deg); transform-origin: 0 center 0; visibility: visible;'
						pageObj.childNodes[0].style = cssString
						// wrapper
						cssString = 'float: left; left: 0; pointer-events:none; visibility: hidden;'
						cssString += _isEven(currentIndex) ? 'z-index: 1; ' : 'z-index: 0;'
						pageObj.style.cssText = cssString
						break
					case 'leftPages':
						// inner
						cssString =
							'transform: translate3d(0, 0, 0) rotateY(-90deg) skewY(0deg); transform-origin: 0 center 0; visibility: visible;'
						pageObj.childNodes[0].style = cssString
						// wrapper
						cssString = 'float: left; left: 0; pointer-events:none; visibility: hidden;'
						cssString += _isEven(currentIndex) ? 'z-index: 0; ' : 'z-index: 1;'
						pageObj.style.cssText = cssString
						break
				}
				break
			case 'landscape':
				switch (type) {
					case 'view':
						cssString = _isEven(currentIndex)
							? 'pointer-events:none; transform: translate3d(0, 0, 0) rotateY(0deg) skewY(0deg); transitions: none;'
							: 'pointer-events:none; transform: translate3d(0, 0, 0) rotateY(0deg) skewY(0deg); transitions: none;'
						pageObj.childNodes[0].style = cssString
						// wrapper
						cssString = `z-index: ${tick}; pointer-events:none;`
						cssString += _isEven(currentIndex) ? 'float: left; left: 0;' : 'float: right; right: 0;'
						pageObj.style = cssString
						break
					case 'rightPages':
						// inner
						cssString = 'pointer-events:none; transitions: none;'
						cssString += _isEven(currentIndex)
							? 'transform: translate3d(0, 0, 0) rotateY(180deg) skewY(0deg); transform-origin: right center 0px;'
							: 'transform: translate3d(0, 0, 0) rotateY(0deg) skewY(0deg); transform-origin: left center 0px;'
						pageObj.childNodes[0].style = cssString
						// wrapper
						cssString = 'pointer-events:none;'
						cssString += _isEven(currentIndex)
							? `z-index: ${tick}; float: left; left: 0;`
							: `z-index: ${tick - _book.frames.length}; float: right; right: 0;`
						pageObj.style.cssText = cssString
						break
					case 'leftPages':
						// inner
						cssString = 'pointer-events:none; transitions: none;'
						cssString += _isEven(currentIndex)
							? 'transform: translate3d(0, 0, 0) rotateY(0deg) skewY(0deg); transform-origin: right center 0px;'
							: 'transform: translate3d(0, 0, 0) rotateY(-180deg) skewY(0deg); transform-origin: left center 0px;'
						pageObj.childNodes[0].style = cssString

						// wrapper
						cssString = 'pointer-events:none;'
						pageObj.style.cssText = cssString
						cssString += _isEven(currentIndex)
							? `z-index: ${tick}; float: left; left: 0;`
							: `z-index: ${tick - _book.frames.length}; float: right; right: 0; `
						pageObj.style.cssText = cssString
						break
				}
		}

		return pageObj
	}

	const _addPageWrappersAndBaseClasses = (pageObj, currentIndex) => {
		_removeClassesFromElem(pageObj, 'page')
		let classes = `promoted inner page-${parseInt(currentIndex) + 1}`
		classes += _isEven(currentIndex) ? ' odd' : ' even'
		_addClassesToElem(pageObj, classes)
		let wrappedHtml = _wrapHtml(pageObj, currentIndex)
		return wrappedHtml
	}

	const _wrapHtml = (pageObj, currentIndex) => {
		const newWrapper = d.createElement('div')
		let classes = 'wrapper'
		classes += _isEven(currentIndex) ? ' odd' : ' even'
		_addClassesToElem(newWrapper, classes)
		newWrapper.setAttribute('id', parseInt(currentIndex) + 1)
		// newWrapper.setAttribute('data-page', parseInt(currentIndex) + 1)
		// Try :before :after pseudo elements instead.
		// newWrapper.innerHTML = `<div class="outer gradient"><h1> View[${parseInt(currentIndex) + 1}]  </h1></div>`
		newWrapper.appendChild(pageObj)
		return newWrapper
	}

	const _updateGeometricalPlotValues = (event) => {
		_book.plotter.side = event.pageX - _book.plotter.origin.x > 0 ? 'right' : 'left'
		_book.plotter.region = event.pageY - _book.plotter.origin.y > 0 ? 'lower' : 'upper'
		_book.plotter.quadrant =
			_book.plotter.side === 'right'
				? _book.plotter.region === 'upper' ? 'I' : 'IV'
				: _book.plotter.region === 'upper' ? 'II' : 'III'
		_book.plotter.currentPointerPosition = JSON.parse(
			`{ "x": "${event.pageX - _book.plotter.origin.x}", "y": "${_book.plotter.origin.y - event.pageY}" }`
		)
		_book.plotter.θ = Math.acos(
			parseInt(_book.plotter.currentPointerPosition.x) * 2 / parseInt(_book.plotter.bounds.width)
		) // θ in radians
		_book.plotter.μ = parseInt(_book.plotter.currentPointerPosition.x) // x-coord from origin.
		_book.plotter.ε = parseInt(_book.plotter.currentPointerPosition.y) // y-coord from origin.

		// console.log(_sign(_book.plotter.μ))

		// _printCursorPosition(event) // delete this method call alongwith its function
		// _printGeometricalPremise() // delete this method call alongwith its function
	}

	/* this function can be erased upon release */
	const _printGeometricalPremise = () => {
		d.getElementById('pwidth').textContent = _book.plotter.bounds.width
		d.getElementById('pheight').textContent = _book.plotter.bounds.height
		d.getElementById('ptop').textContent = _book.plotter.bounds.top
		d.getElementById('pleft').textContent = _book.plotter.bounds.left
		d.getElementById('pright').textContent = _book.plotter.bounds.right
		d.getElementById('pbottom').textContent = _book.plotter.bounds.bottom
		d.getElementById('originX').textContent = _book.plotter.origin.x
		d.getElementById('originY').textContent = _book.plotter.origin.y
	}

	/* this function can be erased upon release */
	const _printCursorPosition = (event) => {
		d.getElementById('xaxis').textContent = _book.plotter.μ
		d.getElementById('yaxis').textContent = _book.plotter.ε
	}

	/**********************************
		************* Polyfills ***********
		**********************************/

	DOMTokenList.prototype.addmany = function (classes) {
		let classArr = classes.split(' ')
		for (let i = 0; i < classArr.length; i++) {
			this.add(classArr[i])
		}
	}

	DOMTokenList.prototype.removemany = function (classes) {
		let classArr = classes.split(' ')
		for (let i = 0; i < classArr.length; i++) {
			this.remove(classArr[i])
		}
	}

	const _addClassesToElem = (elem, classes) => {
		elem.classList.addmany(classes)
	}

	const _removeClassesFromElem = (elem, classes) => {
		elem.classList.removemany(classes)
	}

	Number.prototype.between = function (min, max) {
		return this > min && this < max
	}

	Element.prototype.remove = function () {
		this.parentElement.removeChild(this)
	}

	NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
		for (let i = this.length - 1; i >= 0; i--) {
			if (this[i] && this[i].parentElement) {
				this[i].parentElement.removeChild(this[i])
			}
		}
	}

	const _viewer = {
		getMatch(query, usePolyfill) {
			return this.testMedia(query, usePolyfill).matches
		},

		onChange(query, cb, usePolyfill) {
			const res = this.testMedia(query, usePolyfill)

			res.addListener((changed) => {
				cb.apply({}, [changed.matches, changed.media])
			})
		},

		testMedia(query, usePolyfill) {
			const isMatchMediaSupported = !!(w && w.matchMedia) && !usePolyfill

			if (isMatchMediaSupported) {
				const res = w.matchMedia(query)
				return res
			} else {
				// ... add polyfill here or use polyfill.io for IE8 and below
			}
		}
	}

	_viewer.onChange('(orientation: landscape)', (match) => {
		_book.state.mode = match ? 'landscape' : 'portrait'
		console.log('switch gears baby!')
	})

	let _book = new Book()

	// console.log(_book)

	const _addEventListeners = (eventName, callback) => { _book.node.addEventListener(eventName, callback, false) }
	class Superbook {
		execute(methodName, ...theArgs) {
			switch (methodName) {
				case 'length':
					return _book['getLength']()
				case 'mode':
					return _book['getMode']()
				case 'page':
					if (theArgs.length === 0) {
						return _book['page']()
					} else {
						_book['flipPage'](theArgs)
					}
					break
				default:
					return _book[methodName](theArgs)
			}
		}
		on(methodName, ...args) {
			switch (methodName) {
				case 'turning':
					return _addEventListeners('turning', args[0])
				case 'turned':
					return _addEventListeners('turned', args[0])
				default:
					return new Error('Event not found')
			}
		}
	}

	if (typeof w.Bookiza === 'undefined') {
		w.Bookiza = {
			init({ options }) {
				_initializeSuperBook({ options })
				return new Superbook() // Put Superbook object in global namespace.
			}
		}
	}
})(navigator, window, document)
