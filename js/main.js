window.onload = function () {
  const sidebarToggle = document.querySelector("#toggle-sidebar");
  const projectStates = [{ showSideBar: true }];
  const contentSections = document.querySelectorAll(".app-content > section");
  const navbarItemsLi = document.querySelectorAll("#app-sidebar ul li");
  const sectionsPositions = [];

  let refreshPositionsTimeout = null;

  const handleRefreshPositions = (timeout = 500) => {
    refreshPositionsTimeout && clearTimeout(refreshPositionsTimeout);

    // tempo de espera das animações da sidebar
    refreshPositionsTimeout = setTimeout(() => {
      sectionsPositions.forEach((sec, index) => {
        const element = document.querySelector(`#${sec.id}`);
        const rect = element.getBoundingClientRect();

        sectionsPositions[index].pos = rect.top + window.scrollY;
      });
    }, timeout);
  };

  // carrega as posições de cada artigo no scroll
  contentSections.forEach(($el) => {
    const rect = $el.getBoundingClientRect();
    const sectionPosition = rect.top;
    const sectionId = $el.getAttribute("id");

    sectionsPositions.push({
      id: sectionId,
      pos: sectionPosition + window.scrollY
    });
  });

  sidebarToggle.addEventListener("click", () => {
    const sidebarElement = document.querySelector("#app-sidebar");
    const { showSideBar } = projectStates[0];

    if (showSideBar) {
      sidebarElement.classList.remove("showed");
    } else {
      sidebarElement.classList.add("showed");
    }

    handleRefreshPositions();

    projectStates[0].showSideBar = !projectStates[0].showSideBar;
  });

  window.addEventListener("resize", () => {
    handleRefreshPositions(0);
  });
  
  // mapeamento da posição do scroll para habilitar o efeito de scrollspy
  window.addEventListener("scroll", (e) => {
    const scrollTop = window.scrollY;

    sectionsPositions.forEach((sec) => {
      if (scrollTop <= sec.pos && scrollTop >= sec.pos - 120) {
        const navItemRefer = document.querySelector(
          `#app-sidebar ul li[refer="${sec.id}"]`
        );

        if (navItemRefer) {
          document
            .querySelector("#app-sidebar li.active")
            .classList.remove("active");
          navItemRefer.classList.add("active");
        }
      }
    });
  });
  
  navbarItemsLi.forEach((item) => {
    item.addEventListener("click", (e) => {
      const currentLiRefer = item.getAttribute("refer");
      const sectionRefer = document.querySelector(`#${currentLiRefer}`);
      const sectionReferPositionY =
        sectionRefer.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: sectionReferPositionY - 50,
        behavior: "smooth"
      });
    });
  });
};
