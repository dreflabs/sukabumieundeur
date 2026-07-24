import HeroSection from "@/components/home/HeroSection";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import ArtistsAndNews from "@/components/home/ArtistsAndNews";
import CommunityStats from "@/components/home/CommunityStats";
import TicketCTA from "@/components/home/TicketCTA";
import { getLatestNews } from "@/lib/services/newsService";
import { DEFAULT_NEWS_COVER } from "@/lib/constants";

export default async function Home() {
  const latestNews = await getLatestNews(3);

  const newsItems = latestNews.map((article) => {
    const d = new Date(article.published_at);
    return {
      id: article.slug,
      title: article.title,
      date: `${d.getDate()} ${d.toLocaleString('id-ID', { month: 'short' }).toUpperCase()} ${d.getFullYear()}`,
      image: article.cover_image || DEFAULT_NEWS_COVER,
    }
  });

  return (
    <div className="w-full relative bg-black flex flex-col">
      <HeroSection />
      <UpcomingEvents />
      <ArtistsAndNews newsItems={newsItems} />
      <CommunityStats />
      <TicketCTA />
    </div>
  );
}
