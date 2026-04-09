document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector('[role="main"] > .row > div');
  if (!main) {
    return;
  }

  const headings = Array.from(
    main.querySelectorAll("h2[id], h3[id]")
  ).filter((heading) => heading.id);

  if (headings.length < 2) {
    return;
  }

  const panel = document.createElement("aside");
  panel.className = "var-toc-panel";
  panel.setAttribute("aria-label", "Table of contents");

  const title = document.createElement("div");
  title.className = "var-toc-title";
  title.textContent = "On This Page";
  panel.appendChild(title);

  const list = document.createElement("ul");
  list.className = "var-toc-list";
  panel.appendChild(list);

  let currentH2Item = null;
  const linkMap = new Map();

  for (const heading of headings) {
    const item = document.createElement("li");
    item.className = "var-toc-item";

    const link = document.createElement("a");
    link.className = "var-toc-link";
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();
    item.appendChild(link);
    linkMap.set(heading.id, link);

    if (heading.tagName === "H2") {
      list.appendChild(item);
      currentH2Item = item;
      continue;
    }

    if (!currentH2Item) {
      list.appendChild(item);
      continue;
    }

    let sublist = currentH2Item.querySelector(".var-toc-sublist");
    if (!sublist) {
      sublist = document.createElement("ul");
      sublist.className = "var-toc-sublist";
      currentH2Item.appendChild(sublist);
    }
    sublist.appendChild(item);
  }

  const paperMeta = main.querySelector(".paper-meta");
  if (paperMeta) {
    paperMeta.insertAdjacentElement("afterend", panel);
  } else {
    main.prepend(panel);
  }

  const movePanelInline = () => {
    panel.classList.remove("var-toc-docked");
    if (panel.parentElement !== main) {
      if (paperMeta) {
        paperMeta.insertAdjacentElement("afterend", panel);
      } else {
        main.prepend(panel);
      }
    }
    panel.style.left = "";
  };

  const dockPanel = (left) => {
    panel.classList.add("var-toc-docked");
    if (panel.parentElement !== document.body) {
      document.body.appendChild(panel);
    }
    panel.style.left = `${left}px`;
  };

  const updatePanelPlacement = () => {
    if (window.innerWidth < 992) {
      movePanelInline();
      return;
    }

    const rect = main.getBoundingClientRect();
    const panelWidth = window.innerWidth >= 1200 ? 272 : 256;
    const gutter = window.innerWidth >= 1200 ? 32 : 24;
    const minLeft = rect.right + gutter;
    const maxLeft = window.innerWidth - panelWidth - 16;
    const hasRoomOutside = maxLeft >= minLeft;

    if (!hasRoomOutside) {
      movePanelInline();
      return;
    }

    dockPanel(minLeft);
  };

  const setActiveLink = (id) => {
    for (const tocLink of linkMap.values()) {
      tocLink.classList.remove("is-active");
    }
    const activeLink = linkMap.get(id);
    if (activeLink) {
      activeLink.classList.add("is-active");
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        setActiveLink(visible[0].target.id);
      }
    },
    {
      rootMargin: "-90px 0px -55% 0px",
      threshold: [0, 1],
    }
  );

  headings.forEach((heading) => observer.observe(heading));
  setActiveLink(headings[0].id);
  updatePanelPlacement();

  window.addEventListener("resize", updatePanelPlacement, { passive: true });
  window.addEventListener("scroll", updatePanelPlacement, { passive: true });
});
