(function() {
	/////////////////////////////
	// 		GLOBAL VARIABLES		//
	////////////////////////////
	// Selectors used more than once
	const searchField = document.querySelector('#search-field')
	const resultsDiv = document.querySelector('.results')

	// Dynmaic variables updated in different places
	let query = null
	let start = 0
	let limit = 20
	let laborType = ''
	let resultsTotal = null

	/////////////////////////////
	// 				FUNCTIONS    		//
	////////////////////////////
	// Make the URL w/ dynamic variables from user input/actions
	const makeUrl = () => {
		const base = 'http://localhost:3000/api/companies?'
		return `${base}q=${query}&laborTypes=${laborType}&start=${start}&limit=${limit}`
	}

	// Make the API call to the server
	const getData = (url) => {
	  fetch(url)
  	.then(result => result.json())
    .then((data) => {
      resultsTotal = data.total
      resultsTotal > 0 ? formatResults(data.results) : formatNoResults()
    })
  	.catch(err => new Error(console.log('Hit a snag reaching API endpoint! Error code: ' + err)))
	}

	const formatNoResults = () => {
		resultsDiv.appendChild(makeTitle('No results found'))
	}

	// Make the results UI
	const formatResults = (results) => {
		if (resultsTotal > limit) {
			makePaginator()
	  	watchPageClicks()
		}

		results.map((resultItem) => {
			let itemDiv = resultsDiv.appendChild(makeResultItemDiv())
			itemDiv.appendChild(makeAvatar(resultItem.avatarUrl))
			itemDiv.appendChild(makeTitle(resultItem.name))
			itemDiv.appendChild(makeText(resultItem.phone))
			itemDiv.appendChild(makeLink(resultItem.website))
			itemDiv.appendChild(makeText(resultItem.laborType))
		})
	}

	const makeResultItemDiv = () => {
		let resultItemDiv = document.createElement('div')
		resultItemDiv.setAttribute('class', 'result-item')
		return resultItemDiv
	}

	const makeAvatar = (attr) => {
		let avatar = document.createElement('img')
		avatar.src = attr
		avatar.setAttribute('class', 'result-item-avatar')
		return avatar
	}

	const makeTitle = (attr) => {
		let el = document.createElement('h3')
		el.setAttribute('class', 'result-item-title')
		el.appendChild(document.createTextNode(attr))
		return el
	}

	const makeText = (attr) => {
		let el = document.createElement('p')
		el.setAttribute('class', 'result-item-info')
		el.appendChild(document.createTextNode(attr))
		return el
	}

	const makeLink = (attr) => {
		let el = document.createElement('a')
		el.href = attr
		el.setAttribute('class', 'result-item-info')
		el.setAttribute('target', '_blank')
		el.appendChild(document.createTextNode(attr))
		return el
	}

	// Make the pagination UI
	const makePaginator = () => {
		let totalPages = Math.ceil(resultsTotal / limit)
		let paginatorDiv = resultsDiv.appendChild(makePaginatorDiv(totalPages))
		Array(totalPages).fill().map((_, page) => {
			paginatorDiv.appendChild(makePageButton(page))
		})
	}

	const makePageButton = (page) => {
		let el = document.createElement('a')
		page === start ? el.setAttribute('class', 'page-number active') : el.setAttribute('class', 'page-number')
		// Adding 1 so that start can be 0 but the UI can show page 1
		el.appendChild(document.createTextNode(page + 1))
		return el
	}

	const makePaginatorDiv = () => {
		let el = document.createElement('div')
		el.setAttribute('class', 'paginator')
		return el
	}

	// Clear results UI
	const clearResults = () => {
		resultsDiv.innerHTML = ''
	}

	// Clear results UI and reset the API variables
	const clearAll = () => {
		clearResults()
		query = null
		start = 0
		limit = 20
		laborType = ''
		resultsTotal = null
	}

	// Helper-type functions
	const setQuery = () => {
		query = searchField.value
	}

	const checkQuery = () => {
		if (query === '' || query === ' ' || query === null) return true
	}

	const runQuery = () => {
		setQuery()
		checkQuery() ? clearAll() : searchCompanies()
	}

	const delayQuery = (func, ms, immediate) => {
	  let timeout
	  return () => {
	    let run = immediate && !timeout
	    let wait = () => {
	      timeout = null
	      if (!immediate) func.apply(this, arguments)
	    }
	    clearTimeout(timeout)
	    timeout = setTimeout(wait, ms)
	    if (run) func.apply(this, arguments)
	  }
	}

	// Make the magic happen
	const searchCompanies = () => {
		clearResults()
	 	getData(makeUrl())
	}

	/////////////////////////////
	// 		EVENT LISTENTERS		//
	////////////////////////////
	// Update laborType if user clicks on filter link
	const watchLaborFilter = () => {
		const laborTypes = [].slice.call(document.getElementsByClassName('labor-types'))
		laborTypes.map((type) => {
			type.addEventListener('click', function() {
				type.text === 'All' ? laborType = '' : laborType = type.text
				runQuery()
			})
		})
	}

	// Watch for changes in search input
	const watchSearchField = () => {
		searchField.oninput = delayQuery(runQuery, 1000)
	}

	// Get next set of results based on page click & highlight that page as active
	const watchPageClicks = () => {
		let pages = [].slice.call(document.getElementsByClassName('page-number'))
		pages.map((page) => {
			page.addEventListener('click', function() {
				start = page.text-1
				page.setAttribute('class', 'page-number active')
				searchCompanies()
			})
		})
	}

	// Tell the DOM to listen to events when it is 'ready'
	document.addEventListener('DOMContentLoaded', function(event) {
		watchLaborFilter()
	  watchSearchField()
	})
})()