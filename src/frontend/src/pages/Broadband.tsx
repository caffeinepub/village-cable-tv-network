import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Infinity as InfinityIcon,
  Wifi,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useBroadbandPlans } from "../hooks/useQueries";

const planFeatures = [
  "No installation fees",
  "Free router included",
  "Local technical support",
  "Cancel anytime",
];

export function Broadband() {
  const { data: plans, isLoading } = useBroadbandPlans();

  return (
    <div>
      {/* Page header */}
      <div className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Wifi className="w-10 h-10 mx-auto mb-3 text-blue-300" />
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
            Broadband Internet Plans
          </h1>
          <p className="text-blue-200 max-w-xl mx-auto">
            Fast, reliable internet for every household. Choose the speed that
            suits your needs.
          </p>
        </div>
      </div>

      {/* Banner features */}
      <div className="bg-secondary/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-6">
            {planFeatures.map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <CheckCircle2 className="w-4 h-4 text-accent-blue" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="rounded-xl border-0 shadow-card">
                <CardContent className="p-6">
                  <Skeleton className="h-5 w-1/2 mb-3" />
                  <Skeleton className="h-10 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : plans?.length === 0 ? (
          <div
            className="text-center py-20 text-gray-400"
            data-ocid="broadband.empty_state"
          >
            <Wifi className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">
              No broadband plans available at the moment.
            </p>
            <p className="text-sm mt-1">
              Please check back soon or contact us.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="broadband.list"
          >
            {plans?.map((plan, i) => (
              <motion.div
                key={plan.id.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                data-ocid={`broadband.item.${i + 1}`}
              >
                <Card className="rounded-xl shadow-card border border-border h-full flex flex-col hover:shadow-lg transition-shadow hover:border-accent-blue/40">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-navy font-bold text-lg">
                        {plan.name}
                      </CardTitle>
                      {plan.isUnlimited && (
                        <Badge className="bg-accent-blue text-white border-0 shrink-0">
                          <InfinityIcon className="w-3 h-3 mr-1" /> Unlimited
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {/* Speed display */}
                    <div className="bg-secondary/60 rounded-xl p-4 mb-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Zap className="w-5 h-5 text-accent-blue" />
                        <span className="text-4xl font-extrabold text-navy">
                          {plan.speedMbps.toString()}
                        </span>
                        <span className="text-gray-400 text-sm">Mbps</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Download Speed
                      </p>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
                      {plan.description}
                    </p>

                    <div className="mb-5">
                      <span className="text-3xl font-extrabold text-navy">
                        ${plan.priceMonthly.toFixed(2)}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">/month</span>
                    </div>

                    <Link to="/portal">
                      <Button
                        className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white rounded-full"
                        data-ocid={`broadband.subscribe_button.${i + 1}`}
                      >
                        Get This Plan
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
