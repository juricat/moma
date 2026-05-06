/**
 * BMB Machines Section - block Gutenberg pixel-perfect e completamente editabile.
 *
 * Editor: tutti i testi sono inline editabili (RichText). Le repeating list
 * (tag e card) sono gestite dal pannello laterale Inspector, con upload
 * immagine, scelta icona Material Symbols Sharp e URL di atterraggio.
 */
( function ( wp ) {
	const { registerBlockType } = wp.blocks;
	const { InspectorControls, RichText, useBlockProps, MediaUpload, MediaUploadCheck } = wp.blockEditor;
	const { PanelBody, TextControl, Button, BaseControl, SelectControl } = wp.components;
	const { createElement: el, Fragment } = wp.element;
	const { __ } = wp.i18n;

	// Set di icone Material Symbols Sharp suggerite (l'utente può sempre scrivere il nome a mano).
	const ICON_OPTIONS = [
		{ label: 'Categoria',         value: 'category' },
		{ label: 'Apps (griglia)',    value: 'apps' },
		{ label: 'Stack',             value: 'layers' },
		{ label: 'Fabbrica',          value: 'factory' },
		{ label: 'Manifattura',       value: 'precision_manufacturing' },
		{ label: 'Robot',             value: 'smart_toy' },
		{ label: 'Ingegneria',        value: 'engineering' },
		{ label: 'Costruzione',       value: 'construction' },
		{ label: 'Strumenti',         value: 'build' },
		{ label: 'Ingranaggio',       value: 'settings' },
		{ label: 'Hardware',          value: 'hardware' },
		{ label: 'Bullone',           value: 'memory' },
		{ label: 'Pacco',             value: 'package_2' },
		{ label: 'Inventario',        value: 'inventory_2' },
		{ label: 'Magazzino',         value: 'warehouse' },
		{ label: 'Camion',            value: 'local_shipping' },
		{ label: 'Conveyor belt',     value: 'conveyor_belt' },
		{ label: 'Energia (eco)',     value: 'eco' },
		{ label: 'Fulmine',           value: 'bolt' },
		{ label: 'Goccia',            value: 'water_drop' },
		{ label: 'Hub',               value: 'hub' },
		{ label: 'View 3D',           value: 'view_in_ar' },
		{ label: 'Scienza',           value: 'science' },
		{ label: 'Servizio clienti',  value: 'support_agent' },
		{ label: 'Mondo',             value: 'public' },
		{ label: 'Industria (city)',  value: 'business' },
		{ label: 'Ristorante',        value: 'restaurant' },
		{ label: 'Custom (sotto…)',   value: '__custom__' }
	];

	const cloneTags  = ( arr ) => ( arr || [] ).map( ( t ) => Object.assign( {}, t ) );
	const cloneCards = ( arr ) => ( arr || [] ).map( ( c ) => Object.assign( {}, c ) );

	registerBlockType( 'bmb/machines', {
		edit: function ( props ) {
			const { attributes, setAttributes } = props;
			const blockProps = useBlockProps( { className: 'bmb-machines-section' } );

			// helpers immutabili
			const updateTag = ( i, patch ) => {
				const next = cloneTags( attributes.tags );
				next[ i ] = Object.assign( {}, next[ i ], patch );
				setAttributes( { tags: next } );
			};
			const addTag = () => setAttributes( { tags: cloneTags( attributes.tags ).concat( [ { label: 'Tipologia', icon: 'category', url: '' } ] ) } );
			const removeTag = ( i ) => setAttributes( { tags: attributes.tags.filter( ( _, idx ) => idx !== i ) } );

			const updateCard = ( i, patch ) => {
				const next = cloneCards( attributes.cards );
				next[ i ] = Object.assign( {}, next[ i ], patch );
				setAttributes( { cards: next } );
			};
			const addCard = () => setAttributes( { cards: cloneCards( attributes.cards ).concat( [ { imageId: 0, imageUrl: '', alt: '', tag: 'Tipologia', icon: 'category', name: 'Nome Macchina', url: '' } ] ) } );
			const removeCard = ( i ) => setAttributes( { cards: attributes.cards.filter( ( _, idx ) => idx !== i ) } );

			// Inspector: pannello tag
			const tagsPanel = el( PanelBody, { title: __( 'Tag (chip "la nostra gamma")', 'bmb-landing' ), initialOpen: false },
				attributes.tags.map( ( t, i ) =>
					el( BaseControl, { key: i, label: __( 'Tag #', 'bmb-landing' ) + ( i + 1 ), className: 'bmb-repeater-row' },
						el( TextControl, {
							label: __( 'Label', 'bmb-landing' ),
							value: t.label,
							onChange: ( v ) => updateTag( i, { label: v } )
						} ),
						el( SelectControl, {
							label: __( 'Icona Material Symbols', 'bmb-landing' ),
							value: ICON_OPTIONS.some( o => o.value === t.icon ) ? t.icon : '__custom__',
							options: ICON_OPTIONS,
							onChange: ( v ) => updateTag( i, { icon: v === '__custom__' ? ( t.icon || 'category' ) : v } )
						} ),
						el( TextControl, {
							label: __( 'Nome icona custom (opzionale)', 'bmb-landing' ),
							help: __( 'es: factory, settings, eco, water_drop... (cerca su fonts.google.com/icons)', 'bmb-landing' ),
							value: t.icon,
							onChange: ( v ) => updateTag( i, { icon: v.replace( /[^a-z0-9_]/gi, '_' ).toLowerCase() } )
						} ),
						el( TextControl, {
							label: __( 'URL / Ancora di atterraggio', 'bmb-landing' ),
							help: __( 'es: /tipologia-1 oppure #tipo-1', 'bmb-landing' ),
							value: t.url,
							onChange: ( v ) => updateTag( i, { url: v } )
						} ),
						el( Button, {
							isDestructive: true, variant: 'tertiary', onClick: () => removeTag( i ),
							style: { marginTop: 4 }
						}, __( 'Rimuovi tag', 'bmb-landing' ) )
					)
				),
				el( Button, { variant: 'primary', onClick: addTag }, __( '+ Aggiungi tag', 'bmb-landing' ) )
			);

			// Inspector: pannello card
			const cardsPanel = el( PanelBody, { title: __( 'Card del carosello', 'bmb-landing' ), initialOpen: true },
				attributes.cards.map( ( c, i ) =>
					el( BaseControl, { key: i, label: __( 'Card #', 'bmb-landing' ) + ( i + 1 ), className: 'bmb-repeater-row' },
						el( MediaUploadCheck, {},
							el( MediaUpload, {
								onSelect: ( m ) => updateCard( i, { imageId: m.id, imageUrl: m.url, alt: m.alt || '' } ),
								allowedTypes: [ 'image' ],
								value: c.imageId,
								render: ( { open } ) => el( 'div', { style: { marginBottom: 8 } },
									c.imageUrl && el( 'img', { src: c.imageUrl, alt: '', style: { maxWidth: '100%', height: 80, objectFit: 'cover', borderRadius: 6, display: 'block', marginBottom: 6 } } ),
									el( Button, { onClick: open, variant: 'secondary' },
										c.imageUrl ? __( 'Cambia immagine', 'bmb-landing' ) : __( 'Carica immagine', 'bmb-landing' )
									)
								)
							} )
						),
						el( TextControl, {
							label: __( 'Tag (chip nella card)', 'bmb-landing' ),
							value: c.tag, onChange: ( v ) => updateCard( i, { tag: v } )
						} ),
						el( SelectControl, {
							label: __( 'Icona del chip', 'bmb-landing' ),
							value: ICON_OPTIONS.some( o => o.value === c.icon ) ? c.icon : '__custom__',
							options: ICON_OPTIONS,
							onChange: ( v ) => updateCard( i, { icon: v === '__custom__' ? ( c.icon || 'category' ) : v } )
						} ),
						el( TextControl, {
							label: __( 'Nome icona custom', 'bmb-landing' ),
							value: c.icon,
							onChange: ( v ) => updateCard( i, { icon: v.replace( /[^a-z0-9_]/gi, '_' ).toLowerCase() } )
						} ),
						el( TextControl, {
							label: __( 'Nome macchina', 'bmb-landing' ),
							value: c.name, onChange: ( v ) => updateCard( i, { name: v } )
						} ),
						el( TextControl, {
							label: __( 'URL pagina di atterraggio', 'bmb-landing' ),
							help: __( 'Pagina che si apre cliccando il pulsante ↗.', 'bmb-landing' ),
							value: c.url, onChange: ( v ) => updateCard( i, { url: v } )
						} ),
						el( Button, {
							isDestructive: true, variant: 'tertiary', onClick: () => removeCard( i ),
							style: { marginTop: 4 }
						}, __( 'Rimuovi card', 'bmb-landing' ) )
					)
				),
				el( Button, { variant: 'primary', onClick: addCard }, __( '+ Aggiungi card', 'bmb-landing' ) )
			);

			// Inspector: pannello CTA
			const ctaPanel = el( PanelBody, { title: __( 'Banner CTA Catalogo', 'bmb-landing' ), initialOpen: false },
				el( TextControl, {
					label: __( 'URL / Ancora di atterraggio', 'bmb-landing' ),
					help: __( 'Etichetta della CTA si modifica direttamente nel canvas.', 'bmb-landing' ),
					value: attributes.ctaUrl,
					onChange: ( v ) => setAttributes( { ctaUrl: v } )
				} )
			);

			// Inspector: anchor della sezione
			const sectionPanel = el( PanelBody, { title: __( 'Sezione', 'bmb-landing' ), initialOpen: false },
				el( TextControl, {
					label: __( 'ID di ancoraggio (es: macchine)', 'bmb-landing' ),
					value: attributes.anchorId,
					onChange: ( v ) => setAttributes( { anchorId: v.replace( /[^a-zA-Z0-9_-]/g, '' ) } )
				} )
			);

			// === Canvas (rendering editor) ===
			const canvas = el( 'section', Object.assign( {}, blockProps, { id: attributes.anchorId || undefined } ),
				el( 'div', { className: 'bmb-machines-section__inner' },
					el( 'div', { className: 'bmb-machines-section__left' },
						el( RichText, {
							tagName: 'span', className: 'bmb-eyebrow-pill',
							value: attributes.eyebrow,
							onChange: ( v ) => setAttributes( { eyebrow: v } ),
							placeholder: __( 'Eyebrow…', 'bmb-landing' ),
							allowedFormats: []
						} ),
						el( RichText, {
							tagName: 'h2', className: 'bmb-machines__title',
							value: attributes.title,
							onChange: ( v ) => setAttributes( { title: v } ),
							placeholder: __( 'Titolo della sezione…', 'bmb-landing' ),
							allowedFormats: [ 'core/bold', 'core/italic' ]
						} ),
						el( RichText, {
							tagName: 'p', className: 'bmb-machines__lead',
							value: attributes.lead,
							onChange: ( v ) => setAttributes( { lead: v } ),
							placeholder: __( 'Paragrafo descrittivo…', 'bmb-landing' ),
							allowedFormats: [ 'core/bold', 'core/italic', 'core/link', 'core/strikethrough', 'core/underline' ]
						} ),
						el( RichText, {
							tagName: 'p', className: 'bmb-machines__subtitle',
							value: attributes.subtitle,
							onChange: ( v ) => setAttributes( { subtitle: v } ),
							placeholder: __( 'Sotto-titolo…', 'bmb-landing' ),
							allowedFormats: [ 'core/bold' ]
						} ),
						el( 'div', { className: 'bmb-typology-chips' },
							attributes.tags.map( ( t, i ) =>
								el( 'span', { key: i, className: 'bmb-typology-chip' },
									el( 'span', { className: 'material-symbols-sharp bmb-typology-chip__icon' }, t.icon || 'category' ),
									el( RichText, {
										tagName: 'span',
										value: t.label,
										onChange: ( v ) => updateTag( i, { label: v } ),
										placeholder: 'Tipologia',
										allowedFormats: []
									} )
								)
							)
						),
						el( 'a', { className: 'bmb-catalog-cta', href: '#', onClick: ( e ) => e.preventDefault() },
							el( RichText, {
								tagName: 'span', className: 'bmb-catalog-cta__label',
								value: attributes.ctaLabel,
								onChange: ( v ) => setAttributes( { ctaLabel: v } ),
								placeholder: __( 'Etichetta CTA…', 'bmb-landing' ),
								allowedFormats: [ 'core/bold' ]
							} ),
							el( 'span', { className: 'bmb-catalog-cta__arrow', 'aria-hidden': 'true' }, '↗' )
						)
					),
					el( 'div', { className: 'bmb-machines-section__right' },
						el( 'div', { className: 'bmb-cards-rail bmb-cards-rail--editor' },
							attributes.cards.map( ( c, i ) =>
								el( 'article', { key: i, className: 'bmb-card-machine' },
									el( 'div', { className: 'bmb-card-machine__media' },
										c.imageUrl
											? el( 'img', { src: c.imageUrl, alt: c.alt || '', loading: 'lazy' } )
											: el( MediaUploadCheck, {},
												el( MediaUpload, {
													onSelect: ( m ) => updateCard( i, { imageId: m.id, imageUrl: m.url, alt: m.alt || '' } ),
													allowedTypes: [ 'image' ],
													render: ( { open } ) => el( Button, {
														onClick: open, variant: 'secondary',
														style: { margin: 'auto' }
													}, __( '+ Carica immagine', 'bmb-landing' ) )
												} )
											)
									),
									el( 'span', { className: 'bmb-card-machine__chip' },
										el( 'span', { className: 'material-symbols-sharp' }, c.icon || 'category' ),
										el( RichText, {
											tagName: 'span',
											value: c.tag,
											onChange: ( v ) => updateCard( i, { tag: v } ),
											placeholder: 'Tipologia',
											allowedFormats: []
										} )
									),
									el( 'div', { className: 'bmb-card-machine__footer' },
										el( RichText, {
											tagName: 'h3', className: 'bmb-card-machine__name',
											value: c.name,
											onChange: ( v ) => updateCard( i, { name: v } ),
											placeholder: 'Nome Macchina',
											allowedFormats: [ 'core/bold' ]
										} ),
										el( 'span', { className: 'bmb-card-machine__cta', 'aria-hidden': 'true' }, '↗' )
									)
								)
							)
						),
						el( 'div', { className: 'bmb-cards-rail__dots' },
							attributes.cards.map( ( _, i ) =>
								el( 'span', {
									key: i,
									className: 'bmb-cards-rail__dot' + ( i === 0 ? ' bmb-cards-rail__dot--active' : '' )
								} )
							)
						)
					)
				)
			);

			return el( Fragment, {},
				el( InspectorControls, {}, sectionPanel, cardsPanel, tagsPanel, ctaPanel ),
				canvas
			);
		},
		save: function ( props ) {
			const { attributes } = props;
			const blockProps = wp.blockEditor.useBlockProps.save( { className: 'bmb-machines-section' } );

			return el( 'section', Object.assign( {}, blockProps, {
				id: attributes.anchorId || undefined,
				'data-bmb-anim-in': 'fade-up'
			} ),
				el( 'div', { className: 'bmb-machines-section__inner' },
					el( 'div', { className: 'bmb-machines-section__left' },
						el( wp.blockEditor.RichText.Content, { tagName: 'span', className: 'bmb-eyebrow-pill', value: attributes.eyebrow } ),
						el( wp.blockEditor.RichText.Content, { tagName: 'h2', className: 'bmb-machines__title', value: attributes.title } ),
						el( wp.blockEditor.RichText.Content, { tagName: 'p', className: 'bmb-machines__lead', value: attributes.lead } ),
						el( wp.blockEditor.RichText.Content, { tagName: 'p', className: 'bmb-machines__subtitle', value: attributes.subtitle } ),
						el( 'div', { className: 'bmb-typology-chips' },
							attributes.tags.map( ( t, i ) =>
								el( 'a', { key: i, className: 'bmb-typology-chip', href: t.url || '#', 'data-bmb-anchor': ( t.url || '' ).indexOf( '#' ) === 0 ? 'true' : undefined },
									el( 'span', { className: 'material-symbols-sharp bmb-typology-chip__icon' }, t.icon || 'category' ),
									el( wp.blockEditor.RichText.Content, { tagName: 'span', value: t.label } )
								)
							)
						),
						el( 'a', {
							className: 'bmb-catalog-cta',
							href: attributes.ctaUrl || '#',
							'data-bmb-anchor': ( attributes.ctaUrl || '' ).indexOf( '#' ) === 0 ? 'true' : undefined
						},
							el( wp.blockEditor.RichText.Content, { tagName: 'span', className: 'bmb-catalog-cta__label', value: attributes.ctaLabel } ),
							el( 'span', { className: 'bmb-catalog-cta__arrow', 'aria-hidden': 'true' }, '↗' )
						)
					),
					el( 'div', { className: 'bmb-machines-section__right' },
						el( 'div', { className: 'bmb-cards-rail', 'data-bmb-rail': 'true' },
							attributes.cards.map( ( c, i ) =>
								el( 'article', { key: i, className: 'bmb-card-machine' },
									el( 'div', { className: 'bmb-card-machine__media' },
										c.imageUrl ? el( 'img', { src: c.imageUrl, alt: c.alt || '', loading: 'lazy' } ) : null
									),
									el( 'span', { className: 'bmb-card-machine__chip' },
										el( 'span', { className: 'material-symbols-sharp' }, c.icon || 'category' ),
										el( wp.blockEditor.RichText.Content, { tagName: 'span', value: c.tag } )
									),
									el( 'div', { className: 'bmb-card-machine__footer' },
										el( wp.blockEditor.RichText.Content, { tagName: 'h3', className: 'bmb-card-machine__name', value: c.name } ),
										el( 'a', {
											href: c.url || '#',
											className: 'bmb-card-machine__cta',
											'aria-label': 'Dettaglio',
											'data-bmb-anchor': ( c.url || '' ).indexOf( '#' ) === 0 ? 'true' : undefined
										}, '↗' )
									)
								)
							)
						),
						el( 'div', { className: 'bmb-cards-rail__dots' },
							attributes.cards.map( ( _, i ) =>
								el( 'button', {
									key: i,
									type: 'button',
									className: 'bmb-cards-rail__dot' + ( i === 0 ? ' bmb-cards-rail__dot--active' : '' ),
									'data-bmb-rail-dot': i,
									'aria-label': 'Vai alla card ' + ( i + 1 )
								} )
							)
						)
					)
				)
			);
		}
	} );
} )( window.wp );
