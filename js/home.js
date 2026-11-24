(function () {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  const onScroll = () => {
    nav.classList.toggle("is-stuck", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  const voteButtons = document.querySelectorAll(".vote-button");
  const voteCounts = document.querySelectorAll(".vote-count");
  const VOTE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzYS5YAbFZF8X_Yz0QMkwp5SD18HXGgpdYg-8J17MlTzyUmpvyYDdWkkik4XWo0aVYK/exec";

  const getClientId = () => {
    const KEY = "libertad_plan_vote_id";
    const existing = localStorage.getItem(KEY);
    if (existing) return existing;
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    localStorage.setItem(KEY, id);
    return id;
  };

  const votesWord = (n) => {
    const abs = Math.abs(n) % 100;
    const last = abs % 10;
    if (abs > 10 && abs < 20) return "голосов";
    if (last > 1 && last < 5) return "голоса";
    if (last === 1) return "голос";
    return "голосов";
  };

  const renderVote = (planId, count) => {
    const value = Number(count) || 0;
    voteCounts.forEach((el) => {
      if (el.dataset.planId !== planId) return;
      const num = el.querySelector("b");
      const word = el.querySelector("small");
      if (num) num.textContent = String(value);
      if (word) word.textContent = votesWord(value);
    });
  };

  const fetchVotes = () => {
    fetch(`${VOTE_SCRIPT_URL}?action=getVotes`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.votes) return;
        Object.entries(data.votes).forEach(([planId, count]) => renderVote(planId, count));
      })
      .catch((err) => console.error("Failed to load votes", err));
  };

  const sendVote = (planId, title, button) => {
    if (!planId) return;
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = "Отправляем";
    const params = new URLSearchParams({
      action: "vote",
      planId,
      title,
      clientId: getClientId()
    });
    fetch(`${VOTE_SCRIPT_URL}?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!data) throw new Error("Empty response");
        if (data.error) {
          alert(`Ошибка голосования: ${data.error}`);
          return;
        }
        renderVote(planId, data.count || 0);
      })
      .catch((err) => {
        console.error("Vote failed", err);
        alert("Не удалось отправить голос. Попробуйте позже.");
      })
      .finally(() => {
        setTimeout(() => {
          button.disabled = false;
          button.textContent = originalText;
        }, 900);
      });
  };

  voteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sendVote(btn.dataset.planId, btn.dataset.planTitle, btn);
    });
  });

  if (voteButtons.length) fetchVotes();
})();
