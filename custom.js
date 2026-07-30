"use strict";
(() => {
  (() => {
    const STORAGE = "tiansheng-site-draft-v1", sectionLinks = [
      ["\u9996\u9801", "#home"],
      ["\u5BAE\u4E3B\u4ECB\u7D39", "#leader"],
      ["\u81EA\u50B3\u8207\u5F71\u97F3", "#biography"],
      ["\u52DF\u6350\u6210\u679C", "#donation"],
      ["\u7948\u5B89\u670D\u52D9", "#services"],
      ["\u53C3\u62DC\u6307\u5357", "#guide"],
      ["\u806F\u7D61\u4EA4\u901A", "#contact"]
    ], icons = {
      message: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 4.5h13.6A2.7 2.7 0 0 1 21.5 7v8.4a2.7 2.7 0 0 1-2.7 2.6h-7.2l-4.5 3v-3H5.2a2.7 2.7 0 0 1-2.7-2.6V7a2.7 2.7 0 0 1 2.7-2.5Z"/><path d="m7.5 13 3-3 2.6 2 3.5-3-3 5-2.7-2-3.4 1Z" class="fill"/></svg>',
      route: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>',
      phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.1 3.5 10 7.8 8.2 10c1.1 2.5 3.3 4.7 5.8 5.8l2.2-1.8 4.3 2.9-.8 3.1c-.3.9-1.2 1.5-2.1 1.4C10 20.6 3.4 14 2.6 6.4c-.1-.9.5-1.8 1.4-2.1l3.1-.8Z"/></svg>',
      home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.5 11.2 8.5-7 8.5 7"/><path d="M5.7 10v10h12.6V10M9.5 20v-6h5v6"/></svg>',
      menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
    }, releaseScrollLock = () => {
      document.body.classList.remove("side-nav-open"), [document.body, document.documentElement].forEach((element) => {
        ["overflow", "overflow-x", "overflow-y", "position", "top", "width", "height", "touch-action"].forEach((property) => {
          element.style.removeProperty(property);
        });
      });
    }, setSideNav = (open) => {
      const panel = document.querySelector(".side-nav-panel"), shade = document.querySelector(".side-nav-shade"), toggle = document.querySelector(".directory-toggle");
      panel == null || panel.classList.toggle("open", open), shade == null || shade.classList.toggle("open", open), toggle == null || toggle.classList.toggle("open", open), toggle == null || toggle.setAttribute("aria-expanded", String(open)), panel == null || panel.setAttribute("aria-hidden", String(!open)), document.body.classList.toggle("side-nav-open", open), open || releaseScrollLock();
    }, goToSection = (href) => {
      const target = document.querySelector(href);
      target && (setSideNav(!1), releaseScrollLock(), window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        var _a;
        const headerHeight = ((_a = document.querySelector(".site-header")) == null ? void 0 : _a.getBoundingClientRect().height) || 0, top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" }), window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${href}`), window.setTimeout(releaseScrollLock, 120), window.setTimeout(releaseScrollLock, 700);
      })));
    }, installHashNavigation = () => {
      document.documentElement.dataset.hashNavigation !== "ready" && (document.documentElement.dataset.hashNavigation = "ready", document.addEventListener("click", (event) => {
        var _a, _b;
        const link = (_b = (_a = event.target).closest) == null ? void 0 : _b.call(_a, "a[href^='#']"), href = link == null ? void 0 : link.getAttribute("href");
        !href || href === "#" || !document.querySelector(href) || (event.preventDefault(), event.stopPropagation(), goToSection(href));
      }, !0));
    }, installNavigation = () => {
      var _a;
      const header = document.querySelector(".site-header");
      if (!header) return;
      document.querySelectorAll(".header-cloud,.messenger-float,.side-nav-toggle").forEach((el) => el.remove());
      const brand = header.querySelector(".brand");
      if (brand && brand.dataset.homeNavigation !== "ready" && (brand.dataset.homeNavigation = "ready", brand.addEventListener("click", (event) => {
        event.preventDefault(), setSideNav(!1), releaseScrollLock(), window.requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: "smooth" }), window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#home`);
        });
      })), !document.querySelector(".directory-toggle")) {
        const toggle = document.createElement("button");
        toggle.className = "directory-toggle", toggle.type = "button", toggle.setAttribute("aria-expanded", "false"), toggle.setAttribute("aria-controls", "side-nav-panel"), toggle.innerHTML = `<span class="directory-icon">${icons.menu}</span><span>\u5BAE\u9662\u5C0E\u89BD</span>`, toggle.addEventListener("click", () => {
          var _a2;
          return setSideNav(!((_a2 = document.querySelector(".side-nav-panel")) != null && _a2.classList.contains("open")));
        }), header.append(toggle);
      }
      if (!document.querySelector(".side-nav-panel")) {
        const panel = document.createElement("aside");
        panel.className = "side-nav-panel", panel.id = "side-nav-panel", panel.setAttribute("aria-hidden", "true"), panel.innerHTML = `
        <div class="side-nav-head"><small>TEMPLE DIRECTORY</small><b>\u5BAE\u9662\u5C0E\u89BD</b><button type="button" aria-label="\u95DC\u9589\u5C0E\u89BD">\xD7</button></div>
        <div class="side-nav-links">${sectionLinks.map(([label, href], index) => `<a href="${href}"><small>0${index + 1}</small><span>${label}</span><b>\u2192</b></a>`).join("")}</div>
        <div class="side-nav-foot"><span>\u8056\u9053\u7121\u76E1\u30FB\u6148\u6689\u6C38\u50B3</span><a href="tel:+886224622033">(02) 2462-2033</a></div>`;
        const shade = document.createElement("div");
        shade.className = "side-nav-shade", (_a = panel.querySelector(".side-nav-head button")) == null || _a.addEventListener("click", () => setSideNav(!1)), panel.querySelectorAll("a[href^='#']").forEach((link) => link.addEventListener("click", (event) => {
          event.preventDefault(), goToSection(link.getAttribute("href"));
        })), shade.addEventListener("click", () => setSideNav(!1)), document.body.append(shade, panel);
      }
    }, installQuickDock = () => {
      if (document.querySelector(".quick-dock") && document.querySelector(".quick-home-dock")) return;
      document.querySelectorAll(".quick-dock,.quick-home-dock").forEach((element) => element.remove());
      const dock = document.createElement("nav");
      dock.className = "quick-dock", dock.setAttribute("aria-label", "\u5FEB\u901F\u806F\u7D61"), dock.innerHTML = `
      <div class="quick-contact-group" aria-label="\u5FEB\u6377\u806F\u7D61">
        <span class="quick-group-title">\u5FEB\u6377\u806F\u7D61</span>
        <a class="quick-action messenger" href="https://m.me/61583931960613" target="_blank" rel="noreferrer" aria-label="Messenger \u8A62\u554F">
          <span class="quick-icon">${icons.message}</span><span class="quick-label">Messenger</span>
        </a>
        <button type="button" class="quick-action route-toggle" aria-expanded="false" aria-controls="quick-route-menu" aria-label="\u9078\u64C7\u5BAE\u5740\u5C0E\u822A">
          <span class="quick-icon">${icons.route}</span><span class="quick-label">\u5BAE\u5740\u5C0E\u822A</span>
        </button>
        <a class="quick-action phone" href="tel:+886224622033" aria-label="\u64A5\u6253\u5BAE\u52D9\u96FB\u8A71">
          <span class="quick-icon">${icons.phone}</span><span class="quick-label">\u76F4\u63A5\u96FB\u8A71</span>
        </a>
      </div>
      <button type="button" class="quick-collapse" aria-expanded="true" aria-label="\u6536\u5408\u5FEB\u6377\u806F\u7D61"><span>\u2039</span><b>\u6536\u5408</b></button>
      <div class="quick-route-menu" id="quick-route-menu">
        <a href="https://www.google.com/maps/dir/?api=1&destination=\u57FA\u9686\u5E02\u4E2D\u6B63\u5340\u7965\u8C50\u8857449\u5DF743\u865F" target="_blank" rel="noreferrer"><b>\u57FA\u9686\u5929\u8056\u5BAE\u7389\u9662</b><span>\u958B\u555F Google \u5C0E\u822A \u2197</span></a>
        <a href="https://www.google.com/maps/dir/?api=1&destination=\u65B0\u5317\u5E02\u77F3\u9580\u5340\u8001\u6885\u91CC\u4E03\u80A1\u5341\u4E8C\u4E4B\u4E09\u865F" target="_blank" rel="noreferrer"><b>\u77F3\u9580\u4E94\u5E9C\u5343\u6B72\u5BAE</b><span>\u958B\u555F Google \u5C0E\u822A \u2197</span></a>
      </div>`;
      const homeDock = document.createElement("nav");
      homeDock.className = "quick-home-dock", homeDock.setAttribute("aria-label", "\u8FD4\u56DE\u9996\u9801"), homeDock.innerHTML = `
      <a class="quick-action home" href="#home" aria-label="\u8FD4\u56DE\u7DB2\u7AD9\u9996\u9801">
        <span class="quick-icon">${icons.home}</span><span class="quick-label">\u8FD4\u56DE\u9996\u9801</span>
      </a>`, document.body.append(dock, homeDock);
      const routeToggle = dock.querySelector(".route-toggle"), routeMenu = dock.querySelector(".quick-route-menu"), collapseToggle = dock.querySelector(".quick-collapse");
      const setCollapsed = (collapsed) => {
        dock.classList.toggle("collapsed", collapsed);
        collapseToggle == null || collapseToggle.setAttribute("aria-expanded", String(!collapsed));
        collapseToggle == null || collapseToggle.setAttribute("aria-label", collapsed ? "\u5C55\u958B\u5FEB\u6377\u806F\u7D61" : "\u6536\u5408\u5FEB\u6377\u806F\u7D61");
        const label = collapseToggle == null ? void 0 : collapseToggle.querySelector("b");
        label && (label.textContent = collapsed ? "\u5FEB\u6377\u806F\u7D61" : "\u6536\u5408");
        routeMenu == null || routeMenu.classList.remove("open");
      };
      collapseToggle == null || collapseToggle.addEventListener("click", (event) => {
        event.stopPropagation(), setCollapsed(!dock.classList.contains("collapsed"));
      });
      setCollapsed(!0);
      routeToggle == null || routeToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        const open = routeMenu == null ? void 0 : routeMenu.classList.toggle("open");
        routeToggle.setAttribute("aria-expanded", String(!!open));
      }), routeMenu == null || routeMenu.addEventListener("click", (event) => event.stopPropagation()), document.addEventListener("click", () => {
        routeMenu == null || routeMenu.classList.remove("open"), routeToggle == null || routeToggle.setAttribute("aria-expanded", "false");
      });
    }, ensureDonationPreviewFrames = () => {
      document.querySelectorAll(".result-grid > article").forEach((card) => {
        const image = card.querySelector(":scope > .donation-preview");
        if (!image) return;
        const frame = document.createElement("div");
        frame.className = "donation-preview-frame";
        card.insertBefore(frame, image);
        frame.append(image);
      });
    }, installMobileQuickViewport = () => {
      if (document.documentElement.dataset.mobileQuickViewport === "ready") return;
      document.documentElement.dataset.mobileQuickViewport = "ready";
      let stableHeight = 0, orientation = "", frame = 0;
      const sync = () => {
        frame = 0;
        const viewport = window.visualViewport;
        const visibleHeight = viewport ? viewport.height : window.innerHeight;
        const visibleWidth = viewport ? viewport.width : window.innerWidth;
        const nextOrientation = visibleWidth > visibleHeight ? "landscape" : "portrait";
        if (nextOrientation !== orientation) {
          orientation = nextOrientation;
          stableHeight = visibleHeight;
        } else {
          stableHeight = stableHeight > 0 ? Math.min(stableHeight, visibleHeight) : visibleHeight;
        }
        const collapsedChromeLift = Math.max(0, visibleHeight - stableHeight);
        const root = document.documentElement;
        root.style.setProperty("--quick-stable-height", `${Math.round(stableHeight)}px`);
        root.style.setProperty("--quick-chrome-vertical-lift", `${Math.round(collapsedChromeLift)}px`);
        root.style.setProperty("--quick-visible-height", `${Math.round(visibleHeight)}px`);
      };
      const queueSync = () => {
        frame || (frame = window.requestAnimationFrame(sync));
      };
      sync();
      window.addEventListener("resize", queueSync, { passive: !0 });
      window.addEventListener("orientationchange", () => {
        stableHeight = 0, orientation = "", queueSync();
      }, { passive: !0 });
      window.visualViewport && (window.visualViewport.addEventListener("resize", queueSync, { passive: !0 }), window.visualViewport.addEventListener("scroll", queueSync, { passive: !0 }));
    }, normalizeLunarDate = () => {
      const rows = [...document.querySelectorAll(".almanac-date p")];
      const row = rows.find((element) => {
        var _a;
        return ((_a = element.querySelector("span")) == null ? void 0 : _a.textContent.trim()) === "\u8FB2\u66C6";
      });
      if (!row) return;
      try {
        const date = new Date(), formatter = new Intl.DateTimeFormat("zh-TW-u-ca-chinese", {
          timeZone: "Asia/Taipei",
          year: "numeric",
          month: "long",
          day: "numeric"
        }), parts = formatter.formatToParts(date), part = (type) => {
          var _a;
          return ((_a = parts.find((item) => item.type === type)) == null ? void 0 : _a.value) || "";
        };
        let relatedYear = Number(part("relatedYear").replace(/[^\d]/g, ""));
        if (!relatedYear) {
          const fallback = new Intl.DateTimeFormat("en-u-ca-chinese", {
            timeZone: "Asia/Taipei",
            year: "numeric"
          }).format(date).match(/\d{4}/);
          relatedYear = fallback ? Number(fallback[0]) : Number(new Intl.DateTimeFormat("en", {
            timeZone: "Asia/Taipei",
            year: "numeric"
          }).format(date));
        }
        const stems = ["\u7532", "\u4E59", "\u4E19", "\u4E01", "\u620A", "\u5DF1", "\u5E9A", "\u8F9B", "\u58EC", "\u7678"], branches = ["\u5B50", "\u4E11", "\u5BC5", "\u536F", "\u8FB0", "\u5DF3", "\u5348", "\u672A", "\u7533", "\u9149", "\u620C", "\u4EA5"], modulo = (value, divisor) => (value % divisor + divisor) % divisor, yearName = `${stems[modulo(relatedYear - 4, 10)]}${branches[modulo(relatedYear - 4, 12)]}`;
        const rawMonth = part("month").replace(/\s/g, ""), leap = /[\u958F\u95F0]/.test(rawMonth), monthNumberMatch = rawMonth.match(/\d+/), monthNames = ["", "\u6B63", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D", "\u5341", "\u5341\u4E00", "\u5341\u4E8C"];
        let monthName = rawMonth.replace(/[\u958F\u95F0\u6708]/g, "");
        monthNumberMatch && (monthName = monthNames[Math.max(1, Math.min(12, Number(monthNumberMatch[0])))] || monthName);
        /^[\u6B63\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D\u4E03\u516B\u4E5D\u5341]+$/.test(monthName) || (monthName = monthNames[Number(monthNumberMatch == null ? 0 : monthNumberMatch[0])] || "\u6B63");
        const dayNumber = Math.max(1, Math.min(30, Number(part("day").replace(/[^\d]/g, "")) || 1)), digits = ["", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D", "\u5341"], dayName = dayNumber <= 10 ? `\u521D${digits[dayNumber]}` : dayNumber < 20 ? `\u5341${digits[dayNumber - 10]}` : dayNumber === 20 ? "\u4E8C\u5341" : dayNumber < 30 ? `\u5EFF${digits[dayNumber - 20]}` : "\u4E09\u5341", lunarText = `${yearName}\u5E74 ${leap ? "\u958F" : ""}${monthName}\u6708 ${dayName}`;
        const label = row.querySelector("span"), current = [...row.childNodes].filter((node) => node !== label).map((node) => node.textContent || "").join("").trim();
        current !== lunarText && label && row.replaceChildren(label, document.createTextNode(lunarText));
      } catch (error) {
      }
    }, correctTempleNames = () => {
      const names = new Map([
        ["\u9EA5\u5BEE\u65BD\u539D\u93AE\u8056\u5BAE", "\u9EA5\u5BEE\u6A4B\u982D\u93AE\u8056\u5BAE"],
        ["\u65BD\u539D\u6148\u8056\u5BAE", "\u65BD\u539D\u52D2\u5EFA\u6148\u8056\u5BAE"]
      ]);
      document.querySelectorAll(".result-copy h3,.donation-modal h2").forEach((element) => {
        const replacement = names.get((element.textContent || "").trim());
        replacement && (element.textContent = replacement);
      });
      document.querySelectorAll(".donation-preview").forEach((image) => {
        let alt = image.getAttribute("alt") || "";
        names.forEach((replacement, original) => alt = alt.replace(original, replacement));
        image.setAttribute("alt", alt);
      });
    }, correctShimenGallery = () => {
      var _a;
      const card = [...document.querySelectorAll(".result-grid article")].find((article) => {
        var _a2;
        return (_a2 = article.textContent) == null ? void 0 : _a2.includes("\u77F3\u9580\u4E94\u5E9C\u5343\u6B72\u5BAE");
      }), preview = card == null ? void 0 : card.querySelector(".donation-preview");
      preview && !((_a = preview.getAttribute("src")) != null && _a.endsWith("/donations/shimen-wufu-6.webp")) && (preview.setAttribute("src", "/donations/shimen-wufu-6.webp"), preview.setAttribute("alt", "\u77F3\u9580\u4E94\u5E9C\u5343\u6B72\u5BAE\u6210\u679C\u9810\u89BD")), document.querySelectorAll(".donation-modal-grid figure").forEach((figure) => {
        var _a2;
        (((_a2 = figure.querySelector("img")) == null ? void 0 : _a2.getAttribute("src")) || "").endsWith("/donations/shimen-wufu-6.webp") && figure.remove();
      });
    }, annotateDynamicContent = () => {
      document.querySelectorAll(".donation-modal").forEach((modal) => {
        var _a, _b;
        const isBuilding = (_b = (_a = modal.querySelector("h2")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.includes("\u9EA5\u5BEE\u5929\u8056\u5BAE\u7389\u9662\u79AA\u623F\u5927\u6A13");
        modal.classList.toggle("donation-building-gallery", !!isBuilding);
      }), document.querySelectorAll("a[href^='tel:']").forEach((link) => {
        link.setAttribute("href", "tel:+886224622033");
      });
      const previewActive = !!document.querySelector(".ebook.expanded,.video-card.expanded,.service-modal,.donation-modal-backdrop,.photo-lightbox");
      document.body.classList.toggle("service-modal-active", !!document.querySelector(".service-modal"));
      document.body.classList.toggle("preview-active", previewActive);
    }, installReliableVideoControls = () => {
      if (document.documentElement.dataset.reliableVideoControls === "ready") return;
      document.documentElement.dataset.reliableVideoControls = "ready";
      const blobLoads = new WeakMap();
      let activeInput = null, activeVideo = null, activePointer = null;
      const videoFor = (input) => {
        const card = input == null ? null : input.closest(".video-card");
        return card == null ? null : card.querySelector("video");
      };
      const durationFor = (input, video) => Number.isFinite(video.duration) && video.duration > 0 ? video.duration : Number(input.max) || 0;
      const fractionAt = (input, clientX) => {
        const rect = input.getBoundingClientRect();
        return rect.width > 0 ? Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) : 0;
      };
      const setTime = (input, video, fraction) => {
        const duration = durationFor(input, video);
        if (duration <= 0) return false;
        const time = Math.max(0, Math.min(duration, fraction * duration));
        input.max = String(duration);
        input.value = String(time);
        try {
          video.currentTime = time;
        } catch (error) {
          return false;
        }
        return true;
      };
      const hasSeekableMedia = (video) => {
        try {
          return video.seekable.length > 0 && video.seekable.end(video.seekable.length - 1) > 0;
        } catch (error) {
          return false;
        }
      };
      const makeSeekable = (video) => {
        if (hasSeekableMedia(video) || video.dataset.blobReady === "true") return Promise.resolve(video);
        const existing = blobLoads.get(video);
        if (existing) return existing;
        const source = video.getAttribute("src") || video.currentSrc;
        if (!source || source.startsWith("blob:")) return Promise.resolve(video);
        const card = video.closest(".video-card");
        card == null || card.classList.add("video-source-loading");
        const task = fetch(source, { credentials: "same-origin", cache: "force-cache" }).then((response) => {
          if (!response.ok) throw new Error(`Video request failed: ${response.status}`);
          return response.blob();
        }).then((blob) => new Promise((resolve, reject) => {
          const wasPlaying = !video.paused, objectUrl = URL.createObjectURL(blob);
          const onReady = () => {
            video.removeEventListener("error", onError);
            video.dataset.blobReady = "true";
            card == null || card.classList.remove("video-source-loading");
            wasPlaying && video.play().catch(() => {
            });
            resolve(video);
          };
          const onError = () => {
            video.removeEventListener("loadedmetadata", onReady);
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Video blob could not be loaded"));
          };
          video.addEventListener("loadedmetadata", onReady, { once: !0 });
          video.addEventListener("error", onError, { once: !0 });
          video.pause();
          video.src = objectUrl;
          video.load();
        })).catch(() => {
          card == null || card.classList.remove("video-source-loading");
          return video;
        });
        blobLoads.set(video, task);
        return task;
      };
      const seekAt = (input, video, fraction) => {
        if (hasSeekableMedia(video) && setTime(input, video, fraction)) return;
        makeSeekable(video).then(() => {
          setTime(input, video, fraction);
        });
      };
      const finish = (event) => {
        if (!activeInput || !activeVideo || activePointer !== event.pointerId) return;
        seekAt(activeInput, activeVideo, fractionAt(activeInput, event.clientX));
        activeInput.dataset.timelineDragging = "false";
        activeInput = null;
        activeVideo = null;
        activePointer = null;
        event.preventDefault();
      };
      document.addEventListener("pointerdown", (event) => {
        const input = event.target && event.target.closest ? event.target.closest(".video-timeline input[type='range']") : null;
        const video = videoFor(input);
        if (!input || !video) return;
        activeInput = input;
        activeVideo = video;
        activePointer = event.pointerId;
        input.dataset.timelineDragging = "true";
        seekAt(input, video, fractionAt(input, event.clientX));
        event.preventDefault();
      }, { capture: !0, passive: !1 });
      document.addEventListener("pointermove", (event) => {
        if (!activeInput || !activeVideo || activePointer !== event.pointerId) return;
        seekAt(activeInput, activeVideo, fractionAt(activeInput, event.clientX));
        event.preventDefault();
      }, { capture: !0, passive: !1 });
      document.addEventListener("pointerup", finish, { capture: !0, passive: !1 });
      document.addEventListener("pointercancel", finish, { capture: !0, passive: !1 });
      document.addEventListener("click", (event) => {
        const button = event.target && event.target.closest ? event.target.closest(".video-buttons button,.video-center-play") : null;
        const card = button == null ? null : button.closest(".video-card");
        const video = card == null ? null : card.querySelector("video");
        if (!button || !video) return;
        const label = button.getAttribute("aria-label") || "";
        if (button.classList.contains("video-center-play") || label === "\u64AD\u653E" || label === "\u66AB\u505C") {
          event.preventDefault();
          event.stopImmediatePropagation();
          video.paused ? video.play().catch(() => {
          }) : video.pause();
          return;
        }
        if (label !== "\u5012\u9000\u5341\u79D2" && label !== "\u5FEB\u9032\u5341\u79D2") return;
        event.preventDefault();
        event.stopImmediatePropagation();
        const duration = durationFor(card.querySelector(".video-timeline input[type='range']"), video);
        if (duration <= 0) return;
        const delta = label === "\u5FEB\u9032\u5341\u79D2" ? 10 : -10;
        const input = card.querySelector(".video-timeline input[type='range']");
        const pending = Number(video.dataset.pendingControlTime);
        const base = Number.isFinite(pending) ? pending : video.currentTime || 0;
        const target = Math.max(0, Math.min(duration, base + delta));
        if (hasSeekableMedia(video)) {
          delete video.dataset.pendingControlTime;
          setTime(input, video, target / duration);
          return;
        }
        video.dataset.pendingControlTime = String(target);
        makeSeekable(video).then(() => {
          const latest = Number(video.dataset.pendingControlTime);
          Number.isFinite(latest) && setTime(input, video, latest / duration);
          delete video.dataset.pendingControlTime;
        });
      }, !0);
      document.addEventListener("keydown", (event) => {
        const input = event.target && event.target.closest ? event.target.closest(".video-timeline input[type='range']") : null;
        const video = videoFor(input);
        if (!input || !video || !["ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"].includes(event.key)) return;
        const duration = durationFor(input, video);
        if (duration <= 0) return;
        let next = Number(input.value) || 0;
        if (event.key === "Home") next = 0;
        else if (event.key === "End") next = duration;
        else next += ["ArrowRight", "PageUp"].includes(event.key) ? 10 : -10;
        seekAt(input, video, Math.max(0, Math.min(1, next / duration)));
        event.preventDefault();
      }, !0);
    }, installVideoSeeking = () => {
      if (document.documentElement.dataset.videoSeeking === "ready") return;
      document.documentElement.dataset.videoSeeking = "ready";
      const videoFor = (input) => input.closest(".video-card") == null ? null : input.closest(".video-card").querySelector("video");
      const updateTimeline = (input, video, value) => {
        const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : Number(input.max) || 0;
        if (duration <= 0) return;
        const time = Math.max(0, Math.min(duration, value));
        video.currentTime = time, input.max = String(duration), input.value = String(time);
      };
      document.addEventListener("input", (event) => {
        const input = event.target && event.target.closest ? event.target.closest(".video-timeline input[type='range']") : null, video = input && videoFor(input);
        input && video && updateTimeline(input, video, Number(input.value));
      }, !0), document.addEventListener("change", (event) => {
        const input = event.target && event.target.closest ? event.target.closest(".video-timeline input[type='range']") : null, video = input && videoFor(input);
        input && video && updateTimeline(input, video, Number(input.value));
      }, !0);
    }, syncVideoTimelines = () => {
      document.querySelectorAll(".video-card").forEach((card) => {
        const video = card.querySelector("video"), input = card.querySelector(".video-timeline input[type='range']");
        if (!video || !input) return;
        const sync = () => {
          Number.isFinite(video.duration) && video.duration > 0 && (input.max = String(video.duration)), input.dataset.timelineDragging === "true" || (input.value = String(video.currentTime || 0));
        };
        const seekFromNativeRange = () => {
          const time = Number(input.value);
          Number.isFinite(time) && (video.currentTime = Math.max(0, Math.min(Number(input.max) || time, time)));
        };
        video.dataset.timelineSync !== "ready" && (video.dataset.timelineSync = "ready", ["loadedmetadata", "durationchange", "canplay", "timeupdate", "seeked"].forEach((name) => video.addEventListener(name, sync)));
        input.dataset.seekSync !== "ready" && (input.dataset.seekSync = "ready", input.addEventListener("input", seekFromNativeRange), input.addEventListener("change", seekFromNativeRange)), sync();
      });
    }, installSeekableVideos = () => {
      if (document.documentElement.dataset.seekableVideos === "ready") return;
      document.documentElement.dataset.seekableVideos = "ready";
      const loads = new WeakMap();
      const makeSeekable = (video) => {
        if (video.dataset.blobReady === "true") return Promise.resolve(video);
        const pending = loads.get(video);
        if (pending) return pending;
        const source = video.getAttribute("src") || video.currentSrc;
        if (!source || source.startsWith("blob:")) return Promise.resolve(video);
        video.closest(".video-card") == null || video.closest(".video-card").classList.add("video-source-loading");
        const task = fetch(source, { credentials: "same-origin", cache: "force-cache" }).then((response) => {
          if (!response.ok) throw new Error(`Video request failed: ${response.status}`);
          return response.blob();
        }).then((blob) => new Promise((resolve, reject) => {
          const current = video.currentTime || 0, wasPlaying = !video.paused, objectUrl = URL.createObjectURL(blob);
          const onReady = () => {
            video.removeEventListener("error", onError), video.dataset.blobReady = "true", current > 0 && (video.currentTime = Math.min(current, video.duration || current)), video.closest(".video-card") == null || video.closest(".video-card").classList.remove("video-source-loading"), wasPlaying && video.play().catch(() => {
            }), resolve(video);
          }, onError = () => {
            video.removeEventListener("loadedmetadata", onReady), URL.revokeObjectURL(objectUrl), reject(new Error("Video blob could not be loaded"));
          };
          video.addEventListener("loadedmetadata", onReady, { once: !0 }), video.addEventListener("error", onError, { once: !0 }), video.pause(), video.src = objectUrl, video.load();
        })).catch(() => {
          video.closest(".video-card") == null || video.closest(".video-card").classList.remove("video-source-loading");
          return video;
        });
        return loads.set(video, task), task;
      };
      let activeTimeline = null, activeVideo = null, activePointerId = null;
      const timelineFraction = (input, clientX) => {
        const rect = input.getBoundingClientRect();
        return rect.width > 0 ? Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) : 0;
      };
      const applyTimelineFraction = (input, video, fraction) => {
        const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : Number(input.max) || 0;
        input.dataset.pendingSeekFraction = String(fraction);
        if (duration <= 0) {
          if (video.dataset.metadataRequested !== "true") {
            video.dataset.metadataRequested = "true", video.preload = "metadata", video.load();
          }
          return false;
        }
        const target = Math.max(0, Math.min(duration, fraction * duration));
        input.max = String(duration), input.value = String(target), input.dataset.pendingSeek = String(target), video.currentTime = target;
        return true;
      };
      const applyPendingTimeline = (input, video) => {
        const fraction = Number(input.dataset.pendingSeekFraction);
        Number.isFinite(fraction) && applyTimelineFraction(input, video, fraction);
      };
      const finishTimelineDrag = (event) => {
        if (!activeTimeline || !activeVideo || activePointerId !== event.pointerId) return;
        const input = activeTimeline, video = activeVideo, fraction = timelineFraction(input, event.clientX);
        applyTimelineFraction(input, video, fraction);
        input.dataset.timelineDragging = "false";
        try {
          input.hasPointerCapture && input.hasPointerCapture(event.pointerId) && input.releasePointerCapture(event.pointerId);
        } catch (error) {
        }
        activeTimeline = null, activeVideo = null, activePointerId = null;
        event.preventDefault();
      };
      document.addEventListener("pointermove", (event) => {
        if (!activeTimeline || !activeVideo || activePointerId !== event.pointerId) return;
        applyTimelineFraction(activeTimeline, activeVideo, timelineFraction(activeTimeline, event.clientX));
        event.preventDefault();
      }, { capture: !0, passive: !1 }), document.addEventListener("pointerup", finishTimelineDrag, { capture: !0, passive: !1 }), document.addEventListener("pointercancel", finishTimelineDrag, { capture: !0, passive: !1 }), document.addEventListener("pointerdown", (event) => {
        const input = event.target && event.target.closest ? event.target.closest(".video-timeline input[type='range']") : null, card = input == null ? null : input.closest(".video-card"), video = card == null ? null : card.querySelector("video");
        if (!input || !video) return;
        activeTimeline = input, activeVideo = video, activePointerId = event.pointerId, input.dataset.timelineDragging = "true";
        try {
          input.setPointerCapture && input.setPointerCapture(event.pointerId);
        } catch (error) {
        }
        const fraction = timelineFraction(input, event.clientX);
        if (!applyTimelineFraction(input, video, fraction)) {
          video.addEventListener("loadedmetadata", () => {
            video.dataset.metadataRequested = "false", applyPendingTimeline(input, video);
          }, { once: !0 });
        }
        event.preventDefault();
      }, { capture: !0, passive: !1 }), document.addEventListener("click", (event) => {
        const button = event.target && event.target.closest ? event.target.closest(".video-buttons button[aria-label='\u5012\u9000\u5341\u79D2'],.video-buttons button[aria-label='\u5FEB\u9032\u5341\u79D2']") : null, card = button == null ? null : button.closest(".video-card"), video = card == null ? null : card.querySelector("video");
        if (!button || !video || video.dataset.blobReady === "true" || video.seekable.length && video.seekable.end(video.seekable.length - 1) > 0) return;
        const delta = button.getAttribute("aria-label") === "\u5FEB\u9032\u5341\u79D2" ? 10 : -10;
        event.preventDefault(), event.stopImmediatePropagation(), makeSeekable(video).then(() => {
          video.currentTime = Math.max(0, Math.min(video.duration || 0, (video.currentTime || 0) + delta));
        });
      }, !0);
    }, installSinglePageEbook = () => {
      if (document.documentElement.dataset.singlePageEbook === "ready") return;
      document.documentElement.dataset.singlePageEbook = "ready";
      const sources = ["/biography-pages/cover.jpg", ...Array.from({ length: 40 }, (_, index) => `/biography-pages/page-${String(index + 1).padStart(2, "0")}.jpg`), "/biography-pages/back-cover.jpg"];
      const render = (ebook, nextIndex) => {
        const index = Math.max(0, Math.min(sources.length - 1, nextIndex));
        ebook.dataset.singlePageIndex = String(index);
        const spread = ebook.querySelector(".ebook-spread");
        if (!spread) return;
        spread.classList.add("single");
        let page = spread.querySelector(".ebook-page"), image = page == null ? null : page.querySelector("img");
        if (spread.querySelectorAll(".ebook-page").length !== 1 || !page || !image) {
          page = document.createElement("figure"), page.className = "ebook-page", image = document.createElement("img"), page.append(image), spread.replaceChildren(page);
        }
        image.getAttribute("src") !== sources[index] && image.setAttribute("src", sources[index]), image.setAttribute("alt", index === 0 ? "\u8B1D\u8A31\u6708\u9DAF\u50B3\u8A18\u5C01\u9762" : index === 41 ? "\u8B1D\u8A31\u6708\u9DAF\u50B3\u8A18\u5C01\u5E95" : `\u8B1D\u8A31\u6708\u9DAF\u50B3\u8A18\u7B2C ${index} \u9801`);
        const label = ebook.querySelector(".ebook-toolbar div b");
        label && (label.textContent = index === 0 ? "\u5C01\u9762" : index === 41 ? "\u5C01\u5E95" : `${index} / 40`);
        const previous = ebook.querySelector("button[aria-label='\u7FFB\u5230\u524D\u4E00\u9801']"), next = ebook.querySelector("button[aria-label='\u7FFB\u5230\u4E0B\u4E00\u9801']");
        previous && (previous.disabled = index === 0), next && (next.disabled = index === sources.length - 1);
      };
      document.addEventListener("click", (event) => {
        const button = event.target && event.target.closest ? event.target.closest(".ebook button[aria-label='\u7FFB\u5230\u524D\u4E00\u9801'],.ebook button[aria-label='\u7FFB\u5230\u4E0B\u4E00\u9801']") : null;
        if (!button || !window.matchMedia("(max-width: 700px)").matches) return;
        const ebook = button.closest(".ebook"), current = Number(ebook.dataset.singlePageIndex || 0);
        event.preventDefault(), event.stopImmediatePropagation(), render(ebook, current + (button.getAttribute("aria-label") === "\u7FFB\u5230\u4E0B\u4E00\u9801" ? 1 : -1));
      }, !0), document.addEventListener("submit", (event) => {
        const form = event.target && event.target.closest ? event.target.closest(".ebook .page-jump") : null;
        if (!form || !window.matchMedia("(max-width: 700px)").matches) return;
        event.preventDefault(), event.stopImmediatePropagation();
        const ebook = form.closest(".ebook"), input = form.querySelector("input[type='number']"), page = Number(input == null ? 0 : input.value);
        page >= 1 && page <= 40 && render(ebook, page);
      }, !0);
    }, normalizeEbook = () => {
      if (!window.matchMedia("(max-width: 700px)").matches) return;
      const sources = ["/biography-pages/cover.jpg", ...Array.from({ length: 40 }, (_, page) => `/biography-pages/page-${String(page + 1).padStart(2, "0")}.jpg`), "/biography-pages/back-cover.jpg"];
      document.querySelectorAll(".ebook").forEach((ebook) => {
        let index = Number(ebook.dataset.singlePageIndex);
        if (!Number.isFinite(index)) {
          const image = ebook.querySelector(".ebook-page img"), src = image == null ? "" : image.getAttribute("src") || "", match = src.match(/page-(\d+)\.jpg$/);
          index = src.endsWith("/back-cover.jpg") ? 41 : match ? Number(match[1]) : 0;
        }
        ebook.dataset.singlePageIndex = String(Math.max(0, Math.min(41, index)));
        const spread = ebook.querySelector(".ebook-spread");
        if (spread) {
          const figures = spread.querySelectorAll(".ebook-page");
          figures.length > 1 && spread.replaceChildren(figures[figures.length - 1]), spread.classList.add("single");
          const image = spread.querySelector(".ebook-page img"), target = Math.max(0, Math.min(41, index));
          image && image.getAttribute("src") !== sources[target] && image.setAttribute("src", sources[target]);
        }
        const label = ebook.querySelector(".ebook-toolbar div b"), previous = ebook.querySelector("button[aria-label='\u7FFB\u5230\u524D\u4E00\u9801']"), next = ebook.querySelector("button[aria-label='\u7FFB\u5230\u4E0B\u4E00\u9801']");
        label && (label.textContent = index === 0 ? "\u5C01\u9762" : index === 41 ? "\u5C01\u5E95" : `${index} / 40`), previous && (previous.disabled = index === 0), next && (next.disabled = index === 41);
      });
    }, installFortuneFeedback = () => {
      if (document.documentElement.dataset.fortuneFeedback === "ready") return;
      document.documentElement.dataset.fortuneFeedback = "ready";
      const startShake = (event) => {
        const target = event.target;
        const button = target && target.closest ? target.closest(".draw-fortune") : null;
        if (!button || button.disabled) return;
        const cylinder = document.querySelector(".fortune-cylinder");
        if (!cylinder) return;
        cylinder.classList.remove("instant-shake");
        void cylinder.offsetWidth;
        cylinder.classList.add("instant-shake");
        window.setTimeout(() => cylinder.classList.remove("instant-shake"), 700);
      };
      if ("PointerEvent" in window) document.addEventListener("pointerdown", startShake, true);
      else document.addEventListener("touchstart", startShake, { capture: true, passive: true });
      document.addEventListener("touchend", (event) => {
        const target = event.target;
        const button = target && target.closest ? target.closest(".draw-fortune") : null;
        if (!button) return;
        event.preventDefault();
        button.disabled = false;
        button.removeAttribute("disabled");
        button.click();
      }, { capture: true, passive: false });
    }, installPhoneDialing = () => {
      document.documentElement.dataset.phoneDialing !== "ready" && (document.documentElement.dataset.phoneDialing = "ready", document.addEventListener("pointerdown", (event) => {
        var _a, _b;
        const link = (_b = (_a = event.target).closest) == null ? void 0 : _b.call(_a, "a[href^='tel:']");
        link && link.setAttribute("href", "tel:+886224622033");
      }, !0));
    }, installPortalMotion = () => {
      if (document.documentElement.dataset.portalMotion === "ready") return;
      const cards = [...document.querySelectorAll(".culture-portals>a")];
      if (!cards.length) return;
      document.documentElement.dataset.portalMotion = "ready";
      if (!window.matchMedia("(max-width: 700px)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
        cards.forEach((card) => card.classList.add("portal-motion-visible"));
        return;
      }
      cards.forEach((card) => card.classList.add("portal-motion-ready"));
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = cards.indexOf(entry.target);
        window.setTimeout(() => entry.target.classList.add("portal-motion-visible"), Math.max(0, index) * 95);
        observer.unobserve(entry.target);
      }), { threshold: .22 });
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => cards.forEach((card) => observer.observe(card))));
    }, applyDraft = () => {
      var _a;
      try {
        const draft = JSON.parse(localStorage.getItem(STORAGE) || "{}");
        if ([
          [draft.heroTitle, ".hero h1"],
          [draft.heroSubtitle, ".hero h2"],
          [draft.heroIntro, ".hero-copy-wrap>p:last-of-type"],
          [draft.leaderTitle, "#leader h2"],
          [draft.serviceTitle, "#services .services-title h2"]
        ].forEach(([value, selector]) => {
          value && (document.querySelector(selector).textContent = value);
        }), draft.leaderImage && ((_a = document.querySelector(".leader-photo-frame img")) == null || _a.setAttribute("src", draft.leaderImage)), draft.heroImage) {
          const hero = document.querySelector(".hero-deity-photo");
          hero && (hero.style.backgroundImage = `url(${draft.heroImage})`);
        }
      } catch (e) {
      }
    }, ensureUi = () => {
      installNavigation(), installHashNavigation(), installQuickDock(), installMobileQuickViewport(), installPhoneDialing(), installPortalMotion(), installFortuneFeedback(), installReliableVideoControls(), installSinglePageEbook(), ensureDonationPreviewFrames(), normalizeLunarDate(), correctTempleNames(), correctShimenGallery(), annotateDynamicContent(), normalizeEbook();
    }, boot = () => {
      if (ensureUi(), applyDraft(), !document.querySelector(".admin-entry")) {
        const admin = document.createElement("a");
        admin.className = "admin-entry", admin.href = "/admin.html", admin.textContent = "\u7DB2\u7AD9\u7BA1\u7406", document.body.append(admin);
      }
      let queued = !1;
      new MutationObserver(() => {
        queued || (queued = !0, requestAnimationFrame(() => {
          queued = !1, ensureUi();
        }));
      }).observe(document.body, { childList: !0, subtree: !0, attributes: !0, attributeFilter: ["class"] }), window.setTimeout(ensureUi, 350), window.setTimeout(ensureUi, 1200);
    };
    const startAfterHydration = () => window.setTimeout(boot, 900);
    document.readyState === "complete" ? startAfterHydration() : window.addEventListener("load", startAfterHydration, { once: !0 });
  })();
})();
import("/site-content-loader.js?v=5").catch((error) => {
  document.documentElement.dataset.editableContent = "error";
  console.error("Editable content loader could not start.", error);
});
