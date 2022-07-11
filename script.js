$(document).ready(function() {
    let activeIndex = 0
    let dataSource = [
        {
            isSale: true,
            imageSource: './assets/bs-2.jpg',
            category: 'Sneakers',
            name: 'Nike Air Force 1 Triple White',
            actualPrice: 'Rp. 1.000.000',
            discountPrice: 'Rp. 800.000',
            totalSold: '2.079',
            rating: '4.9'
        },
        {
            isSale: true,
            imageSource: './assets/bs-1.jpg',
            category: 'Sneakers',
            name: 'Adidas Ultraboost 1.0 Cookies & Cream',
            actualPrice: 'Rp. 2.000.000',
            discountPrice: 'Rp. 1.550.000',
            totalSold: '1.548',
            rating: '4.9'
        },
        {
            isSale: true,
            imageSource: './assets/bs-4.jpg',
            category: 'Men’s & Women’s',
            name: 'Essentials Fear of GOD Hoodie',
            actualPrice: 'Rp. 1.200.000',
            discountPrice: 'Rp. 950.000',
            totalSold: '1.131',
            rating: '4.8'
        },
        {
            isSale: false,
            imageSource: './assets/bs-3.jpg',
            category: 'Fragrance',
            name: 'Dior Sauvage Elixir',
            actualPrice: 'Rp. 3.000.000',
            discountPrice: 'Rp. 3.000.000',
            totalSold: '574',
            rating: '4.9'
        }
    ]

    const initCarousel = () => {
        let i
        let carouselItems = document.getElementsByClassName("carousel-item")
        let indicators = document.getElementsByClassName("indicator")

        for (i = 0; i < carouselItems.length; i++) {
            carouselItems[i].style.display = "none"
        }

        activeIndex++
        if (activeIndex > carouselItems.length)
            activeIndex = 1  

        for (i = 0; i < indicators.length; i++)
            indicators[i].className = indicators[i].className.replace(" active", "")
        
        carouselItems[activeIndex - 1].style.display = "block"
        indicators[activeIndex - 1].className += " active"
        setTimeout(initCarousel, 4000) 
    }

    const initData = () => {
        let container = document.getElementsByClassName('sellers')[0]
        dataSource.forEach(item => {
            let htmlStructure = `
                <article>
                    ${ 
                        item.isSale ? 
                        `
                            <div class="sale-tag">
                            <h2>Sale</h2>
                            </div>
                        ` 
                        : 
                        '' 
                    }
                    <img src="${ item.imageSource }">
                    <div class="content">
                        <h4>${ item.category }</h4>
                        <h6>${ item.name }</h6>
                        ${
                            item.isSale ?
                            `
                                <span>
                                    <h5 class="actual-price">${ item.actualPrice }</h5>
                                    <h5 class="discount-price">${ item.discountPrice }</h5>
                                </span>
                            `
                            :
                            `
                                <span>
                                    <h5 class="discount-price fc-black" style="margin-left: 0">${ item.actualPrice }</h5>
                                </span>
                            `
                        }
                    
                        <div class="ratensold">
                            <img src="assets/ic-star-filll.png">
                            <p>${ item.rating } | ${ item.totalSold } Pc(s) sold</p>
                        </div>
                    </div>
                </article>
            `
            container.innerHTML += htmlStructure
        })
    }

    initCarousel()
    initData()
})