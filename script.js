const completedBookListKey = 'LOCAL_COMPLETED_BOOK_LIST'
const ongoingBookListKey = 'LOCAL_ONGOING_BOOK_LIST'

const deleteData = (id) => {
    let ongoingBooks = JSON.parse(localStorage.getItem(ongoingBookListKey))
    let completedBooks = JSON.parse(localStorage.getItem(completedBookListKey))
    let isOngoing = null

    ongoingBooks.forEach(data => {
        if(data.id == id)
            isOngoing = true
    })

    completedBooks.forEach(data => {
        if(data.id == id)
            isOngoing = false
    })

    if(isOngoing == null)
        return
    else if(isOngoing) {
        ongoingBooks = ongoingBooks.filter((data) => {
            return data.id != id
        })

        localStorage.setItem(ongoingBookListKey, JSON.stringify(ongoingBooks))
    } else {
        completedBooks = completedBooks.filter((data) => {
            return data.id != id
        })

        localStorage.setItem(completedBookListKey, JSON.stringify(completedBooks))
    }

    loadData()
}

const moveData = (id) => {
    let ongoingBooks = JSON.parse(localStorage.getItem(ongoingBookListKey))
    let completedBooks = JSON.parse(localStorage.getItem(completedBookListKey))
    let isOngoing = null

    ongoingBooks.forEach(data => {
        if(data.id == id)
            isOngoing = true
    })

    completedBooks.forEach(data => {
        if(data.id == id)
            isOngoing = false
    })

    console.log(isOngoing)

    if(isOngoing == null)
        return
    else if(isOngoing) {
        const movedData = ongoingBooks.filter((data) => {
            return data.id == id
        })
        completedBooks.push(movedData[0])

        localStorage.setItem(completedBookListKey, JSON.stringify(completedBooks))
        localStorage.setItem(ongoingBookListKey, JSON.stringify(ongoingBooks.filter((data) => {
            return data.id != id
        })))
    } else {
        const movedData = completedBooks.filter((data) => {
            return data.id == id
        })
        ongoingBooks.push(movedData[0])
        

        localStorage.setItem(completedBookListKey, JSON.stringify(completedBooks.filter((data) => {
            return data.id != id
        })))
        localStorage.setItem(ongoingBookListKey, JSON.stringify(ongoingBooks))
    }

    loadData()
}

const loadData = (keyword = "") => {
    const ongoingList = document.getElementById('ongoing-list')
    const completedList = document.getElementById('completed-list')

    let ongoingBooks = JSON.parse(localStorage.getItem(ongoingBookListKey))
    let completedBooks = JSON.parse(localStorage.getItem(completedBookListKey))

    if(keyword != "") {
        ongoingBooks = ongoingBooks.filter(x => {
            return x.title.includes(keyword)
        })

        completedBooks = completedBooks.filter(x => {
            return x.title.includes(keyword)
        })
    }

    ongoingList.innerHTML = ``
    completedList.innerHTML = ``
    ongoingBooks.forEach((data) => {
        ongoingList.innerHTML += 
        `
            <article class="collection-item">
                <div class="actions">
                    <div class="action-top">
                        <img src="./assets/ic-ongoing.png" onclick="moveData(${data.id})">
                        <img src="./assets/ic-trash.png" onclick="deleteData(${data.id})">
                    </div>
                    <div class="action-bottom">
                        <img src="./assets/ic-edit.png">
                    </div>
                </div>
                <div class="info">
                    <p>${data.year}</p>
                    <h4>${data.title}</h4>
                    <div class="author-info">
                        <img src="assets/ic-author.png">
                        <h6>${data.author}</h6>
                    </div>
                </div>
            </article>
        `
    })

    completedBooks.forEach((data) => {
        completedList.innerHTML += 
        `
            <article class="collection-item">
                <div class="actions">
                    <div class="action-top">
                        <img src="./assets/ic-done.png" onclick="moveData(${data.id})">
                        <img src="./assets/ic-trash.png" onclick="deleteData(${data.id})">
                    </div>
                    <div class="action-bottom">
                        <img src="./assets/ic-edit.png">
                    </div>
                </div>
                <div class="info">
                    <p>${data.year}</p>
                    <h4>${data.title}</h4>
                    <div class="author-info">
                        <img src="assets/ic-author.png">
                        <h6>${data.author}</h6>
                    </div>
                </div>
            </article>
        `
    })
}

document.addEventListener("DOMContentLoaded", function(event) { 
    const inputCheckBox = document.getElementById('checkbox-status')
    const inputTitle = document.getElementById('input-title')
    const inputAuthor = document.getElementById('input-author')
    const inputYear = document.getElementById('input-year')
    const inputSearchBar = document.getElementById('search-bar')
    const buttonAdd = document.getElementById('button-add')
    const labelStatus = document.getElementById('label-status')

    inputCheckBox.addEventListener("change", () => {
        if(inputCheckBox.checked) {
            labelStatus.innerHTML = "Completed"
            labelStatus.style.color = "#0FA958"
        } else {
            labelStatus.innerHTML = "Ongoing"
            labelStatus.style.color = "#FFD233"
        }
    })

    inputSearchBar.addEventListener("input", () => { 
        const keyword = inputSearchBar.value.trim()
        if (keyword == "")
            loadData()
        else
            loadData(keyword)
    })

    buttonAdd.addEventListener("click", () => {
        // Insert Book
        const isCompleted = inputCheckBox.checked
        const title = inputTitle.value
        const author = inputAuthor.value
        const year = inputYear.value

        if(title.trim() === "")
            alert('Title cannot be empty.')
        else if(author.trim() === "")
            alert('Author cannot be empty.')
        else if(year.trim() === "")
            alert('Year cannot be empty')
        else if(isNaN(year.trim()))
            alert('Year must be a number')

        if(title.trim() === "" || author.trim() === "" || year.trim() === "" || isNaN(year.trim()))
            return
    
        const data = {
            id: new Date().getTime(),
            isCompleted: isCompleted,
            title: title,
            author: author,
            year: year
        }
    
        const ongoingBooks = JSON.parse(localStorage.getItem(ongoingBookListKey))
        const completedBooks = JSON.parse(localStorage.getItem(completedBookListKey))

        isCompleted ? completedBooks.push(data) : ongoingBooks.push(data)
    
        localStorage.setItem(ongoingBookListKey, JSON.stringify(ongoingBooks))
        localStorage.setItem(completedBookListKey, JSON.stringify(completedBooks))

        inputTitle.value = ''
        inputAuthor.value = ''
        inputYear.value = ''

        loadData()
    })

    if (typeof (Storage) !== 'undefined') {
        if (localStorage.getItem(completedBookListKey) === null) {
            const data = {
                id: new Date().getTime(),
                isCompleted: true,
                title: "How to make nasi goreng",
                author: "Philip Indra prayitno",
                year: "2022"
            }
            localStorage.setItem(completedBookListKey, JSON.stringify([data]))
        }
            

        if (localStorage.getItem(ongoingBookListKey) === null) {
            const data = {
                id: new Date().getTime() + 10,
                isCompleted: false,
                title: "How to break someone's heart",
                author: "Aignich Dreso",
                year: "2022"
            }
            localStorage.setItem(ongoingBookListKey, JSON.stringify([data]))
        }
    } else {
        alert('Your Browser doesn\'t support Web Storage.')
    }

    loadData()
})