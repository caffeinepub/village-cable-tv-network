import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Headphones,
  Shield,
  Tv,
  User,
  Users,
  Wifi,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useAnnouncements } from "../hooks/useQueries";

const featureCards = [
  {
    icon: Tv,
    title: "CHANNEL PACKAGES",
    desc: "Choose from Basic, Standard, or Premium packages. 50+ local and international channels curated for our community.",
    cta: "View Packages",
    to: "/packages",
    ocid: "home.packages_card",
  },
  {
    icon: Wifi,
    title: "BROADBAND INTERNET",
    desc: "Blazing-fast fiber broadband starting at 25 Mbps. Unlimited data plans available for heavy users.",
    cta: "See Plans",
    to: "/broadband",
    ocid: "home.broadband_card",
  },
  {
    icon: User,
    title: "SUBSCRIBER PORTAL",
    desc: "Manage your account, update your profile, and view your active subscriptions all in one place.",
    cta: "My Portal",
    to: "/portal",
    ocid: "home.portal_card",
  },
];

const whyItems = [
  {
    icon: Shield,
    title: "Local Service",
    desc: "Owned and operated right here in the village. We know our community.",
  },
  {
    icon: Zap,
    title: "Reliable Network",
    desc: "99.5% uptime guaranteed with redundant infrastructure and regular maintenance.",
  },
  {
    icon: Users,
    title: "Community Support",
    desc: "Dedicated local technicians ready to help. We're your neighbors.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Round-the-clock helpline for all your technical and billing queries.",
  },
];

function AnnouncementSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-2 w-full" />
      <CardContent className="p-5">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-5/6" />
      </CardContent>
    </Card>
  );
}

export function Home() {
  const { data: announcements, isLoading } = useAnnouncements();
  const latestAnnouncements = announcements?.slice(0, 3) ?? [];

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[560px] flex items-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-village.dim_1600x700.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-ocid="home.hero_section"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <Badge className="mb-4 bg-accent-blue/80 text-white border-0 text-xs tracking-wider">
              VILLAGE CABLE NETWORK
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
              Saikiran Cable TV Network
              <br />
              <span className="text-blue-300">
                TV, Internet &amp; Community.
              </span>
            </h1>
            <p className="text-blue-100 text-base sm:text-lg mb-8 leading-relaxed">
              Premium cable TV and high-speed broadband tailored for our
              village. Locally managed, community trusted.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/packages">
                <Button
                  className="bg-accent-blue hover:bg-accent-blue/90 text-white px-6 py-3 rounded-full font-semibold text-sm"
                  data-ocid="home.view_packages_button"
                >
                  VIEW PACKAGES <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/broadband">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-navy px-6 py-3 rounded-full font-semibold text-sm"
                  data-ocid="home.broadband_button"
                >
                  BROADBAND PLANS
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature cards row overlapping hero */}
      <section
        className="relative -mt-12 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"
        data-ocid="home.features_section"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              data-ocid={card.ocid}
            >
              <Card className="bg-white shadow-card rounded-xl overflow-hidden border-0 h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                    <card.icon className="w-6 h-6 text-accent-blue" />
                  </div>
                  <h3 className="font-bold text-navy text-sm tracking-wider mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
                    {card.desc}
                  </p>
                  <Link to={card.to}>
                    <Button
                      className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white rounded-full text-sm"
                      data-ocid={`${card.ocid}.button`}
                    >
                      {card.cta} <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white" data-ocid="home.why_section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-3">
              Why Choose Saikiran Cable TV?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              We're not just a provider — we're your neighbors. Here's what
              makes us different.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
                data-ocid={`home.why_item.${i + 1}`}
              >
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-accent-blue" />
                </div>
                <h3 className="font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section
        className="py-16 bg-secondary/40"
        data-ocid="home.announcements_section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-navy mb-3">
              Latest Community Updates
            </h2>
            <p className="text-gray-500">
              News and announcements from Saikiran Cable TV Network
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <AnnouncementSkeleton key={n} />
              ))}
            </div>
          ) : latestAnnouncements.length === 0 ? (
            <div
              className="text-center py-12 text-gray-400"
              data-ocid="home.announcements.empty_state"
            >
              <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No announcements yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestAnnouncements.map((ann, i) => (
                <motion.div
                  key={ann.id.toString()}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  data-ocid={`home.announcement.item.${i + 1}`}
                >
                  <Card className="bg-white border-0 shadow-card hover:shadow-lg transition-shadow h-full rounded-xl overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-navy to-accent-blue" />
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <CalendarDays className="w-4 h-4 text-accent-blue" />
                        <span className="text-xs text-gray-400">
                          {new Date(
                            Number(ann.createdAt) / 1_000_000,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-navy mb-2">{ann.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                        {ann.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
