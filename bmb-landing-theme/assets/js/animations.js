/**
 * BMB Animations - Intersection Observer per entrata e uscita.
 * Smooth scroll per i link che puntano ad ancore interne.
 */
( function () {
	'use strict';

	const reduceMotion = window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	function initAnimations(){
		if ( reduceMotion ) return;
		if ( ! ( 'IntersectionObserver' in window ) ) return;

		const inEls  = document.querySelectorAll( '[data-bmb-anim-in]:not([data-bmb-anim-in="none"])' );
		const outEls = document.querySelectorAll( '[data-bmb-anim-out]:not([data-bmb-anim-out="none"])' );

		const inObserver = new IntersectionObserver( function ( entries ) {
			entries.forEach( function ( entry ) {
				if ( entry.isIntersecting ) {
					const delay = parseInt( entry.target.getAttribute( 'data-bmb-anim-delay' ) || '0', 10 );
					setTimeout( function () {
						entry.target.classList.add( 'bmb-in-view' );
						entry.target.classList.remove( 'bmb-out-of-view' );
					}, delay );
					inObserver.unobserve( entry.target );
				}
			} );
		}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' } );

		inEls.forEach( function ( el ) { inObserver.observe( el ); } );

		// Out animations: reagiscono quando l'elemento esce dal viewport scrollando.
		const outObserver = new IntersectionObserver( function ( entries ) {
			entries.forEach( function ( entry ) {
				if ( ! entry.isIntersecting && entry.target.classList.contains( 'bmb-in-view' ) ) {
					entry.target.classList.add( 'bmb-out-of-view' );
				} else if ( entry.isIntersecting ) {
					entry.target.classList.remove( 'bmb-out-of-view' );
				}
			} );
		}, { threshold: 0 } );

		outEls.forEach( function ( el ) { outObserver.observe( el ); } );
	}

	function initSmoothAnchors(){
		document.addEventListener( 'click', function ( e ) {
			const link = e.target.closest( 'a[href^="#"], a[data-bmb-anchor="true"]' );
			if ( ! link ) return;
			const href = link.getAttribute( 'href' ) || '';
			if ( href.length < 2 || href.charAt( 0 ) !== '#' ) return;

			const target = document.getElementById( href.slice( 1 ) );
			if ( ! target ) return;

			e.preventDefault();
			const headerH = parseInt( getComputedStyle( document.documentElement ).getPropertyValue( '--bmb-header-h' ) || '80', 10 );
			const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
			window.scrollTo( {
				top: top,
				behavior: reduceMotion ? 'auto' : 'smooth'
			} );

			// Aggiorna URL senza ricarica
			history.pushState( null, '', href );

			// Chiude menu mobile se aperto
			const nav = document.getElementById( 'bmb-primary-menu' );
			if ( nav && nav.dataset.open === 'true' ) {
				nav.dataset.open = 'false';
				const tog = document.querySelector( '[data-bmb-menu-toggle]' );
				if ( tog ) tog.setAttribute( 'aria-expanded', 'false' );
			}
		} );
	}

	function initStickyHeader(){
		const header = document.querySelector( '[data-bmb-header]' );
		if ( ! header ) return;
		const onScroll = function () {
			header.dataset.scrolled = window.scrollY > 8 ? 'true' : 'false';
		};
		onScroll();
		window.addEventListener( 'scroll', onScroll, { passive: true } );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', function () {
			initAnimations();
			initSmoothAnchors();
			initStickyHeader();
		} );
	} else {
		initAnimations();
		initSmoothAnchors();
		initStickyHeader();
	}
} )();
