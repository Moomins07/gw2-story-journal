

const loadChapterBtn = document.getElementById('load-chapters')
const chapterContainer = document.getElementById('chapters')

function loadingChaptersText() {

    // Copy the reusable loader markup into the chapter area when clicked.
    /* This is actually something entirely new to me but I really like how this was handled by Codex, 
    it added a <template> element in index.html with our loading chapters stying, which does not display by default, 
    followed buy using "replaceChildren" so that multiple clicks on the button do not keep adding new elements. 
    "cloneNode(true)" makes a copy of the content of the
    template element added in the index.html. Essentially, it'll continue to replace the chapterContainer child elements
    with a copy of the template whenever the button is clicked. This solves the issue of multiple elements being added if button
    is clicked multiple times. Awesome.*/
    const loaderTemplate = document.getElementById('chapter-loading-template')
    chapterContainer.replaceChildren(loaderTemplate.content.cloneNode(true))
}


async function loadChapters() {
    loadChapterBtn.disabled = true //disable button at start if fetch request

    try {
        loadingChaptersText()
        const response = await fetch('/api/chapters')
        if (!response.ok) {
            throw new Error(`Chapter request failed: ${response.status}`)
        }
        const chapters = await response.json()

        chapterContainer.replaceChildren()

        for (const item of chapters) {
            const p = document.createElement('p')
            p.textContent = `Chapter: ${item.id} - Chapter title: ${item.title}`
            chapterContainer.appendChild(p)
        }
    } catch (error) {
        chapterContainer.textContent = 'Could not load chapters. Please try again.'
        console.error('Chapter loading failed:', error)
    } finally {
        loadChapterBtn.disabled = false //disable button at at the end of the fetch request
    }
}

loadChapterBtn.addEventListener('click', loadChapters)