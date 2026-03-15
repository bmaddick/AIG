import Image from "next/image";

interface ArticleCard {
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
  imageAlt: string;
}

const featuredArticles: ArticleCard[] = [
  {
    category: "Creation",
    title: "The Fossil Record: What Does It Really Show?",
    excerpt: "A comprehensive look at what the fossil record actually demonstrates about the history of life on earth.",
    author: "Dr. Andrew Snelling",
    date: "March 13, 2026",
    imageUrl: "https://images.unsplash.com/photo-1565793141104-0ef675e5162d?w=600&q=80&fit=crop",
    imageAlt: "Dinosaur skeleton fossil display",
  },
  {
    category: "Bible",
    title: "Why Biblical Authority Matters for the Church Today",
    excerpt: "Understanding why the foundation of Scripture is essential for every believer and every church.",
    author: "Ken Ham",
    date: "March 12, 2026",
    imageUrl: "https://images.unsplash.com/photo-1593485589800-579b43749b15?w=600&q=80&fit=crop",
    imageAlt: "Open Bible on a field",
  },
  {
    category: "Science",
    title: "Genetics and the Human Family: One Race",
    excerpt: "How genetics confirms the biblical teaching that all humans are descended from one couple.",
    author: "Dr. Nathaniel Jeanson",
    date: "March 11, 2026",
    imageUrl: "https://images.unsplash.com/photo-1530473744149-142a02a2d565?w=600&q=80&fit=crop",
    imageAlt: "Geological rock formations",
  },
  {
    category: "Culture",
    title: "Responding to the Rise of Secularism",
    excerpt: "Practical ways Christians can stand firm in an increasingly secular culture while sharing truth.",
    author: "Avery Foley",
    date: "March 10, 2026",
    imageUrl: "https://images.unsplash.com/photo-1753714912908-502e58a83de2?w=600&q=80&fit=crop",
    imageAlt: "Milky Way over dark mountain landscape",
  },
  {
    category: "Morality",
    title: "The Foundation of Right and Wrong",
    excerpt: "Without a biblical foundation, morality becomes subjective and relative. Here is why it matters.",
    author: "Dr. Georgia Purdom",
    date: "March 9, 2026",
    imageUrl: "https://images.unsplash.com/photo-1593485589800-579b43749b15?w=600&q=80&fit=crop&crop=top",
    imageAlt: "Open Bible",
  },
  {
    category: "History",
    title: "Evidence for the Global Flood of Noah",
    excerpt: "Examining geological and historical evidence that points to a worldwide flood as described in Genesis.",
    author: "Dr. Tim Clarey",
    date: "March 8, 2026",
    imageUrl: "https://images.unsplash.com/photo-1530473744149-142a02a2d565?w=600&q=80&fit=crop&crop=bottom",
    imageAlt: "Basalt rock columns",
  },
];

function ArticleCardComponent({ article }: { article: ArticleCard }) {
  return (
    <a href="#" className="group block bg-white rounded-lg shadow-sm border border-aig-border overflow-hidden hover:shadow-md transition-shadow">
      {/* Article Image */}
      <div className="relative aspect-video">
        <Image
          src={article.imageUrl}
          alt={article.imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      {/* Content */}
      <div className="p-4">
        <span className="text-xs font-bold uppercase tracking-wider text-aig-cyan">
          {article.category}
        </span>
        <h3 className="mt-2 text-lg font-bold text-aig-dark leading-snug group-hover:text-aig-teal transition-colors">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-aig-gray leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-aig-gray/70">
          <span className="font-medium">{article.author}</span>
          <span>&middot;</span>
          <span>{article.date}</span>
        </div>
      </div>
    </a>
  );
}

export default function ContentGrid() {
  return (
    <section className="bg-aig-light-gray py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-aig-dark">Latest Articles</h2>
          <a href="#" className="text-sm font-medium text-aig-cyan hover:underline">
            View All &rarr;
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <ArticleCardComponent key={article.title} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
