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
  	.catch(err => new Error('Hit a snag reaching API endpoint! Error code: ' + err))
	}

	const formatNoResults = () => {
		resultsDiv.appendChild(makeTitle('No results found'))
	}

	// Make the results UI
	const formatResults = (results) => {
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
		el.appendChild(document.createTextNode(attr))
		return el
	}

	const clearResults = () => {
		resultsDiv.innerHTML = ''
	}

	const clearAll = () => {
		clearResults()
		query = null
		start = 0
		limit = 20
		laborType = ''
		resultsTotal = null
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
				laborType = type.text
				if (query !== null) {
					searchCompanies()
				}
			})
		})
	}

	// Watch for changes in search input
	const watchSearchField = () => {
		searchField.oninput = () => {
			query = searchField.value
			if (query === '') {
				clearAll()
			} else {
				setTimeout(() => {
					searchCompanies()
				}, 1000)
			}
		}
	}

	// Tell the DOM to listen to events when it is 'ready'
	document.addEventListener('DOMContentLoaded', function(event) {
		watchLaborFilter()
	  watchSearchField()
	})
})()