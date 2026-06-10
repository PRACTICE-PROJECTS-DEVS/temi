import Quiz from "../../assets/Quiz.jpg";
import Amethyst from "../../assets/ameth.png";
import CAS from "../../assets/casss.png";
import Vote from "../../assets/cas.png";
import MovieApp from "../../assets/movie.png";
import GPT3 from "../../assets/gpt.png";
import Admin from "../../assets/dboard.png";
import Dragger from "../../assets/dragger.png";
import GEM from "../../assets/gem.png";
import Tracechain from "../../assets/tracechain.png";
import itask from "../../assets/itask.png";

const defaultImages = {
  tracechain: Tracechain,
  itask: itask,
  amethyst: Amethyst,
  movie: MovieApp,
  quiz: Quiz,
  admin: Admin,
  dragger: Dragger,
  gpt3: GPT3,
  vote: Vote,
  cas: CAS,
  gem: GEM
};

const getProjectImage = (imgKey) => {
  if (!imgKey) return "";
  if (imgKey.startsWith('http') || imgKey.startsWith('/uploads/') || imgKey.startsWith('data:')) {
    return imgKey;
  }
  return defaultImages[imgKey.toLowerCase()] || imgKey;
};

const projectsDataNav = [
  {
    name: "All",
  },
  {
    name: "React JS",
  },
  {
    name: "Vue JS",
  },
  {
    name: "PHP",
  }
];

// Fallback in case API is loading or fails
const fallbackProjects = [
  {
    id: "1",
    image: "tracechain",
    title: "Farm Supply Chain Application",
    desc: "A supply chain application built with typescript, styled with tailwind css and the UI was built with shadCN",
    url: "https://tracechain-ivory.vercel.app/",
    code: "https://github.com/Themydee/itask",
    category: "React JS",
  },
  {
    id: "2",
    image: "itask",
    title: "Task Application Platform",
    desc: "A task application built with typescript, styled with tailwind css and the UI was built with shadCN",
    url: "https://itask.brimble.app",
    code: "https://github.com/Themydee/itask",
    category: "React JS",
  }
];

export { projectsDataNav, getProjectImage, fallbackProjects };
