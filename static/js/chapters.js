

const loadChapterBtn = document.getElementById('load-chapters')
const chapterContainer = document.getElementById('chapters')

function loadingChaptersText() {

    // Copy the reusable loader markup into the chapter area when clicked.
    const loaderTemplate = document.getElementById('chapter-loading-template')
    chapterContainer.replaceChildren(loaderTemplate.content.cloneNode(true))
}

loadChapterBtn.addEventListener('click', loadingChaptersText)
