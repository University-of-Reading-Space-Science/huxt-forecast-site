// cookies.js

(function () {
	const GA_ID = 'G-Q5292J3TN8'
	const COOKIE_NAME = 'analytics_consent'
	const ONE_YEAR = 60 * 60 * 24 * 365

	function setConsent(value) {
		document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${ONE_YEAR}`
	}

	function getConsent() {
		return document.cookie
			.split('; ')
			.find(row => row.startsWith(COOKIE_NAME + '='))
			?.split('=')[1]
	}

	function loadAnalytics() {
		if (window.gtagLoaded) return
		window.gtagLoaded = true

		const s = document.createElement('script')
		s.async = true
		s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
		document.head.appendChild(s)

		window.dataLayer = window.dataLayer || []
		function gtag() { dataLayer.push(arguments) }
		window.gtag = gtag

		gtag('js', new Date())
		gtag('config', GA_ID)
	}

	function createBanner() {
		const banner = document.createElement('div')
		banner.id = 'cookie-banner'
		banner.style = `
			position: fixed;
			bottom: 0;
			width: 100%;
			background: rgba(0,0,0,0.85);
			color: #fff;
			padding: 1em;
			text-align: center;
			z-index: 9999;
			font-family: system-ui, sans-serif;
		`

		banner.innerHTML = `
			<p>
				We use cookies to analyse traffic and improve the site.
				Accept to allow analytics, or reject to opt out.
			</p>
			<button id="accept-cookies">Accept</button>
			<button id="reject-cookies">Reject</button>
		`

		document.body.appendChild(banner)

		document.getElementById('accept-cookies').onclick = () => {
			setConsent('true')
			loadAnalytics()
			banner.remove()
		}

		document.getElementById('reject-cookies').onclick = () => {
			setConsent('false')
			banner.remove()
		}
	}

	// ---- bootstrap ----

	const consent = getConsent()

	if (consent === 'true') {
		loadAnalytics()
	} else if (consent !== 'false') {
		document.addEventListener('DOMContentLoaded', createBanner)
	}
})()
