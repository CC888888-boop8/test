"use strict";

(() => {
  const CONTENT_URL = "/content/site.json";
  let content = null;
  let applying = false;
  window.TIANSHENG_EDITABLE_STATUS = "script-loaded";
  document.documentElement.dataset.editableContent = "script-loaded";

  const one = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];

  const setOwnText = (element, value) => {
    if (!element || value === undefined || value === null) return;
    const text = String(value);
    const node = [...element.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
    if (node) {
      if (node.nodeValue.trim() !== text.trim()) node.nodeValue = text;
    } else if (!element.children.length && element.textContent !== text) {
      element.textContent = text;
    }
  };

  const setText = (selector, value, root = document) => {
    const element = one(selector, root);
    if (element && value !== undefined && value !== null && element.textContent.trim() !== String(value).trim()) {
      element.textContent = String(value);
    }
  };

  const setAttr = (selector, attribute, value, root = document) => {
    const element = one(selector, root);
    if (element && value && element.getAttribute(attribute) !== value) {
      element.setAttribute(attribute, value);
    }
  };

  const setImage = (selector, src, root = document) => setAttr(selector, "src", src, root);

  const setBackgroundVariable = (selector, property, src) => {
    const element = one(selector);
    if (!element || !src) return;
    const value = `url("${src}")`;
    if (element.style.getPropertyValue(property) !== value) {
      element.style.setProperty(property, value);
    }
    if (element.style.backgroundImage) element.style.removeProperty("background-image");
  };

  const updateLinks = (site) => {
    all("a[href^='tel:']").forEach((link) => link.setAttribute("href", site.phoneLink));
    all("a[href*='m.me']").forEach((link) => link.setAttribute("href", site.messengerUrl));
    all("a[href*='facebook.com/profile']").forEach((link) => link.setAttribute("href", site.facebookUrl));
    all(".contact-bar a[href^='tel:'],.footer-contact a[href^='tel:']").forEach((link) => {
      setOwnText(link, site.phoneDisplay);
    });
    const facebookFrame = one(".social-frame iframe");
    if (facebookFrame && site.facebookUrl) {
      const src = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(site.facebookUrl)}&tabs=timeline&width=500&height=620&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;
      if (facebookFrame.getAttribute("src") !== src) facebookFrame.setAttribute("src", src);
    }
  };

  const updateEbook = (biography) => {
    const image = one(".ebook-page img");
    if (!image) return;
    const source = image.getAttribute("src") || "";
    let replacement = biography.cover;
    if (source.includes("back-cover")) {
      replacement = biography.backCover;
    } else {
      const match = source.match(/page-(\d+)\./);
      if (match) replacement = biography.pages[Number(match[1]) - 1] || source;
    }
    if (replacement && source !== replacement) image.setAttribute("src", replacement);
  };

  const updateDonationModal = (donation) => {
    const modal = one(".donation-modal");
    if (!modal) return;
    const title = one("h2", modal);
    const current = (title?.textContent || "").trim();
    const card = donation.cards.find((item) => item.title === current)
      || donation.cards.find((item) => current.includes(item.title));
    if (!card) return;
    setText("h2", card.title, modal);
    const description = one(".donation-modal-copy p,.donation-modal>div>p", modal);
    if (description) setOwnText(description, card.description);
    const grid = one(".donation-modal-grid", modal);
    if (grid && Array.isArray(card.gallery)) {
      const currentSources = all("img", grid).map((image) => image.getAttribute("src")).join("|");
      const requestedSources = card.gallery.join("|");
      if (currentSources !== requestedSources) {
        const fragment = document.createDocumentFragment();
        card.gallery.forEach((src, index) => {
          const figure = document.createElement("figure");
          const image = document.createElement("img");
          image.src = src;
          image.alt = `${card.title}成果照片 ${index + 1}`;
          image.loading = "lazy";
          const caption = document.createElement("figcaption");
          caption.textContent = `成果紀錄 ${String(index + 1).padStart(2, "0")}`;
          figure.append(image, caption);
          fragment.append(figure);
        });
        grid.replaceChildren(fragment);
      }
    }
  };

  const updateServiceModal = (services) => {
    const modal = one(".service-modal");
    if (!modal) return;
    const title = one("h2,h3", modal);
    const current = (title?.textContent || "").trim();
    const entries = [services.consultation, ...services.cards];
    const item = entries.find((entry) => entry.title === current)
      || entries.find((entry) => current.includes(entry.title));
    if (!item) return;
    setText("h2,h3", item.title, modal);
    const paragraph = one("p", modal);
    if (paragraph) setOwnText(paragraph, item.detail || item.description);
  };

  const applyContent = () => {
    if (!content || applying) return;
    applying = true;
    try {
      const { site, hero, portals, leader, biography, videoSection, donation, services, guide, social, contact, footer } = content;

      document.title = site.browserTitle;
      setAttr("meta[name='description']", "content", site.description);
      setAttr("meta[property='og:title']", "content", `${site.templeName}·${site.branchName}`);
      setAttr("meta[property='og:description']", "content", hero.subtitle);

      all(".brand-copy b,.footer-brand b>span:first-child").forEach((element) => setOwnText(element, site.templeName));
      all(".brand-copy strong,.footer-brand b>span:last-child").forEach((element) => setOwnText(element, site.branchName));
      all(".brand-copy small").forEach((element) => setOwnText(element, site.englishName));
      all("img.logo").forEach((image) => {
        if (image.getAttribute("src") !== site.logo) image.setAttribute("src", site.logo);
      });

      setOwnText(one(".hero .eyebrow"), hero.eyebrow);
      setText(".hero .temple-name-line", hero.title);
      setText(".hero h1 em", hero.branchTitle);
      setText(".hero h2", hero.subtitle);
      setText(".hero-copy-wrap>p:last-of-type", hero.intro);
      setText(".hero-photo-caption b", hero.caption);
      setText(".hero-photo-caption span", hero.captionTemple);
      setBackgroundVariable(".hero-deity-photo", "--cms-hero-deity-image", hero.deityImage);
      setBackgroundVariable(".hero-temple-base", "--cms-hero-temple-image", hero.templeImage);

      all(".culture-portals>a").forEach((portal, index) => {
        const item = portals[index];
        if (!item) return;
        setText("small", item.english, portal);
        setText("b", item.title, portal);
        setText("em", item.description, portal);
      });

      setText("#leader .section-en", leader.english);
      setText("#leader .gold-kicker", leader.kicker);
      setText("#leader h2", leader.title);
      setText("#leader h3", leader.name);
      setText("#leader .leader-name", leader.civilName);
      setText("#leader blockquote", leader.quote);
      setText("#leader .leader-content>p:last-child", leader.description);
      setImage("#leader .leader-photo-frame img", leader.image);

      setText("#biography .section-heading>div>p", biography.english);
      setText("#biography .section-heading h2", biography.title);
      setText("#biography .section-heading>p", biography.description);
      updateEbook(biography);

      setText(".video-heading>span", videoSection.english);
      setText(".video-heading>h2", videoSection.title);
      setText(".video-heading>p", videoSection.description);
      all(".video-grid .video-card").forEach((card, index) => {
        const item = videoSection.videos[index];
        if (!item) return;
        setText("h3", item.title, card);
        setText(":scope>p", item.description, card);
        const video = one("video", card);
        if (video) {
          const currentSource = video.getAttribute("src") || "";
          if (!currentSource.startsWith("blob:") && currentSource !== item.video) {
            video.setAttribute("src", item.video);
          }
          if (video.getAttribute("poster") !== item.poster) {
            video.setAttribute("poster", item.poster);
          }
        }
      });

      setText("#donation .section-heading>div>p", donation.english);
      setText("#donation .section-heading h2", donation.title);
      setText("#donation .section-heading>p", donation.description);
      all("#donation .result-grid>article").forEach((card, index) => {
        const item = donation.cards[index];
        if (!item) return;
        setText(".result-copy h3", item.title, card);
        setText(".result-copy p", item.description, card);
        setImage(".donation-preview", item.preview, card);
        setAttr(".donation-preview", "alt", `${item.title}成果預覽`, card);
      });
      setText("#donation .donation-callout small", donation.calloutKicker);
      setText("#donation .donation-callout h3", donation.calloutTitle);
      setOwnText(one("#donation .donation-callout .button"), donation.calloutButton);

      setText("#services .services-title>p", services.english);
      setText("#services .services-title>h2", services.title);
      setText("#services .services-title>span", services.description);
      setText("#services .consultation-card small", services.consultation.english);
      setText("#services .consultation-card h3", services.consultation.title);
      setText("#services .consultation-card>p", services.consultation.description);
      all("#services .service-grid>article").forEach((card, index) => {
        const item = services.cards[index];
        if (!item) return;
        setText(".service-mark span", item.mark, card);
        setText("h3", item.title, card);
        setText("p", item.description, card);
      });

      setText("#guide .guide-title>p", guide.english);
      setOwnText(one("#guide .guide-title h2"), guide.title);
      setText("#guide .guide-title h2 em", guide.subtitle);
      setText("#guide .guide-title>span", guide.description);
      all("#guide ol>li").forEach((itemElement, index) => {
        const item = guide.items[index];
        if (!item) return;
        setText("h3", item.title, itemElement);
        setText("p", item.description, itemElement);
      });

      setText(".social .section-heading p", social.english);
      setText(".social .facebook-title", social.title);
      setOwnText(one(".social .section-heading>a"), social.button);
      setText(".social-visual>p", social.kicker);
      setOwnText(one(".social-visual h3"), social.headline);
      setText(".social-visual h3 em", social.headlineAccent);
      setText(".social-visual>span", social.description);

      setText("#contact .section-heading>div>p", contact.english);
      setText("#contact .section-heading h2", contact.title);
      setText("#contact .section-heading>p", contact.description);
      all("#contact .location-card").forEach((locationElement, index) => {
        const item = contact.locations[index];
        if (!item) return;
        setText(":scope>div>span", item.english, locationElement);
        setText(":scope>div>h3", item.title, locationElement);
        setText(":scope>div>.address", item.address, locationElement);
        const headings = all(":scope>div>h4", locationElement);
        const paragraphs = all(":scope>div>p:not(.address)", locationElement);
        setOwnText(headings[0], item.heading1);
        setOwnText(paragraphs[0], item.description1);
        setOwnText(headings[1], item.heading2);
        setOwnText(paragraphs[1], item.description2);
        setAttr("iframe", "src", `https://www.google.com/maps?q=${encodeURIComponent(item.mapQuery)}&output=embed`, locationElement);
      });
      setText("#contact .contact-bar small", contact.phoneLabel);
      setOwnText(one("#contact .contact-bar .button"), contact.messengerButton);

      setText("footer .footer-links:nth-of-type(3)>b", footer.serviceHeading);
      setText("footer .footer-contact>b", footer.contactHeading);
      const footerAddresses = all("footer .footer-addresses span");
      setOwnText(footerAddresses[0], footer.keelungAddress);
      setOwnText(footerAddresses[1], footer.shimenAddress);
      setText("footer .footer-bottom>small", footer.copyright);
      all(".footer-brand small").forEach((element) => setOwnText(element, hero.subtitle));

      updateLinks(site);
      updateDonationModal(donation);
      updateServiceModal(services);
    } finally {
      applying = false;
    }
  };

  const start = async () => {
    try {
      window.TIANSHENG_EDITABLE_STATUS = "loading-content";
      document.documentElement.dataset.editableContent = "loading";
      const response = await fetch(`${CONTENT_URL}?v=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Content request failed: ${response.status}`);
      content = await response.json();
      window.TIANSHENG_EDITABLE_CONTENT = content;
      window.TIANSHENG_EDITABLE_STATUS = "ready";
      document.documentElement.dataset.editableContent = "ready";
      applyContent();
      let queued = false;
      new MutationObserver(() => {
        if (queued || applying) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          applyContent();
        });
      }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src", "class"] });
      document.addEventListener("temple:content-restored", applyContent);
      window.setTimeout(applyContent, 1000);
      window.setTimeout(applyContent, 2500);
    } catch (error) {
      window.TIANSHENG_EDITABLE_STATUS = "error";
      document.documentElement.dataset.editableContent = "error";
      console.error("Editable content could not be loaded.", error);
    }
  };

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", start, { once: true })
    : start();
})();
