/**
 * BMB List - punto elenco / lista numerata.
 */
( function ( wp ) {
	const { registerBlockType } = wp.blocks;
	const { InspectorControls, RichText, useBlockProps } = wp.blockEditor;
	const { PanelBody, SelectControl, ToggleControl, TextControl } = wp.components;
	const { createElement: el, Fragment } = wp.element;
	const { __ } = wp.i18n;

	const ANIM = [
		{ label: 'Nessuna', value: 'none' },
		{ label: 'Fade Up', value: 'fade-up' },
		{ label: 'Fade Left', value: 'fade-left' },
		{ label: 'Fade Right', value: 'fade-right' }
	];

	registerBlockType( 'bmb/list', {
		edit: function ( props ) {
			const { attributes, setAttributes } = props;
			const Tag = attributes.ordered ? 'ol' : 'ul';
			const className = [
				'bmb-list',
				'bmb-list--' + attributes.size,
				'bmb-list--marker-' + attributes.marker
			].join( ' ' );
			const blockProps = useBlockProps( { className: className } );

			return el( Fragment, {},
				el( InspectorControls, {},
					el( PanelBody, { title: __( 'Stile elenco', 'bmb-landing' ), initialOpen: true },
						el( ToggleControl, {
							label: __( 'Lista numerata', 'bmb-landing' ),
							checked: attributes.ordered,
							onChange: ( v ) => setAttributes( { ordered: v } )
						} ),
						el( SelectControl, {
							label: __( 'Marker', 'bmb-landing' ),
							value: attributes.marker,
							options: [
								{ label: 'Pallino',  value: 'dot' },
								{ label: 'Quadrato', value: 'square' },
								{ label: 'Trattino', value: 'dash' },
								{ label: 'Check ✓',  value: 'check' },
								{ label: 'Freccia →',value: 'arrow' },
								{ label: 'Nessuno',  value: 'none' }
							],
							onChange: ( v ) => setAttributes( { marker: v } )
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
					tagName: Tag,
					multiline: 'li',
					value: attributes.items,
					onChange: ( v ) => setAttributes( { items: v } ),
					placeholder: __( 'Scrivi una voce e premi Invio per aggiungerne altre…', 'bmb-landing' ),
					id: attributes.anchorId || undefined
				} ) )
			);
		},
		save: function ( props ) {
			const { attributes } = props;
			const Tag = attributes.ordered ? 'ol' : 'ul';
			const className = [
				'bmb-list',
				'bmb-list--' + attributes.size,
				'bmb-list--marker-' + attributes.marker
			].join( ' ' );
			const blockProps = wp.blockEditor.useBlockProps.save( {
				className: className,
				id: attributes.anchorId || undefined,
				'data-bmb-anim-in':  attributes.animationIn,
				'data-bmb-anim-out': attributes.animationOut
			} );
			return el( wp.blockEditor.RichText.Content, Object.assign( {}, blockProps, { tagName: Tag, value: attributes.items, multiline: 'li' } ) );
		}
	} );
} )( window.wp );
