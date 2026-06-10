import React, { useEffect, useState } from "react";
import PortfolioItems from "./PortfolioItems";
import { fallbackProjects } from "./PortfolioData";

const PortfolioWork = () => {
  const [item, setItem] = useState({ name: "all" });
  const [allProjects, setAllProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState(0);
  const [visibleItem, setVisibleItem] = useState(6);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["all"]);

  // Fetch projects from express backend API
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data) => {
        setAllProjects(data);
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects, using fallback data:", err);
        setAllProjects(fallbackProjects);
        setProjects(fallbackProjects);
        setLoading(false);
      });
  }, []);

  // Compute unique categories dynamically when allProjects changes
  useEffect(() => {
    const unique = new Set(allProjects.map((p) => p.category).filter(Boolean));
    setCategories(["all", ...Array.from(unique)]);
  }, [allProjects]);

  // Filter projects by category
  useEffect(() => {
    if (item.name === "all") {
      setProjects(allProjects);
    } else {
      const newProjects = allProjects.filter(
        (project) => project.category.toLowerCase() === item.name.toLowerCase()
      );
      setProjects(newProjects);
    }
  }, [item, allProjects]);

  const loadMoreItems = projects.slice(0, visibleItem);

  const handleLoadMore = () => {
    setVisibleItem((prev) => prev + 6);
  };

  const handleClick = (categoryName, index) => {
    setItem({ name: categoryName.toLowerCase() });
    setActive(index);
    setVisibleItem(6); // reset pagination when filtering
  };

  return (
    <div className="portfolio-works">
      <div className="portfolio-filters">
        {categories.map((cat, index) => (
          <span
            onClick={() => handleClick(cat, index)}
            className={`${active === index ? "active-portfolio" : ""} portfolio-item`}
            key={index}
          >
            {cat}
          </span>
        ))}
      </div>

      {loading ? (
        <div className="portfolio-loading">
          <i className="bx bx-loader-alt bx-spin"></i> Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <p className="no-projects">No projects found for this category.</p>
      ) : (
        <div className="portfolio-container container grid">
          {loadMoreItems.map((item, i) => (
            <PortfolioItems item={item} key={item.id || i} />
          ))}
        </div>
      )}

      {!loading && projects.length > visibleItem && (
        <button
          onClick={handleLoadMore}
          className="button load-more button-flex"
        >
          Load More
          <i className="bx bx-down-arrow-alt button__icon" style={{ fontSize: "1.25rem" }}></i>
        </button>
      )}

      {!loading && projects.length <= visibleItem && projects.length > 0 && (
        <p className="load-after">
          That's all projects for now. Do well to{" "}
          <a href="#/" onClick={(e) => { e.preventDefault(); const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>contact me</a>
        </p>
      )}
    </div>
  );
};

export default PortfolioWork;
