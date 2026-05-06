/**
 * BMB Heading - titolo H1-H6 con peso, dimensione, link/ancora, animazioni.
 */
( function ( wp ) {
	const { registerBlockType } = wp.blocks;
	const { InspectorControls, RichText, useBlockProps, BlockControls, AlignmentToolbar } = wp.blockEditor;
	const { PanelBody, SelectControl, TextControl, ToggleControl } = wp.components;
	const { createElement: el, Fragment } = wp.element;
	const { __ } = wp.i18n;

	const ANIM = [
		{ label: 'Nessuna',   value: 'none' },
		{ label: 'Fade',      value: 'fade' },
		{ label: 'Fade Up',   value: 'fade-up' },
		{ label: 'Fade Down', value: 'fade-down' },
		{ label: 'Fade Left', value: 'fade-left' },
		{ label: 'Fade Right',value: 'fade-right' },
		{ label: 'Zoom In',   value: 'zoom-in' },
		{ label: 'Slide Up',  value: 'slide-up' }
	];

	registerBlockType( 'bmb/heading', {
		edit: function ( props ) {
			const { attributes, setAttributes } = props;
			const Tag = 'h' + attributes.level;

			const blockProps = useBlockProps( {
				className: [
					'bmb-heading',
					'bmb-heading--' + attributes.size,
					'bmb-heading--align-' + attributes.align,
					attributes.uppercase ? 'bmb-heading--uppercase' : ''
				].filter( Boolean ).join( ' ' ),
				style: { fontWeight: attributes.weight }
			} );

			return el( Fragment, {},
				el( BlockControls, {},
					el( AlignmentToolbar, {
						value: attributes.align,
						onChange: ( v ) => setAttributes( { align: v || 'left' } )
					} )
				),
				el( InspectorControls, {},
					el( PanelBody, { title: __( 'Tipografia', 'bmb-landing' ), initialOpen: true },
						el( SelectControl, {
							label: __( 'Livello (H1–H6)', 'bmb-landing' ),
							value: String( attributes.level ),
							options: [
								{ label: 'H1', value: '1' },
								{ label: 'H2', value: '2' },
								{ label: 'H3', value: '3' },
								{ label: 'H4', value: '4' },
								{ label: 'H5', value: '5' },
								{ label: 'H6', value: '6' }
							],
							onChange: ( v ) => setAttributes( { level: parseInt( v, 10 ) } )
						} ),
						el( SelectControl, {
							label: __( 'Dimensione', 'bmb-landing' ),
							value: attributes.size,
							options: [
								{ label: 'S',    value: 's' },
								{ label: 'M',    value: 'm' },
								{ label: 'L',    value: 'l' },
								{ label: 'XL',   value: 'xl' },
								{ label: 'XXL',  value: 'xxl' },
								{ label: 'XXXL', value: 'xxxl' }
							],
							onChange: ( v ) => setAttributes( { size: v } )
						} ),
						el( SelectControl, {
							label: __( 'Peso', 'bmb-landing' ),
							value: attributes.weight,
							options: [
								{ label: 'Light 300',     value: '300' },
								{ label: 'Regular 400',   value: '400' },
								{ label: 'Medium 500',    value: '500' },
								{ label: 'Semibold 600',  value: '600' },
								{ label: 'Bold 700',      value: '700' },
								{ label: 'Extrabold 800', value: '800' }
							],
							onChange: ( v ) => setAttributes( { weight: v } )
						} ),
						el( ToggleControl, {
							label: __( 'MAIUSCOLO', 'bmb-landing' ),
							checked: attributes.uppercase,
							onChange: ( v ) => setAttributes( { uppercase: v } )
						} )
					),
					el( PanelBody, { title: __( 'Link & Ancora', 'bmb-landing' ), initialOpen: true },
						el( TextControl, {
							label: __( 'ID di ancoraggio (questo titolo)', 'bmb-landing' ),
							help:  __( 'Verrà aggiunto come id="..." per saltarci con #', 'bmb-landing' ),
							value: attributes.anchorId,
							onChange: ( v ) => setAttributes( { anchorId: v.replace( /[^a-zA-Z0-9_-]/g, '' ) } )
						} ),
						el( SelectControl, {
							label: __( 'Tipo di link', 'bmb-landing' ),
							value: attributes.linkType,
							options: [
								{ label: 'Nessuno',         value: 'none' },
								{ label: 'URL esterno',     value: 'external' },
								{ label: 'Ancora interna',  value: 'anchor' }
							],
							onChange: ( v ) => setAttributes( { linkType: v } )
						} ),
						attributes.linkType !== 'none' && el( TextControl, {
							label: attributes.linkType === 'anchor' ? __( 'ID ancora target (senza #)', 'bmb-landing' ) : __( 'URL', 'bmb-landing' ),
							value: attributes.linkUrl,
							onChange: ( v ) => setAttributes( { linkUrl: v } )
						} ),
						attributes.linkType === 'external' && el( ToggleControl, {
							label: __( 'Apri in nuova scheda', 'bmb-landing' ),
							checked: attributes.linkTarget,
							onChange: ( v ) => setAttributes( { linkTarget: v } )
						} )
					),
					el( PanelBody, { title: __( 'Animazioni', 'bmb-landing' ), initialOpen: false },
						el( SelectControl, { label: __( 'Entrata', 'bmb-landing' ), value: attributes.animationIn, options: ANIM, onChange: ( v ) => setAttributes( { animationIn: v } ) } ),
						el( SelectControl, { label: __( 'Uscita',  'bmb-landing' ), value: attributes.animationOut, options: ANIM, onChange: ( v ) => setAttributes( { animationOut: v } ) } )
					)
				),
				el( Tag, Object.assign( {}, blockProps, { id: attributes.anchorId || undefined } ),
					el( RichText, {
						tagName: 'span',
						value: attributes.text,
						allowedFormats: [ 'core/bold', 'core/italic' ],
						onChange: ( v ) => setAttributes( { text: v } ),
						placeholder: __( 'Scrivi il titolo…', 'bmb-landing' )
					} )
				)
			);
		},
		save: function ( props ) {
			const { attributes } = props;
			const Tag = 'h' + attributes.level;
			const className = [
				'bmb-heading',
				'bmb-heading--' + attributes.size,
				'bmb-heading--align-' + attributes.align,
				attributes.uppercase ? 'bmb-heading--uppercase' : ''
			].filter( Boolean ).join( ' ' );

			const blockProps = wp.blockEditor.useBlockProps.save( {
				className: className,
				style: { fontWeight: attributes.weight },
				id: attributes.anchorId || undefined,
				'data-bmb-anim-in':  attributes.animationIn,
				'data-bmb-anim-out': attributes.animationOut
			} );

			let inner = el( wp.blockEditor.RichText.Content, { tagName: 'span', value: attributes.text } );

			if ( attributes.linkType !== 'none' && attributes.linkUrl ) {
				const href = attributes.linkType === 'anchor'
					? '#' + attributes.linkUrl.replace( /^#/, '' )
					: attributes.linkUrl;
				const linkAttrs = {
					href: href,
					className: 'bmb-heading__link',
					'data-bmb-anchor': attributes.linkType === 'anchor' ? 'true' : undefined
				};
				if ( attributes.linkType === 'external' && attributes.linkTarget ) {
					linkAttrs.target = '_blank';
					linkAttrs.rel = 'noopener noreferrer';
				}
				inner = el( 'a', linkAttrs, inner );
			}

			return el( Tag, blockProps, inner );
		}
	} );
} )( window.wp );
