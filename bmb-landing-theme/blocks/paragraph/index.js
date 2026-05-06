/**
 * BMB Paragraph - paragrafo con formattazione ricca, ancora, animazioni, larghezza adattiva.
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
		{ label: 'Fade Right',value: 'fade-right' }
	];

	registerBlockType( 'bmb/paragraph', {
		edit: function ( props ) {
			const { attributes, setAttributes } = props;
			const className = [
				'bmb-paragraph',
				'bmb-paragraph--' + attributes.size,
				'bmb-paragraph--align-' + attributes.align,
				'bmb-paragraph--mw-' + attributes.maxWidth,
				attributes.uppercase ? 'bmb-paragraph--uppercase' : ''
			].filter( Boolean ).join( ' ' );

			const blockProps = useBlockProps( { className: className } );

			return el( Fragment, {},
				el( BlockControls, {},
					el( AlignmentToolbar, { value: attributes.align, onChange: ( v ) => setAttributes( { align: v || 'left' } ) } )
				),
				el( InspectorControls, {},
					el( PanelBody, { title: __( 'Tipografia', 'bmb-landing' ), initialOpen: true },
						el( SelectControl, {
							label: __( 'Dimensione', 'bmb-landing' ),
							value: attributes.size,
							options: [
								{ label: 'S',   value: 's' },
								{ label: 'M',   value: 'm' },
								{ label: 'L',   value: 'l' },
								{ label: 'XL',  value: 'xl' }
							],
							onChange: ( v ) => setAttributes( { size: v } )
						} ),
						el( SelectControl, {
							label: __( 'Larghezza', 'bmb-landing' ),
							help:  __( '"Adattata al testo" abbraccia il contenuto.', 'bmb-landing' ),
							value: attributes.maxWidth,
							options: [
								{ label: 'Adattata al testo', value: 'content' },
								{ label: 'Contenuto stretto (60ch)', value: 'narrow' },
								{ label: 'Contenuto medio (75ch)',   value: 'medium' },
								{ label: 'Larga (100%)',             value: 'full' }
							],
							onChange: ( v ) => setAttributes( { maxWidth: v } )
						} ),
						el( ToggleControl, {
							label: __( 'MAIUSCOLO', 'bmb-landing' ),
							checked: attributes.uppercase,
							onChange: ( v ) => setAttributes( { uppercase: v } )
						} )
					),
					el( PanelBody, { title: __( 'Ancora & Animazioni', 'bmb-landing' ), initialOpen: false },
						el( TextControl, {
							label: __( 'ID di ancoraggio', 'bmb-landing' ),
							value: attributes.anchorId,
							onChange: ( v ) => setAttributes( { anchorId: v.replace( /[^a-zA-Z0-9_-]/g, '' ) } )
						} ),
						el( SelectControl, { label: __( 'Entrata', 'bmb-landing' ), value: attributes.animationIn,  options: ANIM, onChange: ( v ) => setAttributes( { animationIn: v } ) } ),
						el( SelectControl, { label: __( 'Uscita',  'bmb-landing' ), value: attributes.animationOut, options: ANIM, onChange: ( v ) => setAttributes( { animationOut: v } ) } )
					)
				),
				el( RichText, Object.assign( {}, blockProps, {
					tagName: 'p',
					value: attributes.text,
					onChange: ( v ) => setAttributes( { text: v } ),
					placeholder: __( 'Scrivi un paragrafo… (usa la toolbar per grassetto, link, ecc.)', 'bmb-landing' ),
					allowedFormats: [ 'core/bold', 'core/italic', 'core/link', 'core/underline', 'core/strikethrough', 'core/code' ],
					id: attributes.anchorId || undefined
				} ) )
			);
		},
		save: function ( props ) {
			const { attributes } = props;
			const className = [
				'bmb-paragraph',
				'bmb-paragraph--' + attributes.size,
				'bmb-paragraph--align-' + attributes.align,
				'bmb-paragraph--mw-' + attributes.maxWidth,
				attributes.uppercase ? 'bmb-paragraph--uppercase' : ''
			].filter( Boolean ).join( ' ' );

			const blockProps = wp.blockEditor.useBlockProps.save( {
				className: className,
				id: attributes.anchorId || undefined,
				'data-bmb-anim-in':  attributes.animationIn,
				'data-bmb-anim-out': attributes.animationOut
			} );

			return el( wp.blockEditor.RichText.Content, Object.assign( {}, blockProps, { tagName: 'p', value: attributes.text } ) );
		}
	} );
} )( window.wp );
