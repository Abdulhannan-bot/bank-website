'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);
const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabsContent = document.querySelectorAll(`.operations__content`);
const nav = document.querySelector(`.nav`);
const header = document.querySelector(`.header`);


const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};


btnsOpenModal.forEach( btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// adding the cookie message

const message = document.createElement(`div`);
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it</button>';
message.classList.add(`cookie-message`);
header.append(message);
message.style.backgroundColor = `#37383d`;
message.style.width = `120%`;
message.style.padding = `20px 0`;

const messageTop = message.getBoundingClientRect().top;
message.style.position = `fixed`;
message.style.top = `${messageTop}px`;
const messageHeight = message.getBoundingClientRect().height;

document.querySelector(`.btn--close-cookie`).addEventListener(`click`, function(e) {
  e.preventDefault();
  message.remove();
});

const footer = document.querySelector(`.section--sign-up`);

const msgColor = function(entries,observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) message.style.backgroundColor = `#37383d`;
  else {
    console.log(`footer entered`);
    message.style.backgroundColor = `white`;
  }
};

const footerObserver = new IntersectionObserver(msgColor, {
  root: null,
  threshold: 0,
  rootMargin: `-${messageHeight}px`,
});

footerObserver.observe(footer);


// implementing smooth scrolling
btnScroll.addEventListener(`click`, function(e) {
  section1.scrollIntoView({ behavior: `smooth`});
  // console.log(s1coords);
  // const s1coords = section1.getBoundingClientRect();
  // console.log(e.target.getBoundingClientRect());

  // console.log('Current Scroll (X?Y):', window.pageXOffset, window.pageYOffset);

  // console.log(`height/width`, document.documentElement.clientHeight, document.documentElement.clientWidth);

  // scrolling
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  // implement smooth behavior
  // window.scrollTo({ 
  //   left: s1coords.left + window.pageXOffset, 
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: `smooth`,
  // });
});


// page navigation


// method 1
// document.querySelectorAll(`.nav__link`).forEach( function(el) {
//   el.addEventListener(`click`, function(e) {
//     e.preventDefault();
//     const id = this.getAttribute(`href`);
//     console.log(id);
//     // smooth scrolling
//     document.querySelector(id).scrollIntoView({behavior: `smooth`});
    
//   } );
// } );

// method 2
document.querySelector(`.nav__links`).addEventListener(`click`, function(e) {
  e.preventDefault();
  // matching strategy
  if(e.target.classList.contains(`nav__link`)) {
    const id = e.target.getAttribute(`href`);
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior: `smooth`});
  }
});

// tabbed component

tabsContainer.addEventListener(`click`, function(e) {
  const clicked = e.target.closest(`.operations__tab`);
  // guard clause
  if(!clicked) return;

  tabs.forEach( t => t.classList.remove(`operations__tab--active`));

  // activate tab
  clicked.classList.add(`operations__tab--active`);

  tabsContent.forEach( c => c.classList.remove(`operations__content--active`));

  // activate content
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add(`operations__content--active`);
});


// menu fade animations
// mouseenter doesn't bubble

const handleHover = function(e, opacity) {
  if(e.target.classList.contains(`nav__link`)) {
    const link = e.target;
    const siblings = link.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = link.closest(`.nav`).querySelector(`img`);

    siblings.forEach( el => {
      if(el !== link) el.style.opacity = this;
    })

    logo.style.opacity = this;
  }

}

// passing "arguments" into handlers

nav.addEventListener(`mouseover`, handleHover.bind(0.5));
nav.addEventListener(`mouseout`, handleHover.bind(1));

/*
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener(`scroll`, function() {
//   console.log(window.scrollY);
//   if( window.scrollY > initialCoords.top ) nav.classList.add(`sticky`);
//   else nav.classList.remove(`sticky`);
// })

// const obsCallback = function(entries, observer) {
//   entries.forEach( entry => console.log(entry));
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

// cookie message color change
*/



// implementing sticky navigation bar

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries
  console.log(entry);
  if(!entry.isIntersecting) nav.classList.add(`sticky`);
  else nav.classList.remove(`sticky`);
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// reveal elements on scroll

const allSections = document.querySelectorAll(`.section`);
const sectionReveal = function(entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if(!entry.isIntersecting) return;
  else entry.target.classList.remove(`section--hidden`);
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(sectionReveal, {
  root: null,
  threshold: 0.15,
});

allSections.forEach( function(section) {
  sectionObserver.observe(section);
  section.classList.add(`section--hidden`);
} );

// lazy loading image

const imgTargets = document.querySelectorAll(`img[data-src]`);

const loadImg = function(entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener(`load`,function() {
    entry.target.classList.remove(`lazy-img`);
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
});

imgTargets.forEach( img => imgObserver.observe(img));

// sliding compenents

const slider = function() {
  // event handler
  const btnSliderRight = document.querySelector(`.slider__btn--right`);
  const btnSliderLeft = document.querySelector(`.slider__btn--left`);
  const dotContainer = document.querySelector(`.dots`)
  const slides = document.querySelectorAll(`.slide`);


  let currSlide = 0;
  const maxSlide = slides.length;
  const acivateDots = function(slide) {
    document.querySelectorAll(`.dots__dot`).forEach( dot => dot.classList.remove(`dots__dot--active`));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add(`dots__dot--active`);
  }

  const createDots = function () {
    slides.forEach( function (_,i) {
      dotContainer.insertAdjacentHTML(`beforeend`,`<button class="dots__dot" data-slide="${i}"></button>`)
    })
  };

  dotContainer.addEventListener(`click`, function(e) {
    if( e.target.classList.contains(`dots__dot`)) {
      const {slide} = e.target.dataset;
      gotToSlide(slide);
      acivateDots(slide);
    }
  })

  const gotToSlide = function(slide) {
    slides.forEach( (s,i) => (s.style.transform = `translateX( ${100 * (i-slide)}%)` ));
  }

  const init = function() {
    gotToSlide(currSlide);
    createDots();
    acivateDots(currSlide);
  };

  init();

  const nextSlide = function() {
    if(currSlide === maxSlide - 1) currSlide = 0;
    else currSlide++;

    gotToSlide(currSlide);
    acivateDots(currSlide);
  };

  const prevSlide = function() {
    if(currSlide === 0) currSlide = maxSlide - 1;
    else currSlide--;

    gotToSlide(currSlide);
    acivateDots(currSlide);
  };

  btnSliderRight.addEventListener(`click`, nextSlide);

  btnSliderLeft.addEventListener(`click`, prevSlide);

  document.addEventListener(`keydown`, function(e) {
    if(e.key === `ArrowLeft`) prevSlide();
    e.key === `ArrowRight` && nextSlide();
    acivateDots(currSlide);
  });
};
slider();



// selecting, creating and deleting elements

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector(`.header`);

// const allHeaders = document.querySelectorAll(`.section`);
// console.log(allHeaders);

// document.getElementById(`section--1`)
// const allButtons = document.getElementsByTagName(`button`);
// console.log(allButtons);

// console.log(document.getElementsByClassName(`btn`));

// // Creating and inserting elements
// // insertAdjacentHTML

// const message = document.createElement(`div`);
// message.classList.add(`cookie-message`);
// message.innerHTML = 'We use cookies for improved functionality and analytics. <button class = "btn btn--close-cookie">Got it</button>';

// // is at only one place at a time
// //header.prepend(message);
// header.append(message);

// const btnCookieClose = document.querySelector(`.btn--close-cookie`);

// // to have it in multiple places, we can clone it

// //header.prepend(message.cloneNode(true));


// // insert before or after header
// // header.before(message);
// // header.after(message);

// // delete elements

// document.querySelector(`.btn--close-cookie`).addEventListener(`click`, function() {
//   message.remove();
//   //message.parentElement.removeChild(message);
// });

// // styles
// message.style.backgroundColor = `#37383d`;
// message.style.width = `120%`;
// btnCookieClose.style.margin = `20px 0`;

// console.log(message.style.backgroundColor);

// console.log(getComputedStyle(message).height);

// // message.style.height = Number.parseFloat(getComputedStyle(message).height,10) +`px`;
// // console.log(getComputedStyle(message).height);

// document.documentElement.style.setProperty(`--color-primary`,`orangered`)

// // attrbutes

// const logo = document.querySelector(`.nav__logo`);

// // standard attributes ones that are predefines
// console.log(logo.alt);
// console.log(logo.id);



// console.log(logo.className);
// console.log(logo.classList);

// // non standard attributes will return undefined
// console.log(logo.designer);

// // to get non standard attributes
// console.log(logo.getAttribute(`designer`));

// logo.alt = `a logo`;

// logo.setAttribute(`company`, `bankist`);

// console.log(logo.src);
// console.log(logo.getAttribute(`src`));

// const link = document.querySelector(`.nav__link--btn`);
// console.log(link.href);
// console.log(link.getAttribute(`href`));

// // data attributes

// console.log(logo.dataset.versionNumber);

// classes

//logo.classList.add,.remove,.toggle,.contains

// don't use coz it will override the class names
// logo.className = `Abdul-Hannan`;


// const h1 = document.querySelector(`h1`);
// const alertH1 = function(e) {
//   alert( `you're reading the heading`);
//   //h1.removeEventListener(`mouseenter`,alertH1);
// };

// h1.addEventListener(`mouseenter`, alertH1);

// // another way of handling event listneners (old school) can only one function at a time, adding another function would override
// // h1.onmouseenter = function(e) {
// //   alert( `you're reading the heading`);
// // };

// setTimeout( () => h1.removeEventListener(`mouseenter`, alertH1),3000);



// const randomInt = (min,max) => Math.floor(Math.random() * (max - min +1) + min);
// console.log(randomInt(0,255));

// const randomColor = () => `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`;

// document.querySelector(`.nav__links`).addEventListener(`click`, function(e) {
//   this.style.backgroundColor = randomColor();
//   console.log(`CONTAINER`, e.target, e.currentTarget);
//   console.log(e.target === e.currentTarget);

//   // stop propagation
//   //e.stopPropagation();
// });

// document.querySelector(`.nav__link`).addEventListener(`click`, function(e) {
//   this.style.backgroundColor = randomColor();
//   console.log(`LINK`, e.target, e.currentTarget);
// });

// document.querySelector(`.nav`).addEventListener(`click`, function(e) {
//   this.style.backgroundColor = randomColor();
//   console.log(`NAV`, e.target, e.currentTarget);
//   console.log(e.currentTarget === this);
// });



// const h1 = document.querySelector(`h1`);
// console.log(h1.querySelectorAll(`.highlight`));

// // going downwards: child
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = `white`;
// h1.lastElementChild.style.color = `orangered`;

// // going upwards: parent
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest(`.header`).style.background = `var(--gradient-secondary)`;
// h1.closest(`h1`).style.background = `var(--gradient-primary)`;

// sideways: siblings

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach( function(el) {
//   if(el !== h1) el.style.transform = `scale(0.5)`;
// })

// const slider = document.querySelector(`.slider`);
// slider.style.overflow = `visible`;
// slider.style.transform = `scale(0.5)`;