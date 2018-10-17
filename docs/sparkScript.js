// utilities
var get = function (selector, scope) {
  scope = scope ? scope : document;
  return scope.querySelector(selector);
};

var getAll = function (selector, scope) {
  scope = scope ? scope : document;
  return scope.querySelectorAll(selector);
};

// toggle tabs on codeblock
window.addEventListener("load", function() {
  // get all tab_containers in the document
  var tabContainers = getAll(".tab__container");

  // bind click event to each tab container
  for (var i = 0; i < tabContainers.length; i++) {
    get('.tab__menu', tabContainers[i]).addEventListener("click", tabClick);
  }

  // each click event is scoped to the tab_container
  function tabClick (event) {
    var scope = event.currentTarget.parentNode;
    var clickedTab = event.target;
    var tabs = getAll('.tab', scope);
    var panes = getAll('.tab__pane', scope);
    var activePane = get(`.${clickedTab.getAttribute('data-tab')}`, scope);

    // remove all active tab classes
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('active');
    }

    // remove all active pane classes
    for (var i = 0; i < panes.length; i++) {
      panes[i].classList.remove('active');
    }

    // apply active classes on desired tab and pane
    clickedTab.classList.add('active');
    activePane.classList.add('active');
  }
});

//in page scrolling for documentaiton page
var btns = getAll('.js-btn');
var sections = getAll('.js-section');

function setActiveLink(event) {
  // remove all active tab classes
  for (var i = 0; i < btns.length; i++) {
    btns[i].classList.remove('selected');
  }

  event.target.classList.add('selected');
}

function smoothScrollTo(i, event) {
  var element = sections[i];
  setActiveLink(event);
  this.console.log("element.offsetTop is "+ element.offsetTop );

  var docNav = get('.doc__nav > ul.fixed');
  var wrapper = get('.wrapper__doc');
  if(wrapper) { 
    var style = window.getComputedStyle(wrapper);
    var direction = style.getPropertyValue('flex-direction');
    //var position =  docNav.getAttribute("position");
    if( direction == 'column') {
      window.scrollTo({
        'behavior': 'smooth',
        'top': element.offsetTop - 80,
        'left': 0
      });
    } else {
      window.scrollTo({
        'behavior': 'smooth',
        'top': element.offsetTop - 80,
        'left': 0
      });
    }
  } else {
    window.scrollTo({
      'behavior': 'smooth',
      'top': element.offsetTop - 80,
      'left': 0
    });
  }
/*   var docNav = get('.doc__nav > ul.fixed');
  if(docNav) { 
    var style = window.getComputedStyle(docNav);
    var position = style.getPropertyValue('position');
    //var position =  docNav.getAttribute("position");
    if( position == 'relative') {
      window.scrollTo({
        'behavior': 'smooth',
        'top': element.offsetTop - (80 + docNav.offsetHeight) ,
        'left': 0
      });
    } else {
      window.scrollTo({
        'behavior': 'smooth',
        'top': element.offsetTop - 80,
        'left': 0
      });
    }
  } else {
    window.scrollTo({
      'behavior': 'smooth',
      'top': element.offsetTop - 80,
      'left': 0
    });
  } */
}

if (btns.length && sections.length > 0) {
  for (var i = 0; i<btns.length; i++) {
    btns[i].addEventListener('click', smoothScrollTo.bind(this,i));
  }
}
/*
var mediaFunction = function(media) {
  if (media.matches) { // If media query matches
      document.body.style.backgroundColor = "yellow";
      var docNav = get('.doc__nav > ul.fixed');
      var docContent = get('.doc__content');
      docContent.style.setProperty('padding-top', docNav.offsetHeight +'px');

  } else {
      document.body.style.backgroundColor = "pink";
      var docContent = get('.doc__content');
      docContent.style.setProperty('padding-top', 0);


  }
}


var mediaWindow = window.matchMedia("(max-width: 1215px)")
mediaFunction(mediaWindow) // Call listener function at run time
mediaWindow.addListener(mediaFunction) // Attach listener function on state changes
*/
// fix menu to page-top once user starts scrolling
window.addEventListener('scroll', function () {
  var docNav = get('.doc__nav > ul');
  var head = get('.header');

/*this.console.log("window.pageYOffset is "+ window.pageYOffset );
this.console.log("head.offsetTop is "+head.offsetTop );
this.console.log("head.offsetHeight is "+head.offsetHeight );
  if( docNav) {
    if (window.pageYOffset >= head.offsetHeight) {
      docNav.classList.add('fixed');
    } else {
      docNav.classList.remove('fixed');
    }
   }  
  console.log("scrolling!");
  if (window.pageYOffset > 0) {
    head.classList.add("sticky");
  } else {
    head.classList.remove("sticky");
  } */
});

// responsive navigation
var topNav = get('.menu');
var icon = get('.toggle');

window.addEventListener('load', function(){
  function showNav() {
    if (topNav.className === 'menu') {
      topNav.className += ' responsive';
      icon.className += ' open';
    } else {
      topNav.className = 'menu';
      icon.classList.remove('open');
    }
  }
  icon.addEventListener('click', showNav);
});

