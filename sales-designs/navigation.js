(function() {
  'use strict';
  
  const NAV_CONFIG = {
    'checkout-plus': 'checkout-plus.html',
    'hub': 'portal.html',
    'shipping-issue': 'portal-shipping-issue.html',
    'shipping-issue-admin': 'admin-shipping-issue.html',
    'return-portal': 'returns.html',
    'return-admin': 'admin-returns.html',
    'warranty-portal': 'warranties-reg.html',
    'warranty-admin': 'admin-warranties.html',
    'portal-edit': 'portal-edit.html'
  };

  // Get URL params
  const params = new URLSearchParams(window.location.search);
  const checkoutParams = params.get('checkout');
  
  // Get showProducts and brandColor from checkoutJson (defined in page script)
  let showProducts = [];
  let brandColor = null;
  let showNextButton = false;
  try {
    if (typeof checkoutJson !== 'undefined') {
      if (checkoutJson.showProducts) {
        showProducts = checkoutJson.showProducts;
      }
      if (checkoutJson.brandColor) {
        brandColor = checkoutJson.brandColor;
        // Set brandColor CSS variable
        document.documentElement.style.setProperty(
          '--brandColor',
          '#' + brandColor
        );
      }
      if (checkoutJson.showNextButton) {
        showNextButton = checkoutJson.showNextButton;
      }
    }
  } catch (e) {
    console.warn('checkoutJson not available:', e);
  }

  // Create floating menu HTML
  function createFloatingMenu() {
    const menuNavContainer = document.querySelector('.menu-nav');
    if (!menuNavContainer) return;

    const menuHTML = `
      <div class="floating-menu">
        <button id="menuToggle" class="floating-button" aria-label="Toggle navigation menu">
          <svg class="menu-icon" viewBox="0 0 907.14 1080" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,540c0,273.82,201.53,500.53,464.34,540V787.36C360.49,753.04,285.48,655.36,285.48,540s75.02-213.04,178.87-247.36V0C201.53,39.47,0,266.18,0,540z"/>
            <path d="M755.62,348.28c83.68,0,151.52-67.84,151.52-151.52c0-83.68-67.84-151.52-151.52-151.52S604.1,113.08,604.1,196.76C604.1,280.44,671.94,348.28,755.62,348.28z"/>
            <circle cx="755.62" cy="883.24" r="151.52"/>
          </svg>
        </button>

        <nav id="menuItems" class="menu-items hidden-nav" aria-label="Navigation menu">
          <button id="menuClose" class="menu-close">Close ×</button>
          <a data-nav="checkout-plus" data-products="0">Checkout Plus</a>
          <a data-nav="hub" data-products="0">Hub</a>
          <a data-nav="shipping-issue" data-products="0">Shipping Issue</a>
          <a data-nav="shipping-issue-admin" data-products="0">Shipping Issue Admin</a>
          <a data-nav="return-portal" data-products="1">Return Portal</a>
          <a data-nav="return-admin" data-products="1">Return Admin</a>
          <a data-nav="warranty-portal" data-products="2">Warranty Portal</a>
          <a data-nav="warranty-admin" data-products="2">Warranty Admin</a>
          <a data-nav="portal-edit" data-products="2">Order Editing</a>
        </nav>
      </div>
    `;

    menuNavContainer.innerHTML = menuHTML;
  }

  // Initialize next button
  function initNextButton() {
    const nextButtonContainers = document.querySelectorAll('[data-next-page]');
    
    if (!nextButtonContainers.length || !showNextButton) return;

    let hasButtons = false;

    nextButtonContainers.forEach(container => {
      const nextPage = container.dataset.nextPage;
      const nextText = container.dataset.nextText || 'Next';
      
      // Create the button
      const button = document.createElement('a');
      button.className = 'next-button allow-click';
      button.href = `${nextPage}.html?checkout=${checkoutParams}`;
      button.textContent = nextText;
      
      // Add button to container
      container.appendChild(button);
      hasButtons = true;
    });

    // Show the .next-nav wrapper if any buttons were created
    if (hasButtons) {
      const nextNav = document.querySelector('.next-nav');
      if (nextNav) {
        nextNav.style.display = 'flex';
      }
    }
  }

  // Initialize navigation
  function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const menuItems = document.getElementById('menuItems');
    const navLinks = menuItems?.querySelectorAll('a[data-nav]');

    if (!menuToggle || !menuItems) return;

    // Setup links
    if (navLinks) {
      navLinks.forEach(link => {
        const navKey = link.dataset.nav;
        const productId = parseInt(link.dataset.products);
        
        // Set href with checkout params
        if (NAV_CONFIG[navKey] && checkoutParams) {
          link.href = `${NAV_CONFIG[navKey]}?checkout=${checkoutParams}`;
        }
        
        // Show/hide based on showProducts
        if (showProducts.includes(productId)) {
          link.style.display = 'block';
        } else {
          link.style.display = 'none';
        }
      });
    }

    // Toggle menu
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuItems.classList.toggle('hidden-nav');
      menuToggle.classList.toggle('hidden-nav');
    });

    // Close menu
    if (menuClose) {
      menuClose.addEventListener('click', (e) => {
        e.preventDefault();
        menuItems.classList.add('hidden-nav');
        menuToggle.classList.remove('hidden-nav');
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      const floatingMenu = document.querySelector('.floating-menu');
      if (floatingMenu && !floatingMenu.contains(e.target)) {
        menuItems.classList.add('hidden-nav');
        menuToggle.classList.remove('hidden-nav');
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menuItems.classList.contains('hidden-nav')) {
        menuItems.classList.add('hidden-nav');
        menuToggle.classList.remove('hidden-nav');
      }
    });
  }

  // Disable all clicks except in menu-nav and next-nav
  function disableOtherClicks() {
    document.addEventListener('click', (e) => {
      // Check if click is within allowed containers
      const isInMenuNav = e.target.closest('.menu-nav');
      const isInNextNav = e.target.closest('.next-nav');
      
      // If not in allowed areas, prevent the click
      if (!isInMenuNav && !isInNextNav) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true); // Use capture phase to catch before other handlers
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createFloatingMenu();
      initNavigation();
      initNextButton();
      disableOtherClicks();
    });
  } else {
    createFloatingMenu();
    initNavigation();
    initNextButton();
    disableOtherClicks();
  }
})();
