<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
		integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
		crossorigin="anonymous"
	/>
</svelte:head>

<div class="post">
	<slot />
</div>

<style lang="scss">
	/* Most of these styles are taken from PaperMod (https://github.com/adityatelange/hugo-PaperMod/) */
	.post {
		:global {
			word-break: break-word;
			@apply bg-[var(--background)] font-roboto text-[18px] leading-[1.6] text-[var(--content)];

			/* Element styles */
			h1 {
				@apply text-[var(--h1)];
			}
			h2 {
				@apply text-[var(--h2)];
			}
			h3 {
				@apply text-[var(--h3)];
			}
			h4 {
				@apply text-[var(--h4)];
			}
			h5 {
				@apply text-[var(--h5)];
			}
			h6 {
				@apply text-[var(--h6)];
			}
			h1,
			h2,
			h3,
			h4,
			h5,
			h6 {
				@apply mb-4 mt-6 font-bold leading-[1.2];
			}
			.post-content {
				@apply text-[var(--content)];

				h1 {
					@apply mb-8 mt-10 text-[40px];
				}
				h2 {
					@apply mb-6 mt-8 text-[32px];
				}
				h3 {
					@apply text-[24px];
				}
				h4 {
					@apply text-[16px];
				}
				h5 {
					@apply text-[14px];
				}
				h6 {
					@apply text-[12px];
				}
				p {
					@apply mb-5 block;
					margin-block-start: 1em;
					margin-block-end: 1em;
					margin-inline-start: 0px;
					margin-inline-end: 0px;
				}

				blockquote {
					@apply my-5 border-l-[3px] border-[var(--h1)] px-[14px];
				}

				table {
					@apply mb-8 block w-full border-collapse border-spacing-0 overflow-x-auto break-keep;
				}
				thead {
					@apply table-header-group border-inherit align-middle;
				}
				tbody {
					@apply table-row-group border-inherit align-middle;
				}
				tr {
					@apply table-row border-inherit;
				}
				th {
					@apply border-b-[1px] border-[var(--border)] px-2 py-3 text-sm leading-[1.5];
				}
				td {
					@apply min-w-[80px] border-b-[1px] border-[var(--border)] px-2 py-3 leading-[1.5];
				}
				code {
					@apply mx-1 my-auto rounded-sm bg-[#282c34] px-[6px] py-1 text-[.78em] leading-[1.5];
				}
				pre {
					@apply relative my-[1em] block whitespace-nowrap;
					code {
						@apply block text-[.9em];
					}
				}
				ol {
					padding-inline-start: 20px;
					@apply mb-5 list-decimal;
				}
				ul {
					padding-inline-start: 20px;
					@apply mb-5 list-disc;
					ul {
						@apply list-[circle];
						ul {
							@apply list-[square];
						}
					}
				}
				li {
					@apply mt-[5px] list-item;
					text-align: -webkit-match-parent;
				}
				hr {
					@apply mx-0 my-8 h-[2px] border-0 bg-[var(--separator)];
				}
				summary {
					@apply select-none hover:cursor-pointer;
				}

				.math-inline .katex-mathml {
					position: relative !important;
				}

				b {
					@apply text-[var(--bold)];
				}
				i {
					@apply text-[var(--italic)];
				}

				a {
					@apply text-[var(--link)] underline visited:text-[var(--visited)] hover:text-[var(--linkHover)];
				}
			}
		}
	}

	:global {
		.katex-html {
			// I have no fucking clue why this shows as regular text and at this point i'm just gonna hide it
			@apply hidden;
		}
	}
</style>
