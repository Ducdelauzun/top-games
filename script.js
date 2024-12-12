// initialize variable
let carsList

fetch("http://localhost:3000/api/cars", {
	method: "GET",
	headers: {
		"x-api-key": "secret_phrase_here",
		"Content-Type": "application/json",
		Accept: "application/json",
	},
})
	.then((res) => {
		if (!res.ok) {
			console.log("your API isn't working !!!")
		}
		res.json().then((data) => {
			console.log(data)
			carsList = data // Mise à jour de la liste des voitures avec les données récupérées
			writeDom()  // APRÈS que les données aient été récupérées 
		})
	})
	.catch((error) =>
		console.error("Erreur lors de la récupération des voitures :", error)
	)

function writeDom() {
	carsList.forEach((game) => {
		const articleContainer = document.querySelector(".row");
		articleContainer.innerHTML += `<article class="col">
							<div class="card shadow-sm">
								<img src="${game.carImage}" alt="${game.carName}" class="card-img-top" />

								<div class="card-body">
									<h3 class="card-title">${game.carName}</h3>
									<p class="card-text">
										${game.carYear}
									</p>
									<div
										class="d-flex justify-content-between align-items-center"
									>
										<div class="btn-group">
											<button
												type="button"
												class="btn btn-sm btn-outline-secondary view"
												data-bs-toggle="modal" data-bs-target="#exampleModal"
												data-view-id="${game.id}"
											>
												View
											</button>
											<button
												type="button"
												class="btn btn-sm btn-outline-secondary edit"
												data-bs-toggle="modal" data-bs-target="#exampleModal"
												data-edit-id="${game.id}"
											>
												Edit
											</button>
										</div>
									</div>
								</div>
							</div>
						</article>`;
	});
}

writeDom()
attachEventListeners()

const editButtons = document.querySelectorAll(".edit")
editButtons.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		editModal(e.target.getAttribute("data-edit-id"))
	})
})

const viewButtons = document.querySelectorAll(".view")
viewButtons.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		viewModal(e.target.getAttribute("data-view-id"))
	})
})

function modifyModal(modalTitle, modalBody) {
	// Écrir le nom du jeu dans le titre du modal
	document.querySelector(".modal-title").textContent = modalTitle
    //console.log(modalTitle)
	document.querySelector(".modal-body").innerHTML = modalBody
	document.querySelector(".modal-footer").innerHTML = `
		<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
			Close
		</button>
		<button type="submit" data-bs-dismiss="modal" class="btn btn-primary">Submit</button>
</form>`
}


function viewModal(gameId) {
	// console.log(gameId, gamesList)
	// Trouvez le jeu en fonction de son identifiant
	const result = gamesList.findIndex((game) => game.id === parseInt(gameId))
	const modalBody = `<img src="${gamesList[result].imageUrl}" alt="${gamesList[result].title}" class="img-fluid" />`
	modifyModal(gamesList[result].title, modalBody)
	document.querySelector(".modal-footer").innerHTML = `
		<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
			Close
		</button>
</form>`
}

function editModal(gameId) {
	//console.log(gameId, gamesList)
	// Trouvez le jeu en fonction de son identifiant
	const result = gamesList.findIndex((game) => game.id === parseInt(gameId))
	fetch("./form.html").then((data) => {
		data.text().then((form) => {
			const selectedGame = gamesList[result]
			modifyModal("Mode Edition", form)
			modifyFom({
				title: selectedGame.title,
				year: selectedGame.year,
				imageUrl: selectedGame.imageUrl,
			})
			document
				.querySelector('button[type="submit"]')
				.addEventListener("click", () =>
					updateGames(title.value, year.value, imageUrl.value, gameId)
				)
		})
	})
	//const selectedGame = gamesList[result]
	//console.log(selectedGame)
	// passer une image comme corps du modal
	//const modalBody = `<h4>ajoutez un formulaire pour modifier le jeu ici</h4>`
	//modifyModal("Mode Edition", modalBody)
}

function modifyFom(gameData) {
	const form = document.querySelector("form")
	form.title.value = gameData.title
	form.year.value = gameData.year
	form.imageUrl.value = gameData.imageUrl
}

function updateGames(title, year, imageUrl, gameId) {
	// Trouvez le jeu en fonction de son identifiant
	const index = gamesList.findIndex((game) => game.id === parseInt(gameId))

	gamesList[index].title = title
	gamesList[index].year = year
	gamesList[index].imageUrl = imageUrl
	document.querySelector(".row").innerHTML = "" // Nous supprimons toutes les données des jeux dans le DOM.
	writeDom()
	attachEventListeners()
}

function attachEventListeners() {
	const editButtons = document.querySelectorAll(".edit");
	editButtons.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			editModal(e.target.getAttribute("data-edit-id"));
		});
	});

	const viewButtons = document.querySelectorAll(".view");
	viewButtons.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			viewModal(e.target.getAttribute("data-view-id"));
		});
	});
}