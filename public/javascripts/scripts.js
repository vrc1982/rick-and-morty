const verJSON = function () {
	document.querySelector('pre').style.display = 'block'
	document.querySelector('section').style.display = 'none'
	document.querySelector('#btnJSON').style.display = 'none'
	document.querySelector('#btnVolver').style.display = 'block'
}

const volver = function () {
	document.querySelector('pre').style.display = 'none'
	document.querySelector('section').style.display = 'flex'
	document.querySelector('#btnJSON').style.display = 'block'
	document.querySelector('#btnVolver').style.display = 'none'
}
