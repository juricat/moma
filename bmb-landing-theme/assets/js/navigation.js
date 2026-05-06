/**
 * BMB Navigation - menu mobile.
 */
( function () {
	'use strict';
	function init(){
		const toggle = document.querySelector( '[data-bmb-menu-toggle]' );
		const nav    = document.getElementById( 'bmb-primary-menu' );
		if ( ! toggle || ! nav ) return;

		toggle.addEventListener( 'click', function () {
			const open = toggle.getAttribute( 'aria-expanded' ) === 'true';
			toggle.setAttribute( 'aria-expanded', open ? 'false' : 'true' );
			nav.dataset.open = open ? 'false' : 'true';
			document.body.style.overflow = open ? '' : 'hidden';
		} );

		// Chiudi al resize > breakpoint
		window.addEventListener( 'resize', function () {
			if ( window.innerWidth > 900 ) {
				toggle.setAttribute( 'aria-expanded', 'false' );
				nav.dataset.open = 'false';
				document.body.style.overflow = '';
			}
		} );
	}
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else { init(); }
} )();
