const completedBookListKey = 'LOCAL_COMPLETED_BOOK_LIST'
const ongoingBookListKey = 'LOCAL_ONGOING_BOOK_LIST'
let currentEditedId = null

const hidePopup = () => {
    const popupEdit = document.getElementById('edit-modal')
    const sectionEdit = document.getElementById('section-edit')

    popupEdit.style.visibility = 'hidden'
    popupEdit.style.opacity = 0
    sectionEdit.style.visibility = 'hidden'
    sectionEdit.style.opacity = 0
    currentEditedId = null
}

const toggleEditPopup = (id) => {
    currentEditedId = id
    let ongoingBooks = JSON.parse(localStorage.getItem(ongoingBookListKey))
    let completedBooks = JSON.parse(localStorage.getItem(completedBookListKey))
    let targetData = null

    ongoingBooks.forEach(data => {
        if(data.id == id) {
            targetData = data
        }  
    })

    completedBooks.forEach(data => {
        if(data.id == id) {
            targetData = data
        }
    })
    if(targetData == null) {
        hidePopup()
        return
    }
        
    const inputCheckBox = document.getElementById('checkbox-status-edit')
    const inputTitle = document.getElementById('input-title-edit')
    const inputAuthor = document.getElementById('input-author-edit')
    const inputYear = document.getElementById('input-year-edit')
    const labelStatus = document.getElementById('label-status-edit')

    inputCheckBox.checked = targetData.isCompleted
    inputTitle.value = targetData.title
    inputAuthor.value = targetData.author
    inputYear.value = targetData.year

    if(targetData.isCompleted) {
        labelStatus.innerHTML = "Completed"
        labelStatus.style.color = "#0FA958"
    } else {
        labelStatus.innerHTML = "Ongoing"
        labelStatus.style.color = "#FFD233"
    }

    const editPopup = document.getElementById('edit-modal')
    const sectionEdit = document.getElementById('section-edit')
    editPopup.style.visibility = 'visible'
    editPopup.style.opacity = 1
    sectionEdit.style.visibility = 'visible'
    sectionEdit.style.opacity = 1

    inputCheckBox.addEventListener("change", () => {
        if(inputCheckBox.checked) {
            labelStatus.innerHTML = "Completed"
            labelStatus.style.color = "#0FA958"
        } else {
            labelStatus.innerHTML = "Ongoing"
            labelStatus.style.color = "#FFD233"
        }
    })
}

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

    if(isOngoing == null)
        return
    else if(isOngoing) {
        let movedData = ongoingBooks.filter((data) => {
            return data.id == id
        })
        movedData[0].isCompleted = true
        completedBooks.push(movedData[0])

        localStorage.setItem(completedBookListKey, JSON.stringify(completedBooks))
        localStorage.setItem(ongoingBookListKey, JSON.stringify(ongoingBooks.filter((data) => {
            return data.id != id
        })))
    } else {
        let movedData = completedBooks.filter((data) => {
            return data.id == id
        })
        movedData[0].isCompleted = false
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
                        <img src="./assets/ic-edit.png" onclick="toggleEditPopup(${data.id})">
                    </div>
                </div>
                <div class="info">
                    <div>
                        <p>${data.year}</p>
                        <h4>${data.title}</h4>
                    </div>
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
                        <img src="./assets/ic-edit.png" onclick="toggleEditPopup(${data.id})">
                    </div>
                </div>
                <div class="info">
                    <div>
                        <p>${data.year}</p>
                        <h4>${data.title}</h4>
                    </div>
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
    const buttonCancel = document.getElementById('button-cancel')
    const buttonEdit = document.getElementById('button-edit')
    const labelStatus = document.getElementById('label-status')
    const popupEdit = document.getElementById('edit-modal')
    const inputCheckBoxEdit = document.getElementById('checkbox-status-edit')
    const inputTitleEdit = document.getElementById('input-title-edit')
    const inputAuthorEdit = document.getElementById('input-author-edit')
    const inputYearEdit = document.getElementById('input-year-edit')

    popupEdit.addEventListener("click", () => {
        hidePopup()
    })

    buttonCancel.addEventListener("click", () => {
        hidePopup()
    })

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

    buttonEdit.addEventListener("click", () => {
        // Edit Book
        const isCompleted = inputCheckBoxEdit.checked
        const title = inputTitleEdit.value
        const author = inputAuthorEdit.value
        const year = inputYearEdit.value

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

        let ongoingBooks = JSON.parse(localStorage.getItem(ongoingBookListKey))
        let completedBooks = JSON.parse(localStorage.getItem(completedBookListKey))
        let targetData = null
    
        ongoingBooks.forEach(data => {
            if(data.id == currentEditedId) {
                targetData = data
            }  
        })
    
        completedBooks.forEach(data => {
            if(data.id == currentEditedId) {
                targetData = data
            }
        })
        if(targetData == null) {
            hidePopup()
            return
        }

        targetData.title = title
        targetData.author = author
        targetData.year = year
    
        localStorage.setItem(ongoingBookListKey, JSON.stringify(ongoingBooks))
        localStorage.setItem(completedBookListKey, JSON.stringify(completedBooks))

        if(targetData.isCompleted != isCompleted) {
            moveData(currentEditedId)
        }

        hidePopup()
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
            const data1 = {
                id: new Date().getTime() + 10,
                isCompleted: false,
                title: "How to break someone's heart",
                author: "Aignich Dreso",
                year: "2022"
            }
            const data2 = {
                id: new Date().getTime() + 20,
                isCompleted: false,
                title: "React Programming",
                author: "Philip Indra Prayitno",
                year: "2022"
            }
            localStorage.setItem(ongoingBookListKey, JSON.stringify([data1, data2]))
        }
    } else {
        alert('Your Browser doesn\'t support Web Storage.')
    }

    loadData()
})