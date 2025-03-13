(() => {
  const BASE_URL = "https://gist.githubusercontent.com";
  const STORAGE_KEY = "carouselProductList";
  const FAVORITES_KEY = "favorites";

  const init = async () => {
    const products = await getProducts();
    buildHTML(products);
    buildCSS();
  };

  const getProducts = async () => {
    const storedProducts = localStorage.getItem(STORAGE_KEY);

    if (storedProducts) return JSON.parse(storedProducts);

    const response = await fetch(
      `${BASE_URL}/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json`
    );
    const data = await response.json();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  };

  const buildHTML = (products) => {
    const container = document.createElement("div");
    const heading = document.createElement("h1");
    const carouselWrapper = document.createElement("div");
    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");
    const carousel = document.createElement("div");

    container.className = "product-carousel";
    heading.innerText = "You Might Also Like";
    carouselWrapper.className = "carousel-wrapper";
    prevButton.className = "carousel-btn prev-btn";
    prevButton.innerText = "<";
    nextButton.className = "carousel-btn next-btn";
    nextButton.innerText = ">";
    carousel.className = "carousel-container";

    products.forEach(({ id, img, name, price, url }) => {
      const item = document.createElement("div");
      item.className = "carousel-item";
      item.innerHTML = `
              <button class="favorite-btn" data-id="${id}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
              <img src="${img}" />
              <p>${name}</p>
              <p>${price}</p>
            `;

      const favoriteButton = item.querySelector(".favorite-btn");

      if (isFavorite(id)) favoriteButton.classList.add("favorited");

      favoriteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(favoriteButton, id);
      });

      item.addEventListener("click", () => window.open(url, "_blank"));
      carousel.append(item);
    });

    carouselWrapper.append(prevButton, carousel, nextButton);
    container.append(heading, carouselWrapper);

    document.querySelector(".product-detail")?.append(container);

    prevButton.addEventListener("click", () => moveCarousel("prev", carousel));
    nextButton.addEventListener("click", () => moveCarousel("next", carousel));
  };

  const moveCarousel = (direction, carousel) => {
    const items = carousel.querySelectorAll(".carousel-item");
    const itemWidth = items[0].offsetWidth + 20;

    const scrollAmount = itemWidth * 3;

    if (direction === "next") {
      carousel.scrollLeft += scrollAmount;
    } else if (direction === "prev") {
      carousel.scrollLeft -= scrollAmount;
    }
  };

  const toggleFavorite = (button, productId) => {
    let favorites = getFavorites();

    if (favorites.includes(productId)) {
      favorites = favorites.filter((id) => id !== productId);
      button.classList.remove("favorited");
    } else {
      favorites.push(productId);
      button.classList.add("favorited");
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  };

  const getFavorites = () => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  };

  const isFavorite = (productId) => {
    const favorites = getFavorites();
    return favorites.includes(productId);
  };

  const buildCSS = () => {
    const css = `
            .product-carousel {
                margin: 0 auto;
                width: 85%;
                padding: 20px;
                background: #f8f8f8;
                border-radius: 10px;
            }
            .product-carousel h1 {
                font-size: 32px;
                color: #29323b;
                line-height: 33px;
                font-weight: lighter;
                padding: 15px 45px;
                margin: 0;
            }
            .product-carousel .carousel-wrapper {
                display: flex;
                align-items: center;
                position: relative;
                overflow: hidden;
            }
            .product-carousel .carousel-container {
                display: flex;
                gap: 20px;
                overflow-x: scroll;
                scroll-behavior: smooth;
                -ms-overflow-style: none;  
                scrollbar-width: none; 
            }
            .product-carousel .carousel-container::-webkit-scrollbar {
                display: none;
            }
            .carousel-item {
                position: relative;
                flex: 0 0 auto;
                width: 210px;
                cursor: pointer;
                background: #fff;
            }
            .carousel-item img {
                width: 100%;
                height: auto;
            }
            .carousel-item p {
                font-size: 14px;
                padding: 0 10px;
                margin-top: 5px;
                white-space: break-spaces;
            }
            .carousel-item p:last-child {
                font-size: 18px;
                color: #193db0;
                line-height: 22px;
                font-weight: bold;
                margin-top: -5px;
            }
            .carousel-btn {
                background-color: transparent;
                border: none;
                padding: 10px;
                font-size: 25px;
                font-weight: 600;
                cursor: pointer;
                transform: translateY(-50%);
            }
            .prev-btn {
                margin-right: 10px;
            }
            .next-btn {
                margin-left: 10px;
            }
            .carousel-wrapper {
                position: relative;
            }
            .favorite-btn {
                position: absolute;
                top: 5px;
                right: 5px;
                background: #fff;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: black;
                transition: color 0.3s ease;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 5px;
                border-radius: 5px;
                box-shadow: 0 3px 6px 0 rgba(0, 0, 0, .16);
            }
            .favorite-btn svg path {
                fill: transparent;
                stroke: black;
                stroke-width: 1;
            }
            .favorite-btn.favorited svg path {
                fill: blue;
                stroke: blue;
            }
  
            @media (max-width: 768px) {
                .product-carousel {
                    width: 100%;
                    padding: 0;
                }
               .product-carousel .carousel-container {
                    margin: 0 20px;
               }
                .carousel-btn {
                    display: none
                }
                .product-carousel h1 {
                    font-size: 24px;
                    padding: 15px;
                }
            }
  
          `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  };

  init();
})();
