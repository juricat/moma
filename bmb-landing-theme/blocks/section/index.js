/**
 * BMB Section block - contenitore con anchor + animazioni.
 */
( function ( wp ) {
	const { registerBlockType } = wp.blocks;
	const { InspectorControls, InnerBlocks, useBlockProps, MediaUpload, MediaUploadCheck } = wp.blockEditor;
	const { PanelBody, TextControl, SelectControl, RangeControl, Button } = wp.components;
	const { createElement: el, Fragment } = wp.element;
	const { __ } = wp.i18n;

	const ANIM_OPTIONS = [
		{ label: 'Nessuna',         value: 'none' },
		{ label: 'Fade',            value: 'fade' },
		{ label: 'Fade Up',         value: 'fade-up' },
		{ label: 'Fade Down',       value: 'fade-down' },
		{ label: 'Fade Left',       value: 'fade-left' },
		{ label: 'Fade Right',      value: 'fade-right' },
		{ label: 'Zoom In',         value: 'zoom-in' },
		{ label: 'Zoom Out',        value: 'zoom-out' },
		{ label: 'Slide Up',        value: 'slide-up' },
		{ label: 'Slide Down',      value: 'slide-down' }
	];

	registerBlockType( 'bmb/section', {
		edit: function ( props ) {
			const { attributes, setAttributes, clientId } = props;
			const blockProps = useBlockProps( {
				className: 'bmb-section bmb-section--vp-' + attributes.verticalPad
			} );

			const style = {};
			if ( attributes.backgroundImage ) {
				style.backgroundImage = 'url(' + attributes.backgroundImage + ')';
				style.backgroundSize = 'cover';
				style.backgroundPosition = 'center';
			}

			return el( Fragment, {},
				el( InspectorControls, {},
					el( PanelBody, { title: __( 'Ancora & Layout', 'bmb-landing' ), initialOpen: true },
						el( TextControl, {
							label: __( 'ID Ancora (es: contatti)', 'bmb-landing' ),
							help:  __( 'Usa questo ID nei link come #contatti', 'bmb-landing' ),
							value: attributes.anchorId,
							onChange: ( v ) => setAttributes( { anchorId: v.replace( /[^a-zA-Z0-9_-]/g, '' ) } )
						} ),
						el( SelectControl, {
							label: __( 'Larghezza contenuto', 'bmb-landing' ),
							value: attributes.contentWidth,
							options: [
								{ label: 'Standard',  value: 'standard' },
								{ label: 'Wide',      value: 'wide' },
								{ label: 'Full',      value: 'full' }
							],
							onChange: ( v ) => setAttributes( { contentWidth: v } )
						} ),
						el( SelectControl, {
							label: __( 'Padding verticale', 'bmb-landing' ),
							value: attributes.verticalPad,
							options: [
								{ label: 'S',   value: 's' },
								{ label: 'M',   value: 'm' },
								{ label: 'L',   value: 'l' },
								{ label: 'XL',  value: 'xl' },
								{ label: 'XXL', value: 'xxl' }
							],
							onChange: ( v ) => setAttributes( { verticalPad: v } )
						} )
					),
					el( PanelBody, { title: __( 'Animazioni', 'bmb-landing' ), initialOpen: false },
						el( SelectControl, {
							label: __( 'Animazione di entrata', 'bmb-landing' ),
							value: attributes.animationIn,
							options: ANIM_OPTIONS,
							onChange: ( v ) => setAttributes( { animationIn: v } )
						} ),
						el( SelectControl, {
							label: __( 'Animazione di uscita', 'bmb-landing' ),
							value: attributes.animationOut,
							options: ANIM_OPTIONS,
							onChange: ( v ) => setAttributes( { animationOut: v } )
						} ),
						el( RangeControl, {
							label: __( 'Ritardo (ms)', 'bmb-landing' ),
							value: attributes.animationDelay,
							onChange: ( v ) => setAttributes( { animationDelay: v } ),
							min: 0, max: 2000, step: 50
						} )
					),
					el( PanelBody, { title: __( 'Sfondo', 'bmb-landing' ), initialOpen: false },
						el( MediaUploadCheck, {},
							el( MediaUpload, {
								onSelect: ( m ) => setAttributes( { backgroundImage: m.url } ),
								allowedTypes: [ 'image' ],
								render: ( { open } ) => el( Button, { onClick: open, variant: 'secondary' },
									attributes.backgroundImage ? __( 'Cambia immagine', 'bmb-landing' ) : __( 'Scegli immagine', 'bmb-landing' )
								)
							} )
						),
						attributes.backgroundImage && el( Button, {
							onClick: () => setAttributes( { backgroundImage: '' } ),
							variant: 'tertiary',
							isDestructive: true,
							style: { marginLeft: 8 }
						}, __( 'Rimuovi', 'bmb-landing' ) )
					)
				),
				el( 'div', Object.assign( {}, blockProps, { style: style, id: attributes.anchorId || undefined } ),
					el( 'div', { className: 'bmb-section__inner bmb-section__inner--' + attributes.contentWidth },
						el( InnerBlocks, {} )
					)
				)
			);
		},
		save: function ( props ) {
			const { attributes } = props;
			const blockProps = wp.blockEditor.useBlockProps.save( {
				className: 'bmb-section bmb-section--vp-' + attributes.verticalPad,
				id: attributes.anchorId || undefined
			} );
			const style = {};
			if ( attributes.backgroundImage ) {
				style.backgroundImage = 'url(' + attributes.backgroundImage + ')';
				style.backgroundSize = 'cover';
				style.backgroundPosition = 'center';
			}
			return el( 'section',
				Object.assign( {}, blockProps, {
					style: style,
					'data-bmb-anim-in':  attributes.animationIn,
					'data-bmb-anim-out': attributes.animationOut,
					'data-bmb-anim-delay': attributes.animationDelay
				} ),
				el( 'div', { className: 'bmb-section__inner bmb-section__inner--' + attributes.contentWidth },
					el( wp.blockEditor.InnerBlocks.Content, {} )
				)
			);
		}
	} );
} )( window.wp );
