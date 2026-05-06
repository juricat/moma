/**
 * BMB Media - immagine o video (YouTube/Vimeo/upload).
 */
( function ( wp ) {
	const { registerBlockType } = wp.blocks;
	const { InspectorControls, useBlockProps, MediaUpload, MediaUploadCheck, RichText } = wp.blockEditor;
	const { PanelBody, SelectControl, TextControl, ToggleControl, Button } = wp.components;
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
		{ label: 'Zoom Out',  value: 'zoom-out' }
	];

	function parseYouTube( url ) {
		const m = url.match( /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/ );
		return m ? m[ 1 ] : '';
	}
	function parseVimeo( url ) {
		const m = url.match( /vimeo\.com\/(?:video\/)?(\d+)/ );
		return m ? m[ 1 ] : '';
	}

	registerBlockType( 'bmb/media', {
		edit: function ( props ) {
			const { attributes, setAttributes } = props;
			const className = [
				'bmb-media',
				'bmb-media--' + attributes.mediaType,
				'bmb-media--ratio-' + attributes.ratio,
				'bmb-media--size-' + attributes.size,
				'bmb-media--rounded-' + attributes.rounded
			].join( ' ' );
			const blockProps = useBlockProps( { className: className } );

			let preview;
			if ( attributes.mediaType === 'image' ) {
				preview = attributes.imageUrl
					? el( 'img', { src: attributes.imageUrl, alt: attributes.imageAlt || '', className: 'bmb-media__img' } )
					: el( 'div', { className: 'bmb-media__placeholder' }, __( 'Nessuna immagine selezionata', 'bmb-landing' ) );
			} else {
				let src = '';
				if ( attributes.videoSource === 'youtube' ) {
					const id = parseYouTube( attributes.videoUrl );
					src = id ? 'https://www.youtube.com/embed/' + id : '';
				} else if ( attributes.videoSource === 'vimeo' ) {
					const id = parseVimeo( attributes.videoUrl );
					src = id ? 'https://player.vimeo.com/video/' + id : '';
				} else if ( attributes.videoSource === 'file' ) {
					src = attributes.videoFileUrl;
				}
				if ( attributes.videoSource === 'file' && src ) {
					preview = el( 'video', { src: src, controls: true, className: 'bmb-media__video' } );
				} else if ( src ) {
					preview = el( 'iframe', { src: src, frameBorder: 0, allowFullScreen: true, className: 'bmb-media__iframe' } );
				} else {
					preview = el( 'div', { className: 'bmb-media__placeholder' }, __( 'Configura URL o file video nel pannello', 'bmb-landing' ) );
				}
			}

			return el( Fragment, {},
				el( InspectorControls, {},
					el( PanelBody, { title: __( 'Tipo di Media', 'bmb-landing' ), initialOpen: true },
						el( SelectControl, {
							label: __( 'Tipo', 'bmb-landing' ),
							value: attributes.mediaType,
							options: [
								{ label: 'Immagine', value: 'image' },
								{ label: 'Video',    value: 'video' }
							],
							onChange: ( v ) => setAttributes( { mediaType: v } )
						} )
					),
					attributes.mediaType === 'image' && el( PanelBody, { title: __( 'Immagine', 'bmb-landing' ), initialOpen: true },
						el( MediaUploadCheck, {},
							el( MediaUpload, {
								onSelect: ( m ) => setAttributes( { imageId: m.id, imageUrl: m.url, imageAlt: m.alt || '' } ),
								allowedTypes: [ 'image' ],
								value: attributes.imageId,
								render: ( { open } ) => el( Button, { variant: 'primary', onClick: open },
									attributes.imageUrl ? __( 'Cambia immagine', 'bmb-landing' ) : __( 'Carica / Seleziona immagine', 'bmb-landing' )
								)
							} )
						),
						el( TextControl, {
							label: __( 'Alt text', 'bmb-landing' ),
							value: attributes.imageAlt,
							onChange: ( v ) => setAttributes( { imageAlt: v } )
						} )
					),
					attributes.mediaType === 'video' && el( PanelBody, { title: __( 'Video', 'bmb-landing' ), initialOpen: true },
						el( SelectControl, {
							label: __( 'Sorgente', 'bmb-landing' ),
							value: attributes.videoSource,
							options: [
								{ label: 'YouTube', value: 'youtube' },
								{ label: 'Vimeo',   value: 'vimeo' },
								{ label: 'File caricato', value: 'file' }
							],
							onChange: ( v ) => setAttributes( { videoSource: v } )
						} ),
						( attributes.videoSource === 'youtube' || attributes.videoSource === 'vimeo' ) && el( TextControl, {
							label: __( 'URL del video', 'bmb-landing' ),
							help:  __( 'Incolla URL completo (es: https://youtu.be/XXXX)', 'bmb-landing' ),
							value: attributes.videoUrl,
							onChange: ( v ) => setAttributes( { videoUrl: v } )
						} ),
						attributes.videoSource === 'file' && el( MediaUploadCheck, {},
							el( MediaUpload, {
								onSelect: ( m ) => setAttributes( { videoFileId: m.id, videoFileUrl: m.url } ),
								allowedTypes: [ 'video' ],
								value: attributes.videoFileId,
								render: ( { open } ) => el( Button, { variant: 'primary', onClick: open },
									attributes.videoFileUrl ? __( 'Cambia video', 'bmb-landing' ) : __( 'Carica / Seleziona video', 'bmb-landing' )
								)
							} )
						),
						el( ToggleControl, { label: __( 'Controlli', 'bmb-landing' ),    checked: attributes.videoControls, onChange: ( v ) => setAttributes( { videoControls: v } ) } ),
						el( ToggleControl, { label: __( 'Autoplay', 'bmb-landing' ),     checked: attributes.videoAutoplay, onChange: ( v ) => setAttributes( { videoAutoplay: v } ) } ),
						el( ToggleControl, { label: __( 'Loop', 'bmb-landing' ),         checked: attributes.videoLoop, onChange: ( v ) => setAttributes( { videoLoop: v } ) } ),
						el( ToggleControl, { label: __( 'Muto (richiesto per autoplay)', 'bmb-landing' ), checked: attributes.videoMuted, onChange: ( v ) => setAttributes( { videoMuted: v } ) } ),
						el( MediaUploadCheck, {},
							el( MediaUpload, {
								onSelect: ( m ) => setAttributes( { poster: m.url } ),
								allowedTypes: [ 'image' ],
								render: ( { open } ) => el( Button, { variant: 'secondary', onClick: open, style: { marginTop: 8 } },
									attributes.poster ? __( 'Cambia poster', 'bmb-landing' ) : __( 'Imposta poster', 'bmb-landing' )
								)
							} )
						)
					),
					el( PanelBody, { title: __( 'Aspetto', 'bmb-landing' ), initialOpen: false },
						el( SelectControl, {
							label: __( 'Aspect Ratio', 'bmb-landing' ),
							value: attributes.ratio,
							options: [
								{ label: 'Auto',  value: 'auto' },
								{ label: '16:9',  value: '16-9' },
								{ label: '4:3',   value: '4-3' },
								{ label: '1:1',   value: '1-1' },
								{ label: '3:4',   value: '3-4' },
								{ label: '9:16',  value: '9-16' },
								{ label: '21:9',  value: '21-9' }
							],
							onChange: ( v ) => setAttributes( { ratio: v } )
						} ),
						el( SelectControl, {
							label: __( 'Dimensione', 'bmb-landing' ),
							value: attributes.size,
							options: [
								{ label: 'S 320px',   value: 's' },
								{ label: 'M 540px',   value: 'm' },
								{ label: 'L 800px',   value: 'l' },
								{ label: 'XL 1100px', value: 'xl' },
								{ label: 'Full 100%', value: 'full' }
							],
							onChange: ( v ) => setAttributes( { size: v } )
						} ),
						el( SelectControl, {
							label: __( 'Bordi arrotondati', 'bmb-landing' ),
							value: attributes.rounded,
							options: [
								{ label: 'Nessuno', value: 'none' },
								{ label: 'S',       value: 's' },
								{ label: 'M',       value: 'm' },
								{ label: 'L',       value: 'l' },
								{ label: 'Pill',    value: 'pill' }
							],
							onChange: ( v ) => setAttributes( { rounded: v } )
						} )
					),
					el( PanelBody, { title: __( 'Link & Ancora', 'bmb-landing' ), initialOpen: false },
						el( TextControl, {
							label: __( 'ID di ancoraggio (questo media)', 'bmb-landing' ),
							value: attributes.anchorId,
							onChange: ( v ) => setAttributes( { anchorId: v.replace( /[^a-zA-Z0-9_-]/g, '' ) } )
						} ),
						el( SelectControl, {
							label: __( 'Tipo di link sul media', 'bmb-landing' ),
							value: attributes.linkType,
							options: [
								{ label: 'Nessuno',        value: 'none' },
								{ label: 'URL esterno',    value: 'external' },
								{ label: 'Ancora interna', value: 'anchor' }
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
						el( SelectControl, { label: __( 'Entrata', 'bmb-landing' ), value: attributes.animationIn,  options: ANIM, onChange: ( v ) => setAttributes( { animationIn: v } ) } ),
						el( SelectControl, { label: __( 'Uscita',  'bmb-landing' ), value: attributes.animationOut, options: ANIM, onChange: ( v ) => setAttributes( { animationOut: v } ) } )
					)
				),
				el( 'figure', Object.assign( {}, blockProps, { id: attributes.anchorId || undefined } ),
					el( 'div', { className: 'bmb-media__frame' }, preview ),
					el( RichText, {
						tagName: 'figcaption',
						className: 'bmb-media__caption',
						value: attributes.caption,
						onChange: ( v ) => setAttributes( { caption: v } ),
						placeholder: __( 'Didascalia (opzionale)', 'bmb-landing' ),
						allowedFormats: [ 'core/bold', 'core/italic', 'core/link' ]
					} )
				)
			);
		},
		save: function ( props ) {
			const { attributes } = props;
			const className = [
				'bmb-media',
				'bmb-media--' + attributes.mediaType,
				'bmb-media--ratio-' + attributes.ratio,
				'bmb-media--size-' + attributes.size,
				'bmb-media--rounded-' + attributes.rounded
			].join( ' ' );
			const blockProps = wp.blockEditor.useBlockProps.save( {
				className: className,
				id: attributes.anchorId || undefined,
				'data-bmb-anim-in':  attributes.animationIn,
				'data-bmb-anim-out': attributes.animationOut
			} );

			let inner;
			if ( attributes.mediaType === 'image' ) {
				inner = attributes.imageUrl
					? el( 'img', { src: attributes.imageUrl, alt: attributes.imageAlt || '', className: 'bmb-media__img', loading: 'lazy', decoding: 'async' } )
					: null;
			} else {
				if ( attributes.videoSource === 'file' && attributes.videoFileUrl ) {
					inner = el( 'video', {
						src: attributes.videoFileUrl,
						className: 'bmb-media__video',
						controls: attributes.videoControls,
						autoPlay: attributes.videoAutoplay,
						loop:     attributes.videoLoop,
						muted:    attributes.videoMuted,
						playsInline: true,
						poster:   attributes.poster || undefined
					} );
				} else if ( attributes.videoSource === 'youtube' ) {
					const m = attributes.videoUrl.match( /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/ );
					const id = m ? m[ 1 ] : '';
					if ( id ) {
						const params = [];
						if ( attributes.videoAutoplay ) params.push( 'autoplay=1' );
						if ( attributes.videoLoop )     params.push( 'loop=1&playlist=' + id );
						if ( attributes.videoMuted )    params.push( 'mute=1' );
						if ( ! attributes.videoControls ) params.push( 'controls=0' );
						const src = 'https://www.youtube.com/embed/' + id + ( params.length ? '?' + params.join( '&' ) : '' );
						inner = el( 'iframe', { src: src, className: 'bmb-media__iframe', frameBorder: 0, allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share', allowFullScreen: true, loading: 'lazy', title: 'YouTube video' } );
					}
				} else if ( attributes.videoSource === 'vimeo' ) {
					const m = attributes.videoUrl.match( /vimeo\.com\/(?:video\/)?(\d+)/ );
					const id = m ? m[ 1 ] : '';
					if ( id ) {
						const params = [];
						if ( attributes.videoAutoplay ) params.push( 'autoplay=1' );
						if ( attributes.videoLoop )     params.push( 'loop=1' );
						if ( attributes.videoMuted )    params.push( 'muted=1' );
						const src = 'https://player.vimeo.com/video/' + id + ( params.length ? '?' + params.join( '&' ) : '' );
						inner = el( 'iframe', { src: src, className: 'bmb-media__iframe', frameBorder: 0, allow: 'autoplay; fullscreen; picture-in-picture', allowFullScreen: true, loading: 'lazy', title: 'Vimeo video' } );
					}
				}
			}

			let frame = el( 'div', { className: 'bmb-media__frame' }, inner );

			if ( attributes.linkType !== 'none' && attributes.linkUrl ) {
				const href = attributes.linkType === 'anchor'
					? '#' + attributes.linkUrl.replace( /^#/, '' )
					: attributes.linkUrl;
				const linkAttrs = {
					href: href,
					className: 'bmb-media__link',
					'data-bmb-anchor': attributes.linkType === 'anchor' ? 'true' : undefined
				};
				if ( attributes.linkType === 'external' && attributes.linkTarget ) {
					linkAttrs.target = '_blank';
					linkAttrs.rel = 'noopener noreferrer';
				}
				frame = el( 'a', linkAttrs, frame );
			}

			const captionContent = attributes.caption
				? el( wp.blockEditor.RichText.Content, { tagName: 'figcaption', className: 'bmb-media__caption', value: attributes.caption } )
				: null;

			return el( 'figure', blockProps, frame, captionContent );
		}
	} );
} )( window.wp );
