let pageNo = 0;
let loading = false;

window.onload = async () => {
	await nextNews();
	window.addEventListener("scroll", (e) => {
		const adjValue = document.body.scrollHeight - window.innerHeight;
		if(adjValue <= window.scrollY) {
			window.requestAnimationFrame(async () => {
				await nextNews();
			});
		}
	});
};

const measuredMonthDate = (value) => {
	if(value < 10) {
		return `0${value}`;
	}

	return value;
};

const NEWS_CARD = (cardType, image, title, link, favicon, author, date) => {
	date = date.replace("T", " ");
	const today = new Date();
	const strDate = `${today.getFullYear()}-${measuredMonthDate(today.getMonth() + 1)}-${measuredMonthDate(today.getDate())}`;
	if(-1 < date.indexOf(strDate)) {
		date = date.replace(`${strDate}`, '');
	}

	const html = `
		<li>
			<dl class="${cardType}">
				<dt>
					 <a href="${link}" target="_blank"><img src="${image}" alt="${title}" onerror="this.src='${favicon}'"></a>
				</dt>
				<dd><a href="${link}" target="_blank">${title}</a></dd>
			</dl>
			<div>
				<span class="favicon ${!favicon ? "empty" : ""}">
					 <img src="${favicon}" alt="favicon" />
				</span>
				<span class="author">${author}</span>
				<span class="sign">·</span>
				<span class="date">${date}</span>
			</div>
		</li>
	`;

	return html;
}

const nextNews = async () => {
	if(loading) {
		return;
	}

	pageNo = pageNo + 1;

	const newsList = await fetch(`https://americano.devy.kro.kr/news/search/${pageNo}`).then(result => {
		return result.json();
	});

	if(newsList.length == 0) {
		return;
	}

	const ul = document.querySelector("main ul");
	for(let i=0; i<newsList.length; i++) {
		const newsCard = NEWS_CARD(
			newsList[i].cardType == 1 ? "card-type-1" : "card-type-0",
			newsList[i].image,
			newsList[i].title,
			newsList[i].link,
			newsList[i].favicon,
			newsList[i].publisher,
			newsList[i].pubDate
		);
		ul.insertAdjacentHTML("beforeend", newsCard);
	}
};