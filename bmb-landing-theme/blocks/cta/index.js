/**
 * BMB CTA - bottone con link/ancora.
 */
( function ( wp ) {
	const { registerBlockType } = wp.blocks;
	const { InspectorControls, RichText, useBlockProps, BlockControls, AlignmentToolbar } = wp.blockEditor;
	const { PanelBody, SelectControl, TextControl, ToggleControl } = wp.components;
	const { createElement: el, Fragment } = wp.element;
	const { __ } = wp.i18n;

	const ANIM = [
		{ label: 'Nessuna',   value: 'none' },
		{ label: 'Fade Up',   value: 'fade-up' },
		{ label: 'Zoom In',   value: 'zoom-in' },
		{ label: 'Slide Up',  value: 'slide-up' }
	];

	const ICONS = {
		none:    null,
		arrow:   '→',
		'arrow-right': '→',
		'arrow-down':  '↓',
		check:   '✓',
		plus:    '+',
		play:    '▶'
	};

	registerBlockType( 'bmb/cta', {
		edit: function ( props ) {
			const { attributes, setAttributes } = props;
			const wrapClass = 'bmb-cta-wrap bmb-cta-wrap--align-' + attributes.align;
			const blockProps = useBlockProps( { className: wrapClass } );

			const btnClass = [
				'bmb-btn',
				'bmb-btn--' + attributes.variant,
				'bmb-btn--' + attributes.size,
				attributes.fullWidth ? 'bmb-btn--full' : ''
			].filter( Boolean ).join( ' ' );

			return el( Fragment, {},
				el( BlockControls, {},
					el( AlignmentToolbar, { value: attributes.align, onChange: ( v ) => setAttributes( { align: v || 'left' } ) } )
				),
				el( InspectorControls, {},
					el( PanelBody, { title: __( 'Stile', 'bmb-landing' ), initialOpen: true },
						el( SelectControl, {
							label: __( 'Variante', 'bmb-landing' ),
							value: attributes.variant,
							options: [
								{ label: 'Accent (pieno)',     value: 'accent' },
								{ label: 'Primary (pieno)',    value: 'primary' },
								{ label: 'Outline accent',     value: 'outline-accent' },
								{ label: 'Outline primary',    value: 'outline-primary' },
								{ label: 'Ghost (testo)',      value: 'ghost' },
								{ label: 'Bianco',             value: 'white' }
							],
							onChange: ( v ) => setAttributes( { variant: v } )
						} ),
						el( SelectControl, {
							label: __( 'Dimensione', 'bmb-landing' ),
							value: attributes.size,
							options: [
								{ label: 'S',  value: 's' },
								{ label: 'M',  value: 'm' },
								{ label: 'L',  value: 'l' },
								{ label: 'XL', value: 'xl' }
							],
							onChange: ( v ) => setAttributes( { size: v } )
						} ),
						el( SelectControl, {
							label: __( 'Icona', 'bmb-landing' ),
							value: attributes.icon,
							options: [
								{ label: 'Nessuna', value: 'none' },
								{ label: 'Freccia →', value: 'arrow' },
								{ label: 'Freccia ↓', value: 'arrow-down' },
								{ label: 'Check ✓', value: 'check' },
								{ label: 'Plus +',  value: 'plus' },
								{ label: 'Play ▶',  value: 'play' }
							],
							onChange: ( v ) => setAttributes( { icon: v } )
						} ),
						el( ToggleControl, {
							label: __( 'Larghezza piena', 'bmb-landing' ),
							checked: attributes.fullWidth,
							onChange: ( v ) => setAttributes( { fullWidth: v } )
						} )
					),
					el( PanelBody, { title: __( 'Link & Ancora', 'bmb-landing' ), initialOpen: true },
						el( SelectControl, {
							label: __( 'Tipo di link', 'bmb-landing' ),
							value: attributes.linkType,
							options: [
								{ label: 'URL esterno',    value: 'external' },
								{ label: 'Ancora interna', value: 'anchor' }
							],
							onChange: ( v ) => setAttributes( { linkType: v } )
						} ),
						el( TextControl, {
							label: attributes.linkType === 'anchor' ? __( 'ID ancora target (senza #)', 'bmb-landing' ) : __( 'URL', 'bmb-landing' ),
							value: attributes.linkUrl,
							onChange: ( v ) => setAttributes( { linkUrl: v } )
						} ),
						attributes.linkType === 'external' && el( ToggleControl, {
							label: __( 'Apri in nuova scheda', 'bmb-landing' ),
							checked: attributes.linkTarget,
							onChange: ( v ) => setAttributes( { linkTarget: v } )
						} ),
						el( TextControl, {
							label: __( 'ID ancoraggio (questo CTA)', 'bmb-landing' ),
							value: attributes.anchorId,
							onChange: ( v ) => setAttributes( { anchorId: v.replace( /[^a-zA-Z0-9_-]/g, '' ) } )
						} )
					),
					el( PanelBody, { title: __( 'Animazioni', 'bmb-landing' ), initialOpen: false },
						el( SelectControl, { label: __( 'Entrata', 'bmb-landing' ), value: attributes.animationIn,  options: ANIM, onChange: ( v ) => setAttributes( { animationIn: v } ) } ),
						el( SelectControl, { label: __( 'Uscita',  'bmb-landing' ), value: attributes.animationOut, options: ANIM, onChange: ( v ) => setAttributes( { animationOut: v } ) } )
					)
				),
				el( 'div', blockProps,
					el( 'span', { className: btnClass, id: attributes.anchorId || undefined },
						el( RichText, {
							tagName: 'span',
							className: 'bmb-btn__label',
							value: attributes.label,
							onChange: ( v ) => setAttributes( { label: v } ),
							placeholder: __( 'Etichetta', 'bmb-landing' ),
							allowedFormats: []
						} ),
						ICONS[ attributes.icon ] && el( 'span', { className: 'bmb-btn__icon', 'aria-hidden': 'true' }, ICONS[ attributes.icon ] )
					)
				)
			);
		},
		save: function ( props ) {
			const { attributes } = props;
			const wrapClass = 'bmb-cta-wrap bmb-cta-wrap--align-' + attributes.align;
			const blockProps = wp.blockEditor.useBlockProps.save( {
				className: wrapClass,
				'data-bmb-anim-in':  attributes.animationIn,
				'data-bmb-anim-out': attributes.animationOut
			} );
			const btnClass = [
				'bmb-btn',
				'bmb-btn--' + attributes.variant,
				'bmb-btn--' + attributes.size,
				attributes.fullWidth ? 'bmb-btn--full' : ''
			].filter( Boolean ).join( ' ' );

			const href = attributes.linkType === 'anchor'
				? '#' + ( attributes.linkUrl || '' ).replace( /^#/, '' )
				: ( attributes.linkUrl || '#' );

			const linkAttrs = {
				href: href,
				className: btnClass,
				id: attributes.anchorId || undefined,
				'data-bmb-anchor': attributes.linkType === 'anchor' ? 'true' : undefined
			};
			if ( attributes.linkType === 'external' && attributes.linkTarget ) {
				linkAttrs.target = '_blank';
				linkAttrs.rel = 'noopener noreferrer';
			}

			const iconChar = {
				none: null, arrow: '→', 'arrow-right': '→', 'arrow-down': '↓', check: '✓', plus: '+', play: '▶'
			}[ attributes.icon ];

			return el( 'div', blockProps,
				el( 'a', linkAttrs,
					el( wp.blockEditor.RichText.Content, { tagName: 'span', className: 'bmb-btn__label', value: attributes.label } ),
					iconChar ? el( 'span', { className: 'bmb-btn__icon', 'aria-hidden': 'true' }, iconChar ) : null
				)
			);
		}
	} );
} )( window.wp );
