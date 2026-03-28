import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Star, Tv } from "lucide-react";
import { motion } from "motion/react";
import { useChannelPackages } from "../hooks/useQueries";

const tierColors: Record<string, string> = {
  Basic: "bg-gray-100 text-gray-700",
  Standard: "bg-blue-100 text-accent-blue",
  Premium: "bg-navy/10 text-navy",
};

const tierBorder: Record<string, string> = {
  Basic: "border-gray-200",
  Standard: "border-accent-blue/30",
  Premium: "border-navy/30",
};

export function Packages() {
  const { data: packages, isLoading } = useChannelPackages();

  return (
    <div>
      {/* Page header */}
      <div className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Tv className="w-10 h-10 mx-auto mb-3 text-blue-300" />
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
            Channel Packages
          </h1>
          <p className="text-blue-200 max-w-xl mx-auto">
            Choose the perfect TV package for your home. All packages include
            local community channels.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="rounded-xl border-0 shadow-card">
                <CardContent className="p-6">
                  <Skeleton className="h-5 w-1/2 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-8 w-1/3 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : packages?.length === 0 ? (
          <div
            className="text-center py-20 text-gray-400"
            data-ocid="packages.empty_state"
          >
            <Tv className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">
              No channel packages available at the moment.
            </p>
            <p className="text-sm mt-1">
              Please check back soon or contact us.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="packages.list"
          >
            {packages?.map((pkg, i) => (
              <motion.div
                key={pkg.id.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                data-ocid={`packages.item.${i + 1}`}
              >
                <Card
                  className={`rounded-xl shadow-card border ${tierBorder[pkg.tier] ?? "border-gray-200"} h-full flex flex-col hover:shadow-lg transition-shadow`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-navy font-bold text-lg">
                        {pkg.name}
                      </CardTitle>
                      <Badge
                        className={`${tierColors[pkg.tier] ?? "bg-gray-100 text-gray-700"} shrink-0 font-semibold`}
                      >
                        {pkg.tier === "Premium" && (
                          <Star className="w-3 h-3 mr-1" />
                        )}
                        {pkg.tier}
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mt-1">
                      {pkg.description}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="mb-4">
                      <span className="text-3xl font-extrabold text-navy">
                        ${pkg.priceMonthly.toFixed(2)}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">/month</span>
                    </div>

                    <div className="flex-1 mb-5">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Included Channels
                      </p>
                      <ul className="space-y-1">
                        {pkg.channels.slice(0, 8).map((ch) => (
                          <li
                            key={ch}
                            className="flex items-center gap-2 text-sm text-gray-600"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent-blue shrink-0" />
                            {ch}
                          </li>
                        ))}
                        {pkg.channels.length > 8 && (
                          <li className="text-xs text-accent-blue font-medium">
                            +{pkg.channels.length - 8} more channels
                          </li>
                        )}
                      </ul>
                    </div>

                    <Link to="/portal">
                      <Button
                        className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white rounded-full"
                        data-ocid={`packages.subscribe_button.${i + 1}`}
                      >
                        Subscribe Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
