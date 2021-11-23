const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const { performance } = require('perf_hooks')

/* Fetch Data */
async function fetchData(resource) {
	const baseUrl = `https://rickandmortyapi.com/api/${resource}/`

	// Get api info
	const infoResult = await fetch(baseUrl)
	const infoData = await infoResult.json()

	// Build url
	const range = [...Array(infoData.info.count + 1).keys()]
	range.shift()
	const url = baseUrl + range

	// Get api data
	const results = await fetch(url)
	const data = await results.json()

	return data
}

/* Char Counter */
async function charCounter(resource, char) {
	const regex = new RegExp(`[${char}]`, 'ig')
	const data = await fetchData(resource)

	// Count characters
	const count = data.reduce((acc, d) => {
		acc += (d.name.match(regex) || []).length
		return acc
	}, 0)

	return {
		char,
		count,
		resource,
	}
}

/* Episode Locations */
async function episodeLocations() {
	const results = []

	const [characterList, episodeList] = await Promise.all([
		fetchData('character'),
		fetchData('episode'),
	])

	episodeList.forEach((episode) => {
		const locations = new Set()

		episode.characters.forEach((characterUrl) => {
			// Map episode characters with character list to get origin location
			const result = characterList.find((character) => {
				return character.url === characterUrl
			})

			locations.add(result.origin.name)
		})

		results.push({
			name: episode.name,
			episode: episode.episode,
			count: locations.size,
			locations: [...locations],
		})
	})

	return results
}

/* Home Page */
router.get('/', async function (req, res, next) {
	const response = []
	let startTime = null
	let endTime = null

	/* Char Counter */
	startTime = performance.now()
	const [characterData, locationData, episodeData] = await Promise.all([
		charCounter('character', 'c'),
		charCounter('location', 'l'),
		charCounter('episode', 'e'),
	])
	endTime = performance.now()

	response.push({
		exercise_name: 'Char counter',
		time: endTime - startTime,
		in_time: endTime - startTime < 3000,
		results: [characterData, locationData, episodeData],
	})

	/* Episode Locations */
	startTime = performance.now()
	const results = await episodeLocations()
	endTime = performance.now()

	response.push({
		exercise_name: 'Episode locations',
		time: endTime - startTime,
		in_time: endTime - startTime < 3000,
		results,
	})

	/* Render Index Page*/
	res.render('index', { title: 'Rick And Morty Challenge', response })
})

module.exports = {
	router,
	fetchData,
	charCounter,
	episodeLocations,
}
