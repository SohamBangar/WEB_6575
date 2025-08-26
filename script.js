// ✅ Collect topics dynamically (Core + ML)
const topics = document.querySelectorAll(".topic-card");
const mlTopics = document.querySelectorAll(".ml-topic");

// ✅ Search functionality (corrected)
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchBar").value.toLowerCase().trim();
  const resultList = document.getElementById("resultList");
  resultList.innerHTML = "";

  let found = false;

  // Loop through all topics to check if they match the search
  topics.forEach(topic => {
    const title = topic.querySelector("h3").innerText.toLowerCase();

    if (query !== "" && title.includes(query)) {
      found = true;

      const pdfLink = topic.querySelector(".pdf")?.href;
      const videoLink = topic.querySelector(".video")?.href;

      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${title}</strong> - 
        ${pdfLink && pdfLink !== '#' ? `<a href="${pdfLink}" target="_blank">📄 PDF</a>` : ""}
        ${videoLink && videoLink !== '#' ? ` | <a href="${videoLink}" target="_blank">🎥 Video</a>` : ""}
      `;
      resultList.appendChild(li);
    }
  });

  // Show a message if nothing matches
  if (!found) {
    resultList.innerHTML = "<li>No resources found.</li>";
  }

  // Always show results section (core topics stay visible)
  document.getElementById("results").classList.remove("hidden");
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
});


// ✅ Scroll animations
const faders = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });
faders.forEach(el => observer.observe(el));

// ✅ Toggle footer sections
function toggleSection(id) {
  const section = document.getElementById(id);

  // Close all sections first
  document.querySelectorAll('.footer-section').forEach(sec => sec.style.display = "none");

  if (section) {
    section.style.display = "block";
    section.scrollIntoView({ behavior: "smooth" });
  }

  // If "Resources" clicked → show ALL topics (core + ML hidden ones)
  if (id === "resources") {
    topics.forEach(topic => {
      topic.style.display = "block";
    });
  }
}

// ✅ Smooth scroll for navbar links
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", function(e) {
    if (this.getAttribute("href").startsWith("#")) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

// ✅ Show Home section
function showHomeInfo() {
  const info = document.getElementById("home-info");

  document.querySelectorAll("section").forEach(sec => {
    if (sec.id !== "home-info") sec.style.display = "none";
  });

  info.style.display = "block";
  info.scrollIntoView({ behavior: "smooth" });
}

// ✅ Show About section
function showAbout() {
  const about = document.getElementById("about-info");

  document.querySelectorAll("section").forEach(sec => {
    if (sec.id !== "about-info") sec.style.display = "none";
  });

  about.style.display = "block";
  about.scrollIntoView({ behavior: "smooth" });
}

// ✅ Show Contribute section
function showContribute() {
  const contribute = document.getElementById("contribute");

  document.querySelectorAll("section").forEach(sec => {
    if (sec.id !== "contribute") sec.style.display = "none";
  });

  contribute.style.display = "block";
  contribute.scrollIntoView({ behavior: "smooth" });
}

// ✅ Handle contribution form submission
document.getElementById("contributeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  await fetch("/topics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  alert("Topic added!");
  
});

function showMLTopics() {
  // Hide all sections first
  document.querySelectorAll("section").forEach(sec => {
    if (!sec.closest("header") && !sec.closest("footer")) {
      sec.classList.add("hidden");
    }
  });

  // Show ML resources section
  document.getElementById("ml-resources").classList.remove("hidden");

  // Scroll smoothly
  document.getElementById("ml-resources").scrollIntoView({ behavior: "smooth" });
}
function showTopics() {
  // Show core topics
  document.getElementById("topics").classList.remove("hidden");
  
  // Show hidden ML resources
  document.getElementById("ml-resources").classList.remove("hidden");

  // Hide other sections if you want only topics visible
  document.getElementById("home").classList.add("hidden");
  document.getElementById("home-info").classList.add("hidden");
  document.getElementById("about-info").classList.add("hidden");
  document.getElementById("contribute").classList.add("hidden");
  document.getElementById("results").classList.add("hidden");

  // Scroll smoothly to the topics section
  document.getElementById("topics").scrollIntoView({ behavior: "smooth" });
}
